import { useState, useEffect } from 'react'
import BusMap from './components/BusMap'
import './App.css'

function App() {

  const [busLocations, setBusLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBusLocations()
  }, [])

  const fetchBusLocations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/bus-locations')

      if (!response.ok) {
        throw new Error('Failed to fetch bus locations')
      }

      const data = await response.json()
      setBusLocations(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="App"><h1>Loading bus locations...</h1></div>
  }

  if (error) {
    return <div className="App"><h1>Error: {error}</h1></div>
  }

  return (
    <div className="App">
      <h1>🚍 Real-Time Bus Tracker</h1>
      <p>Tracking {busLocations.length} bus location(s)</p>

      {/* The Map Component */}
      <BusMap busLocations={busLocations} />

      {/* Bus Cards Below the Map */}
      <div className="bus-list">
        {busLocations.map((location) => (
          <div key={location.id} className="bus-card">
            <h3>🚌 {location.busId}</h3>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <p>Last Updated: {new Date(location.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App