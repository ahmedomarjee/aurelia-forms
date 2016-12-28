import {
  autoinject,
  singleton
} from "aurelia-framework";
import * as Interfaces from "../interfaces/export";
import {
  FormBase
} from "../classes/form-base";

@autoinject
@singleton(true)
export class Commands {
  private form: FormBase;
  
  constructor() {}

  commands: Interfaces.ICommand[] = [];

  addInfo(command: Interfaces.ICommand) {
    this.commands.push(command);
  }

  getCommands(): Interfaces.ICommandData[] {
    return this.commands.map(i => this.form.evaluateExpression(i.binding.bindToFQ));
  }
  
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }
}