import type { Solicitacao, StatusSolicitacao } from './solicitacoes'

const endpoint = '/api/solicitacoes'

export const chavesSolicitacoes = {
  fila: ['solicitacoes', 'fila'] as const,
  detalhe: (id: string) => ['solicitacoes', 'detalhe', id] as const,
}

async function solicitar<T>(url: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(url, opcoes)
  if (!resposta.ok) {
    throw new Error(resposta.status === 404
      ? 'Solicitação não encontrada.'
      : 'Não foi possível concluir a operação.')
  }
  return resposta.json()
}

function enviarJson<T>(url: string, method: 'POST' | 'PATCH', dados: object) {
  return solicitar<T>(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
}

export function listarSolicitacoes(signal: AbortSignal) {
  return solicitar<Solicitacao[]>(endpoint, { signal })
}

export function obterSolicitacao(id: string, signal: AbortSignal) {
  return solicitar<Solicitacao>(`${endpoint}/${encodeURIComponent(id)}`, { signal })
}

export function criarSolicitacao(titulo: string) {
  return enviarJson<Solicitacao>(endpoint, 'POST', { titulo })
}

export function atualizarStatus(id: string, status: StatusSolicitacao) {
  return enviarJson<Solicitacao>(`${endpoint}/${encodeURIComponent(id)}`, 'PATCH', { status })
}
