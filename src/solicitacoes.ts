export type StatusSolicitacao = 'aberto' | 'concluido'

export type Solicitacao = {
  id: string
  titulo: string
  status: StatusSolicitacao
}
