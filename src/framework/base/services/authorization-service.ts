import {
  autoinject,
  Aurelia
} from "aurelia-framework";
import {
  RestService
} from "./rest-service";
import * as config from "../../../config";

@autoinject
export class AuthorizationService {
  constructor(
    private rest: RestService,
    private aurelia: Aurelia
  ) {}

  login(data: any): Promise<boolean> {
    return this.rest.post({
      url: this.rest.getApiUrl("base/Authorization/Login"),
      data: data
    }).then(r => {
      if (r.IsValid) {
        this.aurelia.setRoot("app");
        return true;
      }

      DevExpress.ui.notify("Benutzer oder Passwort ungültig", "error", 3000);
      return false;
    });
  }
}