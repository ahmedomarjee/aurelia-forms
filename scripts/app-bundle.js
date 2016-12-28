define('framework/stack-router/interfaces/history-state',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/stack-router/interfaces/route',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/stack-router/interfaces/route-info',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/stack-router/interfaces/navigation-args',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/stack-router/interfaces/navigation-route',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/stack-router/interfaces/export',["require", "exports"], function (require, exports) {
    "use strict";
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
define('framework/stack-router/classes/view-item',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var ViewItem = (function () {
        function ViewItem(routeInfo) {
            this.routeInfo = routeInfo;
            this.title = routeInfo.route.title;
            this.viewModel = routeInfo.route.moduleId;
            this.model = routeInfo;
            this.isCurrent = true;
        }
        Object.defineProperty(ViewItem.prototype, "className", {
            get: function () {
                return this.isCurrent
                    ? "t--view-current"
                    : "t--view-history";
            },
            enumerable: true,
            configurable: true
        });
        return ViewItem;
    }());
    __decorate([
        aurelia_framework_1.computedFrom("isCurrent"),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], ViewItem.prototype, "className", null);
    exports.ViewItem = ViewItem;
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
define('framework/stack-router/services/router-service',["require", "exports", "aurelia-framework", "../classes/view-item"], function (require, exports, aurelia_framework_1, view_item_1) {
    "use strict";
    var RouterService = (function () {
        function RouterService() {
            this.routeInfoId = 0;
            this.viewStack = [];
        }
        RouterService.prototype.deactivate = function () {
        };
        RouterService.prototype.navigate = function (navigationArgs) {
            var routeInfo = this.getRoute(navigationArgs.url);
            if (routeInfo == void (0)) {
                return;
            }
            Object.assign(routeInfo.parameters, this.getParameters(navigationArgs.url));
            if (navigationArgs.historyState) {
                routeInfo.id = navigationArgs.historyState.id;
            }
            navigationArgs.routeInfo = routeInfo;
            if (this.viewStack.length > 1 && this.viewStack[this.viewStack.length - 2].routeInfo.id === routeInfo.id) {
                this.removeLastViewItem();
                return;
            }
            else if (navigationArgs.clearStack) {
                this.viewStack.splice(0, this.viewStack.length);
            }
            this.addViewItem(new view_item_1.ViewItem(routeInfo));
        };
        RouterService.prototype.registerRoutes = function (routes, fallbackRoute) {
            this.routes = this.validateRoutes(routes);
            this.fallbackRoute = fallbackRoute;
            this.navigationRoutes = this.getNavigationRoutes(routes);
        };
        RouterService.prototype.reset = function () {
            this.viewStack.splice(0, this.viewStack.length);
            this.navigationRoutes = [];
        };
        RouterService.prototype.addViewItem = function (viewItem) {
            this.viewStack.push(viewItem);
            this.setCurrentViewItem();
        };
        RouterService.prototype.removeLastViewItem = function () {
            this.viewStack.pop();
            this.setCurrentViewItem();
        };
        RouterService.prototype.getFallbackRoute = function () {
            var _this = this;
            if (!this.fallbackRoute) {
                return null;
            }
            var getRoute = function (routes) {
                for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
                    var route = routes_1[_i];
                    if (route.route.some(function (r) { return r === _this.fallbackRoute; })) {
                        return route;
                    }
                    for (var _a = 0, _b = route.children; _a < _b.length; _a++) {
                        var child = _b[_a];
                        var route_1 = getRoute(child.children);
                        if (route_1) {
                            return route_1;
                        }
                    }
                }
                return null;
            };
            return getRoute(this.routes);
        };
        RouterService.prototype.getNavigationRoutes = function (routes) {
            var result = [];
            for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
                var route = routes_2[_i];
                if (!route.isNavigation) {
                    continue;
                }
                if (!route.canActivate()) {
                    continue;
                }
                var navigationRoute = {
                    title: route.title,
                    icon: route.icon,
                    route: route.route[0],
                    children: this.getNavigationRoutes(route.children)
                };
                result.push(navigationRoute);
            }
            return result;
        };
        RouterService.prototype.getParameters = function (url) {
            var result = {};
            var indexQuestionMark = url.indexOf("?");
            if (indexQuestionMark < 0) {
                return result;
            }
            var parameterString = url.substr(indexQuestionMark + 1);
            var parameters = parameterString.split("&");
            for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
                var parameter = parameters_1[_i];
                var parts = parameter.split("=");
                if (parts.length == 1) {
                    result[parts[0]] = true;
                }
                else {
                    result[parts[0]] = parts[1];
                }
            }
            return result;
        };
        RouterService.prototype.getRoute = function (url) {
            var indexQuestionMark = url.indexOf("?");
            if (indexQuestionMark >= 0) {
                url = url.substr(0, indexQuestionMark);
            }
            for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
                var route = _a[_i];
                var routeInfo = this.isRoute(route, url);
                if (routeInfo == void (0)) {
                    continue;
                }
                return routeInfo;
            }
            return {
                id: this.routeInfoId++,
                route: this.getFallbackRoute(),
                parameters: {}
            };
        };
        RouterService.prototype.isRoute = function (route, url) {
            if (Array.isArray(route.route)) {
                for (var _i = 0, _a = route.route; _i < _a.length; _i++) {
                    var part = _a[_i];
                    var result = this.isRoutePattern(part, url);
                    if (result == void (0)) {
                        continue;
                    }
                    else if (!route.canActivate()) {
                        continue;
                    }
                    else {
                        return {
                            id: this.routeInfoId++,
                            route: route,
                            parameters: result
                        };
                    }
                }
                return null;
            }
            else {
                throw new Error();
            }
        };
        RouterService.prototype.isRoutePattern = function (route, url) {
            var routeParts = route.split("/");
            var urlParts = url.split("/");
            var parameters = {};
            for (var i = 0; i < urlParts.length; i++) {
                if (routeParts.length < i + 1) {
                    return null;
                }
                if (routeParts[i].startsWith(":")) {
                    parameters[routeParts[i].substr(1)] = urlParts[i];
                }
                else if (urlParts[i] !== routeParts[i]) {
                    return null;
                }
            }
            return parameters;
        };
        RouterService.prototype.validateRoutes = function (routes) {
            for (var _i = 0, routes_3 = routes; _i < routes_3.length; _i++) {
                var route = routes_3[_i];
                if (route.route == void (0)) {
                    route.route = "";
                }
                if (typeof route.route === "string") {
                    route.route = [route.route];
                }
                if (route.canActivate == void (0)) {
                    route.canActivate = this.returnTrue;
                }
                route.children = route.children || [];
                for (var _a = 0, _b = route.children; _a < _b.length; _a++) {
                    var child = _b[_a];
                    this.validateRoutes(child.children);
                }
            }
            return routes;
        };
        RouterService.prototype.returnTrue = function () {
            return true;
        };
        RouterService.prototype.setCurrentViewItem = function () {
            if (this.viewStack.length === 0) {
                this.currentViewItem = null;
            }
            else {
                this.currentViewItem = this.viewStack[this.viewStack.length - 1];
                this.currentViewItem.isCurrent = true;
                if (this.viewStack.length > 1) {
                    this.viewStack[this.viewStack.length - 2].isCurrent = false;
                }
            }
        };
        return RouterService;
    }());
    RouterService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [])
    ], RouterService);
    exports.RouterService = RouterService;
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
define('app',["require", "exports", "./framework/stack-router/services/router-service", "aurelia-framework"], function (require, exports, router_service_1, aurelia_framework_1) {
    "use strict";
    var App = (function () {
        function App(router) {
            this.router = router;
            router.registerRoutes([
                {
                    moduleId: "framework/security/views/authgroup/authgroup-list-form",
                    title: "Berechtigungsgruppen",
                    icon: "shield",
                    route: "security/authgroup",
                    isNavigation: true
                },
                {
                    moduleId: "framework/security/views/authgroup/authgroup-edit-form",
                    title: "Berechtigungsgruppen",
                    icon: "shield",
                    route: "security/authgroup/:id"
                }
            ], "security/authgroup");
        }
        return App;
    }());
    App = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [router_service_1.RouterService])
    ], App);
    exports.App = App;
});

define('config',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        baseUrl: "http://10.20.50.53/TIP.Aurelia",
        apiUrl: "http://10.20.50.53/TIP.Aurelia/api",
        webApiUrl: "http://10.20.50.53/TIP.Aurelia/api/data"
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
            .basicConfiguration()
            .feature("framework/dx")
            .feature("framework/stack-router")
            .feature("framework/security");
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin("aurelia-testing");
        }
        aurelia.start().then(function () { return aurelia.setRoot("framework/security/login-app"); });
    }
    exports.configure = configure;
});

define('framework/default-ui/services/layout-service',["require", "exports"], function (require, exports) {
    "use strict";
    var LayoutService = (function () {
        function LayoutService() {
            this.isSidebarCollapsed = false;
        }
        return LayoutService;
    }());
    exports.LayoutService = LayoutService;
});

define('framework/default-ui/services/export',["require", "exports", "./layout-service"], function (require, exports, layout_service_1) {
    "use strict";
    exports.LayoutService = layout_service_1.LayoutService;
});

define('framework/default-ui/export',["require", "exports", "./services/export"], function (require, exports, export_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(export_1);
});

