import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LiveMapPage from './pages/passenger/LiveMapPage';
import RoutesPage from './pages/passenger/RoutesPage';
import SchedulePage from './pages/passenger/SchedulePage';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageBuses from './pages/admin/ManageBuses';
import ManageSchedules from './pages/admin/ManageSchedules';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A2E',
              color: '#EAEAEA',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Passenger (authenticated) */}
          <Route path="/map" element={
            <ProtectedRoute><LiveMapPage /></ProtectedRoute>
          } />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/schedules" element={
            <ProtectedRoute><SchedulePage /></ProtectedRoute>
          } />

          {/* Driver */}
          <Route path="/driver" element={
            <ProtectedRoute roles={['DRIVER', 'ADMIN']}>
              <DriverDashboard />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/routes" element={
            <ProtectedRoute roles={['ADMIN']}>
              <ManageRoutes />
            </ProtectedRoute>
          } />
          <Route path="/admin/buses" element={
            <ProtectedRoute roles={['ADMIN']}>
              <ManageBuses />
            </ProtectedRoute>
          } />
          <Route path="/admin/schedules" element={
            <ProtectedRoute roles={['ADMIN']}>
              <ManageSchedules />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;