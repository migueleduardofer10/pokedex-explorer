import type { NamedResource } from '@/types/pokemon'
import styles from './TypeFilter.module.css'

interface Props {
  types: NamedResource[]
  value: string
  onChange: (value: string) => void
}

function TypeFilter({ types, value, onChange }: Props) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filtrar por tipo"
    >
      <option value="">Todos los tipos</option>
      {types.map((t) => (
        <option key={t.name} value={t.name}>
          {t.name}
        </option>
      ))}
    </select>
  )
}

export default TypeFilter
