import {IValidationRuleItemParameter} from "./validation-rule-item-parameter";

export interface IValidationRuleItem {
  type: string;
  parameters: IValidationRuleItemParameter[];
}