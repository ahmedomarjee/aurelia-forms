export interface IToolbarManager {
  getItems(): DevExpress.ui.dxPopupToolbarItemOptions[];
  setItemProperty(index: number, property: string, value: any): void;
}