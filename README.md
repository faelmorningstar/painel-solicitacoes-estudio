# painel-solicitacoes-estudio
Painel de solicitações para um estúdio de design, com React, TypeScript, FastAPI, TanStack Query e Storybook.

## Executar localmente

A fila mostra uma solicitação fictícia. O Storybook apresenta o mesmo cartão
com os estados **Aberto** e **Concluído**.

Use Node.js 22.12 ou superior em uma versão LTS e execute os comandos na raiz
do repositório:

```powershell
npm ci
npm run dev
```

Em outro terminal, na mesma pasta, inicie a API com Python 3.11 ou superior:

```powershell
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r api/requirements.txt
.venv/Scripts/python.exe -m uvicorn api.main:app
```

Em Linux ou Codespaces, use `.venv/bin/python` no lugar de `.venv/Scripts/python.exe`.
O Vite encaminha as chamadas `/api` à porta 8000 do FastAPI.

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.
Em outro terminal, na mesma pasta, execute:

```powershell
npm run storybook
```

Abra o endereço exibido pelo Storybook, normalmente `http://localhost:6006`,
e selecione **Solicitações → Cartão**.

Para verificar as compilações, execute `npm run build` e `npm run build-storybook`.

O cartão recebe o status por prop. Assim, a fila pode fornecer os dados da API
e cada história pode reproduzir um estado isolado.
O status aparece em texto para que a cor seja apenas um reforço visual.

## Como experimentar o fluxo

Na fila, crie uma solicitação com um título. Use os filtros **Todas**,
**Abertas** e **Concluídas** para encontrar um pedido. Abra os detalhes, altere
o status e volte à fila. A API guarda os pedidos em um arquivo SQLite, preservando as alterações após recarregar a página.

O Storybook inclui exemplos do campo de texto, do filtro e do cartão.
Abra a aba **Accessibility** para inspecionar os resultados do axe-core.
O filtro usa rádios nativos e permite mudar a seleção com as setas.
O erro de título fica associado ao campo por `aria-describedby`.

## Decisão de cache

A fila e os detalhes têm chaves distintas no TanStack Query. O filtro selecionado
fica no React e é aplicado à lista em memória. Após uma gravação bem-sucedida,
a resposta da API atualiza os caches existentes e a fila é invalidada para
buscar a versão mais recente. As leituras anteriores são canceladas antes da
atualização para evitar que uma resposta atrasada sobrescreva o status salvo.
