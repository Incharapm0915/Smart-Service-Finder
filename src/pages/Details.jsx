import { useLocation, useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useApp } from '../context/AppContext'
import 'leaflet/dist/leaflet.css'
import '../styles/Details.css'

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const SERVICE_ICONS = {
  hospital:   '🏥',
  pharmacy:   '💊',
  atm:        '🏧',
  police:     '🚔',
  restaurant: '🍽️',
  school:     '🏫',
  bank:       '🏦',
  fuel:       '⛽',
}

function Details() {
  const { state } = useLocation()
  const { id } = useParams()
  const { addFavorite, removeFavorite, isFavorite, favorites } = useApp()

  // Get place from router state or from favorites
  const place = state?.place || favorites.find(f => String(f.id) === String(id))

  if (!place) {
    return (
      <div className="not-found">
        <p>Place not found.</p>
        <br />
        <Link to="/">🔍 Go back to Search</Link>
      </div>
    )
  }

  const favorited = isFavorite(place.id)

  const toggleFavorite = () => {
    favorited ? removeFavorite(place.id) : addFavorite(place)
  }

  const openInMaps = () => {
    window.open(
      `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}&zoom=17`,
      '_blank'
    )
  }

  return (
    <div className="details-container">

      {/* Header */}
      <div className="details-header">
        <Link to="/results">← Back</Link>
        <h2>{SERVICE_ICONS[place.type] || '📍'} {place.name}</h2>
        <Link to="/">🔍 New Search</Link>
      </div>

      <div className="details-body">

        {/* Info Card */}
        <div className="details-card">
          <h3>{place.name}</h3>
          <span className="type-badge">{SERVICE_ICONS[place.type]} {place.type}</span>

          <div className="info-row">
            <span className="icon">📍</span>
            <div className="info-content">
              <div className="info-label">Address</div>
              <div className="info-value">{place.address}</div>
            </div>
          </div>

          {place.phone && (
            <div className="info-row">
              <span className="icon">📞</span>
              <div className="info-content">
                <div className="info-label">Phone</div>
                <div className="info-value">
                  <a href={`tel:${place.phone}`}>{place.phone}</a>
                </div>
              </div>
            </div>
          )}

          {place.website && (
            <div className="info-row">
              <span className="icon">🌐</span>
              <div className="info-content">
                <div className="info-label">Website</div>
                <div className="info-value">
                  <a href={place.website} target="_blank" rel="noreferrer">
                    {place.website}
                  </a>
                </div>
              </div>
            </div>
          )}

          {place.opening_hours && (
            <div className="info-row">
              <span className="icon">🕐</span>
              <div className="info-content">
                <div className="info-label">Opening Hours</div>
                <div className="info-value">{place.opening_hours}</div>
              </div>
            </div>
          )}

          {place.distance && (
            <div className="info-row">
              <span className="icon">📏</span>
              <div className="info-content">
                <div className="info-label">Distance</div>
                <div className="info-value">{place.distance.toFixed(2)} km away</div>
              </div>
            </div>
          )}

          <div className="info-row">
            <span className="icon">🗺️</span>
            <div className="info-content">
              <div className="info-label">Coordinates</div>
              <div className="info-value">
                {place.lat?.toFixed(5)}, {place.lon?.toFixed(5)}
              </div>
            </div>
          </div>
        </div>

        {/* Mini Map */}
        {place.lat && place.lon && (
          <div className="details-map">
            <MapContainer
              center={[place.lat, place.lon]}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              />
              <Marker position={[place.lat, place.lon]}>
                <Popup>{place.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Action Buttons */}
        <button
          className={`fav-toggle-btn ${favorited ? 'active' : 'inactive'}`}
          onClick={toggleFavorite}
        >
          {favorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
        </button>

        <button
          className="fav-toggle-btn inactive"
          onClick={openInMaps}
        >
          🗺️ Open in OpenStreetMap
        </button>

      </div>
    </div>
  )
}

export default Details