import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { FiltroStatus } from './FiltroStatus'

const meta = {
  title: 'Solicitações/Filtro de status',
  component: FiltroStatus,
  render: function Exemplo() {
    const [{ valor }, updateArgs] = useArgs<{ valor: 'todos' | 'aberto' | 'concluido' }>()
    return <FiltroStatus valor={valor} onChange={(valor) => updateArgs({ valor })} />
  },
  args: { valor: 'todos', onChange: () => {} },
} satisfies Meta<typeof FiltroStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Todas: Story = {}
export const Abertas: Story = { args: { valor: 'aberto' } }
export const Concluidas: Story = { name: 'Concluídas', args: { valor: 'concluido' } }
