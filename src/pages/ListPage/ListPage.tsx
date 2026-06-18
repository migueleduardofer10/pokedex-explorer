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

function ListPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(20)
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
          const slice = names.slice(offset, offset + limit)
          const detailed = await Promise.all(
            slice.map((n) => getPokemonDetail(n.name)),
          )
          if (!active) return
          setPokemons(detailed)
          setCount(names.length)
        } else {
          const data = await getPokemonPage(offset, limit)
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
  }, [selectedType, offset, limit, reloadKey])

  const page = offset / limit + 1
  const totalPages = Math.ceil(count / limit)

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
      <div className={styles.header}>
        <h2 className={styles.title}>Pokédex</h2>
        <div className={styles.controls}>
          <div className={styles.search}>
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className={styles.filter}>
            <TypeFilter
              types={types}
              value={selectedType}
              onChange={handleTypeChange}
            />
          </div>
        </div>
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

          <div className={styles.bottomBar}>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setOffset((p - 1) * limit)}
            />
            <label className={styles.pageSize}>
              Mostrar
              <select
                className={styles.select}
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value))
                  setOffset(0)
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </>
      )}
    </div>
  )
}

export default ListPage
