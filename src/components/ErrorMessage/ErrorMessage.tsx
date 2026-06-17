import styles from './ErrorMessage.module.css'

interface Props {
  message: string
  onRetry?: () => void
}

function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className={styles.wrapper} role="alert">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.button}>
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
