import {
  autoinject
} from "aurelia-framework";
import {
  LocalizationService
} from "../../base/services/localization-service";
import {
  IExpressionProvider
} from "../../base/interfaces/export";

@autoinject
export class ValidationService {
  private validators: any = {};

  constructor(
    private localization: LocalizationService
  ) {
    this.registerRequired();
    this.registerEmail();
    this.registerStringLength();
  }

  registerValidator(type: string, callback: {(expressionProvider: IExpressionProvider, caption: string, parameters: any): any}) {
    this.validators[type] = callback;
  }

  getValidator(expressionProvider: IExpressionProvider, type: string, caption: string, parameters: any): any {
    const validator = this.validators[type];

    if (!validator) {
      throw new Error(`Validator ${type} not found`);
    }

    return validator(expressionProvider, caption, parameters);
  }

  private registerRequired() {
    this.registerValidator("required", (expressionProvider, caption, parameters) => {
      return {
        type: "required",
        message: this.localization.translate(
          [this.localization.translate(null, caption)], 
          "forms.validator_required")
      };
    });
  }
  private registerEmail() {
    this.registerValidator("email", (expressionProvider, caption, parameters) => {
      return {
        type: "email",
        message: this.localization.translate(
          [this.localization.translate(null, caption)], 
          "forms.validator_email")
      };
    });
  }
  private registerStringLength() {
    this.registerValidator("stringLength", (expressionProvider, caption, parameters) => {
      if (parameters.min && parameters.max) {
        return {
          type: "stringLength",
          message: this.localization.translate(
            [this.localization.translate(null, caption), parameters.min, parameters.max], 
            "forms.validator_stringLengthMinMax")
        };
      } else if (parameters.min) {
        return {
          type: "stringLength",
          message: this.localization.translate(
            [this.localization.translate(null, caption), parameters.min], 
            "forms.validator_stringLengthMin")
        };
      } else if (parameters.max) {
        return {
          type: "stringLength",
          message: this.localization.translate(
            [this.localization.translate(null, caption), parameters.max], 
            "forms.validator_stringLengthMax")
        };
      } else {
        throw new Error("No min/max specified");
      }
    });
  }
}