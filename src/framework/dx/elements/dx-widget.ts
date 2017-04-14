import {
  autoinject,
  processContent,
  bindable,
  Scope,
  TemplatingEngine,
  OverrideContext
} from "aurelia-framework";
import {
  DxTemplateService
} from "../services/dx-template-service";
import {
  BindingService,
  DeepObserverService,
  ScopeContainer
} from "../../base/export";
import * as $ from "jquery";

@autoinject
@processContent(false)
export class DxWidget {
  @bindable name: string;
  @bindable options: any;
  @bindable validator: any;

  owningView: any;
  instance: any;
  validatorInstance: any;
  templates = {};
  scope: Scope;
  scopeContainer: ScopeContainer;

  constructor(
    private element: Element,
    private templatingEngine: TemplatingEngine,
    private binding: BindingService,
    private deepObserver: DeepObserverService,
    private dxTemplate: DxTemplateService) {
  }

  created(owningView: any, myView: any) {
    this.owningView = owningView;
  }
  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.scope = {
      bindingContext: bindingContext,
      overrideContext: overrideContext
    };
    this.scopeContainer = new ScopeContainer(this.scope);
    
    this.extractTemplates();
    this.checkBindings();
  }
  unbind() {
    this.scopeContainer.disposeAll();
  }
  attached() {
    this.renderInline();

    this.options = this.options || {};
    this.options.onOptionChanged = this.onOptionChanged.bind(this);
    this.options.modelByElement = DxWidget.modelByElement;
    this.options.integrationOptions = {
      templates: this.templates
    }

    let element = $(this.element);
    if (!element[this.name]) {
      throw new Error(`Widget ${this.name} does not exist`);
    }

    element = element[this.name](this.options);

    let validatorElement;
    if (this.validator) {
      validatorElement = element.dxValidator(this.validator);
    } else if (this.options["validators"]) {
      validatorElement = element.dxValidator({
        validationRules: this.options["validators"]
      });
    }

    if (validatorElement) {
      this.validatorInstance = validatorElement.dxValidator("instance");
    }
    
    this.instance = element[this.name]("instance");
    this.registerBindings();
  }
  detached() {
    if (this.instance) {
      this.instance._dispose();
      this.instance = null;
    }
    if (this.validatorInstance) {
      this.validatorInstance._dispose();
      this.validatorInstance = null;
    }

    if (this.options && this.options.bindingOptions) {
      for (let binding of this.options.bindingOptions) {
        if (binding.deepObserver) {
          binding.deepObserver();
          binding.deepObserver = null;
        }
      }
    }
  }

  resetValidation() {
    if (this.instance.option("isValid") === false) {
      this.setOptionValue("isValid", true);
    }
  }

  private static modelByElement(element: any): any {
    if (element.jquery) {
      element = element.get(0);
    }

    if (!element.au || !element.au.controller || !element.au.controller.viewModel || !element.au.controller.viewModel.scope) {
      return null;
    }

    return element.au.controller.viewModel.scope.bindingContext;
  }
  private extractTemplates(): void {
    $(this.element)
      .children("dx-template")
      .each((index, item) => {
        const itemJQuery = $(item);
        const name = itemJQuery.attr("name");
        const alias = itemJQuery.attr("alias") || "data";

        this.templates[name] = {
          render: (renderData) => {
            return this.dxTemplate.render(
              item,
              renderData.container,
              this.owningView.resources,
              this.scope,
              renderData.model
            );
          }
        };
        $(item).remove();
      });

      Object.assign(this.templates, this.dxTemplate.getTemplates(this.scope, this.owningView.resources));
  }
  private registerBindings(): void {
    if (!this.options.bindingOptions) {
      return;
    }

    for (let property in this.options.bindingOptions) {
      const binding = this.options.bindingOptions[property];

      this.binding.observe(
        this.scopeContainer, 
        binding.expression, 
        (newValue, oldValue) => {
          this.setOptionValue(property, newValue, true);
          this.registerDeepObserver(binding, property, value);
        });

      const value = this.binding.evaluate(this.scope, binding.expression);

      this.setOptionValue(property, value, true);
      this.registerDeepObserver(binding, property, value);
    }
  }
  private checkBindings(): void {
    if (!this.options) {
      throw new Error(`Invalid or no options for ${this.name}`);
    }

    if (!this.options.bindingOptions) {
      return;
    }

    for (let property in this.options.bindingOptions) {
      const binding = this.checkBinding(property);
    }
  }
  private checkBinding(property): void {
    const bindingOptions = this.options.bindingOptions;

    if (typeof bindingOptions[property] === "string") {
      bindingOptions[property] = {
        expression: bindingOptions[property]
      }
    }
  }
  private registerDeepObserver(binding, property, value): void {
    if (binding.deepObserver) {
      binding.deepObserver();
      binding.deepObserver = null;
    }

    if (!binding.deep) {
      return;
    }

    binding.deepObserver = this.deepObserver.observe(value, () => {
      this.setOptionValue(property, value, true);
    });
  }
  private onOptionChanged(e): void {
    if (!this.options.bindingOptions) {
      return;
    }

    const binding = this.options.bindingOptions[e.name];
    if (!binding) {
      return;
    }

    const currValue = this.binding.evaluate(this.scope, binding.expression);

    if (currValue === e.value) {
      return;
    }

    this.binding.assign(this.scope, binding.expression, e.value);
  }
  private renderInline(): void {
    $(this.element).children().each((index, child) => {
      const result = this.templatingEngine.enhance({
        element: child,
        resources: this.owningView.resources,
        bindingContext: this.scope.bindingContext,
        overrideContext: this.scope.overrideContext
      });

      result.attached();
    });
  }
  private setOptionValue(propertyName: string, value: any, isValid?: boolean) {
    if (value == void(0) && (propertyName === "items" || propertyName === "dataSource")) {
      value = [];
    }

    const currentValue = this.instance.option(propertyName);
    if (currentValue === value) {
      return;
    }

    if (isValid && propertyName == "value") {
      const data = {};
      data[propertyName] = value;
      data["isValid"] = true;

      this.instance.option(data);
    } else {
      this.instance.option(propertyName, value);
    }
  }
}
