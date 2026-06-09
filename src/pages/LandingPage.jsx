import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiClock, FiNavigation, FiShield, FiArrowRight } from 'react-icons/fi';
import './LandingPage.css';

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <nav className="landing-nav">
          <div className="landing-nav-inner">
            <div className="navbar-brand">
              <span className="brand-icon">🚌</span>
              <span className="brand-text">BusTracker</span>
              <span className="brand-country">SL</span>
            </div>
            <div className="landing-nav-actions">
              {isAuthenticated ? (
                <Link to="/map" className="btn btn-primary">
                  Open Dashboard <FiArrowRight />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline">Login</Link>
                  <Link to="/register" className="btn btn-primary">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="hero-content animate-slide-up">
          <div className="hero-badge">
            <span className="live-dot"></span>
            Live Tracking Across Sri Lanka
          </div>
          <h1 className="hero-title">
            Track Every Bus,
            <br />
            <span className="gradient-text">In Real-Time.</span>
          </h1>
          <p className="hero-subtitle">
            Know exactly when your bus arrives. Live GPS tracking, 
            smart ETA predictions, and real-time updates for Sri Lankan 
            bus routes — Colombo, Kandy, Galle, and beyond.
          </p>
          <div className="hero-actions">
            <Link to={isAuthenticated ? '/map' : '/register'} className="btn btn-accent btn-lg">
              <FiNavigation />
              Start Tracking
            </Link>
            <Link to="/routes" className="btn btn-outline btn-lg">
              Browse Routes
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">5+</span>
              <span className="stat-label">Major Routes</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">27+</span>
              <span className="stat-label">Bus Stops</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">95+</span>
              <span className="stat-label">Daily Schedules</span>
            </div>
          </div>
        </div>

        <div className="hero-glow"></div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header animate-fade-in">
            <h2>Why BusTracker SL?</h2>
            <p>Everything you need for a smarter commute</p>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon" style={{ background: 'rgba(108, 99, 255, 0.15)' }}>
                <FiMapPin style={{ color: 'var(--primary-light)' }} />
              </div>
              <h3>Live GPS Tracking</h3>
              <p>Watch buses move on the map in real-time with WebSocket-powered updates — no page refresh needed.</p>
            </div>

            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon" style={{ background: 'rgba(0, 212, 170, 0.15)' }}>
                <FiClock style={{ color: 'var(--accent)' }} />
              </div>
              <h3>Smart ETA</h3>
              <p>AI-powered arrival predictions using adaptive speed models — urban, suburban, and highway conditions.</p>
            </div>

            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon" style={{ background: 'rgba(255, 184, 108, 0.15)' }}>
                <FiNavigation style={{ color: 'var(--warning)' }} />
              </div>
              <h3>Route Search</h3>
              <p>Find routes between any two cities. View all stops, schedules, and active buses on each route.</p>
            </div>

            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon" style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
                <FiShield style={{ color: 'var(--danger)' }} />
              </div>
              <h3>Secure & Reliable</h3>
              <p>JWT-authenticated sessions, role-based access, and enterprise-grade Spring Boot backend.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Routes Preview */}
      <section className="routes-preview-section">
        <div className="routes-container">
          <div className="section-header">
            <h2>Popular Routes</h2>
            <p>Real Sri Lankan bus routes with actual stop data</p>
          </div>

          <div className="routes-grid">
            {[
              { num: '1', name: 'Colombo Fort → Kandy', stops: 7, color: '#6C63FF' },
              { num: '2', name: 'Colombo Fort → Galle', stops: 6, color: '#00D4AA' },
              { num: '4', name: 'Colombo Fort → Jaffna', stops: 5, color: '#FFB86C' },
              { num: '15', name: 'Colombo Fort → Matara', stops: 6, color: '#FF6B6B' },
              { num: '48', name: 'Kandy → Nuwara Eliya', stops: 5, color: '#8B85FF' },
            ].map((route) => (
              <div key={route.num} className="route-preview-card glass-card">
                <div className="route-number" style={{ background: route.color }}>
                  {route.num}
                </div>
                <div className="route-info">
                  <h4>{route.name}</h4>
                  <span className="route-stops">{route.stops} stops</span>
                </div>
              </div>
            ))}
          </div>

          <div className="routes-cta">
            <Link to="/routes" className="btn btn-outline">
              View All Routes <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container glass-card">
          <h2>Ready to ride smarter?</h2>
          <p>Join thousands of commuters tracking buses in real-time across Sri Lanka.</p>
          <Link to={isAuthenticated ? '/map' : '/register'} className="btn btn-accent btn-lg">
            <FiNavigation />
            Get Started — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 BusTracker SL — Built for SLIIT Software Engineering</p>
      </footer>
    </div>
  );
}

export default LandingPage;
