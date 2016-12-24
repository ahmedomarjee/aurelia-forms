import * as Interfaces from "../interfaces";

export class VariableInstance {
    private info: any;

    constructor() {
        this.data = {};
        this.info = {};
    }

    data: any;

    addInfo(variable: Interfaces.IVariable) {
        this.info[variable.id] = variable;
    }
}