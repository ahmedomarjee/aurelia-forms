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
    this.localization.translate(bindingContext.expressions, this.key, (val) => {
      this.element.innerHTML = val;
    });
  }
}