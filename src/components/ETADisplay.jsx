function ETADisplay({ etaData, selectedStop }) {
  if (!selectedStop) {
    return null
  }

  if (etaData.length === 0) {
    return (
      <div className="eta-section">
        <h2>🕐 ETA to {selectedStop.name}</h2>
        <p className="no-buses">No active buses found</p>
      </div>
    )
  }

  return (
    <div className="eta-section">
      <h2>🕐 ETA to {selectedStop.name}</h2>

      <div className="eta-list">
        {etaData.map((eta, index) => (
          <div key={index} className="eta-card">
            <div className="eta-bus-info">
              <h3>🚌 {eta.busId}</h3>
              <span className="eta-distance">{eta.distanceKm} km away</span>
            </div>
            <div className="eta-time">
              {eta.etaMinutes < 60 ? (
                <span className="eta-minutes">
                  ⏱️ ~{eta.etaMinutes} min
                </span>
              ) : (
                <span className="eta-minutes">
                  ⏱️ ~{Math.floor(eta.etaMinutes / 60)}h {eta.etaMinutes % 60}m
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ETADisplay