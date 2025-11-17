const fs = require('fs');
const { JSDOM } = require('jsdom');

let html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('src/app.js', 'utf8');

// Remove external resource tags to avoid JSDOM trying to load them over network
html = html.replace(/<link[^>]+href=\"[^\"]*styles\.css\"[^>]*>/i, '');
html = html.replace(/<script[^>]+src=\"[^\"]*app\.js\"[^>]*><\/script>/i, '');

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost:11238/' });
const { window } = dom;
const { document } = window;

// Polyfills
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(cb){ return setTimeout(cb, 0); };
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id){ clearTimeout(id); };
}

// Inject the app script into the DOM so it runs in JSDOM's window
const scriptEl = document.createElement('script');
scriptEl.textContent = appJs;
document.body.appendChild(scriptEl);

function delay(ms){ return new Promise(r=>setTimeout(r, ms)); }

(async ()=>{
  await delay(150);
  const results = [];

  try{
    // Test 1: initial empty (count .task-item)
    const listItems0 = document.querySelectorAll('.task-item').length;
    results.push({name:'initial-empty', pass: listItems0 === 0});

    // Test 2: add task
    const input = document.getElementById('task-input');
    const form = document.getElementById('task-form');
    input.value = 'Tarefa de teste';
    form.dispatchEvent(new window.Event('submit', { bubbles:true, cancelable:true }));
    await delay(150);
    results.push({name:'add-task', pass: document.querySelectorAll('.task-item').length === 1});

    // Test 3: complete task
    const checkbox = document.querySelector('.task-item input[type=\"checkbox\"]');
    if (!checkbox) throw new Error('Checkbox não encontrado');
    checkbox.checked = true;
    checkbox.dispatchEvent(new window.Event('change', { bubbles:true }));
    await delay(80);
    const completed = document.querySelector('.task-text.completed') !== null;
    results.push({name:'complete-task', pass: completed});

    // Test 4: edit task
    const span = document.querySelector('.task-text');
    span.dispatchEvent(new window.Event('dblclick', { bubbles:true }));
    await delay(80);
    const editInput = document.querySelector('.edit-input');
    if(editInput){
      editInput.value = 'Tarefa editada';
      const ev = new window.KeyboardEvent('keydown', { key: 'Enter' });
      editInput.dispatchEvent(ev);
      await delay(150);
      results.push({name:'edit-task', pass: document.querySelectorAll('.task-text')[0].textContent === 'Tarefa editada'});
    } else {
      results.push({name:'edit-task', pass: false});
    }

    // Test 5: remove task
    const delBtn = document.querySelector('.delete-btn');
    delBtn.click();
    await delay(300);
    results.push({name:'remove-task', pass: document.querySelectorAll('.task-item').length === 0});

  } catch (err) {
    console.error('Erro durante os testes:', err);
    results.push({name:'exception', pass:false, err: String(err)});
  }

  let all = true;
  console.log('\nResultado dos testes:');
  results.forEach(r=>{
    console.log(`${r.name}: ${r.pass ? 'PASS' : 'FAIL'}` + (r.err ? ` - ${r.err}` : ''));
    if(!r.pass) all = false;
  });

  process.exit(all ? 0 : 1);
})();
