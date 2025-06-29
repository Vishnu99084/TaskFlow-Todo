const taskKey = "taskflow-tasks";
const userKey = "taskflow-user";

const user = JSON.parse(localStorage.getItem(userKey));
if (!user) window.location.href = "index.html";

document.getElementById("user-name").textContent = user.name;
document.getElementById("user-avatar").src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(user.name)}`;

const newTaskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task");
const todoList = document.getElementById("todo-list");
const completedList = document.getElementById("completed-list");
const archivedList = document.getElementById("archived-list");

let tasks = JSON.parse(localStorage.getItem(taskKey)) || [];

if (tasks.length === 0) {
  fetch("https://dummyjson.com/todos")
    .then(res => res.json())
    .then(data => {
      tasks = data.todos.slice(0, 5).map(item => ({
        id: Date.now() + Math.random(),
        title: item.todo,
        status: "todo",
        updatedAt: new Date().toLocaleString()
      }));
      saveTasks();
      renderTasks();
    });
} else {
  renderTasks();
}

function saveTasks() {
  localStorage.setItem(taskKey, JSON.stringify(tasks));
}

function renderTasks() {
  todoList.innerHTML = "";
  completedList.innerHTML = "";
  archivedList.innerHTML = "";

  let todo = 0, completed = 0, archived = 0;

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <div>${task.title}</div>
      <small>Last Modified: ${task.updatedAt}</small>
      <div class="actions"></div>
    `;

    const actions = div.querySelector(".actions");

    const now = () => new Date().toLocaleString();

    if (task.status === "todo") {
      todo++;
      actions.append(createAction("✔️ Done", () => updateTask(task.id, "completed", now())));
      actions.append(createAction("📦 Archive", () => updateTask(task.id, "archived", now())));
      todoList.appendChild(div);
    } else if (task.status === "completed") {
      completed++;
      actions.append(createAction("↩️ Back", () => updateTask(task.id, "todo", now())));
      actions.append(createAction("📦 Archive", () => updateTask(task.id, "archived", now())));
      completedList.appendChild(div);
    } else {
      archived++;
      actions.append(createAction("📝 Todo", () => updateTask(task.id, "todo", now())));
      actions.append(createAction("✔️ Completed", () => updateTask(task.id, "completed", now())));
      archivedList.appendChild(div);
    }
  });

  document.getElementById("todo-count").textContent = todo;
  document.getElementById("completed-count").textContent = completed;
  document.getElementById("archived-count").textContent = archived;
}

function createAction(text, handler) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = handler;
  return btn;
}

function updateTask(id, newStatus, time) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, status: newStatus, updatedAt: time } : task
  );
  saveTasks();
  renderTasks();
}

addTaskBtn.onclick = () => {
  const title = newTaskInput.value.trim();
  if (!title) return;
  tasks.push({ id: Date.now(), title, status: "todo", updatedAt: new Date().toLocaleString() });
  newTaskInput.value = "";
  saveTasks();
  renderTasks();
};

document.getElementById("sign-out").onclick = () => {
  localStorage.removeItem(userKey);
  localStorage.removeItem(taskKey);
  window.location.href = "index.html";
};