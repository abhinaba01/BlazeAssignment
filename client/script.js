let loggedIn = false;
let currentUser = "";

document.addEventListener("DOMContentLoaded", () => {
  const bodyDiv = document.getElementById("bodyDiv");
  const headerDiv = document.getElementById("headerDiv");

  if (loggedIn) {
    showDashboard(bodyDiv, headerDiv, currentUser);

  } else {
    const loginForm = createLoginForm();
    bodyDiv.appendChild(loginForm);
  }
});

function createLoginForm() {
  const loginForm = document.createElement("form");
  loginForm.addEventListener("submit", handleLogin);

  const usernameInput = document.createElement("input");
  usernameInput.setAttribute("type", "text");
  usernameInput.setAttribute("name", "username");
  usernameInput.setAttribute("placeholder", "Username");

  const passwordInput = document.createElement("input");
  passwordInput.setAttribute("type", "password");
  passwordInput.setAttribute("name", "password");
  passwordInput.setAttribute("placeholder", "Password");

  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.textContent = "Login";

  loginForm.appendChild(usernameInput);
  loginForm.appendChild(passwordInput);
  loginForm.appendChild(submitButton);

  return loginForm;
}

function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const username = formData.get("username");
  const password = formData.get("password");

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loggedIn = true;
        currentUser = username;
        const bodyDiv = document.getElementById("bodyDiv");
        const headerDiv = document.getElementById("headerDiv");
        bodyDiv.innerHTML = "";
        headerDiv.innerHTML = "";
        showDashboard(bodyDiv, headerDiv, username);
        console.log(data);
      } else {
        alert("Invalid username or password");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function showDashboard(bodyDiv, headerDiv, username) {
  const heading = document.createElement("h1");
  heading.textContent = "Welcome " + username + "!";
  const dashboardContainer = document.createElement("div");
  dashboardContainer.style.display = "flex";
  dashboardContainer.style.justifyContent = "center";
  dashboardContainer.style.gap = "20px";

  const widget1 = document.createElement("div");
  widget1.className = "widget";

  const widget2 = document.createElement("div");
  widget2.className = "widget";
  widget2.setAttribute("id", "completedList"); // Add this line

  const heading1 = document.createElement("h2");
  heading1.textContent = "To-Do List";

  const heading2 = document.createElement("h2");
  heading2.textContent = "Completed List";

  const todoList = document.createElement("ul");
  todoList.setAttribute("id", "todoList");

  const todoInput = document.createElement("input");
  todoInput.setAttribute("type", "text");
  todoInput.setAttribute("placeholder", "Add text...");

  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.addEventListener("click", handleAddTodo);
  addButton.style.marginRight = "10px"; // Add this line to create a gap

  const filterButton = document.createElement("button");
  filterButton.textContent = "Filter";
  filterButton.addEventListener("click", () => handleFilter(todoInput.value));

  widget1.appendChild(heading1);
  widget1.appendChild(todoList);
  widget1.appendChild(todoInput);
  widget1.appendChild(addButton);
  widget1.appendChild(filterButton);

  widget2.appendChild(heading2);

  dashboardContainer.appendChild(widget1);
  dashboardContainer.appendChild(widget2);

  bodyDiv.innerHTML = "";
  bodyDiv.appendChild(heading);
  bodyDiv.appendChild(dashboardContainer);

  const logoutButton = document.createElement("button");
logoutButton.textContent = "Logout";
logoutButton.className = "logout-button";
logoutButton.addEventListener("click", handleLogout);
headerDiv.appendChild(logoutButton);

  await fetch(`/${username}/todos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((todo) => {
        const todoItem = createTodoItem(todo);
        todoList.appendChild(todoItem);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Add drag and drop event listeners
  todoList.addEventListener("dragstart", handleDragStart);
  widget2.addEventListener("dragover", handleDragOver);
  widget2.addEventListener("drop", handleDrop);
}


function createTodoItem(todo) {
  const todoItem = document.createElement("ul");
  todoItem.setAttribute("id", todo.id);
  todoItem.textContent = todo.text;
  todoItem.draggable = true;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "assets/delete.png";
  deleteIcon.alt = "Delete";
  deleteIcon.classList.add("delete-icon");
  deleteButton.appendChild(deleteIcon);
  deleteButton.addEventListener("click", () => handleDeleteTodoItem(todo.id)); // Pass the todoId to the handleDeleteTodoItem function

  todoItem.appendChild(deleteButton);

  return todoItem;
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.textContent);
  event.dataTransfer.setData("text/id", event.target.id); // Set the ID of the dragged todo item
  event.target.classList.add("dragging");
}


function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const text = event.dataTransfer.getData("text/plain");
  const completedList = document.getElementById("completedList");
  const todoItem = document.createElement("ul");
  todoItem.textContent = text;
  // Set the ID of the dragged todo item
// event.dataTransfer.setData("text/id", todo.id);
const todoItemId = event.dataTransfer.getData("text/id");

  todoItem.setAttribute("id", todoItemId); // Add a unique identifier to the completed list item

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "assets/delete.png";
  deleteIcon.alt = "Delete";
  deleteIcon.classList.add("delete-icon");
  deleteButton.appendChild(deleteIcon);
  deleteButton.addEventListener("click", () => handleDeleteTodoItem(todoItemId)); // Pass the todoId to the handleDeleteTodoItem function
console.log(5,todoItemId);
  todoItem.appendChild(deleteButton);
  completedList.appendChild(todoItem);
  event.target.classList.remove("dragging");
  removeTodoItemFromList(document.getElementById("todoList"), text);
}


function removeTodoItemFromList(listElement, text) {
  const todoItems = listElement.querySelectorAll("ul"); // Select 'li' elements instead of 'ul' elements
  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].textContent === text) {
      todoItems[i].remove();
      break;
    }
  }
}

function handleAddTodo() {
  const todoInput = document.querySelector("#bodyDiv input");
  const todoText = todoInput.value;

  if (todoText.trim() === "") {
    alert("Please enter a todo item.");
    return;
  }

  fetch(`/${currentUser}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: todoText }),
  })
    .then((response) => response.json())
    .then((data) => {
      const todoList = document.getElementById("todoList");
      const todoItem = createTodoItem(data);
      todoList.appendChild(todoItem);
      todoInput.value = "";
      console.log("2", todoList);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  todoInput.value = "";
  handleFilter(""); // Clear the filter
}

function generateUniqueID() {
  return "todo-" + Date.now();
}


function handleDeleteTodoItem(todoId) {




  fetch(`/${currentUser}/todos/${todoId}`, {

    method: "DELETE",

  }).then((response) => {

    if (response.ok) {



      const todoItem = document.getElementById(todoId);

      todoItem.remove();




    } else {

      console.error("Error:", response.status);

    }

  })

    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleLogout() {
  loggedIn = false;
  currentUser = " ";
  const bodyDiv = document.getElementById("bodyDiv");
  const headerDiv = document.getElementById("headerDiv");
  bodyDiv.innerHTML = "";
  headerDiv.innerHTML = "";

  const loginForm = createLoginForm();
  bodyDiv.appendChild(loginForm);
}

function handleFilter(keyword) {
  const todoList = document.getElementById("todoList");
  const todoItems = todoList.querySelectorAll("ul");

  for (let i = 0; i < todoItems.length; i++) {
    const todoItem = todoItems[i];
    const todoText = todoItem.textContent;

    if (todoText.includes(keyword)) {
      todoItem.style.display = "block";
    } else {
      todoItem.style.display = "none";
    }
  }
}



