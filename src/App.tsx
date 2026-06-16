import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import FavoritesPage from './pages/FavoritesPage'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <main className="container">
        {/* key por ruta: reinicia la animación de fade en cada navegación */}
        <div className="page" key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<ListPage />} />
            <Route path="/pokemon/:id" element={<DetailPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="*" element={<p>Página no encontrada (404)</p>} />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default App
