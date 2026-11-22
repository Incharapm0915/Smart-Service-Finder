import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/Favorites.css'

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

function Favorites() {
  const navigate = useNavigate()
  const { favorites, removeFavorite } = useApp()

  const handleClearAll = () => {
    if (window.confirm('Remove all favorites?')) {
      favorites.forEach(f => removeFavorite(f.id))
    }
  }

  const handleViewDetails = (place) => {
    navigate(`/details/${place.id}`, { state: { place } })
  }

  return (
    <div className="favorites-container">

      {/* Header */}
      <div className="favorites-header">
        <Link to="/">← Back to Search</Link>
        <h2>❤️ My Favorites</h2>
        {favorites.length > 0 && (
          <button className="clear-btn" onClick={handleClearAll}>
            🗑️ Clear All
          </button>
        )}
      </div>

      <div className="favorites-body">

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <h3>No favorites saved yet</h3>
            <p>Search for services and tap the ❤️ to save them here</p>
            <Link to="/">🔍 Start Searching</Link>
          </div>
        ) : (
          <>
            <p className="favorites-count">
              {favorites.length} place{favorites.length > 1 ? 's' : ''} saved
            </p>

            <div className="favorites-grid">
              {favorites.map(place => (
                <div key={place.id} className="fav-card">

                  <div className="fav-card-top">
                    <h4>{SERVICE_ICONS[place.type] || '📍'} {place.name}</h4>
                    <span className="type-badge">{place.type}</span>
                  </div>

                  <p>📍 {place.address}</p>

                  {place.phone && (
                    <p>📞 <a href={`tel:${place.phone}`}>{place.phone}</a></p>
                  )}

                  {place.opening_hours && (
                    <p className="opening">🕐 {place.opening_hours}</p>
                  )}

                  {place.distance && (
                    <p>📏 {place.distance.toFixed(2)} km away</p>
                  )}

                  <div className="fav-card-actions">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(place)}
                    >
                      👁️ View Details
                    </button>
                    <button
                      className="btn-remove"
                      onClick={() => removeFavorite(place.id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites