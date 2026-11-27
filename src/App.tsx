import { SolicitacaoCard } from './components/SolicitacaoCard'
import { tituloSolicitacaoExemplo } from './solicitacao-exemplo'

export function App() {
  return (
    <main className="fila">
      <h1>Fila de solicitações</h1>
      <SolicitacaoCard titulo={tituloSolicitacaoExemplo} status="aberto" />
    </main>
  )
}
