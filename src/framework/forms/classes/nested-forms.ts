import {
  autoinject,
  singleton
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";

@autoinject
@singleton(true)
export class NestedForms {
  private form: FormBase;
  private nestedForms: string[] = [];

  constructor() {}

  addInfo(id: string) {
    this.nestedForms.push(id);
  }  
  getNestedForms(): FormBase[] {
    const arr: FormBase[] = [];

    this.nestedForms.forEach(i => {
      const form: FormBase = this.form[i];
      arr.push(form);
      arr.push(...form.nestedForms.getNestedForms());
    });

    return arr;
  }

  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }
}