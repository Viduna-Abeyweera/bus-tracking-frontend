import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

// Create a custom bus icon
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

// This component auto-fits the map to show all markers
function FitBounds({ busLocations }) {
  const map = useMap()

  useEffect(() => {
    if (busLocations.length > 0) {
      const bounds = busLocations.map((loc) => [loc.latitude, loc.longitude])
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [busLocations, map])

  return null
}

function BusMap({ busLocations }) {
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

        {/* Auto-fit map to show all buses */}
        <FitBounds busLocations={busLocations} />

        {busLocations.map((location) => (
          <Marker
            key={location.id}
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
      </MapContainer>
    </div>
  )
}

export default BusMap