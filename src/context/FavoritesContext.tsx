import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Pokemon } from '../types/pokemon'

const STORAGE_KEY = 'favorites'

interface FavoritesContextValue {
  favorites: Pokemon[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (pokemon: Pokemon) => void
  removeFavorite: (id: number) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Estado inicial leído desde localStorage
  const [favorites, setFavorites] = useState<Pokemon[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  // Persiste cada vez que cambian
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = (id: number) => favorites.some((p) => p.id === id)

  const toggleFavorite = (pokemon: Pokemon) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === pokemon.id)
        ? prev.filter((p) => p.id !== pokemon.id)
        : [...prev, pokemon],
    )
  }

  const removeFavorite = (id: number) =>
    setFavorites((prev) => prev.filter((p) => p.id !== id))

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider')
  }
  return ctx
}
