import { useState, useEffect, useRef } from 'react'
import './DriverPage.css'

function DriverPage() {
  const [busId, setBusId] = useState('')
  const [status, setStatus] = useState('')
  const [tracking, setTracking] = useState(false)
  const [lastLocation, setLastLocation] = useState(null)
  const [updateCount, setUpdateCount] = useState(0)

  // useRef keeps the interval ID without causing re-renders
  const intervalRef = useRef(null)

  // Cleanup interval when component unmounts (user leaves page)
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch('http://localhost:8080/api/bus-locations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              busId: busId,
              latitude: latitude,
              longitude: longitude,
            }),
          })

          if (response.ok) {
            setLastLocation({ latitude, longitude })
            setUpdateCount((prev) => prev + 1)
            setStatus('✅ Location shared successfully!')
          } else {
            setStatus('❌ Failed to share location')
          }
        } catch (error) {
          setStatus('❌ Error: ' + error.message)
        }
      },
      (error) => {
        setStatus('❌ Could not get location: ' + error.message)
      }
    )
  }

  const startTracking = () => {
    if (!busId.trim()) {
      setStatus('❌ Please enter a Bus ID')
      return
    }

    if (!navigator.geolocation) {
      setStatus('❌ Geolocation is not supported by your browser')
      return
    }

    setTracking(true)
    setUpdateCount(0)
    setStatus('📡 Tracking started...')

    // Send location immediately
    sendLocation()

    // Then send every 5 seconds
    intervalRef.current = setInterval(() => {
      sendLocation()
    }, 5000)
  }

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTracking(false)
    setStatus('⏹️ Tracking stopped')
  }

  return (
    <div className="driver-page">
      <h1>🚌 Driver Dashboard</h1>

      <div className="driver-form">
        <label htmlFor="busId">Bus ID:</label>
        <input
          type="text"
          id="busId"
          placeholder="e.g., BUS-001"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          disabled={tracking}
        />

        {!tracking ? (
          <button className="start-btn" onClick={startTracking}>
            📍 Start Sharing Location
          </button>
        ) : (
          <button className="stop-btn" onClick={stopTracking}>
            ⏹️ Stop Sharing
          </button>
        )}

        {status && <p className="status">{status}</p>}
      </div>

      {/* Live Stats */}
      {(tracking || updateCount > 0) && (
        <div className="stats">
          <h3>📊 Tracking Stats</h3>
          <p>Updates sent: <strong>{updateCount}</strong></p>
          {lastLocation && (
            <>
              <p>Last Latitude: <strong>{lastLocation.latitude.toFixed(6)}</strong></p>
              <p>Last Longitude: <strong>{lastLocation.longitude.toFixed(6)}</strong></p>
            </>
          )}
          {tracking && <p className="live-indicator">🔴 LIVE</p>}
        </div>
      )}

      <div className="info">
        <p>💡 Click "Start Sharing" to begin automatic GPS tracking.</p>
        <p>Your location will be sent every 5 seconds.</p>
        <p>Click "Stop Sharing" when your trip is done.</p>
      </div>
    </div>
  )
}

export default DriverPage