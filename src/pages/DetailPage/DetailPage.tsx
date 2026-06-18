import { Link, useParams } from 'react-router-dom'
import { typeColors } from '@/utils/typeColors'
import { MAX_STAT } from '@/constants'
import { usePokemonDetail } from '@/hooks/usePokemonDetail'
import Loader from '@/components/Loader/Loader'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import FavoriteButton from '@/components/FavoriteButton/FavoriteButton'
import styles from './DetailPage.module.css'

// Stats que pide el reto, con etiqueta legible
const STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Ataque' },
  { key: 'defense', label: 'Defensa' },
  { key: 'speed', label: 'Velocidad' },
] as const

function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const { pokemon, loading, error, reload } = usePokemonDetail(id)

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={reload} />
  if (!pokemon) return null

  return (
    <div className={styles.detail}>
      <Link to="/" className={styles.back}>
        ← Volver al listado
      </Link>

      <div className={styles.card}>
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className={styles.image}
        />

        <span className={styles.id}>#{String(pokemon.id).padStart(3, '0')}</span>
        <div className={styles.nameRow}>
          <h2 className={styles.name}>{pokemon.name}</h2>
          <FavoriteButton pokemon={pokemon} />
        </div>

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

        <div className={styles.stats}>
          <h3>Estadísticas base</h3>
          {STATS.map(({ key, label }) => {
            const value = pokemon.stats[key]
            return (
              <div key={key} className={styles.statRow}>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statValue}>{value}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(value / MAX_STAT) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DetailPage
