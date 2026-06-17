import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPokemonDetail } from '../../apis/pokeApi'
import type { Pokemon } from '../../types/pokemon'
import { typeColors } from '../../utils/typeColors'
import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton'
import styles from './DetailPage.module.css'

// Stats que pide el reto, con etiqueta legible
const STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Ataque' },
  { key: 'defense', label: 'Defensa' },
  { key: 'speed', label: 'Velocidad' },
] as const

const MAX_STAT = 255

function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    setError('')

    getPokemonDetail(id)
      .then((data) => {
        if (active) setPokemon(data)
      })
      .catch((err) => {
        if (active) setError(err.message ?? 'Algo salió mal')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, reloadKey])

  if (loading) return <Loader />
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
    )
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
