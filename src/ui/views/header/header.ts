import {
  autoinject
} from "aurelia-framework";
import {
  RouterService
} from "../../../stack-router/services/router-service";

@autoinject
export class Header {
  constructor(
    private router: RouterService
  ) {
    
  }
}