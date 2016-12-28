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
    CommandService
} from "../../../forms/services/command-service";
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
    constructor(bindingEngine: BindingEngine, widgetCreator: WidgetCreatorService, command: CommandService, toolbar: ToolbarService, models: Models, variables: Variables, functions: Functions, commands: Commands, commandServerData: CommandServerData) {
        super(bindingEngine, widgetCreator, command, toolbar, models, variables, functions, commands, commandServerData);
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
            "id": "iddcc7a5f1c567446b95ec7ae6cf773e2e",
            "options": {
                "optionsName": "iddcc7a5f1c567446b95ec7ae6cf773e2eOptions",
                "optionsNameFQ": "iddcc7a5f1c567446b95ec7ae6cf773e2eOptions"
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
            "id": "id4a5bba95221e4f0293b4468c52c70c92",
            "options": {
                "optionsName": "id4a5bba95221e4f0293b4468c52c70c92Options",
                "optionsNameFQ": "id4a5bba95221e4f0293b4468c52c70c92Options"
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