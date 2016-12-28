import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../../../forms/classes/form-base";
import {
  ICommandData
} from "../../../forms/interfaces/export";
import {
  AuthorizationService
} from "../../../base/export";

@autoinject
export class LoginFuncs {
  private form: FormBase;
  
  constructor(
    private authorization: AuthorizationService
  ) { }

  bind(form: FormBase) {
    this.form = form;
    this.authorization.openApp();

    form.models.data.$m_login = {
      StayLoggedOn: false
    };
  }

  loginCommand: ICommandData = {
    id: "$login",
    title: "Anmelden",
    execute: () => {
      this.authorization.login(this.form.models.data.$m_login);
    }
  };
}