import {
  autoinject,
  valueConverter
} from "aurelia-framework";
import {
  LocalizationService
} from "../../services/localization-service";

@autoinject
@valueConverter("tr")
export class TranslationValueConverter{
  constructor(
    private localization: LocalizationService
  ) {}

  toView(value: any) {
    return this.localization.translate(null, value);
  }
}