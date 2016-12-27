import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../forms/classes/form-base";
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
            "id": "ide16526db93b344cda4befd0938c5fb9c",
            "options": {
                "optionsName": "ide16526db93b344cda4befd0938c5fb9cOptions",
                "optionsNameFQ": "ide16526db93b344cda4befd0938c5fb9cOptions"
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
            "id": "ide8f8e85d66f34c59bb500147dc963417",
            "options": {
                "optionsName": "ide8f8e85d66f34c59bb500147dc963417Options",
                "optionsNameFQ": "ide8f8e85d66f34c59bb500147dc963417Options"
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
            "id": "idcfbdade73f6c4afdaf7056c020352326",
            "options": {
                "optionsName": "idcfbdade73f6c4afdaf7056c020352326Options",
                "optionsNameFQ": "idcfbdade73f6c4afdaf7056c020352326Options"
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
            "id": "ida6b756b5a6e14405bc33c6abae2b4e4a",
            "options": {
                "optionsName": "ida6b756b5a6e14405bc33c6abae2b4e4aOptions",
                "optionsNameFQ": "ida6b756b5a6e14405bc33c6abae2b4e4aOptions"
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
            "id": "id8a5ba60ff9814fe195d7be78dfe16764",
            "options": {
                "optionsName": "id8a5ba60ff9814fe195d7be78dfe16764Options",
                "optionsNameFQ": "id8a5ba60ff9814fe195d7be78dfe16764Options"
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
            "id": "id0e8d1e8ab5344ccf9389c45473042259",
            "options": {
                "optionsName": "id0e8d1e8ab5344ccf9389c45473042259Options",
                "optionsNameFQ": "id0e8d1e8ab5344ccf9389c45473042259Options"
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
            "id": "id446982385961420e9778602d75a93564",
            "options": {
                "optionsName": "id446982385961420e9778602d75a93564Options",
                "optionsNameFQ": "id446982385961420e9778602d75a93564Options"
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
            "id": "idd025a78e5a494c5fa7979af3cf7cd9f4",
            "options": {
                "optionsName": "idd025a78e5a494c5fa7979af3cf7cd9f4Options",
                "optionsNameFQ": "idd025a78e5a494c5fa7979af3cf7cd9f4Options"
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
            "id": "id185b76b6e14d4e01a0516c9ad633ab17",
            "options": {
                "optionsName": "id185b76b6e14d4e01a0516c9ad633ab17Options",
                "optionsNameFQ": "id185b76b6e14d4e01a0516c9ad633ab17Options"
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
            "id": "id2f74424ab580475ead2fbb702b231e8b",
            "options": {
                "optionsName": "id2f74424ab580475ead2fbb702b231e8bOptions",
                "optionsNameFQ": "id2f74424ab580475ead2fbb702b231e8bOptions"
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
            "id": "id0a80fca494a442d185aac57219c90e2f",
            "options": {
                "optionsName": "id0a80fca494a442d185aac57219c90e2fOptions",
                "optionsNameFQ": "id0a80fca494a442d185aac57219c90e2fOptions"
            }
        });
        this.widgetCreator.addTab(this, {
            "id": "id77ac534b89bf49bba87390dd8a98fe74",
            "options": {
                "optionsName": "id77ac534b89bf49bba87390dd8a98fe74Options",
                "optionsNameFQ": "id77ac534b89bf49bba87390dd8a98fe74Options"
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
                "optionsName": "idacf5823e349e478889f4b23a9da7dbe5ToolbarOptions",
                "optionsNameFQ": "idacf5823e349e478889f4b23a9da7dbe5ToolbarOptions"
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
            "id": "idacf5823e349e478889f4b23a9da7dbe5",
            "options": {
                "optionsName": "idacf5823e349e478889f4b23a9da7dbe5Options",
                "optionsNameFQ": "idacf5823e349e478889f4b23a9da7dbe5Options"
            }
        });
    }
    @computedFrom("function.$f_Test.downloadUrl")
    get id588f98a31e9d474c990e2180d26043d0() {
        return this.getFileDownloadUrl("function.$f_Test.downloadUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id625e2be9db894459b46931dd5d34b22c() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id1005e1c72c5c4d00b19bbc321c5961b7() {
        return {
            'background-image': 'url(' + this.id625e2be9db894459b46931dd5d34b22c + ')'
        };
    }
    @computedFrom("function.$f_Test.imageUrl")
    get id4a8763b36db547c896f97cd1a2b88098() {
        return this.getFileDownloadUrl("function.$f_Test.imageUrl");
    }
    id77ac534b89bf49bba87390dd8a98fe74Selected = 0;
}