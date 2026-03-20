import { useState, useEffect } from 'react'
import BusMap from '../components/BusMap'
import { timeAgo } from '../utils/timeAgo'
import './PassengerPage.css'

function PassengerPage() {
  const [busLocations, setBusLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBusLocations()
    const interval = setInterval(() => {
      fetchBusLocations()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchBusLocations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/bus-locations/latest')
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
    return <div className="passenger-page"><h1>Loading bus locations...</h1></div>
  }

  if (error) {
    return <div className="passenger-page"><h1>Error: {error}</h1></div>
  }

  return (
    <div className="passenger-page">
      <h1>🚍 Real-Time Bus Tracker</h1>
      <p>Tracking {busLocations.length} bus location(s)</p>

      <BusMap busLocations={busLocations} />

      <div className="bus-list">
        {busLocations.map((location) => (
          <div key={location.id} className="bus-card">
            <h3>🚌 {location.busId}</h3>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <p>Last Updated: {timeAgo(location.timestamp)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PassengerPage