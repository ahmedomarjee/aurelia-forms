import {
  autoinject,
  bindable,
  customAttribute
} from "aurelia-framework";
import {
  LocalizationService
} from "../../services/localization-service";
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

  expressionProvider: IExpressionProvider;

  @bindable mode: string;
  @bindable key: string;
  @bindable markdown: true;

  bind(bindingContext: any) {
    this.expressionProvider = bindingContext.expressions;
    this.setInnerHtml();
  }

  keyChanged(newValue: string, oldValue: string): void {
    this.setInnerHtml();
  }

  private setInnerHtml() {
    this.localization.translate(this.expressionProvider, this.key, (val) => {
      this.element.innerHTML = val;
    });
  }
}