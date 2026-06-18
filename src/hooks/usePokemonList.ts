import { useEffect, useRef, useState } from 'react'
import {
  getPokemonDetail,
  getPokemonPage,
  getPokemonsByType,
  getTypes,
} from '@/apis/pokeApi'
import type { NamedResource, Pokemon } from '@/types/pokemon'
import { DEFAULT_PAGE_SIZE, EXCLUDED_TYPES } from '@/constants'

// Encapsula la carga del listado: paginación, filtro por tipo, loading y error
export function usePokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [types, setTypes] = useState<NamedResource[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Caché de nombres por tipo: evita repedirlos al paginar dentro de un filtro
  const typeCache = useRef(new Map<string, NamedResource[]>())

  // Lista de tipos para el selector (una sola vez)
  useEffect(() => {
    getTypes()
      .then((data) =>
        setTypes(data.filter((t) => !EXCLUDED_TYPES.includes(t.name))),
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
          // Usa el caché si ya pedimos los nombres de este tipo
          let names = typeCache.current.get(selectedType)
          if (!names) {
            names = await getPokemonsByType(selectedType)
            typeCache.current.set(selectedType, names)
          }
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

  const goToPage = (p: number) => setOffset((p - 1) * limit)

  // Al cambiar tamaño o tipo, vuelve a la primera página
  const changeLimit = (value: number) => {
    setLimit(value)
    setOffset(0)
  }
  const changeType = (type: string) => {
    setSelectedType(type)
    setOffset(0)
  }
  const reload = () => setReloadKey((k) => k + 1)

  return {
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
  }
}
