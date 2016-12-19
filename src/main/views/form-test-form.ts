import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../framework/base/form-base";
import {
    WidgetCreatorService
} from "../../framework/widget-services/widget-creator-service";
import {
    TestFunction
} from "../functions/test-function";

@autoinject
export class FormTestForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
        this.addModel({
            "id": "$m_Dummy",
            "webApiAction": "base/Security/Profile",
            "keyProperty": "Id",
            "filters": []
        });
        this.addModel({
            "id": "$m_Dummy2",
            "webApiAction": "base/Security/Profile",
            "keyProperty": "Id",
            "filters": []
        });
        this.addModel({
            "id": "$m_Dummy3",
            "webApiAction": "base/Security/Profile",
            "key": "model.data.$m_Dummy2.Id",
            "keyProperty": "Id",
            "filters": []
        });
        this.addFunction("$f_Test", new TestFunction(this, "function.$f_Test", {
            "x": 1,
            "y": 2
        }));
        this.widgetCreator.addCommand(this, {
            "id": "id9946cb9ea484461f88424bb8e7dc8c9e",
            "options": {
                "optionsName": "id9946cb9ea484461f88424bb8e7dc8c9eOptions",
                "optionsNameFQ": "id9946cb9ea484461f88424bb8e7dc8c9eOptions"
            },
            "binding": {
                "bindTo": "$f_Test.giveItToMe",
                "bindToFQ": "function.$f_Test.giveItToMe",
                "propertyPrefix": "$f_Test"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy2",
                "bindTo": "Name",
                "bindToFQ": "model.data.$m_Dummy2.Name"
            },
            "validationRules": [],
            "id": "id532cdbc10f384e9aa334f2074f7e87a0",
            "options": {
                "optionsName": "id532cdbc10f384e9aa334f2074f7e87a0Options",
                "optionsNameFQ": "id532cdbc10f384e9aa334f2074f7e87a0Options"
            }
        });
        this.widgetCreator.addDateBox(this, {
            "caption": "Date",
            "binding": {
                "dataContext": "$m_Dummy2",
                "bindTo": "ModifiedDate",
                "bindToFQ": "model.data.$m_Dummy2.ModifiedDate"
            },
            "validationRules": [],
            "id": "idccbeda4950b742bc860a18330e697ed1",
            "options": {
                "optionsName": "idccbeda4950b742bc860a18330e697ed1Options",
                "optionsNameFQ": "idccbeda4950b742bc860a18330e697ed1Options"
            }
        });
        this.widgetCreator.addNumberBox(this, {
            "caption": "Number",
            "binding": {
                "dataContext": "$m_Dummy2",
                "bindTo": "IdMandator",
                "bindToFQ": "model.data.$m_Dummy2.IdMandator"
            },
            "validationRules": [],
            "id": "idbb9580f9860b4b88bfc7ed722bc850e0",
            "options": {
                "optionsName": "idbb9580f9860b4b88bfc7ed722bc850e0Options",
                "optionsNameFQ": "idbb9580f9860b4b88bfc7ed722bc850e0Options"
            }
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy2",
                "bindTo": "Name",
                "bindToFQ": "model.data.$m_Dummy2.Name"
            },
            "validationRules": [],
            "id": "id4e125bf5a8b84225bd234c2fde6fb793",
            "options": {
                "optionsName": "id4e125bf5a8b84225bd234c2fde6fb793Options",
                "optionsNameFQ": "id4e125bf5a8b84225bd234c2fde6fb793Options"
            }
        });
        this.widgetCreator.addCalendar(this, {
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy2",
                "bindTo": "ModifiedDate",
                "bindToFQ": "model.data.$m_Dummy2.ModifiedDate"
            },
            "validationRules": [],
            "id": "id20932cb0cf8e44a69bc1d92b631b423e",
            "options": {
                "optionsName": "id20932cb0cf8e44a69bc1d92b631b423eOptions",
                "optionsNameFQ": "id20932cb0cf8e44a69bc1d92b631b423eOptions"
            }
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy2",
                "bindTo": "Name",
                "bindToFQ": "model.data.$m_Dummy2.Name"
            },
            "validationRules": [],
            "id": "ide00d362fd28c4a20ad7342ee2a7faa09",
            "options": {
                "optionsName": "ide00d362fd28c4a20ad7342ee2a7faa09Options",
                "optionsNameFQ": "ide00d362fd28c4a20ad7342ee2a7faa09Options"
            }
        });
        this.widgetCreator.addCalendar(this, {
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy2",
                "bindTo": "ModifiedDate",
                "bindToFQ": "model.data.$m_Dummy2.ModifiedDate"
            },
            "validationRules": [],
            "id": "ida8b18a5806a34f788607acc65ae6eafd",
            "options": {
                "optionsName": "ida8b18a5806a34f788607acc65ae6eafdOptions",
                "optionsNameFQ": "ida8b18a5806a34f788607acc65ae6eafdOptions"
            }
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy3",
                "bindTo": "Name",
                "bindToFQ": "model.data.$m_Dummy3.Name"
            },
            "validationRules": [],
            "id": "idc2adb7d7029841f49612bb5de77ec1f0",
            "options": {
                "optionsName": "idc2adb7d7029841f49612bb5de77ec1f0Options",
                "optionsNameFQ": "idc2adb7d7029841f49612bb5de77ec1f0Options"
            }
        });
        this.widgetCreator.addCalendar(this, {
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy3",
                "bindTo": "ModifiedDate",
                "bindToFQ": "model.data.$m_Dummy3.ModifiedDate"
            },
            "validationRules": [],
            "id": "id2b1f31d3b0eb4762858a48d8dea1b9a1",
            "options": {
                "optionsName": "id2b1f31d3b0eb4762858a48d8dea1b9a1Options",
                "optionsNameFQ": "id2b1f31d3b0eb4762858a48d8dea1b9a1Options"
            }
        });
        this.widgetCreator.addTab(this, {
            "id": "id4c66e08da5774a58a22717b33a8b0f2a",
            "options": {
                "optionsName": "id4c66e08da5774a58a22717b33a8b0f2aOptions",
                "optionsNameFQ": "id4c66e08da5774a58a22717b33a8b0f2aOptions"
            },
            "pages": [{
                "caption": "Tab 1"
            }, {
                "caption": "Tab 2",
                "onActivated": "dummyx = 1"
            }, {
                "caption": "Tab 3"
            }]
        });
        this.widgetCreator.addDataGrid(this, {
            "showFilterRow": true,
            "columns": [{
                "caption": "Name",
                "bindTo": "Name"
            }, {
                "caption": "ModifiedDate",
                "bindTo": "ModifiedDate"
            }],
            "optionsToolbar": {
                "optionsName": "id0ddb388927774bab8ab83f21e74bca75ToolbarOptions",
                "optionsNameFQ": "id0ddb388927774bab8ab83f21e74bca75ToolbarOptions"
            },
            "binding": {
                "dataContext": "$m_Dummy",
                "bindToFQ": "model.data.$m_Dummy."
            },
            "dataModel": "$m_Dummy",
            "editDataContext": "$m_Dummy2",
            "onItemClick": "$f_Test.dummyRowClickFunc(e)",
            "showToolbarTitle": true,
            "selectionMode": 1,
            "pageSize": 30,
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "id0ddb388927774bab8ab83f21e74bca75",
            "options": {
                "optionsName": "id0ddb388927774bab8ab83f21e74bca75Options",
                "optionsNameFQ": "id0ddb388927774bab8ab83f21e74bca75Options"
            }
        });
    }
    id4c66e08da5774a58a22717b33a8b0f2aSelected = 0;
}