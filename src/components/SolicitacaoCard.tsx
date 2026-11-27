import type { StatusSolicitacao } from '../solicitacoes'

type SolicitacaoCardProps = {
  titulo: string
  status: StatusSolicitacao
  onAbrir?: () => void
}

const rotulosStatus: Record<StatusSolicitacao, string> = {
  aberto: 'Aberto',
  concluido: 'Concluído',
}

export function SolicitacaoCard({ titulo, status, onAbrir }: SolicitacaoCardProps) {
  return (
    <article className="solicitacao-card">
      <h2>{titulo}</h2>
      <p className="solicitacao-status" data-status={status}>
        Status: {rotulosStatus[status]}
      </p>
    {onAbrir && (
        <button type="button" onClick={onAbrir} aria-label={`Ver detalhes: ${titulo}`}>
          Ver detalhes
        </button>
      )}
    </article>
  )
}
