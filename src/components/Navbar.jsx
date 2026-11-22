import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Navbar.css'

function Navbar() {
  const { darkMode, toggleDarkMode, favorites } = useApp()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📍 SmartFinder
      </Link>

      <div className="navbar-links">
        <Link to="/">🔍 Search</Link>
        <Link to="/favorites">
          ❤️ Favorites
          {favorites.length > 0 && (
            <span className="badge">{favorites.length}</span>
          )}
        </Link>
        <button className="dark-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar