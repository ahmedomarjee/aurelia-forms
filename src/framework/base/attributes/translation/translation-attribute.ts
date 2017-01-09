import {
  autoinject,
  bindable
} from "aurelia-framework";
import {
  LocalizationService
} from "../../services/localization-service";

@autoinject
export class TrCustomAttribute {
  constructor(
    private element: Element,
    private localization: LocalizationService
  ) {}

  @bindable mode: string;
  @bindable key: string;
  @bindable markdown: true;

  bind(bindingContext: any) {
    switch(this.mode) {
      case "html": {
        this.element.innerHTML = this.localization.translate(bindingContext, this.key);
        break;
      }
      default: {
        this.element.innerHTML = this.localization.translate(bindingContext, this.key);
        break;
      }
    }
  }
}