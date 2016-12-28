import {
  autoinject,
  singleton
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import * as Interfaces from "../interfaces/export";

@autoinject
@singleton(true)
export class Variables {
  private form: FormBase;
  private info: any;

  constructor() {
    this.data = {};
    this.info = {};
  }

  data: any;

  addInfo(variable: Interfaces.IVariable) {
    this.info[variable.id] = variable;
  }
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }
}