import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  atualizarStatus,
  chavesSolicitacoes,
  criarSolicitacao,
  listarSolicitacoes,
  obterSolicitacao,
} from './api-solicitacoes'
import { FiltroStatus } from './components/FiltroStatus'
import type { ValorFiltro } from './components/FiltroStatus'
import { FormularioSolicitacao } from './components/FormularioSolicitacao'
import { SolicitacaoCard } from './components/SolicitacaoCard'
import type { Solicitacao, StatusSolicitacao } from './solicitacoes'

function ErroConsulta({ mensagem, tentarNovamente }: {
  mensagem: string
  tentarNovamente: () => void
}) {
  return (
    <div>
      <p role="alert">{mensagem}</p>
      <button type="button" onClick={tentarNovamente}>Tentar novamente</button>
    </div>
  )
}

export function App() {
  const queryClient = useQueryClient()
  const [filtro, setFiltro] = useState<ValorFiltro>('todos')
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null)
  const [mensagemFila, setMensagemFila] = useState('')
  const tituloTela = useRef<HTMLHeadingElement>(null)
  const focarTituloNaTroca = useRef(false)

  const fila = useQuery({
    queryKey: chavesSolicitacoes.fila,
    queryFn: ({ signal }) => listarSolicitacoes(signal),
  })

  async function sincronizarCaches(pedido: Solicitacao, novo: boolean) {
    const chaveDetalhe = chavesSolicitacoes.detalhe(pedido.id)
    await Promise.all([
      queryClient.cancelQueries({ queryKey: chaveDetalhe }),
      queryClient.cancelQueries({ queryKey: chavesSolicitacoes.fila }),
    ])

    queryClient.setQueryData(chaveDetalhe, pedido)
    queryClient.setQueryData<Solicitacao[]>(chavesSolicitacoes.fila, (atuais) => {
      if (!atuais) return undefined
      return novo
        ? [pedido, ...atuais.filter(({ id }) => id !== pedido.id)]
        : atuais.map((item) => item.id === pedido.id ? pedido : item)
    })
    await queryClient.invalidateQueries({ queryKey: chavesSolicitacoes.fila })
  }

  const criacao = useMutation({
    mutationFn: criarSolicitacao,
    onSuccess: async (pedido) => {
      await sincronizarCaches(pedido, true)
      setFiltro('aberto')
      setMensagemFila(`Solicitação criada: ${pedido.titulo}`)
    },
  })

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

  const visiveis = fila.data?.filter((item) => filtro === 'todos' || item.status === filtro)

  return (
    <main className="fila">
      <h1 ref={tituloTela} tabIndex={-1}>
        {idSelecionado ? 'Detalhes da solicitação' : 'Fila de solicitações'}
      </h1>
      {idSelecionado ? (
        <Detalhes
          key={idSelecionado}
          id={idSelecionado}
          voltar={() => trocarTela(null)}
          aoSalvar={(pedido) => sincronizarCaches(pedido, false)}
        />
      ) : (
        <>
          <FormularioSolicitacao
            onCriar={async (titulo) => {
              setMensagemFila('')
              await criacao.mutateAsync(titulo)
            }}
            enviando={criacao.isPending}
          />
          {criacao.isError && <p role="alert">{criacao.error.message}</p>}
          <p className="mensagem-fila" role="status">{mensagemFila}</p>
          <FiltroStatus valor={filtro} onChange={setFiltro} />
          {fila.isPending && <p role="status">Carregando solicitações…</p>}
          {fila.isError && (
            <ErroConsulta mensagem="Não foi possível carregar a fila." tentarNovamente={() => void fila.refetch()} />
          )}
          {visiveis && (
            visiveis.length ? (
              <ul className="lista-solicitacoes">
                {visiveis.map(({ id, titulo, status }) => (
                  <li key={id}>
                    <SolicitacaoCard titulo={titulo} status={status} onAbrir={() => trocarTela(id)} />
                  </li>
                ))}
              </ul>
            ) : <p>Nenhuma solicitação neste filtro.</p>
          )}
        </>
      )}
    </main>
  )
}

function Detalhes({ id, voltar, aoSalvar }: {
  id: string
  voltar: () => void
  aoSalvar: (pedido: Solicitacao) => Promise<void>
}) {
  const detalhe = useQuery({
    queryKey: chavesSolicitacoes.detalhe(id),
    queryFn: ({ signal }) => obterSolicitacao(id, signal),
  })
  const alteracao = useMutation({
    mutationFn: (status: StatusSolicitacao) => atualizarStatus(id, status),
    onSuccess: aoSalvar,
  })

  return (
    <>
      <button type="button" disabled={alteracao.isPending} onClick={voltar}>Voltar à fila</button>
      {detalhe.isPending && <p role="status">Carregando detalhes…</p>}
      {detalhe.isError && (
        <ErroConsulta mensagem={detalhe.error.message} tentarNovamente={() => void detalhe.refetch()} />
      )}
      {detalhe.data && (
        <>
          <SolicitacaoCard titulo={detalhe.data.titulo} status={detalhe.data.status} />
          <div className="campo-texto">
            <label htmlFor="status-detalhes">Atualizar status</label>
            <select
              id="status-detalhes"
              value={detalhe.data.status}
              disabled={alteracao.isPending}
              onChange={(event) => {
                const { value } = event.target
                if (value === 'aberto' || value === 'concluido') alteracao.mutate(value)
              }}
            >
              <option value="aberto">Aberto</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
          {alteracao.isPending && <p role="status">Salvando status…</p>}
          {alteracao.isError && <p role="alert">{alteracao.error.message}</p>}
        </>
      )}
    </>
  )
}
