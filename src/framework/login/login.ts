import {
  autoinject
} from "aurelia-framework";
import {
  RouterService
} from "../stack-router/export"

@autoinject
export class Login {
  constructor(
      private router: RouterService
  ) { }

  attached() {
    this.router.reset();
  }
}