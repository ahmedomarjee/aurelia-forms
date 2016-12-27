import * as Interfaces from "../interfaces";
import {
  FormBase
} from "../classes/form-base";

export class CommandInstance {
  constructor(
    private form: FormBase) {
  }

  commands: Interfaces.ICommand[] = [];

  addInfo(command: Interfaces.ICommand) {
    this.commands.push(command);
  }

  getCommands(): Interfaces.ICommandData[] {
    return this.commands.map(i => this.form.evaluateExpression(i.binding.bindToFQ));
  }
}