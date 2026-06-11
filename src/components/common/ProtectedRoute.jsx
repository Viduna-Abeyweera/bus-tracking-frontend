import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard component.
 * Redirects to login if not authenticated.
 * Optionally checks for specific roles.
 * 
 * Usage:
 *   <Route path="/admin" element={
 *     <ProtectedRoute roles={['ADMIN']}>
 *       <AdminPage />
 *     </ProtectedRoute>
 *   } />
 */
function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '200px' }}>
        <div className="animate-pulse" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
