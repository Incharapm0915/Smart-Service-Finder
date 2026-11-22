import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useApp } from '../context/AppContext'
import { getDistanceKm } from '../services/api'
import 'leaflet/dist/leaflet.css'
import '../styles/Results.css'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Blue icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Auto-fit map to all markers
function FitBounds({ places }) {
  const map = useMap()
  useEffect(() => {
    if (places.length > 0) {
      const bounds = places
        .filter(p => p.lat && p.lon)
        .map(p => [p.lat, p.lon])
      if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [places, map])
  return null
}

// Recenter map to user location
function RecenterMap({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 14)
    }
  }, [lat, lon, map])
  return null
}

function Results() {
  const navigate = useNavigate()
  const { results, searchQuery, userLocation, addFavorite, removeFavorite, isFavorite } = useApp()

  const [sortBy, setSortBy] = useState('distance')
  const [searchFilter, setSearchFilter] = useState('')
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    let list = [...results]

    if (searchFilter) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
    }

    if (userLocation) {
      list = list.map(p => ({
        ...p,
        distance: getDistanceKm(userLocation.lat, userLocation.lon, p.lat, p.lon)
      }))
    }

    if (sortBy === 'distance') {
      list.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFiltered(list)
  }, [results, sortBy, searchFilter, userLocation])

  const toggleFavorite = (e, place) => {
    e.stopPropagation()
    isFavorite(place.id) ? removeFavorite(place.id) : addFavorite(place)
  }

  const center = userLocation
    ? [userLocation.lat, userLocation.lon]
    : [20.5937, 78.9629]

  if (!results.length) {
    return (
      <div className="no-results">
        <p>No results found. <Link to="/">Go back and search again.</Link></p>
      </div>
    )
  }

  return (
    <div className="results-container">

      {/* Header */}
      <div className="results-header">
        <h2>📍 Nearby {searchQuery}s — {filtered.length} found</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/">🔍 New Search</Link>
          <Link to="/favorites">❤️ Favorites</Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔎 Filter by name..."
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="distance">Sort: Nearest First</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
      </div>

      {/* Body: Map + List */}
      <div className="results-body">

        {/* Map */}
        <div className="map-section">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            />
            <FitBounds places={filtered} />
            <RecenterMap lat={userLocation?.lat} lon={userLocation?.lon} />

            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                <Popup>📍 You are here</Popup>
              </Marker>
            )}

            {/* Place markers */}
            {filtered.map(place => (
              place.lat && place.lon && (
                <Marker key={place.id} position={[place.lat, place.lon]}>
                  <Popup>
                    <strong>{place.name}</strong><br />
                    {place.address}<br />
                    {place.distance && `📏 ${place.distance.toFixed(2)} km`}<br />
                    <button
                      onClick={() => navigate(`/details/${place.id}`, { state: { place } })}
                      style={{ marginTop: '6px', cursor: 'pointer' }}
                    >
                      View Details
                    </button>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>

        {/* List */}
        <div className="list-section">
          {filtered.length === 0 ? (
            <p className="no-results">No places match your filter.</p>
          ) : (
            filtered.map(place => (
              <div
                key={place.id}
                className="place-card"
                onClick={() => navigate(`/details/${place.id}`, { state: { place } })}
              >
                <button
                  className="fav-btn"
                  onClick={(e) => toggleFavorite(e, place)}
                  title={isFavorite(place.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite(place.id) ? '❤️' : '🤍'}
                </button>
                <h4>{place.name}</h4>
                <p>{place.address}</p>
                {place.opening_hours && (
                  <p>🕐 {place.opening_hours}</p>
                )}
                {place.distance && (
                  <span className="distance">📏 {place.distance.toFixed(2)} km away</span>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default Results