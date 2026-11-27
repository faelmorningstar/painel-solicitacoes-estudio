import { useEffect, useRef, useState } from 'react'
import { FiltroStatus } from './components/FiltroStatus'
import type { ValorFiltro } from './components/FiltroStatus'
import { FormularioSolicitacao } from './components/FormularioSolicitacao'
import { SolicitacaoCard } from './components/SolicitacaoCard'
import { solicitacoesIniciais } from './solicitacoes'
import type { StatusSolicitacao } from './solicitacoes'

export function App() {
  const [solicitacoes, setSolicitacoes] = useState(solicitacoesIniciais)
  const [filtro, setFiltro] = useState<ValorFiltro>('todos')
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null)
  const [mensagemFila, setMensagemFila] = useState('')
  const tituloTela = useRef<HTMLHeadingElement>(null)
  const focarTituloNaTroca = useRef(false)
  const selecionada = solicitacoes.find(({ id }) => id === idSelecionado)

  useEffect(() => {
    if (focarTituloNaTroca.current) {
      tituloTela.current?.focus()
      focarTituloNaTroca.current = false
    }
  }, [idSelecionado])

  function trocarTela(id: string | null) {
    focarTituloNaTroca.current = true
    setIdSelecionado(id)
  }

  function criarSolicitacao(titulo: string) {
    const id = crypto.randomUUID()
    setSolicitacoes((atuais) => [{ id, titulo, status: 'aberto' }, ...atuais])
    setFiltro('aberto')
    setMensagemFila(`Solicitação criada: ${titulo}`)
  }

  function atualizarStatus(id: string, status: StatusSolicitacao) {
    setSolicitacoes((atuais) => atuais.map((item) => item.id === id ? { ...item, status } : item))
  }

  if (selecionada) {
    return (
      <main className="fila">
        <h1 ref={tituloTela} tabIndex={-1}>Detalhes da solicitação</h1>
        <button type="button" onClick={() => trocarTela(null)}>Voltar à fila</button>
        <SolicitacaoCard titulo={selecionada.titulo} status={selecionada.status} />
        <div className="campo-texto">
          <label htmlFor="status-detalhes">Atualizar status</label>
          <select
            id="status-detalhes"
            value={selecionada.status}
            onChange={(event) => {
              const status = event.target.value
              if (status === 'aberto' || status === 'concluido') atualizarStatus(selecionada.id, status)
            }}
          >
            <option value="aberto">Aberto</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </main>
    )
  }

  const visiveis = solicitacoes.filter((item) => filtro === 'todos' || item.status === filtro)

  return (
    <main className="fila">
      <h1 ref={tituloTela} tabIndex={-1}>Fila de solicitações</h1>
      <FormularioSolicitacao onCriar={criarSolicitacao} />
      <p className="mensagem-fila" role="status">{mensagemFila}</p>
      <FiltroStatus valor={filtro} onChange={(valor) => {
        setFiltro(valor)
        setMensagemFila('')
      }} />
      {visiveis.length ? (
        <ul className="lista-solicitacoes">
          {visiveis.map(({ id, titulo, status }) => (
            <li key={id}>
              <SolicitacaoCard titulo={titulo} status={status} onAbrir={() => trocarTela(id)} />
            </li>
          ))}
        </ul>
      ) : <p>Nenhuma solicitação neste filtro.</p>}
    </main>
  )
}
