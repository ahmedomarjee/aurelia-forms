import {
  autoinject,
  processContent,
  bindable,
  BindingEngine,
  TemplatingEngine,
  OverrideContext
} from "aurelia-framework";
import {
  DeepObserverService
} from "../../base/export";
import * as $ from "jquery";

@autoinject
@processContent(false)
export class DxWidget {
  @bindable name: string;
  @bindable options: any;
  @bindable validator: any;

  instance: any;
  templates = {};
  bindingContext: any;

  constructor(
    private element: Element,
    private templatingEngine: TemplatingEngine,
    private bindingEngine: BindingEngine,
    private deepObserver: DeepObserverService) {
  }

  created(owningView: any, myView: any) {
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

    const element = $(this.element);
    if (!element[this.name]) {
      throw new Error(`Widget ${this.name} does not exist`);
    }

    this.validator ?
      element[this.name](this.options).dxValidator(this.validator) :
      element[this.name](this.options)

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

  private extractTemplates(): void {
    $(this.element)
      .children("dx-template")
      .each((index, item) => {
        const itemJQuery = $(item);
        const name = itemJQuery.attr("name");
        const alias = itemJQuery.attr("alias") || "data";

        this.templates[name] = {
          render: (renderData) => {
            var newItem = item.cloneNode(true)
            const newElement = $(newItem).appendTo(renderData.container);

            let model: any = null;
            if (renderData.model) {
              model = {};
              model[alias] = renderData.model;
            }

            const result = this.templatingEngine.enhance({
              element: newElement.get(0),
              bindingContext: this.bindingContext,
              overrideContext: model
            });
            result.attached();

            return $(newElement);
          }
        };
        $(item).remove();
      });
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
