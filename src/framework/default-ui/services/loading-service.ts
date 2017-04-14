import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  RestService
} from "../../base/export";

@autoinject
export class LoadingService {
  constructor(
    private rest: RestService
  ) { }

  loadingCount: number = 0;

  @computedFrom("loadingCount", "rest.isLoading")
  get isLoading() {
    return this.loadingCount > 0
      || this.rest.isLoading;
  }

  beginLoading() {
    this.loadingCount++;
  }
  endLoading() {
    if (this.loadingCount === 0) {
      return;
    }

    this.loadingCount--;
  }
}