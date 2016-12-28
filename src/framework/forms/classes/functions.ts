import {
  autoinject,
  singleton
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";

@autoinject
@singleton(true)
export class Functions {
  private form: FormBase;

  constructor() {}

  add(id: string, functionInstance: any, namespace: string, customParameters?: any) {
    this[id] = functionInstance;

    if (functionInstance.bind) {
      functionInstance.bind(this.form, namespace, customParameters);
    }
  }
  
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }
}