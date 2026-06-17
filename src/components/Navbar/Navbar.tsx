import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  // NavLink marca como activo el enlace de la ruta actual
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        Pokédex Explorer
      </NavLink>

      <div className={styles.links}>
        <NavLink to="/" className={linkClass} end>
          Inicio
        </NavLink>
        <NavLink to="/favoritos" className={linkClass}>
          Favoritos
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
