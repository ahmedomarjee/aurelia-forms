import {
  autoinject
} from "aurelia-framework";
import {
  BindingService,
  LocalizationService,
  ScopeContainer
} from "../../base/export";

@autoinject
export class ValidationService {
  private validators: any = {};

  constructor(
    private binding: BindingService,
    private localization: LocalizationService
  ) {
    this.registerRequired();
    this.registerConditionalRequired();
    this.registerEmail();
    this.registerStringLength();
    this.registerIBAN();
    this.registerBIC();
  }

  registerValidator(type: string, callback: { (scopeContainer: ScopeContainer, caption: string, parameters: any): any }) {
    this.validators[type] = callback;
  }

  getValidator(scopeContainer: ScopeContainer, type: string, caption: string, parameters: any): any {
    const validator = this.validators[type];

    if (!validator) {
      throw new Error(`Validator ${type} not found`);
    }

    return validator(scopeContainer, caption, parameters);
  }

  private registerRequired() {
    this.registerValidator("required", (scopeContainer, caption, parameters) => {
      return {
        type: "required",
        message: this.localization.translate(
          [this.localization.translate(null, caption)],
          "forms.validator_required")
      };
    });
  }
  private registerConditionalRequired() {
    this.registerValidator("conditionalRequired", (scopeContainer, caption, parameters) => {
      return {
        type: "custom",
        reevaluate: true,
        message: this.localization.translate(
          [this.localization.translate(null, caption)],
          "forms.validator_required"),
        validationCallback: (e) => {
          if (e.value != null && e.value != "" && e.value != undefined) {
            return true;
          }

          const condition = parameters.find(p => p.name === "condition");
          if (!condition || !condition.value) {
            return false;
          }

          return !this.binding.evaluate(scopeContainer.scope, condition.value);
        }
      };
    });
  }
  private registerBIC(){
     this.registerValidator("BIC", (ScopeContainer, caption, parameters) => {
      return {
        type: "pattern",
        pattern: "^([A-Z]){4}([A-Z]){2}([0-9A-Z]){2}([0-9A-Z]{3})?$",
        message: this.localization.translate(
          [this.localization.translate(null, caption)],
          "forms.validator_bic")
      };
    });
  }
  private registerIBAN() {
    this.registerValidator("IBAN", (ScopeContainer, caption, parameters) => {
      return {
        type: "pattern",
        pattern: "[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}",
        message: this.localization.translate(
          [this.localization.translate(null, caption)],
          "forms.validator_iban")
      };
    });
  }
  private registerEmail() {
    this.registerValidator("email", (scopeContainer, caption, parameters) => {
      return {
        type: "email",
        message: this.localization.translate(
          [this.localization.translate(null, caption)],
          "forms.validator_email")
      };
    });
  }
  private registerStringLength() {
    this.registerValidator("stringLength", (scopeContainer, caption, parameters) => {
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