import {
  autoinject,
  processContent,
  bindable,
  BindingEngine,
  TemplatingEngine,
  OverrideContext
} from "aurelia-framework";
import {
  DxTemplateService
} from "../services/dx-template-service";
import {
  BindingService,
  DeepObserverService,
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
  templates = {};
  bindingContext: any;
  overrideContext: any;

  constructor(
    private element: Element,
    private templatingEngine: TemplatingEngine,
    private bindingEngine: BindingEngine,
    private binding: BindingService,
    private deepObserver: DeepObserverService,
    private dxTemplate: DxTemplateService) {
  }

  created(owningView: any, myView: any) {
    this.owningView = owningView;

    this.extractTemplates();
  }
  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    
    this.checkBindings();
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

    if (this.validator) {
      element.dxValidator(this.validator);
    } else if (this.options["validators"]) {
      element.dxValidator({
        validationRules: this.options["validators"]
      });
    }
    
    this.instance = element[this.name]("instance");
    this.registerBindings();
  }
  detached() {
    if (this.instance) {
      this.instance._dispose();
      this.instance = null;
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

    if (!element.au || !element.au.controller || !element.au.controller.viewModel) {
      return null;
    }

    return element.au.controller.viewModel.bindingContext;
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
              this.owningView.resources, {
                bindingContext: this.bindingContext,
                overrideContext: this.overrideContext
              },
              renderData.model
            );
          }
        };
        $(item).remove();
      });

      Object.assign(this.templates, this.dxTemplate.getTemplates(this.bindingContext, this.overrideContext, this.owningView.resources));
  }
  private registerBindings(): void {
    if (!this.options.bindingOptions) {
      return;
    }

    for (let property in this.options.bindingOptions) {
      const binding = this.options.bindingOptions[property];

      const context = this.binding.getBindingContext(binding.parsed, {
          bindingContext: this.bindingContext,
          overrideContext: this.overrideContext
        });

      this.bindingEngine.expressionObserver(context, binding.expression)
        .subscribe((newValue, oldValue) => {
          this.setOptionValue(property, newValue);
          this.registerDeepObserver(binding, property, value);
        });

      const value = binding.parsed.evaluate({
        bindingContext: this.bindingContext,
        overrideContext: this.overrideContext
      });

      this.setOptionValue(property, value);
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

    const binding = bindingOptions[property];
    binding.parsed = this.bindingEngine.parseExpression(binding.expression);
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
      this.setOptionValue(property, value);
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

    if (!binding.parsed.isAssignable) {
      return;
    }

    const currValue = binding.parsed.evaluate({
      bindingContext: this.bindingContext,
      overrideContext: this.overrideContext
    });

    if (currValue === e.value) {
      return;
    }

    binding.parsed.assign({
      bindingContext: this.bindingContext,
      overrideContext: this.overrideContext
    }, e.value);
  }
  private renderInline(): void {
    $(this.element).children().each((index, child) => {
      const result = this.templatingEngine.enhance({
        element: child,
        bindingContext: this.bindingContext,
        overrideContext: this.overrideContext
      });

      result.attached();
    });
  }
  private setOptionValue(propertyName: string, value: any) {
    if (value == void(0) && (propertyName === "items" || propertyName === "dataSource")) {
      value = [];
    }

    this.instance.option(propertyName, value);
  }
}
