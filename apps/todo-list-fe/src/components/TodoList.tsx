import { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
};

const TodoList = ({ todos, onToggleComplete, onDelete }: TodoListProps) => {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
          />
          <span
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </span>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
