import {
  autoinject,
  TemplatingEngine
} from "aurelia-framework";

@autoinject
export class DxTemplateService {
  private isInitialized = false;
  private templates = {};

  constructor(
    private templatingEngine: TemplatingEngine
  ) { }

  getTemplates(bindingContext: any): any {
    if (!this.isInitialized) {
      this.initialize();
    }

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

  private initialize() {
    this.isInitialized = true;

    $("script[type='text/dx-template']")
      .each((index, item) => {
        this.templates[$(item).attr("id")] = item.firstChild.textContent;
      });
  }
}