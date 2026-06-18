import styles from './SearchBar.module.css'

interface Props {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        className={styles.input}
        placeholder="Buscar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
