import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { fetchNearbyPlaces } from '../services/api'
import './EmergencyButton.css'

function EmergencyButton() {
  const navigate = useNavigate()
  const { userLocation, setResults, setSearchQuery, setUserLocation } = useApp()
  const [loading, setLoading] = useState(false)

  const handleEmergency = async (type) => {
    setLoading(true)

    try {
      let coords = userLocation

      // If no location yet, detect it
      if (!coords) {
        coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            reject
          )
        })
        setUserLocation(coords)
      }

      const radii = [3000, 5000, 10000]
      let places = []

      for (const radius of radii) {
        places = await fetchNearbyPlaces(coords.lat, coords.lon, type, radius)
        if (places.length > 0) break
      }

      setResults(places)
      setSearchQuery(type)
      navigate('/results')

    } catch (err) {
      alert('Could not detect location. Please allow location access.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="emergency-bar">
      <span className="emergency-label">🚨 Emergency:</span>
      <button
        className="emergency-btn hospital"
        onClick={() => handleEmergency('hospital')}
        disabled={loading}
      >
        🏥 Nearest Hospital
      </button>
      <button
        className="emergency-btn police"
        onClick={() => handleEmergency('police')}
        disabled={loading}
      >
        🚔 Nearest Police
      </button>
      {loading && <span className="emergency-loading">Locating...</span>}
    </div>
  )
}

export default EmergencyButton