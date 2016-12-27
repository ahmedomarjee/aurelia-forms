import {
  Container
} from "aurelia-framework";
import {
  FormBase
} from "../../../forms/classes/form-base";
import {
  ICommandData
} from "../../../forms/interfaces";
import {
  AuthorizationService
} from "../../services/authorization-service";

export class LoginFuncs {
  constructor(
    private form: FormBase,
    private namespace: string
  ) {
    this.authorization = Container.instance.get(AuthorizationService);

    form.model.data.$m_login = {
      StayLoggedOn: false
    };
  }

  readonly authorization: AuthorizationService;

  loginCommand: ICommandData = {
    id: "$login",
    title: "Anmelden",
    execute: () => {
      this.authorization.login(this.form.model.data.$m_login);
    }
  };
}