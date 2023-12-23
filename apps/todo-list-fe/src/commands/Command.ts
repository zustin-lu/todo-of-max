import { Command as ICommand } from '../types/Command';

type CommandFunction = () => void;

export class Command implements ICommand {
  private executeFunction: CommandFunction;
  private undoFunction: CommandFunction;

  constructor(executeFunction: CommandFunction, undoFunction: CommandFunction) {
    this.executeFunction = executeFunction;
    this.undoFunction = undoFunction;
  }

  execute() {
    this.executeFunction();
  }

  undo() {
    this.undoFunction();
  }
}
