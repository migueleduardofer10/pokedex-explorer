// ---- Respuestas crudas de la PokéAPI ----

export interface NamedResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedResource[]
}

export interface PokemonDetailResponse {
  id: number
  name: string
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
  types: { slot: number; type: NamedResource }[]
  stats: { base_stat: number; stat: NamedResource }[]
}

// ---- Modelo limpio que usa la app ----

export interface Pokemon {
  id: number
  name: string
  image: string
  types: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
}
