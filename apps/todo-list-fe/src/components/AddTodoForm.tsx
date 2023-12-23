import { useState } from 'react';
import { Todo } from '../types/Todo';

type AddTodoFormProps = {
  onAddTodo: (todo: Todo) => void;
};

const AddTodoForm = ({ onAddTodo }: AddTodoFormProps) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim() !== '') {
      onAddTodo({ text: newTodoText } as Todo);
      setNewTodoText('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="New Todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
    </div>
  );
};

export default AddTodoForm;
