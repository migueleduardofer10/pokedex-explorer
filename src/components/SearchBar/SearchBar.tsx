import styles from './SearchBar.module.css'

interface Props {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="search"
      className={styles.input}
      placeholder="Buscar por nombre..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default SearchBar
