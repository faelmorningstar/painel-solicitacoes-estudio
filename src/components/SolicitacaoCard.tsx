type StatusSolicitacao = 'aberto' | 'concluido'

type SolicitacaoCardProps = {
  titulo: string
  status: StatusSolicitacao
}

const rotulosStatus: Record<StatusSolicitacao, string> = {
  aberto: 'Aberto',
  concluido: 'Concluído',
}

export function SolicitacaoCard({ titulo, status }: SolicitacaoCardProps) {
  return (
    <article className="solicitacao-card">
      <h2>{titulo}</h2>
      <p className="solicitacao-status" data-status={status}>
        Status: {rotulosStatus[status]}
      </p>
    </article>
  )
}
