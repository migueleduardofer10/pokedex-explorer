import styles from './Pagination.module.css'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Genera los números a mostrar con elipsis (ej. 1 … 4 5 6 … 68)
function getPages(current: number, total: number): (number | 'dots')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'dots')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('dots')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('dots')

  pages.push(total)
  return pages
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

      {pages.map((p, i) =>
        p === 'dots' ? (
          <span key={`dots-${i}`} className={styles.dots}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`${styles.page} ${p === page ? styles.active : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

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
