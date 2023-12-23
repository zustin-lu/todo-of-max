import { Command } from "../types/Command";
import { Todo } from "../types/Todo";
import todoService from "../utils/todoService";

class AddTodoCommand implements Command {
  private todo: Todo;
  private currentId: number = -1;
  private callback: () => void;

  constructor(todo: Todo, callback: () => void) {
    this.todo = todo;
    this.callback = callback;
  }

  async execute() {
    const { id } = await todoService.addTodo(this.todo);
    this.currentId = id;
    this.callback.call(null);
  }

  async undo() {
    await todoService.deleteTodo(this.currentId);
    this.callback.call(null);
  }
}

export default AddTodoCommand;
