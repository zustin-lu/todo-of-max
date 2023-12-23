import { Todo } from "../types/Todo";

const API_BASE_URL = 'http://localhost:8080/api';

const getAllTodos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`);
    const todos: Todo[] = await response.json();
    return todos.map(t => ({
      ...t,
      date: new Date(t.date ?? '')
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

const addTodo = async (todo: Partial<Todo>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (response.ok) {
      console.log('Todo added successfully');
      return response.json();
    } else {
      console.error('Error adding todo:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding todo:', error);
  }
};

const toggleComplete = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo?id=${id}`, {
      method: 'PUT',
    });

    if (response.ok) {
      console.log('Todo status toggled successfully');
    } else {
      console.error('Error toggling todo status:', response.statusText);
    }
  } catch (error) {
    console.error('Error toggling todo status:', error);
  }
};

const deleteTodo = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Todo deleted successfully');
    } else {
      console.error('Error deleting todo:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

export default {
  getAllTodos,
  addTodo,
  toggleComplete,
  deleteTodo,
};
