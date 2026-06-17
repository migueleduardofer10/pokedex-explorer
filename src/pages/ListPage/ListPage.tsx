import { useEffect, useState } from 'react'
import {
  getPokemonDetail,
  getPokemonPage,
  getPokemonsByType,
  getTypes,
} from '@/apis/pokeApi'
import type { NamedResource, Pokemon } from '@/types/pokemon'
import PokemonCard from '@/components/PokemonCard/PokemonCard'
import Loader from '@/components/Loader/Loader'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import SearchBar from '@/components/SearchBar/SearchBar'
import TypeFilter from '@/components/TypeFilter/TypeFilter'
import Pagination from '@/components/Pagination/Pagination'
import styles from './ListPage.module.css'

const LIMIT = 20

function ListPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [types, setTypes] = useState<NamedResource[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Lista de tipos para el selector (una sola vez)
  useEffect(() => {
    getTypes()
      .then((data) =>
        setTypes(
          data.filter((t) => !['unknown', 'stellar', 'shadow'].includes(t.name)),
        ),
      )
      .catch(() => setTypes([]))
  }, [])

  // Página actual, con o sin filtro de tipo
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    async function load() {
      try {
        if (selectedType) {
          // Filtrado: lista del tipo + detalles solo de la página actual
          const names = await getPokemonsByType(selectedType)
          const slice = names.slice(offset, offset + LIMIT)
          const detailed = await Promise.all(
            slice.map((n) => getPokemonDetail(n.name)),
          )
          if (!active) return
          setPokemons(detailed)
          setCount(names.length)
        } else {
          const data = await getPokemonPage(offset, LIMIT)
          if (!active) return
          setPokemons(data.pokemons)
          setCount(data.count)
        }
      } catch (err) {
        if (active) setError((err as Error).message ?? 'Algo salió mal')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [selectedType, offset, reloadKey])

  const page = offset / LIMIT + 1
  const totalPages = Math.ceil(count / LIMIT)

  // Buscador: filtra sobre los resultados ya cargados
  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Al cambiar el tipo, vuelve a la primera página
  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setOffset(0)
  }

  return (
    <div>
      <h2 className={styles.title}>Pokédex</h2>

      <div className={styles.controls}>
        <SearchBar value={search} onChange={setSearch} />
        <TypeFilter
          types={types}
          value={selectedType}
          onChange={handleTypeChange}
        />
      </div>

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
