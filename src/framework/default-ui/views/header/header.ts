import {
  autoinject
} from "aurelia-framework";
import {
  RouterService
} from "../../../stack-router/export";
import {
  AuthorizationService
} from "../../../base/services/export";

@autoinject
export class Header {
  constructor(
    private router: RouterService,
    private authorization: AuthorizationService
  ) { }

  logout() {
    this.authorization.logout();
  }
}