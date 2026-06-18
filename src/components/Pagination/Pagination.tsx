import styles from './Pagination.module.css'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Ventana de 5 páginas consecutivas + primera y última
function getPages(current: number, total: number): number[] {
  const windowSize = 5
  let start = Math.max(1, current - 2)
  const end = Math.min(total, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)

  const pages = new Set<number>([1])
  for (let i = start; i <= end; i++) pages.add(i)
  pages.add(total)

  return [...pages].sort((a, b) => a - b)
}

function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  const pages = getPages(page, totalPages)

  return (
    <div className={styles.pagination}>
      <button
        className={styles.nav}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className={styles.pages}>
        {pages.map((p) => (
          <button
            key={p}
            className={`${styles.page} ${p === page ? styles.active : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className={styles.nav}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}

export default Pagination
