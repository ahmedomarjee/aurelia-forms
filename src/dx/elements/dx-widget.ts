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
} from "../services/deep-observer-service";
import * as $ from "jquery";

@autoinject
@processContent(false)
export class DxWidget {
  @bindable name: string;
  @bindable options: any;
  @bindable validator: any;

  instance: any;
  templates = new Map();
  bindingContext: any;

  constructor(
    private element: Element,
    private templatingEngine: TemplatingEngine,
    private bindingEngine: BindingEngine,
    private deepObserver: DeepObserverService) {
  }

  created(owningView: any, myView: any) {
    $(this.element)
      .children("dx-template")
      .each((index, item) => {
        const name = $(item).attr("name");
        this.templates.set(name, item);
        $(item).remove();
      });
  }
  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.bindingContext = bindingContext;
    this.__checkBindings();
  }
  attached() {
    this.__replaceTemplates(this.options);
    this.__renderInline();

    this.options = this.options || {};
    this.options.onOptionChanged = this.__onOptionChanged.bind(this);

    const element = $(this.element);
    if (!element[this.name]) {
      throw new Error(`Widget ${this.name} does not exist`);
    }

    this.validator ?
      element[this.name](this.options).dxValidator(this.validator) :
      element[this.name](this.options)

    this.instance = element[this.name]("instance");
    this.__registerBindings();
  }

  private __registerBindings(): void {
    if (!this.options.bindingOptions) {
      return;
    }

    for (let property in this.options.bindingOptions) {
      const binding = this.options.bindingOptions[property];

      this.bindingEngine.expressionObserver(this.bindingContext, binding.expression)
        .subscribe((newValue, oldValue) => {
          this.instance.option(property, newValue);
          this.__registerDeepObserver(binding, property, value);
        });

      const value = binding.parsed.evaluate({
        bindingContext: this.bindingContext,
        overrideContext: null
      });

      this.instance.option(property, value);
      this.__registerDeepObserver(binding, property, value);
    }
  }
  private __checkBindings(): void {
    if (!this.options.bindingOptions) {
      return;
    }

    for (let property in this.options.bindingOptions) {
      const binding = this.__checkBinding(property);
    }
  }
  private __checkBinding(property): void {
    const bindingOptions = this.options.bindingOptions;

    if (typeof bindingOptions[property] === "string") {
      bindingOptions[property] = {
        expression: bindingOptions[property]
      }
    }

    const binding = bindingOptions[property];
    binding.parsed = this.bindingEngine.parseExpression(binding.expression);
  }
  private __registerDeepObserver(binding, property, value): void {
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
  private __onOptionChanged(e): void {
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
  private __renderInline(): void {
    $(this.element).children().each((index, child) => {
      const result = this.templatingEngine.enhance({
        element: child,
        bindingContext: this.bindingContext
      });

      result.attached();
    });
  }
  private __replaceTemplates(obj: any): void {
    for (let key in obj) {
      if (key.endsWith("Template") && typeof obj[key] === "string") {
        obj[key] = this.__getTemplateRenderFunc(obj[key]);
      } else if (typeof obj[key] === "object" && key !== "bindingOptions" && key != "dataSource") {
        this.__replaceTemplates(obj[key]);
      }
    }
  }
  private __getTemplateRenderFunc(key: string): { (vm, itemIndex, container): any } {
    return (vm, itemIndex, container) => {
      const template = $(this.templates.get(key)).clone();

      if (container === undefined) {
        if (itemIndex === undefined) {
          container = vm;
          vm = undefined;
        } else if (itemIndex instanceof $) {
          container = itemIndex;
          itemIndex = undefined;
        } else {
          container = vm;
          vm = itemIndex;
        }
      } else if (itemIndex instanceof $) {
        let cachedItemIndex = container;

        container = itemIndex;
        itemIndex = cachedItemIndex;
      } else {
        vm = {
          data: vm
        };
      }

      container.append(template);

      const result = this.templatingEngine.enhance({
        element: $(template).get(0),
        bindingContext: vm || this.bindingContext
      });
      result.attached();

      return template;
    };
  }
}
