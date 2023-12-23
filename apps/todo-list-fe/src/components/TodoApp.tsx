import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types/Todo';
import todoService from '../utils/todoService';
import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';
import { sortStrategies } from '../utils/sortStrategies';
import { filterStrategies } from '../utils/filterStrategies';
import { CommandManager } from '../commands/CommandManager';
import AddTodoCommand from '../commands/addTodoCommand';
import { Command } from '../commands/Command';

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortStrategy, setSortStrategy] = useState('date');
  const [filterStrategy, setFilterStrategy] = useState('all');
  const commandManager = CommandManager.getInstance();

  const applySortAndFilter = useCallback(() => {
    setTodos((currentTodos) =>
      sortStrategies[sortStrategy](
        filterStrategies[filterStrategy](currentTodos)
      )
    );
  }, [filterStrategy, sortStrategy]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTodos = await todoService.getAllTodos();
        setTodos(fetchedTodos);
        applySortAndFilter();
      } catch (error) {
        setError('Error fetching todos. Please try again later.');
        console.error('Error fetching todos:', error);
      }
    };

    fetchData();
  }, [applySortAndFilter]);

  useEffect(() => {
    applySortAndFilter();
  }, [applySortAndFilter]);

  const fetchTodos = async () => {
    setTodos(await todoService.getAllTodos());
    applySortAndFilter();
  };

  const handleAddTodo = async (todo: Todo) => {
    try {
      commandManager.execute(new AddTodoCommand(todo, fetchTodos));
    } catch (error) {
      setError('Error adding todo. Please try again.');
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await todoService.toggleComplete(id);

      const undoToggle = async () => {
        await todoService.toggleComplete(id);
        fetchTodos();
      };
      commandManager.execute(new Command(fetchTodos, undoToggle));
    } catch (error) {
      setError('Error toggling todo status. Please try again.');
      console.error('Error toggling todo status:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const deletedTodo = todos.find((todo) => todo.id === id);
      if (deletedTodo) {
        await todoService.deleteTodo(id);

        const undoDelete = async () => {
          await todoService.addTodo(deletedTodo);
          fetchTodos();
        };
        commandManager.execute(new Command(fetchTodos, undoDelete));
      }
    } catch (error) {
      setError('Error deleting todo. Please try again.');
      console.error('Error deleting todo:', error);
    }
  };

  const handleSortChange = async (strategy: string) => {
    setSortStrategy(strategy);
  };

  const handleFilterChange = async (strategy: string) => {
    setFilterStrategy(strategy);
  };

  return (
    <div>
      <h1>Todo List App</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <AddTodoForm onAddTodo={handleAddTodo} />
      <div>
        <label>Sort By:</label>
        <select onChange={(e) => handleSortChange(e.target.value)}>
          <option value="date">Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <div>
        <label>Filter By:</label>
        <select onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>
      <button onClick={() => commandManager.undo()}>undo</button>
      <TodoList
        todos={todos}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
};

export default App;
