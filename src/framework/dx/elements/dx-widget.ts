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
  private _currentChangingProperty: string;
  private _inlines: any[] = [];

  @bindable name: string;
  @bindable options: any;
  @bindable validator: any;

  owningView: any;
  instance: any;
  validatorInstance: any;
  templates = {};
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
    this.scopeContainer = new ScopeContainer({
      bindingContext: bindingContext,
      overrideContext: overrideContext
    });
    
    this.extractTemplates();
    this.checkBindings();
  }
  unbind() {
    this.scopeContainer.disposeAll();

    this._inlines.forEach(c => c.unbind());
  }
  attached() {
    this.renderInline();

    this.options = this.options || {};
    this.options.onOptionChanged = this.onOptionChanged.bind(this);
    this.options.modelByElement = this.modelByElement.bind(this);
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
      this.removeNode(this.instance);
      this.instance = null;
    }
    if (this.validatorInstance) {
      this.removeNode(this.validatorInstance);
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

    this._inlines.forEach(c => c.detached());
  }

  isChangingProperty(propertyName: string) {
    return this._currentChangingProperty === propertyName;
  }

  resetValidation() {
    if (this.instance.option("isValid") === false) {
      this.setOptionValue("isValid", true);
    }
  }

  private modelByElement(element: any): any {
    return this.scopeContainer.scope;
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
              this.scopeContainer.scope,
              renderData.model
            );
          }
        };
        $(item).remove();
      });

      Object.assign(this.templates, this.dxTemplate.getTemplates(this.scopeContainer.scope, this.owningView.resources));
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

      const value = this.binding.evaluate(this.scopeContainer.scope, binding.expression);

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

    const currValue = this.binding.evaluate(this.scopeContainer.scope, binding.expression);

    if (currValue === e.value) {
      return;
    }

    this.binding.assign(this.scopeContainer.scope, binding.expression, e.value);
  }
  private renderInline(): void {
    $(this.element).children().each((index, child) => {
      const result = this.templatingEngine.enhance({
        element: child,
        resources: this.owningView.resources,
        bindingContext: this.scopeContainer.scope.bindingContext,
        overrideContext: this.scopeContainer.scope.overrideContext
      });

      result.attached();
      this._inlines.push(result);
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

    this._currentChangingProperty = propertyName;

    if (isValid && propertyName == "value") {
      const data = {};
      data[propertyName] = value;
      data["isValid"] = true;

      this.instance.option(data);
    } else {
      this.instance.option(propertyName, value);
    }

    this._currentChangingProperty = null;
  }
  private removeNode(instance: any) {
    const element = instance.element();

    const args: any = { type: 'dxremove', _angularIntegration: true };
    element.triggerHandler(args);

    const data = element.data(this.name);
    if (data) {
      //Dispose nicht notwendig, da dies bereits durch dxremove aufgerufen wird
      //data._dispose();
      element.removeData(this.name);
    }

    const dxComponents = element.data("dxComponents");
    if (dxComponents) {
      element.removeData("dxComponents");
    }

    while (element.childNodes) {
      element.removeChild(element.childNodes[0]);
    }
  }
}
