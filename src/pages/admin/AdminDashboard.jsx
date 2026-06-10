import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routesAPI, busesAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiMap, FiTruck, FiUsers, FiActivity, FiPlus, FiArrowRight } from 'react-icons/fi';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({ routes: 0, buses: 0, activeBuses: 0 });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesRes, busesRes] = await Promise.all([
          routesAPI.getAll(),
          busesAPI.getAll(),
        ]);
        const busesList = busesRes.data;
        setBuses(busesList);
        setStats({
          routes: routesRes.data.length,
          buses: busesList.length,
          activeBuses: busesList.filter((b) => b.status === 'ACTIVE').length,
        });
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage routes, buses, schedules, and users</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats grid grid-4">
        <div className="stats-card glass-card">
          <div className="stats-icon" style={{ background: 'rgba(108, 99, 255, 0.15)' }}>
            <FiMap style={{ color: 'var(--primary-light)' }} />
          </div>
          <div className="stats-info">
            <span className="stats-value">{stats.routes}</span>
            <span className="stats-label">Total Routes</span>
          </div>
        </div>

        <div className="stats-card glass-card">
          <div className="stats-icon" style={{ background: 'rgba(0, 212, 170, 0.15)' }}>
            <FiTruck style={{ color: 'var(--accent)' }} />
          </div>
          <div className="stats-info">
            <span className="stats-value">{stats.buses}</span>
            <span className="stats-label">Total Buses</span>
          </div>
        </div>

        <div className="stats-card glass-card">
          <div className="stats-icon" style={{ background: 'rgba(0, 212, 170, 0.15)' }}>
            <FiActivity style={{ color: 'var(--success)' }} />
          </div>
          <div className="stats-info">
            <span className="stats-value">{stats.activeBuses}</span>
            <span className="stats-label">Active Buses</span>
          </div>
        </div>

        <div className="stats-card glass-card">
          <div className="stats-icon" style={{ background: 'rgba(255, 184, 108, 0.15)' }}>
            <FiUsers style={{ color: 'var(--warning)' }} />
          </div>
          <div className="stats-info">
            <span className="stats-value">—</span>
            <span className="stats-label">Users</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions grid grid-3">
          <Link to="/admin/routes" className="action-card glass-card">
            <FiMap />
            <h3>Manage Routes</h3>
            <p>View, create, and edit bus routes</p>
            <span className="action-link">Go <FiArrowRight /></span>
          </Link>
          <Link to="/admin/buses" className="action-card glass-card">
            <FiTruck />
            <h3>Manage Buses</h3>
            <p>Register buses and assign drivers</p>
            <span className="action-link">Go <FiArrowRight /></span>
          </Link>
          <Link to="/admin/schedules" className="action-card glass-card">
            <FiActivity />
            <h3>Manage Schedules</h3>
            <p>Set departure times for routes</p>
            <span className="action-link">Go <FiArrowRight /></span>
          </Link>
        </div>
      </div>

      {/* Bus Fleet Overview */}
      <div className="admin-section">
        <h2>Bus Fleet</h2>
        <div className="fleet-table glass-card">
          <table>
            <thead>
              <tr>
                <th>Registration</th>
                <th>Route</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {buses.slice(0, 10).map((bus) => (
                <tr key={bus.id}>
                  <td><strong>{bus.registrationNumber}</strong></td>
                  <td>{bus.routeNumber ? `Route ${bus.routeNumber}` : '—'}</td>
                  <td>{bus.driverName || '—'}</td>
                  <td>
                    <span className={`badge badge-${bus.status === 'ACTIVE' ? 'success' : bus.status === 'IDLE' ? 'warning' : 'danger'}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td>{bus.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {buses.length > 10 && (
            <div className="table-footer">
              <Link to="/admin/buses" className="btn btn-outline btn-sm">
                View all {buses.length} buses <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
