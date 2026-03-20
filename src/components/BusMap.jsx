import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

// Custom bus icon
const createBusIcon = (busId) => {
  return L.divIcon({
    html: `<div class="bus-marker">
             <span class="bus-icon">🚌</span>
             <span class="bus-label">${busId}</span>
           </div>`,
    className: 'custom-bus-icon',
    iconSize: [80, 40],
    iconAnchor: [40, 40],
    popupAnchor: [0, -35],
  })
}

// Custom bus stop icon
const createStopIcon = (name) => {
  return L.divIcon({
    html: `<div class="stop-marker">
             <span class="stop-icon">🚏</span>
             <span class="stop-label">${name}</span>
           </div>`,
    className: 'custom-stop-icon',
    iconSize: [80, 40],
    iconAnchor: [40, 40],
    popupAnchor: [0, -35],
  })
}

// Auto-fit map to show all markers
function FitBounds({ busLocations, busStops }) {
  const map = useMap()

  useEffect(() => {
    const allPoints = [
      ...busLocations.map((loc) => [loc.latitude, loc.longitude]),
      ...busStops.map((stop) => [stop.latitude, stop.longitude]),
    ]

    if (allPoints.length > 0) {
      map.fitBounds(allPoints, { padding: [50, 50] })
    }
  }, [busLocations, busStops, map])

  return null
}

function BusMap({ busLocations, busStops = [] }) {
  const defaultCenter = [6.9271, 79.8612]
  const defaultZoom = 10

  return (
    <div className="map-wrapper">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '500px', width: '100%', borderRadius: '10px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds busLocations={busLocations} busStops={busStops} />

        {/* Bus markers */}
        {busLocations.map((location) => (
          <Marker
            key={`bus-${location.id}`}
            position={[location.latitude, location.longitude]}
            icon={createBusIcon(location.busId)}
          >
            <Popup>
              <strong>🚌 {location.busId}</strong>
              <br />
              Lat: {location.latitude.toFixed(6)}
              <br />
              Lng: {location.longitude.toFixed(6)}
              <br />
              Updated: {new Date(location.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        ))}

        {/* Bus stop markers */}
        {busStops.map((stop) => (
          <Marker
            key={`stop-${stop.id}`}
            position={[stop.latitude, stop.longitude]}
            icon={createStopIcon(stop.name)}
          >
            <Popup>
              <strong>🚏 {stop.name}</strong>
              <br />
              Lat: {stop.latitude.toFixed(6)}
              <br />
              Lng: {stop.longitude.toFixed(6)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default BusMap