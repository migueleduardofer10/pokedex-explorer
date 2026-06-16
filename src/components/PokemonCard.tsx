import { Link } from 'react-router-dom'
import type { Pokemon } from '../types/pokemon'
import { typeColors } from '../utils/typeColors'
import styles from './PokemonCard.module.css'

interface Props {
  pokemon: Pokemon
}

function PokemonCard({ pokemon }: Props) {
  return (
    <Link to={`/pokemon/${pokemon.id}`} className={styles.card}>
      <span className={styles.id}>#{String(pokemon.id).padStart(3, '0')}</span>
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className={styles.image}
        loading="lazy"
      />
      <h3 className={styles.name}>{pokemon.name}</h3>
      <div className={styles.types}>
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={styles.type}
            style={{ backgroundColor: typeColors[type] ?? '#777' }}
          >
            {type}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default PokemonCard
