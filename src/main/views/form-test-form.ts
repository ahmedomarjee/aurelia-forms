import {FormBase} from "../../framework/base/form-base";

export class FormTestForm extends FormBase  {
constructor() {
super();
this.addModel({"id":"$m_Dummy","filters":[]});
this.addTextBox({"id":"id8788cb7b19934bfb8c3d5c4d5655e75f","options":{"optionsName":"id8788cb7b19934bfb8c3d5c4d5655e75fOptions","optionsNameFQ":"id8788cb7b19934bfb8c3d5c4d5655e75fOptions"},"caption":"Stefan","binding":{"dataContext":"$m_Dummy","bindTo":"Test","bindToFQ":"models.data.$m_Dummy.Test"},"validationRules":[]});
}
}
