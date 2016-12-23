define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        return App;
    }());
    exports.App = App;
});

define('config',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        baseUrl: "http://10.20.50.53/TIP.Aurelia/api/data"
    };
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

define('framework/widget-options/options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/interfaces/binding',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/widget-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/validation-rule',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/editor-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/enums/sort-order-column-enum',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/data-grid-column-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/enums/selection-mode-enum',["require", "exports"], function (require, exports) {
    "use strict";
    var SelectionModeEnum;
    (function (SelectionModeEnum) {
        SelectionModeEnum[SelectionModeEnum["None"] = 0] = "None";
        SelectionModeEnum[SelectionModeEnum["Single"] = 1] = "Single";
        SelectionModeEnum[SelectionModeEnum["Multiple"] = 2] = "Multiple";
    })(SelectionModeEnum = exports.SelectionModeEnum || (exports.SelectionModeEnum = {}));
});

define('framework/widget-options/list-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/accordion-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/calendar-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/check-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/color-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/command-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/data-grid-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/date-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/file-uploader-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/file-uploader-with-viewer-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/include-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/list-view-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/number-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/select-item',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/select-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/popover-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/popup-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/tab-page-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/tab-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/tag-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/text-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/text-area-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/widget-options/index',["require", "exports"], function (require, exports) {
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

define('framework/interfaces/rest-load-options',["require", "exports"], function (require, exports) {
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
                else if (typeof obj[key] === "object" && key !== "bindingOptions" && key != "dataSource") {
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

define('framework/event-args/custom-event-args',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/event-args/model-load-required',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/command-server-data-instance',["require", "exports"], function (require, exports) {
    "use strict";
    var CommandServerDataInstance = (function () {
        function CommandServerDataInstance() {
        }
        CommandServerDataInstance.prototype.add = function (id, data) {
            this[id] = data;
        };
        return CommandServerDataInstance;
    }());
    exports.CommandServerDataInstance = CommandServerDataInstance;
});

define('framework/services/object-info-service',["require", "exports"], function (require, exports) {
    "use strict";
    var ObjectInfoService = (function () {
        function ObjectInfoService() {
        }
        ObjectInfoService.prototype.equal = function (x, y) {
            var _this = this;
            if (x === null || x === undefined || y === null || y === undefined) {
                return x === y;
            }
            if (x.constructor !== y.constructor) {
                return false;
            }
            if (x instanceof Function) {
                return x === y;
            }
            if (x instanceof RegExp) {
                return x === y;
            }
            if (x === y || x.valueOf() === y.valueOf()) {
                return true;
            }
            if (Array.isArray(x) && x.length !== y.length) {
                return false;
            }
            if (x instanceof Date) {
                return false;
            }
            if (!(x instanceof Object)) {
                return false;
            }
            if (!(y instanceof Object)) {
                return false;
            }
            var p = Object.keys(x);
            return Object.keys(y).every(function (i) {
                return p.indexOf(i) !== -1;
            }) && p.every(function (i) {
                return _this.equal(x[i], y[i]);
            });
        };
        return ObjectInfoService;
    }());
    exports.ObjectInfoService = ObjectInfoService;
});

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('framework/base/custom-event',["require", "exports", "aurelia-framework", "../services/object-info-service"], function (require, exports, aurelia_framework_1, object_info_service_1) {
    "use strict";
    var CustomEvent = (function () {
        function CustomEvent(waitTimeout) {
            if (waitTimeout === void 0) { waitTimeout = 0; }
            this.waitTimeout = waitTimeout;
            this.delegates = [];
            this.argsQueue = [];
            this.objectInfo = aurelia_framework_1.Container.instance.get(object_info_service_1.ObjectInfoService);
            this.taskQueue = aurelia_framework_1.Container.instance.get(aurelia_framework_1.TaskQueue);
        }
        CustomEvent.prototype.register = function (action) {
            var _this = this;
            this.delegates.push(action);
            return function () {
                var indexOf = _this.delegates.indexOf(action);
                if (indexOf < 0) {
                    return;
                }
                _this.delegates.splice(indexOf, 1);
            };
        };
        CustomEvent.prototype.fire = function (args) {
            if (this.waitTimeout === 0) {
                return Promise.all(this.delegates.map(function (item) { return item(args); }));
            }
            else {
                if (this.timeoutCancel) {
                    clearTimeout(this.timeoutCancel);
                    this.timeoutCancel = null;
                }
                for (var _i = 0, _a = this.argsQueue; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (this.objectInfo.equal(item, args)) {
                        return;
                    }
                }
                this.argsQueue.push(args);
                this.timeoutCancel = setTimeout(this.fireQueue.bind(this), this.waitTimeout);
            }
        };
        CustomEvent.prototype.fireQueue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var argsQueue;
                return __generator(this, function (_a) {
                    argsQueue = this.argsQueue.slice(0);
                    this.argsQueue.length = 0;
                    argsQueue.forEach(function (args) {
                        _this.taskQueue.queueTask(function () {
                            return Promise.all(_this.delegates.map(function (item) { return item(args); }));
                        });
                    });
                    return [2 /*return*/];
                });
            });
        };
        return CustomEvent;
    }());
    exports.CustomEvent = CustomEvent;
});

define('framework/services/rest-service',["require", "exports", "../../config", "aurelia-fetch-client"], function (require, exports, config_1, aurelia_fetch_client_1) {
    "use strict";
    var RestService = (function () {
        function RestService() {
        }
        RestService.prototype.get = function (options) {
            var _this = this;
            var client = new aurelia_fetch_client_1.HttpClient();
            var headers = {};
            headers["X-TIP-API-KEY"] = "61da30dc-46cc-45e6-b9a6-c6cfa65d65af";
            if (options.getOptions) {
                headers["X-GET-OPTIONS"] = JSON.stringify(options.getOptions);
            }
            return new Promise(function (success, error) {
                client
                    .fetch(_this.getUrl(options.url), {
                    headers: headers
                })
                    .then(function (r) { return r.json(); })
                    .then(function (r) { return success(r); })
                    .catch(function (r) {
                    error(r);
                });
            });
        };
        RestService.prototype.getUrl = function (suffix) {
            return config_1.default.baseUrl + "/" + suffix;
        };
        return RestService;
    }());
    exports.RestService = RestService;
});

define('framework/base/model-instance',["require", "exports", "./custom-event", "../services/rest-service", "aurelia-framework"], function (require, exports, custom_event_1, rest_service_1, aurelia_framework_1) {
    "use strict";
    var ModelInstance = (function () {
        function ModelInstance(form) {
            var _this = this;
            this.form = form;
            this.onLoadRequired = new custom_event_1.CustomEvent(10);
            this.rest = aurelia_framework_1.Container.instance.get(rest_service_1.RestService);
            this.data = {};
            this.info = {};
            this.onLoadRequired.register(function (args) {
                if (args.model.key || args.model.autoLoad) {
                    var getOptions = _this.createGetOptions(args.model);
                    return _this.rest.get({
                        url: args.model.webApiAction + "/" + _this.form.evaluateExpression(args.model.key),
                        getOptions: getOptions
                    }).then(function (r) {
                        _this.data[args.model.id] = r;
                    });
                }
                return Promise.resolve();
            });
        }
        ModelInstance.prototype.addInfo = function (model) {
            this.info[model.id] = model;
            this.addObservers(model);
        };
        ModelInstance.prototype.getInfo = function (id) {
            var model = this.info[id];
            if (!model) {
                throw new Error();
            }
            return model;
        };
        ModelInstance.prototype.createDataSource = function (model) {
            var _this = this;
            return new DevExpress.data.DataSource(new DevExpress.data.CustomStore({
                key: model.keyProperty,
                byKey: function (key) {
                    var getOptions = _this.createGetOptions(model);
                    return _this.rest.get({
                        url: model.webApiAction + "/" + key,
                        getOptions: getOptions
                    });
                },
                load: function (options) {
                    var getOptions = _this.createGetOptions(model);
                    getOptions.where = options.filter;
                    getOptions.skip = options.skip;
                    getOptions.take = options.take;
                    getOptions.requireTotalCount = options.requireTotalCount;
                    if (model.webApiWhere) {
                        getOptions.where = [];
                        if (!_this.constructWhere(model.webApiWhere, getOptions.where)) {
                            if (options.requireTotalCount) {
                                return Promise.resolve({
                                    data: [],
                                    totalCount: 0
                                });
                            }
                            else {
                                return Promise.resolve([]);
                            }
                        }
                    }
                    if (options.sort) {
                        getOptions.orderBy = options.sort.map(function (data) {
                            return {
                                columnName: data.selector,
                                sortOrder: (data.desc === true ? 1 : 0)
                            };
                        });
                    }
                    return _this.rest.get({
                        url: model.webApiAction,
                        getOptions: getOptions
                    }).then(function (r) {
                        if (options.requireTotalCount) {
                            return {
                                data: r.rows,
                                totalCount: r.count
                            };
                        }
                        else {
                            return r;
                        }
                    });
                }
            }));
        };
        ModelInstance.prototype.addObservers = function (model) {
            this.addObserversDetail(model, model.key);
            this.addObserversWhere(model, model.webApiWhere);
            if (model.filters) {
                for (var _i = 0, _a = model.filters; _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.addObserversDetail(model, item.if);
                    this.addObserversDetail(model, item.webApiCustomValue);
                    this.addObserversWhere(model, item.webApiWhere);
                }
            }
        };
        ModelInstance.prototype.addObserversWhere = function (model, data) {
            var _this = this;
            if (data == void (0)) {
                return;
            }
            if (Array.isArray(data)) {
                data.forEach(function (item) { return _this.addObserversWhere(model, item); });
            }
            else if (typeof data === "object") {
                if (data.isBound === true && data.expression != void (0)) {
                    this.addObserversDetail(model, data.expression);
                }
                else {
                    for (var property in data) {
                        this.addObserversWhere(model, data[property]);
                    }
                }
            }
        };
        ModelInstance.prototype.addObserversDetail = function (model, expression) {
            var _this = this;
            if (expression == void (0)) {
                return;
            }
            this.form.createObserver(expression, function (newValue, oldValue) {
                _this.onLoadRequired.fire({
                    model: model
                });
            });
        };
        ModelInstance.prototype.createGetOptions = function (model) {
            var getOptions = {};
            getOptions.expand = model.webApiExpand;
            getOptions.columns = model.webApiColumns;
            if (model.webApiMaxRecords > 0) {
                getOptions.maxRecords = model.webApiMaxRecords;
            }
            getOptions.orderBy = model.webApiOrderBy;
            return getOptions;
        };
        ModelInstance.prototype.constructWhere = function (data, where) {
            var _this = this;
            if (data == void (0)) {
                return true;
            }
            if (Array.isArray(data)) {
                var newArr_1 = [];
                where.push(newArr_1);
                var cancel_1 = false;
                data.forEach(function (item) {
                    if (!_this.constructWhere(item, newArr_1)) {
                        cancel_1 = true;
                    }
                });
                if (cancel_1) {
                    return false;
                }
            }
            else if (typeof data === "object") {
                if (data.isBound === true && data.expression != void (0)) {
                    var val = this.form.evaluateExpression(data.expression);
                    if (val == void (0)) {
                        return false;
                    }
                    where.push(val);
                }
                else {
                    for (var property in data) {
                        if (!this.constructWhere(data[property], where)) {
                            return false;
                        }
                    }
                }
            }
            else {
                where.push(data);
            }
            return true;
        };
        return ModelInstance;
    }());
    exports.ModelInstance = ModelInstance;
});

define('framework/base/function-instance',["require", "exports"], function (require, exports) {
    "use strict";
    var FunctionInstance = (function () {
        function FunctionInstance() {
        }
        FunctionInstance.prototype.add = function (id, functionInstance) {
            this[id] = functionInstance;
        };
        return FunctionInstance;
    }());
    exports.FunctionInstance = FunctionInstance;
});

define('framework/base/variable-instance',["require", "exports"], function (require, exports) {
    "use strict";
    var VariableInstance = (function () {
        function VariableInstance() {
            this.data = {};
            this.info = {};
        }
        VariableInstance.prototype.addInfo = function (variable) {
            this.info[variable.id] = variable;
        };
        return VariableInstance;
    }());
    exports.VariableInstance = VariableInstance;
});

define('framework/base/form-base',["require", "exports", "aurelia-framework", "./model-instance", "./function-instance", "./variable-instance", "./command-server-data-instance"], function (require, exports, aurelia_framework_1, model_instance_1, function_instance_1, variable_instance_1, command_server_data_instance_1) {
    "use strict";
    var FormBase = (function () {
        function FormBase() {
            this.bindingEngine = aurelia_framework_1.Container.instance.get(aurelia_framework_1.BindingEngine);
            this.model = new model_instance_1.ModelInstance(this);
            this.variable = new variable_instance_1.VariableInstance();
            this.function = new function_instance_1.FunctionInstance();
            this.commandServerData = new command_server_data_instance_1.CommandServerDataInstance();
            this.expression = new Map();
        }
        FormBase.prototype.addModel = function (model) {
            this.model.addInfo(model);
        };
        FormBase.prototype.addVariable = function (variable) {
            this.variable.addInfo(variable);
        };
        FormBase.prototype.addCommandServerData = function (id, commandServerData) {
            this.commandServerData.add(id, commandServerData);
        };
        FormBase.prototype.addCommand = function (command) {
        };
        FormBase.prototype.addFunction = function (id, functionInstance) {
            this.function.add(id, functionInstance);
        };
        FormBase.prototype.addEditPopup = function (editPopup) {
        };
        FormBase.prototype.addMapping = function (mapping) {
        };
        FormBase.prototype.createObserver = function (expression, action) {
            return this
                .bindingEngine
                .expressionObserver(this, expression)
                .subscribe(action)
                .dispose;
        };
        FormBase.prototype.evaluateExpression = function (expression, overrideContext) {
            var parsed = this.expression.get(expression);
            if (!parsed) {
                parsed = this.bindingEngine.parseExpression(expression);
                this.expression.set(expression, parsed);
            }
            return parsed.evaluate({
                bindingContext: this,
                overrideContext: overrideContext
            });
        };
        FormBase.prototype.getFileDownloadUrl = function (key) {
            return this.evaluateExpression(key);
        };
        return FormBase;
    }());
    exports.FormBase = FormBase;
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
define('framework/widget-services/base-widget-creator-service',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var BaseWidgetCreatorService = (function () {
        function BaseWidgetCreatorService() {
        }
        BaseWidgetCreatorService.prototype.createWidgetOptions = function (form, options) {
            var widgetOptions = {
                bindingOptions: {}
            };
            if (options.isDisabled) {
                widgetOptions.disabled = true;
            }
            else if (options.isDisabledExpression) {
                widgetOptions.bindingOptions["disabled"] = options.isDisabledExpression;
            }
            if (options.tooltip) {
                widgetOptions.hint = options.tooltip;
            }
            form[options.options.optionsName] = widgetOptions;
            return widgetOptions;
        };
        return BaseWidgetCreatorService;
    }());
    BaseWidgetCreatorService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [])
    ], BaseWidgetCreatorService);
    exports.BaseWidgetCreatorService = BaseWidgetCreatorService;
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
define('framework/widget-services/data-grid-widget-creator-service',["require", "exports", "./base-widget-creator-service", "../enums/selection-mode-enum", "aurelia-framework"], function (require, exports, base_widget_creator_service_1, selection_mode_enum_1, aurelia_framework_1) {
    "use strict";
    var DataGridWidgetCreatorService = (function () {
        function DataGridWidgetCreatorService(baseWidgetCreator) {
            this.baseWidgetCreator = baseWidgetCreator;
        }
        ;
        DataGridWidgetCreatorService.prototype.addDataGrid = function (form, options) {
            var dataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.dataModel) {
                var model_1 = form.model.getInfo(options.dataModel);
                var dataSource_1 = form.model.createDataSource(model_1);
                dataGridOptions.dataSource = dataSource_1;
                dataGridOptions.remoteOperations = {
                    filtering: true,
                    paging: true,
                    sorting: true
                };
                form.model.onLoadRequired.register(function (e) {
                    if (e.model == model_1) {
                        dataSource_1.reload();
                    }
                    return Promise.resolve();
                });
            }
            else if (options.binding.bindTo) {
                dataGridOptions.bindingOptions["dataSource"] = options.binding.bindToFQ;
            }
            if (options.columns) {
                dataGridOptions.columns = options.columns.map(function (col) {
                    var column = {};
                    if (col.caption) {
                        column.caption = col.caption;
                    }
                    if (col.bindTo) {
                        column.dataField = col.bindTo;
                    }
                    if (col.sortIndex != void (0) && col.sortOrder != void (0)) {
                        column.sortIndex = col.sortIndex;
                        column.sortOrder = col.sortOrder;
                    }
                    if (col.width) {
                        column.width = col.width;
                    }
                    return column;
                });
            }
            if (options.showFilterRow) {
                dataGridOptions.filterRow = dataGridOptions.filterRow ? dataGridOptions.filterRow : {};
                dataGridOptions.filterRow.visible = true;
            }
            if (options.rowScriptTemplateId) {
                dataGridOptions.rowTemplate = options.rowScriptTemplateId;
            }
            var clickActions = [];
            if (options.onItemClick) {
                clickActions.push(function (e) {
                    form.evaluateExpression(options.onItemClick, { e: e });
                });
            }
            if (options.editDataContext) {
                clickActions.push(function (e) {
                    form.model.data[options.editDataContext] = e.data;
                });
            }
            if (clickActions.length > 0) {
                dataGridOptions.onRowClick = function (e) {
                    clickActions.forEach(function (item) {
                        item(e);
                    });
                };
            }
            if (options.selectionMode) {
                var selectionModeString = "";
                switch (options.selectionMode) {
                    case selection_mode_enum_1.SelectionModeEnum.Multiple:
                        selectionModeString = "multiple";
                        break;
                    case selection_mode_enum_1.SelectionModeEnum.Single:
                        selectionModeString = "single";
                        break;
                    default:
                        selectionModeString = "none";
                        break;
                }
                dataGridOptions.selection = dataGridOptions.selection ? dataGridOptions.selection : {};
                dataGridOptions.selection.mode = selectionModeString;
            }
            return dataGridOptions;
        };
        return DataGridWidgetCreatorService;
    }());
    DataGridWidgetCreatorService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [base_widget_creator_service_1.BaseWidgetCreatorService])
    ], DataGridWidgetCreatorService);
    exports.DataGridWidgetCreatorService = DataGridWidgetCreatorService;
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
define('framework/widget-services/simple-widget-creator-service',["require", "exports", "./base-widget-creator-service", "aurelia-framework"], function (require, exports, base_widget_creator_service_1, aurelia_framework_1) {
    "use strict";
    var SimpleWidgetCreatorService = (function () {
        function SimpleWidgetCreatorService(baseWidgetCreator) {
            this.baseWidgetCreator = baseWidgetCreator;
        }
        SimpleWidgetCreatorService.prototype.createEditorOptions = function (form, options) {
            var editorOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.binding && options.binding.bindToFQ) {
                editorOptions.bindingOptions["value"] = options.binding.bindToFQ;
            }
            if (options.isReadOnly) {
                editorOptions.readOnly = true;
            }
            else if (options.isReadOnlyExpression) {
                editorOptions.bindingOptions["readOnly"] = options.isReadOnlyExpression;
            }
            if (options.placeholder) {
                editorOptions.placeholder = options.placeholder;
            }
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addAccordion = function (form, options) {
            return this.baseWidgetCreator.createWidgetOptions(form, options);
        };
        SimpleWidgetCreatorService.prototype.addCalendar = function (form, options) {
            return this.createEditorOptions(form, options);
        };
        SimpleWidgetCreatorService.prototype.addCheckBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.caption) {
                editorOptions.text = options.caption;
            }
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addColorBox = function (form, options) {
            return this.createEditorOptions(form, options);
        };
        SimpleWidgetCreatorService.prototype.addDateBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.min) {
                editorOptions.min = options.min;
            }
            if (options.max) {
                editorOptions.max = options.max;
            }
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addCommand = function (form, options) {
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
        SimpleWidgetCreatorService.prototype.addFileUploader = function (form, options) {
            var widgetOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.acceptType) {
                widgetOptions.accept = options.acceptType;
            }
            return widgetOptions;
        };
        SimpleWidgetCreatorService.prototype.addFileUploaderWithViewer = function (form, options) {
            return options;
        };
        SimpleWidgetCreatorService.prototype.addInclude = function (form, options) {
            return options;
        };
        SimpleWidgetCreatorService.prototype.addListView = function (form, options) {
            return options;
        };
        SimpleWidgetCreatorService.prototype.addLookup = function (form, options, selectItem) {
            var editorOptions = this.createEditorOptions(form, options);
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addNumberBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.showClearButton) {
                editorOptions.showClearButton = true;
            }
            if (options.showSpinButtons) {
                editorOptions.showSpinButtons = true;
            }
            if (options.max) {
                editorOptions.max = options.max;
            }
            if (options.min) {
                editorOptions.min = options.min;
            }
            if (options.step) {
                editorOptions.step = options.step;
            }
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addPopover = function (form, options) {
            var widgetOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            return widgetOptions;
        };
        SimpleWidgetCreatorService.prototype.addPopup = function (form, options) {
            var widgetOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.height) {
                widgetOptions.height = options.height;
            }
            if (options.maxWidth) {
                widgetOptions.maxWidth = options.maxWidth;
            }
            return widgetOptions;
        };
        SimpleWidgetCreatorService.prototype.addRadioGroup = function (form, options, selectItem) {
            var editorOptions = this.createEditorOptions(form, options);
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addSelectBox = function (form, options, selectItem) {
            var editorOptions = this.createEditorOptions(form, options);
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addTab = function (form, options) {
            var tabOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
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
        SimpleWidgetCreatorService.prototype.addTagBox = function (form, options) {
            var widgetOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            return widgetOptions;
        };
        SimpleWidgetCreatorService.prototype.addTextBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.maxLength) {
                editorOptions.maxLength = options.maxLength;
            }
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addTextArea = function (form, options) {
            var editorOptions = this.addTextBox(form, options);
            if (options.height) {
                editorOptions.height = options.height;
            }
            return editorOptions;
        };
        return SimpleWidgetCreatorService;
    }());
    SimpleWidgetCreatorService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [base_widget_creator_service_1.BaseWidgetCreatorService])
    ], SimpleWidgetCreatorService);
    exports.SimpleWidgetCreatorService = SimpleWidgetCreatorService;
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
define('framework/widget-services/widget-creator-service',["require", "exports", "./simple-widget-creator-service", "./data-grid-widget-creator-service", "aurelia-framework"], function (require, exports, simple_widget_creator_service_1, data_grid_widget_creator_service_1, aurelia_framework_1) {
    "use strict";
    var WidgetCreatorService = (function () {
        function WidgetCreatorService(simpleWidgetCreator, dataGridWidgetCreator) {
            this.simpleWidgetCreator = simpleWidgetCreator;
            this.dataGridWidgetCreator = dataGridWidgetCreator;
        }
        WidgetCreatorService.prototype.addAccordion = function (form, options) {
            return this.simpleWidgetCreator.addAccordion(form, options);
        };
        WidgetCreatorService.prototype.addCalendar = function (form, options) {
            return this.simpleWidgetCreator.addCalendar(form, options);
        };
        WidgetCreatorService.prototype.addCheckBox = function (form, options) {
            return this.simpleWidgetCreator.addCheckBox(form, options);
        };
        WidgetCreatorService.prototype.addColorBox = function (form, options) {
            return this.simpleWidgetCreator.addColorBox(form, options);
        };
        WidgetCreatorService.prototype.addCommand = function (form, options) {
            return this.simpleWidgetCreator.addCommand(form, options);
        };
        WidgetCreatorService.prototype.addDateBox = function (form, options) {
            return this.simpleWidgetCreator.addDateBox(form, options);
        };
        WidgetCreatorService.prototype.addDataGrid = function (form, options) {
            return this.dataGridWidgetCreator.addDataGrid(form, options);
        };
        WidgetCreatorService.prototype.addFileUploader = function (form, options) {
            return this.simpleWidgetCreator.addFileUploader(form, options);
        };
        WidgetCreatorService.prototype.addFileUploaderWithViewer = function (form, options) {
            return this.simpleWidgetCreator.addFileUploaderWithViewer(form, options);
        };
        WidgetCreatorService.prototype.addInclude = function (form, options) {
            return this.simpleWidgetCreator.addInclude(form, options);
        };
        WidgetCreatorService.prototype.addListView = function (form, options) {
            return this.simpleWidgetCreator.addListView(form, options);
        };
        WidgetCreatorService.prototype.addLookup = function (form, options, selectItem) {
            return this.simpleWidgetCreator.addLookup(form, options, selectItem);
        };
        WidgetCreatorService.prototype.addNumberBox = function (form, options) {
            return this.simpleWidgetCreator.addNumberBox(form, options);
        };
        WidgetCreatorService.prototype.addPopover = function (form, options) {
            return this.simpleWidgetCreator.addPopover(form, options);
        };
        WidgetCreatorService.prototype.addPopup = function (form, options) {
            return this.simpleWidgetCreator.addPopup(form, options);
        };
        WidgetCreatorService.prototype.addRadioGroup = function (form, options, selectItem) {
            return this.simpleWidgetCreator.addRadioGroup(form, options, selectItem);
        };
        WidgetCreatorService.prototype.addTab = function (form, options) {
            return this.simpleWidgetCreator.addTab(form, options);
        };
        WidgetCreatorService.prototype.addSelectBox = function (form, options, selectItem) {
            return this.simpleWidgetCreator.addSelectBox(form, options, selectItem);
        };
        WidgetCreatorService.prototype.addTagBox = function (form, options) {
            return this.simpleWidgetCreator.addTagBox(form, options);
        };
        WidgetCreatorService.prototype.addTextBox = function (form, options) {
            return this.simpleWidgetCreator.addTextBox(form, options);
        };
        WidgetCreatorService.prototype.addTextArea = function (form, options) {
            return this.simpleWidgetCreator.addTextArea(form, options);
        };
        return WidgetCreatorService;
    }());
    WidgetCreatorService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [simple_widget_creator_service_1.SimpleWidgetCreatorService,
            data_grid_widget_creator_service_1.DataGridWidgetCreatorService])
    ], WidgetCreatorService);
    exports.WidgetCreatorService = WidgetCreatorService;
});

