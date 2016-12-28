import {
  RouterService
} from "../stack-router/export"
import {
  autoinject
} from "aurelia-framework";

@autoinject
export class LoginApp {
  constructor(
    private router: RouterService
  ) {
    router.reset();
  }
}
