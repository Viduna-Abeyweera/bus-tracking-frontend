import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import wsService from '../../services/websocket';
import { locationsAPI, busesAPI } from '../../services/api';
import { FiNavigation, FiSquare, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './DriverDashboard.css';

function DriverDashboard() {
  const { user, token } = useAuth();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [tracking, setTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    busesAPI.getAll()
      .then((res) => setBuses(res.data))
      .catch((err) => console.error('Failed to fetch buses:', err));
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, speed } = position.coords;
        try {
          // Send via REST API (which also broadcasts via WebSocket)
          await locationsAPI.save({
            busId: selectedBus,
            latitude,
            longitude,
          });
          setLastLocation({ latitude, longitude, speed });
          setUpdateCount((prev) => prev + 1);
        } catch (err) {
          toast.error('Failed to share location');
        }
      },
      (error) => {
        toast.error('Could not get GPS location: ' + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  const startTracking = () => {
    if (!selectedBus) {
      toast.error('Please select a bus');
      return;
    }
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    setTracking(true);
    setUpdateCount(0);
    toast.success('Tracking started! 📡');
    sendLocation();
    intervalRef.current = setInterval(sendLocation, 5000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTracking(false);
    toast('Tracking stopped', { icon: '⏹️' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🚌 Driver Dashboard</h1>
        <p>Welcome, {user?.name}. Share your live location with passengers.</p>
      </div>

      <div className="driver-grid">
        {/* Control Panel */}
        <div className="driver-control glass-card">
          <h3>GPS Tracking</h3>

          <div className="form-group">
            <label className="form-label">Select Your Bus</label>
            <select
              className="form-select"
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              disabled={tracking}
            >
              <option value="">-- Choose your bus --</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.registrationNumber}>
                  {bus.registrationNumber} — Route {bus.routeNumber || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          {!tracking ? (
            <button className="btn btn-accent btn-lg driver-action-btn" onClick={startTracking}>
              <FiNavigation /> Start Sharing Location
            </button>
          ) : (
            <button className="btn btn-danger btn-lg driver-action-btn" onClick={stopTracking}>
              <FiSquare /> Stop Sharing
            </button>
          )}
        </div>

        {/* Live Stats */}
        <div className="driver-stats glass-card">
          <h3><FiActivity /> Tracking Stats</h3>

          <div className="stat-grid">
            <div className="driver-stat">
              <span className="stat-number">{updateCount}</span>
              <span className="stat-desc">Updates Sent</span>
            </div>
            <div className="driver-stat">
              <span className="stat-number">{selectedBus || '—'}</span>
              <span className="stat-desc">Bus ID</span>
            </div>
            <div className="driver-stat">
              <span className="stat-number">
                {lastLocation ? lastLocation.latitude.toFixed(4) : '—'}
              </span>
              <span className="stat-desc">Latitude</span>
            </div>
            <div className="driver-stat">
              <span className="stat-number">
                {lastLocation ? lastLocation.longitude.toFixed(4) : '—'}
              </span>
              <span className="stat-desc">Longitude</span>
            </div>
          </div>

          {tracking && (
            <div className="live-indicator-bar">
              <span className="live-dot"></span>
              <span>LIVE — Updating every 5 seconds</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
