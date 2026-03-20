import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>🚍 Real-Time Bus Tracker</h1>
        <p className="tagline">Track buses in real-time across Sri Lanka</p>
      </div>

      <div className="role-cards">
        <Link to="/passenger" className="role-card passenger-card">
          <span className="role-emoji">🧑‍💼</span>
          <h2>I'm a Passenger</h2>
          <p>View live bus locations on the map and check estimated arrival times</p>
          <span className="role-btn">View Buses →</span>
        </Link>

        <Link to="/driver" className="role-card driver-card">
          <span className="role-emoji">🚌</span>
          <h2>I'm a Driver</h2>
          <p>Share your live GPS location with passengers in real-time</p>
          <span className="role-btn">Start Sharing →</span>
        </Link>
      </div>

      <div className="features">
        <h2>Features</h2>
        <div className="feature-list">
          <div className="feature">
            <span>📍</span>
            <p>Real-time GPS tracking</p>
          </div>
          <div className="feature">
            <span>🗺️</span>
            <p>Interactive map view</p>
          </div>
          <div className="feature">
            <span>🕐</span>
            <p>ETA calculations</p>
          </div>
          <div className="feature">
            <span>🚏</span>
            <p>Bus stop information</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage