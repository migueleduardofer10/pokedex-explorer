# Pokédex Explorer

Aplicación web que consume la [PokéAPI](https://pokeapi.co/) para explorar Pokémon:
listado paginado, búsqueda, filtro por tipo, vista de detalle con estadísticas y
favoritos persistidos en el navegador.

🔗 **Demo en vivo:** https://pokedex-explorer-three.vercel.app/

## Funcionalidades

- **Listado** de Pokémon en tarjetas con imagen, nombre y tipos.
- **Paginación numerada** con primera/última página y **selector de cantidad** por página (10/20/50).
- **Buscador** por nombre sobre los resultados cargados.
- **Filtro por tipo** usando el endpoint `/type` (dropdown personalizado con color por tipo).
- **Vista de detalle** con imagen, tipos y estadísticas base (HP, Ataque, Defensa, Velocidad).
- **Favoritos**: marcar/quitar desde la tarjeta o el detalle, con vista propia, persistidos en `localStorage`.
- **Modo claro / oscuro** con toggle, persistido y respetando la preferencia del sistema.
- **Animaciones** suaves al cambiar de vista y al cargar tarjetas.
- **Estados de carga** (spinner) y **error** (con botón de reintento) en cada llamada.
- **Diseño responsivo** (mobile y desktop).

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) como bundler y servidor de desarrollo
- [React Router v6](https://reactrouter.com/) para la navegación
- **CSS Modules** + variables CSS (para el sistema de temas)
- Estado global con **React Context** (sin librerías externas)

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (incluido con Node.js)

## Cómo correr el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

Luego abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Ejecuta ESLint |

## Estructura de carpetas

```
src/
├── apis/            # Capa de red: todas las llamadas a la PokéAPI
│   └── pokeApi.ts
├── components/      # Componentes reutilizables (cada uno en su carpeta con su CSS Module)
│   ├── ErrorMessage/
│   ├── FavoriteButton/
│   ├── Loader/
│   ├── Navbar/
│   ├── Pagination/
│   ├── PokemonCard/
│   ├── SearchBar/
│   └── TypeFilter/
├── context/         # Estado global (FavoritesContext + hook useFavorites)
├── hooks/           # Lógica reutilizable (usePokemonList, usePokemonDetail, useTheme)
├── pages/           # Vistas por ruta (ListPage, DetailPage, FavoritesPage)
├── types/           # Tipos de TypeScript
├── utils/           # Helpers puros (colores por tipo)
├── constants.ts     # Valores fijos (URL base, tamaños de página, máximos, etc.)
├── App.tsx          # Definición de rutas y layout
└── main.tsx         # Punto de entrada (providers globales)
```

## Arquitectura y decisiones

### Organización: una carpeta por componente

Cada componente y página vive en su **propia carpeta** junto a su `.module.css`
(co-locación). Así los estilos están al lado del componente que los usa y la
estructura escala sin archivos sueltos.

Se usa un **path alias `@/`** (configurado en `vite.config.ts` y `tsconfig.app.json`)
que apunta a `src/`. Los imports quedan limpios y no se rompen al mover archivos:

```ts
import PokemonCard from '@/components/PokemonCard/PokemonCard'  // en vez de ../../
```

### Separación lógica / presentación (custom hooks)

La lógica de datos **no vive dentro de los componentes**. Se extrajo a custom hooks,
de modo que las páginas solo se encargan de **mostrar**:

- `usePokemonList` → fetch del listado, paginación, filtro por tipo, loading y error.
- `usePokemonDetail` → fetch del detalle, loading y error.
- `useTheme` → tema claro/oscuro + persistencia.
- `useFavorites` → acceso al estado de favoritos.

Esto cumple el criterio de *"componentes bien separados, sin lógica mezclada"*: por
ejemplo, `ListPage` solo recibe datos del hook y los pinta.

### Capa de API aislada y transformación de datos

Toda la red está en `apis/pokeApi.ts`. Los componentes **nunca** hacen `fetch`
directo. Además, la respuesta **cruda** de la API se transforma a un **modelo limpio**
(`mapPokemon`) con solo lo que la app necesita (id, imagen, tipos, stats), para no
arrastrar la estructura compleja del JSON por toda la app.

### Doble petición en el listado

El endpoint de listado (`/pokemon`) no trae imagen ni tipos, solo nombre y URL. Por
eso, por cada página se piden los **detalles en paralelo** con `Promise.all`, evitando
peticiones secuenciales lentas.

### Caché de tipos en memoria

Al filtrar por un tipo, el endpoint `/type/{nombre}` devuelve **toda** la lista de
Pokémon de ese tipo (puede ser larga). Para no repedirla cada vez que se cambia de
página dentro del mismo filtro, se guarda en un **caché en memoria** (`useRef` con un
`Map` de `tipo → nombres`). Se usa `useRef` y no `useState` porque el caché es memoria
interna que no debe provocar re-renders. Es un caché temporal: vive mientras la vista
del listado esté montada.

### Estado global con React Context (sin Redux/Zustand)

Los favoritos se comparten en vivo entre tarjetas, detalle y la vista de favoritos
mediante `FavoritesContext`, y se **persisten en `localStorage`**. Internamente usa
solo `useState` + `useEffect`, suficiente para el alcance del proyecto.

### Estilos y sistema de temas

Se usan **CSS Modules** (estilos aislados por componente, sin conflictos de nombres) y
**variables CSS** para los colores. El modo oscuro se logra cambiando un atributo
`data-theme` en el `<html>`: las variables se recalculan y toda la app se reestila sin
tocar cada componente.

### Constantes centralizadas

Los valores fijos (URL base, tamaños de página, tipos excluidos, máximo de stats) están
en `constants.ts`, en un único lugar fácil de mantener, sin "números mágicos" regados.

### Otras decisiones

- **Vite** en lugar de Create React App: arranque y recarga más rápidos; CRA está descontinuado.
- **TypeScript** (bonus): tipa las respuestas de la API y previene errores.
