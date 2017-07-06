import {
  autoinject
} from "aurelia-framework";
import {
  ILocationGoToEventArgs
} from "../event-args/export";
import {
  CustomEvent
} from "../classes/custom-event";
import {
  IViewScrollInfo
} from "../interfaces/export";

@autoinject
export class LocationService {
  constructor(
    public onLocationGoTo: CustomEvent<ILocationGoToEventArgs>
  ) {}

  goTo(url: string, currentViewModel: any, viewScrollInfo?: IViewScrollInfo) {
    const args: ILocationGoToEventArgs = {
      url: url,
      currentViewModel: currentViewModel,
      viewScrollInfo: viewScrollInfo,
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