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

  getTemplates(bindingContext: any): any {
    const result = {};

    for (let templateKey in this.templates) {
      result[templateKey] = {
        render: (renderData) => {
          const newItem = document.createElement("div");
          newItem.innerHTML = this.templates[templateKey];
          const newElement = $(newItem).appendTo(renderData.container);

          let model: any = null;
          if (renderData.model) {
            model = {};
            model["data"] = renderData.model;
          }

          const result = this.templatingEngine.enhance({
            element: newElement.get(0),
            bindingContext: bindingContext,
            overrideContext: model
          });
          result.attached();

          return $(newElement);
        }
      };
    }

    return result;
  }
}