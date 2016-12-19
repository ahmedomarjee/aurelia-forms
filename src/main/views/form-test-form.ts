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
            "key": "model.data.$m_Dummy.Id",
            "keyProperty": "Id",
            "filters": []
        });
        this.addFunction("$f_Test", new TestFunction(this, "function.$f_Test", {
            "x": 1,
            "y": 2
        }));
        this.widgetCreator.addCommand(this, {
            "id": "id63ffbcd73adc40c6b8e5b2ce40f6248f",
            "options": {
                "optionsName": "id63ffbcd73adc40c6b8e5b2ce40f6248fOptions",
                "optionsNameFQ": "id63ffbcd73adc40c6b8e5b2ce40f6248fOptions"
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
            "id": "id835c662f1a3a4cedba31bbd8490e987d",
            "options": {
                "optionsName": "id835c662f1a3a4cedba31bbd8490e987dOptions",
                "optionsNameFQ": "id835c662f1a3a4cedba31bbd8490e987dOptions"
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
            "id": "id64625c2ec6874165ba939b869b1788e5",
            "options": {
                "optionsName": "id64625c2ec6874165ba939b869b1788e5Options",
                "optionsNameFQ": "id64625c2ec6874165ba939b869b1788e5Options"
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
            "id": "idb9c66c81e7574a64b22218b889ff38ec",
            "options": {
                "optionsName": "idb9c66c81e7574a64b22218b889ff38ecOptions",
                "optionsNameFQ": "idb9c66c81e7574a64b22218b889ff38ecOptions"
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
            "id": "id598d3e31a6434d0593e30fb7f3bae5d6",
            "options": {
                "optionsName": "id598d3e31a6434d0593e30fb7f3bae5d6Options",
                "optionsNameFQ": "id598d3e31a6434d0593e30fb7f3bae5d6Options"
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
            "id": "id0974c0000e9549078374593432016186",
            "options": {
                "optionsName": "id0974c0000e9549078374593432016186Options",
                "optionsNameFQ": "id0974c0000e9549078374593432016186Options"
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
            "id": "idcdf7ba5cc38a456b9161351d356503b1",
            "options": {
                "optionsName": "idcdf7ba5cc38a456b9161351d356503b1Options",
                "optionsNameFQ": "idcdf7ba5cc38a456b9161351d356503b1Options"
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
            "id": "id4b26fac376a04baa9614f3d840814554",
            "options": {
                "optionsName": "id4b26fac376a04baa9614f3d840814554Options",
                "optionsNameFQ": "id4b26fac376a04baa9614f3d840814554Options"
            }
        });
        this.widgetCreator.addTab(this, {
            "id": "ide1ce464a03a54e18a574b3487a429e85",
            "options": {
                "optionsName": "ide1ce464a03a54e18a574b3487a429e85Options",
                "optionsNameFQ": "ide1ce464a03a54e18a574b3487a429e85Options"
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
                "optionsName": "idf09978d26c3b496a834ef2b026f67097ToolbarOptions",
                "optionsNameFQ": "idf09978d26c3b496a834ef2b026f67097ToolbarOptions"
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
            "id": "idf09978d26c3b496a834ef2b026f67097",
            "options": {
                "optionsName": "idf09978d26c3b496a834ef2b026f67097Options",
                "optionsNameFQ": "idf09978d26c3b496a834ef2b026f67097Options"
            }
        });
    }
    ide1ce464a03a54e18a574b3487a429e85Selected = 0;
}