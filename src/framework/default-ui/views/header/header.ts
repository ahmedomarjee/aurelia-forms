import {
  autoinject
} from "aurelia-framework";
import {
  RouterService
} from "../../../stack-router/export";

@autoinject
export class Header {
  constructor(
    private router: RouterService
  ) {
    
  }
}