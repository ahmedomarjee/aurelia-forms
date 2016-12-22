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
            "id": "id6239e411c96c4eccb76e5f0d36441d9a",
            "options": {
                "optionsName": "id6239e411c96c4eccb76e5f0d36441d9aOptions",
                "optionsNameFQ": "id6239e411c96c4eccb76e5f0d36441d9aOptions"
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
            "id": "id661a7302a4064d9caae322583a326e49",
            "options": {
                "optionsName": "id661a7302a4064d9caae322583a326e49Options",
                "optionsNameFQ": "id661a7302a4064d9caae322583a326e49Options"
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
            "id": "id8f90dd532e114fc9a3b8acb6308c2392",
            "options": {
                "optionsName": "id8f90dd532e114fc9a3b8acb6308c2392Options",
                "optionsNameFQ": "id8f90dd532e114fc9a3b8acb6308c2392Options"
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
            "id": "ida0c09388fc1a4813a250ffe2451ffb95",
            "options": {
                "optionsName": "ida0c09388fc1a4813a250ffe2451ffb95Options",
                "optionsNameFQ": "ida0c09388fc1a4813a250ffe2451ffb95Options"
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
            "id": "id3aa2a44d80894fddb072e00d0802c723",
            "options": {
                "optionsName": "id3aa2a44d80894fddb072e00d0802c723Options",
                "optionsNameFQ": "id3aa2a44d80894fddb072e00d0802c723Options"
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
            "id": "id19537079ba274112a83e9da44f530835",
            "options": {
                "optionsName": "id19537079ba274112a83e9da44f530835Options",
                "optionsNameFQ": "id19537079ba274112a83e9da44f530835Options"
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
            "id": "idb676a4870c1c4912896a544e86cb8b67",
            "options": {
                "optionsName": "idb676a4870c1c4912896a544e86cb8b67Options",
                "optionsNameFQ": "idb676a4870c1c4912896a544e86cb8b67Options"
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
            "id": "id7c21c73da0fa4593aca30977ec9b798f",
            "options": {
                "optionsName": "id7c21c73da0fa4593aca30977ec9b798fOptions",
                "optionsNameFQ": "id7c21c73da0fa4593aca30977ec9b798fOptions"
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
            "id": "idbb36855ebe0a4285a0f8def14f6e89e6",
            "options": {
                "optionsName": "idbb36855ebe0a4285a0f8def14f6e89e6Options",
                "optionsNameFQ": "idbb36855ebe0a4285a0f8def14f6e89e6Options"
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
            "id": "id5f8ed6fb5c0c4f848595c56b65f9edf8",
            "options": {
                "optionsName": "id5f8ed6fb5c0c4f848595c56b65f9edf8Options",
                "optionsNameFQ": "id5f8ed6fb5c0c4f848595c56b65f9edf8Options"
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
            "id": "idf55195620a204d389f9ba083701f8c64",
            "options": {
                "optionsName": "idf55195620a204d389f9ba083701f8c64Options",
                "optionsNameFQ": "idf55195620a204d389f9ba083701f8c64Options"
            }
        });
        this.widgetCreator.addTab(this, {
            "id": "id74356bb5575e4de086bfc1565c1ea160",
            "options": {
                "optionsName": "id74356bb5575e4de086bfc1565c1ea160Options",
                "optionsNameFQ": "id74356bb5575e4de086bfc1565c1ea160Options"
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
                "optionsName": "id8e6f1f92da6d42aeac6aea04796fc7f3ToolbarOptions",
                "optionsNameFQ": "id8e6f1f92da6d42aeac6aea04796fc7f3ToolbarOptions"
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
            "id": "id8e6f1f92da6d42aeac6aea04796fc7f3",
            "options": {
                "optionsName": "id8e6f1f92da6d42aeac6aea04796fc7f3Options",
                "optionsNameFQ": "id8e6f1f92da6d42aeac6aea04796fc7f3Options"
            }
        });
    }
    @computedFrom("function.$f_Test.downloadUrl")
    get id563f9670d7ec40c4aa2bb9b46c54fa59() {
        return this.getFileDownloadUrl("function.$f_Test.downloadUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get ida64d7b9167f04e4dbbdaa5bbf5ae865e() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id27a8725675cd460184fa520e0cd2399c() {
        return {
            'background-image': 'url(' + this.ida64d7b9167f04e4dbbdaa5bbf5ae865e + ')'
        };
    }
    @computedFrom("function.$f_Test.imageUrl")
    get ida074ef71f42448e19d01f8de8d88864d() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    id74356bb5575e4de086bfc1565c1ea160Selected = 0;
}