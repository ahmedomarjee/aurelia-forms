import {
  autoinject,
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

  getTemplates(bindingContext: any, resources: any): any {
    const result = {};

    for (let templateKey in this.templates) {
      result[templateKey] = {
        render: (renderData) => {
          return this.render(
            this.templates[templateKey],
            renderData.container,
            resources,
            bindingContext,
            renderData.model
          );
        }
      };
    }

    return result;
  }

  render(template: string | Element, container: any, resources: any, bindingContext: any, model?: any): any {
    let newItem: Element | Node;

    if (typeof template === "string") {
      newItem = document.createElement("div");
      (<Element>newItem).innerHTML = template;
    } else {
      newItem = template.cloneNode(true)
    }
    
    const newElement = $(newItem).appendTo(container);

    if (model) {
      model = {
        data: model
      };
    } else {
      model = {};
    }

    const result = this.templatingEngine.enhance({
      element: newElement.get(0),
      bindingContext: bindingContext,
      overrideContext: model,
      resources: resources
    });
    result.attached();

    return $(newElement);
  }
}