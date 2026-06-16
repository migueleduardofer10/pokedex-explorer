import { useParams } from 'react-router-dom'

function DetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h2>Detalle del Pokémon</h2>
      <p>Pokémon: {id} (commit 5).</p>
    </div>
  )
}

export default DetailPage
