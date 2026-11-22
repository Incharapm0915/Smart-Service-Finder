import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {

  const [results, setResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState(null)

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('ssf-darkmode') === 'true'
  })

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('ssf-favorites')
    return stored ? JSON.parse(stored) : []
  })

  // Auto-save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('ssf-favorites', JSON.stringify(favorites))
  }, [favorites])

  // Apply dark mode to body + save to localStorage
  useEffect(() => {
    localStorage.setItem('ssf-darkmode', darkMode)
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const addFavorite = (place) => {
    setFavorites(prev => [...prev, place])
  }

  const removeFavorite = (placeId) => {
    setFavorites(prev => prev.filter(p => p.id !== placeId))
  }

  const isFavorite = (placeId) => {
    return favorites.some(p => p.id === placeId)
  }

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <AppContext.Provider value={{
      results, setResults,
      searchQuery, setSearchQuery,
      userLocation, setUserLocation,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}