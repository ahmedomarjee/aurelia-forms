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
            "id": "idf23f4e9179354a54b3b4a9e3002c0269",
            "options": {
                "optionsName": "idf23f4e9179354a54b3b4a9e3002c0269Options",
                "optionsNameFQ": "idf23f4e9179354a54b3b4a9e3002c0269Options"
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
            "id": "ideb0da9677bee4de9a0ca50d747388be0",
            "options": {
                "optionsName": "ideb0da9677bee4de9a0ca50d747388be0Options",
                "optionsNameFQ": "ideb0da9677bee4de9a0ca50d747388be0Options"
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
            "id": "idf1b9dadc783d4ecd87e5edcf43837c70",
            "options": {
                "optionsName": "idf1b9dadc783d4ecd87e5edcf43837c70Options",
                "optionsNameFQ": "idf1b9dadc783d4ecd87e5edcf43837c70Options"
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
            "id": "iddf8115245c484c629fb1cfa849d9c67d",
            "options": {
                "optionsName": "iddf8115245c484c629fb1cfa849d9c67dOptions",
                "optionsNameFQ": "iddf8115245c484c629fb1cfa849d9c67dOptions"
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
            "id": "idbb82fcbbb51341d198f9fa17d8bdda13",
            "options": {
                "optionsName": "idbb82fcbbb51341d198f9fa17d8bdda13Options",
                "optionsNameFQ": "idbb82fcbbb51341d198f9fa17d8bdda13Options"
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
            "id": "id31ba7f66966446f7a67cea79250e22ed",
            "options": {
                "optionsName": "id31ba7f66966446f7a67cea79250e22edOptions",
                "optionsNameFQ": "id31ba7f66966446f7a67cea79250e22edOptions"
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
            "id": "id2f6db68aa1ca438193d02e67d19d8706",
            "options": {
                "optionsName": "id2f6db68aa1ca438193d02e67d19d8706Options",
                "optionsNameFQ": "id2f6db68aa1ca438193d02e67d19d8706Options"
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
            "id": "id17412cc311bb4a0589ff3972417f0275",
            "options": {
                "optionsName": "id17412cc311bb4a0589ff3972417f0275Options",
                "optionsNameFQ": "id17412cc311bb4a0589ff3972417f0275Options"
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
            "id": "id1ab4f37c7d3e4a87891dc482f2ff3e06",
            "options": {
                "optionsName": "id1ab4f37c7d3e4a87891dc482f2ff3e06Options",
                "optionsNameFQ": "id1ab4f37c7d3e4a87891dc482f2ff3e06Options"
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
            "id": "idbf4c2f80c088457d911565353b54c94a",
            "options": {
                "optionsName": "idbf4c2f80c088457d911565353b54c94aOptions",
                "optionsNameFQ": "idbf4c2f80c088457d911565353b54c94aOptions"
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
            "id": "idb8876e02191743368549cc54ddc5f358",
            "options": {
                "optionsName": "idb8876e02191743368549cc54ddc5f358Options",
                "optionsNameFQ": "idb8876e02191743368549cc54ddc5f358Options"
            }
        });
        this.widgetCreator.addTab(this, {
            "id": "id6750635c68d44c89a62f9ba756c83577",
            "options": {
                "optionsName": "id6750635c68d44c89a62f9ba756c83577Options",
                "optionsNameFQ": "id6750635c68d44c89a62f9ba756c83577Options"
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
                "optionsName": "idd78697d8a9ff4b65b352b59cf3ffa871ToolbarOptions",
                "optionsNameFQ": "idd78697d8a9ff4b65b352b59cf3ffa871ToolbarOptions"
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
            "id": "idd78697d8a9ff4b65b352b59cf3ffa871",
            "options": {
                "optionsName": "idd78697d8a9ff4b65b352b59cf3ffa871Options",
                "optionsNameFQ": "idd78697d8a9ff4b65b352b59cf3ffa871Options"
            }
        });
    }
    @computedFrom("function.$f_Test.downloadUrl")
    get id388b2d330b4046578d9684d03a50dcca() {
        return this.getFileDownloadUrl("function.$f_Test.downloadUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id1ee871c2a69347c2a70e41969cf49d8c() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id8ed3dfaeeb464d159333b9b50ee6fa00() {
        return {
            'background-image': 'url(' + this.id1ee871c2a69347c2a70e41969cf49d8c + ')'
        };
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id702ea28281f5437d87cbb395d56de561() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    id6750635c68d44c89a62f9ba756c83577Selected = 0;
}