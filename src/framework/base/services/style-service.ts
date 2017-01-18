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
      document.createTextNode(this.getCssString(styleClasses))
    );

    document.head.appendChild(styleTag);
  }
  removeStyleTag(key: string) {
    const styleTag = document.getElementById(key);

    if (styleTag){
      styleTag.remove();
    }
  }

  private getCssString(styleClasses: IStyleClass[]): string {
    return styleClasses
    .map(c => `\n${c.name} {\n ${this.addCssRule(c.properties)} }\n`)
    .join("");
  }
  private addCssRule(properties: IStyleProperty[]): string {
    return properties
      .map(c => `${c.propertyName}: ${c.value};\n`)
      .join("")
  }
}