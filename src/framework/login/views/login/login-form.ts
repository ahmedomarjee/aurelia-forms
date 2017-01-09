import * as fwx from "../../../forms/form-export";
import {
    LoginFuncs
} from "./login-form-funcs";

@fwx.autoinject
export class LoginForm extends fwx.FormBase {
    constructor(
        formBaseImport: fwx.FormBaseImport,
        private $f: LoginFuncs) {
        super(formBaseImport);
        this.addModel({
            "id": "$m_login",
            "filters": []
        });
        this.addFunction("$f", $f, "functions.$f");
        this.widgetCreator.addTextBox(this, {
            "caption": "username_caption",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Username",
                "bindToFQ": "models.data.$m_login.Username"
            },
            "validationRules": [],
            "id": "username",
            "options": {
                "optionsName": "usernameOptions",
                "optionsNameFQ": "usernameOptions"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "mode": "password",
            "caption": "password_caption",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Password",
                "bindToFQ": "models.data.$m_login.Password"
            },
            "validationRules": [],
            "id": "password",
            "options": {
                "optionsName": "passwordOptions",
                "optionsNameFQ": "passwordOptions"
            }
        });
        this.widgetCreator.addCheckBox(this, {
            "caption": "stayloggodon_caption",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "StayLoggedOn",
                "bindToFQ": "models.data.$m_login.StayLoggedOn"
            },
            "validationRules": [],
            "id": "stayLoggodOn",
            "options": {
                "optionsName": "stayLoggodOnOptions",
                "optionsNameFQ": "stayLoggodOnOptions"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "ida134457972264fdea3bbe09007a8ee0f",
            "options": {
                "optionsName": "ida134457972264fdea3bbe09007a8ee0fOptions",
                "optionsNameFQ": "ida134457972264fdea3bbe09007a8ee0fOptions"
            },
            "binding": {
                "bindTo": "$f.loginCommand",
                "bindToFQ": "functions.$f.loginCommand",
                "propertyPrefix": "$f"
            }
        });
        super.onConstructionFinished();
    }
    title = "Anmeldedaten";
    id = "login-form";
}