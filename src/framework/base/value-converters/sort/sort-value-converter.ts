import {
  autoinject
} from "aurelia-framework";
import {
  LocalizationService
} from "../../services/export";

@autoinject
export class SortValueConverter {
  constructor(
    private localization: LocalizationService
  ) {}

  toView(data: any[], propertyName: string, direction: string = "asc", translate: boolean = false) {
    var factor = direction === "asc" ? 1 : -1;

    return data
      .slice(0)
      .sort((a, b) => {
        let valA: string = a[propertyName];
        if (valA == void(0)) {
          valA = "";
        }

        let valB: string = b[propertyName];
        if (valB == void(0)) {
          valB = "";
        }

        if (translate) {
          if (valA) {
            valA = this.localization.translate(null, valA) || "";
          }
          if (valB) {
            valB = this.localization.translate(null, valB) || "";
          }
        }

        return valA.localeCompare(valB) * factor;
      });
  }
}