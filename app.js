const taskKey = "taskflow-tasks";
const userKey = "taskflow-user";

// Load user
const user = JSON.parse(localStorage.getItem(userKey));
if (!user) window.location.href = "index.html";

document.getElementById("user-name").textContent = user.name;
document.getElementById("user-avatar").src =
  `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(user.name)}`;

// Elements
const newTaskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task");
const todoList = document.getElementById("todo-list");
const completedList = document.getElementById("completed-list");
const archivedList = document.getElementById("archived-list");

let tasks = JSON.parse(localStorage.getItem(taskKey)) || [];

// Load initial tasks from DummyJSON if first time
if (tasks.length === 0) {
  fetch("https://dummyjson.com/todos")
    .then((res) => res.json())
    .then((data) => {
      tasks = data.todos.slice(0, 5).map((item) => ({
        id: Date.now() + Math.random(),
        title: item.todo,
        status: "todo",
        updatedAt: getFormattedDate(),
      }));
      saveTasks();
      renderTasks();
    });
} else {
  renderTasks();
}

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function saveTasks() {
  localStorage.setItem(taskKey, JSON.stringify(tasks));
}

function renderTasks() {
  todoList.innerHTML = "";
  completedList.innerHTML = "";
  archivedList.innerHTML = "";

  let todo = 0, completed = 0, archived = 0;

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <div>${task.title}</div>
      <small>Last Modified: ${task.updatedAt}</small>
      <div class="actions"></div>
    `;

    const actions = div.querySelector(".actions");

    if (task.status === "todo") {
      todo++;
      actions.append(createAction("✔️ Done", () => updateTask(task.id, "completed")));
      actions.append(createAction("📦 Archive", () => updateTask(task.id, "archived")));
      todoList.appendChild(div);
    } else if (task.status === "completed") {
      completed++;
      actions.append(createAction("↩️ Todo", () => updateTask(task.id, "todo")));
      actions.append(createAction("📦 Archive", () => updateTask(task.id, "archived")));
      completedList.appendChild(div);
    } else {
      archived++;
      actions.append(createAction("📝 Todo", () => updateTask(task.id, "todo")));
      actions.append(createAction("✔️ Completed", () => updateTask(task.id, "completed")));
      archivedList.appendChild(div);
    }
  });

  document.getElementById("todo-count").textContent = todo;
  document.getElementById("completed-count").textContent = completed;
  document.getElementById("archived-count").textContent = archived;
}



function updateTask(id, status) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, status, updatedAt: getFormattedDate() } : task
  );
}

addTaskBtn.onclick = () => {
  const title = newTaskInput.value.trim();
  if (!title) return;

  tasks.push({
    id: Date.now(),
    title,
    status: "todo",
    updatedAt: getFormattedDate(),
  });

  newTaskInput.value = "";
  saveTasks();
  renderTasks();
};

document.getElementById("sign-out").onclick = () => {
  localStorage.removeItem(userKey);
  localStorage.removeItem(taskKey);
  window.location.href = "index.html";
};


function createAction(label, handler) {
  const btn = document.createElement("button");
  btn.textContent = label;

  // Assign button color class based on label
  if (label.includes("Done") || label.includes("Completed")) {
    btn.classList.add("btn-done");
  } else if (label.includes("Archive")) {
    btn.classList.add("btn-archive");
  } else if (label.includes("Todo")) {
    btn.classList.add("btn-todo");
  }

  btn.onclick = () => {
    handler();
    saveTasks();
    renderTasks();
  };

  return btn;
}
