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
export class NestedForms {
  private form: FormBase;
  private nestedForms: string[] = [];

  constructor() {}

  addInfo(id: string, mappings: Interfaces.IMapping[]) {
    this.nestedForms.push(id);
    this.observeMappings(id, mappings);
  }  
  getNestedForms(): FormBase[] {
    const arr: FormBase[] = [];

    this.nestedForms.forEach(i => {
      const form: FormBase = this.form[i];

      if (!form) {
        return;
      }
      
      arr.push(form);
      arr.push(...form.nestedForms.getNestedForms());
    });

    return arr;
  }
  observeMappings(id: string, mappings: Interfaces.IMapping[]) {
    for (let mapping of mappings) {
      this.form.expressions.createObserver(
        mapping.binding.bindToFQ,
        (newValue) => {
          const nestedForm: FormBase = this.form[id];
          nestedForm.variables.data[mapping.to] = newValue;
        }
      );
    }
  }

  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }
}