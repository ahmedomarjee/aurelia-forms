import {
  autoinject
} from "aurelia-framework";

import {
  RestService
} from "./rest-service";

@autoinject
export class WebEventService {
  constructor(
    private rest: RestService
  ) { }

  execute(eventInfo: any, showLoading: boolean = false): Promise<any> {
    return this.rest.post({
      url: this.rest.getApiUrl("Event/Post"),
      increaseLoadingCount: showLoading,
      data: eventInfo
    });
  }
}