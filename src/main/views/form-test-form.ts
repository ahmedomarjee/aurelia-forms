import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../forms/base/form-base";
import {
    WidgetCreatorService
} from "../../forms/widget-services/widget-creator-service";
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
            "id": "id96cf04a35a074cfda15495217fe53a86",
            "options": {
                "optionsName": "id96cf04a35a074cfda15495217fe53a86Options",
                "optionsNameFQ": "id96cf04a35a074cfda15495217fe53a86Options"
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
            "id": "idb2a72d4282da428c86be0030016dfcc9",
            "options": {
                "optionsName": "idb2a72d4282da428c86be0030016dfcc9Options",
                "optionsNameFQ": "idb2a72d4282da428c86be0030016dfcc9Options"
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
            "id": "idc58137d443774f57ae3c50f5e702e9d3",
            "options": {
                "optionsName": "idc58137d443774f57ae3c50f5e702e9d3Options",
                "optionsNameFQ": "idc58137d443774f57ae3c50f5e702e9d3Options"
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
            "id": "id356d87d5e1364d8e931fcb834f487040",
            "options": {
                "optionsName": "id356d87d5e1364d8e931fcb834f487040Options",
                "optionsNameFQ": "id356d87d5e1364d8e931fcb834f487040Options"
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
            "id": "idd1f2997c3c97428db09b7ebaaa9386ff",
            "options": {
                "optionsName": "idd1f2997c3c97428db09b7ebaaa9386ffOptions",
                "optionsNameFQ": "idd1f2997c3c97428db09b7ebaaa9386ffOptions"
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
            "id": "idbf9ec0185c1143f7a2120c53071b3c1a",
            "options": {
                "optionsName": "idbf9ec0185c1143f7a2120c53071b3c1aOptions",
                "optionsNameFQ": "idbf9ec0185c1143f7a2120c53071b3c1aOptions"
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
            "id": "ida2314b2c376542778ec789c3fa5394b6",
            "options": {
                "optionsName": "ida2314b2c376542778ec789c3fa5394b6Options",
                "optionsNameFQ": "ida2314b2c376542778ec789c3fa5394b6Options"
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
            "id": "idca54fcddd32b48b8bdc9cc17dda76170",
            "options": {
                "optionsName": "idca54fcddd32b48b8bdc9cc17dda76170Options",
                "optionsNameFQ": "idca54fcddd32b48b8bdc9cc17dda76170Options"
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
            "id": "id50c9c76acc2e4a5888349dee8b107c0f",
            "options": {
                "optionsName": "id50c9c76acc2e4a5888349dee8b107c0fOptions",
                "optionsNameFQ": "id50c9c76acc2e4a5888349dee8b107c0fOptions"
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
            "id": "id475226ab938c4cc6ade6f732dd5b00dc",
            "options": {
                "optionsName": "id475226ab938c4cc6ade6f732dd5b00dcOptions",
                "optionsNameFQ": "id475226ab938c4cc6ade6f732dd5b00dcOptions"
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
            "id": "idde5b290c467f41de9fa256f43310cd6a",
            "options": {
                "optionsName": "idde5b290c467f41de9fa256f43310cd6aOptions",
                "optionsNameFQ": "idde5b290c467f41de9fa256f43310cd6aOptions"
            }
        });
        this.widgetCreator.addTab(this, {
            "id": "id1cafd4fdbd284d2dad9f1bc37b89db15",
            "options": {
                "optionsName": "id1cafd4fdbd284d2dad9f1bc37b89db15Options",
                "optionsNameFQ": "id1cafd4fdbd284d2dad9f1bc37b89db15Options"
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
                "optionsName": "id31c4cad9f87d4de6b6da3a6985e1b562ToolbarOptions",
                "optionsNameFQ": "id31c4cad9f87d4de6b6da3a6985e1b562ToolbarOptions"
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
            "id": "id31c4cad9f87d4de6b6da3a6985e1b562",
            "options": {
                "optionsName": "id31c4cad9f87d4de6b6da3a6985e1b562Options",
                "optionsNameFQ": "id31c4cad9f87d4de6b6da3a6985e1b562Options"
            }
        });
    }
    @computedFrom("function.$f_Test.downloadUrl")
    get idf67a8fdb628644498a8e3de5b89f23fb() {
        return this.getFileDownloadUrl("function.$f_Test.downloadUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id357a3bb02485422e93600ad0cd857af9() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id3b017d067c6a49ac8268162a3d7c6c6b() {
        return {
            'background-image': 'url(' + this.id357a3bb02485422e93600ad0cd857af9 + ')'
        };
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id44256a8a58944467b7347b6d8655e655() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    id1cafd4fdbd284d2dad9f1bc37b89db15Selected = 0;
}