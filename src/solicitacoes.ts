import { tituloSolicitacaoExemplo } from './solicitacao-exemplo'

export type StatusSolicitacao = 'aberto' | 'concluido'

export type Solicitacao = {
  id: string
  titulo: string
  status: StatusSolicitacao
}

export const solicitacoesIniciais: Solicitacao[] = [
  { id: 'exemplo', titulo: tituloSolicitacaoExemplo, status: 'aberto' },
]
