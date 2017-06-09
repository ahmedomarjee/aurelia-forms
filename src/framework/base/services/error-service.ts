import {
  autoinject
} from "aurelia-framework";
import {
  LocalizationService
} from "./localization-service"

@autoinject
export class ErrorService {
  constructor(
    private localization: LocalizationService
  ) {}

  showError(error: any) {
    let message = error;

    if (error instanceof Error || error.message) {
      message = error.message;
    }

    DevExpress.ui.dialog.alert(message, this.localization.translate(null, "base.error"));
  }
  logError(error: any) {

  }
  showAndLogError(error: any) {
    if (!error) {
      return;
    }
    if (error.isHandled === true) {
      return;
    }

    this.logError(error);
    this.showError(error);
  } 
}