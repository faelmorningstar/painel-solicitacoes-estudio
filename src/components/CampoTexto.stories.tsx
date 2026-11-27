import type { Meta, StoryObj } from '@storybook/react-vite'
import { CampoTexto } from './CampoTexto'

const meta = {
  title: 'Solicitações/Campo de texto',
  component: CampoTexto,
  args: { rotulo: 'Título da solicitação', required: true, maxLength: 160 },
} satisfies Meta<typeof CampoTexto>

export default meta
type Story = StoryObj<typeof meta>

export const Vazio: Story = {}
export const Preenchido: Story = { args: { defaultValue: 'Revisar a animação inicial' } }
export const ComErro: Story = { args: { erro: 'Informe um título para a solicitação.' } }
