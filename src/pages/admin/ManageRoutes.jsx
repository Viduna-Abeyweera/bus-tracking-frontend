import { useState, useEffect } from 'react';
import { routesAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AdminManage.css';

function ManageRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form, setForm] = useState({
    routeNumber: '', name: '', origin: '', destination: '',
    distanceKm: '', estimatedDurationMinutes: '', active: true
  });

  const fetchRoutes = () => {
    routesAPI.getAll()
      .then((res) => setRoutes(res.data))
      .catch(() => toast.error('Failed to load routes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRoutes(); }, []);

  const resetForm = () => {
    setForm({ routeNumber: '', name: '', origin: '', destination: '', distanceKm: '', estimatedDurationMinutes: '', active: true });
    setEditingRoute(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await routesAPI.update(editingRoute.id, form);
        toast.success('Route updated');
      } else {
        await routesAPI.create(form);
        toast.success('Route created');
      }
      resetForm();
      fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save route');
    }
  };

  const handleEdit = (route) => {
    setForm({
      routeNumber: route.routeNumber, name: route.name,
      origin: route.origin, destination: route.destination,
      distanceKm: route.distanceKm || '', estimatedDurationMinutes: route.estimatedDurationMinutes || '',
      active: route.active !== false,
    });
    setEditingRoute(route);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this route?')) return;
    try {
      await routesAPI.delete(id);
      toast.success('Route deleted');
      fetchRoutes();
    } catch (err) {
      toast.error('Failed to delete route');
    }
  };

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
        <h1>Manage Routes</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          <FiPlus /> Add Route
        </button>
      </div>

      {showForm && (
        <form className="admin-form glass-card animate-fade-in" onSubmit={handleSubmit}>
          <h3>{editingRoute ? 'Edit Route' : 'New Route'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Route Number *</label>
              <input className="form-input" value={form.routeNumber} onChange={(e) => setForm({...form, routeNumber: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Route Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Origin *</label>
              <input className="form-input" value={form.origin} onChange={(e) => setForm({...form, origin: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Destination *</label>
              <input className="form-input" value={form.destination} onChange={(e) => setForm({...form, destination: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Distance (km)</label>
              <input className="form-input" type="number" step="0.1" value={form.distanceKm} onChange={(e) => setForm({...form, distanceKm: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input className="form-input" type="number" value={form.estimatedDurationMinutes} onChange={(e) => setForm({...form, estimatedDurationMinutes: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingRoute ? 'Update' : 'Create'}</button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="data-table glass-card">
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Name</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Distance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id}>
                <td><strong>{route.routeNumber}</strong></td>
                <td>{route.name}</td>
                <td>{route.origin}</td>
                <td>{route.destination}</td>
                <td>{route.distanceKm ? `${route.distanceKm} km` : '—'}</td>
                <td><span className={`badge ${route.active !== false ? 'badge-success' : 'badge-danger'}`}>{route.active !== false ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(route)}><FiEdit2 /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(route.id)}><FiTrash2 /></button>
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

export default ManageRoutes;
