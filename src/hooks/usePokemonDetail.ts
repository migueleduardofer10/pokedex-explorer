import { useEffect, useState } from 'react'
import { getPokemonDetail } from '@/apis/pokeApi'
import type { Pokemon } from '@/types/pokemon'

// Encapsula la carga del detalle de un Pokémon: loading y error
export function usePokemonDetail(id: string | undefined) {
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
        if (active) setError((err as Error).message ?? 'Algo salió mal')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, reloadKey])

  const reload = () => setReloadKey((k) => k + 1)

  return { pokemon, loading, error, reload }
}
