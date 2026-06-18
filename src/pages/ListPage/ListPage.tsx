import { useState } from 'react'
import { usePokemonList } from '@/hooks/usePokemonList'
import PokemonCard from '@/components/PokemonCard/PokemonCard'
import Loader from '@/components/Loader/Loader'
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'
import SearchBar from '@/components/SearchBar/SearchBar'
import TypeFilter from '@/components/TypeFilter/TypeFilter'
import Pagination from '@/components/Pagination/Pagination'
import styles from './ListPage.module.css'

function ListPage() {
  const {
    pokemons,
    loading,
    error,
    page,
    totalPages,
    limit,
    types,
    selectedType,
    goToPage,
    changeLimit,
    changeType,
    reload,
  } = usePokemonList()
  const [search, setSearch] = useState('')

  // Buscador: filtra sobre los resultados ya cargados
  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

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
              onChange={changeType}
            />
          </div>
        </div>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

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
              onPageChange={goToPage}
            />
            <label className={styles.pageSize}>
              Mostrar
              <select
                className={styles.select}
                value={limit}
                onChange={(e) => changeLimit(Number(e.target.value))}
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