define('framework/base/event-args/custom-event-args',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/services/object-info-service',["require", "exports"], function (require, exports) {
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
define('framework/base/classes/custom-event',["require", "exports", "aurelia-framework", "../services/object-info-service"], function (require, exports, aurelia_framework_1, object_info_service_1) {
    "use strict";
    var CustomEvent = (function () {
        function CustomEvent(objectInfo, taskQueue) {
            this.objectInfo = objectInfo;
            this.taskQueue = taskQueue;
            this.delegates = [];
            this.argsQueue = [];
            this.waitTimeout = 0;
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
                    this.argsQueue.splice(0, this.argsQueue.length);
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
    CustomEvent = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.transient(),
        __metadata("design:paramtypes", [object_info_service_1.ObjectInfoService,
            aurelia_framework_1.TaskQueue])
    ], CustomEvent);
    exports.CustomEvent = CustomEvent;
});

define('framework/base/classes/export',["require", "exports", "./custom-event"], function (require, exports, custom_event_1) {
    "use strict";
    exports.CustomEvent = custom_event_1.CustomEvent;
});

define('framework/base/event-args/export',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/interfaces/rest-get-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/interfaces/rest-post-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/interfaces/export',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/services/rest-service',["require", "exports", "aurelia-fetch-client", "../../../config"], function (require, exports, aurelia_fetch_client_1, config_1) {
    "use strict";
    var RestService = (function () {
        function RestService() {
        }
        RestService.prototype.get = function (options) {
            var client = new aurelia_fetch_client_1.HttpClient();
            var headers = {};
            headers["X-TIP-API-KEY"] = "61da30dc-46cc-45e6-b9a6-c6cfa65d65af";
            if (options.getOptions) {
                headers["X-GET-OPTIONS"] = JSON.stringify(options.getOptions);
            }
            headers["Content-Type"] = "application/json";
            headers["Accept"] = "application/json";
            return new Promise(function (success, error) {
                client
                    .fetch(options.url, {
                    headers: headers
                })
                    .then(function (r) {
                    if (r.ok) {
                        return r.json();
                    }
                    DevExpress.ui.notify(r.statusText, "error", 3000);
                    error(r);
                })
                    .then(function (r) { return success(r); })
                    .catch(function (r) {
                    error(r);
                });
            });
        };
        RestService.prototype.post = function (options) {
            var client = new aurelia_fetch_client_1.HttpClient();
            var headers = {};
            headers["X-TIP-API-KEY"] = "61da30dc-46cc-45e6-b9a6-c6cfa65d65af";
            if (options.getOptions) {
                headers["X-GET-OPTIONS"] = JSON.stringify(options.getOptions);
            }
            headers["Content-Type"] = "application/json";
            headers["Accept"] = "application/json";
            var body = null;
            if (options.data) {
                if (typeof options.data === "string") {
                    body = options.data;
                }
                else {
                    body = JSON.stringify(options.data);
                }
            }
            return new Promise(function (success, error) {
                client
                    .fetch(options.url, {
                    headers: headers,
                    method: "POST",
                    body: body
                })
                    .then(function (r) {
                    if (r.ok) {
                        return r.json();
                    }
                    DevExpress.ui.notify(r.statusText, "error", 3000);
                    error(r);
                })
                    .then(function (r) { return success(r); })
                    .catch(function (r) {
                    error(r);
                });
            });
        };
        RestService.prototype.getUrl = function (suffix) {
            return config_1.default.baseUrl + "/" + suffix;
        };
        RestService.prototype.getApiUrl = function (suffix) {
            return config_1.default.apiUrl + "/" + suffix;
        };
        RestService.prototype.getWebApiUrl = function (suffix) {
            return config_1.default.webApiUrl + "/" + suffix;
        };
        return RestService;
    }());
    exports.RestService = RestService;
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
define('framework/base/services/authorization-service',["require", "exports", "aurelia-framework", "./rest-service"], function (require, exports, aurelia_framework_1, rest_service_1) {
    "use strict";
    var AuthorizationService = (function () {
        function AuthorizationService(rest, aurelia) {
            this.rest = rest;
            this.aurelia = aurelia;
        }
        AuthorizationService.prototype.login = function (data) {
            var _this = this;
            return this.rest.post({
                url: this.rest.getApiUrl("base/Authorization/Login"),
                data: data
            }).then(function (r) {
                if (r.IsValid) {
                    _this.aurelia.setRoot("app");
                    return true;
                }
                DevExpress.ui.notify("Benutzer oder Passwort ungültig", "error", 3000);
                return false;
            });
        };
        return AuthorizationService;
    }());
    AuthorizationService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [rest_service_1.RestService,
            aurelia_framework_1.Aurelia])
    ], AuthorizationService);
    exports.AuthorizationService = AuthorizationService;
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
define('framework/base/services/deep-observer-service',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
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
        aurelia_framework_1.autoinject,
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

define('framework/base/services/export',["require", "exports", "./authorization-service", "./deep-observer-service", "./object-info-service", "./rest-service"], function (require, exports, authorization_service_1, deep_observer_service_1, object_info_service_1, rest_service_1) {
    "use strict";
    exports.AuthorizationService = authorization_service_1.AuthorizationService;
    exports.DeepObserverService = deep_observer_service_1.DeepObserverService;
    exports.ObjectInfoService = object_info_service_1.ObjectInfoService;
    exports.RestService = rest_service_1.RestService;
});

define('framework/base/export',["require", "exports", "./classes/export", "./services/export"], function (require, exports, export_1, export_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(export_1);
    __export(export_2);
});

define('framework/dx/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config
            .globalResources("./elements/dx-widget");
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
define('framework/forms/classes/command-server-data',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var CommandServerData = (function () {
        function CommandServerData() {
        }
        CommandServerData.prototype.add = function (id, data) {
            this[id] = data;
        };
        return CommandServerData;
    }());
    CommandServerData = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        __metadata("design:paramtypes", [])
    ], CommandServerData);
    exports.CommandServerData = CommandServerData;
});

define('framework/forms/interfaces/binding',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/command',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/command-data',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/edit-popup',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/filter',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/function',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/mapping',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/model',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/variable',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/interfaces/export',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/event-args/model-load-required',["require", "exports"], function (require, exports) {
    "use strict";
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
define('framework/forms/classes/models',["require", "exports", "aurelia-framework", "../../base/export"], function (require, exports, aurelia_framework_1, export_1) {
    "use strict";
    var Models = (function () {
        function Models(rest, onLoadRequired) {
            var _this = this;
            this.rest = rest;
            this.onLoadRequired = onLoadRequired;
            this.onLoadRequired.waitTimeout = 10;
            this.data = {};
            this.info = {};
            this.onLoadRequired.register(function (args) {
                if (args.model.key || args.model.autoLoad) {
                    var getOptions = _this.createGetOptions(args.model);
                    return _this.rest.get({
                        url: _this.rest.getWebApiUrl(args.model.webApiAction + "/" + _this.form.evaluateExpression(args.model.key)),
                        getOptions: getOptions
                    }).then(function (r) {
                        _this.data[args.model.id] = r;
                    });
                }
                return Promise.resolve();
            });
        }
        Models.prototype.addInfo = function (model) {
            this.info[model.id] = model;
            this.addObservers(model);
        };
        Models.prototype.getInfo = function (id) {
            var model = this.info[id];
            if (!model) {
                throw new Error();
            }
            return model;
        };
        Models.prototype.createDataSource = function (model) {
            var _this = this;
            return new DevExpress.data.DataSource(new DevExpress.data.CustomStore({
                key: model.keyProperty,
                byKey: function (key) {
                    var getOptions = _this.createGetOptions(model);
                    return _this.rest.get({
                        url: _this.rest.getWebApiUrl(model.webApiAction + "/" + key),
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
                        url: _this.rest.getWebApiUrl(model.webApiAction),
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
        Models.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        Models.prototype.addObservers = function (model) {
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
        Models.prototype.addObserversWhere = function (model, data) {
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
        Models.prototype.addObserversDetail = function (model, expression) {
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
        Models.prototype.createGetOptions = function (model) {
            var getOptions = {};
            getOptions.expand = model.webApiExpand;
            getOptions.columns = model.webApiColumns;
            if (model.webApiMaxRecords > 0) {
                getOptions.maxRecords = model.webApiMaxRecords;
            }
            getOptions.orderBy = model.webApiOrderBy;
            return getOptions;
        };
        Models.prototype.constructWhere = function (data, where) {
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
        return Models;
    }());
    Models = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        __metadata("design:paramtypes", [export_1.RestService,
            export_1.CustomEvent])
    ], Models);
    exports.Models = Models;
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
define('framework/forms/classes/functions',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Functions = (function () {
        function Functions() {
        }
        Functions.prototype.add = function (id, functionInstance, namespace, customParameters) {
            this[id] = functionInstance;
            if (functionInstance.bind) {
                functionInstance.bind(this.form, namespace, customParameters);
            }
        };
        Functions.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        return Functions;
    }());
    Functions = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        __metadata("design:paramtypes", [])
    ], Functions);
    exports.Functions = Functions;
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
define('framework/forms/classes/variables',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Variables = (function () {
        function Variables() {
            this.data = {};
            this.info = {};
        }
        Variables.prototype.addInfo = function (variable) {
            this.info[variable.id] = variable;
        };
        Variables.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        return Variables;
    }());
    Variables = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        __metadata("design:paramtypes", [])
    ], Variables);
    exports.Variables = Variables;
});

define('framework/forms/services/default-commands-service',["require", "exports"], function (require, exports) {
    "use strict";
    var DefaultCommandsService = (function () {
        function DefaultCommandsService() {
        }
        DefaultCommandsService.prototype.getSaveCommand = function (form) {
            return {
                id: "$cmdSave",
                icon: "floppy-o",
                title: "Speichern",
                isVisible: true,
                isEnabled: true,
                execute: function () {
                    alert("Saved");
                }
            };
        };
        DefaultCommandsService.prototype.getDeleteCommand = function (form) {
            return {
                id: "$cmdDelete",
                icon: "times",
                title: "Löschen",
                isVisible: true,
                isEnabled: false,
                execute: function () {
                    alert("Deleted");
                }
            };
        };
        return DefaultCommandsService;
    }());
    exports.DefaultCommandsService = DefaultCommandsService;
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
define('framework/forms/services/toolbar-service',["require", "exports", "aurelia-framework", "../services/default-commands-service"], function (require, exports, aurelia_framework_1, default_commands_service_1) {
    "use strict";
    var ToolbarService = (function () {
        function ToolbarService(defaultCommands) {
            this.defaultCommands = defaultCommands;
        }
        ToolbarService.prototype.createToolbarOptions = function (form) {
            var _this = this;
            var component;
            var options = {
                onInitialized: function (e) {
                    component = e.component;
                    var items = _this.collectItems(form)
                        .map(function (i) { return _this.convertToToolbarItem(form, component, i); });
                    var titleItem = {
                        text: form.title
                    };
                    items.splice(0, 0, titleItem);
                    form.createObserver("title", function (newValue) {
                        titleItem.text = newValue;
                        component.option("items[0].text", newValue);
                    });
                    component.option("items", items);
                }
            };
            return options;
        };
        ToolbarService.prototype.collectItems = function (form) {
            var items = [];
            items.push(this.defaultCommands.getSaveCommand(form));
            items.push(this.defaultCommands.getDeleteCommand(form));
            for (var _i = 0, _a = form.commands.getCommands(); _i < _a.length; _i++) {
                var command = _a[_i];
                items.push(command);
            }
            return items;
        };
        ToolbarService.prototype.convertToToolbarItem = function (form, toolbar, command) {
            var item = {};
            this.setEnabled(form, toolbar, command, item);
            this.setVisible(form, toolbar, command, item);
            item.template = "itemTemplate";
            item.location = command.location || "before";
            item.locateInMenu = command.locateInMenu;
            item.command = command;
            item.guardedExecute = function () {
                if (item.disabled) {
                    return;
                }
                command.execute();
            };
            return item;
        };
        ToolbarService.prototype.setEnabled = function (form, toolbar, command, item) {
            var _this = this;
            var setEnabled = function (val) {
                item.disabled = !val;
                _this.setItemOption(toolbar, item, "disabled", !val);
            };
            if (command.isEnabled != undefined) {
                item.disabled = !command.isEnabled;
                form.createObserver("isEnabled", function (newValue) {
                    setEnabled(newValue);
                }, command);
            }
            else if (command.isEnabledExpression) {
                item.disabled = !form.evaluateExpression(command.isEnabledExpression);
                form.createObserver(command.isEnabledExpression, function (newValue) {
                    setEnabled(newValue);
                });
            }
        };
        ToolbarService.prototype.setVisible = function (form, toolbar, command, item) {
            var _this = this;
            var setVisible = function (val) {
                item.visible = val;
                _this.setItemOption(toolbar, item, "visible", val);
            };
            if (command.isVisible != undefined) {
                item.visible = command.isVisible;
                form.createObserver("isVisible", function (newValue) {
                    setVisible(newValue);
                }, command);
            }
            else if (command.isVisibleExpression) {
                item.visible = form.evaluateExpression(command.isVisibleExpression);
                form.createObserver(command.isVisibleExpression, function (newValue) {
                    setVisible(newValue);
                });
            }
        };
        ToolbarService.prototype.setItemOption = function (toolbar, item, property, value) {
            var items = toolbar.option("items");
            var index = items.indexOf(item);
            if (index < 0) {
                return;
            }
            toolbar.option("items[" + index + "]." + property, value);
        };
        return ToolbarService;
    }());
    ToolbarService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [default_commands_service_1.DefaultCommandsService])
    ], ToolbarService);
    exports.ToolbarService = ToolbarService;
});

define('framework/forms/widget-options/options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/widget-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/validation-rule',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/editor-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/enums/sort-order-column-enum',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/data-grid-column-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/enums/selection-mode-enum',["require", "exports"], function (require, exports) {
    "use strict";
    var SelectionModeEnum;
    (function (SelectionModeEnum) {
        SelectionModeEnum[SelectionModeEnum["None"] = 0] = "None";
        SelectionModeEnum[SelectionModeEnum["Single"] = 1] = "Single";
        SelectionModeEnum[SelectionModeEnum["Multiple"] = 2] = "Multiple";
    })(SelectionModeEnum = exports.SelectionModeEnum || (exports.SelectionModeEnum = {}));
});

define('framework/forms/widget-options/list-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/accordion-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/calendar-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/check-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/color-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/command-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/data-grid-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/date-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/file-uploader-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/file-uploader-with-viewer-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/include-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/list-view-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/number-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/select-item',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/select-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/popover-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/popup-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/tab-page-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/tab-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/tag-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/text-box-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/text-area-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/widget-options/export',["require", "exports"], function (require, exports) {
    "use strict";
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
define('framework/forms/widget-services/base-widget-creator-service',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
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
define('framework/forms/widget-services/simple-widget-creator-service',["require", "exports", "aurelia-framework", "./base-widget-creator-service"], function (require, exports, aurelia_framework_1, base_widget_creator_service_1) {
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
define('framework/forms/widget-services/data-grid-widget-creator-service',["require", "exports", "aurelia-framework", "./base-widget-creator-service", "../enums/selection-mode-enum"], function (require, exports, aurelia_framework_1, base_widget_creator_service_1, selection_mode_enum_1) {
    "use strict";
    var DataGridWidgetCreatorService = (function () {
        function DataGridWidgetCreatorService(baseWidgetCreator) {
            this.baseWidgetCreator = baseWidgetCreator;
        }
        DataGridWidgetCreatorService.prototype.addDataGrid = function (form, options) {
            var dataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.dataModel) {
                var model_1 = form.models.getInfo(options.dataModel);
                var dataSource_1 = form.models.createDataSource(model_1);
                dataGridOptions.dataSource = dataSource_1;
                dataGridOptions.remoteOperations = {
                    filtering: true,
                    paging: true,
                    sorting: true
                };
                form.models.onLoadRequired.register(function (e) {
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
                dataGridOptions.filterRow = {
                    visible: true
                };
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
                    form.models.data[options.editDataContext] = e.data;
                });
            }
            if (options.editUrl && options.dataModel) {
                var model_2 = form.models.getInfo(options.dataModel);
                if (model_2) {
                    clickActions.push(function (e) {
                        location.assign("#" + options.editUrl + "/" + e.data[model_2.keyProperty]);
                    });
                }
            }
            if (clickActions.length > 0) {
                dataGridOptions.onRowClick = function (e) {
                    clickActions.forEach(function (item) {
                        item(e);
                    });
                };
            }
            if (options.selectionMode) {
                dataGridOptions.selection = {
                    mode: this.getSelectionMode(options.selectionMode)
                };
            }
            if (options.showPagerInfo) {
                dataGridOptions.pager = {
                    visible: true,
                    showInfo: true
                };
            }
            if (options.pageSize) {
                dataGridOptions.paging = {
                    pageSize: options.pageSize,
                    enabled: true
                };
            }
            return dataGridOptions;
        };
        DataGridWidgetCreatorService.prototype.getSelectionMode = function (selectionMode) {
            switch (selectionMode) {
                case selection_mode_enum_1.SelectionModeEnum.Multiple:
                    return "multiple";
                case selection_mode_enum_1.SelectionModeEnum.Single:
                    return "single";
                default:
                    return "none";
            }
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
define('framework/forms/widget-services/widget-creator-service',["require", "exports", "aurelia-framework", "./simple-widget-creator-service", "./data-grid-widget-creator-service"], function (require, exports, aurelia_framework_1, simple_widget_creator_service_1, data_grid_widget_creator_service_1) {
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

define('framework/forms/classes/form-base',["require", "exports"], function (require, exports) {
    "use strict";
    var FormBase = (function () {
        function FormBase(bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData) {
            this.bindingEngine = bindingEngine;
            this.widgetCreator = widgetCreator;
            this.toolbar = toolbar;
            this.models = models;
            this.variables = variables;
            this.functions = functions;
            this.commands = commands;
            this.commandServerData = commandServerData;
            this.expression = new Map();
            this.models.registerForm(this);
            this.variables.registerForm(this);
            this.functions.registerForm(this);
            this.commands.registerForm(this);
            this.toolbarOptions = this.toolbar.createToolbarOptions(this);
        }
        FormBase.prototype.activate = function (routeInfo) {
            if (routeInfo && routeInfo.parameters && routeInfo.parameters.id) {
                this.variables.data.$id = routeInfo.parameters.id;
            }
        };
        FormBase.prototype.createObserver = function (expression, action, bindingContext) {
            return this
                .bindingEngine
                .expressionObserver(bindingContext || this, expression)
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
        FormBase.prototype.addModel = function (model) {
            this.models.addInfo(model);
        };
        FormBase.prototype.addVariable = function (variable) {
            this.variables.addInfo(variable);
        };
        FormBase.prototype.addCommandServerData = function (id, commandServerData) {
            this.commandServerData.add(id, commandServerData);
        };
        FormBase.prototype.addCommand = function (command) {
            this.commands.addInfo(command);
        };
        FormBase.prototype.addFunction = function (id, functionInstance, namespace, customParameter) {
            this.functions.add(id, functionInstance, namespace, customParameter);
        };
        FormBase.prototype.addEditPopup = function (editPopup) {
        };
        FormBase.prototype.addMapping = function (mapping) {
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
define('framework/forms/classes/commands',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Commands = (function () {
        function Commands() {
            this.commands = [];
        }
        Commands.prototype.addInfo = function (command) {
            this.commands.push(command);
        };
        Commands.prototype.getCommands = function () {
            var _this = this;
            return this.commands.map(function (i) { return _this.form.evaluateExpression(i.binding.bindToFQ); });
        };
        Commands.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        return Commands;
    }());
    Commands = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        __metadata("design:paramtypes", [])
    ], Commands);
    exports.Commands = Commands;
});

define('framework/forms/classes/export',["require", "exports", "./command-server-data", "./commands", "./form-base", "./functions", "./models", "./variables"], function (require, exports, command_server_data_1, commands_1, form_base_1, functions_1, models_1, variables_1) {
    "use strict";
    exports.CommandServerData = command_server_data_1.CommandServerData;
    exports.Commands = commands_1.Commands;
    exports.FormBase = form_base_1.FormBase;
    exports.Functions = functions_1.Functions;
    exports.Models = models_1.Models;
    exports.Variables = variables_1.Variables;
});

define('framework/forms/enums/export',["require", "exports", "./selection-mode-enum"], function (require, exports, selection_mode_enum_1) {
    "use strict";
    exports.SelectionModeEnum = selection_mode_enum_1.SelectionModeEnum;
});

define('framework/forms/event-args/export',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/services/export',["require", "exports", "./default-commands-service", "./toolbar-service"], function (require, exports, default_commands_service_1, toolbar_service_1) {
    "use strict";
    exports.DefaultCommandsService = default_commands_service_1.DefaultCommandsService;
    exports.ToolbarService = toolbar_service_1.ToolbarService;
});

define('framework/forms/widget-services/export',["require", "exports", "./widget-creator-service"], function (require, exports, widget_creator_service_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(widget_creator_service_1);
});

define('framework/forms/export',["require", "exports", "./classes/export", "./enums/export", "./services/export", "./widget-services/export"], function (require, exports, export_1, export_2, export_3, export_4) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(export_1);
    __export(export_2);
    __export(export_3);
    __export(export_4);
});

define('framework/stack-router/classes/export',["require", "exports", "./view-item"], function (require, exports, view_item_1) {
    "use strict";
    exports.ViewItem = view_item_1.ViewItem;
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
define('framework/stack-router/services/history-service',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "./router-service"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, router_service_1) {
    "use strict";
    var HistoryService = (function () {
        function HistoryService(eventAggregator, taskQueue, router) {
            this.eventAggregator = eventAggregator;
            this.taskQueue = taskQueue;
            this.router = router;
            this.isActive = false;
            this.register();
        }
        HistoryService.prototype.getUrl = function (url) {
            var hash = url || location.hash;
            if (!hash) {
                return "";
            }
            return hash.substr(1);
        };
        HistoryService.prototype.navigateCurrent = function () {
            var _this = this;
            this.guardedNavigate(function () {
                _this.navigate({
                    url: _this.getUrl()
                });
            });
        };
        HistoryService.prototype.navigateByCode = function (url, clearStack) {
            var _this = this;
            this.guardedNavigate(function () {
                window.location.assign(url);
                _this.navigate({
                    url: _this.getUrl(url),
                    clearStack: clearStack
                });
            });
        };
        HistoryService.prototype.guardedNavigate = function (action) {
            if (this.isActive) {
                return;
            }
            this.isActive = true;
            action();
            this.isActive = false;
        };
        HistoryService.prototype.register = function () {
            var _this = this;
            window.addEventListener("popstate", function (e) {
                _this.guardedNavigate(function () {
                    _this.navigate({
                        historyState: e.state,
                        url: _this.getUrl()
                    });
                });
            });
        };
        HistoryService.prototype.navigate = function (navigationArgs) {
            this.router.navigate(navigationArgs);
            if (!navigationArgs.historyState && navigationArgs.routeInfo) {
                history.replaceState({
                    id: navigationArgs.routeInfo.id,
                    url: navigationArgs.url
                }, navigationArgs.routeInfo.route.title);
            }
        };
        return HistoryService;
    }());
    HistoryService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator,
            aurelia_framework_1.TaskQueue,
            router_service_1.RouterService])
    ], HistoryService);
    exports.HistoryService = HistoryService;
});

define('framework/stack-router/services/export',["require", "exports", "./history-service", "./router-service"], function (require, exports, history_service_1, router_service_1) {
    "use strict";
    exports.HistoryService = history_service_1.HistoryService;
    exports.RouterService = router_service_1.RouterService;
});

define('framework/stack-router/export',["require", "exports", "./classes/export", "./services/export"], function (require, exports, export_1, export_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(export_1);
    __export(export_2);
});

define('framework/stack-router/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config
            .globalResources("./views/stack-router/stack-router")
            .globalResources("./attributes/stack-router-link/stack-router-link");
    }
    exports.configure = configure;
});

define('framework/security/index',["require", "exports"], function (require, exports) {
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
define('framework/security/login-app',["require", "exports", "../stack-router/export", "aurelia-framework"], function (require, exports, export_1, aurelia_framework_1) {
    "use strict";
    var LoginApp = (function () {
        function LoginApp(router) {
            this.router = router;
            router.registerRoutes([
                {
                    moduleId: "framework/security/views/login/login-form",
                    title: "Anmelden",
                    icon: "lock",
                    route: "security/login",
                    isNavigation: true
                }
            ], "security/login");
        }
        return LoginApp;
    }());
    LoginApp = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [export_1.RouterService])
    ], LoginApp);
    exports.LoginApp = LoginApp;
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
define('framework/dx/elements/dx-widget',["require", "exports", "aurelia-framework", "../../base/export", "jquery"], function (require, exports, aurelia_framework_1, export_1, $) {
    "use strict";
    var DxWidget = (function () {
        function DxWidget(element, templatingEngine, bindingEngine, deepObserver) {
            this.element = element;
            this.templatingEngine = templatingEngine;
            this.bindingEngine = bindingEngine;
            this.deepObserver = deepObserver;
            this.templates = {};
        }
        DxWidget.prototype.created = function (owningView, myView) {
            this.extractTemplates();
        };
        DxWidget.prototype.bind = function (bindingContext, overrideContext) {
            this.bindingContext = bindingContext;
            this.checkBindings();
        };
        DxWidget.prototype.attached = function () {
            this.renderInline();
            this.options = this.options || {};
            this.options.onOptionChanged = this.onOptionChanged.bind(this);
            this.options.integrationOptions = {
                templates: this.templates
            };
            var element = $(this.element);
            if (!element[this.name]) {
                throw new Error("Widget " + this.name + " does not exist");
            }
            this.validator ?
                element[this.name](this.options).dxValidator(this.validator) :
                element[this.name](this.options);
            this.instance = element[this.name]("instance");
            this.registerBindings();
        };
        DxWidget.prototype.detached = function () {
            if (this.instance) {
                this.instance._dispose();
                this.instance = null;
            }
            if (this.options && this.options.bindingOptions) {
                for (var _i = 0, _a = this.options.bindingOptions; _i < _a.length; _i++) {
                    var binding = _a[_i];
                    if (binding.deepObserver) {
                        binding.deepObserver();
                        binding.deepObserver = null;
                    }
                }
            }
        };
        DxWidget.prototype.extractTemplates = function () {
            var _this = this;
            $(this.element)
                .children("dx-template")
                .each(function (index, item) {
                var itemJQuery = $(item);
                var name = itemJQuery.attr("name");
                var alias = itemJQuery.attr("alias") || "data";
                _this.templates[name] = {
                    render: function (renderData) {
                        var newItem = item.cloneNode(true);
                        var newElement = $(newItem).appendTo(renderData.container);
                        var model = null;
                        if (renderData.model) {
                            model = {};
                            model[alias] = renderData.model;
                        }
                        var result = _this.templatingEngine.enhance({
                            element: newElement.get(0),
                            bindingContext: model || _this.bindingContext
                        });
                        result.attached();
                        return $(newElement);
                    }
                };
                $(item).remove();
            });
        };
        DxWidget.prototype.registerBindings = function () {
            var _this = this;
            if (!this.options.bindingOptions) {
                return;
            }
            var _loop_1 = function (property) {
                var binding = this_1.options.bindingOptions[property];
                this_1.bindingEngine.expressionObserver(this_1.bindingContext, binding.expression)
                    .subscribe(function (newValue, oldValue) {
                    _this.instance.option(property, newValue);
                    _this.registerDeepObserver(binding, property, value);
                });
                var value = binding.parsed.evaluate({
                    bindingContext: this_1.bindingContext,
                    overrideContext: null
                });
                this_1.instance.option(property, value);
                this_1.registerDeepObserver(binding, property, value);
            };
            var this_1 = this;
            for (var property in this.options.bindingOptions) {
                _loop_1(property);
            }
        };
        DxWidget.prototype.checkBindings = function () {
            if (!this.options.bindingOptions) {
                return;
            }
            for (var property in this.options.bindingOptions) {
                var binding = this.checkBinding(property);
            }
        };
        DxWidget.prototype.checkBinding = function (property) {
            var bindingOptions = this.options.bindingOptions;
            if (typeof bindingOptions[property] === "string") {
                bindingOptions[property] = {
                    expression: bindingOptions[property]
                };
            }
            var binding = bindingOptions[property];
            binding.parsed = this.bindingEngine.parseExpression(binding.expression);
        };
        DxWidget.prototype.registerDeepObserver = function (binding, property, value) {
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
        DxWidget.prototype.onOptionChanged = function (e) {
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
        DxWidget.prototype.renderInline = function () {
            var _this = this;
            $(this.element).children().each(function (index, child) {
                var result = _this.templatingEngine.enhance({
                    element: child,
                    bindingContext: _this.bindingContext
                });
                result.attached();
            });
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
            export_1.DeepObserverService])
    ], DxWidget);
    exports.DxWidget = DxWidget;
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
define('framework/default-ui/views/content/content',["require", "exports", "aurelia-framework", "../../services/layout-service"], function (require, exports, aurelia_framework_1, layout_service_1) {
    "use strict";
    var Content = (function () {
        function Content(layout) {
            this.layout = layout;
        }
        return Content;
    }());
    Content = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [layout_service_1.LayoutService])
    ], Content);
    exports.Content = Content;
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
define('framework/default-ui/views/header/header',["require", "exports", "aurelia-framework", "../../../stack-router/export"], function (require, exports, aurelia_framework_1, export_1) {
    "use strict";
    var Header = (function () {
        function Header(router) {
            this.router = router;
        }
        return Header;
    }());
    Header = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [export_1.RouterService])
    ], Header);
    exports.Header = Header;
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
define('framework/default-ui/views/container/container',["require", "exports", "aurelia-framework", "../../services/layout-service"], function (require, exports, aurelia_framework_1, layout_service_1) {
    "use strict";
    var Container = (function () {
        function Container(layout) {
            this.layout = layout;
        }
        Object.defineProperty(Container.prototype, "className", {
            get: function () {
                return this.layout.isSidebarCollapsed
                    ? "t--sidebar-collapsed"
                    : "t--sidebar-expanded";
            },
            enumerable: true,
            configurable: true
        });
        return Container;
    }());
    __decorate([
        aurelia_framework_1.computedFrom("layout.isSidebarCollapsed"),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], Container.prototype, "className", null);
    Container = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [layout_service_1.LayoutService])
    ], Container);
    exports.Container = Container;
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
define('framework/default-ui/views/sidebar/sidebar',["require", "exports", "aurelia-framework", "../../services/layout-service", "../../../stack-router/export"], function (require, exports, aurelia_framework_1, layout_service_1, export_1) {
    "use strict";
    var Sidebar = (function () {
        function Sidebar(layout, router) {
            this.layout = layout;
            this.router = router;
        }
        Object.defineProperty(Sidebar.prototype, "headerIcon", {
            get: function () {
                if (this.layout.isSidebarCollapsed) {
                    return "bars";
                }
                else {
                    return "arrow-circle-left";
                }
            },
            enumerable: true,
            configurable: true
        });
        Sidebar.prototype.onHeaderClicked = function () {
            this.layout.isSidebarCollapsed = !this.layout.isSidebarCollapsed;
        };
        return Sidebar;
    }());
    __decorate([
        aurelia_framework_1.computedFrom("layout.isSidebarCollapsed"),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], Sidebar.prototype, "headerIcon", null);
    Sidebar = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [layout_service_1.LayoutService,
            export_1.RouterService])
    ], Sidebar);
    exports.Sidebar = Sidebar;
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
define('framework/stack-router/attributes/stack-router-link/stack-router-link',["require", "exports", "aurelia-framework", "../../services/history-service"], function (require, exports, aurelia_framework_1, history_service_1) {
    "use strict";
    var StackRouterLinkCustomAttribute = (function () {
        function StackRouterLinkCustomAttribute(element, history) {
            this.element = element;
            this.history = history;
        }
        StackRouterLinkCustomAttribute.prototype.bind = function () {
            var _this = this;
            this.element.addEventListener("click", function (e) {
                var event = window.event;
                if (!event.ctrlKey
                    && !event.altKey
                    && !event.shiftKey
                    && !event.metaKey) {
                    _this.history.navigateByCode(_this.element.getAttribute("href"), _this.clearStack);
                    e.preventDefault();
                }
            });
        };
        return StackRouterLinkCustomAttribute;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Boolean)
    ], StackRouterLinkCustomAttribute.prototype, "clearStack", void 0);
    StackRouterLinkCustomAttribute = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [Element,
            history_service_1.HistoryService])
    ], StackRouterLinkCustomAttribute);
    exports.StackRouterLinkCustomAttribute = StackRouterLinkCustomAttribute;
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
define('framework/stack-router/views/stack-router/stack-router',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../services/router-service", "../../services/history-service"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, router_service_1, history_service_1) {
    "use strict";
    var StackRouter = (function () {
        function StackRouter(history, router, eventAggregator) {
            this.history = history;
            this.router = router;
            this.eventAggregator = eventAggregator;
        }
        StackRouter.prototype.created = function (owningView) {
            this.owningView = owningView;
        };
        StackRouter.prototype.bind = function (bindingContext, overrideContext) {
            this.bindingContext = bindingContext;
            this.overrideContext = overrideContext;
        };
        StackRouter.prototype.attached = function () {
            this.history.navigateCurrent();
        };
        return StackRouter;
    }());
    StackRouter = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [history_service_1.HistoryService,
            router_service_1.RouterService,
            aurelia_event_aggregator_1.EventAggregator])
    ], StackRouter);
    exports.StackRouter = StackRouter;
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
define('framework/stack-router/views/view/view',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var View = (function () {
        function View(bindingEngine) {
            this.bindingEngine = bindingEngine;
        }
        Object.defineProperty(View.prototype, "toolbarOptions", {
            get: function () {
                if (!this.controller || !this.controller.currentViewModel) {
                    return null;
                }
                return this.controller.currentViewModel.toolbarOptions;
            },
            enumerable: true,
            configurable: true
        });
        return View;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], View.prototype, "view", void 0);
    __decorate([
        aurelia_framework_1.computedFrom("controller.currentViewModel.toolbarOptions"),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], View.prototype, "toolbarOptions", null);
    View = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_framework_1.BindingEngine])
    ], View);
    exports.View = View;
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
define('framework/security/views/authgroup/authgroup-edit-form',["require", "exports", "aurelia-framework", "../../../forms/classes/form-base", "aurelia-framework", "../../../forms/widget-services/widget-creator-service", "../../../forms/services/toolbar-service", "../../../forms/classes/models", "../../../forms/classes/variables", "../../../forms/classes/functions", "../../../forms/classes/commands", "../../../forms/classes/command-server-data"], function (require, exports, aurelia_framework_1, form_base_1, aurelia_framework_2, widget_creator_service_1, toolbar_service_1, models_1, variables_1, functions_1, commands_1, command_server_data_1) {
    "use strict";
    var AuthgroupEditForm = (function (_super) {
        __extends(AuthgroupEditForm, _super);
        function AuthgroupEditForm(bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData) {
            var _this = _super.call(this, bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData) || this;
            _this.addModel({
                "id": "$m_A",
                "webApiAction": "base/Security/Authgroup",
                "key": "variables.data.$id",
                "keyProperty": "Id",
                "postOnSave": true,
                "isMain": true,
                "filters": []
            });
            _this.widgetCreator.addTextBox(_this, {
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
            _this.widgetCreator.addSelectBox(_this, {
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
            return _this;
        }
        return AuthgroupEditForm;
    }(form_base_1.FormBase));
    AuthgroupEditForm = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_framework_2.BindingEngine, widget_creator_service_1.WidgetCreatorService, toolbar_service_1.ToolbarService, models_1.Models, variables_1.Variables, functions_1.Functions, commands_1.Commands, command_server_data_1.CommandServerData])
    ], AuthgroupEditForm);
    exports.AuthgroupEditForm = AuthgroupEditForm;
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
define('framework/security/views/authgroup/authgroup-list-form',["require", "exports", "aurelia-framework", "../../../forms/classes/form-base", "aurelia-framework", "../../../forms/widget-services/widget-creator-service", "../../../forms/services/toolbar-service", "../../../forms/classes/models", "../../../forms/classes/variables", "../../../forms/classes/functions", "../../../forms/classes/commands", "../../../forms/classes/command-server-data"], function (require, exports, aurelia_framework_1, form_base_1, aurelia_framework_2, widget_creator_service_1, toolbar_service_1, models_1, variables_1, functions_1, commands_1, command_server_data_1) {
    "use strict";
    var AuthgroupListForm = (function (_super) {
        __extends(AuthgroupListForm, _super);
        function AuthgroupListForm(bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData) {
            var _this = _super.call(this, bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData) || this;
            _this.addModel({
                "id": "$m_A",
                "webApiAction": "base/Security/Authgroup",
                "webApiExpand": {
                    "Mandator": null
                },
                "keyProperty": "Id",
                "filters": []
            });
            _this.widgetCreator.addDataGrid(_this, {
                "columns": [{
                        "bindTo": "Name",
                        "sortIndex": 0,
                        "sortOrder": "asc"
                    }, {
                        "caption": "Mandant",
                        "bindTo": "Mandator.Name"
                    }],
                "binding": {
                    "dataContext": "$m_A",
                    "bindToFQ": "models.data.$m_A."
                },
                "dataModel": "$m_A",
                "editUrl": "security/authgroup",
                "addShortscuts": true,
                "isMainList": true,
                "edits": [],
                "filters": [],
                "commands": [],
                "id": "ide101d8f6dac54ee9a59accc9834ff055",
                "options": {
                    "optionsName": "ide101d8f6dac54ee9a59accc9834ff055Options",
                    "optionsNameFQ": "ide101d8f6dac54ee9a59accc9834ff055Options"
                }
            });
            return _this;
        }
        return AuthgroupListForm;
    }(form_base_1.FormBase));
    AuthgroupListForm = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_framework_2.BindingEngine, widget_creator_service_1.WidgetCreatorService, toolbar_service_1.ToolbarService, models_1.Models, variables_1.Variables, functions_1.Functions, commands_1.Commands, command_server_data_1.CommandServerData])
    ], AuthgroupListForm);
    exports.AuthgroupListForm = AuthgroupListForm;
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
define('framework/security/views/login/login.funcs',["require", "exports", "aurelia-framework", "../../../base/export"], function (require, exports, aurelia_framework_1, export_1) {
    "use strict";
    var LoginFuncs = (function () {
        function LoginFuncs(authorization) {
            var _this = this;
            this.authorization = authorization;
            this.loginCommand = {
                id: "$login",
                title: "Anmelden",
                execute: function () {
                    _this.authorization.login(_this.form.models.data.$m_login);
                }
            };
        }
        LoginFuncs.prototype.bind = function (form) {
            this.form = form;
            form.models.data.$m_login = {
                StayLoggedOn: false
            };
        };
        return LoginFuncs;
    }());
    LoginFuncs = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [export_1.AuthorizationService])
    ], LoginFuncs);
    exports.LoginFuncs = LoginFuncs;
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
define('framework/security/views/login/login-form',["require", "exports", "aurelia-framework", "../../../forms/classes/form-base", "aurelia-framework", "../../../forms/widget-services/widget-creator-service", "../../../forms/services/toolbar-service", "../../../forms/classes/models", "../../../forms/classes/variables", "../../../forms/classes/functions", "../../../forms/classes/commands", "../../../forms/classes/command-server-data", "./login.funcs"], function (require, exports, aurelia_framework_1, form_base_1, aurelia_framework_2, widget_creator_service_1, toolbar_service_1, models_1, variables_1, functions_1, commands_1, command_server_data_1, login_funcs_1) {
    "use strict";
    var LoginForm = (function (_super) {
        __extends(LoginForm, _super);
        function LoginForm(bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData, $f) {
            var _this = _super.call(this, bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData) || this;
            _this.$f = $f;
            _this.addModel({
                "id": "$m_login",
                "filters": []
            });
            _this.addFunction("$f", $f, "functions.$f");
            _this.widgetCreator.addTextBox(_this, {
                "caption": "Benutzername",
                "binding": {
                    "dataContext": "$m_login",
                    "bindTo": "Username",
                    "bindToFQ": "models.data.$m_login.Username"
                },
                "validationRules": [],
                "id": "idc1b6cc850c26488295131545f145d904",
                "options": {
                    "optionsName": "idc1b6cc850c26488295131545f145d904Options",
                    "optionsNameFQ": "idc1b6cc850c26488295131545f145d904Options"
                }
            });
            _this.widgetCreator.addTextBox(_this, {
                "caption": "Passwort",
                "binding": {
                    "dataContext": "$m_login",
                    "bindTo": "Password",
                    "bindToFQ": "models.data.$m_login.Password"
                },
                "validationRules": [],
                "id": "idf05d27b222ea43238e235e688ae5b529",
                "options": {
                    "optionsName": "idf05d27b222ea43238e235e688ae5b529Options",
                    "optionsNameFQ": "idf05d27b222ea43238e235e688ae5b529Options"
                }
            });
            _this.widgetCreator.addCheckBox(_this, {
                "caption": "Angemeldet bleiben",
                "binding": {
                    "dataContext": "$m_login",
                    "bindTo": "StayLoggedOn",
                    "bindToFQ": "models.data.$m_login.StayLoggedOn"
                },
                "validationRules": [],
                "id": "id57c9ed9065dd45fab243831cdc851812",
                "options": {
                    "optionsName": "id57c9ed9065dd45fab243831cdc851812Options",
                    "optionsNameFQ": "id57c9ed9065dd45fab243831cdc851812Options"
                }
            });
            _this.widgetCreator.addCommand(_this, {
                "id": "id6c8e49802d3a4559b478a993119ad921",
                "options": {
                    "optionsName": "id6c8e49802d3a4559b478a993119ad921Options",
                    "optionsNameFQ": "id6c8e49802d3a4559b478a993119ad921Options"
                },
                "binding": {
                    "bindTo": "$f.loginCommand",
                    "bindToFQ": "functions.$f.loginCommand",
                    "propertyPrefix": "$f"
                }
            });
            return _this;
        }
        return LoginForm;
    }(form_base_1.FormBase));
    LoginForm = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_framework_2.BindingEngine, widget_creator_service_1.WidgetCreatorService, toolbar_service_1.ToolbarService, models_1.Models, variables_1.Variables, functions_1.Functions, commands_1.Commands, command_server_data_1.CommandServerData, login_funcs_1.LoginFuncs])
    ], LoginForm);
    exports.LoginForm = LoginForm;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./framework/default-ui/views/container/container\"></require>\r\n  <container></container>\r\n</template>\r\n"; });
define('text!framework/security/login-app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../default-ui/views/container/container\"></require>\r\n  <container></container>\r\n</template>\r\n"; });
define('text!framework/dx/elements/dx-widget.html', ['module'], function(module) { module.exports = "<template class=\"dx-widget\">\r\n    <require from=\"devextreme\"></require>\r\n</template>"; });
define('text!framework/default-ui/styles/bootstrap.css', ['module'], function(module) { module.exports = "@-ms-viewport {\n  width: device-width;\n}\n.visible-xs,\n.visible-sm,\n.visible-md,\n.visible-lg {\n  display: none !important;\n}\n.visible-xs-block,\n.visible-xs-inline,\n.visible-xs-inline-block,\n.visible-sm-block,\n.visible-sm-inline,\n.visible-sm-inline-block,\n.visible-md-block,\n.visible-md-inline,\n.visible-md-inline-block,\n.visible-lg-block,\n.visible-lg-inline,\n.visible-lg-inline-block {\n  display: none !important;\n}\n@media (max-width: 767px) {\n  .visible-xs {\n    display: block !important;\n  }\n  table.visible-xs {\n    display: table;\n  }\n  tr.visible-xs {\n    display: table-row !important;\n  }\n  th.visible-xs,\n  td.visible-xs {\n    display: table-cell !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-block {\n    display: block !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-inline {\n    display: inline !important;\n  }\n}\n@media (max-width: 767px) {\n  .visible-xs-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm {\n    display: block !important;\n  }\n  table.visible-sm {\n    display: table;\n  }\n  tr.visible-sm {\n    display: table-row !important;\n  }\n  th.visible-sm,\n  td.visible-sm {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-block {\n    display: block !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md {\n    display: block !important;\n  }\n  table.visible-md {\n    display: table;\n  }\n  tr.visible-md {\n    display: table-row !important;\n  }\n  th.visible-md,\n  td.visible-md {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-block {\n    display: block !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg {\n    display: block !important;\n  }\n  table.visible-lg {\n    display: table;\n  }\n  tr.visible-lg {\n    display: table-row !important;\n  }\n  th.visible-lg,\n  td.visible-lg {\n    display: table-cell !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-block {\n    display: block !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-inline {\n    display: inline !important;\n  }\n}\n@media (min-width: 1200px) {\n  .visible-lg-inline-block {\n    display: inline-block !important;\n  }\n}\n@media (max-width: 767px) {\n  .hidden-xs {\n    display: none !important;\n  }\n}\n@media (min-width: 768px) and (max-width: 991px) {\n  .hidden-sm {\n    display: none !important;\n  }\n}\n@media (min-width: 992px) and (max-width: 1199px) {\n  .hidden-md {\n    display: none !important;\n  }\n}\n@media (min-width: 1200px) {\n  .hidden-lg {\n    display: none !important;\n  }\n}\n.visible-print {\n  display: none !important;\n}\n@media print {\n  .visible-print {\n    display: block !important;\n  }\n  table.visible-print {\n    display: table;\n  }\n  tr.visible-print {\n    display: table-row !important;\n  }\n  th.visible-print,\n  td.visible-print {\n    display: table-cell !important;\n  }\n}\n.visible-print-block {\n  display: none !important;\n}\n@media print {\n  .visible-print-block {\n    display: block !important;\n  }\n}\n.visible-print-inline {\n  display: none !important;\n}\n@media print {\n  .visible-print-inline {\n    display: inline !important;\n  }\n}\n.visible-print-inline-block {\n  display: none !important;\n}\n@media print {\n  .visible-print-inline-block {\n    display: inline-block !important;\n  }\n}\n@media print {\n  .hidden-print {\n    display: none !important;\n  }\n}\n.container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n@media (min-width: 768px) {\n  .container {\n    width: 750px;\n  }\n}\n@media (min-width: 992px) {\n  .container {\n    width: 970px;\n  }\n}\n@media (min-width: 1200px) {\n  .container {\n    width: 1170px;\n  }\n}\n.container-fluid {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.row {\n  margin-left: -15px;\n  margin-right: -15px;\n}\n.col,\n.col-xs-1,\n.col-sm-1,\n.col-md-1,\n.col-lg-1,\n.col-xs-2,\n.col-sm-2,\n.col-md-2,\n.col-lg-2,\n.col-xs-3,\n.col-sm-3,\n.col-md-3,\n.col-lg-3,\n.col-xs-4,\n.col-sm-4,\n.col-md-4,\n.col-lg-4,\n.col-xs-5,\n.col-sm-5,\n.col-md-5,\n.col-lg-5,\n.col-xs-6,\n.col-sm-6,\n.col-md-6,\n.col-lg-6,\n.col-xs-7,\n.col-sm-7,\n.col-md-7,\n.col-lg-7,\n.col-xs-8,\n.col-sm-8,\n.col-md-8,\n.col-lg-8,\n.col-xs-9,\n.col-sm-9,\n.col-md-9,\n.col-lg-9,\n.col-xs-10,\n.col-sm-10,\n.col-md-10,\n.col-lg-10,\n.col-xs-11,\n.col-sm-11,\n.col-md-11,\n.col-lg-11,\n.col-xs-12,\n.col-sm-12,\n.col-md-12,\n.col-lg-12 {\n  position: relative;\n  min-height: 1px;\n  padding-left: 15px;\n  padding-right: 15px;\n}\n.col,\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11,\n.col-xs-12 {\n  float: left;\n}\n.col-xs-12 {\n  width: 100%;\n}\n.col-xs-11 {\n  width: 91.66666667%;\n}\n.col-xs-10 {\n  width: 83.33333333%;\n}\n.col-xs-9 {\n  width: 75%;\n}\n.col-xs-8 {\n  width: 66.66666667%;\n}\n.col-xs-7 {\n  width: 58.33333333%;\n}\n.col-xs-6 {\n  width: 50%;\n}\n.col-xs-5 {\n  width: 41.66666667%;\n}\n.col-xs-4 {\n  width: 33.33333333%;\n}\n.col-xs-3 {\n  width: 25%;\n}\n.col-xs-2 {\n  width: 16.66666667%;\n}\n.col-xs-1 {\n  width: 8.33333333%;\n}\n.col-xs-pull-12 {\n  right: 100%;\n}\n.col-xs-pull-11 {\n  right: 91.66666667%;\n}\n.col-xs-pull-10 {\n  right: 83.33333333%;\n}\n.col-xs-pull-9 {\n  right: 75%;\n}\n.col-xs-pull-8 {\n  right: 66.66666667%;\n}\n.col-xs-pull-7 {\n  right: 58.33333333%;\n}\n.col-xs-pull-6 {\n  right: 50%;\n}\n.col-xs-pull-5 {\n  right: 41.66666667%;\n}\n.col-xs-pull-4 {\n  right: 33.33333333%;\n}\n.col-xs-pull-3 {\n  right: 25%;\n}\n.col-xs-pull-2 {\n  right: 16.66666667%;\n}\n.col-xs-pull-1 {\n  right: 8.33333333%;\n}\n.col-xs-pull-0 {\n  right: auto;\n}\n.col-xs-push-12 {\n  left: 100%;\n}\n.col-xs-push-11 {\n  left: 91.66666667%;\n}\n.col-xs-push-10 {\n  left: 83.33333333%;\n}\n.col-xs-push-9 {\n  left: 75%;\n}\n.col-xs-push-8 {\n  left: 66.66666667%;\n}\n.col-xs-push-7 {\n  left: 58.33333333%;\n}\n.col-xs-push-6 {\n  left: 50%;\n}\n.col-xs-push-5 {\n  left: 41.66666667%;\n}\n.col-xs-push-4 {\n  left: 33.33333333%;\n}\n.col-xs-push-3 {\n  left: 25%;\n}\n.col-xs-push-2 {\n  left: 16.66666667%;\n}\n.col-xs-push-1 {\n  left: 8.33333333%;\n}\n.col-xs-push-0 {\n  left: auto;\n}\n.col-xs-offset-12 {\n  margin-left: 100%;\n}\n.col-xs-offset-11 {\n  margin-left: 91.66666667%;\n}\n.col-xs-offset-10 {\n  margin-left: 83.33333333%;\n}\n.col-xs-offset-9 {\n  margin-left: 75%;\n}\n.col-xs-offset-8 {\n  margin-left: 66.66666667%;\n}\n.col-xs-offset-7 {\n  margin-left: 58.33333333%;\n}\n.col-xs-offset-6 {\n  margin-left: 50%;\n}\n.col-xs-offset-5 {\n  margin-left: 41.66666667%;\n}\n.col-xs-offset-4 {\n  margin-left: 33.33333333%;\n}\n.col-xs-offset-3 {\n  margin-left: 25%;\n}\n.col-xs-offset-2 {\n  margin-left: 16.66666667%;\n}\n.col-xs-offset-1 {\n  margin-left: 8.33333333%;\n}\n.col-xs-offset-0 {\n  margin-left: 0%;\n}\n@media (min-width: 768px) {\n  .col,\n  .col-sm-1,\n  .col-sm-2,\n  .col-sm-3,\n  .col-sm-4,\n  .col-sm-5,\n  .col-sm-6,\n  .col-sm-7,\n  .col-sm-8,\n  .col-sm-9,\n  .col-sm-10,\n  .col-sm-11,\n  .col-sm-12 {\n    float: left;\n  }\n  .col-sm-12 {\n    width: 100%;\n  }\n  .col-sm-11 {\n    width: 91.66666667%;\n  }\n  .col-sm-10 {\n    width: 83.33333333%;\n  }\n  .col-sm-9 {\n    width: 75%;\n  }\n  .col-sm-8 {\n    width: 66.66666667%;\n  }\n  .col-sm-7 {\n    width: 58.33333333%;\n  }\n  .col-sm-6 {\n    width: 50%;\n  }\n  .col-sm-5 {\n    width: 41.66666667%;\n  }\n  .col-sm-4 {\n    width: 33.33333333%;\n  }\n  .col-sm-3 {\n    width: 25%;\n  }\n  .col-sm-2 {\n    width: 16.66666667%;\n  }\n  .col-sm-1 {\n    width: 8.33333333%;\n  }\n  .col-sm-pull-12 {\n    right: 100%;\n  }\n  .col-sm-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-sm-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-sm-pull-9 {\n    right: 75%;\n  }\n  .col-sm-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-sm-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-sm-pull-6 {\n    right: 50%;\n  }\n  .col-sm-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-sm-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-sm-pull-3 {\n    right: 25%;\n  }\n  .col-sm-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-sm-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-sm-pull-0 {\n    right: auto;\n  }\n  .col-sm-push-12 {\n    left: 100%;\n  }\n  .col-sm-push-11 {\n    left: 91.66666667%;\n  }\n  .col-sm-push-10 {\n    left: 83.33333333%;\n  }\n  .col-sm-push-9 {\n    left: 75%;\n  }\n  .col-sm-push-8 {\n    left: 66.66666667%;\n  }\n  .col-sm-push-7 {\n    left: 58.33333333%;\n  }\n  .col-sm-push-6 {\n    left: 50%;\n  }\n  .col-sm-push-5 {\n    left: 41.66666667%;\n  }\n  .col-sm-push-4 {\n    left: 33.33333333%;\n  }\n  .col-sm-push-3 {\n    left: 25%;\n  }\n  .col-sm-push-2 {\n    left: 16.66666667%;\n  }\n  .col-sm-push-1 {\n    left: 8.33333333%;\n  }\n  .col-sm-push-0 {\n    left: auto;\n  }\n  .col-sm-offset-12 {\n    margin-left: 100%;\n  }\n  .col-sm-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-sm-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-sm-offset-9 {\n    margin-left: 75%;\n  }\n  .col-sm-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-sm-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-sm-offset-6 {\n    margin-left: 50%;\n  }\n  .col-sm-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-sm-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-sm-offset-3 {\n    margin-left: 25%;\n  }\n  .col-sm-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-sm-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-sm-offset-0 {\n    margin-left: 0%;\n  }\n}\n@media (min-width: 992px) {\n  .col,\n  .col-md-1,\n  .col-md-2,\n  .col-md-3,\n  .col-md-4,\n  .col-md-5,\n  .col-md-6,\n  .col-md-7,\n  .col-md-8,\n  .col-md-9,\n  .col-md-10,\n  .col-md-11,\n  .col-md-12 {\n    float: left;\n  }\n  .col-md-12 {\n    width: 100%;\n  }\n  .col-md-11 {\n    width: 91.66666667%;\n  }\n  .col-md-10 {\n    width: 83.33333333%;\n  }\n  .col-md-9 {\n    width: 75%;\n  }\n  .col-md-8 {\n    width: 66.66666667%;\n  }\n  .col-md-7 {\n    width: 58.33333333%;\n  }\n  .col-md-6 {\n    width: 50%;\n  }\n  .col-md-5 {\n    width: 41.66666667%;\n  }\n  .col-md-4 {\n    width: 33.33333333%;\n  }\n  .col-md-3 {\n    width: 25%;\n  }\n  .col-md-2 {\n    width: 16.66666667%;\n  }\n  .col-md-1 {\n    width: 8.33333333%;\n  }\n  .col-md-pull-12 {\n    right: 100%;\n  }\n  .col-md-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-md-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-md-pull-9 {\n    right: 75%;\n  }\n  .col-md-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-md-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-md-pull-6 {\n    right: 50%;\n  }\n  .col-md-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-md-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-md-pull-3 {\n    right: 25%;\n  }\n  .col-md-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-md-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-md-pull-0 {\n    right: auto;\n  }\n  .col-md-push-12 {\n    left: 100%;\n  }\n  .col-md-push-11 {\n    left: 91.66666667%;\n  }\n  .col-md-push-10 {\n    left: 83.33333333%;\n  }\n  .col-md-push-9 {\n    left: 75%;\n  }\n  .col-md-push-8 {\n    left: 66.66666667%;\n  }\n  .col-md-push-7 {\n    left: 58.33333333%;\n  }\n  .col-md-push-6 {\n    left: 50%;\n  }\n  .col-md-push-5 {\n    left: 41.66666667%;\n  }\n  .col-md-push-4 {\n    left: 33.33333333%;\n  }\n  .col-md-push-3 {\n    left: 25%;\n  }\n  .col-md-push-2 {\n    left: 16.66666667%;\n  }\n  .col-md-push-1 {\n    left: 8.33333333%;\n  }\n  .col-md-push-0 {\n    left: auto;\n  }\n  .col-md-offset-12 {\n    margin-left: 100%;\n  }\n  .col-md-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-md-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-md-offset-9 {\n    margin-left: 75%;\n  }\n  .col-md-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-md-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-md-offset-6 {\n    margin-left: 50%;\n  }\n  .col-md-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-md-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-md-offset-3 {\n    margin-left: 25%;\n  }\n  .col-md-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-md-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-md-offset-0 {\n    margin-left: 0%;\n  }\n}\n@media (min-width: 1200px) {\n  .col,\n  .col-lg-1,\n  .col-lg-2,\n  .col-lg-3,\n  .col-lg-4,\n  .col-lg-5,\n  .col-lg-6,\n  .col-lg-7,\n  .col-lg-8,\n  .col-lg-9,\n  .col-lg-10,\n  .col-lg-11,\n  .col-lg-12 {\n    float: left;\n  }\n  .col-lg-12 {\n    width: 100%;\n  }\n  .col-lg-11 {\n    width: 91.66666667%;\n  }\n  .col-lg-10 {\n    width: 83.33333333%;\n  }\n  .col-lg-9 {\n    width: 75%;\n  }\n  .col-lg-8 {\n    width: 66.66666667%;\n  }\n  .col-lg-7 {\n    width: 58.33333333%;\n  }\n  .col-lg-6 {\n    width: 50%;\n  }\n  .col-lg-5 {\n    width: 41.66666667%;\n  }\n  .col-lg-4 {\n    width: 33.33333333%;\n  }\n  .col-lg-3 {\n    width: 25%;\n  }\n  .col-lg-2 {\n    width: 16.66666667%;\n  }\n  .col-lg-1 {\n    width: 8.33333333%;\n  }\n  .col-lg-pull-12 {\n    right: 100%;\n  }\n  .col-lg-pull-11 {\n    right: 91.66666667%;\n  }\n  .col-lg-pull-10 {\n    right: 83.33333333%;\n  }\n  .col-lg-pull-9 {\n    right: 75%;\n  }\n  .col-lg-pull-8 {\n    right: 66.66666667%;\n  }\n  .col-lg-pull-7 {\n    right: 58.33333333%;\n  }\n  .col-lg-pull-6 {\n    right: 50%;\n  }\n  .col-lg-pull-5 {\n    right: 41.66666667%;\n  }\n  .col-lg-pull-4 {\n    right: 33.33333333%;\n  }\n  .col-lg-pull-3 {\n    right: 25%;\n  }\n  .col-lg-pull-2 {\n    right: 16.66666667%;\n  }\n  .col-lg-pull-1 {\n    right: 8.33333333%;\n  }\n  .col-lg-pull-0 {\n    right: auto;\n  }\n  .col-lg-push-12 {\n    left: 100%;\n  }\n  .col-lg-push-11 {\n    left: 91.66666667%;\n  }\n  .col-lg-push-10 {\n    left: 83.33333333%;\n  }\n  .col-lg-push-9 {\n    left: 75%;\n  }\n  .col-lg-push-8 {\n    left: 66.66666667%;\n  }\n  .col-lg-push-7 {\n    left: 58.33333333%;\n  }\n  .col-lg-push-6 {\n    left: 50%;\n  }\n  .col-lg-push-5 {\n    left: 41.66666667%;\n  }\n  .col-lg-push-4 {\n    left: 33.33333333%;\n  }\n  .col-lg-push-3 {\n    left: 25%;\n  }\n  .col-lg-push-2 {\n    left: 16.66666667%;\n  }\n  .col-lg-push-1 {\n    left: 8.33333333%;\n  }\n  .col-lg-push-0 {\n    left: auto;\n  }\n  .col-lg-offset-12 {\n    margin-left: 100%;\n  }\n  .col-lg-offset-11 {\n    margin-left: 91.66666667%;\n  }\n  .col-lg-offset-10 {\n    margin-left: 83.33333333%;\n  }\n  .col-lg-offset-9 {\n    margin-left: 75%;\n  }\n  .col-lg-offset-8 {\n    margin-left: 66.66666667%;\n  }\n  .col-lg-offset-7 {\n    margin-left: 58.33333333%;\n  }\n  .col-lg-offset-6 {\n    margin-left: 50%;\n  }\n  .col-lg-offset-5 {\n    margin-left: 41.66666667%;\n  }\n  .col-lg-offset-4 {\n    margin-left: 33.33333333%;\n  }\n  .col-lg-offset-3 {\n    margin-left: 25%;\n  }\n  .col-lg-offset-2 {\n    margin-left: 16.66666667%;\n  }\n  .col-lg-offset-1 {\n    margin-left: 8.33333333%;\n  }\n  .col-lg-offset-0 {\n    margin-left: 0%;\n  }\n}\n.clearfix,\n.clearfix:before,\n.clearfix:after,\n.container:before,\n.container:after,\n.container-fluid:before,\n.container-fluid:after,\n.row:before,\n.row:after {\n  content: \" \";\n  display: table;\n}\n.clearfix:after,\n.container:after,\n.container-fluid:after,\n.row:after {\n  clear: both;\n}\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n.pull-right {\n  float: right !important;\n}\n.pull-left {\n  float: left !important;\n}\n*,\n*:before,\n*:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n"; });
define('text!framework/default-ui/styles/variables.css', ['module'], function(module) { module.exports = ""; });
define('text!framework/default-ui/views/header/header.html', ['module'], function(module) { module.exports = "<template class=\"t--header\">\r\n  <require from=\"./header.css\"></require>\r\n\r\n  <div>\r\n    ${router.currentViewItem.title}\r\n  </div>\r\n</template>"; });
define('text!framework/default-ui/views/sidebar/sidebar.html', ['module'], function(module) { module.exports = "<template class=\"t--sidebar\">\r\n  <require from=\"./sidebar.css\"></require>\r\n\r\n  <div class=\"t--sidebar-header\" click.delegate=\"onHeaderClicked()\">\r\n    <div class=\"t--sidebar-header-title\">\r\n      Navigation\r\n    </div>\r\n    <div class=\"t--sidebar-header-icon\">\r\n      <i class=\"fa fa-${headerIcon}\"></i>\r\n    </div>\r\n  </div>\r\n\r\n  <ul>\r\n    <li\r\n      class=\"t--sidebar-item\" \r\n      repeat.for=\"route of router.navigationRoutes\">\r\n      <a href=\"#${route.route}\" stack-router-link=\"clear-stack.bind: true\">\r\n        <span class=\"t--sidebar-item-title\">\r\n          ${route.title}\r\n        </span>\r\n        <span class=\"t--sidebar-item-icon\" if.bind=\"route.icon\">\r\n          <i class=\"fa fa-${route.icon}\"></i>\r\n        </span>\r\n      </a>\r\n    </li>\r\n  </ul>\r\n</template>\r\n"; });
define('text!framework/default-ui/views/content/content.html', ['module'], function(module) { module.exports = "<template class=\"t--content\">\r\n  <require from=\"./content.css\"></require>\r\n\r\n  <stack-router></stack-router>\r\n</template>\r\n"; });
define('text!framework/default-ui/views/header/header.css', ['module'], function(module) { module.exports = ".t--header {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  margin-left: 280px;\n  padding: 0 12px;\n}\n.t--sidebar-collapsed .t--header {\n  margin-left: 60px;\n}\n"; });
define('text!framework/default-ui/views/container/container.html', ['module'], function(module) { module.exports = "<template class=\"t--container\" class.bind=\"className\">\r\n  <require from=\"../../styles/bootstrap.css\"></require>\r\n  <require from=\"devextreme/css/dx.common.css\"></require>\r\n  <require from=\"devextreme/css/dx.light.compact.css\"></require>\r\n  <require from=\"./container.css\"></require>\r\n  \r\n  <require from=\"../sidebar/sidebar\"></require>\r\n  <require from=\"../header/header\"></require>\r\n  <require from=\"../content/content\"></require>\r\n\r\n  <sidebar></sidebar>\r\n  <header></header>\r\n  <content></content>\r\n</template>\r\n"; });
define('text!framework/security/views/authgroup/authgroup-edit-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"t--margin-top col-xs-12 col-md-6\">\n        <div class=\"t--editor-caption\">Bezeichnung</div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"idb89fe9cf87814577bf85abd0ef5cac63Options\"></dx-widget>\n    </div>\n    <div class=\"t--margin-top col-xs-12 col-md-6\">\n        <div class=\"t--editor-caption\">Mandant</div>\n        <dx-widget name=\"dxSelectBox\" options.bind=\"id0d9ea5edd3a447ef8aeade32e0608059Options\"></dx-widget>\n    </div>\n</template>"; });
define('text!framework/default-ui/views/sidebar/sidebar.css', ['module'], function(module) { module.exports = ".t--sidebar {\n  display: block;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  width: 280px;\n  background-color: #2a2e35;\n}\n.t--sidebar ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.t--sidebar-collapsed .t--sidebar {\n  left: -220px;\n}\n.t--sidebar-header {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  background-color: #262930;\n  color: white;\n  cursor: pointer;\n}\n.t--sidebar-header-title {\n  flex-grow: 1;\n  font-size: 26px;\n  font-weight: 100;\n  padding: 12px;\n}\n.t--sidebar-header-icon {\n  display: flex;\n  width: 60px;\n  align-items: center;\n  justify-content: center;\n}\n.t--sidebar-item a {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  color: lightgray;\n  text-decoration: none;\n}\n.t--sidebar-item a:hover {\n  background-color: #17C4BB;\n  color: white;\n}\n.t--sidebar-item-title {\n  flex-grow: 1;\n  padding: 12px;\n}\n.t--sidebar-item-icon {\n  display: flex;\n  width: 60px;\n  align-items: center;\n  justify-content: center;\n}\n"; });
define('text!framework/security/views/authgroup/authgroup-list-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"col-xs-12\">\n        <dx-widget name=\"dxDataGrid\" options.bind=\"ide101d8f6dac54ee9a59accc9834ff055Options\"></dx-widget>\n    </div>\n</template>"; });
define('text!framework/stack-router/views/view/view.html', ['module'], function(module) { module.exports = "<template class=\"t--view\">\r\n  <require from=\"./view.css\"></require>\r\n\r\n  <div class=\"t--view-toolbar\">\r\n    <dx-widget if.bind=\"toolbarOptions\" name=\"dxToolbar\" options.bind=\"toolbarOptions\">\r\n      <dx-template name=\"itemTemplate\">\r\n        <a class=\"t--view-toolbar-item\" click.delegate=\"data.guardedExecute()\">\r\n          <div if.bind=\"data.command.badgeText\" class=\"t--view-toolbar-item-badge\">\r\n            ${data.command.badgeText}\r\n          </div>\r\n          <div>\r\n            <div if.bind=\"data.command.icon\" class=\"t--view-toolbar-item-icon\">\r\n              <i class=\"fa fa-fw fa-${data.command.icon}\"></i>\r\n            </div>\r\n            <div if.bind=\"data.command.title\" class=\"t--view-toolbar-item-title\">\r\n              ${data.command.title}\r\n            </div>\r\n          </div>\r\n        </a>\r\n      </dx-template>\r\n    </dx-widget>\r\n  </div>\r\n  <div class=\"t--view-content\">\r\n    <div class=\"container-fluid\">\r\n      <div class=\"row\">\r\n        <compose\r\n          view-model.ref=\"controller\" \r\n          view-model.bind=\"view.viewModel\" \r\n          model.bind=\"view.model\" \r\n          class=\"t--view-content\"></compose>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!framework/default-ui/views/content/content.css', ['module'], function(module) { module.exports = ".t--content {\n  display: block;\n  margin-left: 280px;\n  height: calc(100% - 60px);\n}\n.t--sidebar-collapsed .t--content {\n  margin-left: 60px;\n}\n.t--view-current {\n  display: block;\n}\n.t--view-history {\n  display: none;\n}\n.t--view-toolbar .dx-toolbar {\n  height: 60px;\n}\n.t--view-toolbar-item {\n  display: flex;\n  height: 60px;\n  padding: 0 12px;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  color: white;\n  text-decoration: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n}\n.t--view-toolbar-item i {\n  font-size: 16px;\n}\n.t--view-toolbar-item:hover {\n  background-color: #4F4F4F;\n}\n.dx-state-disabled .t--view-toolbar-item {\n  cursor: default;\n  color: lightgray;\n}\n.dx-state-disabled .t--view-toolbar-item:hover {\n  background-color: inherit;\n}\n"; });
define('text!framework/security/views/login/login-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"t--margin-top col-xs-12\">\n        <div class=\"t--editor-caption\">Benutzername</div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"idc1b6cc850c26488295131545f145d904Options\"></dx-widget>\n    </div>\n    <div class=\"t--margin-top col-xs-12\">\n        <div class=\"t--editor-caption\">Passwort</div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"idf05d27b222ea43238e235e688ae5b529Options\"></dx-widget>\n    </div>\n    <div class=\"t--margin-top col-xs-12\">\n        <div class=\"t--editor-caption\">&nbsp;</div>\n        <dx-widget name=\"dxCheckBox\" options.bind=\"id57c9ed9065dd45fab243831cdc851812Options\"></dx-widget>\n    </div>\n    <div class=\"t--margin-top col-xs-12\">\n        <div class=\"t--editor-caption\">&nbsp;</div>\n        <dx-widget name=\"dxButton\" options.bind=\"id6c8e49802d3a4559b478a993119ad921Options\"></dx-widget>\n    </div>\n</template>"; });
define('text!framework/stack-router/views/stack-router/stack-router.html', ['module'], function(module) { module.exports = "<template class=\"t--stack-router\">\r\n  <require from=\"./stack-router.css\"></require>\r\n  <require from=\"../view/view\"></require>\r\n\r\n  <div \r\n    class=\"t--stack-router-item\" \r\n    class.bind=\"item.className\"\r\n    repeat.for=\"item of router.viewStack\">\r\n    <view view.bind=\"item\"></view>\r\n  </div>\r\n</template>"; });
define('text!framework/default-ui/views/container/container.css', ['module'], function(module) { module.exports = "body {\n  margin: 0;\n  padding: 0;\n  font-family: \"Helvetica Neue\", \"Segoe UI\", Helvetica, Verdana, sans-serif;\n  font-size: 12px;\n}\n.t--container {\n  display: block;\n  width: 100vw;\n  height: 100vh;\n}\n.t--margin-top {\n  margin-top: 12px;\n}\n.t--editor-caption {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n"; });
define('text!framework/stack-router/views/view/view.css', ['module'], function(module) { module.exports = ".t--view {\n  display: block;\n  position: relative;\n  height: 100%;\n}\n.t--view-toolbar {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  background-color: #808080;\n  color: white;\n}\n.t--view-toolbar .dx-toolbar {\n  background-color: transparent;\n}\n.t--view-toolbar-title {\n  font-size: 26px;\n  font-weight: 100;\n  color: white;\n  padding: 0 12px;\n}\n.t--view-content {\n  height: calc(100% - 60px);\n  overflow-x: hidden;\n  overflow-y: scroll;\n  -webkit-overflow-scrolling: touch;\n}\n"; });
define('text!framework/stack-router/views/stack-router/stack-router.css', ['module'], function(module) { module.exports = ".t--stack-router,\n.t--stack-router-item {\n  display: block;\n  height: 100%;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map