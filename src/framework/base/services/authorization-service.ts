import {
  autoinject,
  Aurelia,
  BindingEngine,
} from "aurelia-framework";
import {
  RestService
} from "./rest-service";
import config from "../../../config";

@autoinject
export class AuthorizationService {
  private readonly X_TIP_AUTH = "X-TIP-AUTH";

  constructor(
    private rest: RestService,
    private aurelia: Aurelia,
    private bindingEngine: BindingEngine
  ) {
    this.bindingEngine
      .expressionObserver(this, "isLoggedIn")    
      .subscribe((newValue, oldValue) => {
        let app = "/";

        if (newValue && config["mainApp"]) {
          app = config["mainApp"]
        } else if (!newValue && config["loginApp"]) {
          app = config["loginApp"]
        }

        aurelia.setRoot(app);
      });

    this.rest.getAuthHeader = this.getAuthorizationHeaders.bind(this);
    this.rest.onUnauthorizated.register(() => {
      this.isLoggedIn = false;
      return Promise.resolve();
    });
  }
  isLoggedIn: boolean = null;

  openApp() {
    if (this.isLoggedIn) {
      return;
    }
    if (!localStorage.getItem(this.X_TIP_AUTH)) {
      this.isLoggedIn = false;
      return;
    }

    this.rest.get({
      url: this.rest.getApiUrl("base/Authorization/IsLoggedIn"),
      increaseLoadingCount: true
    }).then(r => {
      this.isLoggedIn = r.IsValid;
    });
  }
  login(data: any): Promise<boolean> {
    return this.rest.post({
      url: this.rest.getApiUrl("base/Authorization/Login"),
      data: data,
      increaseLoadingCount: true
    }).then(r => {
      if (r.IsValid) {
        this.isLoggedIn = true;
        localStorage.setItem(this.X_TIP_AUTH, r.AuthenticationToken);
        return true;
      }

      DevExpress.ui.notify("Benutzer oder Passwort ungültig", "error", 3000);
      return false;
    });
  }
  logout() {
    return this.rest.get({
      url: this.rest.getApiUrl("base/Authorization/Logout"),
      increaseLoadingCount: true
    }).then(() => {
      this.isLoggedIn = false;
      localStorage.removeItem(this.X_TIP_AUTH);
    })
  }

  private getAuthorizationHeaders(): any {
    const headers = {};

    const auth = localStorage.getItem(this.X_TIP_AUTH);
    if (auth) {
      headers[this.X_TIP_AUTH] = auth;
    }

    return headers;
  }
}