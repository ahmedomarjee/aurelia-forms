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

  constructor(
    private element: Element,
    private templatingEngine: TemplatingEngine,
    private bindingEngine: BindingEngine,
    private deepObserver: DeepObserverService,
    private dxTemplate: DxTemplateService) {
  }

  created(owningView: any, myView: any) {
    this.owningView = owningView;

    this.extractTemplates();
  }
  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.bindingContext = bindingContext;
    this.checkBindings();
  }
  attached() {
    this.renderInline();

    this.options = this.options || {};
    this.options.onOptionChanged = this.onOptionChanged.bind(this);
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
      this.instance.option("isValid", true);
    }
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
              this.bindingContext,
              renderData.model
            );
          }
        };
        $(item).remove();
      });

      Object.assign(this.templates, this.dxTemplate.getTemplates(this.bindingContext, this.owningView.resources));
  }
  private registerBindings(): void {
    if (!this.options.bindingOptions) {
      return;
    }

    for (let property in this.options.bindingOptions) {
      const binding = this.options.bindingOptions[property];

      this.bindingEngine.expressionObserver(this.bindingContext, binding.expression)
        .subscribe((newValue, oldValue) => {
          this.instance.option(property, newValue);
          this.registerDeepObserver(binding, property, value);
        });

      const value = binding.parsed.evaluate({
        bindingContext: this.bindingContext,
        overrideContext: null
      });

      this.instance.option(property, value);
      this.registerDeepObserver(binding, property, value);
    }
  }
  private checkBindings(): void {
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
      this.instance.option(property, value);
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

    binding.parsed.assign({
      bindingContext: this.bindingContext,
      overrideContext: null
    }, e.value);
  }
  private renderInline(): void {
    $(this.element).children().each((index, child) => {
      const result = this.templatingEngine.enhance({
        element: child,
        bindingContext: this.bindingContext
      });

      result.attached();
    });
  }
}
