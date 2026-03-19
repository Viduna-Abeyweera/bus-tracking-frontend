import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

function BusMap({ busLocations }) {

  // Center the map on Sri Lanka (Colombo area)
  const defaultCenter = [6.9271, 79.8612]
  const defaultZoom = 10

  return (
    <div className="map-wrapper">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '500px', width: '100%', borderRadius: '10px' }}
      >
        {/* This adds the actual map tiles (the images of roads, etc.) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* This creates a marker for each bus */}
        {busLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          >
            {/* This shows info when you click a marker */}
            <Popup>
              <strong>🚌 {location.busId}</strong>
              <br />
              Lat: {location.latitude}
              <br />
              Lng: {location.longitude}
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