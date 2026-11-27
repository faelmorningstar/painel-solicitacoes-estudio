import type { Meta, StoryObj } from '@storybook/react-vite'
import { tituloSolicitacaoExemplo } from '../solicitacao-exemplo'
import { SolicitacaoCard } from './SolicitacaoCard'

const meta = {
  title: 'Solicitações/Cartão',
  component: SolicitacaoCard,
  args: { titulo: tituloSolicitacaoExemplo },
} satisfies Meta<typeof SolicitacaoCard>

export default meta

type Story = StoryObj<typeof meta>

export const Aberto: Story = {
  args: { status: 'aberto' },
}

export const Concluido: Story = {
  name: 'Concluído',
  args: { status: 'concluido' },
}
