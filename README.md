# Pokédex Explorer

Aplicación web que consume la [PokéAPI](https://pokeapi.co/) para explorar Pokémon:
listado paginado, búsqueda, vista de detalle con estadísticas y favoritos
persistidos en el navegador.

## Funcionalidades

- **Listado** de Pokémon en tarjetas con imagen, nombre y tipos.
- **Paginación** (Anterior / Siguiente).
- **Buscador** por nombre sobre los resultados cargados.
- **Vista de detalle** con imagen, tipos y estadísticas base (HP, Ataque, Defensa, Velocidad).
- **Favoritos**: marcar/quitar desde la tarjeta o el detalle, con vista propia.
- **Persistencia** de favoritos en `localStorage`.
- **Estados de carga** (spinner) y **error** (con botón de reintento) en cada llamada.
- **Diseño responsivo** (mobile y desktop).

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) como bundler y servidor de desarrollo
- [React Router v6](https://reactrouter.com/) para la navegación
- **CSS Modules** para los estilos
- Estado compartido con **React Context** (sin librerías externas)

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
├── apis/         # Llamadas a la PokéAPI (toda la lógica de red)
├── components/   # Componentes reutilizables (tarjeta, loader, error, etc.)
├── context/      # FavoritesContext (estado global de favoritos)
├── pages/        # Vistas por ruta (listado, detalle, favoritos)
├── types/        # Tipos de TypeScript
├── utils/        # Utilidades (colores por tipo)
├── App.tsx       # Definición de rutas y layout
└── main.tsx      # Punto de entrada (providers globales)
```

## Decisiones tomadas

- **Vite en lugar de Create React App**: arranque y recarga más rápidos, y CRA
  está descontinuado.
- **TypeScript** (bonus del reto): tipa las respuestas de la API y previene errores.
- **CSS Modules**: estilos aislados por componente, sin conflictos de nombres y sin
  dependencias externas.
- **Capa de API separada** (`apis/`): los componentes no contienen `fetch` directo;
  toda la red está centralizada y la respuesta cruda se transforma a un modelo limpio.
- **React Context para favoritos** en vez de Redux/Zustand: el estado se comparte en
  vivo entre tarjetas, detalle y la vista de favoritos, y persiste en `localStorage`.
  Internamente usa `useState` + `useEffect`, suficiente para el alcance del proyecto.
- **Doble petición en el listado**: el endpoint de listado no trae imagen ni tipos,
  así que por cada página se piden los detalles en paralelo con `Promise.all`.

## Mejoras futuras

- Filtro por tipo usando el endpoint `/type` (la capa de API ya lo soporta).
- Animaciones/transiciones entre vistas.
- Deploy en Vercel o Netlify.
