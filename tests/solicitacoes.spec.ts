import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'

test('move uma solicitação de Abertas para Concluídas sem recarregar', async ({ page }) => {
  const titulo = `Revisar contraste do menu ${randomUUID()}`
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Fila de solicitações' })).toBeVisible()

  let navegacoes = 0
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) navegacoes++
  })

  await page.getByRole('textbox', { name: 'Título da solicitação' }).fill(titulo)
  await page.getByRole('button', { name: 'Criar solicitação' }).click()
  await expect(page.getByRole('radio', { name: 'Abertas' })).toBeChecked()

  const cartao = page.getByRole('article').filter({
    has: page.getByRole('heading', { name: titulo, exact: true }),
  })
  await expect(cartao.getByText('Status: Aberto', { exact: true })).toBeVisible()
  await cartao.getByRole('button', { name: `Ver detalhes: ${titulo}` }).click()
  await expect(page.getByRole('heading', { name: 'Detalhes da solicitação' })).toBeFocused()
  await page.getByRole('combobox', { name: 'Atualizar status' }).selectOption('concluido')
  await expect(cartao.getByText('Status: Concluído', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Voltar à fila' }).click()
  await expect(page.getByRole('radio', { name: 'Abertas' })).toBeChecked()
  await expect(cartao).toHaveCount(0)
  await page.getByRole('radio', { name: 'Concluídas' }).check()
  await expect(cartao.getByText('Status: Concluído', { exact: true })).toBeVisible()
  expect(navegacoes).toBe(0)

  await page.reload()
  await expect(cartao.getByText('Status: Concluído', { exact: true })).toBeVisible()
})
