# Gerenciador de Tarefas

Aplicação web simples para adicionar, marcar como concluída e remover tarefas. Projeto estático em HTML, CSS e JavaScript — responsivo e com práticas de acessibilidade.

Melhorias incluídas:
- Filtros: Todas / Ativas / Concluídas
- Edição in-place (duplo clique na tarefa ou botão "Editar")
- Animações sutis ao adicionar/remover

Como usar

- Abrir `task-manager/index.html` diretamente no navegador.
- Ou rodar um servidor local (recomendado) e abrir `http://localhost:5000`.

Comandos rápidos (PowerShell):

```powershell
# Entrar na pasta do projeto e usar npx serve (não precisa instalar globalmente)
Set-Location 'c:\Users\super\Desktop\Agent\task-manager'; npx serve -s . -l 5000

# Ou com Python (se disponível)
Set-Location 'c:\Users\super\Desktop\Agent\task-manager'; python -m http.server 5000
```

Observações
- As tarefas são salvas no `localStorage` do navegador.
- O projeto é apenas frontend e não requer backend.
