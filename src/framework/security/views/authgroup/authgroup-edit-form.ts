import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../../forms/classes/form-base";
import {
    IFormAttachedEventArgs
} from "../../../forms/event-args/form-attached";
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
import {
    CustomEvent
} from "../../../base/classes/custom-event";

@autoinject
export class AuthgroupEditForm extends FormBase {
    constructor(bindingEngine: BindingEngine, widgetCreator: WidgetCreatorService, command: CommandService, toolbar: ToolbarService, models: Models, variables: Variables, functions: Functions, commands: Commands, commandServerData: CommandServerData, onFormAttached: CustomEvent < IFormAttachedEventArgs > ) {
        super(bindingEngine, widgetCreator, command, toolbar, models, variables, functions, commands, commandServerData, onFormAttached);
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
            "id": "idc2102f10fd6d473c85ef52abb6c16aed",
            "options": {
                "optionsName": "idc2102f10fd6d473c85ef52abb6c16aedOptions",
                "optionsNameFQ": "idc2102f10fd6d473c85ef52abb6c16aedOptions"
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
            "id": "ida4592fc6512745da923694bfae480b25",
            "options": {
                "optionsName": "ida4592fc6512745da923694bfae480b25Options",
                "optionsNameFQ": "ida4592fc6512745da923694bfae480b25Options"
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