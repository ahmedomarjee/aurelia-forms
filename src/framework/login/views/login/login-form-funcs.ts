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

    this.form.onFormAttached.register((r) => {
      this.goToUrlAfterLogin = this.history.getUrl();
      return Promise.resolve();
    });
    this.form.onFormReady.register((r) => {
      const username: DevExpress.ui.dxTextBox = (<any>this.form).username.instance;
      username.focus();
      return Promise.resolve();
    });

    form.models.data.$m_login = {
      StayLoggedOn: false
    };
  }

  loginCommand: ICommandData = {
    id: "$login",
    title: "Anmelden",
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