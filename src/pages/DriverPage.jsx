import { useState } from 'react'
import './DriverPage.css'

function DriverPage() {
  const [busId, setBusId] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const shareLocation = () => {
    if (!busId.trim()) {
      setStatus('❌ Please enter a Bus ID')
      return
    }

    if (!navigator.geolocation) {
      setStatus('❌ Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setStatus('📍 Getting your location...')

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
            setStatus('✅ Location shared successfully!')
          } else {
            setStatus('❌ Failed to share location')
          }
        } catch (error) {
          setStatus('❌ Error: ' + error.message)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setStatus('❌ Could not get location: ' + error.message)
        setLoading(false)
      }
    )
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
        />

        <button onClick={shareLocation} disabled={loading}>
          {loading ? '📡 Sharing...' : '📍 Share My Location'}
        </button>

        {status && <p className="status">{status}</p>}
      </div>

      <div className="info">
        <p>💡 Click the button to share your current GPS location with passengers.</p>
        <p>Your browser will ask for location permission.</p>
      </div>
    </div>
  )
}

export default DriverPage