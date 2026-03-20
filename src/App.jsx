import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PassengerPage from './pages/PassengerPage'
import DriverPage from './pages/DriverPage'
import './App.css'

function Navbar() {
  const location = useLocation()

  // Don't show navbar on home page
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav className="navbar">
      <Link to="/">🏠 Home</Link>
      <Link to="/passenger">🚍 Passenger View</Link>
      <Link to="/driver">🚌 Driver Dashboard</Link>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/passenger" element={<PassengerPage />} />
          <Route path="/driver" element={<DriverPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App