import {
  autoinject
} from "aurelia-framework";
import {
  ILocationGoToEventArgs
} from "../event-args/export";
import {
  CustomEvent
} from "../classes/custom-event";

@autoinject
export class LocationService {
  constructor(
    public onLocationGoTo: CustomEvent<ILocationGoToEventArgs>
  ) {}

  goTo(url: string, currentViewModel: any) {
    const args: ILocationGoToEventArgs = {
      url: url,
      currentViewModel: currentViewModel,
      isHandled: false
    }

    this.onLocationGoTo
      .fire(args)
      .then(() => {
        if (!args.isHandled) {
          location.assign(url);
        }
      });
  }
}