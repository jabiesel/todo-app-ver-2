document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form"); // Ensure this ID matches your HTML form ID
  const newTaskInput = document.getElementById("new-task");
  const taskList = document.getElementById("task-list");

  // Fetch tasks from the server
  fetch("../backend/api/tasks.php")
    .then((response) => response.json())
    .then((tasks) => {
      tasks.forEach((task) => addTaskToList(task));
    });

  taskForm.addEventListener("submit", (event) => {
    // Use taskForm here
    event.preventDefault();
    const task = newTaskInput.value.trim();
    if (task) {
      fetch("../backend/api/tasks.php", {
        method: "POST",
        body: new URLSearchParams({ task }),
      })
        .then((response) => response.json())
        .then((task) => {
          addTaskToList(task);
          newTaskInput.value = "";
        });
    }
  });

  taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("toggle-complete")) {
      const id = event.target.dataset.id;
      fetch("../backend/api/tasks.php", {
        method: "PUT",
        body: new URLSearchParams({ id }),
      }).then(() => {
        event.target.parentElement.classList.toggle("completed");
      });
    } else if (event.target.classList.contains("delete-task")) {
      const id = event.target.dataset.id;
      fetch("../backend/api/tasks.php", {
        method: "DELETE",
        body: new URLSearchParams({ id }),
      }).then(() => {
        event.target.parentElement.remove();
      });
    }
  });

  function addTaskToList(task) {
    const li = document.createElement("li");
    li.classList.toggle("completed", task.is_completed);
    li.innerHTML = `
            ${task.task}
            <button class="toggle-complete" data-id="${task.id}">Complete</button>
            <button class="delete-task" data-id="${task.id}">Delete</button>
        `;
    taskList.appendChild(li);
  }
});
