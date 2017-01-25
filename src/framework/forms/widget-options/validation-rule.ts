import {IBinding} from "../interfaces/binding";
import {IValidationRuleItem} from "./validation-rule-item";

export interface IValidationRule {
    binding?: IBinding;
    item?: IValidationRuleItem;
}