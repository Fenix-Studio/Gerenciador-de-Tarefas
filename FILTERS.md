# Sistema de Filtros — Gerenciador de Tarefas

## Visão Geral

O gerenciador de tarefas inclui um sistema completo de filtros para organizar e visualizar tarefas por status.

## Filtros Disponíveis

### 1. **Todas**
- Exibe todas as tarefas (ativas e concluídas)
- Botão padrão ao carregar a página
- Mostra contagem total de tarefas

### 2. **Ativas**
- Mostra apenas tarefas não concluídas
- Útil para focar no que precisa ser feito
- Exclui tarefas marcadas com checkmark

### 3. **Concluídas**
- Mostra apenas tarefas marcadas como concluídas
- Excelente para revisão de histórico
- Tarefas aparecem com strikethrough e cor mais muted

## Experiência de Usuário

### Interação com Filtros
- **Clique em um botão** para ativar o filtro correspondente
- **Botão ativo** exibe borda destacada em roxo (accent color) e fundo levemente colorido
- **Transição suave** entre filtros (0.25s fade-in/out)
- **Hover effect** escurece o botão ao passar o mouse

### Contagem de Tarefas
- Exibe o número de tarefas visíveis: "0 tarefas", "1 tarefa", "2 tarefas", etc.
- Pluralização automática
- Atualiza em tempo real ao mudar de filtro

### Acessibilidade
- Atributos `aria-pressed` indicam qual filtro está ativo
- Navegação por teclado: Tab para focar e Enter para ativar
- Anúncios via aria-live ao mudar de filtro
- Labels semânticos para leitores de tela

## Implementação Técnica

### HTML
```html
<div class="filters" role="tablist" aria-label="Filtrar tarefas">
  <button class="filter-btn" data-filter="all" aria-pressed="true">Todas</button>
  <button class="filter-btn" data-filter="active">Ativas</button>
  <button class="filter-btn" data-filter="completed">Concluídas</button>
</div>
```

### CSS (Destaque)
```css
.filter-btn:hover {
  border-color: rgba(124,92,255,0.4);
  color: var(--text);
  transition: all 0.2s ease;
}

.filter-btn[aria-pressed="true"] {
  border-color: var(--accent);
  color: var(--text);
  box-shadow: 0 4px 18px rgba(124,92,255,0.08);
  background: rgba(124,92,255,0.05);
}
```

### JavaScript (Lógica)
```javascript
function setFilter(newFilter) {
  filter = newFilter;
  filterButtons().forEach(b => 
    b.setAttribute('aria-pressed', b.dataset.filter === newFilter)
  );
  render(); // Re-renderiza com transição
}
```

## Responsividade

Em telas pequenas (< 420px):
- Filtros permanecem horizontais e compactos
- Botões reduzem o padding levemente
- Contagem de tarefas aparece abaixo dos filtros

## Estilos Aplicados

| Estado | Cor | Background | Border |
|--------|-----|-----------|--------|
| Inativo | --muted | transparent | rgba(255,255,255,0.03) |
| Hover | --text | transparent | rgba(124,92,255,0.4) |
| Ativo | --text | rgba(124,92,255,0.05) | --accent |

## Exemplos de Uso

### Workflow Típico
1. Usuário adiciona 5 tarefas
2. Clica em "Todas" → vê 5 tarefas
3. Marca 2 como concluídas
4. Clica em "Ativas" → vê 3 tarefas
5. Clica em "Concluídas" → vê 2 tarefas
6. Clica em "Todas" → vê 5 tarefas novamente

### Casos de Uso
- **Produtividade:** usar "Ativas" para focar no que fazer agora
- **Revisão:** usar "Concluídas" para ver progresso
- **Gerenciamento:** usar "Todas" para visão geral completa
