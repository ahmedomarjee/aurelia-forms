import {
  autoinject
} from "aurelia-framework";
import {
  LayoutService
} from "../../services/layout-service";

@autoinject
export class Content {
  constructor(
    private layout: LayoutService
  ) {
    
  }
}