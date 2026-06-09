import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiMap, FiSearch, FiCalendar, FiGrid, FiUser } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, isAdmin, isDriver, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Don't show navbar on landing page
  if (location.pathname === '/') return null;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/map', icon: <FiMap />, label: 'Live Map' },
    { to: '/routes', icon: <FiSearch />, label: 'Routes' },
    { to: '/schedules', icon: <FiCalendar />, label: 'Schedules' },
  ];

  if (isDriver) {
    navLinks.push({ to: '/driver', icon: <FiGrid />, label: 'Driver Panel' });
  }

  if (isAdmin) {
    navLinks.push({ to: '/admin', icon: <FiGrid />, label: 'Admin' });
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🚌</span>
          <span className="brand-text">BusTracker</span>
          <span className="brand-country">SL</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <FiUser />
                <span className="user-name">{user?.name}</span>
                <span className={`role-badge role-${user?.role?.toLowerCase()}`}>
                  {user?.role}
                </span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
