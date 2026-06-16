import { useEffect, useState } from 'react'
import { getPokemonPage } from '../apis/pokeApi'
import type { Pokemon } from '../types/pokemon'
import PokemonCard from '../components/PokemonCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import styles from './ListPage.module.css'

const LIMIT = 20

function ListPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getPokemonPage(offset, LIMIT)
      .then((data) => {
        if (!active) return
        setPokemons(data.pokemons)
        setCount(data.count)
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
  }, [offset, reloadKey])

  const page = offset / LIMIT + 1
  const totalPages = Math.ceil(count / LIMIT)

  // Buscador: filtra sobre los resultados ya cargados
  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <h2 className={styles.title}>Pokédex</h2>
      <SearchBar value={search} onChange={setSearch} />

      {loading && <Loader />}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className={styles.empty}>No se encontraron Pokémon.</p>
          ) : (
            <div className={styles.grid}>
              {filtered.map((p) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setOffset((o) => Math.max(0, o - LIMIT))}
            onNext={() => setOffset((o) => o + LIMIT)}
          />
        </>
      )}
    </div>
  )
}

export default ListPage
