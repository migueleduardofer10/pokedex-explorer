import styles from './Loader.module.css'

function Loader() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Cargando">
      <div className={styles.spinner} />
    </div>
  )
}

export default Loader
