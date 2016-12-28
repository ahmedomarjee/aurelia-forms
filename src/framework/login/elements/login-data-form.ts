import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../forms/classes/form-base";
import {
    IFormAttachedEventArgs
} from "../../forms/event-args/form-attached";
import {
    BindingEngine
} from "aurelia-framework";
import {
    WidgetCreatorService
} from "../../forms/widget-services/widget-creator-service";
import {
    CommandService
} from "../../forms/services/command-service";
import {
    ToolbarService
} from "../../forms/services/toolbar-service";
import {
    Models
} from "../../forms/classes/models";
import {
    Variables
} from "../../forms/classes/variables";
import {
    Functions
} from "../../forms/classes/functions";
import {
    Commands
} from "../../forms/classes/commands";
import {
    CommandServerData
} from "../../forms/classes/command-server-data";
import {
    CustomEvent
} from "../../base/classes/custom-event";
import {
    LoginFuncs
} from "./login-data-form-funcs";

@autoinject
export class LoginDataForm extends FormBase {
    constructor(bindingEngine: BindingEngine, widgetCreator: WidgetCreatorService, command: CommandService, toolbar: ToolbarService, models: Models, variables: Variables, functions: Functions, commands: Commands, commandServerData: CommandServerData, onFormAttached: CustomEvent < IFormAttachedEventArgs > , private $f: LoginFuncs) {
        super(bindingEngine, widgetCreator, command, toolbar, models, variables, functions, commands, commandServerData, onFormAttached);
        this.addModel({
            "id": "$m_login",
            "filters": []
        });
        this.addFunction("$f", $f, "functions.$f");
        this.widgetCreator.addTextBox(this, {
            "caption": "Benutzername",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Username",
                "bindToFQ": "models.data.$m_login.Username"
            },
            "validationRules": [],
            "id": "idca16b7abb289497a948cadaa59744b2a",
            "options": {
                "optionsName": "idca16b7abb289497a948cadaa59744b2aOptions",
                "optionsNameFQ": "idca16b7abb289497a948cadaa59744b2aOptions"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "caption": "Passwort",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Password",
                "bindToFQ": "models.data.$m_login.Password"
            },
            "validationRules": [],
            "id": "id1fbe5b172d104e3cbc9c1b61a38e76a2",
            "options": {
                "optionsName": "id1fbe5b172d104e3cbc9c1b61a38e76a2Options",
                "optionsNameFQ": "id1fbe5b172d104e3cbc9c1b61a38e76a2Options"
            }
        });
        this.widgetCreator.addCheckBox(this, {
            "caption": "Angemeldet bleiben",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "StayLoggedOn",
                "bindToFQ": "models.data.$m_login.StayLoggedOn"
            },
            "validationRules": [],
            "id": "idf02276bfd9234915915c65c09390c499",
            "options": {
                "optionsName": "idf02276bfd9234915915c65c09390c499Options",
                "optionsNameFQ": "idf02276bfd9234915915c65c09390c499Options"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "ida671bfa0bc6d40299ab7046611179638",
            "options": {
                "optionsName": "ida671bfa0bc6d40299ab7046611179638Options",
                "optionsNameFQ": "ida671bfa0bc6d40299ab7046611179638Options"
            },
            "binding": {
                "bindTo": "$f.loginCommand",
                "bindToFQ": "functions.$f.loginCommand",
                "propertyPrefix": "$f"
            }
        });
    }
}