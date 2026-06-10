import { useState, useEffect } from 'react';
import { busesAPI, routesAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AdminManage.css';

function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [form, setForm] = useState({
    registrationNumber: '', routeId: '', capacity: 50, driverId: ''
  });

  const fetchData = async () => {
    try {
      const [busesRes, routesRes] = await Promise.all([busesAPI.getAll(), routesAPI.getAll()]);
      setBuses(busesRes.data);
      setRoutes(routesRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ registrationNumber: '', routeId: '', capacity: 50, driverId: '' });
    setEditingBus(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, routeId: parseInt(form.routeId), capacity: parseInt(form.capacity) };
      if (form.driverId) data.driverId = parseInt(form.driverId);
      else delete data.driverId;

      if (editingBus) {
        await busesAPI.update(editingBus.id, data);
        toast.success('Bus updated');
      } else {
        await busesAPI.create(data);
        toast.success('Bus registered');
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bus');
    }
  };

  const handleEdit = (bus) => {
    setForm({
      registrationNumber: bus.registrationNumber,
      routeId: bus.routeId || '',
      capacity: bus.capacity || 50,
      driverId: bus.driverId || '',
    });
    setEditingBus(bus);
    setShowForm(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await busesAPI.updateStatus(id, status);
      toast.success(`Bus status changed to ${status}`);
      fetchData();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this bus?')) return;
    try {
      await busesAPI.delete(id);
      toast.success('Bus deleted');
      fetchData();
    } catch { toast.error('Failed to delete bus'); }
  };

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
        <h1>Manage Buses</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          <FiPlus /> Register Bus
        </button>
      </div>

      {showForm && (
        <form className="admin-form glass-card animate-fade-in" onSubmit={handleSubmit}>
          <h3>{editingBus ? 'Edit Bus' : 'Register New Bus'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Registration Number *</label>
              <input className="form-input" placeholder="e.g., NB-1234" value={form.registrationNumber} onChange={(e) => setForm({...form, registrationNumber: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Route *</label>
              <select className="form-select" value={form.routeId} onChange={(e) => setForm({...form, routeId: e.target.value})} required>
                <option value="">Select route</option>
                {routes.map((r) => <option key={r.id} value={r.id}>Route {r.routeNumber} — {r.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input className="form-input" type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Driver ID</label>
              <input className="form-input" type="number" placeholder="Optional" value={form.driverId} onChange={(e) => setForm({...form, driverId: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingBus ? 'Update' : 'Register'}</button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="data-table glass-card">
        <table>
          <thead>
            <tr>
              <th>Registration</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td><strong>{bus.registrationNumber}</strong></td>
                <td>{bus.routeNumber ? `Route ${bus.routeNumber}` : '—'}</td>
                <td>{bus.driverName || '—'}</td>
                <td>
                  <select
                    className="status-select"
                    value={bus.status}
                    onChange={(e) => handleStatusChange(bus.id, e.target.value)}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="IDLE">Idle</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </td>
                <td>{bus.capacity}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(bus)}><FiEdit2 /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bus.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageBuses;
