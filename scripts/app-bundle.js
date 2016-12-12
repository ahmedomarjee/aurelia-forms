define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        longStackTraces: environment_1.default.debug,
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature("dx")
            .feature("resources")
            .feature("main");
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin("aurelia-testing");
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('dx/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config
            .globalResources("./elements/dx-widget");
    }
    exports.configure = configure;
});

define('framework/forms/options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/binding',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/validation-rule',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/editor-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/calendar-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/command-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/date-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/number-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/tab-page-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/tab-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/text-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/text-area-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/index',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/command',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/command-data',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/filter',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/function',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/mapping',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/model',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/variable',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/edit-popup',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/index',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/index',["require", "exports"], function (require, exports) {
    "use strict";
});

define('main/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('dx/services/deep-observer-service',["require", "exports", "aurelia-framework", "aurelia-dependency-injection"], function (require, exports, aurelia_framework_1, aurelia_dependency_injection_1) {
    "use strict";
    var DeepObserverService = (function () {
        function DeepObserverService(bindingEngine) {
            this.bindingEngine = bindingEngine;
        }
        DeepObserverService.prototype.observe = function (target, callback) {
            var subscription = new Subscription();
            this.__observe(subscription, target, callback);
            return function () {
                subscription.dispose();
            };
        };
        DeepObserverService.prototype.__observe = function (subscription, target, callback) {
            if (target == null) {
                return;
            }
            else if (target instanceof Date) {
                return;
            }
            else if (Array.isArray(target)) {
                this.__observeArray(subscription, target, callback);
            }
            else if (typeof target === "object") {
                this.__observeObject(subscription, target, callback);
            }
        };
        DeepObserverService.prototype.__observeArray = function (subscription, target, callback) {
            var _this = this;
            var newSubscription = subscription.createChildSubscription(target);
            var observer = this.bindingEngine.collectionObserver(target).subscribe(function (e) {
                for (var _i = 0, e_1 = e; _i < e_1.length; _i++) {
                    var change = e_1[_i];
                    if (change.addedCount > 0) {
                        for (var i = change.index; i < change.addedCount; i++) {
                            _this.__observe(newSubscription, target[i], callback);
                        }
                    }
                    if (change.removed.length > 0) {
                        for (var _a = 0, _b = change.removed; _a < _b.length; _a++) {
                            var item = _b[_a];
                            newSubscription.remove(item);
                        }
                    }
                }
                callback();
            });
            for (var _i = 0, target_1 = target; _i < target_1.length; _i++) {
                var item = target_1[_i];
                this.__observe(newSubscription, item, callback);
            }
        };
        DeepObserverService.prototype.__observeObject = function (subscription, target, callback) {
            var _this = this;
            var newSubscription = subscription.createChildSubscription(target);
            for (var property in target) {
                if (target.hasOwnProperty(property)) {
                    var observer = this.bindingEngine.propertyObserver(target, property).subscribe(function (newValue, oldValue) {
                        newSubscription.remove(oldValue);
                        _this.__observe(newSubscription, newValue, callback);
                        callback();
                    });
                    newSubscription.addObserver(observer);
                    this.__observe(newSubscription, target[property], callback);
                }
            }
        };
        return DeepObserverService;
    }());
    DeepObserverService = __decorate([
        aurelia_dependency_injection_1.autoinject,
        __metadata("design:paramtypes", [aurelia_framework_1.BindingEngine])
    ], DeepObserverService);
    exports.DeepObserverService = DeepObserverService;
    var Subscription = (function () {
        function Subscription() {
            this.observers = [];
            this.children = new Map();
        }
        Subscription.prototype.createChildSubscription = function (child) {
            var newSubscription = new Subscription();
            this.children.set(child, newSubscription);
            return newSubscription;
        };
        Subscription.prototype.addObserver = function (observer) {
            this.observers.push(observer);
        };
        Subscription.prototype.remove = function (child) {
            var subscription = this.children.get(child);
            if (!subscription) {
                return;
            }
            subscription.dispose();
            this.children.delete(child);
        };
        Subscription.prototype.dispose = function () {
            this.observers.forEach(function (item) {
                item.dispose();
            });
            this.children.forEach(function (item) {
                item.dispose();
            });
            this.observers = [];
        };
        return Subscription;
    }());
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('dx/elements/dx-widget',["require", "exports", "aurelia-framework", "../services/deep-observer-service", "jquery"], function (require, exports, aurelia_framework_1, deep_observer_service_1, $) {
    "use strict";
    var DxWidget = (function () {
        function DxWidget(element, templatingEngine, bindingEngine, deepObserver) {
            this.element = element;
            this.templatingEngine = templatingEngine;
            this.bindingEngine = bindingEngine;
            this.deepObserver = deepObserver;
            this.templates = new Map();
        }
        DxWidget.prototype.created = function (owningView, myView) {
            var _this = this;
            $(this.element)
                .children("dx-template")
                .each(function (index, item) {
                var name = $(item).attr("name");
                _this.templates.set(name, item);
                $(item).remove();
            });
        };
        DxWidget.prototype.bind = function (bindingContext, overrideContext) {
            this.bindingContext = bindingContext;
            this.__checkBindings();
        };
        DxWidget.prototype.attached = function () {
            this.__replaceTemplates(this.options);
            this.__renderInline();
            this.options = this.options || {};
            this.options.onOptionChanged = this.__onOptionChanged.bind(this);
            var element = $(this.element);
            if (!element[this.name]) {
                throw new Error("Widget " + this.name + " does not exist");
            }
            this.validator ?
                element[this.name](this.options).dxValidator(this.validator) :
                element[this.name](this.options);
            this.instance = element[this.name]("instance");
            this.__registerBindings();
        };
        DxWidget.prototype.__registerBindings = function () {
            var _this = this;
            if (!this.options.bindingOptions) {
                return;
            }
            var _loop_1 = function (property) {
                var binding = this_1.options.bindingOptions[property];
                this_1.bindingEngine.expressionObserver(this_1.bindingContext, binding.expression)
                    .subscribe(function (newValue, oldValue) {
                    _this.instance.option(property, newValue);
                    _this.__registerDeepObserver(binding, property, value);
                });
                var value = binding.parsed.evaluate({
                    bindingContext: this_1.bindingContext,
                    overrideContext: null
                });
                this_1.instance.option(property, value);
                this_1.__registerDeepObserver(binding, property, value);
            };
            var this_1 = this;
            for (var property in this.options.bindingOptions) {
                _loop_1(property);
            }
        };
        DxWidget.prototype.__checkBindings = function () {
            if (!this.options.bindingOptions) {
                return;
            }
            for (var property in this.options.bindingOptions) {
                var binding = this.__checkBinding(property);
            }
        };
        DxWidget.prototype.__checkBinding = function (property) {
            var bindingOptions = this.options.bindingOptions;
            if (typeof bindingOptions[property] === "string") {
                bindingOptions[property] = {
                    expression: bindingOptions[property]
                };
            }
            var binding = bindingOptions[property];
            binding.parsed = this.bindingEngine.parseExpression(binding.expression);
        };
        DxWidget.prototype.__registerDeepObserver = function (binding, property, value) {
            var _this = this;
            if (binding.deepObserver) {
                binding.deepObserver();
                binding.deepObserver = null;
            }
            if (!binding.deep) {
                return;
            }
            binding.deepObserver = this.deepObserver.observe(value, function () {
                _this.instance.option(property, value);
            });
        };
        DxWidget.prototype.__onOptionChanged = function (e) {
            if (!this.options.bindingOptions) {
                return;
            }
            var binding = this.options.bindingOptions[e.name];
            if (!binding) {
                return;
            }
            if (!binding.parsed.isAssignable) {
                return;
            }
            binding.parsed.assign({
                bindingContext: this.bindingContext,
                overrideContext: null
            }, e.value);
        };
        DxWidget.prototype.__renderInline = function () {
            var _this = this;
            $(this.element).children().each(function (index, child) {
                var result = _this.templatingEngine.enhance({
                    element: child,
                    bindingContext: _this.bindingContext
                });
                result.attached();
            });
        };
        DxWidget.prototype.__replaceTemplates = function (obj) {
            for (var key in obj) {
                if (key.endsWith("Template") && typeof obj[key] === "string") {
                    obj[key] = this.__getTemplateRenderFunc(obj[key]);
                }
                else if (typeof obj[key] === "object") {
                    this.__replaceTemplates(obj[key]);
                }
            }
        };
        DxWidget.prototype.__getTemplateRenderFunc = function (key) {
            var _this = this;
            return function (vm, itemIndex, container) {
                var template = $(_this.templates.get(key)).clone();
                if (container === undefined) {
                    if (itemIndex === undefined) {
                        container = vm;
                        vm = undefined;
                    }
                    else if (itemIndex instanceof $) {
                        container = itemIndex;
                        itemIndex = undefined;
                    }
                    else {
                        container = vm;
                        vm = itemIndex;
                    }
                }
                else if (itemIndex instanceof $) {
                    var cachedItemIndex = container;
                    container = itemIndex;
                    itemIndex = cachedItemIndex;
                }
                else {
                    vm = {
                        data: vm
                    };
                }
                container.append(template);
                var result = _this.templatingEngine.enhance({
                    element: $(template).get(0),
                    bindingContext: vm || _this.bindingContext
                });
                result.attached();
                return template;
            };
        };
        return DxWidget;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], DxWidget.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], DxWidget.prototype, "options", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], DxWidget.prototype, "validator", void 0);
    DxWidget = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.processContent(false),
        __metadata("design:paramtypes", [Element,
            aurelia_framework_1.TemplatingEngine,
            aurelia_framework_1.BindingEngine,
            deep_observer_service_1.DeepObserverService])
    ], DxWidget);
    exports.DxWidget = DxWidget;
});

