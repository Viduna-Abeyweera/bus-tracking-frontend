import { useState, useEffect } from 'react';
import { routesAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiSearch, FiMapPin, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './RoutesPage.css';

function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    routesAPI.getAll()
      .then((res) => setRoutes(res.data))
      .catch((err) => console.error('Failed to fetch routes:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRoutes = routes.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.routeNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.origin?.toLowerCase().includes(search.toLowerCase()) ||
    r.destination?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading routes..." /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🗺️ Routes</h1>
        <p>Browse all Sri Lankan bus routes and their stops</p>
      </div>

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search routes by name, number, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="routes-list">
        {filteredRoutes.length === 0 ? (
          <div className="empty-state glass-card">
            <p>No routes found matching "{search}"</p>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <div key={route.id} className="route-card glass-card">
              <div
                className="route-card-header"
                onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
              >
                <div className="route-card-left">
                  <div className="route-badge">{route.routeNumber}</div>
                  <div className="route-details">
                    <h3>{route.name}</h3>
                    <div className="route-meta">
                      <span><FiMapPin /> {route.origin} → {route.destination}</span>
                      {route.distanceKm && <span>• {route.distanceKm} km</span>}
                      {route.estimatedDurationMinutes && <span>• ~{route.estimatedDurationMinutes} min</span>}
                    </div>
                  </div>
                </div>
                <div className="route-card-right">
                  <span className={`badge ${route.active !== false ? 'badge-success' : 'badge-danger'}`}>
                    {route.active !== false ? 'Active' : 'Inactive'}
                  </span>
                  {expandedRoute === route.id ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>

              {expandedRoute === route.id && route.stops && (
                <div className="route-stops-list animate-fade-in">
                  <h4>Stops ({route.stops.length})</h4>
                  <div className="stops-timeline">
                    {route.stops
                      .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
                      .map((stop, idx) => (
                        <div key={stop.id || idx} className="stop-item">
                          <div className="stop-dot"></div>
                          <div className="stop-info">
                            <span className="stop-name">{stop.stopName || stop.name}</span>
                            {stop.distanceFromStartKm != null && (
                              <span className="stop-dist">{stop.distanceFromStartKm} km from start</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RoutesPage;
