import { useId } from 'react'
import type { StatusSolicitacao } from '../solicitacoes'

export type ValorFiltro = 'todos' | StatusSolicitacao

const opcoes = [
  { valor: 'todos', rotulo: 'Todas' },
  { valor: 'aberto', rotulo: 'Abertas' },
  { valor: 'concluido', rotulo: 'Concluídas' },
] satisfies { valor: ValorFiltro; rotulo: string }[]

type FiltroStatusProps = {
  valor: ValorFiltro
  onChange: (valor: ValorFiltro) => void
}

export function FiltroStatus({ valor, onChange }: FiltroStatusProps) {
  const nomeGrupo = useId()

  return (
    <fieldset className="filtro-status">
      <legend>Status das solicitações</legend>
      <div className="filtro-opcoes">
        {opcoes.map(({ valor: opcao, rotulo }) => (
          <label key={opcao}>
            <input
              type="radio"
              name={nomeGrupo}
              value={opcao}
              checked={valor === opcao}
              onChange={() => onChange(opcao)}
            />
            {rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