define('framework/base/command-server-data-instance',["require", "exports"], function (require, exports) {
    "use strict";
    var CommandServerDataInstance = (function () {
        function CommandServerDataInstance() {
        }
        return CommandServerDataInstance;
    }());
    exports.CommandServerDataInstance = CommandServerDataInstance;
});

define('framework/base/model-instance',["require", "exports"], function (require, exports) {
    "use strict";
    var ModelInstance = (function () {
        function ModelInstance() {
            this.data = {};
            this.info = {};
        }
        return ModelInstance;
    }());
    exports.ModelInstance = ModelInstance;
});

define('framework/base/function-instance',["require", "exports"], function (require, exports) {
    "use strict";
    var FunctionInstance = (function () {
        function FunctionInstance() {
        }
        return FunctionInstance;
    }());
    exports.FunctionInstance = FunctionInstance;
});

define('framework/base/form-base',["require", "exports", "aurelia-framework", "./model-instance", "./function-instance", "./command-server-data-instance"], function (require, exports, aurelia_framework_1, model_instance_1, function_instance_1, command_server_data_instance_1) {
    "use strict";
    var FormBase = (function () {
        function FormBase() {
            this.bindingEngine = aurelia_framework_1.Container.instance.get(aurelia_framework_1.BindingEngine);
            this.model = new model_instance_1.ModelInstance();
            this.function = new function_instance_1.FunctionInstance();
            this.commandServerData = new command_server_data_instance_1.CommandServerDataInstance();
            this.expression = new Map();
        }
        FormBase.prototype.addModel = function (model) {
            this.model.info[model.id] = model;
        };
        FormBase.prototype.addVariable = function (variable) {
        };
        FormBase.prototype.addCommandServerData = function (id, commandServerData) {
            this.commandServerData[id] = commandServerData;
        };
        FormBase.prototype.addCommand = function (command) {
        };
        FormBase.prototype.addFunction = function (id, functionInstance) {
            this.function[id] = functionInstance;
        };
        FormBase.prototype.addEditPopup = function (editPopup) {
        };
        FormBase.prototype.addMapping = function (mapping) {
        };
        FormBase.prototype.createObserver = function (expression, action) {
            var observer = this.bindingEngine.expressionObserver({
                bindingContext: this,
                overrideContext: null
            }, expression);
            return observer.subscribe(action).dispose;
        };
        FormBase.prototype.evaluateExpression = function (expression) {
            var parsed = this.expression.get(expression);
            if (!parsed) {
                parsed = this.bindingEngine.parseExpression(expression);
                this.expression.set(expression, parsed);
            }
            return parsed.evaluate({
                bindingContext: this,
                overrideContext: null
            });
        };
        FormBase.prototype.getFileDownloadUrl = function (key) {
            return key;
        };
        return FormBase;
    }());
    exports.FormBase = FormBase;
});

