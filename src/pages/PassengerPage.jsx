import { useState, useEffect } from 'react'
import BusMap from '../components/BusMap'
import ETADisplay from '../components/ETADisplay'
import { timeAgo } from '../utils/timeAgo'
import './PassengerPage.css'

function PassengerPage() {
  const [busLocations, setBusLocations] = useState([])
  const [busStops, setBusStops] = useState([])
  const [selectedStop, setSelectedStop] = useState(null)
  const [etaData, setEtaData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch bus locations and bus stops on page load
  useEffect(() => {
    fetchBusLocations()
    fetchBusStops()

    const interval = setInterval(() => {
      fetchBusLocations()
      // Also refresh ETA if a stop is selected
      if (selectedStop) {
        fetchETA(selectedStop.id)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Fetch ETA when selected stop changes
  useEffect(() => {
    if (selectedStop) {
      fetchETA(selectedStop.id)
    } else {
      setEtaData([])
    }
  }, [selectedStop])

  const fetchBusLocations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/bus-locations/latest')
      if (!response.ok) throw new Error('Failed to fetch bus locations')
      const data = await response.json()
      setBusLocations(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const fetchBusStops = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/bus-stops')
      if (!response.ok) throw new Error('Failed to fetch bus stops')
      const data = await response.json()
      setBusStops(data)
    } catch (err) {
      console.error('Error fetching bus stops:', err)
    }
  }

  const fetchETA = async (stopId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bus-stops/${stopId}/eta`)
      if (!response.ok) throw new Error('Failed to fetch ETA')
      const data = await response.json()
      setEtaData(data)
    } catch (err) {
      console.error('Error fetching ETA:', err)
    }
  }

  const handleStopChange = (e) => {
    const stopId = e.target.value
    if (stopId === '') {
      setSelectedStop(null)
    } else {
      const stop = busStops.find((s) => s.id === parseInt(stopId))
      setSelectedStop(stop)
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
      <p>Tracking {busLocations.length} bus(es)</p>

      {/* Bus Stop Selector */}
      <div className="stop-selector">
        <label htmlFor="stopSelect">📍 Select your bus stop: </label>
        <select id="stopSelect" onChange={handleStopChange}>
          <option value="">-- Choose a stop --</option>
          {busStops.map((stop) => (
            <option key={stop.id} value={stop.id}>
              {stop.name}
            </option>
          ))}
        </select>
      </div>

      {/* Map showing buses AND stops */}
      <BusMap busLocations={busLocations} busStops={busStops} />

      {/* ETA Display */}
      <ETADisplay etaData={etaData} selectedStop={selectedStop} />

      {/* Bus Cards */}
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