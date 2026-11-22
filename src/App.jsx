import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import Details from './pages/Details'
import Favorites from './pages/Favorites'
import Navbar from './components/Navbar'
import EmergencyButton from './components/EmergencyButton'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <EmergencyButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App