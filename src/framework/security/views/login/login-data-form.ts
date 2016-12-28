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
import {
    LoginFuncs
} from "./login.funcs";

@autoinject
export class LoginDataForm extends FormBase {
    constructor(bindingEngine: BindingEngine, widgetCreator: WidgetCreatorService, toolbar: ToolbarService, models: Models, variables: Variables, functions: Functions, commands: Commands, commandServerData: CommandServerData, private $f: LoginFuncs) {
        super(bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData);
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
            "id": "id056f04d55ac74792bacac4cc66ba586c",
            "options": {
                "optionsName": "id056f04d55ac74792bacac4cc66ba586cOptions",
                "optionsNameFQ": "id056f04d55ac74792bacac4cc66ba586cOptions"
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
            "id": "idede0486d78c54618b71e2c7d13cc8d3b",
            "options": {
                "optionsName": "idede0486d78c54618b71e2c7d13cc8d3bOptions",
                "optionsNameFQ": "idede0486d78c54618b71e2c7d13cc8d3bOptions"
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
            "id": "id3304813fb84f43ac889af0d91c6d5407",
            "options": {
                "optionsName": "id3304813fb84f43ac889af0d91c6d5407Options",
                "optionsNameFQ": "id3304813fb84f43ac889af0d91c6d5407Options"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "id1db2b3d6d30b4c71b3c811be4348f200",
            "options": {
                "optionsName": "id1db2b3d6d30b4c71b3c811be4348f200Options",
                "optionsNameFQ": "id1db2b3d6d30b4c71b3c811be4348f200Options"
            },
            "binding": {
                "bindTo": "$f.loginCommand",
                "bindToFQ": "functions.$f.loginCommand",
                "propertyPrefix": "$f"
            }
        });
    }
}