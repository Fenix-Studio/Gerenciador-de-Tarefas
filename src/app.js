/**
 * Task Manager - Lógica principal
 * Gerencia adicionar, remover, editar e marcar tarefas como concluídas
 * Dados persistem em localStorage
 */

const STORAGE_KEY = 'tasks-v1';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const live = document.getElementById('live-region'); // aria-live para anúncios
const filterButtons = () => Array.from(document.querySelectorAll('.filter-btn'));

// Estado global
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'all'; // 'all' | 'active' | 'completed'

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function announce(message) {
  if (live) live.textContent = message;
}

function updateCount(filtered){
  const count = filtered.length;
  const t = count === 1 ? 'tarefa' : 'tarefas';
  if (live) live.textContent = `${count} ${t}`;
}

function setFilter(newFilter){
  filter = newFilter;
  filterButtons().forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === newFilter));
  render();
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item enter';
  li.dataset.id = task.id;

  const main = document.createElement('div');
  main.className = 'task-main';

  const label = document.createElement('label');
  label.htmlFor = `chk-${task.id}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `chk-${task.id}`;
  checkbox.checked = !!task.completed;
  checkbox.setAttribute('aria-label', task.text);

  const span = document.createElement('span');
  span.className = 'task-text' + (task.completed ? ' completed' : '');
  span.textContent = task.text;
  span.tabIndex = 0;

  // double-click or Enter to edit
  span.addEventListener('dblclick', () => startEdit(li, task));
  span.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') startEdit(li, task); });

  label.appendChild(checkbox);
  label.appendChild(span);
  main.appendChild(label);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const edit = document.createElement('button');
  edit.className = 'edit-btn';
  edit.type = 'button';
  edit.textContent = 'Editar';
  edit.setAttribute('aria-label', `Editar: ${task.text}`);
  edit.addEventListener('click', () => startEdit(li, task));

  const del = document.createElement('button');
  del.className = 'delete-btn';
  del.type = 'button';
  del.textContent = 'Remover';
  del.setAttribute('aria-label', `Remover: ${task.text}`);

  actions.appendChild(edit);
  actions.appendChild(del);

  li.appendChild(main);
  li.appendChild(actions);

  // Small delay for enter -> show transition
  requestAnimationFrame(()=>{
    li.classList.remove('enter');
    li.classList.add('show');
  });

  return li;
}

function render() {
  list.innerHTML = '';
  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return !!t.completed;
    return true;
  });

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'sr-only';
    empty.textContent = 'Nenhuma tarefa.';
    list.appendChild(empty);
    updateCount(filtered);
    announce('Nenhuma tarefa presente.');
    return;
  }

  filtered.forEach(task => {
    list.appendChild(createTaskElement(task));
  });

  updateCount(filtered);
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const task = { id: Date.now().toString(), text: trimmed, completed: false };
  tasks.unshift(task);
  save();
  render();
  announce('Tarefa adicionada.');
}

function removeTask(id) {
  const li = list.querySelector(`li[data-id="${id}"]`);
  if (li) {
    li.classList.add('removing');
    setTimeout(()=>{
      const idx = tasks.findIndex(t => t.id === id);
      if (idx > -1){
        const removed = tasks.splice(idx,1)[0];
        save();
        render();
        announce(`Tarefa removida: ${removed.text}`);
      }
    }, 200);
  }
}

function toggleTask(id, completed) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.completed = completed;
  save();
  render();
  announce(t.completed ? `Tarefa concluída: ${t.text}` : `Tarefa marcada como não concluída: ${t.text}`);
}

function startEdit(li, task){
  const span = li.querySelector('.task-text');
  if (!span) return;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;
  input.setAttribute('aria-label', `Editar tarefa: ${task.text}`);

  // Replace span with input
  span.replaceWith(input);
  input.focus();
  input.select();

  function commit(){
    const v = input.value.trim();
    if (v){
      task.text = v;
      save();
      render();
      announce(`Tarefa atualizada: ${v}`);
    } else {
      // empty => remove
      removeTask(task.id);
    }
  }

  function cancel(){
    render();
  }

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') cancel();
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

// Event delegation for list actions
list.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (btn && btn.classList.contains('delete-btn')) {
    const li = btn.closest('li');
    if (li) removeTask(li.dataset.id);
    return;
  }
});

list.addEventListener('change', (e) => {
  const chk = e.target.closest('input[type="checkbox"]');
  if (chk) {
    const li = chk.closest('li');
    if (li) toggleTask(li.dataset.id, chk.checked);
  }
});

// filter buttons
Array.from(document.querySelectorAll('.filter-btn')).forEach(btn=>{
  btn.addEventListener('click', ()=> setFilter(btn.dataset.filter));
});

// Initial render
render();

// Validação de input: considera apenas espaços como vazio e impede envio
input.setAttribute('required', '');

function validateInput() {
    const trimmed = input.value.trim();
    const submit = form.querySelector('button[type="submit"]');
    if (trimmed) {
        input.setCustomValidity('');
        if (submit) submit.disabled = false;
        input.removeAttribute('aria-invalid');
    } else {
        input.setCustomValidity('Por favor insira uma tarefa.');
        if (submit) submit.disabled = true;
        input.setAttribute('aria-invalid', 'true');
    }
}

input.addEventListener('input', validateInput);

// Trim ao perder foco para limpar espaços desnecessários
input.addEventListener('blur', () => {
    input.value = input.value.trim();
    validateInput();
});

// Estado inicial
validateInput();