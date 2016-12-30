import {
  autoinject
} from "aurelia-framework";

export class ErrorService {
  showError(error: any) {
    DevExpress.ui.dialog.alert(error, "Fehler");
  }
  logError(error: any) {

  }
  showAndLogError(error: any) {
    this.logError(error);
    this.showError(error);
  } 
}