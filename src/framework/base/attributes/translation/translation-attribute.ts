import {
  autoinject,
  bindable,
  customAttribute,
  OverrideContext
} from "aurelia-framework";
import {
  LocalizationService
} from "../../services/export";
import {
  IExpressionProvider
} from "../../interfaces/export";

@autoinject
@customAttribute("tr")
export class TrCustomAttribute {
  constructor(
    private element: Element,
    private localization: LocalizationService
  ) {}

  bindingContext: any;
  overrideContext: OverrideContext

  @bindable mode: string;
  @bindable key: string;
  @bindable markdown: true;

  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    this.setInnerHtml();
  }

  keyChanged(newValue: string, oldValue: string): void {
    this.setInnerHtml();
  }

  private setInnerHtml() {
    this.localization.translate({
        bindingContext: this.bindingContext,
        overrideContext: this.overrideContext
      }, this.key, (val) => {
      this.element.innerHTML = val;
    });
  }
}