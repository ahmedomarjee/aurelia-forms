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

    if (error instanceof Error) {
      message = error.message;
    }

    DevExpress.ui.dialog.alert(message, this.localization.translate(null, "base.error"));
  }
  logError(error: any) {

  }
  showAndLogError(error: any) {
    this.logError(error);
    this.showError(error);
  } 
}