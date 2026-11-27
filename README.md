# painel-solicitacoes-estudio
Painel de solicitações para um estúdio de design, com React, TypeScript, Storybook e testes Playwright.

## Primeira entrega

A fila mostra uma solicitação fictícia. O Storybook apresenta o mesmo cartão
com os estados **Aberto** e **Concluído**.

Use Node.js 22.12 ou superior em uma versão LTS e execute os comandos na raiz
do repositório:

```powershell
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.
Em outro terminal, na mesma pasta, execute:

```powershell
npm run storybook
```

Abra o endereço exibido pelo Storybook, normalmente `http://localhost:6006`,
e selecione **Solicitações → Cartão**.

Para verificar as compilações, execute `npm run build` e `npm run build-storybook`.

O cartão recebe o status por prop. Assim, a fila pode fornecer os dados da API
quando ela for integrada, e cada história pode reproduzir um estado isolado.
O status aparece em texto para que a cor seja apenas um reforço visual.

## Fluxo local

Na fila, crie uma solicitação com um título. Use os filtros **Todas**,
**Abertas** e **Concluídas** para encontrar um pedido. Abra os detalhes, altere
o status e volte à fila. Nesta etapa, as alterações ficam em memória e são
descartadas ao recarregar a página.

O Storybook inclui exemplos do campo de texto, do filtro e do cartão.
Abra a aba **Accessibility** para inspecionar os resultados do axe-core.
O filtro usa rádios nativos e permite mudar a seleção com as setas.
O erro de título fica associado ao campo por `aria-describedby`.
