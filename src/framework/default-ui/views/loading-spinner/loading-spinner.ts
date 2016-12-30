import {
  autoinject
} from "aurelia-framework"

@autoinject
export class LoadingSpinner {
  constructor(
    private element: Element
  ) { }

  bind() {
    $(this.element).removeClass("t--loading-active");
  }
  attached() {
    setTimeout(() => {
      $(this.element).addClass("t--loading-active");
    }, 500);
  }
}