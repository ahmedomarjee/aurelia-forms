import { autoinject } from "aurelia-framework";
import { CustomEvent } from "../classes/custom-event";
import { IWindowSizeChanged } from "../event-args/window-size-changed";

@autoinject
export class WindowService {
  constructor(
    public onWindowSizeChanged: CustomEvent<IWindowSizeChanged>
  ) {
    this.registerEvents();
  }

  private registerEvents() {
    window.addEventListener("resize", () => {
      this.onWindowSizeChanged.fire({});
    });
  }
}