import type { MouseEvent } from 'react'
import type { Pokemon } from '@/types/pokemon'
import { useFavorites } from '@/context/FavoritesContext'
import styles from './FavoriteButton.module.css'

interface Props {
  pokemon: Pokemon
}

function FavoriteButton({ pokemon }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(pokemon.id)

  const handleClick = (e: MouseEvent) => {
    // Evita navegar cuando el botón está dentro de un Link
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(pokemon)
  }

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      aria-label={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={active}
    >
      {active ? '❤️' : '🤍'}
    </button>
  )
}

export default FavoriteButton
