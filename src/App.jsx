import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import PassengerPage from './pages/PassengerPage'
import DriverPage from './pages/DriverPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/">🚍 Passenger View</Link>
          <Link to="/driver">🚌 Driver Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/" element={<PassengerPage />} />
          <Route path="/driver" element={<DriverPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App