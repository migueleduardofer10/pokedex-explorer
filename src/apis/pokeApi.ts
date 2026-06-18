import type {
  NamedResource,
  Pokemon,
  PokemonDetailResponse,
  PokemonListResponse,
} from '@/types/pokemon'
import { BASE_URL } from '@/constants'

// fetch con manejo de error centralizado
async function request<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Error ${res.status}: no se pudieron obtener los datos`)
  }
  return res.json() as Promise<T>
}

// Respuesta cruda -> modelo limpio
function mapPokemon(data: PokemonDetailResponse): Pokemon {
  const getStat = (name: string) =>
    data.stats.find((s) => s.stat.name === name)?.base_stat ?? 0

  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other?.['official-artwork']?.front_default ??
      data.sprites.front_default ??
      '',
    types: data.types.map((t) => t.type.name),
    stats: {
      hp: getStat('hp'),
      attack: getStat('attack'),
      defense: getStat('defense'),
      speed: getStat('speed'),
    },
  }
}

// Detalle por id o nombre
export async function getPokemonDetail(
  idOrName: string | number,
): Promise<Pokemon> {
  const data = await request<PokemonDetailResponse>(
    `${BASE_URL}/pokemon/${idOrName}`,
  )
  return mapPokemon(data)
}

// Página de Pokémon con imagen y tipos (listado + detalle en paralelo)
export async function getPokemonPage(
  offset = 0,
  limit = 20,
): Promise<{ pokemons: Pokemon[]; count: number }> {
  const list = await request<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  )
  const pokemons = await Promise.all(
    list.results.map((p) => getPokemonDetail(p.name)),
  )
  return { pokemons, count: list.count }
}

// Lista de tipos (filtro - bonus)
export async function getTypes(): Promise<NamedResource[]> {
  const data = await request<{ results: NamedResource[] }>(`${BASE_URL}/type`)
  return data.results
}

// Pokémon de un tipo (filtro - bonus)
export async function getPokemonsByType(
  typeName: string,
): Promise<NamedResource[]> {
  const data = await request<{ pokemon: { pokemon: NamedResource }[] }>(
    `${BASE_URL}/type/${typeName}`,
  )
  return data.pokemon.map((p) => p.pokemon)
}
