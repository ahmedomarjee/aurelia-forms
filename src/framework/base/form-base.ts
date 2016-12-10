import * as Interfaces from "../interfaces";
import * as Forms from "../forms";
import {Model} from "./model";

export class FormBase {
    model: Model;

    constructor() {
        this.model = new Model();
    }

    addModel(model: Interfaces.IModel) {
        this.model.info[model.id] = model;
    }
    addVariable(variable: Interfaces.IVariable) {

    }
    addCommand(command: Interfaces.ICommand) {

    }
    addFunction(func: Interfaces.IFunction) {

    }
    addEditPopup(editPopup: Interfaces.IEditPopup) {

    }
    addMapping(mapping: Interfaces.IMapping) {

    }

    addTextBox(options: Forms.ITextBoxOptions) {
        const textBoxOptions = {
            bindingOptions: <any>{}
        };
        
        if (options.binding && options.binding.bindToFQ) {
            textBoxOptions.bindingOptions.value = options.binding.bindToFQ; 
        }

        this[options.options.optionsName] = textBoxOptions;
    }
}