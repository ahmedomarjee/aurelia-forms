import {
  autoinject
} from "aurelia-framework";

@autoinject
export class GlobalPopupService {
  private _countIndependent: number = 0;
  private _countForm: number = 0;

  constructor() {}

  addIndependentPopup(popup: DevExpress.ui.dxPopup) {
    this._countIndependent++;
  }
  removeIndependentPopup(popup: DevExpress.ui.dxPopup) {
    this._countIndependent--;
  }
  addFormPopup(popup: DevExpress.ui.dxPopup) {
    this._countForm++;
  }
  removeFormPopup(popup: DevExpress.ui.dxPopup) {
    this._countForm--;
  }

  isIndependentPopupOpen() {
    return this._countIndependent > 0;
  }
  isFormPopupOpen() {
    return this._countForm > 0;
  }
  isAnyPopupOpen() {
    return this.isIndependentPopupOpen()
      || this.isFormPopupOpen();
  }
}