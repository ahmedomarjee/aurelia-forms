import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  LoadingService
} from "../../services/loading-service";

@autoinject
export class Loading {
  constructor(
    private loading: LoadingService
  ) { }
}