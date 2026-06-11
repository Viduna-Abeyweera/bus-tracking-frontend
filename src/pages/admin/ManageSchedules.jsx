import { useState, useEffect } from 'react';
import { schedulesAPI, routesAPI, busesAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AdminManage.css';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

function ManageSchedules() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ busId: '', departureTime: '', dayOfWeek: 'MONDAY' });

  useEffect(() => {
    Promise.all([routesAPI.getAll(), busesAPI.getAll()])
      .then(([r, b]) => { setRoutes(r.data); setBuses(b.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      schedulesAPI.getByRouteAndDay(selectedRoute, selectedDay)
        .then((res) => setSchedules(res.data))
        .catch(() => setSchedules([]));
    }
  }, [selectedRoute, selectedDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schedulesAPI.create({
        routeId: parseInt(selectedRoute),
        busId: parseInt(form.busId),
        departureTime: form.departureTime,
        dayOfWeek: form.dayOfWeek,
      });
      toast.success('Schedule added');
      setShowForm(false);
      // Refresh
      const res = await schedulesAPI.getByRouteAndDay(selectedRoute, selectedDay);
      setSchedules(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add schedule');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      await schedulesAPI.delete(id);
      toast.success('Schedule deleted');
      const res = await schedulesAPI.getByRouteAndDay(selectedRoute, selectedDay);
      setSchedules(res.data);
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
        <h1>Manage Schedules</h1>
      </div>

      <div className="schedule-filters" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="form-group">
          <label className="form-label">Route</label>
          <select className="form-select" value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
            <option value="">Select a route</option>
            {routes.map((r) => <option key={r.id} value={r.id}>Route {r.routeNumber} — {r.name}</option>)}
          </select>
        </div>
        {selectedRoute && (
          <>
            <div className="form-group">
              <label className="form-label">Day</label>
              <div className="day-selector">
                {DAYS.map((d) => (
                  <button key={d} className={`day-btn ${selectedDay === d ? 'active' : ''}`} onClick={() => setSelectedDay(d)}>
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <FiPlus /> Add Schedule
            </button>
          </>
        )}
      </div>

      {showForm && selectedRoute && (
        <form className="admin-form glass-card animate-fade-in" onSubmit={handleSubmit}>
          <h3>Add Schedule</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Bus *</label>
              <select className="form-select" value={form.busId} onChange={(e) => setForm({...form, busId: e.target.value})} required>
                <option value="">Select bus</option>
                {buses.filter(b => String(b.routeId) === selectedRoute).map((b) => (
                  <option key={b.id} value={b.id}>{b.registrationNumber}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Departure Time *</label>
              <input className="form-input" type="time" value={form.departureTime} onChange={(e) => setForm({...form, departureTime: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Day *</label>
              <select className="form-select" value={form.dayOfWeek} onChange={(e) => setForm({...form, dayOfWeek: e.target.value})}>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {selectedRoute && (
        <div className="data-table glass-card">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Bus</th>
                <th>Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No schedules</td></tr>
              ) : (
                schedules.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.departureTime}</strong></td>
                    <td>{s.busRegistration || '—'}</td>
                    <td>{s.dayOfWeek}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageSchedules;
