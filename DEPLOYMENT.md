# Guia de Deployment — Gerenciador de Tarefas

## Opção 1: Servidor Local (Desenvolvimento)

### Via npm serve
```powershell
npm install
npm start
```
Acessa em `http://localhost:5000` (ou porta alternativa se 5000 estiver ocupada).

### Via Python
```powershell
python -m http.server 5000
```

## Opção 2: GitHub Pages (Estático)

1. Criar repositório Git e fazer push para GitHub
2. Habilitar GitHub Pages (Settings → Pages → Source: main branch)
3. Página fica disponível em: `https://seu-usuario.github.io/task-manager/`

## Opção 3: Netlify Drop

1. Arrastar a pasta `task-manager` para https://app.netlify.com/drop
2. Recebe URL automática e HTTPS

## Opção 4: Vercel

```powershell
npm install -g vercel
vercel
```

## Build/Distribuição

Não há processo de build — é um projeto estático puro. Todos os arquivos estão prontos para uso:
- `index.html`
- `src/styles.css`
- `src/app.js`

Copie esses 3 arquivos para qualquer servidor web.

## Considerações

- Dados ficam no `localStorage` do navegador — **não sincroniza** entre dispositivos
- Para sincronização em nuvem, seria necessário um backend (ex.: Firebase, Node.js + BD)
- Sem service workers — não funciona offline (pode ser adicionado futuramente)
