import {
  autoinject,
  bindable,
  customAttribute
} from "aurelia-framework";

@autoinject
@customAttribute("fa-icon")
export class FaIconAttribute {
  private currentIcon: string;

  constructor(
    private element: Element,
  ) {}

  @bindable icon: string;

  bind() {
    this.setClass();
  }

  iconChanged(newValue: string, oldValue: string): void {
    this.setClass();
  }

  private setClass() {
    var element = $(this.element);

    if (this.currentIcon) {
      element.removeClass(this.currentIcon);
      this.currentIcon = null;
    }

    if (this.icon) {
      this.currentIcon = `fa fa-${this.icon}`;
      element.addClass(this.currentIcon);
    }
  }
}