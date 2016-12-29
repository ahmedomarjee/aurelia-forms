import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  RestService
} from "../../../base/services/rest-service";

@autoinject
export class Loading {
  constructor(
    private rest: RestService
  ) { }
}