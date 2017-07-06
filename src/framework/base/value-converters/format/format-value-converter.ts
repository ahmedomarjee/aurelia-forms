import {
  autoinject,
  valueConverter
} from "aurelia-framework";
import {
  GlobalizationService
} from "../../services/globalization-service";

@autoinject
@valueConverter("format")
export class FormatValueConverter{
  constructor(
    private globalization: GlobalizationService
  ) {}

  toView(value: any, format: string) {
    return this.globalization.format(value, format);
  }
}