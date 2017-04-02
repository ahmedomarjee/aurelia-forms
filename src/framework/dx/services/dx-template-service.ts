import {
  autoinject,
  createOverrideContext,
  TemplatingEngine
} from "aurelia-framework";

@autoinject
export class DxTemplateService {
  private templates = {};

  constructor(
    private templatingEngine: TemplatingEngine
  ) { }

  registerTemplate(key: string, template: string) {
    this.templates[key] = template;
  }

  getTemplates(bindingContext: any, overrideContext: any, resources: any): any {
    const result = {};

    for (let templateKey in this.templates) {
      result[templateKey] = {
        render: (renderData) => {
          return this.render(
            this.templates[templateKey],
            renderData.container,
            resources,
            bindingContext,
            overrideContext,
            renderData.model
          );
        }
      };
    }

    return result;
  }

  render(template: string | Element, container: any, resources: any, bindingContext: any, overrideContext: any, model?: any): any {
    let newItem: Element | Node;

    if (typeof template === "string") {
      newItem = document.createElement("div");
      (<Element>newItem).innerHTML = template;
    } else {
      newItem = template.cloneNode(true)
    }
    
    const newElement = $(newItem).appendTo(container);

    let itemBindingContext: any;
    let itemOverrideContext: any;

    if (model) {
      itemBindingContext = {
        data: model
      };

      itemOverrideContext = createOverrideContext(bindingContext, overrideContext);
    } else {
      itemBindingContext = bindingContext;
      itemOverrideContext = overrideContext;
    }

    const result = this.templatingEngine.enhance({
      element: newElement.get(0),
      bindingContext: itemBindingContext,
      overrideContext: itemOverrideContext,
      resources: resources
    });
    result.attached();

    return $(newElement);
  }
}