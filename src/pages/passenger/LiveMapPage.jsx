import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import wsService from '../../services/websocket';
import { locationsAPI, stopsAPI, routesAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiClock, FiNavigation } from 'react-icons/fi';
import { timeAgo } from '../../utils/timeAgo';
import './LiveMapPage.css';

// Bus icon factory
const createBusIcon = (regNum, status) => {
  const color = status === 'ACTIVE' ? '#00D4AA' : status === 'IDLE' ? '#FFB86C' : '#FF6B6B';
  return L.divIcon({
    html: `<div class="bus-marker">
             <span class="bus-icon">🚌</span>
             <span class="bus-label" style="background:${color}">${regNum || '?'}</span>
           </div>`,
    className: 'custom-bus-icon',
    iconSize: [80, 40],
    iconAnchor: [40, 40],
    popupAnchor: [0, -35],
  });
};

const createStopIcon = (name) => L.divIcon({
  html: `<div class="stop-marker">
           <span class="stop-icon">🚏</span>
           <span class="stop-label">${name}</span>
         </div>`,
  className: 'custom-stop-icon',
  iconSize: [80, 40],
  iconAnchor: [40, 40],
  popupAnchor: [0, -35],
});

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [50, 50], maxZoom: 13 });
    }
  }, [positions, map]);
  return null;
}

function LiveMapPage() {
  const { token } = useAuth();
  const [busLocations, setBusLocations] = useState([]);
  const [busStops, setBusStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedStop, setSelectedStop] = useState(null);
  const [etaData, setEtaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, stopsRes, routesRes] = await Promise.all([
          locationsAPI.getLatest(),
          stopsAPI.getAll(),
          routesAPI.getAll(),
        ]);
        setBusLocations(locRes.data);
        setBusStops(stopsRes.data);
        setRoutes(routesRes.data);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // WebSocket subscription for live updates
  useEffect(() => {
    if (!token) return;
    
    wsService.connect(token);
    
    const checkConnection = setInterval(() => {
      setWsConnected(wsService.isConnected());
    }, 1000);

    // Subscribe to all bus locations
    wsService.subscribe('/topic/bus-locations', (message) => {
      setWsConnected(true);
      setBusLocations((prev) => {
        const existing = prev.findIndex((b) => b.busId === message.busId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], ...message };
          return updated;
        }
        return [...prev, message];
      });
    });

    return () => {
      clearInterval(checkConnection);
      wsService.unsubscribe('/topic/bus-locations');
    };
  }, [token]);

  // Fetch ETA when stop is selected
  useEffect(() => {
    if (selectedStop) {
      stopsAPI.getETA(selectedStop.id)
        .then((res) => setEtaData(res.data))
        .catch(() => setEtaData([]));
    } else {
      setEtaData([]);
    }
  }, [selectedStop]);

  // Filtered locations by route
  const filteredLocations = selectedRoute
    ? busLocations.filter((b) => String(b.routeId) === selectedRoute)
    : busLocations;

  // Map bounds
  const allPositions = [
    ...filteredLocations.map((b) => [b.latitude, b.longitude]),
    ...busStops.map((s) => [s.latitude, s.longitude]),
  ].filter((p) => p[0] && p[1]);

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading map data..." /></div>;

  return (
    <div className="live-map-page">
      {/* Controls Bar */}
      <div className="map-controls">
        <div className="control-group">
          <select
            className="form-select"
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
          >
            <option value="">All Routes</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                Route {r.routeNumber} — {r.name}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={selectedStop?.id || ''}
            onChange={(e) => {
              const stop = busStops.find((s) => s.id === parseInt(e.target.value));
              setSelectedStop(stop || null);
            }}
          >
            <option value="">Select stop for ETA</option>
            {busStops.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="map-status">
          <span className={`ws-indicator ${wsConnected ? 'connected' : ''}`}>
            <span className={wsConnected ? 'live-dot' : ''}></span>
            {wsConnected ? 'Live' : 'Connecting...'}
          </span>
          <span className="bus-count">{filteredLocations.length} bus(es)</span>
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapContainer
          center={[7.0, 80.0]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {allPositions.length > 0 && <FitBounds positions={allPositions} />}

          {filteredLocations.map((loc) => (
            <Marker
              key={`bus-${loc.busId || loc.id}`}
              position={[loc.latitude, loc.longitude]}
              icon={createBusIcon(loc.registrationNumber || loc.busId)}
            >
              <Popup>
                <strong>🚌 {loc.registrationNumber || loc.busId}</strong><br />
                {loc.routeNumber && <>Route: {loc.routeNumber}<br /></>}
                Lat: {loc.latitude?.toFixed(6)}<br />
                Lng: {loc.longitude?.toFixed(6)}<br />
                {loc.speed && <>Speed: {loc.speed} km/h<br /></>}
                Updated: {loc.timestamp ? timeAgo(loc.timestamp) : 'Now'}
              </Popup>
            </Marker>
          ))}

          {busStops.map((stop) => (
            <Marker
              key={`stop-${stop.id}`}
              position={[stop.latitude, stop.longitude]}
              icon={createStopIcon(stop.name)}
              eventHandlers={{
                click: () => setSelectedStop(stop),
              }}
            >
              <Popup>
                <strong>🚏 {stop.name}</strong><br />
                Lat: {stop.latitude?.toFixed(6)}<br />
                Lng: {stop.longitude?.toFixed(6)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ETA Panel */}
      {selectedStop && (
        <div className="eta-panel glass-card animate-fade-in">
          <div className="eta-header">
            <h3>
              <FiClock /> ETA to {selectedStop.name}
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedStop(null)}>
              Clear
            </button>
          </div>
          {etaData.length > 0 ? (
            <div className="eta-list">
              {etaData.map((eta, idx) => (
                <div key={idx} className="eta-item">
                  <div className="eta-bus">
                    <FiNavigation />
                    <span>{eta.busId}</span>
                  </div>
                  <div className="eta-time">
                    <span className="eta-minutes">{eta.estimatedMinutes}</span>
                    <span className="eta-label">min</span>
                  </div>
                  <span className="eta-distance">{eta.distanceKm?.toFixed(1)} km</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="eta-empty">No buses currently heading to this stop</p>
          )}
        </div>
      )}
    </div>
  );
}

export default LiveMapPage;
