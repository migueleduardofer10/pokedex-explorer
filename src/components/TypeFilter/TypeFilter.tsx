import { useEffect, useRef, useState } from 'react'
import type { NamedResource } from '@/types/pokemon'
import { typeColors } from '@/utils/typeColors'
import styles from './TypeFilter.module.css'

interface Props {
  types: NamedResource[]
  value: string
  onChange: (value: string) => void
}

function TypeFilter({ types, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const select = (val: string) => {
    onChange(val)
    setOpen(false)
  }

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value && (
          <span
            className={styles.dot}
            style={{ backgroundColor: typeColors[value] ?? '#777' }}
          />
        )}
        <span className={styles.value}>{value || 'Todos los tipos'}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className={styles.menu} role="listbox">
          <li
            className={`${styles.option} ${!value ? styles.selected : ''}`}
            role="option"
            aria-selected={!value}
            onClick={() => select('')}
          >
            Todos los tipos
          </li>
          {types.map((t) => (
            <li
              key={t.name}
              className={`${styles.option} ${value === t.name ? styles.selected : ''}`}
              role="option"
              aria-selected={value === t.name}
              onClick={() => select(t.name)}
            >
              <span
                className={styles.dot}
                style={{ backgroundColor: typeColors[t.name] ?? '#777' }}
              />
              {t.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TypeFilter
