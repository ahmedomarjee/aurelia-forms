import {
  autoinject
} from "aurelia-framework";
import {
  IStyleClass,
  IStyleProperty
} from "../interfaces/export";

@autoinject
export class StyleService {
  constructor() { }

  addStyles(key: string, styleClasses: IStyleClass[]) {
    this.removeStyleTag(key);

    const styleTag = document.createElement('style');
    styleTag.type = "text/css";
    styleTag.id = key;

    styleTag.appendChild(
      document.createTextNode(this.getCssClasses(styleClasses))
    );

    document.head.appendChild(styleTag);
  }
  removeStyleTag(key: string) {
    const styleTag = document.getElementById(key);

    if (styleTag){
      styleTag.remove();
    }
  }

  private getCssClasses(styleClasses: IStyleClass[]): string {
    return styleClasses
    .map(c => `\n${c.name} {\n ${this.getCssClass(c.properties)} }\n`)
    .join("");
  }
  private getCssClass(properties: IStyleProperty[]): string {
    return properties
      .map(c => `${c.propertyName}: ${c.value};\n`)
      .join("")
  }
}