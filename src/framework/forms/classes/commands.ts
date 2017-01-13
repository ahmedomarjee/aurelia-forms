import {
  autoinject,
  singleton
} from "aurelia-framework";
import * as Interfaces from "../interfaces/export";
import {
  FormBase
} from "../classes/form-base";
import {
  Expressions
} from "./expressions";

@autoinject
@singleton(true)
export class Commands {
  private form: FormBase;
  private expressions: Expressions;
  private commands: Interfaces.ICommand[] = [];
  private commandData: Interfaces.ICommandData[] = [];

  constructor() {}

  addCommand(commandData: Interfaces.ICommandData) {
    this.commandData.push(commandData);
  }
  addInfo(command: Interfaces.ICommand) {
    this.commands.push(command);
  }

  getCommands(): Interfaces.ICommandData[] {
    const result = this.commands.map(i => this.expressions.evaluateExpression(i.binding.bindToFQ));

    result.push(...this.commandData);

    return result;
  }
  
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
    this.expressions = form.expressions;
  }
}