import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  RouterService
} from "../stack-router/export";

const background01 = require("./images/background01.jpg");
const background02 = require("./images/background02.jpg");
const background03 = require("./images/background03.jpg");
const background04 = require("./images/background04.jpg");
const background05 = require("./images/background05.jpg");
const background06 = require("./images/background06.jpg");

@autoinject
export class Login {
  constructor(
    private router: RouterService
  ) { 
    const imageList = [background01, background02, background03, background04, background05, background06];
    const imageIndex = Math.round(Math.random() * 5);

    this.loginImageStyle = {
      "background-image": `url('${imageList[imageIndex]}')`
    };
  }

  loginImageStyle: any;

  @computedFrom("router.currentViewItem.controller.currentViewModel.title")
  get title(): string {
    if (!this.router.currentViewItem || !this.router.currentViewItem.controller) {
      return null;
    }

    const currentViewModel = this.router.currentViewItem.controller["currentViewModel"];
    if (!currentViewModel) {
      return;
    }

    return currentViewModel.title;
  }

  attached() {
    this.router.registerRoutes([
      {
        moduleId: "framework/login/views/login/login-form",
        caption: "base.login",
        route: "login"
      }
    ], "login");
  }
}