/* ==========================================================================
   planner.js — Mission/Task Log interactive system.
   Loaded only on planner.html.

   Data model: an array of task objects, each { id, text, completed }.
   Every DOM update flows from re-rendering this array — the array is
   always the source of truth, the list markup is just its reflection.
   ========================================================================== */

const STORAGE_KEY = 'baseetsec-planner-tasks';

let tasks = loadTasks();

const form = document.querySelector('[data-task-form]');
const input = document.querySelector('[data-task-input]');
const list = document.querySelector('[data-task-list]');
const emptyState = document.querySelector('[data-empty-state]');
const progressBar = document.querySelector('[data-progress-bar]');
const progressLabel = document.querySelector('[data-progress-label]');
const taskCountLabel = document.querySelector('[data-task-count]');

document.addEventListener('DOMContentLoaded', () => {
  if (!form) return; // guard: only run this file's logic on planner.html
  render();
  form.addEventListener('submit', handleAddTask);
});

/* ---------- Persistence ---------- */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read saved tasks:', err);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Could not save tasks:', err);
  }
}

/* ---------- Task operations ---------- */
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  tasks.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: trimmed,
    completed: false,
  });

  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

/* ---------- Event handlers ---------- */
function handleAddTask(event) {
  event.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
}

/* ---------- Rendering ---------- */
function render() {
  list.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    tasks.forEach((task) => list.appendChild(buildTaskRow(task)));
  }

  updateProgress();
}

function buildTaskRow(task) {
  const li = document.createElement('li');
  li.className = 'task-row' + (task.completed ? ' is-complete' : '');
  li.dataset.id = task.id;

  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'task-check';
  checkBtn.setAttribute('aria-pressed', String(task.completed));
  checkBtn.setAttribute(
    'aria-label',
    task.completed ? 'Mark task as not complete' : 'Mark task as complete'
  );
  checkBtn.innerHTML = task.completed
    ? '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '';
  checkBtn.addEventListener('click', () => toggleTask(task.id));

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = task.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'task-delete';
  deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.append(checkBtn, textSpan, deleteBtn);
  return li;
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  progressBar.style.width = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', String(percent));
  progressLabel.textContent = `Completion Status: ${percent}%`;
  taskCountLabel.textContent = `${done} / ${total} tasks complete`;
}