define('framework/widget-services/index',["require", "exports", "./widget-creator-service"], function (require, exports, widget_creator_service_1) {
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
            this.downloadUrl = "http://www.tip.co.at";
            this.imageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/ec/Blume_mit_Schmetterling_und_Biene_1uf.JPG";
        }
        TestFunction.prototype.dummyRowClickFunc = function (e) {
            alert("rowClick Data: " + e.data.a);
        };
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
define('main/views/demo-form',["require", "exports", "aurelia-framework", "../../framework/base/form-base", "../../framework/widget-services/widget-creator-service"], function (require, exports, aurelia_framework_1, form_base_1, widget_creator_service_1) {
    "use strict";
    var DemoForm = (function (_super) {
        __extends(DemoForm, _super);
        function DemoForm(widgetCreator) {
            var _this = _super.call(this) || this;
            _this.widgetCreator = widgetCreator;
            _this.addModel({
                "id": "$m_1",
                "webApiAction": "base/Security/Profile",
                "webApiExpand": {
                    "Mandator": null
                },
                "keyProperty": "Id",
                "filters": []
            });
            _this.addModel({
                "id": "$m_2",
                "filters": []
            });
            _this.addModel({
                "id": "$m_3",
                "webApiAction": "base/Security/AuthgroupProfile",
                "webApiExpand": {
                    "Authgroup": null
                },
                "webApiWhere": ["IdProfile", {
                        "isBound": true,
                        "expression": "model.data.$m_2.Id"
                    }],
                "keyProperty": "Id",
                "filters": []
            });
            _this.widgetCreator.addDataGrid(_this, {
                "columns": [{
                        "caption": "Name",
                        "bindTo": "Name",
                        "sortIndex": 0,
                        "sortOrder": "desc"
                    }, {
                        "caption": "Mandant",
                        "bindTo": "Mandator.Name"
                    }],
                "optionsToolbar": {
                    "optionsName": "id2d9a358c0a454ac2a52dacb8395ccaceToolbarOptions",
                    "optionsNameFQ": "id2d9a358c0a454ac2a52dacb8395ccaceToolbarOptions"
                },
                "binding": {
                    "dataContext": "$m_1",
                    "bindToFQ": "model.data.$m_1."
                },
                "dataModel": "$m_1",
                "editDataContext": "$m_2",
                "selectionMode": 1,
                "edits": [],
                "filters": [],
                "commands": [],
                "id": "id2d9a358c0a454ac2a52dacb8395ccace",
                "options": {
                    "optionsName": "id2d9a358c0a454ac2a52dacb8395ccaceOptions",
                    "optionsNameFQ": "id2d9a358c0a454ac2a52dacb8395ccaceOptions"
                }
            });
            _this.widgetCreator.addDataGrid(_this, {
                "columns": [{
                        "caption": "Berechtigungsgruppe",
                        "bindTo": "Authgroup.Name",
                        "sortIndex": 0,
                        "sortOrder": "desc"
                    }],
                "optionsToolbar": {
                    "optionsName": "idca253d25d4a643a29b692def4e5891d9ToolbarOptions",
                    "optionsNameFQ": "idca253d25d4a643a29b692def4e5891d9ToolbarOptions"
                },
                "binding": {
                    "dataContext": "$m_3",
                    "bindToFQ": "model.data.$m_3."
                },
                "dataModel": "$m_3",
                "edits": [],
                "filters": [],
                "commands": [],
                "id": "idca253d25d4a643a29b692def4e5891d9",
                "options": {
                    "optionsName": "idca253d25d4a643a29b692def4e5891d9Options",
                    "optionsNameFQ": "idca253d25d4a643a29b692def4e5891d9Options"
                }
            });
            return _this;
        }
        return DemoForm;
    }(form_base_1.FormBase));
    DemoForm = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [widget_creator_service_1.WidgetCreatorService])
    ], DemoForm);
    exports.DemoForm = DemoForm;
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
define('main/views/form-test-form',["require", "exports", "aurelia-framework", "../../framework/base/form-base", "../../framework/widget-services/widget-creator-service", "../functions/test-function"], function (require, exports, aurelia_framework_1, form_base_1, widget_creator_service_1, test_function_1) {
    "use strict";
    var FormTestForm = (function (_super) {
        __extends(FormTestForm, _super);
        function FormTestForm(widgetCreator) {
            var _this = _super.call(this) || this;
            _this.widgetCreator = widgetCreator;
            _this.id1e5df8e32afa424c8f9964b5ca095350Selected = 0;
            _this.addModel({
                "id": "$m_Dummy",
                "webApiAction": "base/Security/Profile",
                "keyProperty": "Id",
                "filters": []
            });
            _this.addModel({
                "id": "$m_Dummy2",
                "webApiAction": "base/Security/Profile",
                "keyProperty": "Id",
                "filters": []
            });
            _this.addModel({
                "id": "$m_Dummy3",
                "webApiAction": "base/Security/Profile",
                "key": "model.data.$m_Dummy2.Id",
                "keyProperty": "Id",
                "filters": []
            });
            _this.addFunction("$f_Test", new test_function_1.TestFunction(_this, "function.$f_Test", {
                "x": 1,
                "y": 2
            }));
            _this.widgetCreator.addCommand(_this, {
                "id": "id00d43cf097e848caa490f1b09190a20f",
                "options": {
                    "optionsName": "id00d43cf097e848caa490f1b09190a20fOptions",
                    "optionsNameFQ": "id00d43cf097e848caa490f1b09190a20fOptions"
                },
                "binding": {
                    "bindTo": "$f_Test.giveItToMe",
                    "bindToFQ": "function.$f_Test.giveItToMe",
                    "propertyPrefix": "$f_Test"
                }
            });
            _this.widgetCreator.addTextBox(_this, {
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy2",
                    "bindTo": "Name",
                    "bindToFQ": "model.data.$m_Dummy2.Name"
                },
                "validationRules": [],
                "id": "idb3f11b286cdd4ab9a37824a1cb63897d",
                "options": {
                    "optionsName": "idb3f11b286cdd4ab9a37824a1cb63897dOptions",
                    "optionsNameFQ": "idb3f11b286cdd4ab9a37824a1cb63897dOptions"
                }
            });
            _this.widgetCreator.addDateBox(_this, {
                "caption": "Date",
                "binding": {
                    "dataContext": "$m_Dummy2",
                    "bindTo": "ModifiedDate",
                    "bindToFQ": "model.data.$m_Dummy2.ModifiedDate"
                },
                "validationRules": [],
                "id": "idfccaa22ca9b24ad49959b5cc4a33bffd",
                "options": {
                    "optionsName": "idfccaa22ca9b24ad49959b5cc4a33bffdOptions",
                    "optionsNameFQ": "idfccaa22ca9b24ad49959b5cc4a33bffdOptions"
                }
            });
            _this.widgetCreator.addNumberBox(_this, {
                "caption": "Number",
                "binding": {
                    "dataContext": "$m_Dummy2",
                    "bindTo": "IdMandator",
                    "bindToFQ": "model.data.$m_Dummy2.IdMandator"
                },
                "validationRules": [],
                "id": "id89444961628245e7aaae07658bef32ad",
                "options": {
                    "optionsName": "id89444961628245e7aaae07658bef32adOptions",
                    "optionsNameFQ": "id89444961628245e7aaae07658bef32adOptions"
                }
            });
            _this.widgetCreator.addTextArea(_this, {
                "height": "200px",
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy2",
                    "bindTo": "Name",
                    "bindToFQ": "model.data.$m_Dummy2.Name"
                },
                "validationRules": [],
                "id": "id7d85e4957372416f8eae5d5db289dbe1",
                "options": {
                    "optionsName": "id7d85e4957372416f8eae5d5db289dbe1Options",
                    "optionsNameFQ": "id7d85e4957372416f8eae5d5db289dbe1Options"
                }
            });
            _this.widgetCreator.addCalendar(_this, {
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy2",
                    "bindTo": "ModifiedDate",
                    "bindToFQ": "model.data.$m_Dummy2.ModifiedDate"
                },
                "validationRules": [],
                "id": "id23ea4d45a93b4c368837ceee5433a53f",
                "options": {
                    "optionsName": "id23ea4d45a93b4c368837ceee5433a53fOptions",
                    "optionsNameFQ": "id23ea4d45a93b4c368837ceee5433a53fOptions"
                }
            });
            _this.widgetCreator.addTextArea(_this, {
                "height": "200px",
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy2",
                    "bindTo": "Name",
                    "bindToFQ": "model.data.$m_Dummy2.Name"
                },
                "validationRules": [],
                "id": "idb89aee12c4474fe9b093cfcd7a5a09dd",
                "options": {
                    "optionsName": "idb89aee12c4474fe9b093cfcd7a5a09ddOptions",
                    "optionsNameFQ": "idb89aee12c4474fe9b093cfcd7a5a09ddOptions"
                }
            });
            _this.widgetCreator.addCalendar(_this, {
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy2",
                    "bindTo": "ModifiedDate",
                    "bindToFQ": "model.data.$m_Dummy2.ModifiedDate"
                },
                "validationRules": [],
                "id": "idf25e0200237d4c31842724ebe678314c",
                "options": {
                    "optionsName": "idf25e0200237d4c31842724ebe678314cOptions",
                    "optionsNameFQ": "idf25e0200237d4c31842724ebe678314cOptions"
                }
            });
            _this.widgetCreator.addTextArea(_this, {
                "height": "200px",
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy3",
                    "bindTo": "Name",
                    "bindToFQ": "model.data.$m_Dummy3.Name"
                },
                "validationRules": [],
                "id": "id761630c888b24867969f1479b329c480",
                "options": {
                    "optionsName": "id761630c888b24867969f1479b329c480Options",
                    "optionsNameFQ": "id761630c888b24867969f1479b329c480Options"
                }
            });
            _this.widgetCreator.addCalendar(_this, {
                "caption": "Name",
                "binding": {
                    "dataContext": "$m_Dummy3",
                    "bindTo": "ModifiedDate",
                    "bindToFQ": "model.data.$m_Dummy3.ModifiedDate"
                },
                "validationRules": [],
                "id": "ida7e1d8a5568040fdb9c5476a47c73d61",
                "options": {
                    "optionsName": "ida7e1d8a5568040fdb9c5476a47c73d61Options",
                    "optionsNameFQ": "ida7e1d8a5568040fdb9c5476a47c73d61Options"
                }
            });
            _this.widgetCreator.addTextBox(_this, {
                "caption": "Bezeichnung",
                "binding": {
                    "dataContext": "$m_Dummy3",
                    "bindTo": "Name",
                    "bindToFQ": "model.data.$m_Dummy3.Name"
                },
                "validationRules": [],
                "id": "idd2d95d7ccd934384968833afca632e99",
                "options": {
                    "optionsName": "idd2d95d7ccd934384968833afca632e99Options",
                    "optionsNameFQ": "idd2d95d7ccd934384968833afca632e99Options"
                }
            });
            _this.widgetCreator.addTab(_this, {
                "id": "id1e5df8e32afa424c8f9964b5ca095350",
                "options": {
                    "optionsName": "id1e5df8e32afa424c8f9964b5ca095350Options",
                    "optionsNameFQ": "id1e5df8e32afa424c8f9964b5ca095350Options"
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
            _this.widgetCreator.addDataGrid(_this, {
                "showFilterRow": true,
                "columns": [{
                        "caption": "Name",
                        "bindTo": "Name"
                    }, {
                        "caption": "ModifiedDate",
                        "bindTo": "ModifiedDate"
                    }],
                "optionsToolbar": {
                    "optionsName": "id2b2be4ace6ae498683513ee6f1f282cbToolbarOptions",
                    "optionsNameFQ": "id2b2be4ace6ae498683513ee6f1f282cbToolbarOptions"
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
                "id": "id2b2be4ace6ae498683513ee6f1f282cb",
                "options": {
                    "optionsName": "id2b2be4ace6ae498683513ee6f1f282cbOptions",
                    "optionsNameFQ": "id2b2be4ace6ae498683513ee6f1f282cbOptions"
                }
            });
            return _this;
        }
        Object.defineProperty(FormTestForm.prototype, "idf52adb96454d49d3be5c114abdd5b466", {
            get: function () {
                return this.getFileDownloadUrl("function.$f_Test.downloadUrl");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormTestForm.prototype, "id7abf486233a9480da3f44d4469a1f219", {
            get: function () {
                return this.getFileDownloadUrl("function.$f_Test.imageUrl");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormTestForm.prototype, "ida28db1a100fa4257a73b3cca07037145", {
            get: function () {
                return {
                    'background-image': 'url(' + this.id7abf486233a9480da3f44d4469a1f219 + ')'
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormTestForm.prototype, "ida77430d27a9241a7be699c8402a06aa2", {
            get: function () {
                return this.getFileDownloadUrl("function.$f_Test.imageUrl");
            },
            enumerable: true,
            configurable: true
        });
        return FormTestForm;
    }(form_base_1.FormBase));
    __decorate([
        aurelia_framework_1.computedFrom("function.$f_Test.downloadUrl"),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormTestForm.prototype, "idf52adb96454d49d3be5c114abdd5b466", null);
    __decorate([
        aurelia_framework_1.computedFrom("function.$f_Test.imageUrl"),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormTestForm.prototype, "id7abf486233a9480da3f44d4469a1f219", null);
    __decorate([
        aurelia_framework_1.computedFrom("function.$f_Test.imageUrl"),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormTestForm.prototype, "ida28db1a100fa4257a73b3cca07037145", null);
    __decorate([
        aurelia_framework_1.computedFrom("function.$f_Test.imageUrl"),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormTestForm.prototype, "ida77430d27a9241a7be699c8402a06aa2", null);
    FormTestForm = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [widget_creator_service_1.WidgetCreatorService])
    ], FormTestForm);
    exports.FormTestForm = FormTestForm;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"bootstrap/css/bootstrap.min.css\"></require>\r\n  <require from=\"devextreme/css/dx.common.css\"></require>\r\n  <require from=\"devextreme/css/dx.light.compact.css\"></require>\r\n  <require from=\"./main/views/demo-form\"></require>\r\n\r\n  <div class=\"container-fluid\">\r\n    <div class=\"row\">\r\n      <demo-form></demo-form>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!dx/elements/dx-widget.html', ['module'], function(module) { module.exports = "<template class=\"dx-widget\">\r\n    <require from=\"devextreme\"></require>\r\n</template>"; });
define('text!main/htmls/dummy.html', ['module'], function(module) { module.exports = "<div>\r\n    Ich bin ein Dummy-Html\r\n</div>"; });
define('text!main/views/demo-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"col-xs-12\">\n        <dx-widget name=\"dxDataGrid\" options.bind=\"id2d9a358c0a454ac2a52dacb8395ccaceOptions\"></dx-widget>\n    </div>\n    <div class=\"col-xs-12\">\n        <dx-widget name=\"dxDataGrid\" options.bind=\"idca253d25d4a643a29b692def4e5891d9Options\"></dx-widget>\n    </div>\n</template>"; });
define('text!main/views/form-test-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"col-xs-12\">\n        <div class=\"tip-form-element-flex-box\">\n            <div class=\"tip-margin-top\">\n                <h1>${model.data.$m_Dummy2.Name} asdf</h1>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h2>${model.data.$m_Dummy2.Name}</h2>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h3>${model.data.$m_Dummy2.Name}</h3>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h4>${model.data.$m_Dummy2.Name}</h4>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h5>${model.data.$m_Dummy2.Name}</h5>\n            </div>\n            <div class=\"tip-margin-top\">\n                <h6>${model.data.$m_Dummy2.Name}</h6>\n            </div>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-editor-caption\">&nbsp;</div>\n        <a class=\"tip-form-element-file-download-link\" target=\"_blank\" href=\"http://www.vol.at\">Download</a>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-editor-caption\">&nbsp;</div>\n        <a class=\"tip-form-element-file-download-link\" target=\"_blank\" href.bind=\"idf52adb96454d49d3be5c114abdd5b466\">Download</a>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <i class=\"fa fa-home\"></i>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <i class=\"fa\" class.bind=\"function.$f_Test.icon\"></i>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-form-element-image-inline tip-form-element-image\" style=\"height: 150px;background-size: contain;background-image: url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Blume_mit_Schmetterling_und_Biene_1uf.JPG');\"></div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-form-element-image-inline tip-form-element-image\" css.bind=\"ida28db1a100fa4257a73b3cca07037145\" style=\"height: 150px;background-size: contain;\"></div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <img class=\"tip-form-element-image\" src.bind=\"ida77430d27a9241a7be699c8402a06aa2\"></img>\n    </div>\n    <div class=\"col-xs-12\">\n        <div class=\"tip-editor-caption\">&nbsp;</div>\n        <div>\n            <div>\n                Ich bin ein Dummy-Html\n            </div>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-editor-caption\">&nbsp;</div>\n        <dx-widget name=\"dxButton\" options.bind=\"id00d43cf097e848caa490f1b09190a20fOptions\"></dx-widget>\n    </div>\n    <div class=\"tip-margin-top col-xs-6\">\n        <div class=\"tip-editor-caption\">Name</div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"idb3f11b286cdd4ab9a37824a1cb63897dOptions\"></dx-widget>\n    </div>\n    <div class=\"tip-margin-top col-xs-6\">\n        <div class=\"tip-editor-caption\">Date</div>\n        <dx-widget name=\"dxDateBox\" options.bind=\"idfccaa22ca9b24ad49959b5cc4a33bffdOptions\"></dx-widget>\n    </div>\n    <div class=\"tip-margin-top col-xs-6\">\n        <div class=\"tip-editor-caption\">Number</div>\n        <dx-widget name=\"dxNumberBox\" options.bind=\"id89444961628245e7aaae07658bef32adOptions\"></dx-widget>\n    </div>\n    <div class=\"col-xs-12\">\n        <div class=\"row\">\n            <div class=\"tip-margin-top col-xs-6\">\n                <div class=\"tip-editor-caption\">Name</div>\n                <dx-widget name=\"dxTextArea\" options.bind=\"id7d85e4957372416f8eae5d5db289dbe1Options\"></dx-widget>\n            </div>\n            <div class=\"tip-margin-top col-xs-6\">\n                <div class=\"tip-editor-caption\">Name</div>\n                <dx-widget name=\"dxCalendar\" options.bind=\"id23ea4d45a93b4c368837ceee5433a53fOptions\"></dx-widget>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-xs-12\">\n        <div>\n            <div class=\"row\">\n                <div class=\"tip-margin-top col-xs-6\">\n                    <div class=\"tip-editor-caption\">Name</div>\n                    <dx-widget name=\"dxTextArea\" options.bind=\"idb89aee12c4474fe9b093cfcd7a5a09ddOptions\"></dx-widget>\n                </div>\n                <div class=\"tip-margin-top col-xs-6\">\n                    <div class=\"tip-editor-caption\">Name</div>\n                    <dx-widget name=\"dxCalendar\" options.bind=\"idf25e0200237d4c31842724ebe678314cOptions\"></dx-widget>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <h1>Dummy 3</h1>\n    </div>\n    <div class=\"col-xs-12\">\n        <div>\n            <div class=\"row\">\n                <div class=\"tip-margin-top col-xs-6\">\n                    <div class=\"tip-editor-caption\">Name</div>\n                    <dx-widget name=\"dxTextArea\" options.bind=\"id761630c888b24867969f1479b329c480Options\"></dx-widget>\n                </div>\n                <div class=\"tip-margin-top col-xs-6\">\n                    <div class=\"tip-editor-caption\">Name</div>\n                    <dx-widget name=\"dxCalendar\" options.bind=\"ida7e1d8a5568040fdb9c5476a47c73d61Options\"></dx-widget>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-editor-caption\">Bezeichnung</div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"idd2d95d7ccd934384968833afca632e99Options\"></dx-widget>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div>\n            <b>${model.data.$m_Dummy.Test}</b> ist am ${model.data.$m_Dummy.Date} ${model.data.$m_Dummy.Number}x hier gewesen!\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <div class=\"tip-editor-caption\">Dummy</div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"function.$f_Test.dummyText\"></dx-widget>\n    </div>\n    <div class=\"col-xs-12\">\n        <div repeat.for=\" of function.$f_Test.dataList\">\n            <div class=\"row\">\n                <div class=\"tip-margin-top col-xs-12\">\n                    <div>${item.a} ${item.b}</div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-xs-12\">\n        <div class=\"tip-repeat-side-by-side\" repeat.for=\" of function.$f_Test.dataList\">\n            <div class=\"tip-margin-top\">\n                <div>${item.a} ${item.b}</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"tip-margin-top col-xs-12\">\n        <dx-widget name=\"dxTabs\" options.bind=\"id1e5df8e32afa424c8f9964b5ca095350Options\"></dx-widget>\n    </div>\n    <div show.bind=\"id1e5df8e32afa424c8f9964b5ca095350Selected === 0\">\n        <div class=\"tip-margin-top col-xs-12\">\n            <div>Ich bin ein Text 1</div>\n        </div>\n        <div class=\"col-xs-12\">\n            <dx-widget name=\"dxDataGrid\" options.bind=\"id2b2be4ace6ae498683513ee6f1f282cbOptions\"></dx-widget>\n        </div>\n    </div>\n    <div show.bind=\"id1e5df8e32afa424c8f9964b5ca095350Selected === 1\">\n        <div class=\"tip-margin-top col-xs-12\">\n            <div>Ich bin ein Text 2</div>\n        </div>\n    </div>\n    <div show.bind=\"id1e5df8e32afa424c8f9964b5ca095350Selected === 2\">\n        <div class=\"tip-margin-top col-xs-12\">\n            <div>Ich bin ein Text 3</div>\n        </div>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map