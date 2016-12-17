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
            "keyProperty": "feature_id",
            "webApiAction": "tx.json",
            "filters": []
        });
        this.addFunction("$f_Test", new TestFunction(this, "function.$f_Test", {
            "x": 1,
            "y": 2
        }));
        this.addCommandServerData("$m_Dummy;demoCommand", {
            "id": "demo",
            "title": "Demo Title",
            "tooltip": "Demo Tooltip",
            "location": "before",
            "locateInMenu": "never",
            "execute": "alert('Hallo')"
        });
        this.widgetCreator.addCommand(this, {
            "id": "id3cec30f3481841568654366a5ef938b4",
            "options": {
                "optionsName": "id3cec30f3481841568654366a5ef938b4Options",
                "optionsNameFQ": "id3cec30f3481841568654366a5ef938b4Options"
            },
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "demoCommand",
                "bindToFQ": "model.data.$m_Dummy.demoCommand"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "id39b61cb9fbc64613926879a0ec229f1a",
            "options": {
                "optionsName": "id39b61cb9fbc64613926879a0ec229f1aOptions",
                "optionsNameFQ": "id39b61cb9fbc64613926879a0ec229f1aOptions"
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
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": [],
            "id": "iddd0b10f6f6784b3ab0f8f120e3ffb93e",
            "options": {
                "optionsName": "iddd0b10f6f6784b3ab0f8f120e3ffb93eOptions",
                "optionsNameFQ": "iddd0b10f6f6784b3ab0f8f120e3ffb93eOptions"
            }
        });
        this.widgetCreator.addDateBox(this, {
            "caption": "Date",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": [],
            "id": "idbb2b0120934d466aa4ac031309a5b018",
            "options": {
                "optionsName": "idbb2b0120934d466aa4ac031309a5b018Options",
                "optionsNameFQ": "idbb2b0120934d466aa4ac031309a5b018Options"
            }
        });
        this.widgetCreator.addNumberBox(this, {
            "caption": "Number",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Number",
                "bindToFQ": "model.data.$m_Dummy.Number"
            },
            "validationRules": [],
            "id": "id7239e3183fb045a68c8eaf58e653a50d",
            "options": {
                "optionsName": "id7239e3183fb045a68c8eaf58e653a50dOptions",
                "optionsNameFQ": "id7239e3183fb045a68c8eaf58e653a50dOptions"
            }
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": [],
            "id": "idb9561a47599b486085c73856fcfdb96e",
            "options": {
                "optionsName": "idb9561a47599b486085c73856fcfdb96eOptions",
                "optionsNameFQ": "idb9561a47599b486085c73856fcfdb96eOptions"
            }
        });
        this.widgetCreator.addCalendar(this, {
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": [],
            "id": "idf00fece0c2744107a5429a92b0bebf33",
            "options": {
                "optionsName": "idf00fece0c2744107a5429a92b0bebf33Options",
                "optionsNameFQ": "idf00fece0c2744107a5429a92b0bebf33Options"
            }
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": [],
            "id": "id3ee8e49cc11b4027a098f402aad61356",
            "options": {
                "optionsName": "id3ee8e49cc11b4027a098f402aad61356Options",
                "optionsNameFQ": "id3ee8e49cc11b4027a098f402aad61356Options"
            }
        });
        this.widgetCreator.addCalendar(this, {
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": [],
            "id": "id696e0887b8ca47b18d7a79f3379cb06e",
            "options": {
                "optionsName": "id696e0887b8ca47b18d7a79f3379cb06eOptions",
                "optionsNameFQ": "id696e0887b8ca47b18d7a79f3379cb06eOptions"
            }
        });
        this.widgetCreator.addTab(this, {
            "id": "id6b5b031382a34acfb6578a25c4e0204b",
            "options": {
                "optionsName": "id6b5b031382a34acfb6578a25c4e0204bOptions",
                "optionsNameFQ": "id6b5b031382a34acfb6578a25c4e0204bOptions"
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
                "bindTo": "name"
            }],
            "binding": {},
            "optionsToolbar": {
                "optionsName": "id499a514991a147eda48e8efc638e629aToolbarOptions",
                "optionsNameFQ": "id499a514991a147eda48e8efc638e629aToolbarOptions"
            },
            "dataModel": "$m_Dummy",
            "onItemClick": "function.$f_Test.dummyRowClickFunc(e)",
            "showToolbarTitle": true,
            "selectionMode": 1,
            "pageSize": 30,
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "id499a514991a147eda48e8efc638e629a",
            "options": {
                "optionsName": "id499a514991a147eda48e8efc638e629aOptions",
                "optionsNameFQ": "id499a514991a147eda48e8efc638e629aOptions"
            }
        });
    }
    id6b5b031382a34acfb6578a25c4e0204bSelected = 0;
}