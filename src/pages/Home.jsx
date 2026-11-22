import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { geocodeLocation, fetchNearbyPlaces } from '../services/api'
import '../styles/Home.css'

const SERVICE_OPTIONS = [
  { value: 'hospital',   label: 'Hospital',   icon: '🏥' },
  { value: 'pharmacy',   label: 'Pharmacy',   icon: '💊' },
  { value: 'atm',        label: 'ATM',        icon: '🏧' },
  { value: 'police',     label: 'Police',     icon: '🚔' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'school',     label: 'School',     icon: '🏫' },
  { value: 'bank',       label: 'Bank',       icon: '🏦' },
  { value: 'fuel',       label: 'Fuel',       icon: '⛽' },
]

function Home() {
  const navigate = useNavigate()
  const { setResults, setSearchQuery, setUserLocation } = useApp()

  const [serviceType, setServiceType] = useState('hospital')
  const [locationInput, setLocationInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Detect location ──────────────────────────────────────────────────────
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setUserLocation({ lat: latitude, lon: longitude })
        setLocationInput('📍 Using your current location')
        setLoading(false)
      },
      (err) => {
        let msg = 'Could not detect location.'
        if (err.code === 1) msg = 'Location access denied. Please allow location in your browser settings and try again.'
        else if (err.code === 2) msg = 'Location unavailable. Please enter your location manually.'
        else if (err.code === 3) msg = 'Location request timed out. Please try again or enter manually.'
        setError(msg)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  // ── Voice search ─────────────────────────────────────────────────────────
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Voice search is not supported in this browser. Please try Chrome.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.start()
    recognition.onresult = (e) => {
      setLocationInput(e.results[0][0].transcript)
      setError('')
    }
    recognition.onerror = () => {
      setError('Voice recognition failed. Please try again.')
    }
  }

  // ── Main search ──────────────────────────────────────────────────────────
  const handleSearch = async () => {
    setError('')

    if (!locationInput.trim()) {
      setError('Please enter a location or tap the detect button.')
      return
    }

    setLoading(true)

    try {
      let coords

      if (locationInput.startsWith('📍')) {
        coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            (err) => {
              let msg = 'Could not detect location.'
              if (err.code === 1) msg = 'Location access denied. Please allow location in your browser.'
              reject(new Error(msg))
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
          )
        })
      } else {
        coords = await geocodeLocation(locationInput.trim())
      }

      setUserLocation(coords)

      const radii = [3000, 5000, 10000, 20000]
      let places = []

      for (const radius of radii) {
        places = await fetchNearbyPlaces(coords.lat, coords.lon, serviceType, radius)
        if (places.length > 0) break
      }

      if (places.length === 0) {
        setError(`No ${serviceType}s found near "${locationInput}". Try a different city or service.`)
        return
      }

      setResults(places)
      setSearchQuery(serviceType)
      navigate('/results')

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-container">

      {/* Hero */}
      <div className="home-hero">
        <h1>Smart <span>Service</span> Finder</h1>
        <p>Discover essential services near you — instantly</p>
      </div>

      {/* Card */}
      <div className="home-card">

        {/* Service grid */}
        <p className="section-label">What are you looking for?</p>
        <div className="service-grid">
          {SERVICE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`service-tile${serviceType === opt.value ? ' active' : ''}`}
              onClick={() => setServiceType(opt.value)}
            >
              <span className="tile-icon">{opt.icon}</span>
              <span className="tile-label">{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="card-divider" />

        {/* Location */}
        <div className="location-section">
          <p className="section-label">Your Location</p>
          <div className="location-input-wrap">
            <input
              type="text"
              placeholder="e.g. Davanagere, Karnataka"
              value={locationInput}
              onChange={e => { setLocationInput(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="icon-btn"
              onClick={handleDetectLocation}
              title="Detect my location"
              disabled={loading}
            >
              📡
            </button>
            <button
              className="icon-btn"
              onClick={handleVoiceSearch}
              title="Voice input"
              disabled={loading}
            >
              🎤
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <span className="err-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Search */}
        <button className="search-btn" onClick={handleSearch} disabled={loading}>
          {loading ? (
            <span className="loading-dots">
              <span /><span /><span />
            </span>
          ) : (
            `Find Nearby ${SERVICE_OPTIONS.find(o => o.value === serviceType)?.icon} ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}s`
          )}
        </button>

      </div>

      {/* Favorites link */}
      <Link to="/favorites" className="fav-link">
        ❤️ View Saved Favorites
      </Link>

    </div>
  )
}

export default Home
