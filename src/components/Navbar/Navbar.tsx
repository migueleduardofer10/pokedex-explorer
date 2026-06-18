import { NavLink } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import styles from './Navbar.module.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

  // NavLink marca como activo el enlace de la ruta actual
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        <svg className={styles.logo} viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <clipPath id="nav-ball">
              <circle cx="50" cy="50" r="46" />
            </clipPath>
          </defs>
          <g clipPath="url(#nav-ball)">
            <rect width="100" height="50" fill="#dc0a2d" />
            <rect y="50" width="100" height="50" fill="#fff" />
            <rect y="44" width="100" height="12" fill="#1d1d1d" />
          </g>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#1d1d1d" strokeWidth="4" />
          <circle cx="50" cy="50" r="14" fill="#fff" stroke="#1d1d1d" strokeWidth="6" />
        </svg>
        <span className={styles.brandText}>
          Pokédex<span className={styles.brandAccent}>Explorer</span>
        </span>
      </NavLink>

      <div className={styles.right}>
        <NavLink to="/" end className={linkClass}>
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink to="/favorites" className={linkClass}>
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-6.7-4.3-9.4-7C.9 12.3.9 9.3 2.6 7.6a4.5 4.5 0 0 1 6.4 0L12 10.6l3-3a4.5 4.5 0 0 1 6.4 6.4C18.7 16.7 12 21 12 21z" />
          </svg>
          <span>Favorites</span>
        </NavLink>

        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={
            theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'
          }
        >
          {theme === 'light' ? (
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          ) : (
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
