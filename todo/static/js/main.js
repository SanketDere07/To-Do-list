document.addEventListener("DOMContentLoaded", () => {
  const loginPage = document.getElementById('login-page');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('login-form');
  const todoForm = document.getElementById('todo-form');
  const logoutButton = document.getElementById('logout-button');
  const todoList = document.getElementById('todo-list');

  const apiUrl = 'http://127.0.0.1:8000/api';
  let authToken = '';

  loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const response = await fetch(`${apiUrl}/token/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
          authToken = data.access;
          loginPage.style.display = 'none';
          dashboard.style.display = 'block';
          fetchTodos();
      } else {
          alert('Login failed!');
      }
  });

  logoutButton.addEventListener('click', () => {
      authToken = '';
      loginPage.style.display = 'block';
      dashboard.style.display = 'none';
  });

  todoForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = document.getElementById('new-todo-title').value;
      const description = document.getElementById('new-todo-description').value;

      const response = await fetch(`${apiUrl}/todos/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ title, description })
      });

      if (response.ok) {
          fetchTodos();
      } else {
          alert('Failed to add to-do!');
      }
  });

  async function fetchTodos() {
      const response = await fetch(`${apiUrl}/todos/`, {
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
      });

      const todos = await response.json();
      todoList.innerHTML = '';
      todos.results.forEach(todo => {
          const todoItem = document.createElement('div');
          todoItem.className = 'todo-item';
          todoItem.innerHTML = `
              <span>${todo.title}</span>
              <button onclick="deleteTodo(${todo.id})">Delete</button>
          `;
          todoList.appendChild(todoItem);
      });
  }

  window.deleteTodo = async function (id) {
      const response = await fetch(`${apiUrl}/todos/${id}/`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
      });

      if (response.ok) {
          fetchTodos();
      } else {
          alert('Failed to delete to-do!');
      }
  };
});

todoForm.addEventListener('submit', (event) => {
  const title = document.getElementById('new-todo-title').value;
  if (!title.trim()) {
      alert('Title is required');
      event.preventDefault();
  }
});