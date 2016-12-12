import {
    inject,
    BindingEngine
} from "aurelia-framework";
import {
    FormBase
} from "../../framework/base/form-base";
import {
    WidgetCreatorService
} from "../../framework/services/widget-creator-service";
import {
    TestFunction
} from "../functions/test-function";

@inject(WidgetCreatorService)
export class FormTestForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
        this.addModel({
            "id": "$m_Dummy",
            "webApiAction": "1/2/3",
            "filters": []
        });
        this.addFunction("$f_Test", new TestFunction(this, "function.$f_Test", {
            "x": 1,
            "y": 2
        }));
        this.addCommandServerData("$m_Dummy;demoCommand", {
            "id": "demo",
            "title": "Demo Title",
            "tooltip": "Demo Tooltip",
            "location": "before",
            "locateInMenu": "never",
            "execute": "alert('Hallo')"
        });
        this.widgetCreator.addCommand(this, {
            "id": "id15afd149f40f4255861a1078464fe771",
            "options": {
                "optionsName": "id15afd149f40f4255861a1078464fe771Options",
                "optionsNameFQ": "id15afd149f40f4255861a1078464fe771Options"
            },
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "demoCommand",
                "bindToFQ": "model.data.$m_Dummy.demoCommand"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "id2d4da7a18e4e41f5b11ead35fae848fb",
            "options": {
                "optionsName": "id2d4da7a18e4e41f5b11ead35fae848fbOptions",
                "optionsNameFQ": "id2d4da7a18e4e41f5b11ead35fae848fbOptions"
            },
            "binding": {
                "bindTo": "$f_Test.giveItToMe",
                "bindToFQ": "function.$f_Test.giveItToMe",
                "propertyPrefix": "$f_Test"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "id": "id36dcbf9327c24046a967e26e98ead2eb",
            "options": {
                "optionsName": "id36dcbf9327c24046a967e26e98ead2ebOptions",
                "optionsNameFQ": "id36dcbf9327c24046a967e26e98ead2ebOptions"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": []
        });
        this.widgetCreator.addDateBox(this, {
            "id": "idc37f3b866a14493fb8f3d5b379bb7d43",
            "options": {
                "optionsName": "idc37f3b866a14493fb8f3d5b379bb7d43Options",
                "optionsNameFQ": "idc37f3b866a14493fb8f3d5b379bb7d43Options"
            },
            "caption": "Date",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": []
        });
        this.widgetCreator.addNumberBox(this, {
            "id": "id9a1cb8050a9b4eb7b045ba79624244c9",
            "options": {
                "optionsName": "id9a1cb8050a9b4eb7b045ba79624244c9Options",
                "optionsNameFQ": "id9a1cb8050a9b4eb7b045ba79624244c9Options"
            },
            "caption": "Number",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Number",
                "bindToFQ": "model.data.$m_Dummy.Number"
            },
            "validationRules": []
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "id": "id40680063929445d68aec4277524759ba",
            "options": {
                "optionsName": "id40680063929445d68aec4277524759baOptions",
                "optionsNameFQ": "id40680063929445d68aec4277524759baOptions"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": []
        });
        this.widgetCreator.addCalendar(this, {
            "id": "idd6eeb92860524de891dd295b94c26242",
            "options": {
                "optionsName": "idd6eeb92860524de891dd295b94c26242Options",
                "optionsNameFQ": "idd6eeb92860524de891dd295b94c26242Options"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": []
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "id": "id8fc8de6a2a7e4ed2acf873c5473f8030",
            "options": {
                "optionsName": "id8fc8de6a2a7e4ed2acf873c5473f8030Options",
                "optionsNameFQ": "id8fc8de6a2a7e4ed2acf873c5473f8030Options"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": []
        });
        this.widgetCreator.addCalendar(this, {
            "id": "id8ca0ae732b854fc48efcf09bab8a5d0f",
            "options": {
                "optionsName": "id8ca0ae732b854fc48efcf09bab8a5d0fOptions",
                "optionsNameFQ": "id8ca0ae732b854fc48efcf09bab8a5d0fOptions"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": []
        });
    }
}