define('framework/services/widget-creator-service',["require", "exports"], function (require, exports) {
    "use strict";
    var WidgetCreatorService = (function () {
        function WidgetCreatorService() {
        }
        WidgetCreatorService.prototype.addDateBox = function (form, options) {
            return this.createEditorOptions(form, options);
        };
        WidgetCreatorService.prototype.addCalendar = function (form, options) {
            return this.createEditorOptions(form, options);
        };
        WidgetCreatorService.prototype.addCommand = function (form, options) {
            var command;
            if (options.binding.dataContext) {
                command = form.commandServerData[options.binding.dataContext + ";" + options.binding.bindTo];
            }
            else {
                command = form.evaluateExpression(options.binding.bindToFQ);
            }
            var buttonOptions = {};
            buttonOptions.text = command.title;
            buttonOptions.hint = command.tooltip;
            buttonOptions.onClick = function () {
                if (typeof command.execute === "function") {
                    command.execute();
                }
                else if (typeof command.execute === "string") {
                    form.evaluateExpression(command.execute);
                }
                else {
                    throw new Error();
                }
            };
            form[options.options.optionsName] = buttonOptions;
            return buttonOptions;
        };
        WidgetCreatorService.prototype.addNumberBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.showClearButton) {
                editorOptions.showClearButton = true;
            }
            if (options.showSpinButtons) {
                editorOptions.showSpinButtons = true;
            }
            editorOptions.min = options.minValue || 0;
            if (options.maxValue) {
                editorOptions.max = options.maxValue;
            }
            if (options.step) {
                editorOptions.step = options.step;
            }
            return editorOptions;
        };
        WidgetCreatorService.prototype.addTab = function (form, options) {
            var tabOptions = this.createOptions(form, options);
            tabOptions.items = [];
            tabOptions.bindingOptions["selectedIndex"] = options.id + "Selected";
            options.pages.forEach(function (page) {
                var pageOptions = {
                    text: page.caption,
                    visible: true,
                    __options: page
                };
                if (page.if) {
                    form.createObserver(page.if, function (newValue) {
                        pageOptions.visible = newValue;
                    });
                }
                tabOptions.items.push(pageOptions);
            });
            tabOptions.onSelectionChanged = function (e) {
                if (!e.addedItems || e.addedItems.length === 0) {
                    return;
                }
                var page = e.addedItems[0];
                if (!page || !page.__options || !page.__options.onActivated) {
                    return;
                }
                form.evaluateExpression(page.__options.onActivated);
            };
            return tabOptions;
        };
        WidgetCreatorService.prototype.addTextBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.maxLength) {
                editorOptions.maxLength = options.maxLength;
            }
            return editorOptions;
        };
        WidgetCreatorService.prototype.addTextArea = function (form, options) {
            var editorOptions = this.addTextBox(form, options);
            if (options.height) {
                editorOptions.height = options.height;
            }
            return editorOptions;
        };
        WidgetCreatorService.prototype.createOptions = function (form, options) {
            var editorOptions = {
                bindingOptions: {}
            };
            form[options.options.optionsName] = editorOptions;
            return editorOptions;
        };
        WidgetCreatorService.prototype.createEditorOptions = function (form, options) {
            var editorOptions = this.createOptions(form, options);
            if (options.binding && options.binding.bindToFQ) {
                editorOptions.bindingOptions["value"] = options.binding.bindToFQ;
            }
            if (options.isReadOnly) {
                editorOptions.readOnly = true;
            }
            return editorOptions;
        };
        return WidgetCreatorService;
    }());
    exports.WidgetCreatorService = WidgetCreatorService;
});

define('framework/services/index',["require", "exports", "./widget-creator-service"], function (require, exports, widget_creator_service_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(widget_creator_service_1);
});

define('main/functions/test-function',["require", "exports"], function (require, exports) {
    "use strict";
    var TestFunction = (function () {
        function TestFunction(form, namespace, parameters) {
            this.form = form;
            this.namespace = namespace;
            this.parameters = parameters;
            this.dataList = [
                {
                    a: "A",
                    b: "B"
                },
                {
                    a: "A",
                    b: "B"
                },
                {
                    a: "A",
                    b: "B"
                }
            ];
            this.dummyText = {
                placeholder: "This is a dummy"
            };
            this.giveItToMe = {
                id: "giveItToMe",
                title: "Test with Func",
                execute: function () {
                    alert('Hallo');
                }
            };
            this.icon = "fa-book";
        }
        return TestFunction;
    }());
    exports.TestFunction = TestFunction;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('main/views/form-test-form',["require", "exports", "aurelia-framework", "../../framework/base/form-base", "../../framework/services/widget-creator-service", "../functions/test-function"], function (require, exports, aurelia_framework_1, form_base_1, widget_creator_service_1, test_function_1) {
    "use strict";
    var FormTestForm = (function (_super) {
        __extends(FormTestForm, _super);
        function FormTestForm(widgetCreator) {
            var _this = _super.call(this) || this;
            _this.widgetCreator = widgetCreator;
            _this.idd24402a0ae0c4b2c917f3ee9cd705572Selected = 0;
            _this.addModel({
                "id": "$m_Dummy",
                "webApiAction": "1/2/3",
                "filters": []
            });
            _this.addFunction("$f_Test", new test_function_1.TestFunction(_this, "function.$f_Test", {
                "x": 1,
                "y": 2
            }));
            _this.addCommandServerData("$m_Dummy;demoCommand", {
                "id": "demo",
                "title": "Demo Title",
                "tooltip": "Demo Tooltip",
                "location": "before",
                "locateInMenu": "never",
                "execute": "alert('Hallo')"
            });
            _this.widgetCreator.addCommand(_this, {
                "id": "id507f38819f3341fba29f40547da89b1d",
                "options": {
                    "optionsName": "id507f38819f3341fba29f40547da89b1dOptions",
                    "optionsNameFQ": "id507f38819f3341fba29f40547da89b1dOptions"
                },
                "binding": {
                    "dataContext": "$m_Dummy",
                    "bindTo": "demoCommand",
                    "bindToFQ": "model.data.$m_Dummy.demoCommand"
                }
            });
            _this.widgetCreator.addCommand(_this, {
                "id": "idf9bf7e3c96bd46c69c5b91b1668b57b4",
                "options": {
                    "optionsName": "idf9bf7e3c96bd46c69c5b91b1668b57b4Options",
                    "optionsNameFQ": "idf9bf7e3c96bd46c69c5b91b1668b57b4Options"
                },
                "binding": {
                    "bindTo": "$f_Test.giveItToMe",
                    "bindToFQ": "function.$f_Test.giveItToMe",
                    "propertyPrefix": "$f_Test"
                }
            });
            _this.widgetCreator.addTextBox(_this, {
                "id": "id3941d0f56fc64b2eb16068e156ac21f0",
                "options": {
                    "optionsName": "id3941d0f56fc64b2eb16068e156ac21f0Options",
                    "optionsNameFQ": "id3941d0f56fc64b2eb16068e156ac21f0Options"
                },
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy",
                    "bindTo": "Test",
                    "bindToFQ": "model.data.$m_Dummy.Test"
                },
                "validationRules": []
            });
            _this.widgetCreator.addDateBox(_this, {
                "id": "idb0da532db89640538d47643bc16b0104",
                "options": {
                    "optionsName": "idb0da532db89640538d47643bc16b0104Options",
                    "optionsNameFQ": "idb0da532db89640538d47643bc16b0104Options"
                },
                "caption": "Date",
                "binding": {
                    "dataContext": "$m_Dummy",
                    "bindTo": "Date",
                    "bindToFQ": "model.data.$m_Dummy.Date"
                },
                "validationRules": []
            });
            _this.widgetCreator.addNumberBox(_this, {
                "id": "id251aeae6e2e54869a9eb776b05170975",
                "options": {
                    "optionsName": "id251aeae6e2e54869a9eb776b05170975Options",
                    "optionsNameFQ": "id251aeae6e2e54869a9eb776b05170975Options"
                },
                "caption": "Number",
                "binding": {
                    "dataContext": "$m_Dummy",
                    "bindTo": "Number",
                    "bindToFQ": "model.data.$m_Dummy.Number"
                },
                "validationRules": []
            });
            _this.widgetCreator.addTextArea(_this, {
                "height": "200px",
                "id": "ide267c1b49885426d9fb090d8bc71d246",
                "options": {
                    "optionsName": "ide267c1b49885426d9fb090d8bc71d246Options",
                    "optionsNameFQ": "ide267c1b49885426d9fb090d8bc71d246Options"
                },
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy",
                    "bindTo": "Test",
                    "bindToFQ": "model.data.$m_Dummy.Test"
                },
                "validationRules": []
            });
            _this.widgetCreator.addCalendar(_this, {
                "id": "id376b81433dea42869f3035676512a77c",
                "options": {
                    "optionsName": "id376b81433dea42869f3035676512a77cOptions",
                    "optionsNameFQ": "id376b81433dea42869f3035676512a77cOptions"
                },
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy",
                    "bindTo": "Date",
                    "bindToFQ": "model.data.$m_Dummy.Date"
                },
                "validationRules": []
            });
            _this.widgetCreator.addTextArea(_this, {
                "height": "200px",
                "id": "idc60ec180710943b2b9bb67d03b125997",
                "options": {
                    "optionsName": "idc60ec180710943b2b9bb67d03b125997Options",
                    "optionsNameFQ": "idc60ec180710943b2b9bb67d03b125997Options"
                },
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy",
                    "bindTo": "Test",
                    "bindToFQ": "model.data.$m_Dummy.Test"
                },
                "validationRules": []
            });
            _this.widgetCreator.addCalendar(_this, {
                "id": "id7c1d82f61cd64bb2bd01284b9a948999",
                "options": {
                    "optionsName": "id7c1d82f61cd64bb2bd01284b9a948999Options",
                    "optionsNameFQ": "id7c1d82f61cd64bb2bd01284b9a948999Options"
                },
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy",
                    "bindTo": "Date",
                    "bindToFQ": "model.data.$m_Dummy.Date"
                },
                "validationRules": []
            });
            _this.widgetCreator.addTab(_this, {
                "id": "idd24402a0ae0c4b2c917f3ee9cd705572",
                "options": {
                    "optionsName": "idd24402a0ae0c4b2c917f3ee9cd705572Options",
                    "optionsNameFQ": "idd24402a0ae0c4b2c917f3ee9cd705572Options"
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
            return _this;
        }
        return FormTestForm;
    }(form_base_1.FormBase));
    FormTestForm = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [widget_creator_service_1.WidgetCreatorService])
    ], FormTestForm);
    exports.FormTestForm = FormTestForm;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"bootstrap/css/bootstrap.min.css\"></require>\r\n  <require from=\"devextreme/css/dx.common.css\"></require>\r\n  <require from=\"devextreme/css/dx.light.compact.css\"></require>\r\n  <require from=\"./main/views/form-test-form\"></require>\r\n\r\n  <div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n      <form-test-form></form-test-form>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!dx/elements/dx-widget.html', ['module'], function(module) { module.exports = "<template class=\"dx-widget\">\n    <require from=\"devextreme\"></require>\n</template>"; });
define('text!main/htmls/dummy.html', ['module'], function(module) { module.exports = "<div>\r\n    Ich bin ein Dummy-Html\r\n</div>"; });
define('text!main/views/form-test-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"col-xs-12\">\n        <div class=\"tip-form-element-flex-box\">\n            <div class=\"tip-margin-top\">\n                <h1>${model.data.$m_Dummy.Test}</h1>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h2>${model.data.$m_Dummy.Test}</h2>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h3>${model.data.$m_Dummy.Test}</h3>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h4>${model.data.$m_Dummy.Test}</h4>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h5>${model.data.$m_Dummy.Test}</h5>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h6>${model.data.$m_Dummy.Test}</h6>\n            </div>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <i class=\"fa fa-home\"></i>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <i class=\"fa\" class.bind=\"function.$f_Test.icon\"></i>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-form-element-image-inline tip-form-element-image\" style=\"height: 150px;background-size: contain;background-image: url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Blume_mit_Schmetterling_und_Biene_1uf.JPG');\"></div>\n    </div>\n    <div class=\"col-xs-12\">\n        <div class=\"tip-editor-caption\">&nbsp;</div>\n        <div>\n            <div>\n                Ich bin ein Dummy-Html\n            </div>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-editor-caption\">&nbsp;</div>\n        <dx-widget name=\"dxButton\" options.bind=\"id507f38819f3341fba29f40547da89b1dOptions\"></dx-widget>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-editor-caption\">&nbsp;</div>\n        <dx-widget name=\"dxButton\" options.bind=\"idf9bf7e3c96bd46c69c5b91b1668b57b4Options\"></dx-widget>\n    </div>\n    <div class=\"tip-margin-top col-xs-6\">\n        <div class=\"tip-editor-caption\">Name</div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"id3941d0f56fc64b2eb16068e156ac21f0Options\"></dx-widget>\n    </div>\n    <div class=\"tip-margin-top col-xs-6\">\n        <div class=\"tip-editor-caption\">Date</div>\n        <dx-widget name=\"dxDateBox\" options.bind=\"idb0da532db89640538d47643bc16b0104Options\"></dx-widget>\n    </div>\n    <div class=\"tip-margin-top col-xs-6\">\n        <div class=\"tip-editor-caption\">Number</div>\n        <dx-widget name=\"dxNumberBox\" options.bind=\"id251aeae6e2e54869a9eb776b05170975Options\"></dx-widget>\n    </div>\n    <div class=\"col-xs-12\">\n        <div class=\"row\">\n            <div class=\"tip-margin-top col-xs-6\">\n                <div class=\"tip-editor-caption\">Name</div>\n                <dx-widget name=\"dxTextArea\" options.bind=\"ide267c1b49885426d9fb090d8bc71d246Options\"></dx-widget>\n            </div>\n            <div class=\"tip-margin-top col-xs-6\">\n                <div class=\"tip-editor-caption\">Name</div>\n                <dx-widget name=\"dxCalendar\" options.bind=\"id376b81433dea42869f3035676512a77cOptions\"></dx-widget>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-xs-12\">\n        <div>\n            <row class=\"row\">\n                <div class=\"tip-margin-top col-xs-6\">\n                    <div class=\"tip-editor-caption\">Name</div>\n                    <dx-widget name=\"dxTextArea\" options.bind=\"idc60ec180710943b2b9bb67d03b125997Options\"></dx-widget>\n                </div>\n                <div class=\"tip-margin-top col-xs-6\">\n                    <div class=\"tip-editor-caption\">Name</div>\n                    <dx-widget name=\"dxCalendar\" options.bind=\"id7c1d82f61cd64bb2bd01284b9a948999Options\"></dx-widget>\n                </div>\n            </row>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div>\n            <b>${model.data.$m_Dummy.Test}</b> ist am ${model.data.$m_Dummy.Date} ${model.data.$m_Dummy.Number}x hier gewesen!\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-editor-caption\">Dummy</div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"function.$f_Test.dummyText\"></dx-widget>\n    </div>\n    <div class=\"col-xs-12\">\n        <div repeat.for=\"item of function.$f_Test.dataList\">\n            <div class=\"row\">\n                <div class=\"tip-margin-top col-xs-12\">\n                    <div>${item.a} ${item.b}</div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-xs-12\">\n        <div class=\"tip-repeat-side-by-side\" repeat.for=\"item of function.$f_Test.dataList\">\n            <div class=\"tip-margin-top\">\n                <div>${item.a} ${item.b}</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <dx-widget name=\"dxTabs\" options.bind=\"idd24402a0ae0c4b2c917f3ee9cd705572Options\"></dx-widget>\n    </div>\n    <div show.bind=\"idd24402a0ae0c4b2c917f3ee9cd705572Selected === 0\">\n        <div class=\"tip-margin-top col-xs-12\">\n            <div>Ich bin ein Text 1</div>\n        </div>\n    </div>\n    <div show.bind=\"idd24402a0ae0c4b2c917f3ee9cd705572Selected === 1\">\n        <div class=\"tip-margin-top col-xs-12\">\n            <div>Ich bin ein Text 2</div>\n        </div>\n    </div>\n    <div show.bind=\"idd24402a0ae0c4b2c917f3ee9cd705572Selected === 2\">\n        <div class=\"tip-margin-top col-xs-12\">\n            <div>Ich bin ein Text 3</div>\n        </div>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map