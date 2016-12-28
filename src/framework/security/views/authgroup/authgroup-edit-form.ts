import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../../forms/classes/form-base";
import {
    BindingEngine
} from "aurelia-framework";
import {
    WidgetCreatorService
} from "../../../forms/widget-services/widget-creator-service";
import {
    ToolbarService
} from "../../../forms/services/toolbar-service";
import {
    Models
} from "../../../forms/classes/models";
import {
    Variables
} from "../../../forms/classes/variables";
import {
    Functions
} from "../../../forms/classes/functions";
import {
    Commands
} from "../../../forms/classes/commands";
import {
    CommandServerData
} from "../../../forms/classes/command-server-data";

@autoinject
export class AuthgroupEditForm extends FormBase {
    constructor(bindingEngine: BindingEngine, widgetCreator: WidgetCreatorService, toolbar: ToolbarService, models: Models, variables: Variables, functions: Functions, commands: Commands, commandServerData: CommandServerData) {
        super(bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData);
        this.addModel({
            "id": "$m_A",
            "webApiAction": "base/Security/Authgroup",
            "key": "variables.data.$id",
            "keyProperty": "Id",
            "postOnSave": true,
            "isMain": true,
            "filters": []
        });
        this.widgetCreator.addTextBox(this, {
            "caption": "Bezeichnung",
            "binding": {
                "dataContext": "$m_A",
                "bindTo": "Name",
                "bindToFQ": "models.data.$m_A.Name"
            },
            "validationRules": [],
            "id": "idb89fe9cf87814577bf85abd0ef5cac63",
            "options": {
                "optionsName": "idb89fe9cf87814577bf85abd0ef5cac63Options",
                "optionsNameFQ": "idb89fe9cf87814577bf85abd0ef5cac63Options"
            }
        });
        this.widgetCreator.addSelectBox(this, {
            "idSelect": "mandator",
            "caption": "Mandant",
            "binding": {
                "dataContext": "$m_A",
                "bindTo": "IdMandator",
                "bindToFQ": "models.data.$m_A.IdMandator"
            },
            "validationRules": [],
            "id": "id0d9ea5edd3a447ef8aeade32e0608059",
            "options": {
                "optionsName": "id0d9ea5edd3a447ef8aeade32e0608059Options",
                "optionsNameFQ": "id0d9ea5edd3a447ef8aeade32e0608059Options"
            }
        }, {
            "id": "mandator",
            "elementName": "select-box",
            "valueMember": "Id",
            "displayMember": "Name",
            "action": "base/Security/Mandator",
            "columns": ["Name", "Id"]
        });
    }
}