import { useFavorites } from '@/context/FavoritesContext'
import PokemonCard from '@/components/PokemonCard/PokemonCard'
import styles from './FavoritesPage.module.css'

function FavoritesPage() {
  const { favorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div>
        <h2>Mis favoritos</h2>
        <p className={styles.empty}>
          Aún no tienes favoritos. Marca algunos con el corazón 🤍
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className={styles.title}>Mis favoritos ({favorites.length})</h2>
      <div className={styles.grid}>
        {favorites.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage
