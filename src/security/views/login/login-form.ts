import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../../forms/classes/form-base";
import {
    WidgetCreatorService
} from "../../../forms/widget-services/widget-creator-service";
import {
    LoginFuncs
} from "./login.funcs";

@autoinject
export class LoginForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
        this.addModel({
            "id": "$m_login",
            "filters": []
        });
        this.addFunction("$f", new LoginFuncs(this, "function.$f"));
        this.widgetCreator.addTextBox(this, {
            "caption": "Benutzername",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Username",
                "bindToFQ": "model.data.$m_login.Username"
            },
            "validationRules": [],
            "id": "id01362b21f9c84022804a1fb73694c986",
            "options": {
                "optionsName": "id01362b21f9c84022804a1fb73694c986Options",
                "optionsNameFQ": "id01362b21f9c84022804a1fb73694c986Options"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "caption": "Passwort",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Password",
                "bindToFQ": "model.data.$m_login.Password"
            },
            "validationRules": [],
            "id": "id7d0ab6f9c336408e8c47b4a30960872b",
            "options": {
                "optionsName": "id7d0ab6f9c336408e8c47b4a30960872bOptions",
                "optionsNameFQ": "id7d0ab6f9c336408e8c47b4a30960872bOptions"
            }
        });
        this.widgetCreator.addCheckBox(this, {
            "caption": "Angemeldet bleiben",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "StayLoggedOn",
                "bindToFQ": "model.data.$m_login.StayLoggedOn"
            },
            "validationRules": [],
            "id": "idd888ec1707324b3bbb9653f7ae2fc1a0",
            "options": {
                "optionsName": "idd888ec1707324b3bbb9653f7ae2fc1a0Options",
                "optionsNameFQ": "idd888ec1707324b3bbb9653f7ae2fc1a0Options"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "idae9f0b156b2d44689e184cee65cde798",
            "options": {
                "optionsName": "idae9f0b156b2d44689e184cee65cde798Options",
                "optionsNameFQ": "idae9f0b156b2d44689e184cee65cde798Options"
            },
            "binding": {
                "bindTo": "$f.loginCommand",
                "bindToFQ": "function.$f.loginCommand",
                "propertyPrefix": "$f"
            }
        });
    }
}