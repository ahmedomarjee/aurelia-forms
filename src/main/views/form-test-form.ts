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
            "id": "id00d43cf097e848caa490f1b09190a20f",
            "options": {
                "optionsName": "id00d43cf097e848caa490f1b09190a20fOptions",
                "optionsNameFQ": "id00d43cf097e848caa490f1b09190a20fOptions"
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
            "id": "idb3f11b286cdd4ab9a37824a1cb63897d",
            "options": {
                "optionsName": "idb3f11b286cdd4ab9a37824a1cb63897dOptions",
                "optionsNameFQ": "idb3f11b286cdd4ab9a37824a1cb63897dOptions"
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
            "id": "idfccaa22ca9b24ad49959b5cc4a33bffd",
            "options": {
                "optionsName": "idfccaa22ca9b24ad49959b5cc4a33bffdOptions",
                "optionsNameFQ": "idfccaa22ca9b24ad49959b5cc4a33bffdOptions"
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
            "id": "id89444961628245e7aaae07658bef32ad",
            "options": {
                "optionsName": "id89444961628245e7aaae07658bef32adOptions",
                "optionsNameFQ": "id89444961628245e7aaae07658bef32adOptions"
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
            "id": "id7d85e4957372416f8eae5d5db289dbe1",
            "options": {
                "optionsName": "id7d85e4957372416f8eae5d5db289dbe1Options",
                "optionsNameFQ": "id7d85e4957372416f8eae5d5db289dbe1Options"
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
            "id": "id23ea4d45a93b4c368837ceee5433a53f",
            "options": {
                "optionsName": "id23ea4d45a93b4c368837ceee5433a53fOptions",
                "optionsNameFQ": "id23ea4d45a93b4c368837ceee5433a53fOptions"
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
            "id": "idb89aee12c4474fe9b093cfcd7a5a09dd",
            "options": {
                "optionsName": "idb89aee12c4474fe9b093cfcd7a5a09ddOptions",
                "optionsNameFQ": "idb89aee12c4474fe9b093cfcd7a5a09ddOptions"
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
            "id": "idf25e0200237d4c31842724ebe678314c",
            "options": {
                "optionsName": "idf25e0200237d4c31842724ebe678314cOptions",
                "optionsNameFQ": "idf25e0200237d4c31842724ebe678314cOptions"
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
            "id": "id761630c888b24867969f1479b329c480",
            "options": {
                "optionsName": "id761630c888b24867969f1479b329c480Options",
                "optionsNameFQ": "id761630c888b24867969f1479b329c480Options"
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
            "id": "ida7e1d8a5568040fdb9c5476a47c73d61",
            "options": {
                "optionsName": "ida7e1d8a5568040fdb9c5476a47c73d61Options",
                "optionsNameFQ": "ida7e1d8a5568040fdb9c5476a47c73d61Options"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "caption": "Bezeichnung",
            "binding": {
                "dataContext": "$m_Dummy3",
                "bindTo": "Name",
                "bindToFQ": "model.data.$m_Dummy3.Name"
            },
            "validationRules": [],
            "id": "idd2d95d7ccd934384968833afca632e99",
            "options": {
                "optionsName": "idd2d95d7ccd934384968833afca632e99Options",
                "optionsNameFQ": "idd2d95d7ccd934384968833afca632e99Options"
            }
        });
        this.widgetCreator.addTab(this, {
            "id": "id1e5df8e32afa424c8f9964b5ca095350",
            "options": {
                "optionsName": "id1e5df8e32afa424c8f9964b5ca095350Options",
                "optionsNameFQ": "id1e5df8e32afa424c8f9964b5ca095350Options"
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
                "optionsName": "id2b2be4ace6ae498683513ee6f1f282cbToolbarOptions",
                "optionsNameFQ": "id2b2be4ace6ae498683513ee6f1f282cbToolbarOptions"
            },
            "binding": {
                "dataContext": "$m_Dummy",
                "bindToFQ": "model.data.$m_Dummy."
            },
            "dataModel": "$m_Dummy",
            "editDataContext": "$m_Dummy2",
            "onItemClick": "$f_Test.dummyRowClickFunc(e)",
            "selectionMode": 1,
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "id2b2be4ace6ae498683513ee6f1f282cb",
            "options": {
                "optionsName": "id2b2be4ace6ae498683513ee6f1f282cbOptions",
                "optionsNameFQ": "id2b2be4ace6ae498683513ee6f1f282cbOptions"
            }
        });
    }
    @computedFrom("function.$f_Test.downloadUrl")
    get idf52adb96454d49d3be5c114abdd5b466() {
        return this.getFileDownloadUrl("function.$f_Test.downloadUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id7abf486233a9480da3f44d4469a1f219() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get ida28db1a100fa4257a73b3cca07037145() {
        return {
            'background-image': 'url(' + this.id7abf486233a9480da3f44d4469a1f219 + ')'
        };
    }
    @computedFrom("function.$f_Test.imageUrl")
    get ida77430d27a9241a7be699c8402a06aa2() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    id1e5df8e32afa424c8f9964b5ca095350Selected = 0;
}