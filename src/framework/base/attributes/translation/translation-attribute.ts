import {
  autoinject,
  bindable,
  customAttribute,
  OverrideContext,
  Scope
} from "aurelia-framework";
import {
  LocalizationService
} from "../../services/export";
import {
  ScopeContainer
} from "../../classes/scope-container"

@autoinject
@customAttribute("tr")
export class TrCustomAttribute {
  constructor(
    private element: Element,
    private localization: LocalizationService
  ) {}

  scope: Scope;
  scopeContainer: ScopeContainer;

  @bindable mode: string;
  @bindable key: string;
  @bindable markdown: true;

  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.scope = {
      bindingContext: bindingContext,
      overrideContext: overrideContext
    };
    this.scopeContainer = new ScopeContainer(this.scope);
    this.setInnerHtml();
  }
  unbind() {
    this.scopeContainer.disposeAll();
  }

  keyChanged(newValue: string, oldValue: string): void {
    this.setInnerHtml();
  }

  private setInnerHtml() {
    this.localization.translate(this.scopeContainer, this.key, (val) => {
      this.element.innerHTML = val;
    });
  }
}