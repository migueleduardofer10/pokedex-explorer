import styles from './Pagination.module.css'

interface Props {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  return (
    <div className={styles.pagination}>
      <button onClick={onPrev} disabled={page <= 1} className={styles.button}>
        Anterior
      </button>
      <span className={styles.info}>
        Página {page} de {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className={styles.button}
      >
        Siguiente
      </button>
    </div>
  )
}

export default Pagination
