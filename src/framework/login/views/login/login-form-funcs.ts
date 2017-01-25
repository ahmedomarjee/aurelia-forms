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
import {
  HistoryService
} from "../../../stack-router/export";

@autoinject
export class LoginFuncs {
  private form: FormBase;
  
  constructor(
    private authorization: AuthorizationService,
    private history: HistoryService
  ) { }

  goToUrlAfterLogin: string;

  bind(form: FormBase) {
    this.form = form;

    this.goToUrlAfterLogin = this.history.lastRequestUrl;
    
    this.form.onReady.register((r) => {
      const username: DevExpress.ui.dxTextBox = this.form["username"].instance;
      username.focus();
      return Promise.resolve();
    });

    form.models.data.$m_login = {
      StayLoggedOn: false
    };
  }

  loginCommand: ICommandData = {
    id: "$login",
    title: "login-form-funcs.anmelden_caption",
    execute: () => {
      this.authorization
        .login(this.form.models.data.$m_login)
        .then(r => {
          if (r && this.goToUrlAfterLogin) {
            this.history.pipelineUrl = this.goToUrlAfterLogin;
          }
        });
    }
  };
}