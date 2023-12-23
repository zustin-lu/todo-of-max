import { Command as ICommand } from '../types/Command';


export class CommandManager {
  private static instance: CommandManager;
  private commands: ICommand[] = [];
  private currentCommandIndex: number = -1;

  private constructor() {
    // private constructor to prevent instantiation
  }

  static getInstance(): CommandManager {
    if (!CommandManager.instance) {
      CommandManager.instance = new CommandManager();
    }
    return CommandManager.instance;
  }

  execute(command: ICommand) {
    command.execute();
    this.commands.push(command);
    this.currentCommandIndex = this.commands.length - 1;
  }

  undo() {
    if (this.currentCommandIndex >= 0) {
      this.commands[this.currentCommandIndex].undo();
      this.currentCommandIndex -= 1;
    }
  }

  redo() {
    if (this.currentCommandIndex < this.commands.length - 1) {
      this.currentCommandIndex += 1;
      this.commands[this.currentCommandIndex].execute();
    }
  }
}
