import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import FavoritesPage from './pages/FavoritesPage'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/pokemon/:id" element={<DetailPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="*" element={<p>Página no encontrada (404)</p>} />
        </Routes>
      </main>
    </>
  )
}

export default App
