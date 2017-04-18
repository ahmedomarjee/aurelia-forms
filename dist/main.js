webpackJsonp([1],{

/***/ 141:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(486)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, object_info_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            this.anyRegistered = this.delegates.length > 0;
            return function () {
                var indexOf = _this.delegates.indexOf(action);
                if (indexOf < 0) {
                    return;
                }
                _this.delegates.splice(indexOf, 1);
                _this.anyRegistered = _this.delegates.length > 0;
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
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _this = this;
                var argsQueue;
                return tslib_1.__generator(this, function (_a) {
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
    CustomEvent = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.transient(),
        tslib_1.__metadata("design:paramtypes", [object_info_service_1.ObjectInfoService,
            aurelia_framework_1.TaskQueue])
    ], CustomEvent);
    exports.CustomEvent = CustomEvent;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(507), __webpack_require__(141), __webpack_require__(485), __webpack_require__(481)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, aurelia_fetch_client_1, custom_event_1, json_service_1, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RestService = (function () {
        function RestService(json, onUnauthorizated) {
            this.json = json;
            this.onUnauthorizated = onUnauthorizated;
            this.loadingCount = 0;
        }
        Object.defineProperty(RestService.prototype, "isLoading", {
            get: function () {
                return this.loadingCount > 0;
            },
            enumerable: true,
            configurable: true
        });
        RestService.prototype.delete = function (options) {
            if (!options.id) {
                throw new Error("Id is missing");
            }
            return this.execute("DELETE", options.url + "/" + options.id, this.createHeaders(), options.increaseLoadingCount);
        };
        RestService.prototype.get = function (options) {
            return this.execute("GET", options.url, this.createHeaders(options), options.increaseLoadingCount);
        };
        RestService.prototype.post = function (options) {
            return this.execute("POST", options.url, this.createHeaders(options), options.increaseLoadingCount, options.data);
        };
        RestService.prototype.put = function (options) {
            return this.execute("PUT", options.url, this.createHeaders(options), options.increaseLoadingCount, options.data);
        };
        RestService.prototype.getUrl = function (suffix) {
            return config_1.default["baseUrl"] + "/" + suffix;
        };
        RestService.prototype.getApiUrl = function (suffix) {
            return config_1.default["apiUrl"] + "/" + suffix;
        };
        RestService.prototype.getWebApiUrl = function (suffix) {
            return config_1.default["webApiUrl"] + "/" + suffix;
        };
        RestService.prototype.getAppUrl = function (suffix) {
            return config_1.default["appUrl"] + "/" + suffix;
        };
        RestService.prototype.createHeaders = function (options) {
            var headers = {};
            if (options && options.getOptions) {
                headers["X-GET-OPTIONS"] = this.json.stringify(options.getOptions);
            }
            headers["Content-Type"] = "application/json";
            headers["Accept"] = "application/json";
            if (this.getAuthHeader) {
                Object.assign(headers, this.getAuthHeader());
            }
            return headers;
        };
        RestService.prototype.execute = function (method, url, headers, changeLoadingCount, body) {
            var _this = this;
            var client = new aurelia_fetch_client_1.HttpClient();
            if (body) {
                if (typeof body !== "string" && !(body instanceof FormData)) {
                    body = this.json.stringify(body);
                }
                if (body instanceof FormData) {
                    delete headers["Accept"];
                    delete headers["Content-Type"];
                }
            }
            if (changeLoadingCount) {
                this.loadingCount++;
            }
            return new Promise(function (success, error) {
                client
                    .fetch(url, {
                    method: method,
                    headers: headers,
                    body: body
                })
                    .then(function (r) {
                    if (r.ok) {
                        return r.text();
                    }
                    if (r.status == 401) {
                        _this.onUnauthorizated.fire({
                            url: url
                        });
                        return;
                    }
                    DevExpress.ui.notify(r.statusText, "error", 3000);
                    error(r);
                })
                    .then(function (r) { return _this.json.parse(r); })
                    .then(function (r) { return success(r); })
                    .catch(function (r) {
                    error(r);
                })
                    .then(function () {
                    if (changeLoadingCount) {
                        _this.loadingCount--;
                    }
                });
            });
        };
        return RestService;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom("loadingCount"),
        tslib_1.__metadata("design:type", Boolean),
        tslib_1.__metadata("design:paramtypes", [])
    ], RestService.prototype, "isLoading", null);
    RestService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [json_service_1.JsonService,
            custom_event_1.CustomEvent])
    ], RestService);
    exports.RestService = RestService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(502), __webpack_require__(483), __webpack_require__(53), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, view_item_1, export_1, export_2, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RouterService = (function () {
        function RouterService(localization, shortcut) {
            this.localization = localization;
            this.shortcut = shortcut;
            this.routes = [];
            this.routeInfoId = 0;
            this.viewStack = [];
            this.registerShortcuts();
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
            else if (this.viewStack.length > 0 && navigationArgs.replace) {
                this.viewStack.splice(this.viewStack.length - 1, 1);
            }
            this.addViewItem(new view_item_1.ViewItem(routeInfo));
        };
        RouterService.prototype.registerRoutes = function (routes, fallbackRoute) {
            routes = routes || [];
            this.routes = this.validateRoutes(routes);
            this.fallbackRoute = fallbackRoute;
            this.navigationRoutes = this.getNavigationRoutes(routes);
        };
        RouterService.prototype.reset = function () {
            this.viewStack.splice(0, this.viewStack.length);
            this.navigationRoutes = [];
        };
        RouterService.prototype.removeViewModel = function (viewModel) {
            var view = this.viewStack.find(function (i) { return i.controller["currentViewModel"] == viewModel; });
            if (!view) {
                return;
            }
            this.viewStack.splice(this.viewStack.indexOf(view), 1);
        };
        RouterService.prototype.addViewItem = function (viewItem) {
            this.viewStack.push(viewItem);
            this.setCurrentViewItem();
        };
        RouterService.prototype.removeLastViewItem = function () {
            this.viewStack.pop();
            this.setCurrentViewItem();
            if (this.currentViewItem) {
                var currentViewModel = this.currentViewItem.controller["currentViewModel"];
                if (currentViewModel && typeof currentViewModel.reactivate === "function") {
                    currentViewModel.reactivate();
                }
            }
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
                    var childRoute = getRoute(route.children);
                    if (childRoute) {
                        return childRoute;
                    }
                }
            };
            var fallbackRoute = getRoute(this.routes);
            if (!fallbackRoute) {
                throw new Error("Fallback route not found");
            }
            return fallbackRoute;
        };
        RouterService.prototype.getNavigationRoutes = function (routes) {
            var result = [];
            for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
                var route = routes_2[_i];
                if (!route.navigation) {
                    continue;
                }
                if (!route.canActivate()) {
                    continue;
                }
                var navigationRoute = {
                    caption: route.caption,
                    route: route.route[0],
                    navigation: route.navigation,
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
            var _this = this;
            var indexQuestionMark = url.indexOf("?");
            if (indexQuestionMark >= 0) {
                url = url.substr(0, indexQuestionMark);
            }
            var searchRouteInfo = function (routes) {
                for (var _i = 0, routes_3 = routes; _i < routes_3.length; _i++) {
                    var route = routes_3[_i];
                    var routeInfo_1 = _this.isRoute(route, url)
                        || searchRouteInfo(route.children);
                    if (routeInfo_1 == void (0)) {
                        continue;
                    }
                    return routeInfo_1;
                }
                return null;
            };
            var routeInfo = searchRouteInfo(this.routes);
            if (routeInfo != void (0)) {
                return routeInfo;
            }
            return {
                id: this.routeInfoId++,
                route: this.getFallbackRoute(),
                parameters: {},
                isFallback: true
            };
        };
        RouterService.prototype.isRoute = function (route, url) {
            if (route.route == void (0)) {
                return null;
            }
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
            if (!route) {
                return null;
            }
            var routeParts = route.split("/");
            var urlParts = url.split("/");
            var parameters = {};
            if (routeParts.length !== urlParts.length) {
                return null;
            }
            for (var i = 0; i < urlParts.length; i++) {
                if (routeParts[i].startsWith(":")) {
                    var routePart = routeParts[i];
                    var indexOfBracket = routePart.indexOf("{");
                    var lastIndexOfBrack = routePart.lastIndexOf("}");
                    if (indexOfBracket >= 0 && lastIndexOfBrack >= 0) {
                        var r = routePart.substring(indexOfBracket + 1, lastIndexOfBrack);
                        routePart = routePart.substr(0, indexOfBracket);
                        if (!new RegExp("^" + r + "$").test(urlParts[i])) {
                            return null;
                        }
                    }
                    parameters[routePart.substr(1)] = urlParts[i];
                }
                else if (urlParts[i] !== routeParts[i]) {
                    return null;
                }
            }
            return parameters;
        };
        RouterService.prototype.validateRoutes = function (routes) {
            for (var _i = 0, routes_4 = routes; _i < routes_4.length; _i++) {
                var route = routes_4[_i];
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
                this.validateRoutes(route.children);
            }
            return routes;
        };
        RouterService.prototype.registerShortcuts = function () {
            var _this = this;
            this.shortcut.onShortcutExecute.register(function (e) {
                if (!_this.currentViewItem) {
                    return Promise.resolve();
                }
                var currentViewModel = _this.currentViewItem.controller["currentViewModel"];
                if (!currentViewModel.executeCommand) {
                    return;
                }
                switch (e.shortcut) {
                    case export_1.Shortcuts.save: {
                        currentViewModel.executeCommand("$save");
                        break;
                    }
                    case export_1.Shortcuts.saveAndNew: {
                        currentViewModel.executeCommand("$saveAndNew");
                        break;
                    }
                    case export_1.Shortcuts.new: {
                        currentViewModel.executeCommand("$new");
                        break;
                    }
                    case export_1.Shortcuts.delete: {
                        currentViewModel.executeCommand("$delete");
                        break;
                    }
                    default: {
                        break;
                    }
                }
                return Promise.resolve();
            });
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
                $("html title").html(this.localization.translate(null, this.currentViewItem.title));
            }
        };
        return RouterService;
    }());
    RouterService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_2.LocalizationService,
            export_2.ShortcutService])
    ], RouterService);
    exports.RouterService = RouterService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(487)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, style_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LayoutService = (function () {
        function LayoutService(style) {
            this.style = style;
            this.isSidebarCollapsed = false;
            this.themeColor = "#396394";
        }
        LayoutService.prototype.activateTheme = function () {
            this.style.addStyles("custom-container", [{
                    name: ".t--sidebar .t--sidebar-item:hover",
                    properties: [{
                            propertyName: "background-color",
                            value: this.themeColor
                        }]
                }, {
                    name: ".t--toolbar.t--toolbar-inline.dx-toolbar",
                    properties: [{
                            propertyName: "border-left",
                            value: "5px solid " + this.themeColor
                        }]
                }, {
                    name: ".t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-title",
                    properties: [{
                            propertyName: "color",
                            value: this.themeColor
                        }]
                }]);
        };
        return LayoutService;
    }());
    LayoutService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [style_service_1.StyleService])
    ], LayoutService);
    exports.LayoutService = LayoutService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DxTemplateService = (function () {
        function DxTemplateService(templatingEngine) {
            this.templatingEngine = templatingEngine;
            this.templates = {};
        }
        DxTemplateService.prototype.registerTemplate = function (key, template) {
            this.templates[key] = template;
        };
        DxTemplateService.prototype.getTemplates = function (scope, resources) {
            var _this = this;
            var result = {};
            var _loop_1 = function (templateKey) {
                result[templateKey] = {
                    render: function (renderData) {
                        return _this.render(_this.templates[templateKey], renderData.container, resources, scope, renderData.model);
                    }
                };
            };
            for (var templateKey in this.templates) {
                _loop_1(templateKey);
            }
            return result;
        };
        DxTemplateService.prototype.render = function (template, container, resources, scope, model) {
            var newItem;
            if (typeof template === "string") {
                newItem = document.createElement("div");
                newItem.innerHTML = template;
            }
            else {
                newItem = template.cloneNode(true);
            }
            var newElement = $(newItem).appendTo(container);
            var itemBindingContext;
            var itemOverrideContext;
            if (model) {
                itemBindingContext = {
                    data: model
                };
                itemOverrideContext = aurelia_framework_1.createOverrideContext(scope.bindingContext, scope.overrideContext);
            }
            else {
                itemBindingContext = scope.bindingContext;
                itemOverrideContext = scope.overrideContext;
            }
            var result = this.templatingEngine.enhance({
                element: newElement.get(0),
                bindingContext: itemBindingContext,
                overrideContext: itemOverrideContext,
                resources: resources
            });
            result.attached();
            return $(newElement);
        };
        return DxTemplateService;
    }());
    DxTemplateService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [aurelia_framework_1.TemplatingEngine])
    ], DxTemplateService);
    exports.DxTemplateService = DxTemplateService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 185:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(851), __webpack_require__(503)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, export_1, export_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(export_1);
    __export(export_2);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(141), __webpack_require__(482)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, custom_event_1, scope_container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomEvent = custom_event_1.CustomEvent;
    exports.ScopeContainer = scope_container_1.ScopeContainer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 232:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(142), __webpack_require__(481)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, rest_service_1, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthorizationService = (function () {
        function AuthorizationService(rest, aurelia, bindingEngine) {
            var _this = this;
            this.rest = rest;
            this.aurelia = aurelia;
            this.bindingEngine = bindingEngine;
            this.X_TIP_AUTH = "X-TIP-AUTH";
            this.isLoggedIn = null;
            this.bindingEngine
                .expressionObserver(this, "isLoggedIn")
                .subscribe(function (newValue, oldValue) {
                var app = "/";
                if (newValue && config_1.default["mainApp"]) {
                    app = config_1.default["mainApp"];
                }
                else if (!newValue && config_1.default["loginApp"]) {
                    app = config_1.default["loginApp"];
                }
                aurelia.setRoot(app);
            });
            this.rest.getAuthHeader = this.getAuthorizationHeaders.bind(this);
            this.rest.onUnauthorizated.register(function () {
                _this.isLoggedIn = false;
                return Promise.resolve();
            });
        }
        AuthorizationService.prototype.getAuthorizationKey = function () {
            return localStorage.getItem(this.X_TIP_AUTH);
        };
        AuthorizationService.prototype.openApp = function () {
            var _this = this;
            if (this.isLoggedIn) {
                return;
            }
            if (!localStorage.getItem(this.X_TIP_AUTH)) {
                this.isLoggedIn = false;
                return;
            }
            this.rest.get({
                url: this.rest.getApiUrl("base/Authorization/IsLoggedIn"),
                increaseLoadingCount: true
            }).then(function (r) {
                _this.isLoggedIn = r.IsValid;
            });
        };
        AuthorizationService.prototype.login = function (data) {
            var _this = this;
            return this.rest.post({
                url: this.rest.getApiUrl("base/Authorization/Login"),
                data: data,
                increaseLoadingCount: true
            }).then(function (r) {
                if (r.IsValid) {
                    _this.isLoggedIn = true;
                    localStorage.setItem(_this.X_TIP_AUTH, r.AuthenticationToken);
                    return true;
                }
                DevExpress.ui.notify("Benutzer oder Passwort ungültig", "error", 3000);
                return false;
            });
        };
        AuthorizationService.prototype.logout = function () {
            var _this = this;
            return this.rest.get({
                url: this.rest.getApiUrl("base/Authorization/Logout"),
                increaseLoadingCount: true
            }).then(function () {
                _this.isLoggedIn = false;
                localStorage.removeItem(_this.X_TIP_AUTH);
            });
        };
        AuthorizationService.prototype.getAuthorizationHeaders = function () {
            var headers = {};
            var auth = this.getAuthorizationKey();
            if (auth) {
                headers[this.X_TIP_AUTH] = auth;
            }
            return headers;
        };
        return AuthorizationService;
    }());
    AuthorizationService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [rest_service_1.RestService,
            aurelia_framework_1.Aurelia,
            aurelia_framework_1.BindingEngine])
    ], AuthorizationService);
    exports.AuthorizationService = AuthorizationService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 233:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BindingService = (function () {
        function BindingService(bindingEngine) {
            this.bindingEngine = bindingEngine;
        }
        BindingService.prototype.assign = function (scope, expression, value) {
            this.bindingEngine
                .parseExpression(expression)
                .assign(scope, value, null);
        };
        BindingService.prototype.evaluate = function (scope, expression) {
            return this.bindingEngine
                .parseExpression(expression)
                .evaluate(scope);
        };
        BindingService.prototype.observe = function (scopeContainer, expression, callback) {
            var disposable = this.bindingEngine
                .expressionObserver(this.getBindingContext(scopeContainer.scope, expression), expression).subscribe(callback);
            scopeContainer.addDisposable(disposable);
            return disposable;
        };
        BindingService.prototype.getBindingContext = function (scope, expression) {
            var obj = this.bindingEngine
                .parseExpression(expression);
            while (obj.object) {
                obj = obj.object;
            }
            if (obj.name in scope.bindingContext) {
                return scope.bindingContext;
            }
            else {
                var ov = scope.overrideContext;
                while (ov) {
                    if (obj.name in ov.bindingContext) {
                        return ov.bindingContext;
                    }
                    ov = ov.parentOverrideContext;
                }
            }
            return scope.bindingContext || scope.overrideContext;
        };
        return BindingService;
    }());
    BindingService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [aurelia_framework_1.BindingEngine])
    ], BindingService);
    exports.BindingService = BindingService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 234:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(142), __webpack_require__(233), __webpack_require__(778)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, rest_service_1, binding_service_1, localizationNeutral) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LocalizationService = (function () {
        function LocalizationService(rest, binding) {
            this.rest = rest;
            this.binding = binding;
        }
        LocalizationService.prototype.translate = function (scopeContainer, key, callback) {
            var _this = this;
            if (!key) {
                return null;
            }
            var item = this.getItem(key);
            if (!item) {
                throw new Error("No localization found for " + key);
            }
            if (callback) {
                if (!Array.isArray(scopeContainer) && typeof item === "object" && item.parameters.length > 0) {
                    item.parameters.forEach(function (expr, index) {
                        _this.binding
                            .observe(scopeContainer, expr, function () {
                            callback(_this.translateItem(scopeContainer, item));
                        });
                    });
                }
                var result = this.translateItem(scopeContainer, item);
                callback(result);
                return result;
            }
            else {
                return this.translateItem(scopeContainer, item);
            }
        };
        LocalizationService.prototype.getItem = function (key) {
            var items = key.split(".");
            var item = localizationNeutral;
            items.forEach(function (i) {
                if (!item) {
                    return;
                }
                item = item[i];
            });
            return item;
        };
        LocalizationService.prototype.translateItem = function (scopeContainer, item) {
            var _this = this;
            if (typeof item === "string") {
                if (Array.isArray(scopeContainer)) {
                    scopeContainer.forEach(function (val, index) {
                        item = item.replace(new RegExp("\\{" + index + "\\}", "g"), val);
                    });
                }
                return item;
            }
            else if (!Array.isArray(scopeContainer) && typeof item === "object") {
                var text_1 = item.text;
                item.parameters.forEach(function (expr, index) {
                    var val = _this.binding.evaluate(scopeContainer.scope, expr);
                    if (val == void (0)) {
                        val = "";
                    }
                    text_1 = text_1.replace(new RegExp("\\{" + index + "\\}", "g"), val);
                });
                return text_1;
            }
            throw new Error();
        };
        return LocalizationService;
    }());
    LocalizationService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [rest_service_1.RestService,
            binding_service_1.BindingService])
    ], LocalizationService);
    exports.LocalizationService = LocalizationService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 235:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(183), __webpack_require__(837), __webpack_require__(488)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, layout_service_1, header_service_1, loading_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LayoutService = layout_service_1.LayoutService;
    exports.HeaderService = header_service_1.HeaderService;
    exports.LoadingService = loading_service_1.LoadingService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 236:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework"), __webpack_require__(493), __webpack_require__(841)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1, form_base_1, form_base_import_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autoinject = aurelia_framework_1.autoinject;
    exports.FormBase = form_base_1.FormBase;
    exports.FormBaseImport = form_base_import_1.FormBaseImport;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(53)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CommandService = (function () {
        function CommandService(binding) {
            this.binding = binding;
            this.isCommandExecuting = false;
        }
        CommandService.prototype.isVisible = function (scope, command) {
            if (command.isVisible != undefined) {
                return command.isVisible;
            }
            else if (command.isVisibleExpression) {
                return this.binding.evaluate(scope, command.isVisibleExpression);
            }
            return true;
        };
        CommandService.prototype.isEnabled = function (scope, command) {
            if (command.isEnabled != undefined) {
                return command.isEnabled;
            }
            else if (command.isEnabledExpression) {
                return this.binding.evaluate(scope, command.isEnabledExpression);
            }
            return true;
        };
        CommandService.prototype.isVisibleAndEnabled = function (scope, command) {
            return this.isVisible(scope, command)
                && this.isEnabled(scope, command);
        };
        CommandService.prototype.execute = function (scope, command) {
            var _this = this;
            if (this.isCommandExecuting) {
                return;
            }
            if (!this.isVisibleAndEnabled(scope, command)) {
                return false;
            }
            if (!command.execute) {
                return false;
            }
            this.isCommandExecuting = true;
            var result = command.execute.bind(scope.bindingContext)();
            if (result && result.then && result.catch) {
                result
                    .catch(function () {
                })
                    .then(function () {
                    _this.isCommandExecuting = false;
                });
            }
            else {
                this.isCommandExecuting = false;
            }
            return true;
        };
        return CommandService;
    }());
    CommandService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.BindingService])
    ], CommandService);
    exports.CommandService = CommandService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(237), __webpack_require__(499), __webpack_require__(239), __webpack_require__(846), __webpack_require__(845)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, command_service_1, default_commands_service_1, toolbar_service_1, validation_service_1, select_item_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandService = command_service_1.CommandService;
    exports.DefaultCommandsService = default_commands_service_1.DefaultCommandsService;
    exports.ToolbarService = toolbar_service_1.ToolbarService;
    exports.ValidationService = validation_service_1.ValidationService;
    exports.SelectItemService = select_item_service_1.SelectItemService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 239:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(53), __webpack_require__(231), __webpack_require__(237), __webpack_require__(184), __webpack_require__(774)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, command_service_1, dx_template_service_1, toolbarButtonTemplate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ToolbarService = (function () {
        function ToolbarService(command, localization, binding, dxTemplate) {
            this.command = command;
            this.localization = localization;
            this.binding = binding;
            this.dxTemplate = dxTemplate;
            this.titleItemTemplate = "TITEL_ITEM_TEMPLATE";
        }
        ToolbarService.prototype.createFormToolbarOptions = function (form) {
            var _this = this;
            var component;
            var options = this.createToolbarOptions(form.scopeContainer, form.title, form.commands.getCommands(), function (c) {
                component = c;
            });
            this.binding.observe(form.scopeContainer, "title", function (newValue) {
                var title = _this.createTitleHtml(newValue);
                var titleItem = options.items.find(function (item) { return item[_this.titleItemTemplate] === _this.titleItemTemplate; });
                if (titleItem) {
                    var indexOfTitleItem = options.items.indexOf(titleItem);
                    if (component) {
                        component.option("items[" + indexOfTitleItem + "].html", title);
                    }
                    titleItem.html = title;
                }
            });
            return options;
        };
        ToolbarService.prototype.createToolbarOptions = function (scopeContainer, title, commands, componentCreatedCallback) {
            var component;
            var options = {
                onInitialized: function (e) {
                    component = e.component;
                    if (componentCreatedCallback) {
                        componentCreatedCallback(component);
                    }
                }
            };
            options.items = this.createToolbarItems(scopeContainer, {
                getItems: function () {
                    if (!component) {
                        return options.items;
                    }
                    return component.option("items");
                },
                setItemProperty: function (index, property, value) {
                    if (!component) {
                        return;
                    }
                    component.option("items[" + index + "]." + property, value);
                }
            }, title, commands);
            return options;
        };
        ToolbarService.prototype.createToolbarItems = function (scopeContainer, toolbarManager, title, commands) {
            var _this = this;
            var items = commands
                .sort(function (a, b) {
                var s1 = a.sort == void (0) ? 500 : a.sort;
                var s2 = b.sort == void (0) ? 500 : b.sort;
                if (s1 < s2) {
                    return -1;
                }
                else if (s1 > s2) {
                    return 1;
                }
                else {
                    return 0;
                }
            })
                .map(function (i) { return _this.createToolbarItem(scopeContainer, toolbarManager, i); });
            var titleItem = {
                html: this.createTitleHtml(title),
                location: "before"
            };
            titleItem[this.titleItemTemplate] = this.titleItemTemplate;
            items.splice(0, 0, titleItem);
            return items;
        };
        ToolbarService.prototype.createToolbarItem = function (scopeContainer, toolbarManager, command) {
            var _this = this;
            var item = {};
            this.setEnabled(scopeContainer, toolbarManager, command, item);
            this.setVisible(scopeContainer, toolbarManager, command, item);
            item.template = function (model, dummy, container) {
                return _this.dxTemplate.render(toolbarButtonTemplate, container, null, scopeContainer.scope, model);
            };
            item.location = command.location || "before";
            item.locateInMenu = command.locateInMenu;
            item.command = command;
            item.guardedExecute = function () {
                _this.command.execute(scopeContainer.scope, command);
            };
            return item;
        };
        ToolbarService.prototype.createTitleHtml = function (title) {
            if (!title) {
                return null;
            }
            return "<div class=\"t--toolbar-title\">" + this.localization.translate(null, title) + "</div>";
        };
        ToolbarService.prototype.setEnabled = function (scopeContainer, toolbarManager, command, item) {
            var _this = this;
            var setEnabled = function (val) {
                _this.setItemOption(toolbarManager, item, "disabled", !val);
                item.disabled = !val;
                command.isEnabled = val;
            };
            item.disabled = !this.command.isEnabled(scopeContainer.scope, command);
            if (command.isEnabled != undefined) {
                var newScopeContainer = new export_2.ScopeContainer({
                    bindingContext: command,
                    overrideContext: null
                }, scopeContainer);
                this.binding.observe(newScopeContainer, "isEnabled", function (newValue) {
                    setEnabled(newValue);
                });
            }
            else if (command.isEnabledExpression) {
                this.binding.observe(scopeContainer, command.isEnabledExpression, function (newValue) {
                    setEnabled(newValue);
                });
            }
        };
        ToolbarService.prototype.setVisible = function (scopeContainer, toolbarManager, command, item) {
            var _this = this;
            var setVisible = function (val) {
                _this.setItemOption(toolbarManager, item, "visible", val);
                item.visible = val;
                command.isVisible = val;
            };
            item.visible = this.command.isVisible(scopeContainer.scope, command);
            if (command.isVisible != undefined) {
                var newScopeContainer = new export_2.ScopeContainer({
                    bindingContext: command,
                    overrideContext: null
                }, scopeContainer);
                this.binding.observe(newScopeContainer, "isVisible", function (newValue) {
                    setVisible(newValue);
                });
            }
            else if (command.isVisibleExpression) {
                this.binding.observe(scopeContainer, command.isVisibleExpression, function (newValue) {
                    setVisible(newValue);
                });
            }
        };
        ToolbarService.prototype.setItemOption = function (toolbarManager, item, property, value) {
            var items = toolbarManager.getItems();
            var index = items.indexOf(item);
            if (index < 0) {
                return;
            }
            toolbarManager.setItemProperty(index, property, value);
        };
        return ToolbarService;
    }());
    ToolbarService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [command_service_1.CommandService,
            export_1.LocalizationService,
            export_1.BindingService,
            dx_template_service_1.DxTemplateService])
    ], ToolbarService);
    exports.ToolbarService = ToolbarService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 240:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(53), __webpack_require__(238)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseWidgetCreatorService = (function () {
        function BaseWidgetCreatorService(dataSource, location, toolbar, defaultCommands) {
            this.dataSource = dataSource;
            this.location = location;
            this.toolbar = toolbar;
            this.defaultCommands = defaultCommands;
        }
        BaseWidgetCreatorService.prototype.checkListRelationEdit = function (form, options) {
            if (!options.idEditPopup || !options.isRelation) {
                return;
            }
            form.editPopups.onEditPopupModelLoaded.register(function (e) {
                if (e.editPopup.id != options.idEditPopup) {
                    return;
                }
                if (e.model.key !== "variables.data.$id") {
                    return;
                }
                if (!e.data) {
                    return;
                }
                if (e.data[e.model.keyProperty]) {
                    return;
                }
                var info = form.models.getInfo(options.dataModel);
                e.data[options.relationBinding.bindTo] = form.models.data[info.id][info.keyProperty];
                return Promise.resolve();
            });
        };
        BaseWidgetCreatorService.prototype.checkListToolbar = function (form, options) {
            if (!options.createToolbar && !options.isMainList) {
                return;
            }
            var commands = this.defaultCommands.getListCommands(form, options);
            if (options.createToolbar) {
                form[options.optionsToolbar.optionsName] = this.toolbar.createToolbarOptions(form.scopeContainer, options.caption, commands);
            }
            else if (options.isMainList) {
                commands.forEach(function (c) { return form.commands.addCommand(c); });
            }
        };
        BaseWidgetCreatorService.prototype.createListDataSource = function (form, options) {
            if (options.dataModel) {
                var model_1 = form.models.getInfo(options.dataModel);
                var relationModel = options.isRelation
                    ? form.models.getInfo(options.relationBinding.dataContext)
                    : null;
                var customizationOptions = {};
                if (options.isRelation) {
                    customizationOptions.getCustomWhere = function () {
                        var data = form.models.data && form.models.data[model_1.id]
                            ? form.models.data[model_1.id][model_1.keyProperty]
                            : "0";
                        data = data || "0";
                        return [options.relationBinding.bindTo, data];
                    };
                    customizationOptions.canLoad = function () {
                        return !!(form.models.data && form.models.data[model_1.id] && form.models.data[model_1.id][model_1.keyProperty]);
                    };
                    form.binding.observe(form.scopeContainer, "models.data." + model_1.id + "." + model_1.keyProperty, function () {
                        dataSource_1.reload();
                    });
                }
                var dataSource_1 = this.dataSource.createDataSource(form.scopeContainer, relationModel || model_1, customizationOptions);
                return dataSource_1;
            }
        };
        BaseWidgetCreatorService.prototype.getListClickActions = function (form, options) {
            var _this = this;
            var clickActions = [];
            if (options.onItemClick) {
                clickActions.push(function (e) {
                    form.binding.evaluate({
                        bindingContext: e,
                        overrideContext: null
                    }, options.onItemClick);
                });
            }
            if (options.editDataContext || options.edits.length > 0) {
                if (options.edits.length > 0) {
                    clickActions.push(function (e) {
                        var edit = options.edits.find(function (c) { return c.typeName === e.data.ObjectTypeName; });
                        if (!edit) {
                            return;
                        }
                        form.models.data[edit.editDataContext] = e.data;
                    });
                }
                else {
                    clickActions.push(function (e) {
                        form.models.data[options.editDataContext] = e.data;
                    });
                }
            }
            if ((options.editUrl || options.edits.length > 0) && options.dataModel) {
                var model_2 = form.models.getInfo(options.dataModel);
                if (model_2) {
                    if (options.edits.length > 0) {
                        clickActions.push(function (e) {
                            var edit = options.edits.find(function (c) { return c.typeName === e.data.ObjectTypeName; });
                            if (!edit) {
                                return;
                            }
                            _this.location.goTo("#" + edit.editUrl + "/" + e.data[model_2.keyProperty], form);
                        });
                    }
                    else {
                        clickActions.push(function (e) {
                            _this.location.goTo("#" + options.editUrl + "/" + e.data[model_2.keyProperty], form);
                        });
                    }
                }
            }
            if (options.idEditPopup || options.edits.length > 0) {
                form.editPopups.onEditPopupHidden.register(function (a) {
                    if (a.editPopup.id === options.idEditPopup || options.edits.some(function (c) { return c.idEditPopup === a.editPopup.id; })) {
                        var dataGrid = form[options.id];
                        if (!dataGrid) {
                            return;
                        }
                        dataGrid.instance.refresh();
                    }
                    ;
                    return Promise.resolve();
                });
                if (options.edits.length > 0) {
                    clickActions.push(function (e) {
                        var edit = options.edits.find(function (c) { return c.typeName === e.data.ObjectTypeName; });
                        if (!edit) {
                            return;
                        }
                        form.editPopups.show(edit.idEditPopup);
                    });
                }
                else {
                    clickActions.push(function (e) {
                        form.editPopups.show(options.idEditPopup);
                    });
                }
            }
            return clickActions;
        };
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
    BaseWidgetCreatorService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.DataSourceService,
            export_1.LocationService,
            export_2.ToolbarService,
            export_2.DefaultCommandsService])
    ], BaseWidgetCreatorService);
    exports.BaseWidgetCreatorService = BaseWidgetCreatorService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 241:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__("aurelia-event-aggregator"), __webpack_require__(53), __webpack_require__(143)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, aurelia_event_aggregator_1, export_1, router_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HistoryService = (function () {
        function HistoryService(eventAggregator, taskQueue, router, location) {
            this.eventAggregator = eventAggregator;
            this.taskQueue = taskQueue;
            this.router = router;
            this.location = location;
            this.isActive = false;
            this.register();
        }
        HistoryService.prototype.getUrl = function (url) {
            var hash = url || location.hash;
            if (!hash) {
                return "";
            }
            if (hash.substr(0, 1) === "#") {
                return hash.substr(1);
            }
            else {
                return hash;
            }
        };
        HistoryService.prototype.navigateCurrentOrInPipeline = function () {
            var _this = this;
            if (this.pipelineUrl) {
                this.navigateByCode(this.pipelineUrl, true);
                this.pipelineUrl = null;
            }
            else {
                this.guardedNavigate(function () {
                    _this.navigate({
                        url: _this.getUrl()
                    });
                });
            }
        };
        HistoryService.prototype.navigateByCode = function (url, clearStack) {
            var _this = this;
            this.guardedNavigate(function () {
                _this.assignUrl(url, false);
                _this.navigate({
                    url: _this.getUrl(url),
                    clearStack: clearStack
                });
            });
        };
        HistoryService.prototype.navigateByLocation = function (locationGoTo) {
            var replace = false;
            if (this.router.viewStack.length > 1
                && this.router.viewStack[this.router.viewStack.length - 2].controller["currentViewModel"] === locationGoTo.currentViewModel) {
                replace = true;
            }
            var args = {
                url: this.getUrl(locationGoTo.url),
                replace: replace
            };
            if (!(args.routeInfo && args.routeInfo.isFallback)) {
                this.assignUrl(args.url, args.replace);
            }
            this.navigate(args);
            locationGoTo.isHandled = true;
        };
        HistoryService.prototype.setUrlWithoutNavigation = function (url) {
            var _this = this;
            this.guardedNavigate(function () {
                _this.assignUrl(url, false);
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
            this.location.onLocationGoTo.register(function (a) {
                _this.guardedNavigate(function () {
                    _this.navigateByLocation(a);
                });
                return Promise.resolve();
            });
        };
        HistoryService.prototype.navigate = function (navigationArgs) {
            this.lastRequestUrl = navigationArgs.url;
            this.router.navigate(navigationArgs);
            if (navigationArgs.routeInfo && navigationArgs.routeInfo.isFallback) {
                this.assignUrl(navigationArgs.routeInfo.route.route[0], navigationArgs.replace);
            }
            if (!navigationArgs.historyState && navigationArgs.routeInfo) {
                history.replaceState({
                    id: navigationArgs.routeInfo.id,
                    url: navigationArgs.url
                }, navigationArgs.routeInfo.route.caption);
            }
        };
        HistoryService.prototype.assignUrl = function (url, replace) {
            if (!url) {
                throw new Error("No Url defined");
            }
            if (url.substr(0, 1) !== "#") {
                url = "#" + url;
            }
            if (replace) {
                location.replace(url);
            }
            else {
                location.assign(url);
            }
        };
        return HistoryService;
    }());
    HistoryService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator,
            aurelia_framework_1.TaskQueue,
            router_service_1.RouterService,
            export_1.LocationService])
    ], HistoryService);
    exports.HistoryService = HistoryService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 481:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        baseUrl: "http://10.20.50.53/TIP.ERP",
        apiUrl: "http://10.20.50.53/TIP.ERP/api",
        webApiUrl: "http://10.20.50.53/TIP.ERP/api/data",
        appUrl: "http://localhost:9000",
        loginApp: 'framework/login/login',
        mainApp: 'app'
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 482:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScopeContainer = (function () {
        function ScopeContainer(scope, parentScopeContainer) {
            this.scope = scope;
            this.parentScopeContainer = parentScopeContainer;
            if (parentScopeContainer) {
                this._disposables = parentScopeContainer._disposables;
            }
            else {
                this._disposables = [];
            }
        }
        ScopeContainer.prototype.addDisposable = function (disposable) {
            this._disposables.push(disposable);
        };
        ScopeContainer.prototype.disposeAll = function () {
            if (this.parentScopeContainer) {
                this._disposables = [];
            }
            else {
                this._disposables.forEach(function (c) {
                    c.dispose();
                });
                this._disposables.length = 0;
            }
        };
        return ScopeContainer;
    }());
    exports.ScopeContainer = ScopeContainer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 483:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(827)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, shortcuts_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(shortcuts_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 484:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(142), __webpack_require__(233)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, rest_service_1, binding_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataSourceService = (function () {
        function DataSourceService(rest, binding) {
            this.rest = rest;
            this.binding = binding;
        }
        DataSourceService.prototype.createDataSource = function (scopeContainer, options, customizationOptions, loadRequiredAction) {
            var _this = this;
            var dataSource = new DevExpress.data.DataSource(new DevExpress.data.CustomStore({
                key: options.keyProperty,
                byKey: function (key) {
                    if (!_this.canLoad(customizationOptions)) {
                        return Promise.resolve(null);
                    }
                    var getOptions = _this.createGetOptions(scopeContainer, options, customizationOptions);
                    return _this.rest.get({
                        url: _this.rest.getWebApiUrl(options.webApiAction + "/" + key),
                        getOptions: getOptions
                    });
                },
                load: function (loadOptions) {
                    var getOptions = _this.createGetOptions(scopeContainer, options, customizationOptions);
                    if (getOptions == null || !_this.canLoad(customizationOptions)) {
                        if (loadOptions.requireTotalCount) {
                            return Promise.resolve({
                                data: [],
                                totalCount: 0
                            });
                        }
                        else {
                            return Promise.resolve([]);
                        }
                    }
                    if (loadOptions.filter) {
                        if (getOptions.where) {
                            getOptions.where = [getOptions.where, loadOptions.filter];
                        }
                        else {
                            getOptions.where = loadOptions.filter;
                        }
                    }
                    getOptions.skip = loadOptions.skip;
                    getOptions.take = loadOptions.take;
                    getOptions.requireTotalCount = loadOptions.requireTotalCount;
                    if (loadOptions.sort) {
                        getOptions.orderBy = loadOptions.sort.map(function (data) {
                            return {
                                columnName: data.selector,
                                sortOrder: (data.desc === true ? 1 : 0)
                            };
                        });
                    }
                    return _this.rest.get({
                        url: _this.rest.getWebApiUrl(options.webApiAction),
                        getOptions: getOptions
                    }).then(function (r) {
                        var result;
                        if (loadOptions.requireTotalCount) {
                            result = {
                                data: r.rows,
                                totalCount: r.count
                            };
                        }
                        else {
                            result = r;
                        }
                        if (customizationOptions && customizationOptions.resultInterceptor) {
                            result = customizationOptions.resultInterceptor(result);
                        }
                        return result;
                    });
                }
            }));
            var timeout = null;
            this.addObservers(scopeContainer, options, function () {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                timeout = setTimeout(function () {
                    if (dataSource.pageIndex() === 0) {
                        dataSource.reload();
                    }
                    else {
                        dataSource.pageIndex(0);
                    }
                    if (loadRequiredAction) {
                        loadRequiredAction();
                    }
                }, 10);
            });
            return dataSource;
        };
        DataSourceService.prototype.createGetOptions = function (scopeContainer, options, customizationOptions) {
            var getOptions = {};
            getOptions.columns = options.webApiColumns;
            getOptions.expand = options.webApiExpand;
            getOptions.orderBy = options.webApiOrderBy;
            if (options.webApiWhere || (customizationOptions && customizationOptions.getCustomWhere)) {
                var where = [];
                var input = [];
                if (options.webApiWhere) {
                    input.push(options.webApiWhere);
                }
                if (customizationOptions && customizationOptions.getCustomWhere) {
                    var customWhere = customizationOptions.getCustomWhere();
                    if (customWhere) {
                        input.push(customWhere);
                    }
                }
                if (!this.constructWhere(scopeContainer, input, where)) {
                    return null;
                }
                if (where.length > 0) {
                    getOptions.where = where;
                }
            }
            if (options.filters || (customizationOptions && customizationOptions.getCustomFilters)) {
                var customs = [];
                var where = [];
                if (!this.constructFilters(scopeContainer, options, customizationOptions, customs, where)) {
                    return null;
                }
                if (customs.length > 0) {
                    getOptions.customs = customs;
                }
                if (where.length > 0) {
                    if (getOptions.where) {
                        getOptions.where = [getOptions.where, where];
                    }
                    else {
                        getOptions.where = where;
                    }
                }
            }
            if (customizationOptions && customizationOptions.getSearchText) {
                getOptions.searchtext = customizationOptions.getSearchText();
            }
            if (options.webApiMaxRecords > 0) {
                getOptions.maxRecords = options.webApiMaxRecords;
            }
            return getOptions;
        };
        DataSourceService.prototype.addObservers = function (scopeContainer, options, action) {
            this.addObserversWhere(scopeContainer, options.webApiWhere, action);
            if (options.filters) {
                for (var _i = 0, _a = options.filters; _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.addObserversDetail(scopeContainer, item.if, action);
                    this.addObserversDetail(scopeContainer, item.webApiCustomValue, action);
                    this.addObserversWhere(scopeContainer, item.webApiWhere, action);
                }
            }
        };
        DataSourceService.prototype.addObserversDetail = function (scopeContainer, expression, action) {
            if (expression == void (0)) {
                return;
            }
            this.binding.observe(scopeContainer, expression, action);
        };
        DataSourceService.prototype.addObserversWhere = function (scopeContainer, data, action) {
            var _this = this;
            if (data == void (0)) {
                return;
            }
            if (Array.isArray(data)) {
                data.forEach(function (item) { return _this.addObserversWhere(scopeContainer, item, action); });
            }
            else if (typeof data === "object") {
                if (data.isBound === true && data.expression != void (0)) {
                    this.addObserversDetail(scopeContainer, data.expression, action);
                }
                else {
                    for (var property in data) {
                        this.addObserversWhere(scopeContainer, data[property], action);
                    }
                }
            }
        };
        DataSourceService.prototype.canLoad = function (customizationOptions) {
            return !customizationOptions
                || !customizationOptions.canLoad
                || customizationOptions.canLoad();
        };
        DataSourceService.prototype.constructWhere = function (scopeContainer, data, where) {
            var _this = this;
            if (data == void (0)) {
                return true;
            }
            if (Array.isArray(data)) {
                var newArr_1 = [];
                where.push(newArr_1);
                var cancel_1 = false;
                data.forEach(function (item) {
                    if (!_this.constructWhere(scopeContainer, item, newArr_1)) {
                        cancel_1 = true;
                    }
                });
                if (cancel_1) {
                    return false;
                }
            }
            else if (typeof data === "object") {
                if (data.isBound === true && data.expression != void (0)) {
                    var val = this.binding.evaluate(scopeContainer.scope, data.expression);
                    if (val == void (0)) {
                        return false;
                    }
                    where.push(val);
                }
                else {
                    for (var property in data) {
                        if (!this.constructWhere(scopeContainer, data[property], where)) {
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
        DataSourceService.prototype.constructFilters = function (scopeContainer, options, customizationOptions, customs, where) {
            var filters = [];
            if (options.filters) {
                filters.push.apply(filters, filters);
            }
            if (customizationOptions && customizationOptions.getCustomFilters) {
                var customFilters = customizationOptions.getCustomFilters();
                if (customFilters) {
                    filters.push.apply(filters, customFilters);
                }
            }
            for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                var item = filters_1[_i];
                if (item.if) {
                    if (!this.binding.evaluate(scopeContainer.scope, item.if)) {
                        continue;
                    }
                }
                if (item.webApiCustomKey && item.webApiCustomValue) {
                    customs.push({
                        key: item.webApiCustomKey,
                        value: this.binding.evaluate(scopeContainer.scope, item.webApiCustomValue)
                    });
                }
                else if (item.webApiWhere) {
                    var w = [];
                    if (!this.constructWhere(scopeContainer, item.webApiWhere, w)) {
                        return false;
                    }
                    where.push(w);
                }
            }
            return true;
        };
        return DataSourceService;
    }());
    DataSourceService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [rest_service_1.RestService,
            binding_service_1.BindingService])
    ], DataSourceService);
    exports.DataSourceService = DataSourceService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 485:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JsonService = (function () {
        function JsonService() {
            this.regexDateISO = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
        }
        JsonService.prototype.parse = function (json) {
            var _this = this;
            if (!json) {
                return json;
            }
            if (!(typeof json === "string")) {
                json = JSON.stringify(json);
            }
            return JSON.parse(json, function (key, value) {
                if (typeof value === "string" && value.indexOf("{") < 0) {
                    var a = _this.regexDateISO.exec(value);
                    if (a) {
                        return new Date(value);
                    }
                    return value;
                }
                return value;
            });
        };
        JsonService.prototype.stringify = function (obj) {
            return JSON.stringify(obj);
        };
        return JsonService;
    }());
    JsonService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [])
    ], JsonService);
    exports.JsonService = JsonService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 486:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 487:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StyleService = (function () {
        function StyleService() {
        }
        StyleService.prototype.addStyles = function (key, styleClasses) {
            this.removeStyleTag(key);
            var styleTag = document.createElement('style');
            styleTag.type = "text/css";
            styleTag.id = key;
            styleTag.appendChild(document.createTextNode(this.getCssClasses(styleClasses)));
            document.head.appendChild(styleTag);
        };
        StyleService.prototype.removeStyleTag = function (key) {
            var styleTag = document.getElementById(key);
            if (styleTag) {
                styleTag.remove();
            }
        };
        StyleService.prototype.getCssClasses = function (styleClasses) {
            var _this = this;
            return styleClasses
                .map(function (c) { return "\n" + c.name + " {\n " + _this.getCssClass(c.properties) + " }\n"; })
                .join("");
        };
        StyleService.prototype.getCssClass = function (properties) {
            return properties
                .map(function (c) { return c.propertyName + ": " + c.value + ";\n"; })
                .join("");
        };
        return StyleService;
    }());
    StyleService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [])
    ], StyleService);
    exports.StyleService = StyleService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 488:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(57)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadingService = (function () {
        function LoadingService(rest) {
            this.rest = rest;
            this.loadingCount = 0;
        }
        Object.defineProperty(LoadingService.prototype, "isLoading", {
            get: function () {
                return this.loadingCount > 0
                    || this.rest.isLoading;
            },
            enumerable: true,
            configurable: true
        });
        LoadingService.prototype.beginLoading = function () {
            this.loadingCount++;
        };
        LoadingService.prototype.endLoading = function () {
            if (this.loadingCount === 0) {
                return;
            }
            this.loadingCount--;
        };
        return LoadingService;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom("loadingCount", "rest.isLoading"),
        tslib_1.__metadata("design:type", Object),
        tslib_1.__metadata("design:paramtypes", [])
    ], LoadingService.prototype, "isLoading", null);
    LoadingService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.RestService])
    ], LoadingService);
    exports.LoadingService = LoadingService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 489:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CommandServerData = (function () {
        function CommandServerData() {
        }
        CommandServerData.prototype.add = function (id, data) {
            this[id] = data;
        };
        return CommandServerData;
    }());
    CommandServerData = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        tslib_1.__metadata("design:paramtypes", [])
    ], CommandServerData);
    exports.CommandServerData = CommandServerData;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Commands = (function () {
        function Commands() {
            this.commands = [];
            this.commandData = [];
        }
        Commands.prototype.addCommand = function (commandData) {
            this.commandData.push(commandData);
        };
        Commands.prototype.addInfo = function (command) {
            this.commands.push(command);
        };
        Commands.prototype.getCommands = function () {
            var _this = this;
            var result = this.commands.map(function (i) { return _this.form.binding.evaluate(_this.form.scope, i.binding.bindToFQ); });
            result.push.apply(result, this.commandData);
            return result;
        };
        Commands.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        return Commands;
    }());
    Commands = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        tslib_1.__metadata("design:paramtypes", [])
    ], Commands);
    exports.Commands = Commands;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 491:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContextMenu = (function () {
        function ContextMenu() {
            this.items = [];
        }
        ContextMenu.prototype.show = function (target) {
            if (this.items.length === 0) {
                return;
            }
            var options = {
                target: target,
                position: {
                    my: "top",
                    at: "bottom"
                },
                items: this.items,
                onItemClick: function (e) {
                    e.itemData.execute();
                },
                onHidden: function (e) {
                    element.remove();
                }
            };
            var element = $("<div>").appendTo("body");
            element.dxContextMenu(options);
            element.dxContextMenu("instance").show();
        };
        return ContextMenu;
    }());
    exports.ContextMenu = ContextMenu;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 492:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(239), __webpack_require__(500), __webpack_require__(141)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, toolbar_service_1, simple_widget_creator_service_1, custom_event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditPopups = (function () {
        function EditPopups(simpleWidgetCreator, toolbar, onEditPopupShown, onEditPopupHidden, onEditPopupModelLoaded) {
            this.simpleWidgetCreator = simpleWidgetCreator;
            this.toolbar = toolbar;
            this.onEditPopupShown = onEditPopupShown;
            this.onEditPopupHidden = onEditPopupHidden;
            this.onEditPopupModelLoaded = onEditPopupModelLoaded;
            this.editPopups = [];
        }
        EditPopups.prototype.addInfo = function (editPopup) {
            this.editPopups.push(editPopup);
            this.createOptions(editPopup);
        };
        EditPopups.prototype.getInfo = function (id) {
            return this.editPopups.find(function (c) { return c.id === id; });
        };
        EditPopups.prototype.show = function (id) {
            var editPopup = this.editPopups.find(function (c) { return c.id === id; });
            if (!editPopup) {
                throw new Error("No edit popup with id " + id + " found");
            }
            var instance = this.form[editPopup.id].instance;
            if (!editPopup.isInitialized) {
                this.initializeContent(instance, editPopup);
            }
            instance.show();
        };
        EditPopups.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        EditPopups.prototype.createOptions = function (editPopup) {
            this.simpleWidgetCreator.addPopup(this.form, editPopup);
        };
        EditPopups.prototype.initializeContent = function (instance, editPopup) {
            var _this = this;
            editPopup.isInitialized = true;
            instance.option("deferRendering", false);
            var popup = this.form[editPopup.id].instance;
            var content = this.form[editPopup.idContent];
            content.models.onLoaded.register(function (r) {
                return _this.onEditPopupModelLoaded.fire({
                    editPopup: editPopup,
                    model: r.model,
                    data: r.data
                });
            });
            popup.option("toolbarItems", this.toolbar.createToolbarItems(this.form.scopeContainer, {
                getItems: function () {
                    return popup.option("toolbarItems");
                },
                setItemProperty: function (index, property, value) {
                    popup.option("toolbarItems[" + index + "]." + property, value);
                }
            }, content.title, content.commands.getCommands()));
            popup.on({
                shown: function () {
                    editPopup.mappings.forEach(function (m) {
                        content.variables.data[m.to] = _this.form.binding.evaluate(_this.form.scope, m.binding.bindToFQ);
                    });
                    _this.onEditPopupShown.fire({
                        editPopup: editPopup
                    });
                },
                hidden: function () {
                    editPopup.mappings.forEach(function (m) {
                        content.variables.data[m.to] = null;
                    });
                    _this.onEditPopupHidden.fire({
                        editPopup: editPopup
                    });
                }
            });
        };
        return EditPopups;
    }());
    EditPopups = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        tslib_1.__metadata("design:paramtypes", [simple_widget_creator_service_1.SimpleWidgetCreatorService,
            toolbar_service_1.ToolbarService,
            custom_event_1.CustomEvent,
            custom_event_1.CustomEvent,
            custom_event_1.CustomEvent])
    ], EditPopups);
    exports.EditPopups = EditPopups;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 493:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework"), __webpack_require__(57)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1, export_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormBase = (function () {
        function FormBase(element, formBaseImport) {
            this.element = element;
            this.formBaseImport = formBaseImport;
            this._callOnBind = [];
            this.isEditForm = element.getAttribute("is-edit-form") === "true";
            this.isNestedForm = element.getAttribute("is-nested-form") === "true";
            this.popupStack = [];
            this.widgetCreator = formBaseImport.widgetCreator;
            this.command = formBaseImport.command;
            this.toolbar = formBaseImport.toolbar;
            this.models = formBaseImport.models;
            this.variables = formBaseImport.variables;
            this.nestedForms = formBaseImport.nestedForms;
            this.editPopups = formBaseImport.editPopups;
            this.functions = formBaseImport.functions;
            this.commands = formBaseImport.commands;
            this.binding = formBaseImport.binding;
            this.globalization = formBaseImport.globalization;
            this.localization = formBaseImport.localization;
            this.commandServerData = formBaseImport.commandServerData;
            this.error = formBaseImport.error;
            this.onAttached = formBaseImport.onAttached;
            this.onReady = formBaseImport.onReady;
            this.onReactivated = formBaseImport.onReactivated;
            this.onValidating = formBaseImport.onValidating;
            this.models.registerForm(this);
            this.variables.registerForm(this);
            this.functions.registerForm(this);
            this.commands.registerForm(this);
            this.nestedForms.registerForm(this);
            this.editPopups.registerForm(this);
        }
        FormBase.prototype.callOnBind = function (callback) {
            this._callOnBind.push(callback);
        };
        FormBase.prototype.activate = function (routeInfo) {
            if (routeInfo && routeInfo.parameters && routeInfo.parameters.id) {
                this.variables.data.$id = routeInfo.parameters.id;
            }
        };
        FormBase.prototype.created = function (owningView, myView) {
            this.owningView = owningView;
        };
        FormBase.prototype.attached = function () {
            var _this = this;
            var promise = this.onAttached.fire({
                form: this
            });
            this.formBaseImport.taskQueue.queueTask(function () {
                _this.onReady.fire({
                    form: _this,
                });
            });
            return promise;
        };
        FormBase.prototype.bind = function (bindingContext, overrideContext) {
            this.parent = this.owningView.bindingContext;
            this.scope = {
                bindingContext: this,
                overrideContext: aurelia_framework_1.createOverrideContext(this)
            };
            this.scopeContainer = new export_1.ScopeContainer(this.scope);
            this._callOnBind.forEach(function (c) {
                c();
            });
            this._callOnBind = null;
            this.loadCommands();
            this.toolbarOptions = this.toolbar.createFormToolbarOptions(this);
            this.models.loadModelsWithKey();
        };
        FormBase.prototype.unbind = function () {
            this.scopeContainer.disposeAll();
        };
        FormBase.prototype.reactivate = function () {
            this.onReactivated.fire({
                form: this
            });
        };
        FormBase.prototype.getFileDownloadUrl = function (key) {
            return this.binding.evaluate(this.scope, key);
        };
        FormBase.prototype.getFormsInclOwn = function () {
            return [this].concat(this.nestedForms.getNestedForms());
        };
        FormBase.prototype.closeCurrentPopup = function () {
            if (this.popupStack.length > 0) {
                var index = this.popupStack.length - 1;
                var current = this.popupStack[index];
                current.popup.hide();
            }
            else {
                if (this.parent && this.parent.closeCurrentPopup) {
                    this.parent.closeCurrentPopup();
                }
            }
        };
        FormBase.prototype.executeCommand = function (id) {
            var context = this.getCurrentForm();
            if (context === this) {
                var command = this.commands
                    .getCommands()
                    .find(function (i) { return i.id == id; });
                if (!command) {
                    return;
                }
                this.command.execute(this.scope, command);
            }
            else {
                context.executeCommand(id);
            }
        };
        FormBase.prototype.validate = function (validationResult) {
            var _this = this;
            var args = {
                form: this,
                validationResult: validationResult
            };
            return this.onValidating.fire(args)
                .then(function () {
                var forms = _this.nestedForms.getNestedForms();
                var promise = Promise.resolve();
                for (var _i = 0, forms_1 = forms; _i < forms_1.length; _i++) {
                    var form = forms_1[_i];
                    promise = form.validate(validationResult);
                }
                return promise;
            });
        };
        FormBase.prototype.canSave = function () {
            return this
                .getFormsInclOwn()
                .some(function (i) { return i.models.getModels().some(function (m) {
                if (!m.postOnSave) {
                    return false;
                }
                return true;
            }); });
        };
        FormBase.prototype.canSaveNow = function () {
            var _this = this;
            return this
                .getFormsInclOwn()
                .some(function (i) { return i.models.getModels().some(function (m) {
                if (!m.postOnSave) {
                    return false;
                }
                if (!_this.models.data[m.id] || _this.models.data[m.id][m.keyProperty] === undefined) {
                    return false;
                }
                return true;
            }); });
        };
        FormBase.prototype.save = function () {
            var _this = this;
            var validationResult = {
                isValid: true,
                messages: []
            };
            if (!this.canSave() || !this.canSaveNow()) {
                return Promise.resolve(validationResult);
            }
            return this.validate(validationResult)
                .then(function () {
                if (validationResult.isValid) {
                    return _this.models
                        .save()
                        .then(function () {
                        DevExpress.ui.notify(_this.translate("base.save_success"), "SUCCESS", 3000);
                        return Promise.resolve(validationResult);
                    });
                }
                else {
                    DevExpress.ui.notify(validationResult.messages.length > 0
                        ? validationResult.messages[0]
                        : _this.translate("base.validation_error"), "ERROR", 3000);
                    return Promise.resolve();
                }
            });
        };
        FormBase.prototype.canDeleteNow = function () {
            var _this = this;
            return this
                .getFormsInclOwn()
                .some(function (i) { return i.models.getModels().some(function (m) {
                if (!m.postOnSave) {
                    return false;
                }
                if (!_this.models.data[m.id] || !_this.models.data[m.id][m.keyProperty]) {
                    return false;
                }
                return true;
            }); });
        };
        FormBase.prototype.delete = function () {
            if (!this.canSave() || !this.canDeleteNow()) {
                return Promise.resolve();
            }
            return this.models.delete();
        };
        FormBase.prototype.translate = function (key) {
            return this.localization.translate(this.scopeContainer, key);
        };
        FormBase.prototype.addModel = function (model) {
            var _this = this;
            this.callOnBind(function () {
                _this.models.addInfo(model);
            });
        };
        FormBase.prototype.addVariable = function (variable) {
            var _this = this;
            this.callOnBind(function () {
                _this.variables.addInfo(variable);
            });
        };
        FormBase.prototype.addCommandServerData = function (id, commandServerData) {
            var _this = this;
            this.callOnBind(function () {
                _this.commandServerData.add(id, commandServerData);
            });
        };
        FormBase.prototype.addCommand = function (command) {
            var _this = this;
            this.callOnBind(function () {
                _this.commands.addInfo(command);
            });
        };
        FormBase.prototype.addFunction = function (id, functionInstance, namespace, customParameter) {
            var _this = this;
            this.callOnBind(function () {
                _this.functions.add(id, functionInstance, namespace, customParameter);
            });
        };
        FormBase.prototype.addNestedForm = function (id, mappings) {
            var _this = this;
            this.callOnBind(function () {
                _this.nestedForms.addInfo(id, mappings);
            });
        };
        FormBase.prototype.addEditPopup = function (editPopup) {
            var _this = this;
            this.callOnBind(function () {
                _this.editPopups.addInfo(editPopup);
            });
        };
        FormBase.prototype.addMapping = function (mapping) {
        };
        FormBase.prototype.submitForm = function (commandExpression) {
            var command = this.binding.evaluate(this.scope, commandExpression);
            if (!command || !command.execute) {
                return;
            }
            this.command.execute(this.scope, command);
        };
        FormBase.prototype.onConstructionFinished = function () {
        };
        FormBase.prototype.loadCommands = function () {
            if (!this.isNestedForm) {
                this.commands.addCommand(this.formBaseImport.defaultCommands.getFormGoBackCommand(this));
                if (this.isEditForm) {
                    this.commands.addCommand(this.formBaseImport.defaultCommands.getEditPopupSaveCommand(this));
                    this.commands.addCommand(this.formBaseImport.defaultCommands.getEditPopupDeleteCommand(this));
                }
                else {
                    this.commands.addCommand(this.formBaseImport.defaultCommands.getFormSaveCommand(this));
                    this.commands.addCommand(this.formBaseImport.defaultCommands.getFormDeleteCommand(this));
                }
            }
            if (this.isEditForm) {
                this.commands.addCommand(this.formBaseImport.defaultCommands.getClosePopupCommand(this));
            }
        };
        FormBase.prototype.getCurrentForm = function () {
            if (this.popupStack.length === 0) {
                return this;
            }
            var index = this.popupStack.length - 1;
            var current = this.popupStack[index];
            var editPopup = this.editPopups.getInfo(current.id);
            if (!editPopup) {
                return this;
            }
            return this[editPopup.idContent];
        };
        return FormBase;
    }());
    exports.FormBase = FormBase;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 494:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    Functions = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        tslib_1.__metadata("design:paramtypes", [])
    ], Functions);
    exports.Functions = Functions;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 495:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(57), __webpack_require__(484)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, data_source_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Models = (function () {
        function Models(rest, dataSource, onLoadRequired, onLoadedInterceptor, onLoaded) {
            var _this = this;
            this.rest = rest;
            this.dataSource = dataSource;
            this.onLoadRequired = onLoadRequired;
            this.onLoadedInterceptor = onLoadedInterceptor;
            this.onLoaded = onLoaded;
            this.onLoadRequired.waitTimeout = 10;
            this.data = {};
            this.info = {};
            this.onLoadRequired.register(function (args) {
                if (args.model.key || args.model.autoLoad) {
                    var key = _this.form.binding.evaluate(_this.form.scope, args.model.key);
                    return _this.loadModel(args.model, key);
                }
                return Promise.resolve();
            });
        }
        Models.prototype.addInfo = function (model) {
            model.keyProperty = model.keyProperty || "Id";
            this.info[model.id] = model;
            this.addObservers(model);
        };
        Models.prototype.createNewModelData = function (model) {
            var data = {};
            data[model.keyProperty] = 0;
            return data;
        };
        Models.prototype.getInfo = function (id) {
            var model = this.info[id];
            if (!model) {
                throw new Error();
            }
            return model;
        };
        Models.prototype.getModels = function () {
            var arr = [];
            for (var i in this.info) {
                arr.push(this.info[i]);
            }
            return arr;
        };
        Models.prototype.loadModel = function (model, keyValue) {
            var _this = this;
            var getOptions = this.dataSource.createGetOptions(this.form.scopeContainer, model);
            if (keyValue == void (0)) {
                this.data[model.id] = null;
                this.onLoaded.fire({
                    model: model,
                    data: null
                });
            }
            else {
                return this.rest.get({
                    url: this.rest.getWebApiUrl(model.webApiAction + "/" + keyValue),
                    getOptions: getOptions,
                    increaseLoadingCount: true
                }).then(function (r) {
                    _this.onLoadedInterceptor.fire({
                        model: model,
                        data: r
                    });
                    _this.data[model.id] = r;
                    _this.onLoaded.fire({
                        model: model,
                        data: r
                    });
                });
            }
        };
        Models.prototype.loadModelsWithKey = function () {
            for (var id in this.info) {
                var model = this.info[id];
                if (!model.key) {
                    continue;
                }
                var keyValue = this.form.binding.evaluate(this.form.scope, model.key);
                if (keyValue == void (0)) {
                    continue;
                }
                this.loadModel(model, keyValue);
            }
        };
        Models.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        Models.prototype.save = function () {
            var _this = this;
            var promiseArr = this.getModels()
                .filter(function (m) { return m.postOnSave && _this.data[m.id]; })
                .map(function (m) {
                var method = "post";
                if (!_this.data[m.id][m.keyProperty]) {
                    method = "put";
                }
                var promise = _this.rest[method]({
                    url: _this.rest.getWebApiUrl(m.webApiAction),
                    data: _this.data[m.id],
                    increaseLoadingCount: true,
                    getOptions: _this.dataSource.createGetOptions(_this.form.scopeContainer, m)
                }).then(function (r) {
                    _this.data[m.id] = r;
                    _this.onLoaded.fire({
                        model: m,
                        data: r
                    });
                });
                return promise;
            });
            return Promise
                .all(promiseArr)
                .then(function () {
                return _this.form.nestedForms.getNestedForms().map(function (f) { return f.models.save(); });
            });
        };
        Models.prototype.delete = function () {
            var _this = this;
            var promiseArr = this.getModels()
                .filter(function (m) { return m.postOnSave && _this.data[m.id] && _this.data[m.id][m.keyProperty]; })
                .map(function (m) {
                var promise = _this.rest.delete({
                    url: _this.rest.getWebApiUrl(m.webApiAction),
                    id: _this.data[m.id][m.keyProperty],
                    increaseLoadingCount: true
                });
                return promise;
            });
            return Promise.all(promiseArr)
                .then(function () {
                return _this.form.nestedForms.getNestedForms().map(function (f) { return f.models.delete(); });
            });
        };
        Models.prototype.addObservers = function (model) {
            var _this = this;
            this.addObserversDetail(model, model.key);
            this.dataSource.addObservers(this.form.scopeContainer, model, function () {
                _this.onLoadRequired.fire({
                    model: model
                });
            });
        };
        Models.prototype.addObserversDetail = function (model, expression) {
            var _this = this;
            if (expression == void (0)) {
                return;
            }
            this.form.binding.observe(this.form.scopeContainer, expression, function (newValue, oldValue) {
                _this.onLoadRequired.fire({
                    model: model
                });
            });
        };
        return Models;
    }());
    Models = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        tslib_1.__metadata("design:paramtypes", [export_1.RestService,
            data_source_service_1.DataSourceService,
            export_1.CustomEvent,
            export_1.CustomEvent,
            export_1.CustomEvent])
    ], Models);
    exports.Models = Models;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 496:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NestedForms = (function () {
        function NestedForms() {
            this.nestedForms = [];
        }
        NestedForms.prototype.addInfo = function (id, mappings) {
            this.nestedForms.push(id);
            this.observeMappings(id, mappings);
        };
        NestedForms.prototype.getNestedForms = function () {
            var _this = this;
            var arr = [];
            this.nestedForms.forEach(function (i) {
                var form = _this.form[i];
                if (!form) {
                    return;
                }
                arr.push(form);
                arr.push.apply(arr, form.nestedForms.getNestedForms());
            });
            return arr;
        };
        NestedForms.prototype.observeMappings = function (id, mappings) {
            var _this = this;
            var _loop_1 = function (mapping) {
                this_1.form.binding.observe(this_1.form.scopeContainer, mapping.binding.bindToFQ, function (newValue) {
                    var nestedForm = _this.form[id];
                    nestedForm.variables.data[mapping.to] = newValue;
                });
            };
            var this_1 = this;
            for (var _i = 0, mappings_1 = mappings; _i < mappings_1.length; _i++) {
                var mapping = mappings_1[_i];
                _loop_1(mapping);
            }
        };
        NestedForms.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        return NestedForms;
    }());
    NestedForms = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        tslib_1.__metadata("design:paramtypes", [])
    ], NestedForms);
    exports.NestedForms = NestedForms;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 497:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    Variables = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        tslib_1.__metadata("design:paramtypes", [])
    ], Variables);
    exports.Variables = Variables;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 498:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionModeEnum;
    (function (SelectionModeEnum) {
        SelectionModeEnum[SelectionModeEnum["None"] = 0] = "None";
        SelectionModeEnum[SelectionModeEnum["Single"] = 1] = "Single";
        SelectionModeEnum[SelectionModeEnum["Multiple"] = 2] = "Multiple";
    })(SelectionModeEnum = exports.SelectionModeEnum || (exports.SelectionModeEnum = {}));
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 499:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(53), __webpack_require__(143), __webpack_require__(491)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, router_service_1, context_menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DefaultCommandsService = (function () {
        function DefaultCommandsService(router, location, permission) {
            this.router = router;
            this.location = location;
            this.permission = permission;
        }
        DefaultCommandsService.prototype.getFormSaveCommand = function (form) {
            var cmd = {
                id: "$save",
                icon: "floppy-o",
                title: "base.save",
                sort: 10,
                isVisible: form.canSave(),
                isEnabled: form.canSaveNow(),
                execute: function () {
                    form.save()
                        .catch(function (r) {
                        form.error.showAndLogError(r);
                    });
                }
            };
            form.models.onLoaded.register(function () {
                cmd.isEnabled = form.canSaveNow();
                return Promise.resolve();
            });
            return cmd;
        };
        DefaultCommandsService.prototype.getEditPopupSaveCommand = function (form) {
            var cmd = this.getFormSaveCommand(form);
            cmd.execute = function () {
                form.save().then(function () {
                    form.closeCurrentPopup();
                });
            };
            return cmd;
        };
        DefaultCommandsService.prototype.getFormDeleteCommand = function (form) {
            var cmd = {
                id: "$delete",
                icon: "times",
                title: "base.delete",
                sort: 20,
                isVisible: form.canSave(),
                isEnabled: form.canDeleteNow(),
                execute: function () {
                    DevExpress.ui.dialog.confirm(form.translate("base.sure_delete_question"), form.translate("base.question"))
                        .then(function (r) {
                        if (r) {
                            form.delete().then(function () {
                                history.back();
                            });
                        }
                    });
                }
            };
            form.models.onLoaded.register(function () {
                cmd.isVisible = form.canSave();
                cmd.isEnabled = form.canDeleteNow();
                return Promise.resolve();
            });
            return cmd;
        };
        DefaultCommandsService.prototype.getEditPopupDeleteCommand = function (form) {
            var cmd = this.getFormDeleteCommand(form);
            cmd.execute = function () {
                DevExpress.ui.dialog.confirm(form.translate("base.sure_delete_question"), form.translate("base.question"))
                    .then(function (r) {
                    if (r) {
                        form.delete().then(function () {
                            form.closeCurrentPopup();
                        });
                    }
                });
            };
            return cmd;
        };
        DefaultCommandsService.prototype.getFormGoBackCommand = function (form) {
            var cmd = {
                id: "$goBack",
                icon: "arrow-left",
                sort: 0,
                isVisible: this.router.viewStack.length > 1
                    && !form.isEditForm
                    && !form.isNestedForm,
                execute: function () {
                    history.back();
                }
            };
            return cmd;
        };
        DefaultCommandsService.prototype.getListAddCommand = function (form, options) {
            var _this = this;
            var cmd = {
                id: "$add",
                icon: "plus",
                title: "base.add",
                sort: 5,
                isVisible: false,
                isEnabled: true,
                execute: function () {
                    if (options.edits.length > 0) {
                        var ctxMenu_1 = new context_menu_1.ContextMenu();
                        options.edits.forEach(function (c) {
                            ctxMenu_1.items.push({
                                text: form.translate(c.caption),
                                execute: function () {
                                    if (c.editDataContext) {
                                        var model = form.models.getInfo(c.editDataContext);
                                        form.models.data[c.editDataContext] = form.models.createNewModelData(model);
                                    }
                                    if (c.editUrl) {
                                        _this.location.goTo(c.editUrl + "/0", form);
                                    }
                                    if (c.idEditPopup) {
                                        form.editPopups.show(c.idEditPopup);
                                    }
                                }
                            });
                        });
                        ctxMenu_1.show(null);
                    }
                    else {
                        if (options.editDataContext) {
                            var model = form.models.getInfo(options.editDataContext);
                            form.models.data[options.editDataContext] = form.models.createNewModelData(model);
                        }
                        if (options.editUrl) {
                            _this.location.goTo(options.editUrl + "/0", form);
                        }
                        if (options.idEditPopup) {
                            form.editPopups.show(options.idEditPopup);
                        }
                    }
                }
            };
            if (options.dataModel) {
                var info_1 = form.models.getInfo(options.dataModel);
                if (info_1) {
                    cmd.isVisible = (info_1.webApiAction
                        && info_1.keyProperty
                        && this.permission.canWebApiNew(info_1.webApiAction)
                        && !!(options.editUrl || options.idEditPopup || options.edits.length > 0)) || false;
                    var isEnabled_1 = function () {
                        return (!options.isRelation || (form.models.data[info_1.id] && form.models.data[info_1.id][info_1.keyProperty])) || false;
                    };
                    cmd.isEnabled = isEnabled_1();
                    form.binding.observe(form.scopeContainer, "models.data." + info_1.id + "." + info_1.keyProperty, function (newValue) {
                        cmd.isEnabled = isEnabled_1();
                    });
                }
            }
            return cmd;
        };
        DefaultCommandsService.prototype.getListCommands = function (form, options) {
            var result = [];
            var addCmd = this.getListAddCommand(form, options);
            if (addCmd) {
                result.push(addCmd);
            }
            return result;
        };
        DefaultCommandsService.prototype.getClosePopupCommand = function (form) {
            var cmd = {
                id: "$close",
                icon: "times",
                sort: 999,
                location: "after",
                execute: function () {
                    form.closeCurrentPopup();
                }
            };
            return cmd;
        };
        return DefaultCommandsService;
    }());
    DefaultCommandsService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [router_service_1.RouterService,
            export_1.LocationService,
            export_1.PermissionService])
    ], DefaultCommandsService);
    exports.DefaultCommandsService = DefaultCommandsService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 500:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(238), __webpack_require__(53), __webpack_require__(240)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, base_widget_creator_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimpleWidgetCreatorService = (function () {
        function SimpleWidgetCreatorService(baseWidgetCreator, dataSource, globalization, localization, toolbar, defaultCommands, validation, selectItem) {
            this.baseWidgetCreator = baseWidgetCreator;
            this.dataSource = dataSource;
            this.globalization = globalization;
            this.localization = localization;
            this.toolbar = toolbar;
            this.defaultCommands = defaultCommands;
            this.validation = validation;
            this.selectItem = selectItem;
        }
        SimpleWidgetCreatorService.prototype.addAccordion = function (form, options) {
            this.baseWidgetCreator.createWidgetOptions(form, options);
        };
        SimpleWidgetCreatorService.prototype.addCalendar = function (form, options) {
            this.createEditorOptions(form, options);
        };
        SimpleWidgetCreatorService.prototype.addCheckBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.caption) {
                editorOptions.text = this.localization.translate(form.scopeContainer, options.caption);
            }
            editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addColorBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.editAlphaChannel) {
                editorOptions.editAlphaChannel = options.editAlphaChannel;
            }
            editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addDateBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.min) {
                editorOptions.min = options.min;
            }
            if (options.max) {
                editorOptions.max = options.max;
            }
            if (options.format) {
                editorOptions.displayFormat = this.globalization.getFormatterParser(options.format);
            }
        };
        SimpleWidgetCreatorService.prototype.addCommand = function (form, options) {
            var command;
            if (options.binding.dataContext) {
                command = form.commandServerData[options.binding.dataContext + ";" + options.binding.bindTo];
            }
            else {
                command = form.binding.evaluate(form.scope, options.binding.bindToFQ);
            }
            var buttonOptions = {};
            buttonOptions.text = this.localization.translate(form.scopeContainer, command.title);
            buttonOptions.hint = this.localization.translate(form.scopeContainer, command.tooltip);
            buttonOptions.width = "100%";
            buttonOptions.onClick = function () {
                if (typeof command.execute === "function") {
                    command.execute();
                }
                else if (typeof command.execute === "string") {
                    form.binding.evaluate(form.scope, command.execute);
                }
                else {
                    throw new Error();
                }
            };
            form[options.options.optionsName] = buttonOptions;
        };
        SimpleWidgetCreatorService.prototype.addFileUploader = function (form, options) {
            var widgetOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.acceptType) {
                widgetOptions.accept = options.acceptType;
            }
        };
        SimpleWidgetCreatorService.prototype.addFileUploaderWithViewer = function (form, options) {
            var widgetOptions = this.createEditorOptions(form, options);
        };
        SimpleWidgetCreatorService.prototype.addInclude = function (form, options) {
        };
        SimpleWidgetCreatorService.prototype.addListView = function (form, options) {
        };
        SimpleWidgetCreatorService.prototype.addLookup = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            var selectItem = this.selectItem.getSelectItem(options.idSelect);
            this.addDataExpressionOptions(form, options, editorOptions, selectItem);
            editorOptions.title = this.localization.translate(null, "forms.lookup_selectItem");
            if (selectItem.titleTemplate) {
                editorOptions.titleTemplate = "from-select-title-template-" + selectItem.id;
            }
            if (selectItem.fieldTemplate) {
                editorOptions.fieldTemplate = "from-select-field-template-" + selectItem.id;
            }
            if (selectItem.itemTemplate) {
                editorOptions.itemTemplate = "from-select-item-template-" + selectItem.id;
            }
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
        };
        SimpleWidgetCreatorService.prototype.addPopover = function (form, options) {
            var widgetOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.caption) {
                widgetOptions.title = this.localization.translate(null, options.caption);
            }
        };
        SimpleWidgetCreatorService.prototype.addPopup = function (form, options) {
            var widgetOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            widgetOptions.showCloseButton = false;
            widgetOptions.contentTemplate = "contentTemplate";
            widgetOptions.onShowing = function (e) {
                form.popupStack.push({
                    id: options.id,
                    popup: e.component
                });
            };
            widgetOptions.onHidden = function (e) {
                var index = form.popupStack.indexOf(e.component);
                if (index >= 0) {
                    form.popupStack.splice(index, 1);
                }
            };
            if (options.height) {
                widgetOptions.height = options.height;
            }
            if (options.maxWidth) {
                widgetOptions.maxWidth = options.maxWidth;
            }
            var commands = [];
            commands.push(this.defaultCommands.getClosePopupCommand(form));
            commands.push.apply(commands, options.commands.map(function (c) {
                var cmd = form.binding.evaluate(form.scope, c.binding.bindToFQ);
                if (!cmd) {
                    throw new Error("No command for " + c.binding.bindToFQ + " found");
                }
                return cmd;
            }));
            widgetOptions.toolbarItems = this.toolbar.createToolbarItems(form.scopeContainer, {
                getItems: function () {
                    var popup = form[options.id];
                    if (!popup) {
                        return widgetOptions.toolbarItems;
                    }
                    return popup.option("toolbarItems");
                },
                setItemProperty: function (index, property, value) {
                    var popup = form[options.id];
                    if (!popup) {
                        return [];
                    }
                    popup.option("toolbarItems[" + index + "]." + property, value);
                }
            }, options.caption, commands);
        };
        SimpleWidgetCreatorService.prototype.addRadioGroup = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            var selectItem = this.selectItem.getSelectItem(options.idSelect);
            this.addDataExpressionOptions(form, options, editorOptions, selectItem);
            if (selectItem.itemTemplate) {
                editorOptions.itemTemplate = "from-select-item-template-" + selectItem.id;
            }
        };
        SimpleWidgetCreatorService.prototype.addSelectBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            var selectItem = this.selectItem.getSelectItem(options.idSelect);
            this.addDataExpressionOptions(form, options, editorOptions, selectItem);
            if (selectItem.fieldTemplate) {
                editorOptions.fieldTemplate = "from-select-field-template-" + selectItem.id;
            }
            if (selectItem.itemTemplate) {
                editorOptions.itemTemplate = "from-select-item-template-" + selectItem.id;
            }
        };
        SimpleWidgetCreatorService.prototype.addTab = function (form, options) {
            var _this = this;
            var tabOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            var component;
            tabOptions.onInitialized = function (e) {
                component = e.component;
            };
            tabOptions.items = [];
            tabOptions.bindingOptions["selectedIndex"] = options.id + "Selected";
            options.pages.forEach(function (page, index) {
                var pageOptions = {
                    text: _this.localization.translate(form.scopeContainer, page.caption),
                    visible: true,
                    __options: page
                };
                if (page.if) {
                    form.binding.observe(form.scopeContainer, page.if, function (newValue) {
                        component.option("items[" + index + "].visible", newValue);
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
                form.binding.evaluate(form.scope, page.__options.onActivated);
            };
        };
        SimpleWidgetCreatorService.prototype.addTagBox = function (form, options) {
            var widgetOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            widgetOptions.valueExpr = options.itemValueExpr;
            widgetOptions.displayExpr = options.itemDisplayExpr;
            widgetOptions.searchEnabled = true;
            widgetOptions.showSelectionControls = true;
            widgetOptions.applyValueMode = "useButtons";
            var model = form.models.getInfo(options.itemDataContext);
            var dataSource = this.dataSource.createDataSource(form.scopeContainer, model);
            widgetOptions.dataSource = dataSource;
            widgetOptions.onSelectionChanged = function (e) {
                var addedItems = e.addedItems;
                var removedItems = e.removedItems;
                var list = form.binding.evaluate(form.scope, options.relationBinding.bindToFQ);
                if (list == void (0)) {
                    list = [];
                    form.binding.assign(form.scope, options.relationBinding.bindToFQ, list);
                }
                addedItems.forEach(function (c) {
                    var exists = list.some(function (d) { return d[options.relationProperty] == c[model.keyProperty]; });
                    if (exists) {
                        return;
                    }
                    var newObj = {};
                    newObj[options.relationProperty] = c[model.keyProperty];
                    list.push(newObj);
                });
                removedItems.forEach(function (c) {
                    var existsList = list.filter(function (d) { return d[options.relationProperty] == c[model.keyProperty]; });
                    existsList.forEach(function (d) {
                        var index = list.indexOf(d);
                        list.splice(index, 1);
                    });
                });
            };
            form.models.onLoaded.register(function (a) {
                if (a.model.id !== options.dataContext) {
                    return;
                }
                var list = form.binding.evaluate(form.scope, options.relationBinding.bindToFQ)
                    || [];
                var data = list.map(function (c) { return c[options.relationProperty]; });
                if (form[options.id]) {
                    var instance = form[options.id].instance;
                    instance.option("value", data);
                }
                else {
                    widgetOptions.value = data;
                }
                return Promise.resolve();
            });
        };
        SimpleWidgetCreatorService.prototype.addTextBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.maxLength) {
                editorOptions.maxLength = options.maxLength;
            }
            if (options.mode) {
                editorOptions.mode = options.mode;
            }
        };
        SimpleWidgetCreatorService.prototype.addTextArea = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.maxLength) {
                editorOptions.maxLength = options.maxLength;
            }
            if (options.height) {
                editorOptions.height = options.height;
            }
        };
        SimpleWidgetCreatorService.prototype.addValidationGroup = function (form, options) {
            var validationOptions = {};
            form[options.options.optionsName] = validationOptions;
            form.onValidating.register(function (r) {
                var instance = form[options.id].instance;
                var result = instance.validate();
                if (result.isValid) {
                    return Promise.resolve(r.validationResult);
                }
                else {
                    r.validationResult.isValid = false;
                    (_a = r.validationResult.messages).push.apply(_a, result
                        .brokenRules
                        .map(function (c) { return c.message; }));
                    return Promise.resolve();
                }
                var _a;
            });
        };
        SimpleWidgetCreatorService.prototype.createEditorOptions = function (form, options) {
            var _this = this;
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
                editorOptions.placeholder = this.localization.translate(form.scopeContainer, options.placeholder);
            }
            editorOptions["validators"] = options.validationRules.map(function (v) {
                if (v.binding) {
                    return form.binding.evaluate(form.scope, v.binding.bindToFQ);
                }
                else if (v.item) {
                    return _this.validation.getValidator(form.scopeContainer, v.item.type, options.caption, v.item.parameters);
                }
                else {
                    throw new Error("No binding/item specified");
                }
            });
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addDataExpressionOptions = function (form, options, current, selectItem) {
            if (selectItem.items
                && selectItem.items.length > 0) {
                current.dataSource = selectItem.items;
            }
            else if (selectItem.action) {
                var where = [];
                if (options.filter) {
                    where.push(options.filter);
                }
                if (selectItem.where) {
                    where.push(selectItem.where);
                }
                var filters = [];
                if (options.customs) {
                    filters.push.apply(filters, options.customs);
                }
                if (options.filters) {
                    filters.push.apply(filters, options.filter);
                }
                current.dataSource = this.dataSource.createDataSource(form.scopeContainer, {
                    keyProperty: selectItem.valueMember,
                    webApiAction: selectItem.action,
                    webApiColumns: selectItem.columns,
                    webApiExpand: selectItem.expand,
                    webApiOrderBy: selectItem.orderBy,
                    webApiWhere: where,
                    filters: filters
                });
            }
            current.valueExpr = selectItem.valueMember;
            current.displayExpr = selectItem.displayMember;
        };
        return SimpleWidgetCreatorService;
    }());
    SimpleWidgetCreatorService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [base_widget_creator_service_1.BaseWidgetCreatorService,
            export_2.DataSourceService,
            export_2.GlobalizationService,
            export_2.LocalizationService,
            export_1.ToolbarService,
            export_1.DefaultCommandsService,
            export_1.ValidationService,
            export_1.SelectItemService])
    ], SimpleWidgetCreatorService);
    exports.SimpleWidgetCreatorService = SimpleWidgetCreatorService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 501:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(500), __webpack_require__(847), __webpack_require__(849)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, simple_widget_creator_service_1, data_grid_widget_creator_service_1, list_widget_creator_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WidgetCreatorService = (function () {
        function WidgetCreatorService(simpleWidgetCreator, dataGridWidgetCreator, listWidgetCreator) {
            this.simpleWidgetCreator = simpleWidgetCreator;
            this.dataGridWidgetCreator = dataGridWidgetCreator;
            this.listWidgetCreator = listWidgetCreator;
        }
        WidgetCreatorService.prototype.addAccordion = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addAccordion(form, options);
            });
        };
        WidgetCreatorService.prototype.addCalendar = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addCalendar(form, options);
            });
        };
        WidgetCreatorService.prototype.addCheckBox = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addCheckBox(form, options);
            });
        };
        WidgetCreatorService.prototype.addColorBox = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addColorBox(form, options);
            });
        };
        WidgetCreatorService.prototype.addCommand = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addCommand(form, options);
            });
        };
        WidgetCreatorService.prototype.addDateBox = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addDateBox(form, options);
            });
        };
        WidgetCreatorService.prototype.addDataGrid = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.dataGridWidgetCreator.addDataGrid(form, options);
            });
        };
        WidgetCreatorService.prototype.addFileUploader = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addFileUploader(form, options);
            });
        };
        WidgetCreatorService.prototype.addFileUploaderWithViewer = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addFileUploaderWithViewer(form, options);
            });
        };
        WidgetCreatorService.prototype.addInclude = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addInclude(form, options);
            });
        };
        WidgetCreatorService.prototype.addList = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.listWidgetCreator.addList(form, options);
            });
        };
        WidgetCreatorService.prototype.addListView = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addListView(form, options);
            });
        };
        WidgetCreatorService.prototype.addLookup = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addLookup(form, options);
            });
        };
        WidgetCreatorService.prototype.addNumberBox = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addNumberBox(form, options);
            });
        };
        WidgetCreatorService.prototype.addPopover = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addPopover(form, options);
            });
        };
        WidgetCreatorService.prototype.addPopup = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addPopup(form, options);
            });
        };
        WidgetCreatorService.prototype.addRadioGroup = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addRadioGroup(form, options);
            });
        };
        WidgetCreatorService.prototype.addTab = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addTab(form, options);
            });
        };
        WidgetCreatorService.prototype.addSelectBox = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addSelectBox(form, options);
            });
        };
        WidgetCreatorService.prototype.addTagBox = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addTagBox(form, options);
            });
        };
        WidgetCreatorService.prototype.addTextBox = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addTextBox(form, options);
            });
        };
        WidgetCreatorService.prototype.addTextArea = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addTextArea(form, options);
            });
        };
        WidgetCreatorService.prototype.addValidationGroup = function (form, options) {
            var _this = this;
            form.callOnBind(function () {
                _this.simpleWidgetCreator.addValidationGroup(form, options);
            });
        };
        return WidgetCreatorService;
    }());
    WidgetCreatorService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [simple_widget_creator_service_1.SimpleWidgetCreatorService,
            data_grid_widget_creator_service_1.DataGridWidgetCreatorService,
            list_widget_creator_service_1.ListWidgetCreatorService])
    ], WidgetCreatorService);
    exports.WidgetCreatorService = WidgetCreatorService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 502:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewItem = (function () {
        function ViewItem(routeInfo) {
            this.routeInfo = routeInfo;
            this.title = routeInfo.route.caption;
            this.moduleId = routeInfo.route.moduleId;
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
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom("isCurrent"),
        tslib_1.__metadata("design:type", String),
        tslib_1.__metadata("design:paramtypes", [])
    ], ViewItem.prototype, "className", null);
    exports.ViewItem = ViewItem;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 503:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(241), __webpack_require__(143), __webpack_require__(852)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, history_service_1, router_service_1, routes_creator_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoryService = history_service_1.HistoryService;
    exports.RouterService = router_service_1.RouterService;
    exports.RoutesCreatorService = routes_creator_service_1.RoutesCreatorService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 529:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "button,\nhr,\ninput {\n  overflow: visible;\n}\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n}\nprogress,\nsub,\nsup {\n  vertical-align: baseline;\n}\n[type=checkbox],\n[type=radio],\nlegend {\n  box-sizing: border-box;\n  padding: 0;\n}\nhtml {\n  line-height: 1.15;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nmain,\nmenu,\nnav,\nsection {\n  display: block;\n}\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\nfigure {\n  margin: 1em 40px;\n}\nhr {\n  box-sizing: content-box;\n  height: 0;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace,monospace;\n  font-size: 1em;\n}\na {\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects;\n}\nabbr[title] {\n  border-bottom: none;\n  text-decoration: underline;\n  text-decoration: underline dotted;\n}\nb,\nstrong {\n  font-weight: bolder;\n}\ndfn {\n  font-style: italic;\n}\nmark {\n  background-color: #ff0;\n  color: #000;\n}\nsmall {\n  font-size: 80%;\n}\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n}\nsub {\n  bottom: -0.25em;\n}\nsup {\n  top: -0.5em;\n}\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\nimg {\n  border-style: none;\n}\nsvg:not(:root) {\n  overflow: hidden;\n}\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n}\nbutton,\nselect {\n  text-transform: none;\n}\n[type=reset],\n[type=submit],\nbutton,\nhtml [type=button] {\n  -webkit-appearance: button;\n}\n[type=button]::-moz-focus-inner,\n[type=reset]::-moz-focus-inner,\n[type=submit]::-moz-focus-inner,\nbutton::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n[type=button]:-moz-focusring,\n[type=reset]:-moz-focusring,\n[type=submit]:-moz-focusring,\nbutton:-moz-focusring {\n  outline: ButtonText dotted 1px;\n}\nlegend {\n  color: inherit;\n  display: table;\n  max-width: 100%;\n  white-space: normal;\n}\ntextarea {\n  overflow: auto;\n}\n[type=number]::-webkit-inner-spin-button,\n[type=number]::-webkit-outer-spin-button {\n  height: auto;\n}\n[type=search] {\n  -webkit-appearance: textfield;\n  outline-offset: -2px;\n}\n[type=search]::-webkit-search-cancel-button,\n[type=search]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  font: inherit;\n}\nsummary {\n  display: list-item;\n}\n[hidden],\ntemplate {\n  display: none;\n}\nbody {\n  padding: 0;\n  margin: 0;\n}\n* {\n  box-sizing: border-box;\n}\n.container {\n  display: flex;\n  flex-wrap: wrap;\n  flex-grow: 1;\n  flex-shrink: 1;\n  margin: -6px;\n}\n.parent-container {\n  margin: 12px;\n}\n.align-items-center {\n  align-items: center;\n}\n.align-items-flex-start {\n  align-items: flex-start;\n}\n.align-items-flex-end {\n  align-items: flex-end;\n}\n.align-items-baseline {\n  align-items: baseline;\n}\n.justify-content-flex-start {\n  justify-content: flex-start;\n}\n.justify-content-flex-end {\n  justify-content: flex-end;\n}\n.justify-content-center {\n  justify-content: center;\n}\ndiv[class*=\"col-xs-\"],\ndiv[class*=\"col-sm-\"],\ndiv[class*=\"col-md-\"],\ndiv[class*=\"col-lg-\"] {\n  padding: 6px;\n}\ndiv.col-xs-auto {\n  width: initial;\n}\ndiv.col-xs-1 {\n  width: 8.3333%;\n}\ndiv.col-xs-2 {\n  width: 16.6666%;\n}\ndiv.col-xs-3 {\n  width: 25%;\n}\ndiv.col-xs-4 {\n  width: 33.3333%;\n}\ndiv.col-xs-5 {\n  width: 41.6666%;\n}\ndiv.col-xs-6 {\n  width: 50%;\n}\ndiv.col-xs-7 {\n  width: 58.3333%;\n}\ndiv.col-xs-8 {\n  width: 66.6666%;\n}\ndiv.col-xs-9 {\n  width: 75%;\n}\ndiv.col-xs-10 {\n  width: 83.3333%;\n}\ndiv.col-xs-11 {\n  width: 91.6666%;\n}\ndiv.col-xs-12 {\n  width: 100%;\n}\ndiv.col-hide-xs {\n  display: none;\n}\ndiv.col-show-xs {\n  display: initial;\n}\n@media only all and (min-width: 768px) {\n  div.col-sm-auto {\n    width: initial;\n  }\n  div.col-sm-1 {\n    width: 8.3333%;\n  }\n  div.col-sm-2 {\n    width: 16.6666%;\n  }\n  div.col-sm-3 {\n    width: 25%;\n  }\n  div.col-sm-4 {\n    width: 33.3333%;\n  }\n  div.col-sm-5 {\n    width: 41.6666%;\n  }\n  div.col-sm-6 {\n    width: 50%;\n  }\n  div.col-sm-7 {\n    width: 58.3333%;\n  }\n  div.col-sm-8 {\n    width: 66.6666%;\n  }\n  div.col-sm-9 {\n    width: 75%;\n  }\n  div.col-sm-10 {\n    width: 83.3333%;\n  }\n  div.col-sm-11 {\n    width: 91.6666%;\n  }\n  div.col-sm-12 {\n    width: 100%;\n  }\n  div.col-hide-sm {\n    display: none;\n  }\n  div.col-show-sm {\n    display: initial;\n  }\n}\n@media only all and (min-width: 992px) {\n  div.col-md-auto {\n    width: initial;\n  }\n  div.col-md-1 {\n    width: 8.3333%;\n  }\n  div.col-md-2 {\n    width: 16.6666%;\n  }\n  div.col-md-3 {\n    width: 25%;\n  }\n  div.col-md-4 {\n    width: 33.3333%;\n  }\n  div.col-md-5 {\n    width: 41.6666%;\n  }\n  div.col-md-6 {\n    width: 50%;\n  }\n  div.col-md-7 {\n    width: 58.3333%;\n  }\n  div.col-md-8 {\n    width: 66.6666%;\n  }\n  div.col-md-9 {\n    width: 75%;\n  }\n  div.col-md-10 {\n    width: 83.3333%;\n  }\n  div.col-md-11 {\n    width: 91.6666%;\n  }\n  div.col-md-12 {\n    width: 100%;\n  }\n  div.col-hide-md {\n    display: none;\n  }\n  div.display-show-md {\n    display: initial;\n  }\n}\n@media only all and (min-width: 1200px) {\n  div.col-lg-auto {\n    width: initial;\n  }\n  div.col-lg-1 {\n    width: 8.3333%;\n  }\n  div.col-lg-2 {\n    width: 16.6666%;\n  }\n  div.col-lg-3 {\n    width: 25%;\n  }\n  div.col-lg-4 {\n    width: 33.3333%;\n  }\n  div.col-lg-5 {\n    width: 41.6666%;\n  }\n  div.col-lg-6 {\n    width: 50%;\n  }\n  div.col-lg-7 {\n    width: 58.3333%;\n  }\n  div.col-lg-8 {\n    width: 66.6666%;\n  }\n  div.col-lg-9 {\n    width: 75%;\n  }\n  div.col-lg-10 {\n    width: 83.3333%;\n  }\n  div.col-lg-11 {\n    width: 91.6666%;\n  }\n  div.col-lg-12 {\n    width: 100%;\n  }\n  div.col-hide-lg {\n    display: none;\n  }\n  div.col-show-lg {\n    display: initial;\n  }\n}\n", ""]);

// exports


/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(232), __webpack_require__(233), __webpack_require__(484), __webpack_require__(828), __webpack_require__(829), __webpack_require__(831), __webpack_require__(234), __webpack_require__(832), __webpack_require__(485), __webpack_require__(486), __webpack_require__(833), __webpack_require__(142), __webpack_require__(834), __webpack_require__(487), __webpack_require__(835), __webpack_require__(830)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, authorization_service_1, binding_service_1, data_source_service_1, deep_observer_service_1, error_service_1, globalization_service_1, localization_service_1, location_service_1, json_service_1, object_info_service_1, permission_service_1, rest_service_1, shortcut_service_1, style_service_1, window_service_1, file_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthorizationService = authorization_service_1.AuthorizationService;
    exports.BindingService = binding_service_1.BindingService;
    exports.DataSourceService = data_source_service_1.DataSourceService;
    exports.DeepObserverService = deep_observer_service_1.DeepObserverService;
    exports.ErrorService = error_service_1.ErrorService;
    exports.GlobalizationService = globalization_service_1.GlobalizationService;
    exports.LocalizationService = localization_service_1.LocalizationService;
    exports.LocationService = location_service_1.LocationService;
    exports.JsonService = json_service_1.JsonService;
    exports.ObjectInfoService = object_info_service_1.ObjectInfoService;
    exports.PermissionService = permission_service_1.PermissionService;
    exports.RestService = rest_service_1.RestService;
    exports.ShortcutService = shortcut_service_1.ShortcutService;
    exports.StyleService = style_service_1.StyleService;
    exports.WindowService = window_service_1.WindowService;
    exports.FileService = file_service_1.FileService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 530:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: \"Helvetica Neue\", \"Segoe UI\", Helvetica, Verdana, sans-serif;\n  font-size: 12px;\n}\n.t--editor-caption {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.t--cursor-pointer {\n  cursor: pointer;\n}\n.t--invisible-submit {\n  height: 0;\n  width: 0;\n  margin: 0;\n  padding: 0;\n  border: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ 531:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, ".dx-popup-wrapper:not(.dx-dialog) > .dx-popup-normal > .dx-popup-content {\n  padding: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ 532:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--view-content {\n  opacity: 0;\n  transform: translateX(10px);\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: all;\n}\n.t--view-content.t--view-content-attached {\n  opacity: 1;\n  transform: translateX(0);\n}\n", ""]);

// exports


/***/ }),

/***/ 533:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--toolbar-title {\n  font-size: 16px;\n  font-weight: 100;\n  color: black;\n  padding: 0 12px;\n}\n.t--toolbar-item {\n  display: flex;\n  align-items: center;\n  height: 32px;\n  padding: 0 12px;\n  text-decoration: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n}\n.t--toolbar-item i {\n  font-size: 16px;\n}\n.t--toolbar-item:hover {\n  color: white;\n  background-color: #808080;\n}\n.t--toolbar-item-content {\n  display: flex;\n  flex-direction: row;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar {\n  height: 32px;\n  background-color: #E5E5E5;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .dx-toolbar-items-container {\n  height: 32px;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-item {\n  height: 32px;\n  color: black;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-item:hover {\n  color: white;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-item .t--toolbar-item-content {\n  flex-direction: row;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-title {\n  display: flex;\n  align-items: center;\n  height: 32px;\n  font-size: 14px;\n  font-weight: normal;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .dx-state-disabled .t--toolbar-item {\n  color: gray;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .dx-state-disabled .t--toolbar-item:hover {\n  color: gray;\n}\n.t--toolbar.dx-popup-normal > .dx-popup-content > dx-template,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal.dx-popup-normal > .dx-popup-content > dx-template {\n  display: block;\n  height: 1px;\n  min-height: calc(100% - 24px);\n}\n.t--toolbar.dx-popup-normal > .dx-popup-content > dx-template > .parent-container,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal.dx-popup-normal > .dx-popup-content > dx-template > .parent-container {\n  height: 1px;\n  min-height: 100%;\n}\n.t--toolbar.dx-popup-normal .dx-toolbar,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal.dx-popup-normal .dx-toolbar {\n  margin: 12px;\n  width: calc(100% - 12px * 2);\n  box-sizing: content-box;\n}\n.t--toolbar .dx-toolbar,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal .dx-toolbar {\n  padding: 0;\n  height: 60px;\n  background-color: #808080;\n  color: white;\n}\n.t--toolbar .dx-toolbar .dx-toolbar-items-container,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal .dx-toolbar .dx-toolbar-items-container {\n  height: 60px;\n}\n.t--toolbar .dx-state-disabled .t--toolbar-item,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal .dx-state-disabled .t--toolbar-item {\n  cursor: default;\n  color: lightgray;\n}\n.t--toolbar .dx-state-disabled .t--toolbar-item:hover,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal .dx-state-disabled .t--toolbar-item:hover {\n  background-color: inherit;\n}\n.t--toolbar .t--toolbar-title,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal .t--toolbar-title {\n  font-size: 26px;\n  color: white;\n}\n.t--toolbar .t--toolbar-item,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal .t--toolbar-item {\n  height: 60px;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  color: white;\n}\n.t--toolbar .t--toolbar-item:hover,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal .t--toolbar-item:hover {\n  background-color: #4F4F4F;\n}\n.t--toolbar .t--toolbar-item-content,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search):not(.dx-tagbox-popup-wrapper):not(.dx-popover-wrapper) > .dx-popup-normal .t--toolbar-item-content {\n  flex-direction: column;\n}\n", ""]);

// exports


/***/ }),

/***/ 534:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--form-element-flex-box {\n  display: flex;\n}\n.t--form-element-image-inline {\n  background-size: contain;\n  background-position: center center;\n  background-repeat: no-repeat;\n}\n.t--form-element-image {\n  max-width: 100%;\n}\n.t--form-validation-group {\n  height: 1px;\n  min-height: 100%;\n}\n.t--form-container {\n  height: 1px;\n  min-height: 100%;\n  align-content: flex-start;\n}\n.t--form-container .t--form-container {\n  height: auto;\n  min-height: auto;\n}\n.t--form-relative-container {\n  position: relative;\n  height: 100%;\n}\n.t--form-absolute-container {\n  position: absolute;\n  height: calc(100% - 12px);\n  width: calc(100% - 12px);\n}\n", ""]);

// exports


/***/ }),

/***/ 535:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "/*!\n* DevExtreme\n* Version: 16.2.6\n* Build date: Mar 28, 2017\n*\n* Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED\n* EULA: https://www.devexpress.com/Support/EULAs/DevExtreme.xml\n*/\r\n.dx-clearfix:before,\n.dx-clearfix:after {\n  display: table;\n  content: \"\";\n  line-height: 0;\n}\n.dx-clearfix:after {\n  clear: both;\n}\n.dx-translate-disabled {\n  -webkit-transform: none !important;\n  -moz-transform: none !important;\n  -ms-transform: none !important;\n  -o-transform: none !important;\n  transform: none !important;\n}\n.dx-hidden-input {\n  position: fixed;\n  top: -10px;\n  left: -10px;\n  width: 0;\n  height: 0;\n}\n.dx-user-select {\n  -webkit-user-select: text;\n  -khtml-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n  -o-user-select: text;\n  user-select: text;\n}\n.dx-state-invisible {\n  display: none !important;\n}\n.dx-gesture-cover {\n  -webkit-transform: translate3d(0,0,0);\n  -moz-transform: translate3d(0,0,0);\n  -ms-transform: translate3d(0,0,0);\n  -o-transform: translate3d(0,0,0);\n  transform: translate3d(0,0,0);\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  opacity: 0;\n  z-index: 2147483647;\n}\n.dx-animating {\n  pointer-events: none;\n}\n.dx-fade-animation.dx-enter,\n.dx-no-direction.dx-enter,\n.dx-fade-animation.dx-leave.dx-leave-active,\n.dx-no-direction.dx-leave.dx-leave-active {\n  opacity: 0;\n}\n.dx-fade-animation.dx-leave,\n.dx-no-direction.dx-leave,\n.dx-fade-animation.dx-enter.dx-enter-active,\n.dx-no-direction.dx-enter.dx-enter-active {\n  opacity: 1;\n}\n.dx-overflow-animation.dx-enter.dx-forward {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -moz-transform: translate3d(100%, 0, 0);\n  -ms-transform: translate3d(100%, 0, 0);\n  -o-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n  z-index: 2;\n}\n.dx-overflow-animation.dx-enter.dx-enter-active.dx-forward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 2;\n}\n.dx-overflow-animation.dx-enter.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 1;\n}\n.dx-overflow-animation.dx-enter.dx-enter-active.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 1;\n}\n.dx-overflow-animation.dx-leave.dx-forward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 1;\n}\n.dx-overflow-animation.dx-leave.dx-leave-active.dx-forward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 1;\n}\n.dx-overflow-animation.dx-leave.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 2;\n}\n.dx-overflow-animation.dx-leave.dx-leave-active.dx-backward {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -moz-transform: translate3d(100%, 0, 0);\n  -ms-transform: translate3d(100%, 0, 0);\n  -o-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n  z-index: 2;\n}\n.dx-slide-animation.dx-enter.dx-forward {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -moz-transform: translate3d(100%, 0, 0);\n  -ms-transform: translate3d(100%, 0, 0);\n  -o-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n}\n.dx-slide-animation.dx-enter.dx-enter-active.dx-forward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.dx-slide-animation.dx-enter.dx-backward {\n  -webkit-transform: translate3d(-100%, 0, 0);\n  -moz-transform: translate3d(-100%, 0, 0);\n  -ms-transform: translate3d(-100%, 0, 0);\n  -o-transform: translate3d(-100%, 0, 0);\n  transform: translate3d(-100%, 0, 0);\n}\n.dx-slide-animation.dx-enter.dx-enter-active.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.dx-slide-animation.dx-leave.dx-forward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.dx-slide-animation.dx-leave.dx-leave-active.dx-forward {\n  -webkit-transform: translate3d(-100%, 0, 0);\n  -moz-transform: translate3d(-100%, 0, 0);\n  -ms-transform: translate3d(-100%, 0, 0);\n  -o-transform: translate3d(-100%, 0, 0);\n  transform: translate3d(-100%, 0, 0);\n}\n.dx-slide-animation.dx-leave.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.dx-slide-animation.dx-leave.dx-leave-active.dx-backward {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -moz-transform: translate3d(100%, 0, 0);\n  -ms-transform: translate3d(100%, 0, 0);\n  -o-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n}\n.dx-opendoor-animation.dx-enter.dx-forward {\n  -moz-transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  -ms-transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  -o-transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  -webkit-transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  -moz-transform-origin: center left 0px;\n  -ms-transform-origin: center left 0px;\n  -o-transform-origin: center left 0px;\n  -webkit-transform-origin: center left 0px;\n  transform-origin: center left 0px;\n  opacity: 0;\n}\n.dx-opendoor-animation.dx-enter.dx-enter-active.dx-forward {\n  -moz-transform: none;\n  -ms-transform: none;\n  -o-transform: none;\n  -webkit-transform: none;\n  transform: none;\n  opacity: 1;\n}\n.dx-opendoor-animation.dx-enter.dx-enter-active.dx-backward {\n  -moz-transform: none;\n  -ms-transform: none;\n  -o-transform: none;\n  -webkit-transform: none;\n  transform: none;\n  opacity: 1;\n}\n.dx-opendoor-animation.dx-leave.dx-forward {\n  -moz-transform: none;\n  -ms-transform: none;\n  -o-transform: none;\n  -webkit-transform: none;\n  transform: none;\n  -moz-transform-origin: center left 0px;\n  -ms-transform-origin: center left 0px;\n  -o-transform-origin: center left 0px;\n  -webkit-transform-origin: center left 0px;\n  transform-origin: center left 0px;\n  opacity: 1;\n}\n.dx-opendoor-animation.dx-leave.dx-backward {\n  -moz-transform: none;\n  -ms-transform: none;\n  -o-transform: none;\n  -webkit-transform: none;\n  transform: none;\n  -moz-transform-origin: center left 0px;\n  -ms-transform-origin: center left 0px;\n  -o-transform-origin: center left 0px;\n  -webkit-transform-origin: center left 0px;\n  transform-origin: center left 0px;\n  opacity: 1;\n}\n.dx-opendoor-animation.dx-leave.dx-leave-active.dx-forward {\n  -moz-transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  -ms-transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  -o-transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  -webkit-transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  -moz-transform-origin: center left 0px;\n  -ms-transform-origin: center left 0px;\n  -o-transform-origin: center left 0px;\n  -webkit-transform-origin: center left 0px;\n  transform-origin: center left 0px;\n  opacity: 0;\n}\n.dx-opendoor-animation.dx-enter.dx-backward {\n  -moz-transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  -ms-transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  -o-transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  -webkit-transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  transform: matrix3d(0.5, 0, 0.87, -0.001, 0, 1, 0, 0, -0.87, 0, 0.5, 0, 0, 0, 0, 1);\n  -moz-transform-origin: center left 0px;\n  -ms-transform-origin: center left 0px;\n  -o-transform-origin: center left 0px;\n  -webkit-transform-origin: center left 0px;\n  transform-origin: center left 0px;\n  opacity: 0;\n}\n.dx-opendoor-animation.dx-leave.dx-leave-active.dx-backward {\n  -moz-transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  -ms-transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  -o-transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  -webkit-transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  transform: matrix3d(0.71, 0, 0.71, 0.001, 0, 1, 0, 0, -0.71, 0, 0.71, 0, 0, 0, 0, 1);\n  opacity: 0;\n}\n.dx-win-pop-animation.dx-enter.dx-forward {\n  -webkit-transform: scale(0.5);\n  -moz-transform: scale(0.5);\n  -ms-transform: scale(0.5);\n  -o-transform: scale(0.5);\n  transform: scale(0.5);\n  opacity: 0;\n}\n.dx-win-pop-animation.dx-enter.dx-enter-active.dx-forward {\n  -webkit-transform: scale(1);\n  -moz-transform: scale(1);\n  -ms-transform: scale(1);\n  -o-transform: scale(1);\n  transform: scale(1);\n  opacity: 1;\n}\n.dx-win-pop-animation.dx-leave.dx-leave-active.dx-forward {\n  -webkit-transform: scale(1.5);\n  -moz-transform: scale(1.5);\n  -ms-transform: scale(1.5);\n  -o-transform: scale(1.5);\n  transform: scale(1.5);\n  opacity: 0;\n}\n.dx-win-pop-animation.dx-enter.dx-backward {\n  -webkit-transform: scale(1.5);\n  -moz-transform: scale(1.5);\n  -ms-transform: scale(1.5);\n  -o-transform: scale(1.5);\n  transform: scale(1.5);\n  opacity: 0;\n}\n.dx-win-pop-animation.dx-enter.dx-enter-active.dx-backward {\n  -webkit-transform: scale(1);\n  -moz-transform: scale(1);\n  -ms-transform: scale(1);\n  -o-transform: scale(1);\n  transform: scale(1);\n  opacity: 1;\n}\n.dx-win-pop-animation.dx-leave.dx-leave-active.dx-backward {\n  -webkit-transform: scale(0.5);\n  -moz-transform: scale(0.5);\n  -ms-transform: scale(0.5);\n  -o-transform: scale(0.5);\n  transform: scale(0.5);\n  opacity: 0;\n}\n.dx-android-pop-animation.dx-enter.dx-forward,\n.dx-android-pop-animation.dx-leave.dx-leave-active.dx-backward {\n  -webkit-transform: translate3d(0, 150px, 0);\n  -moz-transform: translate3d(0, 150px, 0);\n  -ms-transform: translate3d(0, 150px, 0);\n  -o-transform: translate3d(0, 150px, 0);\n  transform: translate3d(0, 150px, 0);\n  opacity: 0;\n}\n.dx-android-pop-animation.dx-enter.dx-enter-active.dx-forward,\n.dx-android-pop-animation.dx-leave.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n}\n.dx-android-pop-animation.dx-enter.dx-forward,\n.dx-android-pop-animation.dx-leave.dx-backward {\n  z-index: 1;\n}\n.dx-ios7-slide-animation.dx-enter.dx-forward {\n  z-index: 2;\n  -webkit-transform: translate3d(100%, 0, 0);\n  -moz-transform: translate3d(100%, 0, 0);\n  -ms-transform: translate3d(100%, 0, 0);\n  -o-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n}\n.dx-ios7-slide-animation.dx-enter.dx-enter-active.dx-forward {\n  z-index: 2;\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.dx-ios7-slide-animation.dx-enter.dx-backward {\n  -webkit-transform: translate3d(-20%, 0, 0);\n  -moz-transform: translate3d(-20%, 0, 0);\n  -ms-transform: translate3d(-20%, 0, 0);\n  -o-transform: translate3d(-20%, 0, 0);\n  transform: translate3d(-20%, 0, 0);\n  z-index: 1;\n}\n.dx-ios7-slide-animation.dx-enter.dx-enter-active.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 1;\n}\n.dx-ios7-slide-animation.dx-leave.dx-forward {\n  z-index: 1;\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.dx-ios7-slide-animation.dx-leave.dx-leave-active.dx-forward {\n  -webkit-transform: translate3d(-20%, 0, 0);\n  -moz-transform: translate3d(-20%, 0, 0);\n  -ms-transform: translate3d(-20%, 0, 0);\n  -o-transform: translate3d(-20%, 0, 0);\n  transform: translate3d(-20%, 0, 0);\n  z-index: 1;\n}\n.dx-ios7-slide-animation.dx-leave.dx-backward {\n  z-index: 2;\n}\n.dx-ios7-slide-animation.dx-leave.dx-leave-active.dx-backward {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -moz-transform: translate3d(100%, 0, 0);\n  -ms-transform: translate3d(100%, 0, 0);\n  -o-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n  z-index: 2;\n}\n.dx-ios7-toolbar-animation.dx-enter.dx-forward {\n  -webkit-transform: translate3d(40%, 0, 0);\n  -moz-transform: translate3d(40%, 0, 0);\n  -ms-transform: translate3d(40%, 0, 0);\n  -o-transform: translate3d(40%, 0, 0);\n  transform: translate3d(40%, 0, 0);\n  opacity: 0;\n  z-index: 2;\n}\n.dx-ios7-toolbar-animation.dx-enter.dx-enter-active.dx-forward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n  z-index: 2;\n}\n.dx-ios7-toolbar-animation.dx-enter.dx-backward {\n  -webkit-transform: translate3d(-40%, 0, 0);\n  -moz-transform: translate3d(-40%, 0, 0);\n  -ms-transform: translate3d(-40%, 0, 0);\n  -o-transform: translate3d(-40%, 0, 0);\n  transform: translate3d(-40%, 0, 0);\n  opacity: 0;\n  z-index: 1;\n}\n.dx-ios7-toolbar-animation.dx-enter.dx-enter-active.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n  z-index: 1;\n}\n.dx-ios7-toolbar-animation.dx-leave.dx-forward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n  z-index: 1;\n}\n.dx-ios7-toolbar-animation.dx-leave.dx-leave-active.dx-forward {\n  -webkit-transform: translate3d(-40%, 0, 0);\n  -moz-transform: translate3d(-40%, 0, 0);\n  -ms-transform: translate3d(-40%, 0, 0);\n  -o-transform: translate3d(-40%, 0, 0);\n  transform: translate3d(-40%, 0, 0);\n  opacity: 0;\n  z-index: 1;\n}\n.dx-ios7-toolbar-animation.dx-leave.dx-backward {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n  z-index: 2;\n}\n.dx-ios7-toolbar-animation.dx-leave.dx-leave-active.dx-backward {\n  -webkit-transform: translate3d(40%, 0, 0);\n  -moz-transform: translate3d(40%, 0, 0);\n  -ms-transform: translate3d(40%, 0, 0);\n  -o-transform: translate3d(40%, 0, 0);\n  transform: translate3d(40%, 0, 0);\n  opacity: 0;\n  z-index: 2;\n}\n.dx-drop-animation.dx-enter,\n.dx-drop-animation.dx-leave.dx-leave-active {\n  -moz-transform: translate3d(0, -120%, 0);\n  -ms-transform: translate3d(0, -120%, 0);\n  -o-transform: translate3d(0, -120%, 0);\n  -webkit-transform: translate3d(0, -120%, 0);\n  transform: translate3d(0, -120%, 0);\n}\n.dx-drop-animation.dx-leave,\n.dx-drop-animation.dx-enter.dx-enter-active {\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.dx-3d-drop-animation.dx-enter,\n.dx-3d-drop-animation.dx-leave.dx-leave-active {\n  -moz-transform: rotate3d(1, 0, 0, 10deg) translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  -ms-transform: rotate3d(1, 0, 0, 10deg) translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  -o-transform: rotate3d(1, 0, 0, 10deg) translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  -webkit-transform: rotate3d(1, 0, 0, 10deg) translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  transform: rotate3d(1, 0, 0, 10deg) translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  opacity: 0;\n}\n.dx-3d-drop-animation.dx-leave,\n.dx-3d-drop-animation.dx-enter.dx-enter-active {\n  -moz-transform: rotate3d(1, 0, 0, 0) translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -ms-transform: rotate3d(1, 0, 0, 0) translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -o-transform: rotate3d(1, 0, 0, 0) translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -webkit-transform: rotate3d(1, 0, 0, 0) translate3d(0, 0, 0) scale3d(1, 1, 1);\n  transform: rotate3d(1, 0, 0, 0) translate3d(0, 0, 0) scale3d(1, 1, 1);\n  opacity: 1;\n}\n.dx-fade-drop-animation.dx-enter,\n.dx-fade-drop-animation.dx-leave.dx-leave-active {\n  -moz-transform: translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  -ms-transform: translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  -o-transform: translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  -webkit-transform: translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  transform: translate3d(0, -10px, 0) scale3d(1.1, 1.1, 1.1);\n  opacity: 0;\n}\n.dx-fade-drop-animation.dx-leave,\n.dx-fade-drop-animation.dx-enter.dx-enter-active {\n  -moz-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -ms-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -o-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -webkit-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  opacity: 1;\n}\n.dx-fade-rise-animation.dx-enter,\n.dx-fade-rise-animation.dx-leave.dx-leave-active {\n  -moz-transform: translate3d(0, 10px, 0) scale3d(1.1, 1.1, 1.1);\n  -ms-transform: translate3d(0, 10px, 0) scale3d(1.1, 1.1, 1.1);\n  -o-transform: translate3d(0, 10px, 0) scale3d(1.1, 1.1, 1.1);\n  -webkit-transform: translate3d(0, 10px, 0) scale3d(1.1, 1.1, 1.1);\n  transform: translate3d(0, 10px, 0) scale3d(1.1, 1.1, 1.1);\n  opacity: 0;\n}\n.dx-fade-rise-animation.dx-leave,\n.dx-fade-rise-animation.dx-enter.dx-enter-active {\n  -moz-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -ms-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -o-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  -webkit-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n  opacity: 1;\n}\n.dx-fade-slide-animation.dx-enter,\n.dx-fade-slide-animation.dx-leave.dx-leave-active {\n  -moz-transform: translate3d(40%, 0, 0);\n  -ms-transform: translate3d(40%, 0, 0);\n  -o-transform: translate3d(40%, 0, 0);\n  -webkit-transform: translate3d(40%, 0, 0);\n  transform: translate3d(40%, 0, 0);\n  opacity: 0;\n}\n.dx-fade-slide-animation.dx-leave,\n.dx-fade-slide-animation.dx-enter.dx-enter-active {\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n}\n.dx-fade-zoom-animation.dx-enter,\n.dx-fade-zoom-animation.dx-leave.dx-leave-active {\n  -moz-transform: scale3d(0.3, 0.3, 0.3);\n  -ms-transform: scale3d(0.3, 0.3, 0.3);\n  -o-transform: scale3d(0.3, 0.3, 0.3);\n  -webkit-transform: scale3d(0.3, 0.3, 0.3);\n  transform: scale3d(0.3, 0.3, 0.3);\n  opacity: 0;\n}\n.dx-fade-zoom-animation.dx-leave,\n.dx-fade-zoom-animation.dx-enter.dx-enter-active {\n  -moz-transform: scale3d(1, 1, 1);\n  -ms-transform: scale3d(1, 1, 1);\n  -o-transform: scale3d(1, 1, 1);\n  -webkit-transform: scale3d(1, 1, 1);\n  transform: scale3d(1, 1, 1);\n  opacity: 1;\n}\n.dx-icon-plus,\n.dx-icon-overflow,\n.dx-icon-add,\n.dx-icon-airplane,\n.dx-icon-arrowleft,\n.dx-icon-arrowdown,\n.dx-icon-arrowright,\n.dx-icon-arrowup,\n.dx-icon-bookmark,\n.dx-icon-box,\n.dx-icon-car,\n.dx-icon-card,\n.dx-icon-cart,\n.dx-icon-chart,\n.dx-icon-clock,\n.dx-icon-close,\n.dx-icon-comment,\n.dx-icon-doc,\n.dx-icon-download,\n.dx-icon-edit,\n.dx-icon-email,\n.dx-icon-event,\n.dx-icon-favorites,\n.dx-icon-find,\n.dx-icon-folder,\n.dx-icon-food,\n.dx-icon-gift,\n.dx-icon-globe,\n.dx-icon-group,\n.dx-icon-help,\n.dx-icon-home,\n.dx-icon-image,\n.dx-icon-info,\n.dx-icon-key,\n.dx-icon-like,\n.dx-icon-map,\n.dx-icon-menu,\n.dx-icon-money,\n.dx-icon-music,\n.dx-icon-percent,\n.dx-icon-photo,\n.dx-icon-preferences,\n.dx-icon-product,\n.dx-icon-refresh,\n.dx-icon-remove,\n.dx-icon-runner,\n.dx-icon-tags,\n.dx-icon-tel,\n.dx-icon-tips,\n.dx-icon-todo,\n.dx-icon-toolbox,\n.dx-icon-user,\n.dx-icon-save,\n.dx-icon-clear,\n.dx-icon-search {\n  background-position: 0 0;\n  background-repeat: no-repeat;\n}\n.dx-icon {\n  background-position: 50% 50%;\n}\n.dx-color-scheme {\n  font-family: \"#\";\n}\n.dx-widget {\n  display: block;\n  -ms-content-zooming: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  -webkit-text-size-adjust: none;\n  -webkit-touch-callout: none;\n  padding: 0;\n  outline: 0;\n}\n.dx-widget,\n.dx-widget:before,\n.dx-widget:after,\n.dx-widget *,\n.dx-widget *:before,\n.dx-widget *:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.dx-item {\n  outline: 0;\n}\n.dx-widget.dx-collection.dx-state-focused {\n  -webkit-box-shadow: none;\n  -moz-box-shadow: none;\n  box-shadow: none;\n}\n.dx-rtl {\n  direction: rtl;\n  unicode-bidi: embed;\n}\n.dx-state-disabled {\n  pointer-events: none;\n}\n.dx-badge {\n  padding: 0px 5px;\n  -webkit-border-radius: 14px;\n  -moz-border-radius: 14px;\n  -ms-border-radius: 14px;\n  -o-border-radius: 14px;\n  border-radius: 14px;\n  color: white;\n  font-size: 13px;\n  line-height: 1;\n}\n.dx-draggable {\n  left: 0;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-draggable.dx-state-disabled,\n.dx-state-disabled .dx-draggable {\n  cursor: default;\n}\n.dx-resizable {\n  display: block;\n  position: relative;\n}\n.dx-resizable-handle {\n  position: absolute;\n  z-index: 50;\n}\n.dx-state-disabled .dx-resizable-handle {\n  cursor: default;\n}\n.dx-resizable-handle-left,\n.dx-resizable-handle-right {\n  top: 0px;\n  height: 100%;\n  width: 3px;\n}\n.dx-resizable-handle-left {\n  left: 0px;\n  cursor: e-resize;\n}\n.dx-resizable-handle-right {\n  right: 0px;\n  cursor: e-resize;\n}\n.dx-resizable-handle-top,\n.dx-resizable-handle-bottom {\n  left: 0px;\n  width: 100%;\n  height: 3px;\n}\n.dx-resizable-handle-top {\n  top: 0px;\n  cursor: s-resize;\n}\n.dx-resizable-handle-bottom {\n  bottom: 0px;\n  cursor: s-resize;\n}\n.dx-resizable-handle-corner-bottom-left,\n.dx-resizable-handle-corner-top-left,\n.dx-resizable-handle-corner-top-right {\n  width: 6px;\n  height: 6px;\n}\n.dx-resizable-handle-corner-top-left {\n  left: 0px;\n  top: 0px;\n  cursor: se-resize;\n  -webkit-border-bottom-right-radius: 100%;\n  -moz-border-bottom-right-radius: 100%;\n  border-bottom-right-radius: 100%;\n}\n.dx-resizable-handle-corner-top-right {\n  right: 0px;\n  top: 0px;\n  cursor: ne-resize;\n  -webkit-border-bottom-left-radius: 100%;\n  -moz-border-bottom-left-radius: 100%;\n  border-bottom-left-radius: 100%;\n}\n:not(.dx-rtl) > .dx-resizable-handle-corner-bottom-right {\n  width: 20px;\n  height: 20px;\n  right: 0px;\n  bottom: 0px;\n  cursor: se-resize;\n  -webkit-border-top-left-radius: 100%;\n  -moz-border-top-left-radius: 100%;\n  border-top-left-radius: 100%;\n  background-position: 20px 20px;\n}\n:not(.dx-rtl) > .dx-resizable-handle-corner-bottom-left {\n  left: 0px;\n  bottom: 0px;\n  cursor: ne-resize;\n  -webkit-border-top-right-radius: 100%;\n  -moz-border-top-right-radius: 100%;\n  border-top-right-radius: 100%;\n}\n.dx-rtl .dx-resizable-handle-corner-bottom-left {\n  -webkit-transform: rotate(90deg);\n  -moz-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  -o-transform: rotate(90deg);\n  transform: rotate(90deg);\n  width: 20px;\n  height: 20px;\n  left: 0px;\n  bottom: 0px;\n  cursor: ne-resize;\n  -webkit-border-top-left-radius: 100%;\n  -moz-border-top-left-radius: 100%;\n  border-top-left-radius: 100%;\n  background-position: 20px 20px;\n}\n.dx-rtl .dx-resizable-handle-corner-bottom-right {\n  right: 0px;\n  bottom: 0px;\n  cursor: se-resize;\n  -webkit-border-top-left-radius: 100%;\n  -moz-border-top-left-radius: 100%;\n  border-top-left-radius: 100%;\n}\n.dx-box-item-content {\n  font-size: 14px;\n}\n.dx-box-fallback-item > .dx-box-item-content {\n  width: 100%;\n  height: 100%;\n}\n.dx-box-item-content {\n  -webkit-flex-direction: column;\n  flex-direction: column;\n}\n.dx-box-flex .dx-box-item > .dx-scrollable,\n.dx-box-flex .dx-box-item-content > .dx-scrollable,\n.dx-box-flex .dx-box-item > .dx-treeview,\n.dx-box-flex .dx-box-item-content > .dx-treeview,\n.dx-box-flex .dx-box-item > .dx-treeview > .dx-scrollable,\n.dx-box-flex .dx-box-item-content > .dx-treeview > .dx-scrollable {\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex-grow: 1;\n  flex-grow: 1;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n  height: auto;\n}\n.dx-box-flex .dx-box-item > .dx-scrollable .dx-scrollable-wrapper,\n.dx-box-flex .dx-box-item-content > .dx-scrollable .dx-scrollable-wrapper,\n.dx-box-flex .dx-box-item > .dx-treeview .dx-scrollable-wrapper,\n.dx-box-flex .dx-box-item-content > .dx-treeview .dx-scrollable-wrapper,\n.dx-box-flex .dx-box-item > .dx-treeview > .dx-scrollable .dx-scrollable-wrapper,\n.dx-box-flex .dx-box-item-content > .dx-treeview > .dx-scrollable .dx-scrollable-wrapper {\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n  height: auto;\n}\n.dx-box-flex .dx-box-item > .dx-scrollable .dx-scrollable-container,\n.dx-box-flex .dx-box-item-content > .dx-scrollable .dx-scrollable-container,\n.dx-box-flex .dx-box-item > .dx-treeview .dx-scrollable-container,\n.dx-box-flex .dx-box-item-content > .dx-treeview .dx-scrollable-container,\n.dx-box-flex .dx-box-item > .dx-treeview > .dx-scrollable .dx-scrollable-container,\n.dx-box-flex .dx-box-item-content > .dx-treeview > .dx-scrollable .dx-scrollable-container {\n  height: auto;\n}\n.dx-button-disabled {\n  cursor: default;\n}\n.dx-button {\n  display: inline-block;\n  cursor: pointer;\n  text-align: center;\n  vertical-align: middle;\n  max-width: 100%;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-button .dx-icon {\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n  display: inline-block;\n  vertical-align: middle;\n}\n.dx-button-content {\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  height: 100%;\n  max-height: 100%;\n}\n.dx-button-content:after {\n  display: inline-block;\n  height: 100%;\n  content: '';\n  vertical-align: middle;\n  font-size: 0;\n}\n.dx-button-link {\n  text-decoration: none;\n}\n.dx-button-text {\n  display: inline;\n  vertical-align: middle;\n}\n.dx-button-submit-input {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  height: 0;\n  width: 0;\n  font-size: 0;\n  opacity: 0;\n}\n.dx-state-disabled.dx-button,\n.dx-state-disabled .dx-button {\n  cursor: default;\n}\n.dx-scrollable-scrollbar-simulated {\n  position: relative;\n}\n.dx-scrollable {\n  display: block;\n  height: 100%;\n  min-height: 0;\n}\n.dx-scrollable-native {\n  -ms-overflow-style: -ms-autohiding-scrollbar;\n  -ms-scroll-snap-type: proximity;\n}\n.dx-scrollable-native .dx-scrollable-scrollbar {\n  display: none;\n}\n.dx-scrollable-native.dx-scrollable-scrollbar-simulated .dx-scrollable-scrollbar {\n  display: block;\n}\n.dx-scrollable-native .dx-scrollable-container {\n  -webkit-overflow-scrolling: touch;\n  position: relative;\n  height: 100%;\n}\n.dx-scrollable-native.dx-scrollable-vertical,\n.dx-scrollable-native.dx-scrollable-vertical .dx-scrollable-container {\n  -ms-touch-action: pan-y;\n  touch-action: pan-y;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.dx-scrollable-native.dx-scrollable-horizontal,\n.dx-scrollable-native.dx-scrollable-horizontal .dx-scrollable-container {\n  -ms-touch-action: pan-x;\n  touch-action: pan-x;\n  float: none;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n.dx-scrollable-native.dx-scrollable-both,\n.dx-scrollable-native.dx-scrollable-both .dx-scrollable-container {\n  -ms-touch-action: pan-y pan-x;\n  touch-action: pan-y pan-x;\n  float: none;\n  overflow-x: auto;\n  overflow-y: auto;\n}\n.dx-scrollable-native.dx-scrollable-disabled,\n.dx-scrollable-native.dx-scrollable-disabled .dx-scrollable-container {\n  -ms-touch-action: auto;\n  touch-action: auto;\n}\n.dx-scrollable-native.dx-scrollable-scrollbars-hidden ::-webkit-scrollbar {\n  opacity: 0;\n}\n.dx-scrollable-native.dx-scrollable-native-ios .dx-scrollable-content {\n  min-height: 101%;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-scrollable-native.dx-scrollable-native-ios.dx-scrollable-horizontal .dx-scrollable-content {\n  min-height: 0;\n  padding: 0;\n}\n.dx-scrollable-native.dx-scrollable-native-generic {\n  -ms-overflow-style: auto;\n  overflow: hidden;\n}\n.dx-scrollable-native.dx-scrollable-native-generic .dx-scrollable-content {\n  height: auto;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollable-content {\n  -webkit-transform: none;\n  -moz-transform: none;\n  -ms-transform: none;\n  -o-transform: none;\n  transform: none;\n  z-index: 0;\n}\n.dx-scrollable-scrollbar-simulated ::-webkit-scrollbar,\n.dx-scrollable-scrollbar-simulated .dx-scrollable-container ::-webkit-scrollbar {\n  display: none;\n}\n.dx-scrollable-container {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n}\n.dx-scrollable-container:focus {\n  outline: none;\n}\n.dx-scrollable-wrapper {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dx-scrollable-content {\n  position: relative;\n  min-height: 100%;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.dx-scrollable-content:before,\n.dx-scrollable-content:after {\n  display: table;\n  content: \"\";\n  line-height: 0;\n}\n.dx-scrollable-content:after {\n  clear: both;\n}\n.dx-scrollable-horizontal .dx-scrollable-content,\n.dx-scrollable-both .dx-scrollable-content {\n  display: block;\n  float: left;\n  min-width: 100%;\n}\n.dx-scrollable-scrollbar {\n  position: absolute;\n  pointer-events: auto;\n}\n.dx-scrollbar-vertical {\n  top: 0;\n  right: 0;\n  height: 100%;\n}\n.dx-scrollbar-vertical .dx-scrollable-scroll {\n  width: 5px;\n}\n.dx-scrollbar-horizontal {\n  bottom: 0;\n  left: 0;\n  width: 100%;\n}\n.dx-scrollbar-horizontal .dx-scrollable-scroll {\n  height: 5px;\n}\n.dx-scrollable-scroll {\n  position: relative;\n  background-color: #888;\n  background-color: rgba(0, 0, 0, 0.5);\n  -webkit-transform: translate(0px, 0px);\n  -webkit-transition: background-color 0s linear;\n  -moz-transition: background-color 0s linear;\n  -o-transition: background-color 0s linear;\n  transition: background-color 0s linear;\n}\n.dx-scrollable-scroll.dx-state-invisible {\n  display: block !important;\n  background-color: transparent;\n  background-color: rgba(0, 0, 0, 0);\n  -webkit-transition: background-color .5s linear 1s;\n  -moz-transition: background-color .5s linear 1s;\n  -o-transition: background-color .5s linear 1s;\n  transition: background-color .5s linear 1s;\n}\n.dx-rtl .dx-scrollable,\n.dx-rtl.dx-scrollable {\n  direction: ltr;\n}\n.dx-rtl .dx-scrollable .dx-scrollable-content,\n.dx-rtl.dx-scrollable .dx-scrollable-content,\n.dx-rtl .dx-scrollable .dx-scrollable-container,\n.dx-rtl.dx-scrollable .dx-scrollable-container {\n  direction: ltr;\n}\n.dx-rtl .dx-scrollable .dx-scrollable-content > *,\n.dx-rtl.dx-scrollable .dx-scrollable-content > * {\n  direction: rtl;\n}\n.dx-rtl .dx-scrollable .dx-scrollable-scrollbar.dx-scrollbar-vertical,\n.dx-rtl.dx-scrollable .dx-scrollable-scrollbar.dx-scrollbar-vertical {\n  right: auto;\n  left: 0;\n}\n.dx-rtl .dx-scrollable .dx-scrollable-scrollbar.dx-scrollbar-horizontal,\n.dx-rtl.dx-scrollable .dx-scrollable-scrollbar.dx-scrollbar-horizontal {\n  direction: ltr;\n}\n.dx-device-ios-6 .dx-scrollable-content {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n.dx-device-android .dx-scrollable-native.dx-scrollable-scrollbars-hidden ::-webkit-scrollbar {\n  display: none;\n}\n.dx-scrollable-native.dx-scrollable-native-generic .dx-scrollview-top-pocket {\n  position: absolute;\n  display: none;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-top-pocket {\n  width: 40px;\n  height: 40px;\n  left: 50%;\n  position: absolute;\n  z-index: 1;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down {\n  background-image: none;\n  position: static;\n  height: 100%;\n  width: 100%;\n  left: -50%;\n  margin-left: -20px;\n  padding: 0;\n  -webkit-border-radius: 50%;\n  -moz-border-radius: 50%;\n  -ms-border-radius: 50%;\n  -o-border-radius: 50%;\n  border-radius: 50%;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down.dx-scrollview-pull-down-loading {\n  -webkit-transition: -webkit-transform 100ms linear;\n  -moz-transition: -moz-transform 100ms linear;\n  -o-transition: -o-transform 100ms linear;\n  transition: transform 100ms linear;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down .dx-scrollview-pull-down-indicator {\n  position: relative;\n  top: 0;\n  padding: 4px;\n  margin: 0;\n  height: 100%;\n  width: 100%;\n  float: left;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down .dx-scrollview-pull-down-indicator .dx-loadindicator {\n  float: left;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-icon-pulldown {\n  width: 100%;\n  height: 100%;\n  padding: 8px;\n  font-size: 24px;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  -webkit-transition: opacity .2s;\n  -moz-transition: opacity .2s;\n  -o-transition: opacity .2s;\n  transition: opacity .2s;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down-loading.dx-scrollview-pull-down {\n  -webkit-transition: top .2s ease-out 0s;\n  -moz-transition: top .2s ease-out 0s;\n  -o-transition: top .2s ease-out 0s;\n  transition: top .2s ease-out 0s;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down-image {\n  position: absolute;\n  margin: 0;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background-size: contain;\n  -webkit-transition: opacity .2s ease 0s;\n  -moz-transition: opacity .2s ease 0s;\n  -o-transition: opacity .2s ease 0s;\n  transition: opacity .2s ease 0s;\n}\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down-loading .dx-icon-pulldown {\n  display: none;\n}\n.dx-scrollable-native.dx-scrollable-native-ios .dx-scrollview-top-pocket {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  overflow-y: auto;\n  -webkit-transition: -webkit-transform 400ms ease;\n  -moz-transition: -moz-transform 400ms ease;\n  -o-transition: -o-transform 400ms ease;\n  transition: transform 400ms ease;\n  -webkit-transform: translate(0px, 0px);\n  -moz-transform: translate(0px, 0px);\n  -ms-transform: translate(0px, 0px);\n  -o-transform: translate(0px, 0px);\n  transform: translate(0px, 0px);\n}\n.dx-scrollable-native.dx-scrollable-native-ios .dx-scrollview-content {\n  -webkit-transition: -webkit-transform 400ms ease;\n  -moz-transition: -moz-transform 400ms ease;\n  -o-transition: -o-transform 400ms ease;\n  transition: transform 400ms ease;\n  -webkit-transform: none;\n  -moz-transform: none;\n  -ms-transform: none;\n  -o-transform: none;\n  transform: none;\n}\n.dx-scrollable-native.dx-scrollable-native-win8.dx-scrollable-disabled {\n  overflow-y: auto;\n}\n.dx-scrollable-native.dx-scrollable-native-win8.dx-scrollable-disabled .dx-scrollable-container {\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.dx-scrollable-native.dx-scrollable-native-win8.dx-scrollable-disabled .dx-scrollable-content {\n  overflow-y: hidden;\n}\n.dx-scrollable-native.dx-scrollable-native-win8.dx-scrollable-disabled .dx-scrollview-content {\n  overflow-y: hidden;\n}\n.dx-scrollable-native.dx-scrollable-native-win8 .dx-scrollable-container {\n  -ms-overflow-style: -ms-autohiding-scrollbar;\n}\n.dx-scrollable-native.dx-scrollable-native-win8 .dx-scrollview-bottom-pocket {\n  width: 100%;\n  text-align: center;\n}\n.dx-device-android-4 .dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down-loading .dx-icon-pulldown {\n  display: block;\n}\n.dx-scrollview-content {\n  position: static;\n}\n.dx-scrollview-content:before,\n.dx-scrollview-content:after {\n  display: table;\n  content: \"\";\n  line-height: 0;\n}\n.dx-scrollview-content:after {\n  clear: both;\n}\n.dx-scrollview-pull-down {\n  width: 100%;\n  height: 50px;\n  padding: 15px 0;\n  top: -80px;\n  overflow: hidden;\n  -webkit-transform: translate(0px, 0px);\n  -moz-transform: translate(0px, 0px);\n  -ms-transform: translate(0px, 0px);\n  -o-transform: translate(0px, 0px);\n  transform: translate(0px, 0px);\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-scrollview-pull-down-container {\n  display: inline-block;\n  width: 49%;\n  text-align: right;\n}\n.dx-scrollview-pull-down-indicator {\n  opacity: 0;\n  position: absolute;\n  left: 0;\n  top: 50%;\n  display: inline-block;\n  margin: -15px 20px 0 15px;\n  width: 20px;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-scrollview-pull-down-image {\n  display: inline-block;\n  vertical-align: middle;\n  margin: 0 20px;\n  width: 20px;\n  height: 50px;\n  background-size: contain;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n  -webkit-transform: translate(0,0) rotate(0deg);\n  -moz-transform: translate(0,0) rotate(0deg);\n  -ms-transform: translate(0,0) rotate(0deg);\n  -o-transform: translate(0,0) rotate(0deg);\n  transform: translate(0,0) rotate(0deg);\n  -ms-transform: rotate(0deg);\n  -webkit-transition: -webkit-transform 0.2s linear;\n  -moz-transition: -moz-transform 0.2s linear;\n  -o-transition: -o-transform 0.2s linear;\n  transition: transform 0.2s linear;\n}\n.dx-scrollview-pull-down-text {\n  display: inline;\n  vertical-align: middle;\n  position: relative;\n  overflow: visible;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-scrollview-pull-down-text div {\n  position: absolute;\n  left: 0;\n  top: 0;\n  white-space: nowrap;\n  overflow: visible;\n}\n.dx-scrollview-pull-down-ready .dx-scrollview-pull-down-image {\n  -webkit-transform: translate(0,0) rotate(-180deg);\n  -moz-transform: translate(0,0) rotate(-180deg);\n  -ms-transform: translate(0,0) rotate(-180deg);\n  -o-transform: translate(0,0) rotate(-180deg);\n  transform: translate(0,0) rotate(-180deg);\n  -ms-transform: rotate(-180deg);\n}\n.dx-scrollview-pull-down-loading .dx-scrollview-pull-down-image {\n  opacity: 0;\n}\n.dx-scrollview-pull-down-loading .dx-scrollview-pull-down-indicator {\n  opacity: 1;\n}\n.dx-scrollview-scrollbottom {\n  width: 100%;\n  padding: 10px 0;\n  overflow: hidden;\n  text-align: center;\n  -webkit-transform: translate(0,0);\n  -moz-transform: translate(0,0);\n  -ms-transform: translate(0,0);\n  -o-transform: translate(0,0);\n  transform: translate(0,0);\n}\n.dx-scrollview-scrollbottom:before {\n  content: '';\n  display: inline-block;\n  height: 100%;\n  vertical-align: middle;\n}\n.dx-scrollview-scrollbottom-indicator {\n  display: inline-block;\n  margin: 0 10px 0 0;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-scrollview-scrollbottom-text {\n  display: inline-block;\n  margin-top: -20px;\n  vertical-align: middle;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-scrollview-scrollbottom-end {\n  opacity: 0;\n}\n.dx-rtl .dx-scrollable-native.dx-scrollable-native-ios .dx-scrollview-top-pocket,\n.dx-scrollable-native.dx-rtl.dx-scrollable-native-ios .dx-scrollview-top-pocket {\n  left: auto;\n  right: 0;\n}\n.dx-rtl .dx-scrollview-pull-down-container {\n  text-align: left;\n}\n.dx-rtl .dx-scrollview-pull-down-indicator {\n  left: auto;\n  right: 0;\n}\n.dx-rtl .dx-scrollview-pull-down-text div {\n  left: auto;\n  right: 0;\n}\n.dx-rtl .dx-scrollview-scrollbottom-indicator {\n  margin: 0 0 0 10px;\n}\n.dx-checkbox {\n  display: inline-block;\n  cursor: pointer;\n  line-height: 0;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-checkbox.dx-state-readonly {\n  cursor: default;\n}\n.dx-checkbox-icon {\n  display: inline-block;\n  position: relative;\n  background-position: 0 0;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n.dx-checkbox-container {\n  height: 100%;\n  width: 100%;\n  display: inline-block;\n  vertical-align: middle;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-checkbox-has-text .dx-checkbox-icon,\n.dx-checkbox-has-text .dx-checkbox-text {\n  vertical-align: middle;\n}\n.dx-checkbox-text {\n  display: inline-block;\n  vertical-align: middle;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  line-height: normal;\n  height: 100%;\n  width: 100%;\n}\n.dx-rtl .dx-checkbox-text,\n.dx-rtl.dx-checkbox-text {\n  margin: 0;\n  padding: 0;\n}\n.dx-state-disabled.dx-checkbox,\n.dx-state-disabled .dx-checkbox {\n  cursor: default;\n}\n.dx-switch {\n  display: inline-block;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-switch-wrapper {\n  display: inline-block;\n  text-align: left;\n  height: 100%;\n  width: 100%;\n}\n.dx-switch-wrapper:before {\n  display: inline-block;\n  height: 100%;\n  content: '';\n  vertical-align: middle;\n}\n.dx-switch-container {\n  display: inline-block;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  vertical-align: middle;\n}\n.dx-switch-inner {\n  margin-left: -50px;\n}\n.dx-state-disabled.dx-switch,\n.dx-state-disabled .dx-switch {\n  cursor: default;\n}\n.dx-rtl.dx-switch-inner,\n.dx-rtl .dx-switch-inner {\n  margin-right: -50px;\n  margin-left: 0px;\n}\n.dx-rtl.dx-switch-wrapper,\n.dx-rtl .dx-switch-wrapper {\n  text-align: right;\n}\n.dx-tabs-ie-hack a {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #fff;\n  color: white;\n  text-decoration: none;\n  opacity: 0.001;\n}\n.dx-tabs {\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  display: inline-block;\n  width: 100%;\n  text-align: center;\n  table-layout: fixed;\n  position: relative;\n}\n.dx-tabs-wrapper {\n  display: table-row;\n}\n.dx-tabs-scrollable .dx-tabs-wrapper {\n  display: block;\n  white-space: nowrap;\n  height: 100%;\n}\n.dx-tabs-scrollable .dx-tab {\n  height: 100%;\n  display: inline-block;\n}\n.dx-tabs-scrollable .dx-tab:before {\n  content: \"\";\n  height: 100%;\n  display: inline-block;\n  vertical-align: middle;\n}\n.dx-tabs-scrollable .dx-scrollable-content {\n  height: 100%;\n}\n.dx-tabs-nav-buttons .dx-tabs-scrollable {\n  margin-right: 25px;\n  margin-left: 25px;\n}\n.dx-tabs-nav-button {\n  width: 25px;\n  padding: 0;\n  height: 100%;\n  position: absolute;\n  top: 0;\n}\n.dx-tabs-nav-button-left {\n  left: 0;\n}\n.dx-tabs-nav-button-right {\n  right: 0;\n}\n.dx-tabs-expanded {\n  display: table;\n}\n.dx-tab {\n  position: relative;\n  display: table-cell;\n  vertical-align: middle;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.dx-tab a {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #fff;\n  color: white;\n  text-decoration: none;\n  opacity: 0.001;\n}\n.dx-tab .dx-icon {\n  width: 16px;\n  height: 16px;\n  display: block;\n  margin: 0 auto;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-tab-content {\n  display: inline-block;\n  max-width: 100%;\n}\n.dx-tab-text {\n  display: inline-block;\n  margin: 0 auto;\n  text-align: center;\n  max-width: 100%;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-tabs-item-badge {\n  display: inline-block;\n  vertical-align: top;\n}\n.dx-state-disabled .dx-tab {\n  cursor: default;\n}\n.dx-map-container,\n.dx-map-shield {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  color: #000;\n}\n.dx-map-shield {\n  top: -100%;\n  left: 0;\n  background: rgba(0, 0, 0, 0.01);\n  opacity: .01;\n}\n.dx-tabs.dx-navbar {\n  margin: 0;\n  width: 100%;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-tabs.dx-navbar .dx-icon {\n  display: block;\n  margin: 0 auto;\n  width: 31px;\n  height: 31px;\n}\n.dx-rtl.dx-tabs.dx-navbar .dx-icon,\n.dx-rtl .dx-tabs.dx-navbar .dx-icon {\n  margin: 0 auto;\n}\n.dx-tabs.dx-navbar .dx-tab-text {\n  display: block;\n  vertical-align: 50%;\n}\n.dx-nav-item {\n  position: relative;\n  vertical-align: bottom;\n}\n.dx-nav-item.dx-state-disabled {\n  cursor: default;\n}\n.dx-nav-item-content {\n  display: block;\n}\n.dx-nav-item a {\n  display: block;\n  height: 100%;\n  text-decoration: none;\n}\n.dx-navbar-item-badge {\n  position: absolute;\n  top: 11%;\n  right: 50%;\n  margin-right: -24px;\n}\n.dx-rtl .dx-nav-item .dx-navbar-item-badge {\n  right: auto;\n  left: 50%;\n  margin-right: auto;\n  margin-left: -24px;\n}\n.dx-texteditor {\n  display: block;\n}\n.dx-texteditor input::-ms-clear {\n  display: none;\n}\n.dx-placeholder {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  max-width: 100%;\n  width: auto;\n  height: 100%;\n  text-align: left;\n  cursor: text;\n  pointer-events: none;\n}\n.dx-placeholder:before {\n  display: inline-block;\n  vertical-align: middle;\n  overflow: hidden;\n  content: attr(DATA-DX_PLACEHOLDER);\n  pointer-events: none;\n  white-space: nowrap;\n}\n.dx-placeholder:after {\n  content: ' ';\n  display: inline-block;\n  height: 100%;\n  vertical-align: middle;\n}\n.dx-texteditor-container {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n}\n.dx-texteditor-buttons-container {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: auto;\n  height: 100%;\n}\n.dx-texteditor-input {\n  -webkit-appearance: none;\n  width: 100%;\n  height: 100%;\n  outline: 0;\n  border: 0;\n  -webkit-user-select: text;\n  -khtml-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n  -o-user-select: text;\n  user-select: text;\n}\n.dx-show-clear-button {\n  position: relative;\n}\n.dx-clear-button-area {\n  float: right;\n  height: 100%;\n  width: 34px;\n  position: relative;\n  cursor: pointer;\n}\n.dx-clear-button-area .dx-icon-clear {\n  position: absolute;\n  display: inline-block;\n  -webkit-background-size: contain;\n  -moz-background-size: contain;\n  background-size: contain;\n}\n.dx-texteditor-empty .dx-clear-button-area {\n  display: none;\n}\n.dx-state-disabled .dx-placeholder {\n  cursor: auto;\n}\n.dx-state-disabled .dx-clear-button-area {\n  display: none;\n}\n.dx-state-disabled .dx-texteditor-input {\n  opacity: 1;\n}\n.dx-rtl .dx-texteditor .dx-placeholder,\n.dx-rtl.dx-texteditor .dx-placeholder {\n  text-align: right;\n  left: auto;\n  right: 0;\n}\n.dx-rtl .dx-texteditor .dx-clear-button-area,\n.dx-rtl.dx-texteditor .dx-clear-button-area {\n  float: left;\n  right: auto;\n  left: 0;\n}\n.dx-rtl .dx-texteditor .dx-texteditor-buttons-container,\n.dx-rtl.dx-texteditor .dx-texteditor-buttons-container {\n  left: 0;\n  right: auto;\n}\n.dx-device-android .dx-texteditor-input {\n  -webkit-user-modify: read-write-plaintext-only;\n}\n.dx-searchbox .dx-icon-search {\n  display: block;\n  position: relative;\n}\n.dx-searchbox .dx-icon-search:before {\n  content: \"\";\n  position: absolute;\n  display: inline-block;\n  overflow: hidden;\n  text-indent: -9999px;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-dropdowneditor {\n  position: relative;\n}\n.dx-dropdowneditor.dx-dropdowneditor-field-clickable {\n  cursor: pointer;\n}\n.dx-dropdowneditor .dx-dropdowneditor-button.dx-state-focused {\n  -webkit-box-shadow: none;\n  -moz-box-shadow: none;\n  box-shadow: none;\n}\n.dx-dropdowneditor-input-wrapper {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  overflow: hidden;\n  height: 100%;\n}\n.dx-dropdowneditor-input-wrapper .dx-texteditor {\n  border: none;\n  margin: 0;\n}\n.dx-dropdowneditor-input-wrapper .dx-texteditor-input {\n  text-overflow: ellipsis;\n}\n.dx-dropdowneditor-input-wrapper .dx-texteditor-input::-ms-clear {\n  width: 0;\n  height: 0;\n}\n.dx-dropdowneditor-active .dx-dropdowneditor-icon {\n  opacity: .35;\n}\n.dx-dropdowneditor-button {\n  position: relative;\n  float: right;\n  height: 100%;\n  cursor: pointer;\n}\n.dx-rtl .dx-dropdowneditor-button,\n.dx-rtl.dx-dropdowneditor-button {\n  float: left;\n}\n.dx-dropdowneditor-button.dx-dropdowneditor-readonly {\n  cursor: default;\n}\n.dx-dropdowneditor-icon {\n  height: 100%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.dx-state-disabled .dx-dropdowneditor,\n.dx-state-disabled.dx-dropdowneditor {\n  cursor: default;\n}\n.dx-state-disabled .dx-dropdowneditor-button {\n  cursor: inherit;\n}\n.dx-state-disabled .dx-dropdowneditor-icon {\n  opacity: .2;\n}\n.dx-list {\n  margin: 0;\n  min-height: 3em;\n}\n.dx-empty-collection .dx-list-select-all {\n  display: none;\n}\n.dx-list-group-header:before {\n  width: 0;\n  height: 0;\n  display: block;\n  float: right;\n  margin-top: 6px;\n  border-style: solid;\n  border-color: transparent;\n  border-width: 5px 5px 0 5px;\n}\n.dx-list-collapsible-groups .dx-list-group-header {\n  cursor: pointer;\n}\n.dx-list-collapsible-groups .dx-list-group-header:before {\n  content: ' ';\n}\n.dx-list-group-collapsed .dx-list-group-header:before {\n  border-width: 0 5px 5px 5px;\n}\n.dx-list-item {\n  position: static;\n  cursor: pointer;\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-list-item-content {\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  display: table-cell;\n  width: 100%;\n}\n.dx-list-item-content:before {\n  content: \"_\";\n  color: transparent;\n  display: inline-block;\n  width: 0;\n  float: left;\n}\n.dx-list .dx-empty-message {\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-height: 3em;\n}\n.dx-list-item-badge-container {\n  display: table-cell;\n  width: 20px;\n  text-align: right;\n  vertical-align: middle;\n  padding-right: 10px;\n}\n.dx-list-item-badge {\n  float: right;\n  position: relative;\n}\n.dx-list-item-chevron-container {\n  display: table-cell;\n  width: 15px;\n  vertical-align: middle;\n}\n.dx-list-item-chevron {\n  height: 8px;\n  width: 8px;\n  margin-left: -6px;\n  -webkit-transform: rotate(135deg);\n  -moz-transform: rotate(135deg);\n  -ms-transform: rotate(135deg);\n  -o-transform: rotate(135deg);\n  transform: rotate(135deg);\n  border-width: 2px 0 0 2px;\n  border-style: solid;\n  opacity: .3;\n}\n.dx-rtl .dx-list-item-chevron {\n  margin-left: auto;\n  margin-right: -6px;\n  -webkit-transform: rotate(-45deg);\n  -moz-transform: rotate(-45deg);\n  -ms-transform: rotate(-45deg);\n  -o-transform: rotate(-45deg);\n  transform: rotate(-45deg);\n}\n.dx-list-item-response-wait {\n  opacity: 0.5;\n  -webkit-transition: opacity .2s linear;\n  -moz-transition: opacity .2s linear;\n  -o-transition: opacity .2s linear;\n  transition: opacity .2s linear;\n}\n.dx-list-slide-menu-content {\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n}\n.dx-list-item-before-bag,\n.dx-list-item-after-bag {\n  display: table-cell;\n  width: 0;\n  height: 100%;\n  vertical-align: middle;\n}\n.dx-list-item-before-bag .dx-list-toggle-delete-switch {\n  display: block;\n  float: left;\n  padding: 3px 0;\n}\n.dx-list-item-before-bag .dx-icon-toggle-delete {\n  -webkit-transition: all .1s linear;\n  -moz-transition: all .1s linear;\n  -o-transition: all .1s linear;\n  transition: all .1s linear;\n}\n.dx-list-item-before-bag .dx-list-select-checkbox {\n  float: left;\n  -webkit-transition: all .1s linear;\n  -moz-transition: all .1s linear;\n  -o-transition: all .1s linear;\n  transition: all .1s linear;\n}\n.dx-list-select-all {\n  white-space: nowrap;\n}\n.dx-list-select-all-label {\n  display: inline-block;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-list-item-after-bag .dx-list-reorder-handle {\n  cursor: move;\n  background-repeat: no-repeat;\n  -webkit-background-size: 75% 75%;\n  -moz-background-size: 75% 75%;\n  background-size: 75% 75%;\n  background-position: center;\n  -ms-touch-action: pinch-zoom;\n  touch-action: pinch-zoom;\n}\n.dx-state-disabled .dx-list-item-after-bag .dx-list-reorder-handle {\n  cursor: default;\n}\n.dx-list-switchable-menu-shield-positioning {\n  position: relative;\n  -moz-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  -o-transform: translateZ(0);\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n}\n.dx-device-android-4 .dx-list-switchable-menu-shield-positioning {\n  -moz-transform: none;\n  -ms-transform: none;\n  -o-transform: none;\n  -webkit-transform: none;\n  transform: none;\n}\n.dx-list-switchable-delete-top-shield,\n.dx-list-switchable-delete-bottom-shield {\n  position: absolute;\n  right: 0;\n  left: 0;\n  cursor: pointer;\n}\n.dx-list-switchable-delete-top-shield {\n  top: 0;\n}\n.dx-list-switchable-delete-bottom-shield {\n  bottom: 0;\n}\n.dx-list-switchable-delete-item-content-shield {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n.dx-list-switchable-delete-button-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  overflow: hidden;\n}\n.dx-list-switchable-delete-button-wrapper {\n  display: table;\n  height: 100%;\n}\n.dx-list-switchable-delete-button-inner-wrapper {\n  display: table-cell;\n  padding-left: 1px;\n  height: 100%;\n  vertical-align: middle;\n}\n.dx-list-switchable-menu-item-shield-positioning {\n  position: relative;\n}\n.dx-list-switchable-menu-item-shield-positioning .dx-list-slide-menu-content {\n  position: relative;\n}\n.dx-list-switchable-menu-item-shield-positioning .dx-list-item-content {\n  position: relative;\n}\n.dx-list-switchable-delete-ready .dx-icon-toggle-delete {\n  -webkit-transform: rotate(-90deg);\n  -moz-transform: rotate(-90deg);\n  -ms-transform: rotate(-90deg);\n  -o-transform: rotate(-90deg);\n  transform: rotate(-90deg);\n}\n.dx-list-slide-menu-buttons-container {\n  position: absolute;\n  width: 100%;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  overflow: hidden;\n}\n.dx-device-ios .dx-list-slide-menu-buttons-container {\n  -webkit-mask-image: -webkit-radial-gradient(white, black);\n}\n.dx-list-slide-menu-buttons {\n  position: relative;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  display: table;\n  height: 100%;\n}\n.dx-list-slide-menu-button {\n  display: table-cell;\n  padding: 0 10px;\n  vertical-align: middle;\n}\n.dx-list-static-delete-button {\n  padding: 0 5px;\n}\n.dx-list-static-delete-button .dx-button-content {\n  overflow: visible;\n}\n.dx-list-item-reordering {\n  opacity: 0;\n}\n.dx-list-reorder-compatibility-mode .dx-list-item {\n  position: relative;\n}\n.dx-list-next-button {\n  padding: 5px;\n  text-align: center;\n}\n.dx-list-next-button .dx-button {\n  padding: 0 3em;\n}\n.dx-state-disabled.dx-list-item,\n.dx-state-disabled .dx-list-item {\n  cursor: default;\n}\n.dx-state-disabled .dx-list-toggle-delete-switch,\n.dx-state-disabled .dx-list-switchable-delete-button {\n  cursor: default;\n}\n.dx-list-context-menuitem {\n  cursor: pointer;\n}\n.dx-rtl .dx-list .dx-list-item-badge-container,\n.dx-rtl.dx-list .dx-list-item-badge-container {\n  padding-left: 10px;\n  padding-right: 0;\n}\n.dx-rtl .dx-list .dx-list-item-badge,\n.dx-rtl.dx-list .dx-list-item-badge {\n  float: left;\n}\n.dx-rtl .dx-list .dx-list-item-before-bag .dx-list-toggle-delete-switch,\n.dx-rtl.dx-list .dx-list-item-before-bag .dx-list-toggle-delete-switch {\n  float: right;\n}\n.dx-rtl .dx-list .dx-list-item-before-bag .dx-list-select-checkbox,\n.dx-rtl.dx-list .dx-list-item-before-bag .dx-list-select-checkbox {\n  float: right;\n}\n.dx-rtl .dx-list .dx-list-switchable-delete-button-inner-wrapper,\n.dx-rtl.dx-list .dx-list-switchable-delete-button-inner-wrapper {\n  padding-right: 1px;\n  padding-left: 0;\n}\n.dx-rtl .dx-list .dx-list-slide-item-delete-button-container,\n.dx-rtl.dx-list .dx-list-slide-item-delete-button-container {\n  right: 100%;\n  left: 0;\n}\n.dx-rtl .dx-list .dx-list-slide-item-delete-button,\n.dx-rtl.dx-list .dx-list-slide-item-delete-button {\n  right: auto;\n  left: 0;\n}\n.dx-rtl .dx-list .dx-list-group-header:before,\n.dx-rtl.dx-list .dx-list-group-header:before {\n  float: left;\n}\n.dx-dropdownlist-popup-wrapper .dx-list {\n  min-height: 35px;\n}\n.dx-dropdownlist-popup-wrapper .dx-list .dx-scrollable-content {\n  margin: 0;\n}\n.dx-textarea .dx-texteditor-input {\n  resize: none;\n  font-family: inherit;\n  display: block;\n  overflow: auto;\n  white-space: pre-wrap;\n}\n.dx-textarea .dx-placeholder {\n  height: auto;\n}\n.dx-numberbox {\n  position: relative;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-numberbox input[type=number] {\n  -moz-appearance: textfield;\n}\n.dx-numberbox input[type=number]::-webkit-outer-spin-button,\n.dx-numberbox input[type=number]::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.dx-numberbox-spin .dx-texteditor-input {\n  padding-right: 28px;\n}\n.dx-numberbox-spin-container {\n  float: right;\n  width: 22px;\n  height: 100%;\n}\n.dx-numberbox-spin-down,\n.dx-numberbox-spin-up {\n  position: relative;\n  width: 100%;\n  height: 50%;\n  cursor: pointer;\n}\n.dx-numberbox-spin-touch-friendly .dx-texteditor-input {\n  padding-right: 70px;\n}\n.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-container {\n  width: 64px;\n}\n.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-down,\n.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-up {\n  width: 50%;\n  height: 100%;\n  display: inline-block;\n}\n.dx-numberbox-spin-up-icon,\n.dx-numberbox-spin-down-icon {\n  width: 100%;\n  height: 100%;\n}\n.dx-state-disabled .dx-numberbox-spin-container {\n  opacity: .2;\n}\n.dx-rtl .dx-numberbox-spin-container {\n  float: left;\n  right: auto;\n  left: 0;\n}\n.dx-rtl .dx-numberbox-spin .dx-texteditor-input,\n.dx-rtl.dx-numberbox-spin .dx-texteditor-input {\n  padding-left: 28px;\n}\n.dx-rtl.dx-numberbox-spin-touch-friendly .dx-texteditor-input {\n  padding-left: 70px;\n}\n.dx-texteditor input[type=date]::-webkit-inner-spin-button {\n  height: 20px;\n}\n.dx-datebox-native .dx-texteditor-buttons-container {\n  pointer-events: none;\n}\n.dx-datebox.dx-texteditor-empty input::-webkit-datetime-edit {\n  color: transparent;\n}\n.dx-datebox.dx-texteditor-empty.dx-state-focused .dx-placeholder {\n  display: none;\n}\n.dx-datebox.dx-texteditor-empty.dx-state-focused input::-webkit-datetime-edit {\n  color: inherit;\n}\n.dx-datebox-wrapper .dx-popup-content {\n  padding-top: 20px;\n  padding-bottom: 20px;\n}\n.dx-rtl .dx-texteditor-input {\n  text-align: right;\n}\n.dx-datebox-button-cell .dx-button {\n  min-width: 90px;\n}\n.dx-datebox-button-cell .dx-button.dx-datebox-apply-button {\n  margin-right: 10px;\n  margin-left: 0;\n}\n.dx-datebox-button-cell .dx-button.dx-datebox-cancel-button {\n  margin-right: 0;\n  margin-left: 0;\n}\n.dx-datebox-buttons-container {\n  text-align: right;\n  width: 100%;\n}\n.dx-colorview-container-cell {\n  float: left;\n}\n.dx-dateview-item {\n  margin: 0;\n}\n.dx-dateview-rollers {\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-flow: row nowrap;\n  -moz-flex-flow: row nowrap;\n  -ms-flex-direction: row;\n  -ms-flex-wrap: nowrap;\n  -ms-flex-flow: row nowrap;\n  flex-flow: row nowrap;\n}\n.dx-dateviewroller {\n  position: relative;\n  vertical-align: top;\n  cursor: pointer;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 1 auto;\n  -moz-flex: 1 1 auto;\n  -ms-flex: 1 1 auto;\n  flex: 1 1 auto;\n}\n.dx-dateview-item-selected-frame:before,\n.dx-dateview-item-selected-frame:after {\n  pointer-events: none;\n}\n.dx-dateview-item-selected-border {\n  display: none;\n}\n.dx-dateviewroller-month .dx-dateview-value-formatter,\n.dx-dateviewroller-day .dx-dateview-name-formatter {\n  display: none;\n}\n.dx-toolbar {\n  width: 100%;\n}\n.dx-toolbar .dx-button-content:after {\n  display: none;\n}\n.dx-toolbar .dx-button .dx-icon {\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-toolbar-items-container {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n}\n.dx-toolbar-item {\n  display: table-cell;\n  padding: 0 5px;\n  vertical-align: middle;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-toolbar-item .dx-tabs {\n  table-layout: auto;\n}\n.dx-toolbar-item img {\n  display: block;\n}\n.dx-toolbar-menu-container {\n  display: table-cell;\n  padding: 0 5px;\n  vertical-align: middle;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-toolbar-menu-container .dx-tabs {\n  table-layout: auto;\n}\n.dx-toolbar-menu-container img {\n  display: block;\n}\n.dx-toolbar-group {\n  float: left;\n  margin: 0 10px;\n}\n.dx-toolbar-before,\n.dx-toolbar-after {\n  position: absolute;\n}\n.dx-toolbar-center:empty {\n  display: none;\n}\n.dx-toolbar-before {\n  left: 0;\n}\n.dx-toolbar-after {\n  right: 0;\n}\n.dx-toolbar-label {\n  white-space: nowrap;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-toolbar-label .dx-toolbar-item-content > div {\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-toolbar-label > div {\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  margin: 0 -5px;\n  padding: 0 5px;\n}\n.dx-toolbar-center {\n  margin: 0 auto;\n  height: 100%;\n  text-align: center;\n}\n.dx-toolbar-center,\n.dx-toolbar-before,\n.dx-toolbar-after {\n  top: 0;\n  display: table;\n  height: 100%;\n}\n.dx-rtl .dx-toolbar-before {\n  right: 0;\n  left: auto;\n}\n.dx-rtl .dx-toolbar-after {\n  right: auto;\n  left: 0;\n}\n.dx-toolbar-menu-section:empty {\n  display: none;\n}\n.dx-dropdownmenu-popup-wrapper .dx-toolbar-menu-custom > .dx-list-item-content {\n  padding: 0;\n}\n.dx-toolbar-menu-section.dx-toolbar-menu-last-section {\n  border-bottom: none;\n}\n.dx-toolbar-menu-section .dx-toolbar-hidden-button .dx-button {\n  border: none;\n  background: none;\n  margin: 0;\n  width: 100%;\n  text-align: left;\n}\n.dx-toolbar-menu-section .dx-toolbar-hidden-button .dx-button .dx-button-content {\n  text-align: left;\n}\n.dx-toolbar-text-auto-hide .dx-button .dx-button-text {\n  display: none;\n}\n.dx-toolbar .dx-texteditor {\n  width: 150px;\n}\n.dx-toolbar-item-invisible {\n  display: none;\n}\n.dx-tileview div.dx-scrollable-container {\n  overflow-y: hidden;\n}\n.dx-tile {\n  position: absolute;\n  text-align: center;\n}\n.dx-tile.dx-state-active {\n  -webkit-transform: scale(0.96);\n  -moz-transform: scale(0.96);\n  -ms-transform: scale(0.96);\n  -o-transform: scale(0.96);\n  transform: scale(0.96);\n  -webkit-transition: -webkit-transform 100ms linear;\n  -moz-transition: -moz-transform 100ms linear;\n  -o-transition: -o-transform 100ms linear;\n  transition: transform 100ms linear;\n}\n.dx-tile-content {\n  padding: 0;\n  width: 100%;\n  height: 100%;\n}\n.dx-tileview-wrapper {\n  position: relative;\n  height: 1px;\n}\n.dx-device-ios-6 .dx-tile {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n.dx-overlay-wrapper {\n  top: 0;\n  left: 0;\n  z-index: 1000;\n}\n.dx-overlay-wrapper,\n.dx-overlay-wrapper *,\n.dx-overlay-wrapper:before,\n.dx-overlay-wrapper:after,\n.dx-overlay-wrapper *:before,\n.dx-overlay-wrapper *:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.dx-overlay-modal {\n  width: 100%;\n  height: 100%;\n}\n.dx-overlay-shader {\n  background-color: rgba(128, 128, 128, 0.5);\n}\n.dx-overlay-content {\n  position: absolute;\n  z-index: 1000;\n  outline: 0;\n  overflow: hidden;\n}\n.dx-overlay-content > .dx-template-wrapper {\n  height: 100%;\n  width: 100%;\n}\n.dx-device-android .dx-overlay-content {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n.dx-device-android .dx-scrollable-native .dx-overlay-content {\n  -webkit-backface-visibility: visible;\n  -moz-backface-visibility: visible;\n  -ms-backface-visibility: visible;\n  backface-visibility: visible;\n}\n.dx-toast-content {\n  display: inline-block;\n  padding: 10px;\n  vertical-align: middle;\n}\n.dx-toast-icon {\n  display: table-cell;\n  background-size: contain;\n  width: 35px;\n  height: 35px;\n  margin-right: 10px;\n  vertical-align: middle;\n  background-position: left center;\n  background-repeat: no-repeat;\n}\n.dx-toast-message {\n  display: table-cell;\n  vertical-align: middle;\n  padding-left: 10px;\n}\n.dx-toast-info {\n  background-color: #80b9e4;\n}\n.dx-toast-warning {\n  background-color: #ffb277;\n}\n.dx-toast-error {\n  background-color: #ff7777;\n}\n.dx-toast-success {\n  background-color: #6ec881;\n}\n.dx-rtl .dx-toast-message {\n  padding-left: 0;\n  padding-right: 10px;\n}\n.dx-popup-title {\n  padding: 10px;\n  min-height: 19px;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  white-space: normal;\n}\n.dx-popup-draggable .dx-popup-title {\n  cursor: move;\n}\n.dx-overlay-content > .dx-template-wrapper.dx-popup-title {\n  height: auto;\n  width: auto;\n}\n.dx-overlay-content .dx-popup-content > .dx-template-wrapper {\n  height: 100%;\n  width: 100%;\n}\n.dx-popup-content {\n  padding: 10px;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-popup-content.dx-dialog-content {\n  padding: 0;\n}\n.dx-dialog-root .dx-overlay-shader {\n  background-color: #444;\n}\n.dx-dialog-message {\n  padding: 10px 10px 5px 10px;\n}\n.dx-popover-wrapper .dx-popover-arrow:after {\n  width: 14.14227125px;\n  height: 14.14227125px;\n}\n.dx-popover-wrapper.dx-position-top .dx-popover-arrow,\n.dx-popover-wrapper.dx-position-bottom .dx-popover-arrow {\n  width: 20px;\n  height: 10px;\n}\n.dx-popover-wrapper.dx-position-right .dx-popover-arrow,\n.dx-popover-wrapper.dx-position-left .dx-popover-arrow {\n  width: 10px;\n  height: 20px;\n}\n.dx-popover-arrow {\n  position: absolute;\n  z-index: 2000;\n  overflow: hidden;\n}\n.dx-popover-arrow:after {\n  position: absolute;\n  display: block;\n  overflow: hidden;\n  content: \" \";\n  -webkit-transform: rotate(-45deg);\n  -moz-transform: rotate(-45deg);\n  -ms-transform: rotate(-45deg);\n  -o-transform: rotate(-45deg);\n  transform: rotate(-45deg);\n}\n.dx-popover-wrapper.dx-position-top .dx-popover-arrow:after {\n  top: 0;\n  left: 0;\n  -webkit-transform-origin: top left;\n  -moz-transform-origin: top left;\n  -ms-transform-origin: top left;\n  -o-transform-origin: top left;\n  transform-origin: top left;\n}\n.dx-popover-wrapper.dx-position-bottom .dx-popover-arrow:after {\n  right: 0;\n  bottom: 0;\n  -webkit-transform-origin: bottom right;\n  -moz-transform-origin: bottom right;\n  -ms-transform-origin: bottom right;\n  -o-transform-origin: bottom right;\n  transform-origin: bottom right;\n}\n.dx-popover-wrapper.dx-position-left .dx-popover-arrow:after {\n  bottom: 0;\n  left: 0;\n  -webkit-transform-origin: bottom left;\n  -moz-transform-origin: bottom left;\n  -ms-transform-origin: bottom left;\n  -o-transform-origin: bottom left;\n  transform-origin: bottom left;\n}\n.dx-popover-wrapper.dx-position-right .dx-popover-arrow:after {\n  top: 0;\n  right: 0;\n  -webkit-transform-origin: top right;\n  -moz-transform-origin: top right;\n  -ms-transform-origin: top right;\n  -o-transform-origin: top right;\n  transform-origin: top right;\n}\n.dx-popover-wrapper .dx-overlay-content {\n  overflow: visible;\n}\n.dx-popover-wrapper .dx-popup-content {\n  overflow: hidden;\n}\n.dx-device-ios {\n}\n.dx-device-ios .dx-popover-arrow:after {\n  -webkit-transform: rotate(-45deg) translateZ(0);\n}\n.dx-progressbar .dx-position-left .dx-progressbar-range-container,\n.dx-progressbar .dx-position-right .dx-progressbar-range-container,\n.dx-progressbar .dx-position-left .dx-progressbar-status,\n.dx-progressbar .dx-position-right .dx-progressbar-status {\n  display: table-cell;\n  vertical-align: middle;\n}\n.dx-progressbar .dx-position-top-left .dx-progressbar-range-container,\n.dx-progressbar .dx-position-bottom-left .dx-progressbar-range-container,\n.dx-progressbar .dx-position-top-left .dx-progressbar-status,\n.dx-progressbar .dx-position-bottom-left .dx-progressbar-status {\n  float: left;\n}\n.dx-progressbar .dx-position-top-right .dx-progressbar-range-container,\n.dx-progressbar .dx-position-bottom-right .dx-progressbar-range-container,\n.dx-progressbar .dx-position-top-right .dx-progressbar-status,\n.dx-progressbar .dx-position-bottom-right .dx-progressbar-status {\n  float: right;\n}\n.dx-progressbar .dx-position-top-center .dx-progressbar-status,\n.dx-progressbar .dx-position-bottom-center .dx-progressbar-status {\n  text-align: center;\n}\n.dx-progressbar .dx-position-left .dx-progressbar-status {\n  padding-right: 8px;\n}\n.dx-progressbar .dx-position-right .dx-progressbar-status {\n  padding-left: 8px;\n}\n.dx-progressbar:before {\n  display: inline-block;\n  height: 100%;\n  content: '';\n  vertical-align: middle;\n}\n.dx-progressbar-range-container {\n  width: 100%;\n}\n.dx-progressbar-container {\n  position: relative;\n  width: 100%;\n}\n.dx-progressbar-wrapper {\n  display: inline-block;\n  width: 100%;\n  vertical-align: middle;\n  direction: ltr;\n}\n.dx-progressbar-range {\n  height: 100%;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-progressbar-status {\n  position: relative;\n  top: 0;\n  left: 0;\n  width: auto;\n  height: 20px;\n  font-size: 12px;\n}\n.dx-progressbar-animating-segment {\n  display: none;\n}\n.dx-progressbar-animating-container {\n  width: 100%;\n}\n.dx-rtl.dx-progressbar .dx-progressbar-wrapper,\n.dx-rtl .dx-progressbar .dx-progressbar-wrapper {\n  direction: rtl;\n}\n.dx-tooltip-wrapper .dx-overlay-content {\n  min-width: 34px;\n  min-height: 26px;\n  text-align: center;\n  line-height: 0;\n}\n.dx-tooltip-wrapper .dx-overlay-content:before {\n  display: inline-block;\n  height: 100%;\n  content: '';\n  vertical-align: middle;\n}\n.dx-tooltip-wrapper .dx-overlay-content .dx-popup-content {\n  display: inline-block;\n  padding: 12px 17px;\n  font-size: .85em;\n  line-height: normal;\n  white-space: nowrap;\n}\n.dx-slider-label {\n  position: absolute;\n  font-size: .85em;\n}\n.dx-slider-label:last-child {\n  right: 0;\n  left: auto;\n}\n.dx-rtl .dx-slider-label:last-child {\n  left: 0;\n  right: auto;\n}\n.dx-slider-label-position-bottom {\n  padding-bottom: 14px;\n}\n.dx-slider-label-position-bottom .dx-slider-label {\n  bottom: -8px;\n}\n.dx-slider-label-position-top {\n  padding-top: 14px;\n}\n.dx-slider-label-position-top .dx-slider-label {\n  top: -8px;\n}\n.dx-slider {\n  line-height: 0;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-slider:before {\n  display: inline-block;\n  height: 100%;\n  content: '';\n  vertical-align: middle;\n}\n.dx-slider .dx-overlay-content {\n  height: 28px;\n}\n.dx-slider .dx-overlay-content:before {\n  display: none;\n}\n.dx-slider .dx-popover-wrapper .dx-popover-arrow:after {\n  width: 9.89958987px;\n  height: 9.89958987px;\n}\n.dx-slider .dx-popover-wrapper.dx-position-top .dx-popover-arrow,\n.dx-slider .dx-popover-wrapper.dx-position-bottom .dx-popover-arrow {\n  width: 14px;\n  height: 7px;\n}\n.dx-slider .dx-popover-wrapper.dx-position-right .dx-popover-arrow,\n.dx-slider .dx-popover-wrapper.dx-position-left .dx-popover-arrow {\n  width: 7px;\n  height: 14px;\n}\n.dx-slider-wrapper {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  vertical-align: middle;\n  cursor: pointer;\n}\n.dx-slider-bar {\n  position: relative;\n}\n.dx-slider-range {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  pointer-events: none;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-slider-handle {\n  position: absolute;\n  top: 0;\n  right: 0;\n  pointer-events: auto;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-slider-handle .dx-tooltip-wrapper .dx-popup-content {\n  line-height: 0;\n}\n.dx-state-disabled .dx-slider-wrapper {\n  cursor: default;\n}\n.dx-rtl .dx-slider-handle {\n  right: auto;\n  left: 0;\n}\n.dx-slider-tooltip-on-hover .dx-tooltip {\n  visibility: hidden;\n}\n.dx-slider-tooltip-on-hover.dx-state-active .dx-tooltip,\n.dx-slider-tooltip-on-hover.dx-state-hover .dx-tooltip {\n  visibility: visible;\n}\n.dx-rangeslider-start-handle {\n  top: 0;\n  right: auto;\n  left: 0;\n}\n.dx-rtl .dx-rangeslider-start-handle {\n  right: 0;\n  left: auto;\n}\n.dx-gallery {\n  width: 100%;\n  height: 100%;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -ms-touch-action: pinch-zoom;\n  touch-action: pinch-zoom;\n}\n.dx-gallery-wrapper {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n}\n.dx-gallery-wrapper > .dx-empty-message {\n  text-align: center;\n  position: absolute;\n  width: 100%;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  -moz-transform: translateY(-50%);\n  -ms-transform: translateY(-50%);\n  -o-transform: translateY(-50%);\n  transform: translateY(-50%);\n}\n.dx-gallery-container {\n  position: relative;\n  height: 100%;\n}\n.dx-gallery-item {\n  position: absolute;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n}\n.dx-gallery-item-image {\n  max-width: 100%;\n  height: auto;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  margin: auto;\n}\n.dx-gallery-item-content {\n  width: 100%;\n  height: 100%;\n}\n.dx-gallery .dx-gallery-item-loop {\n  display: none;\n}\n.dx-gallery-loop .dx-gallery-item-loop {\n  display: block;\n}\n.dx-gallery-nav-button-prev,\n.dx-gallery-nav-button-next {\n  position: absolute;\n  top: 50%;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-background-size: 100% 100%;\n  -moz-background-size: 100% 100%;\n  background-size: 100% 100%;\n}\n.dx-gallery-nav-button-prev {\n  left: 0;\n}\n.dx-gallery-nav-button-next {\n  right: 0;\n}\n.dx-gallery-indicator {\n  position: absolute;\n  bottom: 10px;\n  width: 100%;\n  height: 10px;\n  font-size: 0;\n}\n.dx-gallery-indicator-item {\n  display: inline-block;\n  margin: 0 2px;\n  height: 10px;\n  cursor: pointer;\n}\n.dx-state-disabled .dx-gallery-nav-button-prev,\n.dx-state-disabled .dx-gallery-nav-button-next,\n.dx-state-disabled .dx-gallery-indicator-item {\n  cursor: default;\n}\n.dx-rtl .dx-gallery-nav-button-prev {\n  right: 0;\n  left: auto;\n  -moz-transform: scaleX(-1);\n  -o-transform: scaleX(-1);\n  -webkit-transform: scaleX(-1);\n  transform: scaleX(-1);\n}\n.dx-rtl .dx-gallery-nav-button-next {\n  right: auto;\n  left: 0;\n  -moz-transform: scaleX(-1);\n  -o-transform: scaleX(-1);\n  -webkit-transform: scaleX(-1);\n  transform: scaleX(-1);\n}\n.dx-device-android .dx-scrollable-native .dx-gallery-item,\n.dx-device-android .dx-scrollable-native .dx-gallery-indicator,\n.dx-device-android .dx-scrollable-native .dx-gallery-nav-button-prev,\n.dx-device-android .dx-scrollable-native .dx-gallery-nav-button-next {\n  -webkit-backface-visibility: visible;\n  -moz-backface-visibility: visible;\n  -ms-backface-visibility: visible;\n  backface-visibility: visible;\n}\n.dx-device-android .dx-scrollable-native .dx-gallery-active .dx-gallery-item,\n.dx-device-android .dx-scrollable-native .dx-gallery-active .dx-gallery-indicator,\n.dx-device-android .dx-scrollable-native .dx-gallery-active .dx-gallery-nav-button-prev,\n.dx-device-android .dx-scrollable-native .dx-gallery-active .dx-gallery-nav-button-next {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n.dx-device-android .dx-gallery-item {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n.dx-device-ios-6 {\n}\n.dx-device-ios-6 .dx-gallery,\n.dx-device-ios-6 .dx-gallery-item,\n.dx-device-ios-6 .dx-gallery-indicator,\n.dx-device-ios-6 .dx-gallery-nav-button-prev,\n.dx-device-ios-6 .dx-gallery-nav-button-next {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n.dx-lookup {\n  margin: 0;\n  height: 19px;\n}\n.dx-lookup .dx-popup-content .dx-scrollable {\n  height: calc(100% - 45px);\n}\n.dx-lookup .dx-lookup-field-wrapper {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.dx-lookup:not(.dx-rtl) .dx-lookup-field-wrapper:before {\n  display: inline-block;\n  height: 100%;\n  content: '';\n  vertical-align: middle;\n}\n.dx-lookup .dx-rtl .dx-lookup-field-wrapper:after {\n  display: inline-block;\n  height: 100%;\n  content: '';\n  vertical-align: middle;\n}\n.dx-lookup-field {\n  outline: none;\n  position: relative;\n  width: 100%;\n  display: inline-block;\n  vertical-align: middle;\n  cursor: pointer;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-lookup-field:before {\n  content: \".\";\n  color: transparent;\n  display: inline-block;\n  width: 0;\n  float: left;\n}\n.dx-lookup-arrow {\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: auto;\n  height: 100%;\n}\n.dx-rtl .dx-lookup-arrow {\n  right: auto;\n  left: 0;\n}\n.dx-state-disabled .dx-lookup-field,\n.dx-state-disabled .dx-lookup-field {\n  cursor: default;\n}\n.dx-lookup-popup-wrapper .dx-list-item {\n  cursor: pointer;\n}\n.dx-lookup-popup-search .dx-list {\n  height: 90%;\n}\n.dx-lookup-search-wrapper {\n  width: 100%;\n}\n.dx-popup-content .dx-lookup-validation-message {\n  display: none;\n}\n.dx-popup-content.dx-lookup-invalid .dx-lookup-validation-message {\n  display: block;\n}\n.dx-actionsheet-popup-wrapper .dx-overlay-content {\n  padding-top: 0;\n  padding-bottom: 0;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-actionsheet-popup-wrapper .dx-popup-content .dx-button,\n.dx-actionsheet-popover-wrapper .dx-popup-content .dx-button {\n  width: 100%;\n  margin-right: 0;\n  margin-left: 0;\n}\n.dx-actionsheet-item,\n.dx-actionsheet-cancel {\n  width: 100%;\n}\n.dx-state-disabled .dx-actionsheet-container .dx-button,\n.dx-state-disabled .dx-actionsheet-container .dx-button {\n  cursor: default;\n}\n.dx-actionsheet-popup-wrapper .dx-popup-title,\n.dx-actionsheet-popover-wrapper .dx-popup-title {\n  word-wrap: break-word;\n}\n.dx-loadindicator {\n  width: 32px;\n  height: 32px;\n  display: inline-block;\n  overflow: hidden;\n  border: none;\n  background-color: transparent;\n}\n.dx-loadindicator-wrapper {\n  width: 100%;\n  height: 100%;\n  font-size: 32px;\n  margin: auto;\n}\n.dx-loadindicator-image {\n  -webkit-background-size: contain;\n  -moz-background-size: contain;\n  background-size: contain;\n  -webkit-transform-origin: 50% 50%;\n  -moz-transform-origin: 50% 50%;\n  -ms-transform-origin: 50% 50%;\n  -o-transform-origin: 50% 50%;\n  transform-origin: 50% 50%;\n  background-position: 50%;\n  background-repeat: no-repeat;\n}\n.dx-loadindicator-icon {\n  direction: ltr;\n}\n.dx-loadindicator-icon-custom {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  -webkit-background-size: 100% 100%;\n  -moz-background-size: 100% 100%;\n  background-size: 100% 100%;\n  -webkit-transform-origin: 50% 50%;\n  -moz-transform-origin: 50% 50%;\n  -ms-transform-origin: 50% 50%;\n  -o-transform-origin: 50% 50%;\n  transform-origin: 50% 50%;\n  -webkit-animation: dx-loadindicator-icon-custom-rotate 1.5s infinite linear;\n  -moz-animation: dx-loadindicator-icon-custom-rotate 1.5s infinite linear;\n  -o-animation: dx-loadindicator-icon-custom-rotate 1.5s infinite linear;\n  animation: dx-loadindicator-icon-custom-rotate 1.5s infinite linear;\n}\n@-webkit-keyframes dx-loadindicator-icon-custom-rotate {\n  from {\n    -webkit-transform: rotate(0deg);\n  }\n  to {\n    -webkit-transform: rotate(360deg);\n  }\n}\n@-moz-keyframes dx-loadindicator-icon-custom-rotate {\n  from {\n    -moz-transform: rotate(0deg);\n  }\n  to {\n    -moz-transform: rotate(360deg);\n  }\n}\n@-ms-keyframes dx-loadindicator-icon-custom-rotate {\n  from {\n    -ms-transform: rotate(0deg);\n  }\n  to {\n    -ms-transform: rotate(360deg);\n  }\n}\n@-o-keyframes dx-loadindicator-icon-custom-rotate {\n  from {\n    -o-transform: rotate(0deg);\n  }\n  to {\n    -o-transform: rotate(360deg);\n  }\n}\n@keyframes dx-loadindicator-icon-custom-rotate {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n.dx-loadindicator-container > .dx-loadindicator {\n  top: 50%;\n  left: 50%;\n  position: absolute;\n  margin-top: -16px;\n  margin-left: -16px;\n}\n.dx-loadindicator-container > .dx-loadindicator.dx-loadindicator {\n  margin-top: -16px;\n  margin-left: -16px;\n}\n.dx-loadindicator-content {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n.dx-loadpanel-content {\n  padding: 10px;\n  border: 1px solid #ccc;\n  background: #fefefe;\n  text-align: center;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  -ms-border-radius: 5px;\n  -o-border-radius: 5px;\n  border-radius: 5px;\n}\n.dx-loadpanel-content:before {\n  display: inline-block;\n  height: 100%;\n  content: '';\n  vertical-align: middle;\n}\n.dx-loadpanel-content-wrapper {\n  display: inline-block;\n  width: 100%;\n  vertical-align: middle;\n}\n.dx-loadpanel-message {\n  text-align: center;\n}\n.dx-loadpanel-content.dx-loadpanel-pane-hidden {\n  -webkit-box-shadow: none;\n  -moz-box-shadow: none;\n  box-shadow: none;\n  border: none;\n  background: none;\n}\n.dx-dropdownmenu-popup-wrapper .dx-dropdownmenu-list {\n  min-height: 40px;\n  min-width: 100px;\n}\n.dx-dropdownmenu-popup-wrapper .dx-dropdownmenu-list .dx-list-item {\n  display: block;\n}\n.dx-dropdownmenu-popup-wrapper .dx-dropdownmenu-list .dx-list-item:last-of-type {\n  border-bottom: none;\n}\n.dx-dropdownmenu-popup-wrapper .dx-dropdownmenu-list .dx-list-item-content {\n  display: block;\n}\n.dx-overlay-wrapper.dx-dropdownmenu-popup .dx-popover-arrow {\n  width: 0;\n  height: 0;\n}\n.dx-dropdownmenu-popup-wrapper .dx-list-item {\n  display: block;\n}\n.dx-selectbox {\n  cursor: pointer;\n}\n.dx-selectbox .dx-texteditor-input {\n  max-width: 100%;\n}\n.dx-selectbox .dx-texteditor-input:read-only {\n  cursor: pointer;\n}\n.dx-selectbox-container {\n  position: relative;\n}\n.dx-state-disabled .dx-selectbox .dx-texteditor-input,\n.dx-state-disabled.dx-selectbox .dx-texteditor-input {\n  cursor: default;\n}\n.dx-tagbox .dx-texteditor-input {\n  width: auto;\n}\n.dx-tagbox.dx-tagbox-default-template.dx-tagbox-only-select .dx-texteditor-input {\n  border: none;\n  color: transparent;\n  text-shadow: 0 0 0 gray;\n  min-width: 0;\n  width: 0.1px;\n  padding-left: 0;\n  padding-right: 0;\n  margin-left: 0;\n  margin-right: 0;\n}\n.dx-tagbox.dx-tagbox-default-template.dx-tagbox-only-select .dx-texteditor-input:focus {\n  outline: none;\n}\n.dx-tagbox.dx-tagbox-default-template.dx-tagbox-only-select:not(.dx-texteditor-empty) .dx-texteditor-input {\n  display: block;\n  min-height: 0;\n  height: 0.1px;\n  padding: 0;\n  margin: 0;\n}\n.dx-tagbox.dx-tagbox-default-template.dx-tagbox-only-select:not(.dx-texteditor-empty) .dx-tag-container {\n  padding-bottom: 2px;\n}\n.dx-tagbox.dx-state-disabled .dx-texteditor-input {\n  background: none;\n}\n.dx-tagbox.dx-state-disabled .dx-tag-content {\n  cursor: default;\n}\n.dx-tag {\n  display: inline;\n}\n.dx-tag-container {\n  padding: 0;\n  padding-right: 4px;\n  outline: none;\n}\n.dx-texteditor-container.dx-tag-container {\n  white-space: normal;\n}\n.dx-tagbox-single-line .dx-tag-container {\n  overflow-x: hidden;\n  white-space: nowrap;\n  position: static;\n}\n.dx-tag-content {\n  position: relative;\n  display: inline-block;\n  margin: 4px 0 0 4px;\n  min-width: 30px;\n  text-align: center;\n  cursor: pointer;\n}\n.dx-tag-content:before {\n  content: \".\";\n  color: transparent;\n  display: inline-block;\n  width: 0;\n}\n.dx-tag-remove-button {\n  position: absolute;\n  top: 0;\n  right: 0;\n}\n.dx-tag-remove-button:before,\n.dx-tag-remove-button:after {\n  position: absolute;\n  top: 50%;\n  content: \"\";\n  -webkit-transform: rotate(45deg);\n  -moz-transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  -o-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n.dx-rtl .dx-tagbox .dx-tag-content,\n.dx-tagbox.dx-rtl .dx-tag-content {\n  margin-left: 0;\n  margin-right: 4px;\n}\n.dx-rtl .dx-tagbox .dx-tag-remove-button,\n.dx-tagbox.dx-rtl .dx-tag-remove-button {\n  right: auto;\n  left: 0;\n}\n.dx-rtl .dx-tagbox .dx-tag-container,\n.dx-tagbox.dx-rtl .dx-tag-container {\n  padding-left: 4px;\n  padding-right: 0;\n}\n.dx-radiobutton {\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-state-disabled.dx-radiobutton {\n  cursor: default;\n}\n.dx-radiobutton {\n  display: table;\n  cursor: pointer;\n}\n.dx-radio-value-container {\n  display: table-cell;\n  padding-right: 10px;\n  padding-left: 5px;\n  vertical-align: middle;\n}\n.dx-rtl .dx-radio-value-container,\n.dx-rtl.dx-radio-value-container {\n  padding-right: 5px;\n  padding-left: 10px;\n}\n.dx-radiogroup-horizontal:before,\n.dx-radiogroup-horizontal:after {\n  display: table;\n  content: \"\";\n  line-height: 0;\n}\n.dx-radiogroup-horizontal:after {\n  clear: both;\n}\n.dx-radiogroup-horizontal .dx-radiobutton {\n  float: left;\n}\n.dx-rtl .dx-radiogroup-horizontal .dx-radiobutton,\n.dx-rtl.dx-radiogroup-horizontal .dx-radiobutton {\n  float: right;\n}\n.dx-radiogroup-horizontal .dx-radiobutton:last-of-type {\n  margin-right: 0;\n}\n.dx-state-disabled .dx-radiobutton {\n  cursor: default;\n}\n.dx-pivottabs {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-pivottabs-tab,\n.dx-pivottabs-ghosttab {\n  position: absolute;\n  left: 0;\n  cursor: pointer;\n}\n.dx-pivot {\n  height: 100%;\n  -ms-touch-action: pinch-zoom;\n  touch-action: pinch-zoom;\n}\n.dx-pivot-wrapper {\n  position: relative;\n  height: 100%;\n  overflow: hidden;\n}\n.dx-pivot-itemcontainer {\n  position: absolute;\n  bottom: 0px;\n  width: 100%;\n}\n.dx-pivot-itemwrapper {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.dx-pivot-item,\n.dx-pivot-item-content {\n  width: 100%;\n  height: 100%;\n}\n.dx-pivot-item-hidden {\n  display: none;\n}\n.dx-pivot-autoheight .dx-pivot-itemcontainer {\n  position: static;\n}\n.dx-pivot-autoheight .dx-pivot-itemwrapper {\n  position: static;\n}\n.dx-panorama {\n  height: 100%;\n  background-position-y: 0;\n  background-repeat: repeat-x;\n  -webkit-background-size: auto 100%;\n  -moz-background-size: auto 100%;\n  background-size: auto 100%;\n  -ms-touch-action: pinch-zoom;\n  touch-action: pinch-zoom;\n}\n.dx-panorama-wrapper {\n  position: relative;\n  height: 100%;\n  overflow: hidden;\n}\n.dx-panorama-title,\n.dx-panorama-ghosttitle {\n  position: absolute;\n  left: 0;\n  height: 70px;\n  font-size: 65px;\n  line-height: 0.7692;\n  white-space: nowrap;\n}\n.dx-panorama-itemscontainer {\n  position: absolute;\n  width: 100%;\n  top: 70px;\n  bottom: 0;\n}\n.dx-panorama-item,\n.dx-panorama-ghostitem {\n  position: absolute;\n  width: 88%;\n  height: 100%;\n  left: 0;\n}\n.dx-panorama-item-title {\n  font-size: 30px;\n  line-height: 1.5;\n}\n.dx-panorama-item-content {\n  position: absolute;\n  top: 45px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.dx-panorama-item-content:first-child {\n  top: 0;\n}\n.dx-accordion-item-title {\n  font-size: 18px;\n  cursor: pointer;\n  position: relative;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-accordion-item-title .dx-icon {\n  width: 16px;\n  height: 16px;\n  background-size: contain;\n  display: inline-block;\n  margin-right: 5px;\n}\n.dx-accordion-item-title:before {\n  content: '';\n  background-position: center;\n  float: right;\n}\n.dx-accordion-item-body {\n  overflow: hidden;\n  font-size: 14px;\n}\n.dx-accordion-item-closed .dx-accordion-item-body {\n  visibility: hidden;\n}\n.dx-accordion-item {\n  overflow: hidden;\n}\n.dx-accordion-item-opened .dx-accordion-item-body {\n  visibility: visible;\n}\n.dx-state-disabled .dx-accordion-item-title {\n  cursor: default;\n}\n.dx-rtl .dx-accordion-item-title:before {\n  float: left;\n}\n.dx-slideoutview {\n  height: 100%;\n  width: 100%;\n  -ms-touch-action: pinch-zoom;\n  touch-action: pinch-zoom;\n}\n.dx-slideoutview-wrapper {\n  position: relative;\n  overflow: hidden;\n  height: 100%;\n}\n.dx-slideoutview-menu-content {\n  position: absolute;\n  top: 0px;\n  bottom: 0px;\n}\n.dx-slideoutview-menu-content.dx-slideoutview-right {\n  right: 0px;\n}\n.dx-slideoutview-menu-content.dx-slideoutview-left {\n  left: 0px;\n}\n.dx-slideoutview-content {\n  position: absolute;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  z-index: 100;\n}\n.dx-slideoutview-shield {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  width: 100%;\n  z-index: 1;\n}\n.dx-device-android .dx-slideoutview-content {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n.dx-slideout {\n  height: 100%;\n  width: 100%;\n}\n.dx-slideout-menu {\n  min-width: 280px;\n  max-width: 350px;\n}\n.dx-slideout-menu .dx-list-item .dx-icon {\n  float: left;\n  margin-right: 15px;\n  width: 24px;\n  height: 24px;\n  -webkit-background-size: 100% 100%;\n  -moz-background-size: 100% 100%;\n  background-size: 100% 100%;\n}\n.dx-slideout-item,\n.dx-slideout-item-content {\n  height: 100%;\n  width: 100%;\n}\n.dx-rtl .dx-slideout-menu .dx-list-item .dx-icon {\n  float: right;\n  margin-right: 0;\n  margin-left: 15px;\n}\n.dx-pager {\n  overflow: hidden;\n  width: 100%;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  line-height: normal;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-pager .dx-pages {\n  float: right;\n}\n.dx-pager .dx-pages .dx-page {\n  display: inline-block;\n  cursor: pointer;\n  padding: 7px 8px 8px;\n  margin-left: 5px;\n  margin-right: 1px;\n}\n.dx-pager .dx-pages .dx-page:first-child {\n  margin-left: 1px;\n}\n.dx-pager .dx-pages .dx-separator {\n  display: inline-block;\n  padding-left: 8px;\n  padding-right: 8px;\n}\n.dx-pager .dx-pages .dx-info {\n  display: inline-block;\n  margin-right: 9px;\n  opacity: .6;\n}\n.dx-pager .dx-pages .dx-navigate-button {\n  width: 10px;\n  height: 20px;\n  cursor: pointer;\n  display: inline-block;\n  vertical-align: top;\n  padding: 7px 13px;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-pager .dx-pages .dx-navigate-button.dx-button-disable {\n  opacity: .3;\n  cursor: inherit;\n}\n.dx-pager .dx-pages .dx-prev-button,\n.dx-pager .dx-pages .dx-next-button {\n  position: relative;\n}\n.dx-pager .dx-page-sizes {\n  float: left;\n}\n.dx-pager .dx-page-sizes .dx-page-size {\n  display: inline-block;\n  cursor: pointer;\n  padding-left: 10px;\n  padding-right: 9px;\n  padding-top: 7px;\n  padding-bottom: 8px;\n  margin-left: 4px;\n  margin-right: 1px;\n}\n.dx-pager .dx-page-sizes .dx-page-size:first-child {\n  margin-left: 1px;\n}\n.dx-pager .dx-pages .dx-selection,\n.dx-pager .dx-page-sizes .dx-selection {\n  cursor: inherit;\n  text-shadow: none;\n}\n.dx-pager .dx-light-pages {\n  display: inline-block;\n}\n.dx-pager .dx-light-pages .dx-page-index {\n  width: 40px;\n}\n.dx-pager .dx-light-pages .dx-pages-count {\n  cursor: pointer;\n}\n.dx-pager .dx-light-pages .dx-info-text,\n.dx-pager .dx-light-pages .dx-pages-count {\n  padding-left: 6px;\n}\n.dx-pager .dx-light-pages .dx-page-index,\n.dx-pager .dx-light-pages .dx-info-text,\n.dx-pager .dx-light-pages .dx-pages-count {\n  display: table-cell;\n}\n.dx-rtl .dx-pager .dx-pages,\n.dx-pager.dx-rtl .dx-pages {\n  float: left;\n  direction: ltr;\n}\n.dx-rtl .dx-pager .dx-pages .dx-page,\n.dx-pager.dx-rtl .dx-pages .dx-page {\n  direction: ltr;\n}\n.dx-rtl .dx-pager .dx-page-sizes,\n.dx-pager.dx-rtl .dx-page-sizes {\n  float: right;\n}\n.dx-colorview-container {\n  width: 450px;\n  overflow: hidden;\n}\n.dx-colorview-container label {\n  display: block;\n  overflow: hidden;\n  line-height: 36px;\n  font-weight: normal;\n  margin: 0;\n  white-space: normal;\n}\n.dx-colorview-container label.dx-colorview-label-hex {\n  margin: 10px 0 0 0;\n}\n.dx-colorview-container label.dx-colorview-alpha-channel-label {\n  margin-left: 43px;\n  width: 115px;\n}\n.dx-colorview-container label .dx-texteditor {\n  width: 69px;\n  float: right;\n  margin: 1px 1px 10px 0;\n}\n.dx-colorview-container .dx-button {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n.dx-colorview-container .dx-button.dx-colorview-apply-button {\n  margin-right: 10px;\n  margin-left: 0;\n}\n.dx-colorview-container .dx-button.dx-colorview-cancel-button {\n  margin-right: 0;\n  margin-left: 0;\n}\n.dx-colorview-container-row {\n  overflow: hidden;\n  padding-top: 1px;\n}\n.dx-colorview-container-row:first-child {\n  margin-top: 0;\n}\n.dx-colorview-container-row.dx-colorview-alpha-channel-row {\n  margin-top: 10px;\n}\n.dx-colorview-container-cell {\n  float: left;\n}\n.dx-colorview-palette-handle {\n  width: 28px;\n  height: 28px;\n  top: 0;\n  left: 0;\n  cursor: crosshair;\n  border-radius: 100%;\n  z-index: 5;\n}\n.dx-colorview-hue-scale-handle,\n.dx-colorview-alpha-channel-handle {\n  position: absolute;\n  cursor: pointer;\n}\n.dx-colorview-hue-scale-handle {\n  width: 36px;\n  height: 17px;\n  top: 0;\n  left: -7px;\n}\n.dx-colorview-alpha-channel-handle {\n  width: 17px;\n  height: 36px;\n  top: -6px;\n  left: 0;\n}\n.dx-colorview-hue-scale {\n  position: relative;\n  width: 18px;\n  height: 299px;\n  background-repeat: no-repeat;\n  background-image: -webkit-linear-gradient(bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n  background-image: -moz-linear-gradient(bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n  background-image: -ms-linear-gradient(bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n  background-image: -o-linear-gradient(bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n}\n.dx-colorview-color-preview-container-inner,\n.dx-colorview-alpha-channel-wrapper,\n.dx-colorbox-input-container::after {\n  background-image: -webkit-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc), -webkit-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc);\n  background-image: -moz-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc), -moz-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc);\n  background-image: -ms-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc), -ms-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc);\n  background-image: -o-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc), -o-linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc);\n  background-image: linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc), linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 74%,  #cccccc 75%, #cccccc);\n  background-size: 16px 16px;\n  background-position: 0 0, 8px 8px;\n}\n.dx-colorview-alpha-channel-wrapper {\n  background-position: 0px 6px, 8px 14px;\n}\n.dx-colorbox-input-container {\n  height: 100%;\n}\n.dx-colorview-palette-gradient-white {\n  background-repeat: no-repeat;\n  background-image: -webkit-linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));\n  background-image: -moz-linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));\n  background-image: -ms-linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));\n  background-image: -o-linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));\n}\n.dx-colorview-palette-gradient-black {\n  background-repeat: no-repeat;\n  background-image: -webkit-linear-gradient(-90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));\n  background-image: -moz-linear-gradient(-90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));\n  background-image: -ms-linear-gradient(-90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));\n  background-image: -o-linear-gradient(-90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));\n}\n.dx-colorview-palette {\n  position: relative;\n  overflow: hidden;\n  width: 288px;\n  height: 299px;\n  cursor: crosshair;\n}\n.dx-colorview-palette-gradient {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n.dx-colorview-alpha-channel-scale {\n  width: 288px;\n  height: 20px;\n  position: relative;\n}\n.dx-colorview-hue-scale-cell {\n  margin-left: 19px;\n  position: relative;\n}\n.dx-colorview-hue-scale-wrapper {\n  height: 301px;\n}\n.dx-colorview-controls-container {\n  position: relative;\n  width: 90px;\n  margin-left: 27px;\n}\n.dx-colorview-color-preview {\n  width: 86px;\n  height: 40px;\n}\n.dx-colorview-alpha-channel-cell {\n  margin: 6px 0;\n  position: relative;\n  width: 292px;\n}\n.dx-colorview-alpha-channel-cell .dx-button {\n  width: 90px;\n}\n.dx-rtl .dx-colorview-container-row .dx-colorview-container-cell {\n  float: right;\n}\n.dx-rtl .dx-colorview-hue-scale-cell {\n  margin-right: 19px;\n  margin-left: 0;\n}\n.dx-rtl .dx-colorview-container label.dx-colorview-alpha-channel-label {\n  margin-right: 41px;\n  margin-left: 0;\n}\n.dx-rtl .dx-colorview-container label .dx-texteditor {\n  float: left;\n}\n.dx-rtl .dx-colorview-controls-container {\n  margin-right: 25px;\n  margin-left: 0;\n}\n.dx-rtl .dx-colorview-alpha-channel-scale {\n  direction: ltr;\n}\n.dx-colorbox-input-container:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: 50%;\n  z-index: 1;\n  width: 15px;\n  height: 15px;\n  margin-top: -7.5px;\n  left: 14px;\n}\n.dx-colorbox-input-container.dx-colorbox-color-is-not-defined:after {\n  background: none;\n}\n.dx-colorbox-input-container.dx-colorbox-color-is-not-defined .dx-colorbox-color-result-preview {\n  border: none;\n}\n.dx-colorbox-color-result-preview {\n  position: absolute;\n  top: 50%;\n  z-index: 2;\n  width: 17px;\n  height: 17px;\n  margin-top: -8.5px;\n  left: 13px;\n  border: 1px solid;\n}\n.dx-colorbox-input-container .dx-colorbox-input {\n  -webkit-appearance: none;\n  padding-left: 40px;\n}\n.dx-colorbox-overlay {\n  padding: 20px;\n}\n.dx-colorbox-overlay .dx-popup-content {\n  overflow: hidden;\n  padding: 0;\n}\n.dx-colorbox-overlay .dx-popup-bottom .dx-toolbar-item:first-child {\n  padding-right: 10px;\n}\n.dx-colorbox-overlay .dx-colorview-buttons-container .dx-button {\n  margin: 0;\n}\n.dx-rtl .dx-colorbox .dx-placeholder,\n.dx-rtl.dx-colorbox .dx-placeholder {\n  right: 32px;\n}\n.dx-rtl .dx-colorbox.dx-dropdowneditor .dx-colorbox-input.dx-texteditor-input,\n.dx-rtl.dx-colorbox.dx-dropdowneditor .dx-colorbox-input.dx-texteditor-input {\n  direction: ltr;\n  text-align: end;\n  padding-right: 40px;\n}\n.dx-rtl .dx-colorbox.dx-dropdowneditor .dx-colorbox-color-result-preview,\n.dx-rtl.dx-colorbox.dx-dropdowneditor .dx-colorbox-color-result-preview {\n  left: auto;\n  right: 13px;\n}\n.dx-rtl .dx-colorbox.dx-dropdowneditor .dx-colorbox-input-container:after,\n.dx-rtl.dx-colorbox.dx-dropdowneditor .dx-colorbox-input-container:after {\n  left: auto;\n  right: 14px;\n}\n.dx-datagrid-checkbox-size {\n  vertical-align: middle;\n}\n.dx-datagrid-important-margin {\n  margin-right: 5px !important;\n}\n.dx-datagrid-table {\n  background-color: transparent;\n}\n.dx-datagrid {\n  position: relative;\n  cursor: default;\n  white-space: normal;\n  line-height: normal;\n}\n.dx-datagrid .dx-datagrid-content-fixed {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  z-index: 2;\n  pointer-events: none;\n  overflow: hidden;\n}\n.dx-datagrid .dx-datagrid-content-fixed .dx-datagrid-table {\n  position: relative;\n}\n.dx-datagrid .dx-datagrid-content-fixed .dx-datagrid-table td {\n  pointer-events: auto;\n}\n.dx-datagrid .dx-datagrid-content-fixed .dx-datagrid-table .dx-row td.dx-pointer-events-none {\n  visibility: hidden;\n  background-color: transparent;\n  pointer-events: none;\n  border-top-color: transparent;\n  border-bottom-color: transparent;\n}\n.dx-datagrid .dx-datagrid-content-fixed .dx-datagrid-table.dx-datagrid-table-fixed .dx-row td.dx-pointer-events-none {\n  width: auto;\n}\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-total-footer {\n  border-top: 0;\n}\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-pager {\n  margin-top: 1px;\n}\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-header-panel {\n  border-bottom: 0;\n}\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-rowsview.dx-last-row-border tbody:last-child > .dx-data-row:nth-last-child(2) > td {\n  border-bottom-width: 0;\n}\n.dx-datagrid .dx-menu-horizontal {\n  height: 100%;\n}\n.dx-datagrid .dx-menu-horizontal .dx-menu-item-text,\n.dx-datagrid .dx-menu-horizontal .dx-menu-item-popout {\n  display: none;\n}\n.dx-datagrid .dx-menu-subitem ul li {\n  padding-top: 0;\n}\n.dx-datagrid .dx-menu-subitem ul li:first-child {\n  padding-top: 1px;\n}\n.dx-datagrid .dx-menu-subitem .dx-menu-item {\n  padding: 7px 30px 7px 5px;\n}\n.dx-datagrid .dx-menu-subitem .dx-menu-item .dx-menu-image {\n  background-position-x: left;\n}\n@-webkit-keyframes dx-loadpanel-opacity {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes dx-loadpanel-opacity {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.dx-datagrid .dx-link {\n  text-decoration: underline;\n  cursor: pointer;\n}\n.dx-datagrid .dx-column-indicators {\n  display: inline-block;\n  vertical-align: top;\n  white-space: nowrap;\n}\n.dx-datagrid .dx-column-indicators.dx-visibility-hidden {\n  visibility: hidden;\n}\n.dx-datagrid .dx-column-indicators .dx-sort.dx-sort,\n.dx-datagrid .dx-column-indicators .dx-header-filter.dx-sort,\n.dx-datagrid .dx-column-indicators .dx-sort.dx-header-filter,\n.dx-datagrid .dx-column-indicators .dx-header-filter.dx-header-filter {\n  display: inline-block;\n}\n.dx-datagrid .dx-column-indicators .dx-sort.dx-header-filter:after,\n.dx-datagrid .dx-column-indicators .dx-header-filter.dx-header-filter:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: -7px;\n}\n.dx-datagrid .dx-row > td {\n  padding: 7px;\n}\n.dx-datagrid .dx-error-row {\n  -webkit-user-select: initial;\n  -khtml-user-select: initial;\n  -moz-user-select: initial;\n  -ms-user-select: initial;\n  -o-user-select: initial;\n  user-select: initial;\n}\n.dx-datagrid .dx-column-lines > td:first-child {\n  border-left: none;\n}\n.dx-datagrid .dx-column-lines > td:last-child {\n  border-right: none;\n}\n.dx-datagrid-column-chooser .dx-overlay-content .dx-popup-title {\n  border-bottom: none;\n  font-size: 16px;\n}\n.dx-datagrid-column-chooser .dx-overlay-content .dx-popup-title .dx-toolbar-label {\n  font-size: 16px;\n}\n.dx-datagrid-column-chooser .dx-overlay-content .dx-popup-content {\n  padding: 0px 20px 20px 20px;\n}\n.dx-datagrid-column-chooser .dx-overlay-content .dx-popup-content .dx-column-chooser-item {\n  opacity: 0.5;\n  margin-bottom: 10px;\n  -webkit-box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.2);\n  -moz-box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.2);\n  box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.2);\n}\n.dx-datagrid-column-chooser .dx-overlay-content .dx-popup-content .dx-column-chooser-item.dx-datagrid-drag-action {\n  opacity: 1;\n  cursor: pointer;\n}\n.dx-datagrid-column-chooser.dx-datagrid-column-chooser-mode-drag .dx-treeview-node-container:first-child > .dx-treeview-node-is-leaf {\n  padding: 0px;\n}\n.dx-datagrid-nowrap {\n  white-space: nowrap;\n}\n.dx-datagrid-nowrap.dx-datagrid-headers .dx-header-row > td > .dx-datagrid-text-content {\n  white-space: nowrap;\n}\n.dx-datagrid-drag-header {\n  position: absolute;\n  vertical-align: middle;\n  cursor: pointer;\n  z-index: 10000;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-datagrid-columns-separator {\n  position: absolute;\n  z-index: 3;\n  width: 3px;\n}\n.dx-datagrid-columns-separator-transparent {\n  border-left: 0;\n  border-right: 0;\n}\n.dx-datagrid-tracker {\n  width: 100%;\n  position: absolute;\n  top: 0;\n  z-index: 3;\n  cursor: col-resize;\n}\n.dx-datagrid-table-content {\n  position: absolute;\n  top: 0;\n}\n.dx-datagrid-focus-overlay {\n  position: absolute;\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  visibility: hidden;\n}\n.dx-datagrid-action,\n.dx-datagrid-drag-action {\n  cursor: pointer;\n}\n.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-modified):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row) > td:not(.dx-focused) .dx-link {\n  color: inherit;\n}\n.dx-datagrid-content {\n  position: relative;\n}\n.dx-datagrid-text-content {\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n}\n.dx-datagrid-table-fixed {\n  table-layout: fixed;\n  width: 100%;\n}\n.dx-hidden {\n  display: none;\n}\n.dx-hidden.dx-group-cell {\n  display: table-cell !important;\n  font-size: 0 !important;\n}\ninput.dx-hidden {\n  display: inline-block !important;\n  width: 0 !important;\n}\n.dx-row > td {\n  border: none;\n}\n.dx-datagrid-content .dx-datagrid-table {\n  border-collapse: collapse;\n  border-spacing: 0;\n  margin: 0;\n  max-width: 10px;\n}\n.dx-datagrid-content .dx-datagrid-table.dx-datagrid-table-fixed {\n  max-width: none;\n}\n.dx-datagrid-content .dx-datagrid-table.dx-datagrid-table-fixed .dx-column-indicators .dx-sort.dx-sort-none {\n  display: none;\n}\n.dx-datagrid-content .dx-datagrid-table:not(.dx-datagrid-table-fixed) .dx-column-indicators {\n  float: none !important;\n}\n.dx-datagrid-content .dx-datagrid-table:not(.dx-datagrid-table-fixed) .dx-column-indicators > span {\n  width: 14px;\n}\n.dx-datagrid-content .dx-datagrid-table:not(.dx-datagrid-table-fixed) .dx-text-content-alignment-left {\n  margin-right: 3px;\n}\n.dx-datagrid-content .dx-datagrid-table:not(.dx-datagrid-table-fixed) .dx-text-content-alignment-right {\n  margin-left: 3px;\n}\n.dx-datagrid-content .dx-datagrid-table [class*=\"column\"] + [class*=\"column\"]:last-child {\n  float: none;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row > td {\n  vertical-align: top;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row > td:first-child {\n  border-left: 0px;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row > td.dx-datagrid-group-space {\n  border-right: none;\n  vertical-align: middle;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row > td.dx-datagrid-group-space + td {\n  border-left: none;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-container {\n  overflow: hidden;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-cell-modified:not(.dx-field-item-content),\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-datagrid-invalid:not(.dx-field-item-content) {\n  padding: 0;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-datagrid-invalid .dx-invalid-message.dx-overlay {\n  position: static;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell {\n  padding: 0;\n  vertical-align: middle;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell .dx-texteditor,\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell .dx-texteditor-container {\n  border: 0;\n  margin: 0;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell .dx-dropdowneditor {\n  margin-left: -1px;\n  padding-left: 1px;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-command-select {\n  padding: 0;\n  width: 70px;\n  min-width: 70px;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-command-edit {\n  width: 85px;\n  min-width: 85px;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-row .dx-command-expand {\n  padding: 0;\n  width: 30px;\n  min-width: 30px;\n}\n.dx-datagrid-content .dx-datagrid-table .dx-filter-range-content {\n  padding: 7px 7px 7px 32px;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  cursor: pointer;\n}\n.dx-datagrid-content .dx-datagrid-table td {\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-highlight-outline {\n  position: relative;\n  padding: 7px;\n}\n.dx-highlight-outline::after {\n  content: '';\n  position: absolute;\n  border: 2px solid transparent;\n  top: 0;\n  left: 1px;\n  bottom: 0;\n  right: 0;\n  pointer-events: none;\n}\n.dx-highlight-outline.dx-hidden {\n  display: block !important;\n}\n.dx-highlight-outline.dx-hidden::after {\n  display: none;\n}\n.dx-editor-cell .dx-texteditor-input {\n  margin: 0;\n}\n.dx-editor-cell .dx-highlight-outline {\n  padding: 0;\n}\n.dx-editor-cell.dx-editor-inline-block .dx-highlight-outline::before {\n  display: inline-block;\n  content: '\\200B';\n  vertical-align: middle;\n  padding-top: 7px;\n  padding-bottom: 7px;\n}\n.dx-column-lines .dx-highlight-outline::after {\n  left: 0;\n}\n.dx-datagrid-headers {\n  position: relative;\n  outline: 0;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n.dx-datagrid-headers .dx-header-row .dx-editor-cell .dx-select-checkbox {\n  display: inline-block;\n}\n.dx-datagrid-headers .dx-header-row > td {\n  white-space: nowrap;\n  overflow: hidden;\n}\n.dx-datagrid-headers .dx-header-row > td > .dx-datagrid-text-content {\n  white-space: normal;\n  vertical-align: top;\n}\n.dx-header-row .dx-text-content-alignment-left,\n.dx-header-row .dx-text-content-alignment-right {\n  display: inline-block;\n  max-width: 100%;\n}\n.dx-header-row .dx-sort-indicator,\n.dx-header-row .dx-header-filter-indicator {\n  max-width: calc(100% -  17px);\n}\n.dx-header-row .dx-sort-indicator.dx-text-content-alignment-left,\n.dx-header-row .dx-header-filter-indicator.dx-text-content-alignment-left {\n  margin-right: 3px;\n}\n.dx-header-row .dx-sort-indicator.dx-text-content-alignment-right,\n.dx-header-row .dx-header-filter-indicator.dx-text-content-alignment-right {\n  margin-left: 3px;\n}\n.dx-header-row .dx-sort-indicator.dx-text-content-alignment-left.dx-text-content-alignment-right,\n.dx-header-row .dx-header-filter-indicator.dx-text-content-alignment-left.dx-text-content-alignment-right {\n  max-width: calc(100% -  34px);\n}\n.dx-header-row .dx-sort-indicator.dx-header-filter-indicator {\n  max-width: calc(100% -  31px);\n}\n.dx-header-row .dx-sort-indicator.dx-header-filter-indicator.dx-text-content-alignment-left.dx-text-content-alignment-right {\n  max-width: calc(100% -  62px);\n}\n.dx-datagrid-filter-range-overlay .dx-texteditor {\n  border-width: 0px;\n}\n.dx-datagrid-filter-range-overlay .dx-texteditor.dx-state-focused:after {\n  content: \" \";\n  position: absolute;\n  top: -1px;\n  bottom: -1px;\n  left: -1px;\n  right: -1px;\n  z-index: 1;\n  pointer-events: none;\n}\n.dx-datagrid-filter-range-overlay .dx-datagrid-filter-range-end {\n  border-top: 1px solid transparent;\n}\n.dx-datagrid-filter-range-overlay .dx-editor-container.dx-highlight-outline {\n  padding: 0px;\n}\n.dx-datagrid-filter-row .dx-editor-cell .dx-menu {\n  display: none;\n}\n.dx-datagrid-filter-row .dx-editor-cell .dx-editor-with-menu {\n  position: relative;\n}\n.dx-datagrid-filter-row .dx-editor-cell .dx-editor-with-menu .dx-menu {\n  display: block;\n}\n.dx-datagrid-filter-row .dx-editor-cell .dx-editor-with-menu .dx-texteditor-input,\n.dx-datagrid-filter-row .dx-editor-cell .dx-editor-with-menu .dx-placeholder:before {\n  padding-left: 32px;\n}\n.dx-datagrid-filter-row .dx-highlight-outline::after {\n  pointer-events: none;\n}\n.dx-datagrid-filter-row .dx-focused .dx-highlight-outline::after {\n  border-color: transparent;\n}\n.dx-datagrid-filter-row .dx-menu {\n  z-index: 1;\n  position: absolute;\n  top: 0;\n  left: 0;\n  cursor: pointer;\n  margin-left: -2px;\n  margin-top: -2px;\n  height: 100%;\n}\n.dx-datagrid-filter-row .dx-menu-item.dx-state-focused:after {\n  position: absolute;\n  left: 2px;\n  top: 2px;\n  width: 100%;\n  height: 102%;\n  content: '';\n}\n.dx-datagrid-filter-row > td:first-child .dx-menu,\n.dx-datagrid-filter-row > .dx-first-cell .dx-menu {\n  margin-left: 0px;\n}\n.dx-datagrid-filter-row .dx-menu-horizontal .dx-overlay-content ul .dx-menu-item {\n  padding: 5px;\n  padding-right: 30px;\n}\n.dx-datagrid-filter-row .dx-menu ul.dx-menu-horizontal > li > .dx-menu-item {\n  padding: 8px 5px 7px 5px;\n}\n.dx-datagrid-filter-row .dx-menu ul.dx-menu-horizontal > li > .dx-menu-item.dx-state-disabled:hover {\n  padding: 9px 6px 8px 6px;\n}\n.dx-datagrid-filter-row .dx-menu-caption {\n  padding-left: 6px;\n}\n.dx-datagrid-filter-row .dx-menu ul .dx-menu-item .dx-menu-chouser-down {\n  display: none;\n}\n.dx-datagrid-filter-row .dx-menu-item-highlight {\n  font-weight: normal;\n}\n.dx-datagrid-filter-row .dx-menu {\n  overflow: visible;\n}\n.dx-datagrid-scroll-container {\n  overflow: hidden;\n  width: 100%;\n}\n.dx-datagrid-header-panel {\n  text-align: left;\n  overflow: hidden;\n}\n.dx-datagrid-header-panel .dx-toolbar-menu-container .dx-button {\n  margin-left: 10px;\n}\n.dx-datagrid-group-panel {\n  display: inline-block;\n  white-space: nowrap;\n  -ms-touch-action: pinch-zoom;\n  touch-action: pinch-zoom;\n}\n.dx-datagrid-group-panel .dx-group-panel-item {\n  display: inline-block;\n  min-width: 30px;\n  margin-right: 10px;\n  white-space: nowrap;\n}\n.dx-datagrid-group-panel .dx-group-panel-item .dx-sort {\n  margin-left: 6px;\n}\n.dx-datagrid-group-panel .dx-block-separator {\n  display: inline-block;\n  min-width: 30px;\n  margin-right: 10px;\n  white-space: nowrap;\n  color: transparent;\n  position: relative;\n  min-width: 0;\n}\n.dx-datagrid-group-panel .dx-block-separator .dx-sort {\n  margin-left: 6px;\n}\n.dx-state-disabled .dx-datagrid-action,\n.dx-state-disabled .dx-menu-item {\n  cursor: default;\n}\n.dx-datagrid-search-panel {\n  margin: 0;\n  margin-left: 15px;\n}\n.dx-datagrid-rowsview {\n  position: relative;\n  overflow: hidden;\n}\n.dx-datagrid-rowsview.dx-scrollable .dx-scrollable-content {\n  z-index: 2;\n}\n.dx-datagrid-rowsview .dx-datagrid-content {\n  overflow-anchor: none;\n}\n.dx-datagrid-rowsview .dx-scrollable-scrollbar {\n  z-index: 3;\n}\n.dx-datagrid-rowsview:focus {\n  outline: 0;\n}\n.dx-datagrid-rowsview .dx-row > td {\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n}\n.dx-datagrid-rowsview .dx-row.dx-group-row td {\n  border-top: 1px solid;\n  border-bottom: 1px solid;\n}\n.dx-datagrid-rowsview .dx-row.dx-group-row:first-child td {\n  border-top: none;\n}\n.dx-datagrid-rowsview .dx-row.dx-row-lines:first-child {\n  border-top: none;\n}\n.dx-datagrid-rowsview .dx-row.dx-row-lines:first-child > td {\n  border-top: none;\n}\n.dx-datagrid-rowsview .dx-group-row:focus {\n  outline: 0;\n}\n.dx-datagrid-rowsview .dx-group-row.dx-row > td {\n  border-left-color: transparent;\n  border-right-color: transparent;\n}\n.dx-datagrid-rowsview .dx-data-row > td:focus {\n  outline: 0;\n}\n.dx-datagrid-rowsview .dx-selection > td .dx-link,\n.dx-datagrid-rowsview .dx-selection.dx-row:hover > td .dx-link {\n  color: inherit;\n}\n.dx-datagrid-rowsview .dx-datagrid-table .dx-freespace-row {\n  border-top: 0px;\n  border-bottom: 0px;\n}\n.dx-datagrid-rowsview .dx-datagrid-table .dx-freespace-row > td {\n  padding-top: 0px;\n  padding-bottom: 0px;\n}\n.dx-datagrid-rowsview .dx-select-checkboxes-hidden > tbody > tr > td > .dx-select-checkbox {\n  display: none;\n}\n.dx-datagrid-rowsview .dx-select-checkboxes-hidden > tbody > tr > td:hover > .dx-select-checkbox {\n  display: inline-block;\n}\n.dx-datagrid-rowsview .dx-select-checkboxes-hidden > tbody > tr.dx-selection > td > .dx-select-checkbox {\n  display: inline-block;\n}\n.dx-datagrid-rowsview .dx-row > .dx-master-detail-cell {\n  padding: 30px;\n  padding-left: 0;\n}\n.dx-datagrid-rowsview .dx-row > .dx-master-detail-cell:first-child {\n  padding-left: 30px;\n}\n.dx-datagrid-rowsview .dx-row > .dx-master-detail-cell:focus {\n  outline: 0;\n}\n.dx-datagrid-rowsview .dx-data-row.dx-edit-row .dx-cell-modified .dx-highlight-outline:after {\n  border-color: transparent;\n}\n.dx-datagrid-rowsview .dx-command-adaptive.dx-command-adaptive-hidden {\n  padding-left: 0;\n  padding-right: 0;\n}\n.dx-datagrid-group-opened,\n.dx-datagrid-group-closed {\n  cursor: pointer;\n  position: relative;\n}\n.dx-datagrid-group-opened:before,\n.dx-datagrid-group-closed:before {\n  position: absolute;\n  display: block;\n  right: 0;\n  left: 0;\n}\n.dx-datagrid-nodata {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n.dx-datagrid-bottom-load-panel {\n  text-align: center;\n  padding: 10px;\n}\n.dx-datagrid-hidden-column {\n  white-space: nowrap;\n}\n.dx-datagrid-hidden-column > * {\n  display: none !important;\n}\n.dx-datagrid-total-footer {\n  position: relative;\n}\n.dx-datagrid-total-footer > .dx-datagrid-content {\n  padding-top: 7px;\n  padding-bottom: 7px;\n}\n.dx-datagrid-summary-item {\n  font-weight: bold;\n}\n.dx-datagrid-export-menu .dx-menu-item .dx-checkbox {\n  margin-left: 0;\n}\n.dx-datagrid-export-menu .dx-menu-item .dx-checkbox .dx-checkbox-icon {\n  width: 16px;\n  height: 16px;\n}\n.dx-datagrid-export-menu .dx-menu-item .dx-checkbox .dx-checkbox-text {\n  white-space: nowrap;\n  -ms-word-break: normal;\n  word-break: normal;\n}\n.dx-command-adaptive {\n  width: 21px;\n  min-width: 21px;\n}\n.dx-datagrid-revert-tooltip.dx-popover-wrapper .dx-overlay-content {\n  border: none;\n  -webkit-box-shadow: none;\n  -moz-box-shadow: none;\n  box-shadow: none;\n}\n.dx-datagrid-revert-tooltip.dx-popover-wrapper .dx-overlay-content .dx-popup-content {\n  padding: 0;\n}\n.dx-datagrid-revert-tooltip.dx-popover-wrapper .dx-popover-arrow {\n  width: 0;\n  height: 0;\n}\n.dx-datagrid-revert-tooltip .dx-revert-button {\n  margin: 0;\n}\n.dx-datagrid-notouch-action {\n  -ms-touch-action: none;\n  touch-action: none;\n  -ms-content-zooming: none;\n  -ms-overflow-style: none;\n}\n.dx-device-mobile .dx-datagrid-column-chooser-list.dx-treeview .dx-treeview-item,\n.dx-datagrid-column-chooser-list.dx-treeview .dx-treeview-item,\n.dx-device-mobile .dx-datagrid-column-chooser-list.dx-treeview .dx-empty-message,\n.dx-datagrid-column-chooser-list.dx-treeview .dx-empty-message {\n  border: none;\n}\n.dx-device-mobile .dx-datagrid-column-chooser-list.dx-treeview .dx-empty-message,\n.dx-datagrid-column-chooser-list.dx-treeview .dx-empty-message {\n  text-align: center;\n  left: 0px;\n  right: 0px;\n  bottom: 50%;\n  position: absolute;\n}\n.dx-rtl .dx-datagrid .dx-menu-subitem .dx-menu-item,\n.dx-datagrid.dx-rtl .dx-menu-subitem .dx-menu-item {\n  padding: 7px 5px 7px 30px;\n}\n.dx-rtl .dx-datagrid .dx-menu-subitem .dx-menu-item .dx-menu-image,\n.dx-datagrid.dx-rtl .dx-menu-subitem .dx-menu-item .dx-menu-image {\n  background-position-x: right;\n}\n.dx-rtl .dx-datagrid .dx-texteditor-buttons-container,\n.dx-datagrid.dx-rtl .dx-texteditor-buttons-container {\n  text-align: start;\n}\n.dx-rtl .dx-datagrid-group-closed {\n  -moz-transform: scaleX(-1);\n  -o-transform: scaleX(-1);\n  -webkit-transform: scaleX(-1);\n  transform: scaleX(-1);\n}\n.dx-rtl .dx-datagrid .dx-column-lines > td:first-child {\n  border-right: none;\n}\n.dx-rtl .dx-datagrid .dx-column-lines > td:last-child {\n  border-left: none;\n}\n.dx-rtl .dx-datagrid-content .dx-datagrid-table {\n  direction: rtl;\n}\n.dx-rtl .dx-datagrid-content .dx-datagrid-table .dx-row > td.dx-datagrid-group-space {\n  border-left: none;\n}\n.dx-rtl .dx-datagrid-content .dx-datagrid-table .dx-row > td.dx-datagrid-group-space + td {\n  border-right: none;\n}\n.dx-rtl .dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-container .dx-editor-cell .dx-checkbox.dx-checkbox-checked .dx-checkbox-icon {\n  -moz-transform: scaleX(-1);\n  -o-transform: scaleX(-1);\n  -webkit-transform: scaleX(-1);\n  transform: scaleX(-1);\n}\n.dx-rtl .dx-datagrid-content .dx-datagrid-table .dx-row .dx-filter-range-content {\n  padding: 7px 32px 7px 7px;\n}\n.dx-rtl .dx-datagrid-content .dx-datagrid-table .dx-group-row.dx-row.dx-column-lines > td {\n  border-left: none;\n  border-right: none;\n}\n.dx-rtl .dx-datagrid-headers,\n.dx-rtl .dx-datagrid-total-footer {\n  direction: ltr;\n}\n.dx-rtl .dx-datagrid-headers .dx-datagrid-table,\n.dx-rtl .dx-datagrid-total-footer .dx-datagrid-table {\n  direction: rtl;\n}\n.dx-rtl .dx-datagrid-filter-row .dx-editor-cell .dx-editor-with-menu .dx-texteditor .dx-texteditor-input,\n.dx-rtl .dx-datagrid-filter-row .dx-editor-cell .dx-editor-with-menu .dx-texteditor .dx-placeholder:before {\n  padding-right: 32px;\n}\n.dx-rtl .dx-datagrid-filter-row .dx-menu {\n  right: 0;\n  left: auto;\n  margin-left: 0;\n  margin-right: -2px;\n}\n.dx-rtl .dx-datagrid-filter-row > td:first-child .dx-menu {\n  margin-left: 0px;\n}\n.dx-rtl .dx-datagrid-filter-row .dx-menu-horizontal .dx-overlay-content ul .dx-menu-item {\n  padding: 5px;\n  padding-left: 30px;\n}\n.dx-rtl .dx-datagrid-filter-row .dx-menu-caption {\n  padding-right: 6px;\n}\n.dx-rtl .dx-datagrid-header-panel {\n  text-align: right;\n}\n.dx-rtl .dx-datagrid-header-panel .dx-datagrid-column-chooser-button {\n  margin-left: 0;\n}\n.dx-rtl .dx-datagrid-header-panel .dx-toolbar-menu-container .dx-button {\n  margin-left: 0;\n  margin-right: 10px;\n}\n.dx-rtl .dx-datagrid-group-panel .dx-group-panel-item,\n.dx-rtl .dx-datagrid-group-panel .dx-block-separator {\n  margin-right: 0;\n  margin-left: 10px;\n}\n.dx-rtl .dx-datagrid-group-panel .dx-sort {\n  margin-left: 0;\n  margin-right: 6px;\n}\n.dx-rtl .dx-datagrid-search-panel {\n  margin: 0;\n  margin-right: 15px;\n}\n.dx-pivotgrid-fields-container .dx-sort,\n.dx-pivotgrid-fields-container .dx-header-filter {\n  display: inline-block;\n}\n.dx-pivotgrid-fields-container .dx-area-field-content {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.dx-pivotgrid-fields-container.dx-drag .dx-area-field-content {\n  display: inline-block;\n}\n.dx-pivotgrid-fields-container.dx-drag .dx-column-indicators {\n  float: none;\n  display: inline-block;\n}\n.dx-pivotgrid {\n  cursor: default;\n  width: 100%;\n  position: relative;\n}\n.dx-pivotgrid.dx-overflow-hidden {\n  overflow: hidden;\n}\n.dx-pivotgrid .dx-area-data-cell,\n.dx-pivotgrid .dx-area-column-cell {\n  width: 100%;\n}\n.dx-pivotgrid .dx-area-data-cell {\n  position: relative;\n}\n.dx-pivotgrid table,\n.dx-pivotgrid tbody,\n.dx-pivotgrid tfoot,\n.dx-pivotgrid thead,\n.dx-pivotgrid tr,\n.dx-pivotgrid th,\n.dx-pivotgrid td {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  outline: 0;\n}\n.dx-pivotgrid table {\n  border-collapse: collapse;\n  table-layout: auto;\n  border-spacing: 0;\n}\n.dx-pivotgrid td {\n  vertical-align: top;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-pivotgrid .dx-area-description-cell {\n  position: relative;\n  -moz-background-clip: padding-box;\n  -webkit-background-clip: padding-box;\n  background-clip: padding-box;\n}\n.dx-pivotgrid .dx-area-description-cell .dx-pivotgrid-fields-area {\n  position: absolute;\n  bottom: 0;\n}\n.dx-pivotgrid .dx-area-field-content {\n  display: inline-block;\n}\n.dx-pivotgrid .dx-column-indicators {\n  display: inline-block;\n}\n.dx-pivotgrid .dx-expand-icon-container {\n  position: relative;\n  display: inline-block;\n}\n.dx-pivotgrid .dx-incompressible-fields .dx-pivotgrid-fields-area {\n  position: static;\n}\n.dx-pivotgrid .dx-incompressible-fields .dx-column-indicators {\n  vertical-align: top;\n  float: none !important;\n}\n.dx-pivotgrid .dx-incompressible-fields .dx-area-field {\n  display: inline-block;\n  white-space: nowrap;\n}\n.dx-pivotgrid .dx-area-field {\n  white-space: nowrap;\n}\n.dx-pivotgrid .dx-area-field-content {\n  white-space: nowrap;\n}\n.dx-pivotgrid .dx-popup-content .dx-column-indicators {\n  float: none !important;\n  display: inline-block;\n}\n.dx-pivotgrid .dx-popup-content .dx-area-field-content {\n  display: inline-block;\n}\n.dx-pivotgrid .dx-pivotgrid-area {\n  white-space: nowrap;\n}\n.dx-pivotgrid .dx-pivotgrid-collapsed,\n.dx-pivotgrid .dx-pivotgrid-expanded {\n  cursor: pointer;\n}\n.dx-pivotgrid .dx-pivotgrid-collapsed .dx-expand,\n.dx-pivotgrid .dx-pivotgrid-expanded .dx-expand {\n  display: inline-block;\n}\n.dx-pivotgrid .dx-word-wrap .dx-pivotgrid-area {\n  white-space: normal;\n}\n.dx-pivotgrid .dx-word-wrap .dx-pivotgrid-collapsed,\n.dx-pivotgrid .dx-word-wrap .dx-pivotgrid-expanded,\n.dx-pivotgrid .dx-word-wrap .dx-pivotgrid-sorted {\n  white-space: nowrap;\n}\n.dx-pivotgrid .dx-word-wrap .dx-pivotgrid-collapsed > span,\n.dx-pivotgrid .dx-word-wrap .dx-pivotgrid-expanded > span,\n.dx-pivotgrid .dx-word-wrap .dx-pivotgrid-sorted > span {\n  white-space: normal;\n}\n.dx-pivotgridfieldchooser {\n  position: relative;\n}\n.dx-pivotgridfieldchooser .dx-pivotgridfieldchooser-container {\n  overflow: hidden;\n}\n.dx-pivotgridfieldchooser .dx-col {\n  width: 50%;\n  float: left;\n}\n.dx-pivotgridfieldchooser .dx-area-caption {\n  vertical-align: middle;\n}\n.dx-menu-base {\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  text-align: left;\n}\n.dx-menu-base .dx-menu-items-container,\n.dx-menu-base .dx-menu-item-wrapper {\n  margin: 0px;\n  padding: 0px;\n  border: 0px;\n  outline: 0px;\n}\n.dx-menu-base .dx-menu-items-container {\n  list-style-type: none;\n  display: inline-block;\n  white-space: nowrap;\n  cursor: pointer;\n}\n.dx-menu-base .dx-state-disabled,\n.dx-menu-base.dx-state-disabled .dx-menu-items-container {\n  cursor: default;\n}\n.dx-menu-base .dx-menu-item {\n  display: inline-block;\n  position: relative;\n  height: 100%;\n  width: 100%;\n}\n.dx-menu-base .dx-menu-item.dx-state-disabled {\n  opacity: 0.5;\n}\n.dx-menu-base .dx-menu-item .dx-menu-item-content {\n  white-space: nowrap;\n  height: 100%;\n  width: 100%;\n}\n.dx-menu-base .dx-menu-item .dx-menu-item-content .dx-icon {\n  display: inline-block;\n  vertical-align: middle;\n  border: 0px;\n}\n.dx-menu-base .dx-menu-item .dx-menu-item-content .dx-menu-item-text {\n  display: inline;\n  vertical-align: middle;\n  overflow: ellipsis;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-menu-base .dx-menu-item .dx-menu-item-content .dx-menu-item-popout-container {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 2em;\n}\n.dx-menu-base .dx-menu-item .dx-menu-item-content .dx-menu-item-popout-container .dx-menu-item-popout {\n  height: 100%;\n}\n.dx-menu-base.dx-rtl {\n  text-align: right;\n}\n.dx-menu-base.dx-rtl .dx-menu-item-popout-container {\n  left: 0;\n  right: auto;\n}\n.dx-menu {\n  position: relative;\n}\n.dx-menu-horizontal {\n  height: 100%;\n}\n.dx-menu-horizontal:after {\n  height: 100%;\n  display: inline-block;\n  content: '';\n  vertical-align: middle;\n}\n.dx-menu-horizontal .dx-menu-item-wrapper {\n  display: inline-block;\n}\n.dx-menu-horizontal .dx-menu-separator {\n  display: inline-block;\n  margin: 0px 15px 0px 0px;\n}\n.dx-menu-vertical {\n  height: 100%;\n}\n.dx-menu-vertical:after {\n  height: 100%;\n  display: inline-block;\n  content: '';\n  vertical-align: middle;\n}\n.dx-menu-vertical .dx-menu-item-wrapper {\n  display: block;\n}\n.dx-menu-vertical .dx-menu-separator {\n  margin: 0px 0px 15px 0px;\n}\n.dx-rtl.dx-menu {\n  text-align: right;\n}\n.dx-context-menu-container-border {\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  position: absolute;\n}\n.dx-context-menu-content-delimiter {\n  position: absolute;\n  display: none;\n  z-index: 2000;\n  cursor: pointer;\n}\n.dx-menu-adaptive-mode .dx-treeview .dx-treeview-toggle-item-visibility {\n  left: auto;\n  right: 0;\n}\n.dx-rtl .dx-menu-adaptive-mode .dx-treeview .dx-treeview-toggle-item-visibility,\n.dx-rtl.dx-menu-adaptive-mode .dx-treeview .dx-treeview-toggle-item-visibility {\n  left: 0;\n  right: auto;\n}\n.dx-menu-adaptive-mode .dx-treeview .dx-treeview-item {\n  cursor: pointer;\n}\n.dx-menu-adaptive-mode .dx-treeview-node-container:first-child > .dx-treeview-node {\n  padding: 1px;\n}\n.dx-menu-adaptive-mode .dx-treeview-node-container:first-child > .dx-treeview-node .dx-item-content {\n  padding-left: 15px;\n}\n.dx-rtl .dx-menu-adaptive-mode .dx-treeview-node-container:first-child > .dx-treeview-node .dx-item-content,\n.dx-rtl.dx-menu-adaptive-mode .dx-treeview-node-container:first-child > .dx-treeview-node .dx-item-content {\n  padding-right: 15px;\n}\n.dx-menu-adaptive-mode .dx-treeview-node-container:first-child > .dx-treeview-node:last-child {\n  border-bottom: none;\n}\n.dx-context-menu.dx-overlay-content {\n  overflow: inherit;\n  position: absolute;\n}\n.dx-context-menu .dx-menu-items-container {\n  padding: 1px;\n}\n.dx-context-menu .dx-menu-item .dx-submenu {\n  position: absolute;\n  z-index: 1003;\n}\n.dx-context-menu .dx-menu-separator {\n  height: 1px;\n  margin: 5px 0px;\n}\n.dx-calendar {\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  position: relative;\n  display: block;\n}\n.dx-calendar.dx-calendar-with-footer .dx-calendar-footer {\n  position: absolute;\n  bottom: 0;\n}\n.dx-calendar-views-wrapper {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n.dx-calendar-navigator {\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n.dx-calendar-navigator .dx-button {\n  position: absolute;\n  display: inline-block;\n}\n.dx-calendar-navigator .dx-button.dx-calendar-disabled-navigator-link {\n  visibility: hidden;\n}\n.dx-calendar-navigator .dx-calendar-caption-button {\n  text-decoration: none;\n}\n.dx-calendar-body {\n  overflow: hidden;\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.dx-calendar-body .dx-widget {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.dx-calendar-body table {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  direction: ltr;\n}\n.dx-calendar-body td {\n  cursor: pointer;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.dx-calendar-cell {\n  white-space: normal;\n}\n.dx-calendar-contoured-date {\n  outline-offset: -1px;\n}\n.dx-rtl.dx-calendar .dx-calendar-body table {\n  left: 0px;\n}\n.dx-rtl.dx-calendar .dx-calendar-body .dx-widget {\n  direction: ltr;\n}\n.dx-state-disabled .dx-calendar .dx-calendar-navigator-previous-month,\n.dx-state-disabled.dx-calendar .dx-calendar-navigator-previous-month,\n.dx-state-disabled .dx-calendar .dx-calendar-navigator-next-month,\n.dx-state-disabled.dx-calendar .dx-calendar-navigator-next-month {\n  cursor: default;\n}\n.dx-state-disabled .dx-calendar-body table th,\n.dx-state-disabled .dx-calendar-body table td {\n  cursor: default;\n}\n.dx-multiview-wrapper {\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  -ms-touch-action: pinch-zoom;\n  touch-action: pinch-zoom;\n}\n.dx-multiview-item-container {\n  position: relative;\n  overflow: visible;\n  width: 100%;\n  height: 100%;\n}\n.dx-multiview-item-container .dx-empty-message {\n  text-align: center;\n}\n.dx-multiview-item {\n  position: absolute;\n  overflow: hidden;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.dx-multiview-item.dx-item-selected {\n  position: relative;\n}\n.dx-multiview-item-content {\n  width: 100%;\n  height: 100%;\n}\n.dx-multiview-item-hidden {\n  top: -9999px;\n  left: -9999px;\n  visibility: hidden;\n}\n.dx-treeview-loadindicator-wrapper {\n  text-align: center;\n}\n.dx-treeview-node-loadindicator {\n  position: absolute;\n}\n.dx-treeview {\n  height: 100%;\n}\n.dx-treeview :focus {\n  outline: none;\n}\n.dx-treeview .dx-checkbox + .dx-treeview-node-container,\n.dx-treeview .dx-treeview-node-container:first-child {\n  margin: 0;\n  display: block;\n}\n.dx-treeview .dx-treeview-select-all-item {\n  width: 100%;\n}\n.dx-treeview .dx-treeview-node-container {\n  list-style-position: inside;\n  padding: 0;\n  margin: 0;\n  display: none;\n  overflow: hidden;\n}\n.dx-treeview .dx-treeview-node-container.dx-treeview-node-container-opened {\n  display: block;\n}\n.dx-treeview .dx-treeview-node {\n  list-style-type: none;\n  position: relative;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none;\n}\n.dx-treeview .dx-treeview-node a {\n  text-decoration: none;\n}\n.dx-treeview .dx-treeview-node .dx-checkbox {\n  position: absolute;\n  margin: 0;\n}\n.dx-treeview .dx-treeview-item {\n  display: block;\n  cursor: default;\n}\n.dx-treeview .dx-treeview-item .dx-icon {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  vertical-align: middle;\n  margin-right: 5px;\n  -webkit-background-size: 24px 24px;\n  -moz-background-size: 24px 24px;\n  background-size: 24px 24px;\n}\n.dx-treeview .dx-treeview-item .dx-treeview-item-content span {\n  vertical-align: middle;\n}\n.dx-treeview .dx-treeview-item.dx-state-disabled {\n  opacity: 0.5;\n}\n.dx-treeview .dx-treeview-toggle-item-visibility {\n  position: absolute;\n  cursor: pointer;\n}\n.dx-treeview .dx-treeview-toggle-item-visibility.dx-state-disabled {\n  cursor: default;\n}\n.dx-treeview.dx-rtl .dx-treeview-node-container:first-child > .dx-treeview-node {\n  padding-left: 0;\n}\n.dx-treeview.dx-rtl .dx-treeview-node-container .dx-treeview-node {\n  padding-left: 0;\n}\n.dx-treeview.dx-rtl .dx-treeview-node-container .dx-treeview-node.dx-treeview-item-with-checkbox .dx-treeview-item {\n  padding-left: 0;\n}\n.dx-treeview.dx-rtl .dx-treeview-node-container .dx-treeview-node .dx-treeview-item .dx-icon {\n  margin-right: 0;\n}\n.dx-treeview.dx-rtl .dx-treeview-toggle-item-visibility {\n  left: auto;\n  right: 0;\n  -moz-transform: scaleX(-1);\n  -o-transform: scaleX(-1);\n  -webkit-transform: scaleX(-1);\n  transform: scaleX(-1);\n}\n.dx-treeview .dx-empty-message {\n  line-height: normal;\n}\n.dx-fieldset {\n  margin-bottom: 20px;\n}\n.dx-fieldset .dx-field-value {\n  margin: 0;\n}\n.dx-fieldset,\n.dx-fieldset * {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.dx-fieldset-header:empty {\n  display: none;\n}\n.dx-field {\n  position: relative;\n  padding: .4em ;\n}\n.dx-field:before,\n.dx-field:after {\n  display: table;\n  content: \"\";\n  line-height: 0;\n}\n.dx-field:after {\n  clear: both;\n}\n.dx-field-label {\n  float: left;\n  width: 40%;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-field-value,\n.dx-field-value-static {\n  float: right;\n}\n.dx-field-value-static {\n  white-space: normal;\n}\n.dx-field-value.dx-datebox {\n  min-width: 60%;\n}\n.dx-field-value:not(.dx-widget) > .dx-datebox {\n  min-width: 100%;\n}\n.dx-field-value .dx-selectbox-tag-container {\n  white-space: normal;\n}\n.dx-field-value:not(.dx-widget) > .dx-selectbox.dx-selectbox-multiselect.dx-widget {\n  position: relative;\n  width: auto;\n  text-align: left;\n}\n.dx-rtl .dx-fieldset .dx-field-label,\n.dx-fieldset.dx-rtl .dx-field-label {\n  float: right;\n}\n.dx-rtl .dx-fieldset .dx-field-value,\n.dx-fieldset.dx-rtl .dx-field-value {\n  float: left;\n}\n.dx-tabpanel-tabs {\n  width: 100%;\n}\n.dx-tabpanel-tabs .dx-tabs {\n  height: 100%;\n}\n.dx-tabpanel-container {\n  width: 100%;\n  height: 100%;\n}\n.dx-fileuploader.dx-state-disabled .dx-fileuploader-input {\n  display: none;\n}\n.dx-fileuploader-wrapper {\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n.dx-fileuploader-container {\n  display: table;\n  table-layout: fixed;\n  height: 100%;\n  width: 100%;\n}\n.dx-fileuploader-input-wrapper:before,\n.dx-fileuploader-input-wrapper:after {\n  display: table;\n  content: \"\";\n  line-height: 0;\n}\n.dx-fileuploader-input-wrapper:after {\n  clear: both;\n}\n.dx-fileuploader-input-wrapper .dx-button {\n  float: left;\n}\n.dx-fileuploader-input-wrapper .dx-button + .dx-button {\n  margin-left: 12px;\n}\n.dx-fileuploader-button {\n  position: relative;\n}\n.dx-fileuploader-button .dx-fileuploader-input {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  top: 0;\n  left: 0;\n  cursor: pointer;\n}\n.dx-fileuploader-button .dx-fileuploader-input::-webkit-file-upload-button,\n.dx-fileuploader-button .dx-fileuploader-input::-ms-browse {\n  cursor: pointer;\n}\n.dx-fileuploader-content {\n  display: table-row-group;\n  vertical-align: middle;\n}\n.dx-fileuploader-content > .dx-fileuploader-upload-button {\n  margin-top: 10px;\n}\n.dx-fileuploader-empty .dx-fileuploader-content > .dx-fileuploader-upload-button {\n  display: none;\n}\n.dx-fileuploader-input-content {\n  width: 100%;\n  display: table;\n}\n.dx-fileuploader-files-container {\n  padding-top: 0;\n  width: 100%;\n}\n.dx-fileuploader-show-file-list .dx-fileuploader-files-container {\n  padding-top: 22px;\n}\n.dx-fileuploader-file-container {\n  width: 100%;\n  padding: 4px 0 4px;\n}\n.dx-fileuploader-file-container .dx-button {\n  width: 28px;\n  height: 28px;\n  margin-right: 10px;\n}\n.dx-fileuploader-file-container .dx-button.dx-state-invisible {\n  margin-right: 0;\n}\n.dx-fileuploader-button-container,\n.dx-fileuploader-input-container {\n  display: table-cell;\n  vertical-align: middle;\n}\n.dx-fileuploader-input-container {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  overflow: hidden;\n}\n.dx-fileuploader-input {\n  opacity: 0;\n  width: 100%;\n  margin: 0;\n  cursor: default;\n}\n.dx-fileuploader-input-label {\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  cursor: default;\n}\n.dx-fileuploader-input-label:before {\n  content: '';\n  position: absolute;\n  top: -50%;\n  overflow: hidden;\n  cursor: default;\n}\n.dx-fileuploader-button-container {\n  display: table-cell;\n  vertical-align: middle;\n}\n.dx-fileuploader-file {\n  display: table-cell;\n  width: 100%;\n  white-space: nowrap;\n}\n.dx-fileuploader-file-info {\n  float: left;\n  width: 100%;\n}\n.dx-fileuploader-file-status-message {\n  float: left;\n  font-size: 12px;\n  height: 16px;\n}\n.dx-fileuploader .dx-progressbar {\n  float: left;\n  width: 100%;\n  height: 22px;\n  margin-top: -6px;\n}\n.dx-fileuploader-file-name {\n  float: left;\n  max-width: 100%;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-fileuploader-file-size {\n  margin-left: 4px;\n  float: left;\n  vertical-align: super;\n  font-size: 10px;\n}\n.dx-rtl .dx-fileuploader .dx-fileuploader-button,\n.dx-rtl.dx-fileuploader .dx-fileuploader-button {\n  float: right;\n}\n.dx-rtl .dx-fileuploader .dx-fileuploader-file-container .dx-fileuploader-button,\n.dx-rtl.dx-fileuploader .dx-fileuploader-file-container .dx-fileuploader-button {\n  margin-left: 10px;\n  margin-right: 0;\n}\n.dx-rtl .dx-fileuploader .dx-fileuploader-file-name,\n.dx-rtl.dx-fileuploader .dx-fileuploader-file-name,\n.dx-rtl .dx-fileuploader .dx-fileuploader-file-size,\n.dx-rtl.dx-fileuploader .dx-fileuploader-file-size,\n.dx-rtl .dx-fileuploader .dx-fileuploader-file-status-message,\n.dx-rtl.dx-fileuploader .dx-fileuploader-file-status-message {\n  float: right;\n}\n.dx-rtl .dx-fileuploader .dx-fileuploader-file-size,\n.dx-rtl.dx-fileuploader .dx-fileuploader-file-size {\n  margin-right: 4px;\n}\n.dx-validationsummary-item {\n  cursor: pointer;\n}\n.dx-invalid-message.dx-overlay {\n  position: relative;\n}\n.dx-invalid-message.dx-overlay-wrapper {\n  width: 100%;\n  visibility: hidden;\n  pointer-events: none;\n}\n.dx-invalid-message > .dx-overlay-content {\n  display: inline-block;\n  position: relative;\n  border-width: 0;\n  padding: 10px;\n  font-size: .85em;\n  line-height: normal;\n  word-wrap: break-word;\n}\n.dx-state-focused.dx-invalid .dx-invalid-message-auto .dx-overlay-wrapper,\n.dx-lookup.dx-dropdowneditor-active .dx-invalid-message-auto .dx-overlay-wrapper,\n.dx-invalid-message-always .dx-overlay-wrapper {\n  visibility: visible;\n}\n.dx-timeview {\n  height: 250px;\n  width: 270px;\n}\n.dx-timeview.dx-state-disabled.dx-widget,\n.dx-timeview .dx-state-disabled.dx-widget,\n.dx-timeview.dx-state-disabled .dx-widget,\n.dx-timeview .dx-state-disabled .dx-widget {\n  opacity: 1;\n}\n.dx-timeview-clock {\n  position: relative;\n}\n.dx-timeview-hourarrow,\n.dx-timeview-minutearrow {\n  position: absolute;\n  left: 50%;\n  width: 30px;\n  height: 50%;\n  margin-left: -15px;\n  background-position: bottom;\n  background-repeat: no-repeat;\n  -webkit-transform-origin: 50% 100%;\n  -moz-transform-origin: 50% 100%;\n  -ms-transform-origin: 50% 100%;\n  -o-transform-origin: 50% 100%;\n  transform-origin: 50% 100%;\n  -webkit-backface-visibility: hidden;\n}\n.dx-timeview-field .dx-numberbox {\n  width: 70px;\n}\n.dx-timeview-field .dx-numberbox.dx-numberbox-spin-touch-friendly {\n  width: 110px;\n}\n.dx-scheduler .dx-empty-message {\n  line-height: normal;\n}\n.dx-scheduler-all-day-panel td {\n  padding: 0;\n}\n.dx-scheduler-dropdown-appointments {\n  position: absolute;\n  display: block;\n  height: 20px;\n  text-align: center;\n  cursor: pointer;\n  -webkit-border-radius: 3px;\n  -moz-border-radius: 3px;\n  -ms-border-radius: 3px;\n  -o-border-radius: 3px;\n  border-radius: 3px;\n}\n.dx-scheduler-dropdown-appointments .dx-scheduler-dropdown-appointments-content span:last-child {\n  display: inline-block;\n  vertical-align: middle;\n  line-height: 10px;\n  height: 20px;\n  padding-left: 2px;\n}\n.dx-scheduler-dropdown-appointments.dx-button {\n  padding: 0;\n  max-width: none;\n}\n.dx-scheduler-work-space-mouse-selection .dx-scheduler-fixed-appointments,\n.dx-scheduler-work-space-mouse-selection .dx-scheduler-scrollable-appointments {\n  pointer-events: none;\n}\n.dx-dropdownmenu-popup-wrapper .dx-scheduler-dropdown-appointment {\n  max-width: 400px;\n  height: 65px;\n  position: relative;\n}\n.dx-dropdownmenu-popup-wrapper .dx-scheduler-dropdown-appointment.dx-list-item-content {\n  padding: 5px;\n  width: 100%;\n}\n.dx-scheduler-dropdown-appointment-info-block {\n  max-width: 300px;\n  margin-right: 75px;\n  margin-top: 7px;\n}\n.dx-scheduler-dropdown-appointment-buttons-block {\n  position: absolute;\n  top: 19.5px;\n  right: 0;\n  width: 75px;\n  text-align: right;\n}\n.dx-scheduler-dropdown-appointment-title {\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  -ms-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dx-popup-content .dx-button.dx-scheduler-dropdown-appointment-remove-button,\n.dx-popup-content .dx-button.dx-scheduler-dropdown-appointment-edit-button {\n  padding: 2px;\n  margin: 0 10px 0 0;\n}\n.dx-popup-content .dx-button.dx-scheduler-dropdown-appointment-remove-button .dx-button-content,\n.dx-popup-content .dx-button.dx-scheduler-dropdown-appointment-edit-button .dx-button-content {\n  padding: 0;\n}\n.dx-popup-content .dx-button.dx-scheduler-dropdown-appointment-remove-button .dx-icon,\n.dx-popup-content .dx-button.dx-scheduler-dropdown-appointment-edit-button .dx-icon {\n  font-size: 14px;\n  width: 18px;\n  height: 18px;\n  line-height: 18px;\n}\n.dx-scheduler-dropdown-appointment-date {\n  font-size: 12px;\n}\n.dx-rtl .dx-scheduler-dropdown-appointment-info-block {\n  margin-left: 75px;\n  margin-right: auto;\n}\n.dx-rtl .dx-scheduler-dropdown-appointment-buttons-block {\n  left: 0;\n  right: auto;\n  text-align: left;\n}\n.dx-rtl .dx-popup-content .dx-button.dx-scheduler-dropdown-appointment-remove-button,\n.dx-rtl .dx-popup-content .dx-button.dx-scheduler-dropdown-appointment-edit-button {\n  margin: 0 0 0 10px;\n}\n.dx-layout-manager .dx-field-item:not(.dx-first-row) {\n  padding-top: 10px;\n}\n.dx-layout-manager .dx-field-item:not(.dx-first-col) {\n  padding-left: 15px;\n}\n.dx-layout-manager .dx-field-item:not(.dx-last-col) {\n  padding-right: 15px;\n}\n.dx-layout-manager .dx-field-empty-item {\n  width: 100%;\n}\n.dx-layout-manager.dx-layout-manager-one-col .dx-field-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.dx-layout-manager.dx-layout-manager-one-col .dx-form-group .dx-first-row.dx-col-0.dx-field-item {\n  padding-top: 0px;\n}\n.dx-layout-manager.dx-layout-manager-one-col .dx-box-item:not(:first-child) .dx-field-item {\n  padding-top: 10px;\n}\n.dx-layout-manager .dx-label-h-align.dx-flex-layout {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-flex;\n  display: -ms-flexbox;\n  display: flex;\n}\n.dx-layout-manager .dx-label-h-align.dx-flex-layout .dx-field-item-label {\n  display: block;\n}\n.dx-layout-manager .dx-label-h-align.dx-flex-layout .dx-field-item-content,\n.dx-layout-manager .dx-label-h-align.dx-flex-layout .dx-field-item-content-wrapper {\n  flex-shrink: 1;\n  flex-grow: 1;\n  flex-basis: 0;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 1 0;\n  -moz-flex: 1 1 0;\n  -ms-flex: 1 1 0;\n  flex: 1 1 0;\n  display: block;\n}\n.dx-layout-manager .dx-label-h-align.dx-flex-layout:not(.dx-field-item-label-align) {\n  -ms-flex-align: baseline;\n  -webkit-align-items: baseline;\n  -webkit-box-align: baseline;\n  align-items: baseline;\n}\n.dx-layout-manager .dx-label-h-align.dx-field-item-label-align:not(.dx-flex-layout) .dx-field-item-label {\n  vertical-align: baseline;\n}\n.dx-layout-manager .dx-label-h-align .dx-field-item-label,\n.dx-layout-manager .dx-label-h-align .dx-field-item-content,\n.dx-layout-manager .dx-label-h-align .dx-field-item-content-wrapper {\n  display: table-cell;\n}\n.dx-layout-manager .dx-label-h-align .dx-field-item-content-wrapper .dx-field-item-content {\n  display: block;\n}\n.dx-layout-manager .dx-label-h-align .dx-field-item-label {\n  white-space: nowrap;\n  vertical-align: middle;\n}\n.dx-layout-manager .dx-label-h-align .dx-field-item-label .dx-field-item-label-content {\n  display: block;\n}\n.dx-layout-manager .dx-label-h-align .dx-field-item-content {\n  vertical-align: top;\n}\n.dx-layout-manager .dx-label-h-align .dx-field-item-content .dx-checkbox,\n.dx-layout-manager .dx-label-h-align .dx-field-item-content .dx-switch {\n  margin-top: 7px;\n  margin-bottom: 4px;\n}\n.dx-layout-manager .dx-label-h-align .dx-field-item-content,\n.dx-layout-manager .dx-label-h-align .dx-field-item-content-wrapper {\n  width: 100%;\n}\n.dx-layout-manager .dx-tabpanel .dx-multiview-item-content {\n  padding: 20px;\n}\n.dx-field-item-label-location-top {\n  display: block;\n}\n.dx-form-group-content {\n  border-width: 0;\n  padding: 0;\n  margin: 0;\n}\n.dx-form-group-caption {\n  font-size: 20px;\n}\n.dx-form-group-with-caption .dx-form-group-content {\n  padding-top: 19px;\n  padding-bottom: 20px;\n  margin-top: 6px;\n}\n.dx-form-group-with-caption .dx-form-group.dx-form-group-with-caption {\n  padding-left: 20px;\n}\n.dx-layout-manager-hidden-label {\n  position: absolute;\n  display: block;\n  visibility: hidden;\n}\n.dx-field-item-help-text {\n  font-style: italic;\n}\n.dx-field-item-label-location-left {\n  padding-right: 10px;\n}\n.dx-field-item-label-location-right {\n  padding-left: 10px;\n}\n.dx-rtl .dx-field-item-required-mark,\n.dx-rtl .dx-field-item-optional-mark {\n  float: left;\n}\n.dx-rtl .dx-field-item:not(.dx-first-col) {\n  padding-left: 0;\n  padding-right: 15px;\n}\n.dx-rtl .dx-field-item:not(.dx-last-col) {\n  padding-left: 15px;\n  padding-right: 0;\n}\n.dx-rtl .dx-field-item-label-location-left {\n  padding-right: 0;\n  padding-left: 10px;\n}\n.dx-rtl .dx-field-item-label-location-right {\n  padding-left: 0;\n  padding-right: 10px;\n}\n.dx-rtl .dx-layout-manager-one-col .dx-field-item {\n  padding-right: 0;\n  padding-left: 0;\n}\n.dx-rtl .dx-form-group-with-caption .dx-form-group.dx-form-group-with-caption {\n  padding-left: 0;\n  padding-right: 20px;\n}\n.dx-deferrendering .dx-deferrendering-loadindicator-container {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n.dx-deferrendering.dx-pending-rendering .dx-invisible-while-pending-rendering {\n  display: none !important;\n}\n.dx-deferrendering:not(.dx-pending-rendering) .dx-visible-while-pending-rendering {\n  display: none !important;\n}\r\n", ""]);

// exports


/***/ }),

/***/ 536:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "/*\r\n* Generated by the DevExpress Theme Builder\r\n* Version: 16.2.6\r\n* http://js.devexpress.com/themebuilder/\r\n*/\r\n\r\n.dx-colorview-palette-handle {\r\n    background: -webkit-gradient(transparent 5px, rgba(0, 0, 0, 0.2) 6px, #fff 7px, #fff 12px, rgba(0, 0, 0, 0.2) 13px);\r\n    background: -webkit-radial-gradient(transparent 5px, rgba(0, 0, 0, 0.2) 6px, #fff 7px, #fff 12px, rgba(0, 0, 0, 0.2) 13px);\r\n    background: -moz-radial-gradient(transparent 5px, rgba(0, 0, 0, 0.2) 6px, #fff 7px, #fff 12px, rgba(0, 0, 0, 0.2) 13px);\r\n    background: -ms-radial-gradient(transparent 5px, rgba(0, 0, 0, 0.2) 6px, #fff 7px, #fff 12px, rgba(0, 0, 0, 0.2) 13px);\r\n    background: -o-radial-gradient(transparent 5px, rgba(0, 0, 0, 0.2) 6px, #fff 7px, #fff 12px, rgba(0, 0, 0, 0.2) 13px);\r\n    background: radial-gradient(transparent 5px, rgba(0, 0, 0, 0.2) 6px, #fff 7px, #fff 12px, rgba(0, 0, 0, 0.2) 13px);\r\n    -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);\r\n    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);\r\n}\r\n.dx-colorview-hue-scale-handle {\r\n    border: 1px solid rgba(0, 0, 0, 0.2);\r\n    -webkit-box-shadow: inset -5px 0px 0px 3px #fff, inset 5px 0px 0px 3px #fff, inset -6px 0px 1px 4px rgba(0, 0, 0, 0.2), inset 6px 0px 1px 4px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: inset -5px 0px 0px 3px #fff, inset 5px 0px 0px 3px #fff, inset -6px 0px 1px 4px rgba(0, 0, 0, 0.2), inset 6px 0px 1px 4px rgba(0, 0, 0, 0.2);\r\n    box-shadow: inset -5px 0px 0px 3px #fff, inset 5px 0px 0px 3px #fff, inset -6px 0px 1px 4px rgba(0, 0, 0, 0.2), inset 6px 0px 1px 4px rgba(0, 0, 0, 0.2);\r\n}\r\n.dx-colorview-alpha-channel-handle {\r\n    border: 1px solid rgba(0, 0, 0, 0.2);\r\n    -webkit-box-shadow: inset 0px -5px 0px 3px #fff, inset 0px 5px 0px 3px #fff, inset 0px -6px 1px 4px rgba(0, 0, 0, 0.2), inset 0px 6px 1px 4px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: inset 0px -5px 0px 3px #fff, inset 0px 5px 0px 3px #fff, inset 0px -6px 1px 4px rgba(0, 0, 0, 0.2), inset 0px 6px 1px 4px rgba(0, 0, 0, 0.2);\r\n    box-shadow: inset 0px -5px 0px 3px #fff, inset 0px 5px 0px 3px #fff, inset 0px -6px 1px 4px rgba(0, 0, 0, 0.2), inset 0px 6px 1px 4px rgba(0, 0, 0, 0.2);\r\n}\r\n.dx-datagrid {\r\n    color: #333;\r\n    background-color: #fff;\r\n}\r\n.dx-datagrid .dx-sort-up {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-sort-up:before {\r\n    content: '\\F051';\r\n}\r\n.dx-datagrid .dx-sort-down {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-sort-down:before {\r\n    content: '\\F052';\r\n}\r\n.dx-datagrid .dx-header-filter {\r\n    position: relative;\r\n    color: #959595;\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-header-filter:before {\r\n    content: '\\F050';\r\n}\r\n.dx-datagrid .dx-header-filter-empty {\r\n    color: rgba(149, 149, 149, 0.5);\r\n}\r\n.dx-datagrid.dx-filter-menu .dx-menu-item-content .dx-icon {\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-datagrid .dx-datagrid-content-fixed .dx-datagrid-table .dx-col-fixed {\r\n    background-color: #fff;\r\n}\r\n.dx-datagrid .dx-datagrid-rowsview .dx-data-row td.dx-pointer-events-none,\r\n.dx-datagrid .dx-datagrid-rowsview .dx-freespace-row td.dx-pointer-events-none,\r\n.dx-datagrid .dx-datagrid-headers .dx-row td.dx-pointer-events-none {\r\n    border-left: 2px solid #ddd;\r\n    border-right: 2px solid #ddd;\r\n}\r\n.dx-datagrid .dx-datagrid-rowsview .dx-data-row td.dx-pointer-events-none.dx-first-cell,\r\n.dx-datagrid .dx-datagrid-rowsview .dx-freespace-row td.dx-pointer-events-none.dx-first-cell,\r\n.dx-datagrid .dx-datagrid-headers .dx-row td.dx-pointer-events-none.dx-first-cell {\r\n    border-left: none;\r\n}\r\n.dx-datagrid .dx-datagrid-rowsview .dx-data-row td.dx-pointer-events-none.dx-last-cell,\r\n.dx-datagrid .dx-datagrid-rowsview .dx-freespace-row td.dx-pointer-events-none.dx-last-cell,\r\n.dx-datagrid .dx-datagrid-headers .dx-row td.dx-pointer-events-none.dx-last-cell {\r\n    border-right: none;\r\n}\r\n.dx-datagrid .dx-datagrid-rowsview .dx-datagrid-edit-form {\r\n    background-color: #fff;\r\n}\r\n.dx-datagrid .dx-datagrid-filter-row .dx-filter-range-content {\r\n    color: #333;\r\n}\r\n.dx-datagrid-form-buttons-container {\r\n    float: right;\r\n}\r\n.dx-datagrid-form-buttons-container .dx-button {\r\n    margin-left: 10px;\r\n    margin-top: 10px;\r\n}\r\n.dx-datagrid-column-chooser {\r\n    color: #333;\r\n    font-weight: normal;\r\n    font-size: 12px;\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-datagrid-column-chooser input,\r\n.dx-datagrid-column-chooser textarea {\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-datagrid-export-menu .dx-menu-item .dx-icon-exportxlsx {\r\n    width: 16px;\r\n    height: 16px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 16px 16px;\r\n    -moz-background-size: 16px 16px;\r\n    background-size: 16px 16px;\r\n    padding: 0px;\r\n    font-size: 16px;\r\n    text-align: center;\r\n    line-height: 16px;\r\n}\r\n.dx-datagrid-adaptive-more {\r\n    cursor: pointer;\r\n    font: 14px/1 DXIcons;\r\n    width: 21px;\r\n    height: 21px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 21px 21px;\r\n    -moz-background-size: 21px 21px;\r\n    background-size: 21px 21px;\r\n    padding: 0px;\r\n    font-size: 21px;\r\n    text-align: center;\r\n    line-height: 21px;\r\n}\r\n.dx-datagrid-adaptive-more:before {\r\n    content: '\\F06C';\r\n}\r\n.dx-rtl .dx-datagrid .dx-datagrid-rowsview .dx-data-row td.dx-pointer-events-none,\r\n.dx-rtl .dx-datagrid .dx-datagrid-rowsview .dx-freespace-row td.dx-pointer-events-none,\r\n.dx-rtl .dx-datagrid .dx-datagrid-headers .dx-row td.dx-pointer-events-none {\r\n    border-left: 2px solid #ddd;\r\n}\r\n.dx-rtl .dx-datagrid .dx-datagrid-rowsview .dx-data-row td.dx-pointer-events-none.dx-first-cell,\r\n.dx-rtl .dx-datagrid .dx-datagrid-rowsview .dx-freespace-row td.dx-pointer-events-none.dx-first-cell,\r\n.dx-rtl .dx-datagrid .dx-datagrid-headers .dx-row td.dx-pointer-events-none.dx-first-cell {\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-datagrid .dx-datagrid-rowsview .dx-data-row td.dx-pointer-events-none.dx-last-cell,\r\n.dx-rtl .dx-datagrid .dx-datagrid-rowsview .dx-freespace-row td.dx-pointer-events-none.dx-last-cell,\r\n.dx-rtl .dx-datagrid .dx-datagrid-headers .dx-row td.dx-pointer-events-none.dx-last-cell {\r\n    border-left: none;\r\n}\r\n.dx-rtl .dx-datagrid-form-buttons-container {\r\n    float: left;\r\n}\r\n.dx-rtl .dx-datagrid-form-buttons-container .dx-button {\r\n    margin-left: 0;\r\n    margin-right: 10px;\r\n}\r\n.dx-pivotgrid-fields-container .dx-position-indicator {\r\n    background-color: gray;\r\n}\r\n.dx-pivotgrid-fields-container .dx-position-indicator.dx-position-indicator-vertical {\r\n    margin-top: -4px;\r\n    margin-left: -1px;\r\n    height: 2px;\r\n}\r\n.dx-pivotgrid-fields-container .dx-position-indicator.dx-position-indicator-vertical.dx-position-indicator-last {\r\n    margin-top: -3px;\r\n}\r\n.dx-pivotgrid-fields-container .dx-position-indicator.dx-position-indicator-horizontal {\r\n    margin-left: -3px;\r\n    width: 2px;\r\n}\r\n.dx-pivotgrid-fields-container .dx-position-indicator.dx-position-indicator-horizontal.dx-position-indicator-last {\r\n    margin-left: 3px;\r\n}\r\n.dx-pivotgrid-fields-container .dx-area-fields {\r\n    position: relative;\r\n}\r\n.dx-pivotgrid-fields-container .dx-sort {\r\n    color: #959595;\r\n}\r\n.dx-pivotgrid-fields-container .dx-sort-up {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-pivotgrid-fields-container .dx-sort-up:before {\r\n    content: '\\F051';\r\n}\r\n.dx-pivotgrid-fields-container .dx-sort-down {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-pivotgrid-fields-container .dx-sort-down:before {\r\n    content: '\\F052';\r\n}\r\n.dx-pivotgrid-fields-container .dx-header-filter {\r\n    color: #959595;\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-pivotgrid-fields-container .dx-header-filter:before {\r\n    content: '\\F050';\r\n}\r\n.dx-pivotgrid-fields-container .dx-header-filter-empty {\r\n    color: rgba(149, 149, 149, 0.5);\r\n}\r\n.dx-pivotgrid-fields-container .dx-area-field {\r\n    cursor: pointer;\r\n}\r\n.dx-pivotgrid-fields-container.dx-drag {\r\n    opacity: 0.8;\r\n}\r\n.dx-pivotgrid-fields-container.dx-drag .dx-area-field.dx-area-box {\r\n    -webkit-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    border: 1px solid rgba(51, 122, 183, 0.5);\r\n}\r\n.dx-pivotgrid-fields-container .dx-area-field.dx-area-box {\r\n    background-color: #fff;\r\n    margin-bottom: 4px;\r\n    border: 1px solid #ddd;\r\n    padding: 5px 6px;\r\n}\r\n.dx-pivotgrid-fields-container .dx-drag-source {\r\n    opacity: 0.5;\r\n}\r\n.dx-pivotgrid-fields-container .dx-column-indicators {\r\n    vertical-align: bottom;\r\n    margin-left: 4px;\r\n}\r\n.dx-pivotgrid-fields-container .dx-area-field-content {\r\n    vertical-align: bottom;\r\n}\r\n.dx-pivotgrid .dx-column-header .dx-pivotgrid-fields-area,\r\n.dx-pivotgrid .dx-filter-header .dx-pivotgrid-fields-area {\r\n    overflow: hidden;\r\n}\r\n.dx-pivotgrid .dx-column-header .dx-pivotgrid-toolbar,\r\n.dx-pivotgrid .dx-filter-header .dx-pivotgrid-toolbar {\r\n    margin-right: 10px;\r\n    float: right;\r\n    display: inline-block;\r\n}\r\n.dx-pivotgrid .dx-column-header .dx-pivotgrid-toolbar .dx-pivotgrid-field-chooser-button,\r\n.dx-pivotgrid .dx-filter-header .dx-pivotgrid-toolbar .dx-pivotgrid-field-chooser-button {\r\n    margin-right: 4px;\r\n}\r\n.dx-pivotgrid .dx-data-header,\r\n.dx-pivotgrid .dx-column-header,\r\n.dx-pivotgrid .dx-area-description-cell.dx-pivotgrid-background {\r\n    background-color: rgba(221, 221, 221, 0.2);\r\n}\r\n.dx-pivotgrid .dx-column-header .dx-pivotgrid-fields-area {\r\n    margin-left: -5px;\r\n    padding-left: 5px;\r\n}\r\n.dx-pivotgrid .dx-column-header .dx-pivotgrid-fields-area-head tr > td:first-child {\r\n    padding-left: 0;\r\n}\r\n.dx-pivotgrid .dx-area-field.dx-area-box {\r\n    margin-bottom: 0;\r\n}\r\n.dx-pivotgrid.dx-row-lines .dx-pivotgrid-area td {\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid.dx-row-lines .dx-pivotgrid-area-data tr:first-child > td {\r\n    border-top-width: 0px;\r\n}\r\n.dx-pivotgrid .dx-expand-icon-container {\r\n    margin-left: -5px;\r\n    margin-right: 0;\r\n}\r\n.dx-pivotgrid .dx-area-row-cell,\r\n.dx-pivotgrid .dx-area-description-cell {\r\n    border-right: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-area-description-cell {\r\n    white-space: nowrap;\r\n}\r\n.dx-pivotgrid .dx-area-description-cell .dx-pivotgrid-toolbar .dx-button {\r\n    margin: 1px;\r\n}\r\n.dx-pivotgrid .dx-area-description-cell .dx-pivotgrid-toolbar .dx-button:not(.dx-state-hover):not(.dx-state-active) {\r\n    border-color: transparent;\r\n    background-color: transparent;\r\n    box-shadow: none;\r\n}\r\n.dx-pivotgrid .dx-bottom-border,\r\n.dx-pivotgrid .dx-area-description-cell,\r\n.dx-pivotgrid .dx-area-column-cell {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-area {\r\n    box-sizing: content-box;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-area td {\r\n    color: #959595;\r\n    padding: 5px 6px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-fields-area-head td {\r\n    position: relative;\r\n    border: none;\r\n    padding: 6px 2px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-fields-area-head tr > td:first-child {\r\n    padding-left: 6px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-fields-area-head tr > td:last-child {\r\n    padding-right: 6px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-fields-area-head .dx-empty-area-text {\r\n    white-space: nowrap;\r\n    padding: 6px 0;\r\n    border: 1px solid transparent;\r\n    color: #525252;\r\n}\r\n.dx-pivotgrid .dx-group-connector {\r\n    position: absolute;\r\n    width: 2px;\r\n    top: 50%;\r\n    height: 2px;\r\n    margin-top: -1px;\r\n    background-color: #ddd;\r\n}\r\n.dx-pivotgrid .dx-group-connector.dx-group-connector-prev {\r\n    left: 0;\r\n}\r\n.dx-pivotgrid .dx-group-connector.dx-group-connector-next {\r\n    right: 0;\r\n}\r\n.dx-pivotgrid .dx-virtual-content {\r\n    display: none;\r\n}\r\n.dx-pivotgrid .dx-virtual-mode .dx-virtual-content {\r\n    position: relative;\r\n    overflow: hidden;\r\n    display: block;\r\n}\r\n.dx-pivotgrid .dx-virtual-mode .dx-virtual-content table td {\r\n    color: transparent;\r\n    background-color: transparent !important;\r\n}\r\n.dx-pivotgrid .dx-virtual-mode .dx-virtual-content table td span {\r\n    visibility: hidden;\r\n}\r\n.dx-pivotgrid .dx-virtual-mode table {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-area-data {\r\n    position: relative;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-area-data tbody td {\r\n    text-align: right;\r\n    color: #333;\r\n    white-space: nowrap;\r\n    border-left: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-area-data tbody td:first-child {\r\n    border-left: 0px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-area-data tbody tr:first-child .dx-total,\r\n.dx-pivotgrid .dx-pivotgrid-area-data tbody tr:first-child .dx-grandtotal {\r\n    border-top-width: 0px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-vertical-headers .dx-expand-border {\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-vertical-headers .dx-last-cell {\r\n    border-right: 0px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-vertical-headers td {\r\n    min-width: 50px;\r\n    border-right: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-vertical-headers tr:first-child td {\r\n    border-top: 0px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-vertical-headers .dx-pivotgrid-fields-area-head td:last-child {\r\n    border-right: 0px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-vertical-headers .dx-row-total,\r\n.dx-pivotgrid .dx-pivotgrid-area-data .dx-row-total {\r\n    border-top: 1px solid #ddd;\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-area-tree-view .dx-total {\r\n    border-bottom: none;\r\n}\r\n.dx-pivotgrid .dx-area-tree-view td.dx-white-space-column {\r\n    border-top: 1px solid transparent;\r\n    background-color: rgba(221, 221, 221, 0.2);\r\n    width: 24px;\r\n    padding: 0;\r\n    min-width: 24px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-horizontal-headers.dx-vertical-scroll {\r\n    border-right: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-horizontal-headers td {\r\n    text-align: center;\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-horizontal-headers td.dx-pivotgrid-expanded,\r\n.dx-pivotgrid .dx-pivotgrid-horizontal-headers td.dx-pivotgrid-collapsed {\r\n    text-align: left;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-horizontal-headers td:first-child {\r\n    border-left: 0px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-horizontal-headers tr:first-child td {\r\n    border-top: 0px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-horizontal-headers:last-child {\r\n    border-bottom: 0;\r\n}\r\n.dx-pivotgrid .dx-total,\r\n.dx-pivotgrid .dx-data-header,\r\n.dx-pivotgrid .dx-column-header,\r\n.dx-pivotgrid .dx-area-description-cell {\r\n    background-color: rgba(221, 221, 221, 0.2);\r\n}\r\n.dx-pivotgrid .dx-grandtotal {\r\n    background-color: #f5f5f5;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-data-header,\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-filter-header,\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-area-description-cell,\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-area-row-cell {\r\n    border-left: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-filter-header,\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-area-column-cell,\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-column-header,\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-filter-header,\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-area-data-cell {\r\n    border-right: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-filter-header {\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-area-data-cell,\r\n.dx-pivotgrid .dx-pivotgrid-border .dx-area-row-cell {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-pivotgrid .dx-icon-sorted {\r\n    display: inline-block;\r\n    margin-left: 5px;\r\n}\r\n.dx-pivotgrid .dx-menu-item .dx-icon {\r\n    width: 16px;\r\n    height: 16px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 16px 16px;\r\n    -moz-background-size: 16px 16px;\r\n    background-size: 16px 16px;\r\n    padding: 0px;\r\n    font-size: 16px;\r\n    text-align: center;\r\n    line-height: 16px;\r\n}\r\n.dx-pivotgrid .dx-popup-content {\r\n    padding: 6px;\r\n}\r\n.dx-pivotgrid .dx-popup-content .dx-pivotgrid-fields-area-head td {\r\n    padding: 0px 2px;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-fields {\r\n    overflow: hidden;\r\n}\r\n.dx-pivotgridfieldchooser .dx-treeview .dx-treeview-item .dx-icon {\r\n    margin-bottom: 1px;\r\n    width: 16px;\r\n    height: 16px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 16px 16px;\r\n    -moz-background-size: 16px 16px;\r\n    background-size: 16px 16px;\r\n    padding: 0px;\r\n    font-size: 16px;\r\n    text-align: center;\r\n    line-height: 16px;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-icon {\r\n    display: inline-block;\r\n    vertical-align: middle;\r\n    width: 16px;\r\n    height: 16px;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area {\r\n    padding: 5px;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area .dx-area-fields {\r\n    margin-top: 3px;\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-fields[group] {\r\n    padding: 5px;\r\n    background-color: rgba(221, 221, 221, 0.2);\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-fields.dx-drag-target {\r\n    border-color: #337ab7;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-icon-all {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAJElEQVQoz2P8z4AfsDAwJELVzGfExmIiYAAD5QoYRx1JL0cCAJeiFh8Qq9chAAAAAElFTkSuQmCC) no-repeat center center;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-icon-filter {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAWElEQVQoz83RsQqAMAxF0fepFxzEQRz8e1sah0JTamhXeVtyCCSRaR6ZTGQsSHJgcRyk1YQ7aBcuB+KkDO0D9UDsHcmARiC2BqiVEfg2+jOoF30+YPnNWV4jV/jo04VE6gAAAABJRU5ErkJggg==) no-repeat center center;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-icon-row {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAI0lEQVQoz2P4z4AfAlHCfwjEzqKPAsKObIBA7Cz6KBgGIQkAQ8IdQJKOGQIAAAAASUVORK5CYII=) no-repeat center center;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-icon-column {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAIElEQVQoz2P4z4AfAlHCfwgEshogEFmMPgpGHUkfRwIAQ8IdQALkrHMAAAAASUVORK5CYII=) no-repeat center center;\r\n}\r\n.dx-pivotgridfieldchooser .dx-area-icon-data {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAARElEQVQoz2P4z4AfMhClIOE/NkiSAl+ooG8CQwKIzwChEQpQlGBXgKYEwxeoSrB6k7ACfFYkYPgDXQGKdAItQpKi2AQAaDQFJxj4SdQAAAAASUVORK5CYII=) no-repeat center center;\r\n}\r\n.dx-pivotgridfieldchooser .dx-icon-measure {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAARElEQVQoz2P4z4AfMhClIOE/NkiSAl+ooG8CQwKIzwChEQpQlGBXgKYEwxeoSrB6k7ACfFYkYPgDXQGKdAItQpKi2AQAaDQFJxj4SdQAAAAASUVORK5CYII=) no-repeat center center;\r\n}\r\n.dx-pivotgridfieldchooser .dx-icon-dimension {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAH0lEQVQoz2P4z4AfMlBHQcJ/MESjqasAKxx5bqAosgCZ3QSYpC33dQAAAABJRU5ErkJggg==) no-repeat center center;\r\n}\r\n.dx-pivotgridfieldchooser .dx-icon-hierarchy {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAMUlEQVQoz2P4z4AfMlBXQcJ/EKShggQoxKEAojsBwxQqKUjACpEVoOhGNYVKCiiKLAATcARoA49V5wAAAABJRU5ErkJggg==) no-repeat center center;\r\n}\r\n.dx-rtl .dx-pivotgrid-fields-container .dx-position-indicator.dx-position-indicator-horizontal {\r\n    margin-left: -3px;\r\n}\r\n.dx-rtl .dx-pivotgrid-fields-container .dx-position-indicator.dx-position-indicator-horizontal.dx-position-indicator-last {\r\n    margin-left: 1px;\r\n}\r\n.dx-rtl .dx-pivotgrid-fields-container .dx-column-indicators {\r\n    margin-left: 0;\r\n    margin-right: 4px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-column-header .dx-pivotgrid-toolbar,\r\n.dx-rtl.dx-pivotgrid .dx-filter-header .dx-pivotgrid-toolbar {\r\n    margin-right: 0;\r\n    margin-left: 10px;\r\n    float: left;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-column-header .dx-pivotgrid-toolbar .dx-pivotgrid-field-chooser-button,\r\n.dx-rtl.dx-pivotgrid .dx-filter-header .dx-pivotgrid-toolbar .dx-pivotgrid-field-chooser-button {\r\n    margin-right: 0;\r\n    margin-left: 4px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-column-header .dx-pivotgrid-fields-area {\r\n    margin-left: 0;\r\n    padding-left: 0;\r\n    margin-right: -5px;\r\n    padding-right: 5px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-column-header .dx-pivotgrid-fields-area-head tr > td:first-child {\r\n    padding-left: 2px;\r\n    padding-right: 0;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-fields-area-head tr > td {\r\n    padding: 6px 2px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-fields-area-head tr > td:first-child {\r\n    padding-right: 6px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-fields-area-head tr > td:last-child {\r\n    padding-left: 6px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-group-connector.dx-group-connector-prev {\r\n    left: initial;\r\n    right: 0;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-group-connector.dx-group-connector-next {\r\n    right: initial;\r\n    left: 0;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-area-row-cell,\r\n.dx-rtl.dx-pivotgrid .dx-area-description-cell {\r\n    border-left: 1px solid #ddd;\r\n    border-right: 0px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-area-data tbody td {\r\n    border-left: 0px;\r\n    border-right: 1px solid #ddd;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-area-data tbody td:first-child {\r\n    border-left: 1px solid #ddd;\r\n    border-right: 0px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-vertical-headers td {\r\n    border-right: 0px;\r\n    border-left: 1px solid #ddd;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-vertical-headers .dx-last-cell {\r\n    border-left: 0px;\r\n    border-right: 0px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-horizontal-headers.dx-vertical-scroll {\r\n    border-right: 0px;\r\n    border-left: 1px solid #ddd;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-horizontal-headers.dx-pivotgrid-area {\r\n    border-left: 0px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-horizontal-headers td:first-child {\r\n    border-left: 1px solid #ddd;\r\n    border-right: 0px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-horizontal-headers td.dx-pivotgrid-expanded,\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-horizontal-headers td.dx-pivotgrid-collapsed {\r\n    text-align: right;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-expand-icon-container {\r\n    margin-left: 0;\r\n    margin-right: -5px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-collapsed .dx-expand-icon-container {\r\n    -moz-transform: scaleX(-1);\r\n    -o-transform: scaleX(-1);\r\n    -webkit-transform: scaleX(-1);\r\n    transform: scaleX(-1);\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-icon-sorted {\r\n    margin-left: 0;\r\n    margin-right: 5px;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgridfieldchooser-container .dx-col {\r\n    float: right;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-area-description-cell,\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-data-header,\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-area-row-cell {\r\n    border-right: 1px solid #ddd;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-area-column-cell,\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-column-header,\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-area-data-cell {\r\n    border-left: 1px solid #ddd;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-column-header {\r\n    border-right: none;\r\n}\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-area-row-cell,\r\n.dx-rtl.dx-pivotgrid .dx-pivotgrid-border .dx-data-header {\r\n    border-left: none;\r\n}\r\n.dx-validationsummary-item {\r\n    color: #d9534f;\r\n}\r\n.dx-validationsummary-item-content {\r\n    border-bottom: 1px dashed;\r\n    display: inline-block;\r\n    line-height: normal;\r\n}\r\n.dx-invalid-message > .dx-overlay-content {\r\n    color: #fff;\r\n    background-color: #d9534f;\r\n}\r\n.dx-scheduler-pseudo-cell:before {\r\n    content: '';\r\n    width: 100px;\r\n    display: table-cell;\r\n}\r\n.dx-scheduler-small .dx-scheduler-pseudo-cell:before {\r\n    width: 50px;\r\n}\r\n.dx-scheduler-fixed-appointments {\r\n    z-index: 100;\r\n    position: absolute;\r\n    left: 100px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-fixed-appointments {\r\n    left: 50px;\r\n}\r\n.dx-scheduler-header {\r\n    position: relative;\r\n    z-index: 1;\r\n    width: 100%;\r\n}\r\n.dx-scheduler-navigator {\r\n    float: left;\r\n    padding-left: 10px;\r\n    white-space: nowrap;\r\n    min-width: 180px;\r\n    max-width: 40%;\r\n}\r\n.dx-device-mobile .dx-scheduler-navigator {\r\n    padding-left: 5px;\r\n}\r\n.dx-scheduler-navigator-caption {\r\n    width: 180px;\r\n    min-width: 108px;\r\n    max-width: 80%;\r\n}\r\n.dx-device-mobile .dx-scheduler-navigator-caption {\r\n    width: 140px;\r\n}\r\n.dx-calendar.dx-scheduler-navigator-calendar {\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs {\r\n    max-width: 52%;\r\n    min-width: 72px;\r\n    width: auto;\r\n    float: right;\r\n    height: 100%;\r\n    border: none;\r\n}\r\n.dx-scheduler-small .dx-scheduler-view-switcher.dx-tabs {\r\n    display: none;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tabs-scrollable .dx-tabs-wrapper {\r\n    border-bottom: none;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tab {\r\n    width: 100px;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tab.dx-tab-selected:before {\r\n    position: absolute;\r\n    bottom: -2px;\r\n    width: 100%;\r\n    height: 2px;\r\n    content: '';\r\n    right: 0;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tab.dx-state-focused:after {\r\n    border-bottom: none;\r\n}\r\n.dx-scheduler-view-switcher.dx-dropdownmenu.dx-button {\r\n    position: absolute;\r\n    right: 10px;\r\n}\r\n.dx-scheduler-view-switcher-label {\r\n    position: absolute;\r\n}\r\n.dx-scheduler-view-switcher-reduced {\r\n    table-layout: auto;\r\n}\r\n.dx-scheduler-view-switcher-reduced.dx-tabs .dx-tab {\r\n    width: auto;\r\n    height: 56px;\r\n}\r\n.dx-scheduler-view-switcher-reduced .dx-tabs-wrapper {\r\n    height: 56px;\r\n}\r\n.dx-scheduler-appointment-content-allday {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space {\r\n    border: 1px solid rgba(221, 221, 221, 0.6);\r\n    background-color: #fff;\r\n    position: relative;\r\n    display: inline-block;\r\n    overflow: hidden;\r\n    height: 100%;\r\n    width: 100%;\r\n    border-top: none;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-grouped:not(.dx-scheduler-agenda) .dx-scheduler-all-day-title {\r\n    border-top: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-grouped:not(.dx-scheduler-agenda) .dx-scheduler-date-table-cell {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-grouped:not(.dx-scheduler-agenda) .dx-scheduler-all-day-panel td {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-top: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 50px;\r\n    margin-bottom: -50px;\r\n}\r\n.dx-scheduler-work-space[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 80px;\r\n    margin-bottom: -80px;\r\n}\r\n.dx-scheduler-work-space[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 110px;\r\n    margin-bottom: -110px;\r\n}\r\n.dx-scheduler-work-space[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 140px;\r\n    margin-bottom: -140px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 125px;\r\n    margin-bottom: -125px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 155px;\r\n    margin-bottom: -155px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 185px;\r\n    margin-bottom: -185px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 215px;\r\n    margin-bottom: -215px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 75px;\r\n    margin-bottom: -75px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 105px;\r\n    margin-bottom: -105px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 135px;\r\n    margin-bottom: -135px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 165px;\r\n    margin-bottom: -165px;\r\n}\r\n.dx-scheduler-work-space:not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space:not(.dx-scheduler-work-space-month).dx-scheduler-work-space:not(.dx-scheduler-timeline) .dx-scheduler-header-panel {\r\n    border-bottom: 2px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-month .dx-scheduler-header-panel {\r\n    border-bottom: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-date-table-scrollable .dx-scrollable-content {\r\n    overflow: hidden;\r\n    position: relative;\r\n}\r\n.dx-scheduler-date-table-cell {\r\n    border-top: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-date-table-cell > div {\r\n    pointer-events: none;\r\n}\r\n.dx-scheduler-date-table-cell,\r\n.dx-scheduler-header-panel-cell,\r\n.dx-scheduler-time-panel-cell,\r\n.dx-scheduler-group-header {\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    -o-user-select: none;\r\n    user-select: none;\r\n    -webkit-touch-callout: none;\r\n    cursor: default;\r\n}\r\n.dx-scheduler-date-table-current-date {\r\n    font-weight: bold;\r\n}\r\n.dx-scheduler-date-table-other-month {\r\n    opacity: 0.5;\r\n}\r\n.dx-scheduler-work-space-day .dx-scheduler-date-table-row:nth-child(odd) .dx-scheduler-date-table-cell,\r\n.dx-scheduler-work-space-week .dx-scheduler-date-table-row:nth-child(odd) .dx-scheduler-date-table-cell,\r\n.dx-scheduler-work-space-work-week .dx-scheduler-date-table-row:nth-child(odd) .dx-scheduler-date-table-cell {\r\n    border-top: 1px solid #c4c4c4;\r\n}\r\n.dx-scheduler-work-space-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 0;\r\n    margin-bottom: 0;\r\n}\r\n.dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 30px;\r\n    margin-bottom: -30px;\r\n}\r\n.dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 60px;\r\n    margin-bottom: -60px;\r\n}\r\n.dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 90px;\r\n    margin-bottom: -90px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 75px;\r\n    margin-bottom: -75px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 105px;\r\n    margin-bottom: -105px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 135px;\r\n    margin-bottom: -135px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 165px;\r\n    margin-bottom: -165px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 25px;\r\n    margin-bottom: -25px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 55px;\r\n    margin-bottom: -55px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 85px;\r\n    margin-bottom: -85px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 115px;\r\n    margin-bottom: -115px;\r\n}\r\n.dx-scheduler-work-space-day .dx-scheduler-date-table-cell {\r\n    border-left: none;\r\n    border-right: none;\r\n}\r\n.dx-scheduler-work-space-day:not(.dx-scheduler-work-space-grouped) .dx-scheduler-header-panel {\r\n    margin-top: 1px;\r\n}\r\n.dx-scheduler-work-space-day .dx-scheduler-date-table-row:first-child .dx-scheduler-date-table-cell,\r\n.dx-scheduler-work-space-work-week .dx-scheduler-date-table-row:first-child .dx-scheduler-date-table-cell,\r\n.dx-scheduler-work-space-week .dx-scheduler-date-table .dx-scheduler-date-table-row:first-child .dx-scheduler-date-table-cell {\r\n    border-top: none;\r\n}\r\n.dx-scheduler-all-day-table-cell {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-top: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space-day .dx-scheduler-all-day-table-cell {\r\n    border-top: none;\r\n    border-left: none;\r\n}\r\n.dx-scheduler-work-space-week .dx-scheduler-all-day-title,\r\n.dx-scheduler-work-space-work-week .dx-scheduler-all-day-title {\r\n    border-top: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space-month .dx-scrollable .dx-scrollable-content {\r\n    height: 100%;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-all-day-title {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-header-panel {\r\n    width: 100%;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-small .dx-scheduler-work-space-month .dx-scheduler-header-panel {\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-header-panel .dx-scheduler-group-row:before,\r\n.dx-scheduler-work-space-month .dx-scheduler-header-panel .dx-scheduler-header-row:before {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-small .dx-scheduler-work-space-month .dx-scheduler-date-table {\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table .dx-scheduler-date-table-row:before {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table-cell,\r\n.dx-scheduler-work-space-month .dx-scheduler-header-panel-cell {\r\n    border-right: none;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table-cell:first-child,\r\n.dx-scheduler-work-space-month .dx-scheduler-header-panel-cell:first-child {\r\n    border-left: none;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-all-day-table-cell,\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table-cell {\r\n    height: auto;\r\n    vertical-align: top;\r\n    text-align: right;\r\n    font-size: 16px;\r\n    color: #959595;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-all-day-table-cell.dx-state-focused,\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table-cell.dx-state-focused {\r\n    background-position: 10% 10%;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-all-day-table-cell > div,\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table-cell > div {\r\n    padding-right: 6px;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment-content {\r\n    padding: 0 7px;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment-recurrence .dx-scheduler-appointment-content {\r\n    padding: 0 25px 0 7px;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-appointment-recurrence .dx-scheduler-appointment-content {\r\n    padding: 0 7px 0 25px;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment-recurrence-icon {\r\n    top: 0;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-fixed-appointments {\r\n    left: 0;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-all-day-panel,\r\n.dx-scheduler-timeline .dx-scheduler-all-day-panel,\r\n.dx-scheduler-work-space-month .dx-scheduler-all-day-title,\r\n.dx-scheduler-timeline .dx-scheduler-all-day-title {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment-reduced .dx-scheduler-appointment-recurrence-icon,\r\n.dx-scheduler-timeline .dx-scheduler-appointment-reduced .dx-scheduler-appointment-recurrence-icon {\r\n    right: 20px;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-header-row:before,\r\n.dx-scheduler-timeline .dx-scheduler-date-table .dx-scheduler-date-table-row:before {\r\n    content: none;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-date-table {\r\n    border-spacing: 0;\r\n    border-collapse: separate;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-header-panel-cell,\r\n.dx-scheduler-timeline .dx-scheduler-date-table-cell {\r\n    width: 200px;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-date-table-cell {\r\n    height: auto;\r\n    border-right: none;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-group-table {\r\n    border-spacing: 0;\r\n    border-collapse: separate;\r\n    border-top: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-timeline[dx-group-column-count='2'] .dx-scheduler-group-header:last-child,\r\n.dx-scheduler-timeline[dx-group-column-count='3'] .dx-scheduler-group-header:last-child {\r\n    font-weight: normal;\r\n    text-align: left;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-fixed-appointments {\r\n    left: 0;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-group-header {\r\n    padding: 0 10px 0 5px;\r\n    height: auto;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-group-header .dx-scheduler-group-header-content {\r\n    overflow: hidden;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-group-header .dx-scheduler-group-header-content div {\r\n    position: relative;\r\n    top: 50%;\r\n    -webkit-transform: translate(0, -50%);\r\n    -moz-transform: translate(0, -50%);\r\n    -ms-transform: translate(0, -50%);\r\n    -o-transform: translate(0, -50%);\r\n    transform: translate(0, -50%);\r\n    white-space: normal;\r\n    line-height: normal;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-date-table,\r\n.dx-scheduler-timeline .dx-scheduler-date-table-scrollable .dx-scrollable-content,\r\n.dx-scheduler-timeline .dx-scheduler-sidebar-scrollable .dx-scrollable-content,\r\n.dx-scheduler-timeline .dx-scheduler-group-table {\r\n    height: 100%;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-scrollable .dx-scrollable-content,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-both-scrollbar .dx-scheduler-sidebar-scrollable .dx-scrollable-content,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-both-scrollbar .dx-scheduler-group-table {\r\n    height: auto;\r\n    border-top: 1px solid transparent;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table .dx-scheduler-date-table-row:first-child .dx-scheduler-date-table-cell {\r\n    border-top: none;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-panel {\r\n    border-bottom: 1px solid #c4c4c4;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable:before {\r\n    border-bottom: 1px solid #c4c4c4;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-date-table-scrollable {\r\n    padding-bottom: 50px;\r\n    margin-bottom: -50px;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-header-scrollable {\r\n    height: auto;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-sidebar-scrollable {\r\n    display: none;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable {\r\n    display: block;\r\n    float: left;\r\n    padding-bottom: 50px;\r\n    margin-bottom: -50px;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable:before {\r\n    content: '';\r\n    height: 50px;\r\n    position: absolute;\r\n    display: block;\r\n    margin-top: -50px;\r\n    left: 0;\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-group-row .dx-scheduler-group-header {\r\n    border: none;\r\n    border-top: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-group-table {\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-date-table-row .dx-scheduler-date-table-cell:first-child,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-header-row .dx-scheduler-header-panel-cell:first-child {\r\n    border-left: none;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-group-row:before {\r\n    display: none;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-group-row:first-child .dx-scheduler-group-header {\r\n    border-top: none;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-scrollable {\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-scrollable.dx-scrollable {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-scrollable.dx-scrollable {\r\n    margin: 0;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='1'] .dx-scheduler-group-table,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='1'] .dx-scheduler-sidebar-scrollable,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='1'] .dx-scheduler-sidebar-scrollable:before {\r\n    width: 100px;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='1'] .dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='1'] .dx-scheduler-header-scrollable {\r\n    margin-left: 100px;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='1'] .dx-scheduler-date-table-scrollable,\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='1'] .dx-scheduler-header-scrollable {\r\n    margin-right: 100px;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='1'] .dx-scheduler-fixed-appointments {\r\n    left: 100px;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-group-table,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-sidebar-scrollable,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-sidebar-scrollable:before {\r\n    width: 160px;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-header-scrollable {\r\n    margin-left: 160px;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-date-table-scrollable,\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-header-scrollable {\r\n    margin-right: 160px;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-fixed-appointments {\r\n    left: 160px;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-group-table,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-sidebar-scrollable,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-sidebar-scrollable:before {\r\n    width: 180px;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-header-scrollable {\r\n    margin-left: 180px;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-date-table-scrollable,\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-header-scrollable {\r\n    margin-right: 180px;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-fixed-appointments {\r\n    left: 180px;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment-reduced .dx-scheduler-appointment-recurrence-icon {\r\n    top: 0;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week[dx-group-row-count='1'] .dx-scheduler-header-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 121px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week[dx-group-row-count='2'] .dx-scheduler-header-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 151px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week[dx-group-row-count='3'] .dx-scheduler-header-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 181px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week .dx-scheduler-header-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week .dx-scheduler-header-scrollable {\r\n    height: 91px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 90px;\r\n    margin-bottom: -90px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable:before,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable:before {\r\n    height: 91px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week .dx-scrollable.dx-scheduler-date-table-scrollable {\r\n    padding-bottom: 90px;\r\n    margin-bottom: -90px;\r\n}\r\n.dx-scheduler-work-space-week .dx-scheduler-header-panel-cell:nth-child(7n),\r\n.dx-scheduler-work-space-month .dx-scheduler-header-panel-cell:nth-child(7n),\r\n.dx-scheduler-work-space-week .dx-scheduler-date-table-cell:nth-child(7n),\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table-cell:nth-child(7n),\r\n.dx-scheduler-work-space-week .dx-scheduler-all-day-table-cell:nth-child(7n),\r\n.dx-scheduler-work-space-month .dx-scheduler-all-day-table-cell:nth-child(7n) {\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-week .dx-scheduler-header-panel-cell:nth-child(7n),\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-header-panel-cell:nth-child(7n),\r\n.dx-rtl .dx-scheduler-work-space-week .dx-scheduler-date-table-cell:nth-child(7n),\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-date-table-cell:nth-child(7n),\r\n.dx-rtl .dx-scheduler-work-space-week .dx-scheduler-all-day-table-cell:nth-child(7n),\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-all-day-table-cell:nth-child(7n) {\r\n    border-left: none;\r\n}\r\n.dx-scheduler-work-space-work-week .dx-scheduler-header-panel-cell:nth-child(5n),\r\n.dx-scheduler-work-space-work-week .dx-scheduler-date-table-cell:nth-child(5n),\r\n.dx-scheduler-work-space-work-week .dx-scheduler-all-day-table-cell:nth-child(5n) {\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-work-week .dx-scheduler-header-panel-cell:nth-child(5n),\r\n.dx-rtl .dx-scheduler-work-space-work-week .dx-scheduler-date-table-cell:nth-child(5n),\r\n.dx-rtl .dx-scheduler-work-space-work-week .dx-scheduler-all-day-table-cell:nth-child(5n) {\r\n    border-left: none;\r\n}\r\n.dx-scheduler-work-space-day .dx-scheduler-header-panel-cell:nth-child(1n),\r\n.dx-scheduler-work-space-day .dx-scheduler-date-table-cell:nth-child(1n),\r\n.dx-scheduler-work-space-day .dx-scheduler-all-day-table-cell:nth-child(1n) {\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-day .dx-scheduler-header-panel-cell:nth-child(1n),\r\n.dx-rtl .dx-scheduler-work-space-day .dx-scheduler-date-table-cell:nth-child(1n),\r\n.dx-rtl .dx-scheduler-work-space-day .dx-scheduler-all-day-table-cell:nth-child(1n) {\r\n    border-left: none;\r\n}\r\n.dx-scheduler-header-panel {\r\n    border-collapse: collapse;\r\n    table-layout: fixed;\r\n    margin-top: 10px;\r\n    width: 100%;\r\n    font-size: 20px;\r\n}\r\n.dx-scheduler-all-day-title-hidden {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space:not(.dx-scheduler-work-space-all-day) .dx-scheduler-all-day-title-hidden {\r\n    display: block;\r\n    background-color: transparent;\r\n    color: transparent;\r\n    border-left: none;\r\n    border-right: none;\r\n    border-bottom: none;\r\n    height: 0;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 81px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 111px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 141px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day) .dx-scheduler-header-scrollable {\r\n    height: 51px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day) .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day) .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 50px;\r\n    margin-bottom: -50px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 80px;\r\n    margin-bottom: -80px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 110px;\r\n    margin-bottom: -110px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day)[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 140px;\r\n    margin-bottom: -140px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 41px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 71px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 101px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day .dx-scheduler-header-scrollable {\r\n    height: 11px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 10px;\r\n    margin-bottom: -10px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 40px;\r\n    margin-bottom: -40px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 70px;\r\n    margin-bottom: -70px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day).dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 100px;\r\n    margin-bottom: -100px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day) .dx-scheduler-header-scrollable {\r\n    margin-left: 100px;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day) .dx-scheduler-header-scrollable {\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-small .dx-scheduler-work-space-grouped:not(.dx-scheduler-timeline):not(.dx-scheduler-agenda):not(.dx-scheduler-work-space-month):not(.dx-scheduler-work-space-all-day) .dx-scheduler-header-scrollable {\r\n    margin-left: 50px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-panel {\r\n    width: auto;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-panel .dx-scheduler-group-row:before,\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-panel .dx-scheduler-header-row:before {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-panel {\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-panel .dx-scheduler-all-day-table-row:before {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-title {\r\n    z-index: 100;\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-title:before {\r\n    content: '';\r\n    position: absolute;\r\n    left: 0;\r\n    width: 100px;\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-small .dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-title:before {\r\n    width: 50px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table {\r\n    float: none;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-small .dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table {\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table .dx-scheduler-date-table-row:before {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-cell {\r\n    height: 50px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-sidebar-scrollable {\r\n    float: left;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-scrollable {\r\n    margin-left: 100px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-scrollable {\r\n    margin-left: 50px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-time-panel {\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space-both-scrollbar[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 81px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 111px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 141px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-scrollable {\r\n    height: 51px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 31px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 61px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 91px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day .dx-scheduler-header-scrollable {\r\n    height: 1px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day .dx-scheduler-header-panel {\r\n    width: 100%;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-scrollable.dx-scrollable {\r\n    margin: 0 0 0 100px;\r\n    padding: 0;\r\n}\r\n.dx-scheduler-small .dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-scrollable.dx-scrollable {\r\n    margin: 0 0 0 50px;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-scrollable.dx-scrollable {\r\n    margin: 0 100px 0 0;\r\n}\r\n.dx-rtl.dx-scheduler-small .dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-scrollable.dx-scrollable {\r\n    margin: 0 50px 0 0;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 156px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 186px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 216px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day .dx-scheduler-header-scrollable {\r\n    height: 126px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 106px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 136px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 166px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-all-day-collapsed .dx-scheduler-header-scrollable {\r\n    height: 76px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 106px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 136px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 166px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day .dx-scheduler-header-scrollable {\r\n    height: 76px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 56px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 86px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 116px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed .dx-scheduler-header-scrollable {\r\n    height: 26px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-month .dx-scheduler-header-scrollable.dx-scrollable,\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-timeline:not(.dx-scheduler-work-space-grouped) .dx-scheduler-header-scrollable.dx-scrollable {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-month .dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-timeline:not(.dx-scheduler-work-space-grouped) .dx-scheduler-date-table-scrollable {\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-month[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 81px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-month[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 111px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-month[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 141px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-month .dx-scheduler-header-scrollable {\r\n    height: 51px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-month .dx-scheduler-sidebar-scrollable {\r\n    display: none;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-row .dx-scheduler-date-table-cell:first-child,\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-row .dx-scheduler-header-panel-cell:first-child,\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-table-row .dx-scheduler-all-day-table-cell:first-child {\r\n    border-left: none;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-scrollable-appointments {\r\n    top: 0;\r\n}\r\n.dx-scheduler-header-panel-cell {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n    color: #333;\r\n    padding: 0;\r\n    vertical-align: middle;\r\n    height: 40px;\r\n    text-align: center;\r\n    font-weight: normal;\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n.dx-scheduler-group-row:before,\r\n.dx-scheduler-header-row:before,\r\n.dx-scheduler-all-day-table-row:before {\r\n    content: '';\r\n    width: 100px;\r\n    display: table-cell;\r\n}\r\n.dx-scheduler-small .dx-scheduler-group-row:before,\r\n.dx-scheduler-small .dx-scheduler-header-row:before,\r\n.dx-scheduler-small .dx-scheduler-all-day-table-row:before {\r\n    width: 50px;\r\n}\r\n.dx-scheduler-all-day-panel {\r\n    width: 100%;\r\n}\r\n.dx-scheduler-all-day-panel .dx-scheduler-all-day-table-cell {\r\n    border-bottom: 2px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-all-day-title {\r\n    color: #333;\r\n    width: 100px;\r\n    height: 75px;\r\n    position: absolute;\r\n    line-height: 75px;\r\n    text-align: center;\r\n    border-bottom: 2px solid rgba(221, 221, 221, 0.6);\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    -o-user-select: none;\r\n    user-select: none;\r\n    -webkit-touch-callout: none;\r\n}\r\n.dx-scheduler-small .dx-scheduler-all-day-title {\r\n    width: 50px;\r\n}\r\n.dx-scheduler-work-space-all-day-collapsed .dx-scheduler-all-day-title {\r\n    height: 25px;\r\n    line-height: 25px;\r\n}\r\n.dx-scheduler-all-day-table {\r\n    border-collapse: collapse;\r\n    table-layout: fixed;\r\n    width: 100%;\r\n}\r\n.dx-scheduler-all-day-table {\r\n    height: 75px;\r\n}\r\n.dx-scheduler-work-space-all-day-collapsed .dx-scheduler-all-day-table {\r\n    height: 25px;\r\n}\r\n.dx-scheduler-group-header {\r\n    height: 30px;\r\n    text-align: center;\r\n}\r\n.dx-scheduler-time-panel {\r\n    float: left;\r\n    width: 100px;\r\n    border-collapse: collapse;\r\n    margin-top: -50px;\r\n    font-size: 20px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-time-panel {\r\n    width: 50px;\r\n    font-size: 14px;\r\n}\r\n.dx-scheduler-time-panel tbody:after {\r\n    content: '';\r\n    height: 50px;\r\n    display: table-cell;\r\n}\r\n.dx-scheduler-time-panel-odd-row-count .dx-scheduler-time-panel-row:last-child .dx-scheduler-time-panel-cell {\r\n    border-bottom: none;\r\n}\r\n.dx-scheduler-time-panel-odd-row-count tbody:after {\r\n    content: none;\r\n}\r\n.dx-scheduler-time-panel-cell {\r\n    color: #333;\r\n    border-bottom: 1px solid rgba(221, 221, 221, 0.6);\r\n    position: relative;\r\n    width: 100%;\r\n    text-align: center;\r\n    height: 100px;\r\n    padding-left: 10px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-time-panel-cell {\r\n    padding-left: 0;\r\n}\r\n.dx-scheduler-time-panel-row:first-child .dx-scheduler-time-panel-cell {\r\n    padding-top: 35px;\r\n}\r\n.dx-scheduler-time-panel-cell:after {\r\n    position: absolute;\r\n    bottom: -1px;\r\n    width: 50%;\r\n    height: 1px;\r\n    content: '';\r\n    left: 0;\r\n    background-color: #fff;\r\n}\r\n.dx-scheduler-date-table {\r\n    width: 100%;\r\n    border-collapse: collapse;\r\n    table-layout: fixed;\r\n    float: left;\r\n    margin-left: -100px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-date-table {\r\n    margin-left: -50px;\r\n}\r\n.dx-scheduler-date-table .dx-scheduler-date-table-row:before {\r\n    content: '';\r\n    width: 100px;\r\n    display: table-cell;\r\n}\r\n.dx-scheduler-small .dx-scheduler-date-table .dx-scheduler-date-table-row:before {\r\n    width: 50px;\r\n}\r\n.dx-scheduler-date-table-cell {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n    height: 50px;\r\n}\r\n.dx-scheduler-all-day-table-cell.dx-state-active,\r\n.dx-scheduler-date-table-cell.dx-state-active {\r\n    background-color: #c4c4c4;\r\n}\r\n.dx-scheduler-all-day-table-cell.dx-state-hover,\r\n.dx-scheduler-date-table-cell.dx-state-hover {\r\n    background-color: #959595;\r\n}\r\n.dx-scheduler-all-day-table-cell.dx-state-hover.dx-state-focused,\r\n.dx-scheduler-date-table-cell.dx-state-hover.dx-state-focused {\r\n    background-color: #dbe9f5;\r\n}\r\n.dx-scheduler-all-day-table-cell.dx-state-focused,\r\n.dx-scheduler-date-table-cell.dx-state-focused {\r\n    background-color: #dbe9f5;\r\n    opacity: 1;\r\n}\r\n.dx-scheduler-all-day-table-cell.dx-scheduler-focused-cell,\r\n.dx-scheduler-date-table-cell.dx-scheduler-focused-cell {\r\n    box-shadow: inset 0 0 0 1px #337ab7;\r\n}\r\n.dx-scheduler-date-table-droppable-cell {\r\n    background-color: #f2f2f2;\r\n}\r\n.dx-scheduler-scrollable-appointments {\r\n    position: absolute;\r\n}\r\n.dx-scheduler-appointment {\r\n    border-top: 1px solid transparent;\r\n    border-left: 1px solid transparent;\r\n    background-clip: padding-box;\r\n    position: absolute;\r\n    cursor: default;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    -o-user-select: none;\r\n    user-select: none;\r\n    -webkit-touch-callout: none;\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n    -webkit-box-shadow: inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    left: 0;\r\n}\r\n.dx-scheduler-appointment.dx-state-active,\r\n.dx-scheduler-appointment.dx-resizable-resizing {\r\n    -webkit-box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-appointment.dx-state-focused {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-scheduler-appointment.dx-state-focused:before {\r\n    pointer-events: none;\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n}\r\n.dx-scheduler-appointment.dx-state-focused:before {\r\n    background-color: rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-appointment.dx-state-hover {\r\n    -webkit-box-shadow: inset 0px 5px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset 0px 5px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset 0px 5px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-appointment.dx-state-hover.dx-resizable {\r\n    -webkit-box-shadow: inset 0px 5px 0px 0px rgba(0, 0, 0, 0.3), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset 0px 5px 0px 0px rgba(0, 0, 0, 0.3), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset 0px 5px 0px 0px rgba(0, 0, 0, 0.3), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-appointment.dx-state-hover .dx-resizable-handle-top {\r\n    height: 5px;\r\n}\r\n.dx-scheduler-appointment.dx-state-hover .dx-resizable-handle-left {\r\n    width: 5px;\r\n}\r\n.dx-scheduler-appointment.dx-draggable-dragging {\r\n    -webkit-box-shadow: 7px 7px 15px 0px rgba(50, 50, 50, 0.2), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: 7px 7px 15px 0px rgba(50, 50, 50, 0.2), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: 7px 7px 15px 0px rgba(50, 50, 50, 0.2), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.3), inset 0px 2px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-appointment.dx-resizable-resizing,\r\n.dx-scheduler-appointment.dx-draggable-dragging {\r\n    z-index: 1000;\r\n    opacity: .7;\r\n}\r\n.dx-scheduler-appointment .dx-resizable-handle-left {\r\n    left: -1px;\r\n}\r\n.dx-scheduler-appointment .dx-scheduler-appointment-reduced-icon {\r\n    position: absolute;\r\n    top: 3px;\r\n    right: 5px;\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-scheduler-appointment .dx-scheduler-appointment-reduced-icon:before {\r\n    content: '\\F00E';\r\n}\r\n.dx-rtl .dx-scheduler-appointment .dx-scheduler-appointment-reduced-icon {\r\n    right: auto;\r\n    left: 3px;\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-rtl .dx-scheduler-appointment .dx-scheduler-appointment-reduced-icon:before {\r\n    content: '\\F011';\r\n}\r\n.dx-scheduler-appointment.dx-scheduler-appointment-empty .dx-scheduler-appointment-reduced-icon,\r\n.dx-scheduler-appointment.dx-scheduler-appointment-tail .dx-scheduler-appointment-reduced-icon {\r\n    display: none;\r\n}\r\n.dx-scheduler-appointment.dx-state-disabled {\r\n    cursor: default;\r\n    opacity: .6;\r\n}\r\n.dx-scheduler-work-space-week .dx-scheduler-appointment-reduced .dx-scheduler-appointment-content,\r\n.dx-scheduler-work-space-work-week .dx-scheduler-appointment-reduced .dx-scheduler-appointment-content,\r\n.dx-scheduler-work-space-day .dx-scheduler-appointment-reduced .dx-scheduler-appointment-content {\r\n    padding: 5px 20px 5px 7px;\r\n}\r\n.dx-scheduler-work-space-week .dx-scheduler-appointment-reduced-icon,\r\n.dx-scheduler-work-space-work-week .dx-scheduler-appointment-reduced-icon,\r\n.dx-scheduler-work-space-day .dx-scheduler-appointment-reduced-icon {\r\n    top: 9px;\r\n}\r\n.dx-scheduler-work-space-week .dx-scheduler-appointment-head .dx-scheduler-appointment-recurrence-icon,\r\n.dx-scheduler-work-space-work-week .dx-scheduler-appointment-head .dx-scheduler-appointment-recurrence-icon,\r\n.dx-scheduler-work-space-day .dx-scheduler-appointment-head .dx-scheduler-appointment-recurrence-icon {\r\n    top: 20px;\r\n    right: 5px;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment,\r\n.dx-scheduler-all-day-appointment {\r\n    -webkit-box-shadow: inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-rtl .dx-scheduler-timeline .dx-scheduler-appointment,\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-appointment,\r\n.dx-rtl .dx-scheduler-all-day-appointment {\r\n    -webkit-box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment.dx-state-active,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-active,\r\n.dx-scheduler-all-day-appointment.dx-state-active,\r\n.dx-scheduler-timeline .dx-scheduler-appointment.dx-resizable-resizing,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-resizable-resizing,\r\n.dx-scheduler-all-day-appointment.dx-resizable-resizing {\r\n    -webkit-box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment.dx-state-focused,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-focused,\r\n.dx-scheduler-all-day-appointment.dx-state-focused {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment.dx-state-focused:before,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-focused:before,\r\n.dx-scheduler-all-day-appointment.dx-state-focused:before {\r\n    pointer-events: none;\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment.dx-state-focused:before,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-focused:before,\r\n.dx-scheduler-all-day-appointment.dx-state-focused:before {\r\n    background-color: rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment.dx-state-hover,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-hover,\r\n.dx-scheduler-all-day-appointment.dx-state-hover {\r\n    -webkit-box-shadow: inset 5px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset 5px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset 5px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment.dx-state-hover.dx-resizable,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-hover.dx-resizable,\r\n.dx-scheduler-all-day-appointment.dx-state-hover.dx-resizable {\r\n    -webkit-box-shadow: inset 5px 0px 0px 0px rgba(0, 0, 0, 0.3), inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset 5px 0px 0px 0px rgba(0, 0, 0, 0.3), inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset 5px 0px 0px 0px rgba(0, 0, 0, 0.3), inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-rtl .dx-scheduler-timeline .dx-scheduler-appointment.dx-state-hover,\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-hover,\r\n.dx-rtl .dx-scheduler-all-day-appointment.dx-state-hover {\r\n    -webkit-box-shadow: inset -5px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset -5px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset -5px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-rtl .dx-scheduler-timeline .dx-scheduler-appointment.dx-state-hover.dx-resizable,\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-hover.dx-resizable,\r\n.dx-rtl .dx-scheduler-all-day-appointment.dx-state-hover.dx-resizable {\r\n    -webkit-box-shadow: inset -5px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    -moz-box-shadow: inset -5px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n    box-shadow: inset -5px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3);\r\n}\r\n.dx-scheduler-timeline .dx-scheduler-appointment.dx-draggable-dragging,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-draggable-dragging,\r\n.dx-scheduler-all-day-appointment.dx-draggable-dragging {\r\n    -webkit-box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3), 7px 7px 15px 0px rgba(50, 50, 50, 0.2);\r\n    -moz-box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3), 7px 7px 15px 0px rgba(50, 50, 50, 0.2);\r\n    box-shadow: inset -2px 0px 0px 0px rgba(0, 0, 0, 0.3), inset 2px 0px 0px 0px rgba(0, 0, 0, 0.3), 7px 7px 15px 0px rgba(50, 50, 50, 0.2);\r\n}\r\n.dx-scheduler-all-day-appointment .dx-scheduler-appointment-reduced-icon {\r\n    position: absolute;\r\n    top: 35%;\r\n}\r\n.dx-scheduler-appointment.dx-scheduler-appointment-body,\r\n.dx-scheduler-appointment.dx-scheduler-appointment-tail {\r\n    box-shadow: none;\r\n}\r\n.dx-scheduler-group-header-content div {\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n.dx-scheduler-appointment-recurrence-icon {\r\n    position: absolute;\r\n    background-repeat: no-repeat;\r\n    top: 3px;\r\n    right: 7px;\r\n    display: none;\r\n}\r\n.dx-scheduler-appointment-recurrence-icon.dx-icon-repeat {\r\n    font-size: 18px;\r\n}\r\n.dx-scheduler-appointment-recurrence .dx-scheduler-appointment-recurrence-icon {\r\n    display: block;\r\n}\r\n.dx-scheduler-appointment-recurrence .dx-scheduler-appointment-content {\r\n    padding: 5px 25px 5px 7px;\r\n}\r\n.dx-rtl .dx-scheduler-appointment-recurrence .dx-scheduler-appointment-content {\r\n    padding: 5px 7px 5px 25px;\r\n}\r\n.dx-scheduler-appointment-content {\r\n    padding: 5px 7px;\r\n    cursor: pointer;\r\n    height: 100%;\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-month .dx-scheduler-appointment-content {\r\n    font-size: 12px;\r\n}\r\n.dx-scheduler-appointment-content > * {\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n.dx-scheduler-appointment-empty .dx-scheduler-appointment-content-details,\r\n.dx-scheduler-appointment-empty .dx-scheduler-appointment-title,\r\n.dx-scheduler-appointment-empty .dx-scheduler-appointment-recurrence-icon {\r\n    display: none;\r\n}\r\n.dx-scheduler-appointment-content-details {\r\n    font-size: 11px;\r\n    white-space: pre;\r\n    overflow: hidden;\r\n}\r\n.dx-scheduler-all-day-appointment .dx-scheduler-appointment-content-details,\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment-content-details {\r\n    display: none;\r\n}\r\n.dx-scheduler-appointment-content-date {\r\n    opacity: .7;\r\n    display: inline-block;\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n.dx-scheduler-appointment-tooltip {\r\n    text-align: left;\r\n    width: 250px;\r\n}\r\n.dx-scheduler-appointment-tooltip .dx-button-content {\r\n    font-size: 13.33333333px;\r\n}\r\n.dx-scheduler-appointment-tooltip .dx-button-content .dx-icon {\r\n    font-size: 16px;\r\n}\r\n.dx-scheduler-appointment-tooltip-date,\r\n.dx-scheduler-appointment-tooltip-title {\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n.dx-scheduler-appointment-tooltip-title {\r\n    font-size: 16px;\r\n    font-weight: bold;\r\n    width: 100%;\r\n}\r\n.dx-scheduler-appointment-tooltip-buttons {\r\n    margin-top: 10px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-layout-manager .dx-label-h-align .dx-field-item-content .dx-switch,\r\n.dx-scheduler-appointment-popup .dx-layout-manager .dx-label-h-align .dx-field-item-content .dx-checkbox {\r\n    margin: 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-field-item {\r\n    padding-left: 20px;\r\n    padding-right: 20px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-layout-manager-one-col .dx-field-item {\r\n    padding-left: 20px;\r\n    padding-right: 20px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item {\r\n    position: relative;\r\n    padding-left: 0;\r\n    padding-right: 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-item-label {\r\n    vertical-align: top;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-item-label.dx-field-item-label-location-left,\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-item-label.dx-field-item-label-location-top {\r\n    padding-left: 20px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-item-label.dx-field-item-label-location-right {\r\n    padding-right: 20px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-value,\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-label {\r\n    float: none;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-value .dx-recurrence-numberbox-repeat-count,\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-label .dx-recurrence-numberbox-repeat-count {\r\n    float: left;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-value {\r\n    display: inline-block;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-label {\r\n    padding: 3px 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item.dx-scheduler-recurrence-rule-item-opened:before {\r\n    display: block;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item:before {\r\n    content: '';\r\n    position: absolute;\r\n    top: 50px;\r\n    bottom: 0;\r\n    width: 100%;\r\n    display: none;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item.dx-label-v-align:before {\r\n    top: 70px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item.dx-label-v-align .dx-recurrence-editor {\r\n    padding-left: 20px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item .dx-field-item-content-location-left .dx-recurrence-editor {\r\n    padding-left: 20px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-field {\r\n    min-height: 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-field-label {\r\n    width: auto;\r\n}\r\n.dx-scheduler-appointment-popup .dx-field-value:not(.dx-switch):not(.dx-numberbox):not(.dx-datebox) {\r\n    width: auto;\r\n}\r\n.dx-scheduler-appointment-popup .dx-field-value {\r\n    padding-left: 0;\r\n    padding-right: 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-field-value:not(.dx-widget) > .dx-checkbox {\r\n    float: left;\r\n}\r\n.dx-scheduler-appointment-popup .dx-field-value:not(.dx-widget) > .dx-checkbox.dx-rtl {\r\n    float: right;\r\n}\r\n.dx-numberbox.dx-recurrence-numberbox-interval,\r\n.dx-numberbox.dx-recurrence-numberbox-day-of-month,\r\n.dx-selectbox.dx-recurrence-selectbox-month-of-year,\r\n.dx-numberbox.dx-recurrence-numberbox-repeat-count,\r\n.dx-datebox.dx-recurrence-datebox-until-date,\r\n.dx-switch.dx-recurrence-switch-repeat-end {\r\n    float: left;\r\n    position: relative !important;\r\n}\r\n.dx-numberbox.dx-recurrence-numberbox-interval.dx-rtl,\r\n.dx-numberbox.dx-recurrence-numberbox-day-of-month.dx-rtl,\r\n.dx-selectbox.dx-recurrence-selectbox-month-of-year.dx-rtl,\r\n.dx-numberbox.dx-recurrence-numberbox-repeat-count.dx-rtl,\r\n.dx-datebox.dx-recurrence-datebox-until-date.dx-rtl,\r\n.dx-switch.dx-recurrence-switch-repeat-end.dx-rtl {\r\n    float: right;\r\n}\r\n.dx-recurrence-numberbox-interval,\r\n.dx-recurrence-numberbox-day-of-month,\r\n.dx-recurrence-numberbox-repeat-count {\r\n    width: 70px !important;\r\n}\r\n.dx-datebox.dx-recurrence-datebox-until-date {\r\n    width: inherit !important;\r\n}\r\n.dx-recurrence-radiogroup-repeat-type-label,\r\n.dx-recurrence-repeat-end-label {\r\n    display: inline-block;\r\n    padding: 0 5px;\r\n    vertical-align: top;\r\n}\r\n.dx-recurrence-repeat-end-label {\r\n    float: left;\r\n    width: 50px;\r\n    white-space: nowrap;\r\n}\r\n.dx-recurrence-selectbox-month-of-year {\r\n    width: 120px !important;\r\n    top: 0 !important;\r\n}\r\n.dx-recurrence-checkbox-day-of-week {\r\n    position: relative !important;\r\n    padding-right: 10px;\r\n}\r\n.dx-recurrence-radiogroup-repeat-type {\r\n    margin: 0;\r\n}\r\n.dx-recurrence-radiogroup-repeat-type .dx-item:first-child {\r\n    padding-bottom: 10px;\r\n}\r\n.dx-recurrence-radiogroup-repeat-type.dx-rtl .dx-recurrence-repeat-end-label {\r\n    float: right;\r\n}\r\n.dx-scheduler-dropdown-appointments {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-scheduler-dropdown-appointments.dx-button,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-hover,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-active,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-focused {\r\n    background-color: #337ab7;\r\n    border: none;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-scheduler-dropdown-appointments.dx-button .dx-scheduler-dropdown-appointments-content,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-hover .dx-scheduler-dropdown-appointments-content,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-active .dx-scheduler-dropdown-appointments-content,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-focused .dx-scheduler-dropdown-appointments-content {\r\n    color: #fff;\r\n}\r\n.dx-scheduler-dropdown-appointments.dx-button .dx-button-content,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-hover .dx-button-content,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-active .dx-button-content,\r\n.dx-scheduler-dropdown-appointments.dx-button.dx-state-focused .dx-button-content {\r\n    line-height: inherit;\r\n}\r\n.dx-scheduler-dropdown-appointment {\r\n    border-left: 3px solid #337ab7;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-date-table-scrollable {\r\n    margin-top: 10px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 0;\r\n    margin-bottom: 0;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 30px;\r\n    margin-bottom: -30px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 60px;\r\n    margin-bottom: -60px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 90px;\r\n    margin-bottom: -90px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 75px;\r\n    margin-bottom: -75px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 105px;\r\n    margin-bottom: -105px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 135px;\r\n    margin-bottom: -135px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 165px;\r\n    margin-bottom: -165px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 25px;\r\n    margin-bottom: -25px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 55px;\r\n    margin-bottom: -55px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 85px;\r\n    margin-bottom: -85px;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-agenda.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 115px;\r\n    margin-bottom: -115px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-scrollable-appointments {\r\n    padding-left: 100px;\r\n    width: 100%;\r\n    height: 0;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda .dx-scheduler-scrollable-appointments {\r\n    padding-left: 50px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda .dx-scheduler-scrollable-appointments.dx-rtl {\r\n    padding-left: 0;\r\n    padding-right: 50px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-appointment {\r\n    position: relative;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-time-panel {\r\n    margin-top: 0;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-time-panel-row:first-child .dx-scheduler-time-panel-cell {\r\n    padding-top: 0;\r\n    padding-bottom: 0;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-time-panel-cell {\r\n    vertical-align: top;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-time-panel-cell .dx-scheduler-agenda-date,\r\n.dx-scheduler-agenda .dx-scheduler-time-panel-cell .dx-scheduler-agenda-week-day {\r\n    display: block;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-time-panel tbody:after {\r\n    display: none;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-group-table {\r\n    border-spacing: 0;\r\n    border-collapse: collapse;\r\n    margin-top: 0;\r\n    height: 100%;\r\n    float: left;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-time-panel-cell,\r\n.dx-scheduler-agenda .dx-scheduler-date-table-cell {\r\n    border: none;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space-grouped .dx-scheduler-date-table {\r\n    float: right;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space-grouped .dx-scheduler-group-row:before {\r\n    display: none;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space-grouped .dx-scheduler-group-row:first-child .dx-scheduler-group-header-content:before {\r\n    border-bottom: none;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space-grouped .dx-scheduler-time-panel-cell:after {\r\n    display: none;\r\n}\r\n.dx-scheduler-agenda.dx-scheduler-work-space-grouped .dx-scheduler-date-table-last-row.dx-scheduler-date-table-row {\r\n    border-bottom: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-date-table {\r\n    margin-right: -80px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-date-table {\r\n    margin-left: -40px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-date-table {\r\n    margin-left: -80px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-date-table {\r\n    margin-left: -40px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 180px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 90px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 0;\r\n    padding-right: 180px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-scrollable-appointments {\r\n    padding-right: 90px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-date-table {\r\n    margin-right: -160px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-date-table {\r\n    margin-left: -80px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-date-table {\r\n    margin-left: -160px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-date-table {\r\n    margin-left: -80px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 260px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 130px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 0;\r\n    padding-right: 260px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-scrollable-appointments {\r\n    padding-right: 130px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-date-table {\r\n    margin-right: -240px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-date-table {\r\n    margin-left: -120px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-date-table {\r\n    margin-left: -240px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-date-table {\r\n    margin-left: -120px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 340px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 170px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 0;\r\n    padding-right: 340px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-scrollable-appointments {\r\n    padding-right: 170px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-group-header {\r\n    vertical-align: top;\r\n    width: 80px;\r\n    border-top: none;\r\n    border-left: none;\r\n    border-right: none;\r\n    font-size: 18px;\r\n    font-weight: normal;\r\n    padding: 0;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda .dx-scheduler-group-header {\r\n    width: 40px;\r\n    font-size: 14px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-group-header[rowspan='2'],\r\n.dx-scheduler-agenda .dx-scheduler-group-header[rowspan='3'] {\r\n    font-weight: bold;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-group-header-content {\r\n    width: 80px;\r\n    overflow: hidden;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-group-header-content:before {\r\n    content: '';\r\n    display: block;\r\n    height: 1px;\r\n    width: 100%;\r\n    border-bottom: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda .dx-scheduler-group-header-content {\r\n    width: 38px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-group-header-content div {\r\n    white-space: normal;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-appointment-content {\r\n    font-size: 16px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-appointment-content .dx-scheduler-appointment-content-date,\r\n.dx-scheduler-agenda .dx-scheduler-appointment-content .dx-scheduler-appointment-content-allday {\r\n    opacity: 1;\r\n    font-weight: bold;\r\n    font-size: 13px;\r\n    margin-top: 4px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-appointment-content-allday {\r\n    display: inline-block;\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    padding-right: 5px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda .dx-scheduler-appointment-content-allday {\r\n    padding-right: 0;\r\n    padding-left: 5px;\r\n}\r\n.dx-scheduler-agenda-nodata {\r\n    font-size: 20px;\r\n    opacity: 0.5;\r\n    text-align: center;\r\n    position: absolute;\r\n    top: 45%;\r\n    left: 0;\r\n    right: 0;\r\n}\r\n.dx-timezone-editor {\r\n    overflow: hidden;\r\n}\r\n.dx-timezone-editor .dx-timezone-display-name {\r\n    float: left;\r\n    width: 75%;\r\n}\r\n.dx-timezone-editor .dx-timezone-iana-id {\r\n    float: right;\r\n    width: 23%;\r\n}\r\n.dx-rtl .dx-scheduler-navigator {\r\n    float: right;\r\n    padding-left: 0;\r\n    padding-right: 10px;\r\n}\r\n.dx-device-mobile .dx-rtl .dx-scheduler-navigator {\r\n    padding-right: 5px;\r\n}\r\n.dx-rtl .dx-scheduler-view-switcher.dx-tabs {\r\n    float: left;\r\n}\r\n.dx-rtl .dx-scheduler-view-switcher.dx-dropdownmenu {\r\n    left: 10px;\r\n    right: auto;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-date-table {\r\n    margin-right: 0;\r\n}\r\n.dx-rtl .dx-scheduler-header-panel {\r\n    left: 0;\r\n    right: inherit;\r\n}\r\n.dx-rtl .dx-scheduler-all-day-panel table {\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-scheduler-time-panel {\r\n    float: right;\r\n}\r\n.dx-rtl .dx-scheduler-time-panel-cell {\r\n    padding-left: 0;\r\n    padding-right: 10px;\r\n}\r\n.dx-rtl .dx-scheduler-time-panel-cell:after {\r\n    right: 0;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-header-panel-cell,\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-date-table-cell {\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-header-panel-cell:first-child,\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-date-table-cell:first-child {\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-scheduler-date-table {\r\n    float: right;\r\n    margin-left: 0;\r\n    margin-right: -100px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-date-table {\r\n    margin-right: -50px;\r\n}\r\n.dx-rtl .dx-scheduler-appointment-tooltip {\r\n    text-align: right;\r\n}\r\n.dx-rtl .dx-scheduler-appointment-recurrence-icon {\r\n    left: 7px;\r\n    right: auto;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-month .dx-scheduler-appointment-reduced .dx-scheduler-appointment-recurrence-icon,\r\n.dx-rtl .dx-scheduler-timeline .dx-scheduler-appointment-reduced .dx-scheduler-appointment-recurrence-icon {\r\n    left: 20px;\r\n    right: auto;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-week .dx-scheduler-all-day-table-cell,\r\n.dx-rtl .dx-scheduler-work-space-work-week .dx-scheduler-all-day-table-cell {\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-left: none;\r\n}\r\n.dx-rtl .dx-scheduler-dropdown-appointment {\r\n    border-left: none;\r\n    border-right: 3px solid #337ab7;\r\n}\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-title {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: none;\r\n}\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-title:before {\r\n    right: 0;\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: none;\r\n}\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table {\r\n    margin-right: 0;\r\n}\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-sidebar-scrollable {\r\n    float: right;\r\n}\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-scrollable {\r\n    margin-right: 100px;\r\n    margin-left: auto;\r\n}\r\n.dx-scheduler-small .dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-scrollable {\r\n    margin-right: 50px;\r\n}\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-time-panel {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: none;\r\n}\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-month .dx-scheduler-date-table-scrollable {\r\n    margin-right: 0;\r\n}\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-row .dx-scheduler-date-table-cell:first-child,\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-row .dx-scheduler-header-panel-cell:first-child,\r\n.dx-rtl.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-table-row .dx-scheduler-all-day-table-cell:first-child {\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable {\r\n    float: right;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable:before {\r\n    right: 0;\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-group-table {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-date-table {\r\n    margin-right: 0;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-fixed-appointments {\r\n    left: 0;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped .dx-scheduler-group-header {\r\n    padding: 0 5px 0 10px;\r\n}\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='2'] .dx-scheduler-group-header:last-child,\r\n.dx-rtl .dx-scheduler-timeline.dx-scheduler-work-space-grouped[dx-group-column-count='3'] .dx-scheduler-group-header:last-child {\r\n    text-align: right;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day) .dx-scheduler-header-scrollable {\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day) .dx-scheduler-header-scrollable {\r\n    margin-right: 50px;\r\n}\r\n.dx-rtl .dx-scheduler-recurrence-rule-item .dx-field-item-label.dx-field-item-label-location-left,\r\n.dx-rtl .dx-scheduler-recurrence-rule-item .dx-field-item-label.dx-field-item-label-location-top {\r\n    padding-left: 10px;\r\n    padding-right: 20px;\r\n}\r\n.dx-rtl .dx-scheduler-recurrence-rule-item .dx-field-item-label.dx-field-item-label-location-right {\r\n    padding-left: 20px;\r\n}\r\n.dx-rtl .dx-scheduler-recurrence-rule-item.dx-label-v-align .dx-recurrence-editor {\r\n    padding-right: 20px;\r\n}\r\n.dx-rtl .dx-scheduler-recurrence-rule-item .dx-field-item-content-location-left .dx-recurrence-editor {\r\n    padding-right: 20px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda .dx-scheduler-scrollable-appointments {\r\n    padding-right: 100px;\r\n    padding-left: 0;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda .dx-scheduler-scrollable-appointments {\r\n    padding-right: 50px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda .dx-scheduler-group-table {\r\n    float: right;\r\n}\r\n.dx-rtl .dx-scheduler-agenda.dx-scheduler-work-space-grouped .dx-scheduler-date-table {\r\n    float: left;\r\n}\r\n.dx-rtl .dx-timezone-editor .dx-timezone-display-name {\r\n    float: right;\r\n}\r\n.dx-rtl .dx-timezone-editor .dx-timezone-iana-id {\r\n    float: left;\r\n}\r\n.dx-theme-generic-typography {\r\n    background-color: #fff;\r\n    color: #333;\r\n    font-weight: normal;\r\n    font-size: 12px;\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-theme-generic-typography input,\r\n.dx-theme-generic-typography textarea {\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-theme-generic-typography h1,\r\n.dx-theme-generic-typography .dx-font-xl {\r\n    font-weight: 200;\r\n    font-size: 29px;\r\n}\r\n.dx-theme-generic-typography h2,\r\n.dx-theme-generic-typography .dx-font-l {\r\n    font-weight: normal;\r\n    font-size: 24px;\r\n}\r\n.dx-theme-generic-typography h3 {\r\n    font-weight: normal;\r\n    font-size: 20px;\r\n}\r\n.dx-theme-generic-typography .dx-font-m {\r\n    font-weight: normal;\r\n    font-size: 18px;\r\n}\r\n.dx-theme-generic-typography h4,\r\n.dx-theme-generic-typography .dx-font-s {\r\n    font-weight: 500;\r\n    font-size: 16px;\r\n}\r\n.dx-theme-generic-typography h5 {\r\n    font-weight: 700;\r\n    font-size: 14px;\r\n}\r\n.dx-theme-generic-typography h6,\r\n.dx-theme-generic-typography small,\r\n.dx-theme-generic-typography .dx-font-xs {\r\n    font-weight: 800;\r\n    font-size: 10px;\r\n}\r\n.dx-theme-generic-typography a {\r\n    color: #337ab7;\r\n}\r\n.dx-theme-marker {\r\n    font-family: 'dx.generic.light.compact';\r\n}\r\n@font-face {\r\n    font-family: 'DXIcons';\r\n    src: url(" + __webpack_require__(861) + ") format('woff'), url(" + __webpack_require__(860) + ") format('truetype');\r\n    font-weight: normal;\r\n    font-style: normal;\r\n}\r\n.dx-icon {\r\n    display: inline-block;\r\n    font-size: inherit;\r\n    text-rendering: auto;\r\n    -webkit-font-smoothing: antialiased;\r\n    -moz-osx-font-smoothing: grayscale;\r\n    transform: translate(0, 0);\r\n}\r\n.dx-icon-add {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-add:before {\r\n    content: '\\F00B';\r\n}\r\n.dx-icon-airplane {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-airplane:before {\r\n    content: '\\F000';\r\n}\r\n.dx-icon-bookmark {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-bookmark:before {\r\n    content: '\\F017';\r\n}\r\n.dx-icon-box {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-box:before {\r\n    content: '\\F018';\r\n}\r\n.dx-icon-car {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-car:before {\r\n    content: '\\F01B';\r\n}\r\n.dx-icon-card {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-card:before {\r\n    content: '\\F019';\r\n}\r\n.dx-icon-cart {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-cart:before {\r\n    content: '\\F01A';\r\n}\r\n.dx-icon-chart {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chart:before {\r\n    content: '\\F01C';\r\n}\r\n.dx-icon-check {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-check:before {\r\n    content: '\\F005';\r\n}\r\n.dx-icon-clear {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-clear:before {\r\n    content: '\\F008';\r\n}\r\n.dx-icon-clock {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-clock:before {\r\n    content: '\\F01D';\r\n}\r\n.dx-icon-close {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-close:before {\r\n    content: '\\F00A';\r\n}\r\n.dx-icon-coffee {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-coffee:before {\r\n    content: '\\F02A';\r\n}\r\n.dx-icon-comment {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-comment:before {\r\n    content: '\\F01E';\r\n}\r\n.dx-icon-doc {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-doc:before {\r\n    content: '\\F021';\r\n}\r\n.dx-icon-download {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-download:before {\r\n    content: '\\F022';\r\n}\r\n.dx-icon-dragvertical {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-dragvertical:before {\r\n    content: '\\F038';\r\n}\r\n.dx-icon-edit {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-edit:before {\r\n    content: '\\F023';\r\n}\r\n.dx-icon-email {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-email:before {\r\n    content: '\\F024';\r\n}\r\n.dx-icon-event {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-event:before {\r\n    content: '\\F026';\r\n}\r\n.dx-icon-favorites {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-favorites:before {\r\n    content: '\\F025';\r\n}\r\n.dx-icon-find {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-find:before {\r\n    content: '\\F027';\r\n}\r\n.dx-icon-filter {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-filter:before {\r\n    content: '\\F050';\r\n}\r\n.dx-icon-folder {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-folder:before {\r\n    content: '\\F028';\r\n}\r\n.dx-icon-food {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-food:before {\r\n    content: '\\F029';\r\n}\r\n.dx-icon-gift {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-gift:before {\r\n    content: '\\F02B';\r\n}\r\n.dx-icon-globe {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-globe:before {\r\n    content: '\\F02C';\r\n}\r\n.dx-icon-group {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-group:before {\r\n    content: '\\F02E';\r\n}\r\n.dx-icon-help {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-help:before {\r\n    content: '\\F02F';\r\n}\r\n.dx-icon-home {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-home:before {\r\n    content: '\\F030';\r\n}\r\n.dx-icon-image {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-image:before {\r\n    content: '\\F031';\r\n}\r\n.dx-icon-info {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-info:before {\r\n    content: '\\F032';\r\n}\r\n.dx-icon-key {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-key:before {\r\n    content: '\\F033';\r\n}\r\n.dx-icon-like {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-like:before {\r\n    content: '\\F034';\r\n}\r\n.dx-icon-map {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-map:before {\r\n    content: '\\F035';\r\n}\r\n.dx-icon-menu {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-menu:before {\r\n    content: '\\F00C';\r\n}\r\n.dx-icon-message {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-message:before {\r\n    content: '\\F024';\r\n}\r\n.dx-icon-money {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-money:before {\r\n    content: '\\F036';\r\n}\r\n.dx-icon-music {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-music:before {\r\n    content: '\\F037';\r\n}\r\n.dx-icon-overflow {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-overflow:before {\r\n    content: '\\F00D';\r\n}\r\n.dx-icon-percent {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-percent:before {\r\n    content: '\\F039';\r\n}\r\n.dx-icon-photo {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-photo:before {\r\n    content: '\\F03A';\r\n}\r\n.dx-icon-plus {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-plus:before {\r\n    content: '\\F00B';\r\n}\r\n.dx-icon-preferences {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-preferences:before {\r\n    content: '\\F03B';\r\n}\r\n.dx-icon-product {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-product:before {\r\n    content: '\\F03C';\r\n}\r\n.dx-icon-pulldown {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-pulldown:before {\r\n    content: '\\F062';\r\n}\r\n.dx-icon-refresh {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-refresh:before {\r\n    content: '\\F03D';\r\n}\r\n.dx-icon-remove {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-remove:before {\r\n    content: '\\F00A';\r\n}\r\n.dx-icon-revert {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-revert:before {\r\n    content: '\\F04C';\r\n}\r\n.dx-icon-runner {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-runner:before {\r\n    content: '\\F040';\r\n}\r\n.dx-icon-save {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-save:before {\r\n    content: '\\F041';\r\n}\r\n.dx-icon-search {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-search:before {\r\n    content: '\\F027';\r\n}\r\n.dx-icon-tags {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-tags:before {\r\n    content: '\\F009';\r\n}\r\n.dx-icon-tel {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-tel:before {\r\n    content: '\\F003';\r\n}\r\n.dx-icon-tips {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-tips:before {\r\n    content: '\\F004';\r\n}\r\n.dx-icon-todo {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-todo:before {\r\n    content: '\\F005';\r\n}\r\n.dx-icon-toolbox {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-toolbox:before {\r\n    content: '\\F007';\r\n}\r\n.dx-icon-trash {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-trash:before {\r\n    content: '\\F03E';\r\n}\r\n.dx-icon-user {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-user:before {\r\n    content: '\\F02D';\r\n}\r\n.dx-icon-upload {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-upload:before {\r\n    content: '\\F006';\r\n}\r\n.dx-icon-floppy {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-floppy:before {\r\n    content: '\\F073';\r\n}\r\n.dx-icon-arrowleft {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-arrowleft:before {\r\n    content: '\\F011';\r\n}\r\n.dx-icon-arrowdown {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-arrowdown:before {\r\n    content: '\\F015';\r\n}\r\n.dx-icon-arrowright {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-arrowright:before {\r\n    content: '\\F00E';\r\n}\r\n.dx-icon-arrowup {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-arrowup:before {\r\n    content: '\\F013';\r\n}\r\n.dx-icon-spinleft {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-spinleft:before {\r\n    content: '\\F04F';\r\n}\r\n.dx-icon-spinright {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-spinright:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-icon-spinnext {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-spinnext:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-rtl .dx-icon-spinnext:before {\r\n    content: '\\F04F';\r\n}\r\n.dx-icon-spinprev {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-spinprev:before {\r\n    content: '\\F04F';\r\n}\r\n.dx-rtl .dx-icon-spinprev:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-icon-spindown {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-spindown:before {\r\n    content: '\\F001';\r\n}\r\n.dx-icon-spinup {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-spinup:before {\r\n    content: '\\F002';\r\n}\r\n.dx-icon-chevronleft {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chevronleft:before {\r\n    content: '\\F012';\r\n}\r\n.dx-icon-chevronright {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chevronright:before {\r\n    content: '\\F010';\r\n}\r\n.dx-icon-chevronnext {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chevronnext:before {\r\n    content: '\\F010';\r\n}\r\n.dx-rtl .dx-icon-chevronnext:before {\r\n    content: '\\F012';\r\n}\r\n.dx-icon-chevronprev {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chevronprev:before {\r\n    content: '\\F012';\r\n}\r\n.dx-rtl .dx-icon-chevronprev:before {\r\n    content: '\\F010';\r\n}\r\n.dx-icon-chevrondown {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chevrondown:before {\r\n    content: '\\F016';\r\n}\r\n.dx-icon-chevronup {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chevronup:before {\r\n    content: '\\F014';\r\n}\r\n.dx-icon-chevrondoubleleft {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chevrondoubleleft:before {\r\n    content: '\\F042';\r\n}\r\n.dx-icon-chevrondoubleright {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-chevrondoubleright:before {\r\n    content: '\\F043';\r\n}\r\n.dx-icon-equal {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-equal:before {\r\n    content: '\\F044';\r\n}\r\n.dx-icon-notequal {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-notequal:before {\r\n    content: '\\F045';\r\n}\r\n.dx-icon-less {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-less:before {\r\n    content: '\\F046';\r\n}\r\n.dx-icon-greater {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-greater:before {\r\n    content: '\\F047';\r\n}\r\n.dx-icon-lessorequal {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-lessorequal:before {\r\n    content: '\\F048';\r\n}\r\n.dx-icon-greaterorequal {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-greaterorequal:before {\r\n    content: '\\F049';\r\n}\r\n.dx-icon-sortup {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-sortup:before {\r\n    content: '\\F051';\r\n}\r\n.dx-icon-sortdown {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-sortdown:before {\r\n    content: '\\F052';\r\n}\r\n.dx-icon-sortuptext {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-sortuptext:before {\r\n    content: '\\F053';\r\n}\r\n.dx-icon-sortdowntext {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-sortdowntext:before {\r\n    content: '\\F054';\r\n}\r\n.dx-icon-sorted {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-sorted:before {\r\n    content: '\\F055';\r\n}\r\n.dx-icon-expand {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-expand:before {\r\n    content: '\\F04A';\r\n}\r\n.dx-icon-collapse {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-collapse:before {\r\n    content: '\\F04B';\r\n}\r\n.dx-icon-columnfield {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-columnfield:before {\r\n    content: '\\F057';\r\n}\r\n.dx-icon-rowfield {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-rowfield:before {\r\n    content: '\\F058';\r\n}\r\n.dx-icon-datafield {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-datafield:before {\r\n    content: '\\F056';\r\n}\r\n.dx-icon-fields {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-fields:before {\r\n    content: '\\F059';\r\n}\r\n.dx-icon-fieldchooser {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-fieldchooser:before {\r\n    content: '\\F05A';\r\n}\r\n.dx-icon-columnchooser {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-columnchooser:before {\r\n    content: '\\F04D';\r\n}\r\n.dx-icon-pin {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-pin:before {\r\n    content: '\\F05B';\r\n}\r\n.dx-icon-unpin {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-unpin:before {\r\n    content: '\\F05C';\r\n}\r\n.dx-icon-pinleft {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-pinleft:before {\r\n    content: '\\F05D';\r\n}\r\n.dx-icon-pinright {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-pinright:before {\r\n    content: '\\F05E';\r\n}\r\n.dx-icon-contains {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-contains:before {\r\n    content: '\\F063';\r\n}\r\n.dx-icon-startswith {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-startswith:before {\r\n    content: '\\F064';\r\n}\r\n.dx-icon-endswith {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-endswith:before {\r\n    content: '\\F065';\r\n}\r\n.dx-icon-doesnotcontain {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-doesnotcontain:before {\r\n    content: '\\F066';\r\n}\r\n.dx-icon-range {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-range:before {\r\n    content: '\\F06A';\r\n}\r\n.dx-icon-export {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-export:before {\r\n    content: '\\F05F';\r\n}\r\n.dx-icon-exportxlsx {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-exportxlsx:before {\r\n    content: '\\F060';\r\n}\r\n.dx-icon-exportpdf {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-exportpdf:before {\r\n    content: '\\F061';\r\n}\r\n.dx-icon-exportselected {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-exportselected:before {\r\n    content: '\\F06D';\r\n}\r\n.dx-icon-warning {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-warning:before {\r\n    content: '\\F06B';\r\n}\r\n.dx-icon-more {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-more:before {\r\n    content: '\\F06C';\r\n}\r\n.dx-icon-square {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-square:before {\r\n    content: '\\F067';\r\n}\r\n.dx-icon-clearsquare {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-clearsquare:before {\r\n    content: '\\F068';\r\n}\r\n.dx-icon-back {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-back:before {\r\n    content: '\\F012';\r\n}\r\n.dx-rtl .dx-icon-back:before {\r\n    content: '\\F010';\r\n}\r\n.dx-icon-repeat {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-repeat:before {\r\n    content: '\\F069';\r\n}\r\n.dx-icon-selectall {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-selectall:before {\r\n    content: '\\F070';\r\n}\r\n.dx-icon-unselectall {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-unselectall:before {\r\n    content: '\\F071';\r\n}\r\n.dx-icon-print {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-icon-print:before {\r\n    content: '\\F072';\r\n}\r\n.dx-tab .dx-icon,\r\n.dx-tab.dx-tab-selected .dx-icon {\r\n    -webkit-background-size: 100% 100%;\r\n    -moz-background-size: 100% 100%;\r\n    background-size: 100% 100%;\r\n    background-position: 50% 50%;\r\n}\r\n.dx-scrollview-pulldown {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAQAAABebbrxAAABD0lEQVRo3u2XvQ3CMBCFLbmjYYGsAA2wA1X2gAbEAEwB2eIKflagh6zACJAuUihASUic+M5GNH56dT7J8efTPUXKkDkzrS8LpQAEMBygcwAss2UGQADDBmLa+AMvzAAIYNhATBt/YMEMgACGDcS0wbQBEEAAAQQQwD8CEzaiL7sKqOnojTuQrh95SKkX7kqD5j+M6O6Mu1NkupQJZU64B426bjmmXIzLKe7TZiUGLmweyhTa28XWdJKpYn8pXIVub1U4T4+jUKkKbyWeWhR6Vqpwd+w+hb5U4S/ta54qkhZgVihxrxWaznZVZD2lqVDaVkVafOoKGVWRN6nZR6GMxr+qZjHl3aq4db0NLXld7wVjuu7NS9f7yAAAAABJRU5ErkJggg==);\r\n    background-position: 0 0;\r\n    background-repeat: no-repeat;\r\n}\r\n.dx-loadindicator-image {\r\n    background-image: url(data:image/gif;base64,R0lGODlhIAAgAIABADI6Rf///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQABACwAAAAAIAAgAAACQIyPqcutAJyUMM6bKt5B8+t9FCROYcmQqKOuS+tmVvzM9AHf+s6L+X0C/mjDWFDY6xRdR+Jy1TQ+oVNUxZbkFAAAIfkECQkAAQAsAAAAACAAIAAAAj+Mj6nL7Q+jnGDaUK8EWT/ufV3IgGQznomprmlrcCwsv2cNH3iOyXw/a+1+PWKR6EPahMtbkNZ0GmPRqfUaKQAAIfkECQkAAQAsAAAAACAAIAAAAj+Mj6nL7Q+jnLTai3MGCHhtfKEIciN4fJ6JBhzZvmy8tmltu7i9zmif08F+Mp5puGH5krdYYskLSqfUqvVqKAAAIfkECQkAAQAsAAAAACAAIAAAAkOMj6nL7Q+jnBBYGi3AT3Pnfc0lMmGpkGi6rYnqBhvszm0sy3es7fXJm+EMF9+qZSzRgsPD8phEAX9RZVX0bGq3XEYBACH5BAkJAAEALAAAAAAgACAAAAI+jI+pywnQYntPWkThvXTv7llgGI3kpJ1oqi5Vi8KTPNOujef6nrO63+MFXjugjdgzykxHZFOpyvyYNKdQUQAAIfkECQkAAQAsAAAAACAAIAAAAjiMjwa76e+YhDTOitHNnPEfeGAmjlhjnkBKsq0Lx/JM1/aN5/rO91q+AgpxqFqJdoxtYJKkawkpAAAh+QQJCQABACwAAAAAIAAgAAACNoyPBsucD1WbLtoGl414+1R9ojKW5omm6sq27gvH8kzX9o3n+s73B0ADyjQn4aNjolBWSuKmAAAh+QQJCQABACwAAAAAIAAgAAACMoyPB8uQD1GbLdrAIL081g5KTkiW5omm6sq27gvH8kzX9o3n+s6/y5yRTS6jEmWzOoIKACH5BAkJAAEALAAAAAAgACAAAAI3jI8Ju+n/mGSwWjOvdnL7Q31eKGpkaZ0o1KzuC8fyTNf2jef6ztetrZoFZcNYEXZEJl0TQG9TAAAh+QQJCQABACwAAAAAIAAgAAACP4yPqcudAIGbLUqKkc08xJ59ICWOTmkyUHqurHq9iis/dH3c+M73PqvDBWtDYoxXlCVfyxRq9xQ2nVNT9NcpAAAh+QQJCQABACwAAAAAIAAgAAACPoyPqcvtD6OUAMwbKqZ2v9p5jSY6ZLmAKHOuSOseYBjPsazeWX7but/j6XZDA6xXNNJ+y1rTmTRGM9OqtVQAACH5BAkJAAEALAAAAAAgACAAAAJAjI+py+0Po5y02osbyG8jzwUAOIYHCYalmHLlahojHM+tOsdnrrO0aeuxRMJXL/fLwG4X3hCXYgqn1Kr1ihUWAAAh+QQJCQABACwAAAAAIAAgAAACQ4yPqcvtD6OcEQBaL35Wb9Z9jiU2ZAl6aHKuhqa6V+sGc7x2OKrXB7krAX2vGdEWFCaVR+TyQ6uFiFNf1RptarfcRAEAIfkECQkAAQAsAAAAACAAIAAAAj6Mj6nLCdBie09aROG9dO/uWWAoVWSpnVGqMmbrwqs80faN5/rB5j3+s718QdkIWIQdhUNmUrU0RpVT6s5SAAAh+QQJCQABACwAAAAAIAAgAAACOoyPBgvp/5iENLKK081crd59YDiSJdecWKq27gvH8kzX9o3n+snW/SyiBYHD2Ib4e01kkmSpWVQ1MwUAIfkECQkAAQAsAAAAACAAIAAAAjWMjwbLnA9Pmy7aFoG9envYfaI0luaJpurKtu4Lx/JM1/aN5/rO96RceWFMC1CwREmqkkVPAQAh+QQJCQABACwAAAAAIAAgAAACMoyPB8uQD1ObLNrg7Lxcrw5KWUiW5omm6sq27gvH8kzX9o3n+s67n9wAbh4VE+W4QnYKACH5BAkJAAEALAAAAAAgACAAAAI2jI+py30Ao5stAoqVzHxz7H1TKFZQSZ3oyrbuC8fyTNf2jeeyOpOw/wK6hC0LzXLpIY1BJqYAADs=);\r\n    background-position: center center;\r\n    background-repeat: no-repeat;\r\n}\r\n.dx-loadindicator-image-small {\r\n    background-image: url(data:image/gif;base64,R0lGODlhFAAUAKECADI6RTI6Rv///////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQABACwAAAAAFAAUAAACI4yPqZsADM+LcNJlb9Mq8+B8iCeWBqmFJnqpJUu5ojzDplIAACH5BAkJAAEALAAAAAAUABQAAAIhjI+py+3gXmxwrmoRzgZ4fnxgIIIl523o2KmZ+7KdTIMFACH5BAkJAAIALAAAAAAUABQAAAIflI+py+0Po4zAgDptFhXP60ngNmYdyaGBiYXbC8dwAQAh+QQJCQADACwAAAAAFAAUAAACIpyPqcsL3cCDSlJ368xnc+Nx1geG2Uiin3mpIlnC7gnXTAEAIfkECQkAAwAsAAAAABQAFAAAAiKcD6e74AxRivHRenGGc6vuIWEzluaJbuC4eq36XlboxGUBACH5BAkJAAMALAAAAAAUABQAAAIjnA8Jx226nBxp2mpnzG7z5n3iSJbmiaaqFIrt93LYOMP1UQAAIfkECQkAAwAsAAAAABQAFAAAAh2cD6l53eyiA7Iii7PevPsPhuJIluZpUB6ELWxTAAAh+QQJCQADACwAAAAAFAAUAAACHZx/oMit/5p0a9oBrt68+w+G4kiW5rllYbRCLFIAACH5BAkJAAMALAAAAAAUABQAAAIenH+ggO24noRq2molzo3xD4biSJbmSXqpuYlR2ToFACH5BAkJAAMALAAAAAAUABQAAAIhnI+pi+AMzYsQ0HrXzI2n7Q1WSJbMSKIh6Kmty7GtKWUFACH5BAkJAAMALAAAAAAUABQAAAIinI+py+3gXmxwKlAtytpgrmHdIY5DOX6mt56t24Kd/NZMAQAh+QQJCQADACwAAAAAFAAUAAACIZyPqcvtD6OMwIA6w8Czcnl91DVZW3mKkIeqK+ai8kyXBQAh+QQJCQADACwAAAAAFAAUAAACI5yPqcsL3cCDSlJ368xn82F9RiiSn8l5pziqmXuhMUzR7F0AACH5BAkJAAMALAAAAAAUABQAAAIfnI+pB70/HFxyKmBp1rv7D4aMiIXld6KmmW6V+7pKAQAh+QQJCQADACwAAAAAFAAUAAACIZw/oMi9Dc2LEVBqL8y6+w+G4kiWJBein+pNK4sp8CY3BQAh+QQJCQADACwAAAAAFAAUAAACHZw/oIt96iICstqLs968+w+G4kh+VHdukLW06VEAACH5BAkJAAMALAAAAAAUABQAAAIbnI+pCu29InKygoqz3rz7D4biSJbZ9VHpoyIFACH5BAkJAAMALAAAAAAUABQAAAIfnI8AyM26nDxq2hGvy7r7D4biSJYg51WiGkKju8JOAQA7);\r\n    background-position: center center;\r\n    background-repeat: no-repeat;\r\n}\r\n.dx-loadindicator-image-large {\r\n    background-image: url(data:image/gif;base64,R0lGODlhQABAAKECADI6RTI6Rv///////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQABACwAAAAAQABAAAACkIyPqcvtD6OctEpgs1ag9w1m3heW0Eia6oJi63u08BygNGzfq6ybeV/6AUHCoaZotIySoSXz6HlunNIKsnqKYinUbaTrzabCjyuZoz07wGpW+w2Py+f0uv2VtrPl5ne/zVP3B5hHtxc3eBZoeAiXSLY49wjZSFipFsk36ZWJuMn5idXiwtjpN3qHqhd61wpTAAAh+QQJCQABACwAAAAAQABAAAACk4yPqcvtD6OctNqLs968+w+G4giUI2meYQmoK+t+bBt3c22nuHbvPOzL9IKWIbFiPEqSygiz6XhCG8Cps2qNYrNUkzQ7+1rDW66BrDMf0DT1Gu1GsONvMv0Mv8/1+zi77Zd3Vwc4KGYWNihXRnfIlaiIx+gGGVmp6AiWObY51ek5GZiGGUpZajpKGrnK2ur6CotQAAAh+QQJCQACACwAAAAAQABAAAACoJSPqcvtD6OctNqLs968+w+G4kiW5omm6sq27qsADyDDCd3QuI3ssc7r1W66YRBIRAYNSmZxeWgKntAoIGCVLpXUqnPY9VLDYlzRWJaR01NtFbh+n33e77kunOOz931b7zdHVyeIlqY2ePhnuIUUd+ToBunzaNNV+RKG6UKmgwUVJ8m5JtryWLoSIInK5rfA6BorO0tba3uLm6u7y9ubUAAAIfkECQkAAwAsAAAAAEAAQAAAAqKcj6nL7Q+jnLTai7PevPsPhhwAiCKJmh+aqh1buiMsb3BcY3eu0bzO+mV8wgqxSDkiI8olpOl0BKMSKHUxvWIRWW2CdOh6ueHW+GsQnwcp9bltXpfZcTmdDrbP3WN4Xt9Stxb4Z0eIY5gn+KZYKGfmyPgX2edIqbWYePmYuRbQOQhauRlKOoqoh2eKyScperWTmtZ6ippKyyiru8vb6/t7VQAAIfkECQkAAwAsAAAAAEAAQAAAAp2cj6nL7Q+jnNSBC6reCWMOTp4Xls1ImmqHZuvbuu/aznNt02MO77yK+uk+QpOvWEohQ8clR+ncQKOaKVVEvFazWoq1C+GCI9/x6WL2otMSMfv8bsviljn9dM/rc/Y9ou9nABg4uLcW+Feod4g44Ob3uBiZN3lXRlkZd2nJSJj5tqkZytYE+ZkW5DlqlmrYillKF6N6ylqLetuoK1EAACH5BAkJAAMALAAAAABAAEAAAAKLnI+pB+2+opw0vtuq3hR7wIXi54mmRj7nOqXsK33wHF/0nZT4Ptj87vvdgsIZsfgKqJC0JRPmfL4gUii1yrpiV5ntFOTNhsfksvmMTqvX7Lb7DY/L5/S6/Y7P6/d8BLjeBfg3F0hYKHcYp6WY+BYF9+i46HZEGcmGwViZRmKpg5YySRbaWObieXlSAAAh+QQJCQADACwAAAAAQABAAAACepyPqQnt30ZctFoLs3a3e7aF2UdW4vmUKnKa46pu8Exq9O29+E5B/N/jAIcHIZFoPA4nyqbzCY1Kp9Sq9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+f0uv2Oz+vXAH4fnVQWOJZi5kNmA3WIISOFgkL1KHIlucjV8lMAACH5BAkJAAMALAAAAABAAEAAAAJ3nI+pC+0Plpy0IohztLwbDWbeKIUmRqZiZabe4w5hTG30p926le9+CfkJGY2h8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y4fO8pBPUrcAwZyU6Q0w9G3dLJY+MS4UvVoowUpVAAAIfkECQkAAwAsAAAAAEAAQAAAAn2cj6nL7Q/jALRaK7NGt/sNat4YluJImWqEru5DvnISz/bU3Xqu23wv+wFdwqGqaCwhk5sl81R5rqLSqvWKzWq33K73Cw6Lx+Sy+YxOq9fstvsNj8vn9FBKjUlf8PmzU7yH9gc2+FXoddj1IZi4VVPWYoYCYBYwGUgYWWdSAAAh+QQJCQADACwAAAAAQABAAAACkpyPqcvtD6OctEKAs93c5N+F1AeKpkNq56qkAAsjaUwPc83e+KnvYu/rAIMbEtFkPAqTymKp6VRBK8Pp5WmdYLORLffB/ILD4ga5vDijW9K1GeOOy+f0uv2Oh73ytrbdS6c2BxjoV0cohxgnmGh46DgIGQmXx7io6GaZiYlWNUmJp7nmecnZKXoq+bnHZ9P6ylUAACH5BAkJAAMALAAAAABAAEAAAAKTnI+py+0Po5y02ouz3rz7D3YAEJbHOJomSqog675o/MG0ON8b2+oZ79PYghcgsTg8ToxKCrMpSUIh0qnjab3mso8qV8HbfhFh8XhQTp3J5TU77D614+h5PE2vw+l4vt3ddzdjlucFSOjXk2dguNboiHiotsgYCTlJ+XimOWZ5qbjI+SU6iplpGopKucra6voK+1oAACH5BAkJAAMALAAAAABAAEAAAAKenI+py+0Po5y02ouz3rz7D4biSJbmiabqyrYe4GbAHF8zvNxBndzMjeMdfD2gEEEs0o6GQNJgZA6fUemgWrVin1pitrv8So1i8JVrPQOX6ek62Fav4+45XV4ev+HtPT9NxhYX+AcGg6bng8gUlSe0VXgEOVjlFMnztRhj5wYoptnCiXQZuij4qHmKSXp15/oKGys7S1tre4ubq7urUQAAIfkECQkAAwAsAAAAAEAAQAAAAqKcj6nL7Q+jnLTai7PevPsPhhwAiCJJmiGaqh1buiMsb3BcZ3Sus7zm+2GCwguxSDkiJ6jAsqJ8QqJSB6raaB2uWIaW2h18teEEl1s2t9Dp7ZrcFr9xcXmMHffh23p6vV+HABho0OfHd7WXFnS4iNZYRgTnSAbZBYaomKeZOfmHGQkayjnquUkatkNoh4p1s8pqSilbSpsqGgqru8vb6/srVAAAIfkECQkAAwAsAAAAAEAAQAAAApqcj6nL7Q+jnNSBC6reCmcOUt4Vls+ImWqHrq6Bfu/azm5tq3huevzt+/WCwhKxCDoiOallSOkUNaMbKFUyvUpJ2kq2i+WCJ+Jx2CxFk9VrdkTmtsTndBu8nijjD/r9oI/3tScYCEhndWg4h7hImKjoxhgnyUapNuIH4zhpaYbpt/O4eflZFzMYGnkq2qkVAwn2ito6Rpt5K1EAACH5BAkJAAMALAAAAABAAEAAAAKLnI+pCe2wopxUvgur3hR7DoaDh4lmRWbnOqXsa5XwrMj0bVz4Pj487vvdgsIZsQhzIGnKpVHlZDWjUijV1Li+stqVtQsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7Hf91ceR8+9XbE90dYyDaI6BAAmKimI+iYBtn2UUm5RvLoYpYiqeWJKRYaSBaaqflSAAAh+QQJCQADACwAAAAAQABAAAACeZyPqQrtD5actCaIc7S8Gw1i3iiFpkOmB2hBKpm9sufOdove+pTv/tX4CVeb4bBoTCqXzKbzCY1Kp9Sq9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+f0ut0cLPfEe/CDXOMX6BVDWLh0yBDidNL41GgiBZkoGXGyUwAAIfkECQkAAwAsAAAAAEAAQAAAAnecj6lr4A+YnLQ2iLPdHOUPduICluY4YtuJrlE7lPDsavQ9ffjOqPzvcQCHxKLxiEwql8ym8wmNSqfUqvWKzWq33K73Cw6Lx+Sy+YxOq9fstvsNj8vn9LriEbZ1Q3s+7fXDkoJXZAIooXNkuAjBxGj49OhDBclTAAAh+QQJCQADACwAAAAAQABAAAACfpyPqcvtD+MBtFqJ87K8Bw2GRneJJkZS5xql7NuQ8KzI9D10+K3vc+97AYMrDhE2PIqMymKpaXpCl4Cp9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+d0dEXNPCfHe37e3CcWGDYIVvhlA5hI5qLXyJiiAhkp1UX5yHV5VydSAAA7);\r\n    background-position: center center;\r\n    background-repeat: no-repeat;\r\n}\r\n.dx-widget {\r\n    color: #333;\r\n    font-weight: normal;\r\n    font-size: 12px;\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-widget input,\r\n.dx-widget textarea {\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-state-disabled.dx-widget,\r\n.dx-state-disabled .dx-widget {\r\n    opacity: 0.5;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    -o-user-select: none;\r\n    user-select: none;\r\n    -webkit-touch-callout: none;\r\n    zoom: 1;\r\n    cursor: default;\r\n}\r\n.dx-state-disabled.dx-widget .dx-widget,\r\n.dx-state-disabled .dx-widget .dx-widget {\r\n    opacity: 1;\r\n}\r\n.dx-badge {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n    font-size: 11px;\r\n    padding: 0 5px 2px;\r\n    line-height: normal;\r\n}\r\n.dx-box-item-content {\r\n    font-size: 12px;\r\n}\r\n.dx-button-content {\r\n    line-height: 0;\r\n}\r\n.dx-button-text {\r\n    display: inline-block;\r\n    line-height: normal;\r\n}\r\n.dx-button a {\r\n    text-decoration: none;\r\n}\r\n.dx-button .dx-button-content {\r\n    padding: 5px;\r\n}\r\n.dx-button .dx-icon {\r\n    color: #333;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-button .dx-icon,\r\n.dx-rtl.dx-button .dx-icon {\r\n    margin-left: 0;\r\n    margin-right: 0;\r\n}\r\n.dx-button-has-icon .dx-button-content {\r\n    padding: 5px;\r\n}\r\n.dx-button-has-icon .dx-icon {\r\n    color: #333;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-button-has-icon .dx-icon,\r\n.dx-rtl.dx-button-has-icon .dx-icon {\r\n    margin-left: 0;\r\n    margin-right: 0;\r\n}\r\n.dx-button-has-text .dx-button-content {\r\n    padding: 4px 10px 4px;\r\n}\r\n.dx-button-has-text .dx-icon {\r\n    color: #333;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 7px;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-button-has-text .dx-icon,\r\n.dx-rtl.dx-button-has-text .dx-icon {\r\n    margin-left: 7px;\r\n    margin-right: 0;\r\n}\r\n.dx-button-back .dx-button-content {\r\n    padding: 5px;\r\n}\r\n.dx-button-back .dx-icon {\r\n    color: #333;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-button-back .dx-icon,\r\n.dx-rtl.dx-button-back .dx-icon {\r\n    margin-left: 0;\r\n    margin-right: 0;\r\n}\r\n.dx-button-back .dx-button-text {\r\n    display: none;\r\n}\r\n.dx-button {\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n    -webkit-box-shadow: 0 1px 2px transparent;\r\n    -moz-box-shadow: 0 1px 2px transparent;\r\n    box-shadow: 0 1px 2px transparent;\r\n    border-width: 1px;\r\n    border-style: solid;\r\n    background-color: #fff;\r\n    border-color: #ddd;\r\n    color: #333;\r\n}\r\n.dx-button.dx-state-hover {\r\n    -webkit-box-shadow: 0 1px 2px transparent;\r\n    -moz-box-shadow: 0 1px 2px transparent;\r\n    box-shadow: 0 1px 2px transparent;\r\n}\r\n.dx-button.dx-state-focused {\r\n    -webkit-box-shadow: 0 1px 2px transparent;\r\n    -moz-box-shadow: 0 1px 2px transparent;\r\n    box-shadow: 0 1px 2px transparent;\r\n}\r\n.dx-button.dx-state-active {\r\n    -webkit-box-shadow: 0 1px 2px transparent;\r\n    -moz-box-shadow: 0 1px 2px transparent;\r\n    box-shadow: 0 1px 2px transparent;\r\n}\r\n.dx-state-disabled.dx-button .dx-icon,\r\n.dx-state-disabled .dx-button .dx-icon {\r\n    opacity: 0.6;\r\n}\r\n.dx-state-disabled.dx-button .dx-button-text,\r\n.dx-state-disabled .dx-button .dx-button-text {\r\n    opacity: 0.5;\r\n}\r\n.dx-button .dx-icon {\r\n    color: #333;\r\n}\r\n.dx-button.dx-state-hover {\r\n    background-color: #e6e6e6;\r\n    border-color: #bebebe;\r\n}\r\n.dx-button.dx-state-focused {\r\n    background-color: #e6e6e6;\r\n    border-color: #9d9d9d;\r\n}\r\n.dx-button.dx-state-active {\r\n    background-color: #d4d4d4;\r\n    border-color: #9d9d9d;\r\n    color: #333;\r\n}\r\n.dx-button-danger {\r\n    background-color: #d9534f;\r\n    border-color: #d43f3a;\r\n    color: #fff;\r\n}\r\n.dx-button-danger .dx-icon {\r\n    color: #fff;\r\n}\r\n.dx-button-danger.dx-state-hover {\r\n    background-color: #c9302c;\r\n    border-color: #ac2925;\r\n}\r\n.dx-button-danger.dx-state-focused {\r\n    background-color: #c9302c;\r\n    border-color: #761c19;\r\n}\r\n.dx-button-danger.dx-state-active {\r\n    background-color: #8b211e;\r\n    border-color: #761c19;\r\n    color: #fff;\r\n}\r\n.dx-button-success {\r\n    background-color: #5cb85c;\r\n    border-color: #4cae4c;\r\n    color: #fff;\r\n}\r\n.dx-button-success .dx-icon {\r\n    color: #fff;\r\n}\r\n.dx-button-success.dx-state-hover {\r\n    background-color: #449d44;\r\n    border-color: #398439;\r\n}\r\n.dx-button-success.dx-state-focused {\r\n    background-color: #449d44;\r\n    border-color: #255625;\r\n}\r\n.dx-button-success.dx-state-active {\r\n    background-color: #398439;\r\n    border-color: #255625;\r\n    color: #fff;\r\n}\r\n.dx-button-default {\r\n    background-color: #337ab7;\r\n    border-color: #2d6da3;\r\n    color: #fff;\r\n}\r\n.dx-button-default .dx-icon {\r\n    color: #fff;\r\n}\r\n.dx-button-default.dx-state-hover {\r\n    background-color: #285f8f;\r\n    border-color: #265a87;\r\n}\r\n.dx-button-default.dx-state-focused {\r\n    background-color: #285f8f;\r\n    border-color: #173853;\r\n}\r\n.dx-button-default.dx-state-active {\r\n    background-color: #204d73;\r\n    border-color: #173853;\r\n    color: #fff;\r\n}\r\n.dx-scrollable-content {\r\n    -webkit-transform: none;\r\n}\r\n.dx-scrollable-scroll {\r\n    padding: 2px;\r\n    background-color: transparent;\r\n    opacity: 1;\r\n    overflow: hidden;\r\n    -webkit-transition: opacity 0s linear;\r\n    -moz-transition: opacity 0s linear;\r\n    -o-transition: opacity 0s linear;\r\n    transition: opacity 0s linear;\r\n}\r\n.dx-scrollable-scroll.dx-state-invisible {\r\n    opacity: 0;\r\n    -webkit-transition: opacity .5s linear 1s;\r\n    -moz-transition: opacity .5s linear 1s;\r\n    -o-transition: opacity .5s linear 1s;\r\n    transition: opacity .5s linear 1s;\r\n}\r\n.dx-scrollable-scroll-content {\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(191, 191, 191, 0.7);\r\n    box-shadow: 0 0 0 1px transparent;\r\n}\r\n.dx-scrollbar-hoverable {\r\n    background-color: transparent;\r\n}\r\n.dx-scrollbar-hoverable.dx-state-hover,\r\n.dx-scrollbar-hoverable.dx-scrollable-scrollbar-active {\r\n    background-color: rgba(191, 191, 191, 0.2);\r\n}\r\n.dx-scrollbar-hoverable.dx-scrollable-scrollbar-active .dx-scrollable-scroll-content {\r\n    background-color: #bfbfbf;\r\n}\r\n.dx-scrollbar-hoverable .dx-scrollable-scroll.dx-state-invisible {\r\n    opacity: 1;\r\n}\r\n.dx-scrollbar-hoverable .dx-scrollable-scroll.dx-state-invisible .dx-scrollable-scroll-content {\r\n    background-color: transparent;\r\n    background-color: rgba(0, 0, 0, 0);\r\n    box-shadow: 0 0 0 1px transparent;\r\n}\r\n.dx-scrollbar-vertical .dx-scrollable-scroll {\r\n    float: right;\r\n    width: 8px;\r\n}\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable {\r\n    width: 8px;\r\n    -webkit-transition: width .2s linear .15s, background-color .2s linear .15s;\r\n    -moz-transition: width .2s linear .15s, background-color .2s linear .15s;\r\n    -o-transition: width .2s linear .15s, background-color .2s linear .15s;\r\n    transition: width .2s linear .15s, background-color .2s linear .15s;\r\n}\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable .dx-scrollable-scroll {\r\n    -webkit-transition: background-color .5s linear 1s, width .2s linear 150ms;\r\n    -moz-transition: background-color .5s linear 1s, width .2s linear 150ms;\r\n    -o-transition: background-color .5s linear 1s, width .2s linear 150ms;\r\n    transition: background-color .5s linear 1s, width .2s linear 150ms;\r\n}\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable .dx-scrollable-scroll .dx-scrollable-scroll-content {\r\n    -webkit-transition: box-shadow .15s linear .15s, background-color .15s linear .15s;\r\n    -moz-transition: box-shadow .15s linear .15s, background-color .15s linear .15s;\r\n    -o-transition: box-shadow .15s linear .15s, background-color .15s linear .15s;\r\n    transition: box-shadow .15s linear .15s, background-color .15s linear .15s;\r\n}\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable .dx-scrollable-scroll.dx-state-invisible {\r\n    -webkit-transition: background-color .5s linear 1s, width .2s linear .15s;\r\n    -moz-transition: background-color .5s linear 1s, width .2s linear .15s;\r\n    -o-transition: background-color .5s linear 1s, width .2s linear .15s;\r\n    transition: background-color .5s linear 1s, width .2s linear .15s;\r\n}\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable .dx-scrollable-scroll.dx-state-invisible .dx-scrollable-scroll-content {\r\n    -webkit-transition: box-shadow .5s linear 1s, background-color .5s linear 1s;\r\n    -moz-transition: box-shadow .5s linear 1s, background-color .5s linear 1s;\r\n    -o-transition: box-shadow .5s linear 1s, background-color .5s linear 1s;\r\n    transition: box-shadow .5s linear 1s, background-color .5s linear 1s;\r\n}\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable.dx-state-hover,\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable.dx-scrollable-scrollbar-active {\r\n    width: 15px;\r\n}\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable.dx-state-hover .dx-scrollable-scroll,\r\n.dx-scrollbar-vertical.dx-scrollbar-hoverable.dx-scrollable-scrollbar-active .dx-scrollable-scroll {\r\n    width: 15px;\r\n}\r\n.dx-scrollbar-horizontal .dx-scrollable-scroll {\r\n    height: 8px;\r\n}\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable {\r\n    height: 8px;\r\n    -webkit-transition: height .2s linear .15s, background-color .2s linear .15s;\r\n    -moz-transition: height .2s linear .15s, background-color .2s linear .15s;\r\n    -o-transition: height .2s linear .15s, background-color .2s linear .15s;\r\n    transition: height .2s linear .15s, background-color .2s linear .15s;\r\n}\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable .dx-scrollable-scroll {\r\n    -webkit-transition: background-color .5s linear 1s, height .2s linear .15s;\r\n    -moz-transition: background-color .5s linear 1s, height .2s linear .15s;\r\n    -o-transition: background-color .5s linear 1s, height .2s linear .15s;\r\n    transition: background-color .5s linear 1s, height .2s linear .15s;\r\n}\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable .dx-scrollable-scroll .dx-scrollable-scroll-content {\r\n    -webkit-transition: box-shadow .15s linear .15s, background-color .15s linear .15s;\r\n    -moz-transition: box-shadow .15s linear .15s, background-color .15s linear .15s;\r\n    -o-transition: box-shadow .15s linear .15s, background-color .15s linear .15s;\r\n    transition: box-shadow .15s linear .15s, background-color .15s linear .15s;\r\n}\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable .dx-scrollable-scroll.dx-state-invisible {\r\n    -webkit-transition: background-color .5s linear 1s, height .2s linear .15s;\r\n    -moz-transition: background-color .5s linear 1s, height .2s linear .15s;\r\n    -o-transition: background-color .5s linear 1s, height .2s linear .15s;\r\n    transition: background-color .5s linear 1s, height .2s linear .15s;\r\n}\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable .dx-scrollable-scroll.dx-state-invisible .dx-scrollable-scroll-content {\r\n    -webkit-transition: box-shadow .5s linear 1s, background-color .5s linear 1s;\r\n    -moz-transition: box-shadow .5s linear 1s, background-color .5s linear 1s;\r\n    -o-transition: box-shadow .5s linear 1s, background-color .5s linear 1s;\r\n    transition: box-shadow .5s linear 1s, background-color .5s linear 1s;\r\n}\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable.dx-state-hover,\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable.dx-scrollable-scrollbar-active {\r\n    height: 15px;\r\n}\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable.dx-state-hover .dx-scrollable-scroll,\r\n.dx-scrollbar-horizontal.dx-scrollbar-hoverable.dx-scrollable-scrollbar-active .dx-scrollable-scroll {\r\n    height: 15px;\r\n}\r\n.dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-vertical .dx-scrollable-content,\r\n.dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-both .dx-scrollable-content {\r\n    padding-right: 8px;\r\n}\r\n.dx-rtl.dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-vertical .dx-scrollable-content,\r\n.dx-rtl.dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-both .dx-scrollable-content,\r\n.dx-rtl .dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-vertical .dx-scrollable-content,\r\n.dx-rtl .dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-both .dx-scrollable-content {\r\n    padding-right: 0;\r\n    padding-left: 8px;\r\n}\r\n.dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-horizontal .dx-scrollable-content,\r\n.dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-both .dx-scrollable-content {\r\n    padding-bottom: 8px;\r\n}\r\n.dx-scrollable-customizable-scrollbars {\r\n    -ms-scrollbar-base-color: #fff;\r\n    -ms-scrollbar-arrow-color: #4b4b4b;\r\n    -ms-scrollbar-track-color: #fff;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar:horizontal {\r\n    height: 19px;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar:vertical {\r\n    width: 19px;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar {\r\n    background-color: transparent;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar-thumb {\r\n    background-color: #757575;\r\n    border-right: 2px solid transparent;\r\n    border-left: 1px solid transparent;\r\n    background-clip: content-box;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar-track {\r\n    background-color: transparent;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar-corner {\r\n    background-color: transparent;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar-button {\r\n    background-color: transparent;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar-button:horizontal:decrement {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAMCAQAAADrXgSlAAAAMklEQVQY02P4z/CfIRECfRngHN/E/zAOkJmIzExEZoI4cCYGB0UZmgHIRkPt8kXigLgA3gNGp/JuZjQAAAAASUVORK5CYII=) no-repeat;\r\n    background-position: center;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar-button:horizontal:increment {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAMCAQAAADrXgSlAAAAN0lEQVQYV2NI9E1kAMH/QMiQ+B/ChXHAXAQHyoVxwFwEB8jFwUFSBjYebjSM4wuyA2IPnPmfAQA1rkanVpjRrQAAAABJRU5ErkJggg==) no-repeat;\r\n    background-position: center;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar-button:vertical:decrement {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAQAAABd57cKAAAAM0lEQVQYV2P4z/CfIRECfYGQAcQHQTABFf4PhHApmAREGCoFghAJhDBcClMYKoVNGCwFAKZMRqcg5DihAAAAAElFTkSuQmCC) no-repeat;\r\n    background-position: 3px 5px;\r\n}\r\n.dx-scrollable-customizable-scrollbars::-webkit-scrollbar-button:vertical:increment {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAQAAABd57cKAAAAMUlEQVQY023JwQ0AMAyDQBZkCO8/hPuqGqkRP46YLklZyEB/MlyYZJhwyVBKBxDfLgftpkant8t4aAAAAABJRU5ErkJggg==) no-repeat;\r\n    background-position: 3px 5px;\r\n}\r\n.dx-rtl .dx-scrollable .dx-scrollable-scroll,\r\n.dx-rtl.dx-scrollable .dx-scrollable-scroll {\r\n    float: left;\r\n}\r\n.dx-scrollview-pull-down-image {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAQAAABebbrxAAABD0lEQVRo3u2XvQ3CMBCFLbmjYYGsAA2wA1X2gAbEAEwB2eIKflagh6zACJAuUihASUic+M5GNH56dT7J8efTPUXKkDkzrS8LpQAEMBygcwAss2UGQADDBmLa+AMvzAAIYNhATBt/YMEMgACGDcS0wbQBEEAAAQQQwD8CEzaiL7sKqOnojTuQrh95SKkX7kqD5j+M6O6Mu1NkupQJZU64B426bjmmXIzLKe7TZiUGLmweyhTa28XWdJKpYn8pXIVub1U4T4+jUKkKbyWeWhR6Vqpwd+w+hb5U4S/ta54qkhZgVihxrxWaznZVZD2lqVDaVkVafOoKGVWRN6nZR6GMxr+qZjHl3aq4db0NLXld7wVjuu7NS9f7yAAAAABJRU5ErkJggg==) 0 0 no-repeat;\r\n}\r\n.dx-scrollable-native.dx-scrollable-native-android .dx-scrollview-pull-down {\r\n    background-color: #fff;\r\n    -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);\r\n    -moz-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);\r\n    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);\r\n}\r\n.dx-scrollview-scrollbottom-loading .dx-scrollview-scrollbottom-image {\r\n    width: 24px;\r\n    height: 24px;\r\n}\r\n.dx-checkbox {\r\n    line-height: 0;\r\n}\r\n.dx-checkbox.dx-state-readonly .dx-checkbox-icon {\r\n    border-color: #f4f4f4;\r\n    background-color: #fff;\r\n}\r\n.dx-checkbox.dx-state-hover .dx-checkbox-icon {\r\n    border: 1px solid #265a87;\r\n}\r\n.dx-checkbox.dx-state-focused {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-checkbox.dx-state-focused .dx-checkbox-icon {\r\n    border: 1px solid #337ab7;\r\n}\r\n.dx-checkbox.dx-state-active .dx-checkbox-icon {\r\n    background-color: rgba(96, 96, 96, 0.2);\r\n}\r\n.dx-checkbox-icon {\r\n    width: 16px;\r\n    height: 16px;\r\n    -webkit-border-radius: -2px;\r\n    -moz-border-radius: -2px;\r\n    -ms-border-radius: -2px;\r\n    -o-border-radius: -2px;\r\n    border-radius: -2px;\r\n    border: 1px solid #ddd;\r\n    background-color: #fff;\r\n}\r\n.dx-checkbox-checked .dx-checkbox-icon {\r\n    font: 14px/1 DXIcons;\r\n    color: #337ab7;\r\n    font-size: 10px;\r\n    text-align: center;\r\n    line-height: 10px;\r\n}\r\n.dx-checkbox-checked .dx-checkbox-icon:before {\r\n    content: '\\F005';\r\n}\r\n.dx-checkbox-checked .dx-checkbox-icon:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 10px;\r\n    top: 50%;\r\n    margin-top: -5px;\r\n    left: 50%;\r\n    margin-left: -5px;\r\n}\r\n.dx-checkbox-indeterminate .dx-checkbox-icon:before {\r\n    content: '';\r\n    width: 8px;\r\n    height: 8px;\r\n    background-color: #337ab7;\r\n    position: absolute;\r\n    left: 3px;\r\n    top: 3px;\r\n}\r\n.dx-checkbox-text {\r\n    margin-left: -16px;\r\n    padding-left: 21px;\r\n}\r\n.dx-rtl .dx-checkbox-text,\r\n.dx-rtl.dx-checkbox-text {\r\n    margin-right: -16px;\r\n    padding-right: 21px;\r\n}\r\n.dx-state-disabled.dx-checkbox,\r\n.dx-state-disabled .dx-checkbox {\r\n    opacity: 1;\r\n}\r\n.dx-state-disabled.dx-checkbox .dx-checkbox-icon,\r\n.dx-state-disabled .dx-checkbox .dx-checkbox-icon {\r\n    opacity: 0.4;\r\n}\r\n.dx-invalid .dx-checkbox-container .dx-checkbox-icon {\r\n    border: 1px solid rgba(217, 83, 79, 0.4);\r\n}\r\n.dx-invalid.dx-state-focused .dx-checkbox-container .dx-checkbox-icon {\r\n    border-color: #d9534f;\r\n}\r\n.dx-switch {\r\n    width: 36px;\r\n    height: 18px;\r\n}\r\n.dx-switch.dx-state-readonly .dx-switch-container {\r\n    border-color: #f4f4f4;\r\n    background-color: #fff;\r\n}\r\n.dx-switch.dx-state-active .dx-switch-handle:before {\r\n    background-color: #204d73;\r\n}\r\n.dx-switch.dx-state-active .dx-switch-container {\r\n    border-color: #337ab7;\r\n    background-color: rgba(96, 96, 96, 0.2);\r\n}\r\n.dx-switch.dx-state-hover .dx-switch-handle:before {\r\n    background-color: #337ab7;\r\n}\r\n.dx-switch.dx-state-hover .dx-switch-container {\r\n    background-color: transparent;\r\n    border-color: #337ab7;\r\n}\r\n.dx-switch.dx-state-focused {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-switch.dx-state-focused .dx-switch-container {\r\n    border-color: #337ab7;\r\n}\r\n.dx-switch.dx-state-focused .dx-switch-handle:before {\r\n    background-color: #337ab7;\r\n}\r\n.dx-switch.dx-state-focused.dx-state-active .dx-switch-handle:before {\r\n    background-color: #204d73;\r\n}\r\n.dx-switch-container {\r\n    overflow: hidden;\r\n    margin: 0 -3px 0 0;\r\n    height: 18px;\r\n    border: 1px solid #ddd;\r\n    background: #fff;\r\n    -webkit-border-radius: -2px;\r\n    -moz-border-radius: -2px;\r\n    -ms-border-radius: -2px;\r\n    -o-border-radius: -2px;\r\n    border-radius: -2px;\r\n}\r\n.dx-switch-inner {\r\n    width: 200%;\r\n    height: 100%;\r\n}\r\n.dx-switch-on,\r\n.dx-switch-off {\r\n    float: left;\r\n    width: 50%;\r\n    padding-right: 16px;\r\n    padding-left: 1px;\r\n    line-height: 16px;\r\n    text-align: center;\r\n    font-size: 9px;\r\n    font-weight: 600;\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    -webkit-box-sizing: border-box;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n}\r\n.dx-switch-off {\r\n    margin-left: -1px;\r\n    color: #999999;\r\n}\r\n.dx-switch-on {\r\n    color: #333;\r\n}\r\n.dx-switch-handle {\r\n    position: relative;\r\n    float: left;\r\n    width: 14px;\r\n    height: 14px;\r\n    padding-right: 1px;\r\n    margin-top: 1px;\r\n    margin-left: -14px;\r\n    -webkit-box-sizing: border-box;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n}\r\n.dx-switch-handle:before {\r\n    display: block;\r\n    content: ' ';\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: #63a0d4;\r\n    -webkit-border-radius: -2px;\r\n    -moz-border-radius: -2px;\r\n    -ms-border-radius: -2px;\r\n    -o-border-radius: -2px;\r\n    border-radius: -2px;\r\n}\r\n.dx-switch-on-value .dx-switch-handle:before {\r\n    background-color: #337ab7;\r\n}\r\n.dx-rtl .dx-switch .dx-switch-on,\r\n.dx-switch.dx-rtl .dx-switch-on,\r\n.dx-rtl .dx-switch .dx-switch-off,\r\n.dx-switch.dx-rtl .dx-switch-off {\r\n    float: right;\r\n    padding-left: 16px;\r\n    padding-right: 1px;\r\n}\r\n.dx-rtl .dx-switch .dx-switch-off,\r\n.dx-switch.dx-rtl .dx-switch-off {\r\n    margin-left: 0;\r\n    margin-right: -1px;\r\n}\r\n.dx-rtl .dx-switch .dx-switch-handle,\r\n.dx-switch.dx-rtl .dx-switch-handle {\r\n    float: right;\r\n    padding-left: 1px;\r\n    padding-right: 0;\r\n    margin-left: 0;\r\n    margin-right: -14px;\r\n}\r\n.dx-rtl .dx-switch .dx-switch-container,\r\n.dx-switch.dx-rtl .dx-switch-container {\r\n    margin: 0 0 0 -3px;\r\n}\r\n.dx-tabs {\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-tabs-scrollable {\r\n    margin: -1px;\r\n    height: calc(100% + 2px);\r\n}\r\n.dx-tabs-scrollable .dx-tabs-wrapper {\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-tabs-nav-buttons .dx-tabs-scrollable .dx-tabs-wrapper {\r\n    border-left: 1px solid #f7f7f7;\r\n    border-right: 1px solid #f7f7f7;\r\n}\r\n.dx-tabs-nav-button {\r\n    border: none;\r\n    background-color: #f7f7f7;\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-tabs-nav-button .dx-button-content {\r\n    padding: 0;\r\n}\r\n.dx-tabs-nav-button.dx-state-active {\r\n    border: none;\r\n}\r\n.dx-tabs-nav-button.dx-state-disabled {\r\n    opacity: 1;\r\n}\r\n.dx-tabs-nav-button.dx-state-disabled .dx-button-content {\r\n    opacity: 0.6;\r\n}\r\n.dx-tab {\r\n    padding: 4px;\r\n    background-color: #f7f7f7;\r\n}\r\n.dx-tab .dx-icon {\r\n    color: #333;\r\n    display: inline-block;\r\n    vertical-align: middle;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 7px;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-tab .dx-icon,\r\n.dx-rtl.dx-tab .dx-icon {\r\n    margin-left: 7px;\r\n    margin-right: 0;\r\n}\r\n.dx-tab.dx-state-hover {\r\n    background-color: #fff;\r\n}\r\n.dx-tab.dx-state-active {\r\n    background-color: rgba(88, 88, 88, 0.2);\r\n    color: #333;\r\n}\r\n.dx-tab.dx-state-focused:after {\r\n    content: '';\r\n    pointer-events: none;\r\n    position: absolute;\r\n    top: -1px;\r\n    bottom: -1px;\r\n    right: -1px;\r\n    left: -1px;\r\n    border-right: 1px solid #337ab7;\r\n    border-left: 1px solid #337ab7;\r\n    border-top: 1px solid #337ab7;\r\n    border-bottom: 1px solid #337ab7;\r\n    z-index: 1;\r\n}\r\n.dx-tab.dx-tab-selected {\r\n    background-color: #fff;\r\n    color: #333;\r\n}\r\n.dx-tab-selected:after {\r\n    content: '';\r\n    pointer-events: none;\r\n    position: absolute;\r\n    top: -1px;\r\n    bottom: -1px;\r\n    right: -1px;\r\n    left: -1px;\r\n    border-right: 1px solid #ddd;\r\n    border-left: 1px solid #ddd;\r\n    border-top: none;\r\n    border-bottom: none;\r\n    z-index: 1;\r\n}\r\n.dx-tab-selected .dx-icon {\r\n    color: #333;\r\n}\r\n.dx-tab-selected:not(.dx-state-focused) + .dx-tab-selected:not(.dx-state-focused):after {\r\n    border-left: 1px solid #f7f7f7;\r\n}\r\n.dx-rtl .dx-tab-selected:not(.dx-state-focused) + .dx-tab-selected:not(.dx-state-focused):after {\r\n    border-left: 1px solid #ddd;\r\n    border-right: 1px solid #f7f7f7;\r\n}\r\n.dx-tab-text {\r\n    vertical-align: middle;\r\n    line-height: 21px;\r\n}\r\n.dx-state-disabled.dx-tabs {\r\n    opacity: 1;\r\n}\r\n.dx-state-disabled .dx-tab-content {\r\n    opacity: .3;\r\n}\r\n.dx-navbar {\r\n    padding: 0;\r\n    border: none;\r\n}\r\n.dx-nav-item .dx-tab-text,\r\n.dx-rtl .dx-nav-item .dx-tab-text {\r\n    line-height: normal;\r\n}\r\n.dx-navbar .dx-nav-item .dx-icon,\r\n.dx-navbar .dx-rtl .dx-nav-item .dx-icon {\r\n    width: 26px;\r\n    height: 26px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 26px 26px;\r\n    -moz-background-size: 26px 26px;\r\n    background-size: 26px 26px;\r\n    padding: 0px;\r\n    font-size: 26px;\r\n    text-align: center;\r\n    line-height: 26px;\r\n}\r\n.dx-nav-item.dx-tab-selected:after,\r\n.dx-rtl .dx-nav-item.dx-tab-selected:after,\r\n.dx-nav-item.dx-state-focused:after,\r\n.dx-rtl .dx-nav-item.dx-state-focused:after,\r\n.dx-nav-item.dx-state-active:after,\r\n.dx-rtl .dx-nav-item.dx-state-active:after {\r\n    content: none;\r\n}\r\n.dx-nav-item.dx-tab-selected,\r\n.dx-rtl .dx-nav-item.dx-tab-selected {\r\n    background: #fff;\r\n}\r\n.dx-nav-item.dx-state-active,\r\n.dx-rtl .dx-nav-item.dx-state-active {\r\n    border: none;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-nav-item.dx-state-focused,\r\n.dx-rtl .dx-nav-item.dx-state-focused {\r\n    -webkit-box-shadow: inset 0 0 0 1px #337ab7;\r\n    -moz-box-shadow: inset 0 0 0 1px #337ab7;\r\n    box-shadow: inset 0 0 0 1px #337ab7;\r\n}\r\n.dx-nav-item.dx-state-disabled .dx-icon,\r\n.dx-rtl .dx-nav-item.dx-state-disabled .dx-icon {\r\n    opacity: .5;\r\n}\r\n.dx-navbar-item-badge {\r\n    margin-right: -26px;\r\n    top: 6%;\r\n}\r\n.dx-rtl .dx-navbar-item-badge {\r\n    margin-left: -26px;\r\n}\r\n.dx-texteditor {\r\n    background: #fff;\r\n    border: 1px solid #ddd;\r\n    border-radius: 0;\r\n}\r\n.dx-texteditor.dx-state-readonly {\r\n    border-color: #f4f4f4;\r\n}\r\n.dx-texteditor.dx-state-hover {\r\n    border-color: rgba(51, 122, 183, 0.4);\r\n}\r\n.dx-texteditor.dx-state-focused,\r\n.dx-texteditor.dx-state-active {\r\n    border-color: #337ab7;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-texteditor.dx-invalid .dx-texteditor-input {\r\n    padding-right: 24px;\r\n}\r\n.dx-texteditor.dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 24px;\r\n}\r\n.dx-texteditor.dx-invalid .dx-texteditor-container:after {\r\n    right: 2px;\r\n}\r\n.dx-rtl .dx-texteditor.dx-invalid .dx-texteditor-container:after {\r\n    left: 2px;\r\n    right: auto;\r\n}\r\n.dx-texteditor.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-input {\r\n    padding-right: 48px;\r\n}\r\n.dx-texteditor.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 48px;\r\n}\r\n.dx-texteditor.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-container:after {\r\n    right: 26px;\r\n}\r\n.dx-rtl .dx-texteditor.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-container:after {\r\n    left: 26px;\r\n    right: auto;\r\n}\r\n.dx-show-clear-button .dx-texteditor-input {\r\n    padding-right: 24px;\r\n}\r\n.dx-rtl .dx-show-clear-button .dx-texteditor-input,\r\n.dx-rtl.dx-show-clear-button .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 24px;\r\n}\r\n.dx-show-clear-button .dx-clear-button-area {\r\n    width: 24px;\r\n    right: 0;\r\n}\r\n.dx-show-clear-button .dx-icon-clear {\r\n    color: #999999;\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -12px;\r\n    width: 24px;\r\n    height: 24px;\r\n    background-position: 5px 5px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 5px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-placeholder {\r\n    color: #999999;\r\n}\r\n.dx-placeholder:before {\r\n    padding: 4px 5px 4px;\r\n}\r\n.dx-texteditor-input {\r\n    margin: 0;\r\n    padding: 4px 5px 4px;\r\n    background: #fff;\r\n    color: #333;\r\n    font-size: 1em;\r\n    border-radius: 0;\r\n    min-height: 24px;\r\n}\r\n.dx-invalid.dx-texteditor {\r\n    border-color: rgba(217, 83, 79, 0.4);\r\n}\r\n.dx-invalid.dx-texteditor.dx-state-focused {\r\n    border-color: #d9534f;\r\n}\r\n.dx-invalid.dx-texteditor .dx-texteditor-container:after {\r\n    pointer-events: none;\r\n    font-weight: bold;\r\n    background-color: #d9534f;\r\n    color: #fff;\r\n    content: '!';\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -8px;\r\n    width: 16px;\r\n    height: 16px;\r\n    -webkit-border-radius: 50%;\r\n    -moz-border-radius: 50%;\r\n    -ms-border-radius: 50%;\r\n    -o-border-radius: 50%;\r\n    border-radius: 50%;\r\n    text-align: center;\r\n    line-height: 16px;\r\n    font-size: 11px;\r\n}\r\n.dx-rtl .dx-placeholder,\r\n.dx-rtl .dx-placeholder:before {\r\n    right: 0;\r\n    left: auto;\r\n}\r\n.dx-searchbox .dx-icon-search {\r\n    font: 14px/1 DXIcons;\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -12px;\r\n    width: 24px;\r\n    height: 24px;\r\n    background-position: 5px 5px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 5px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    font-size: 13px;\r\n    color: #999999;\r\n}\r\n.dx-searchbox .dx-icon-search:before {\r\n    content: '\\F027';\r\n}\r\n.dx-searchbox .dx-icon-search:before {\r\n    position: static;\r\n    text-indent: 0;\r\n    color: #999999;\r\n}\r\n.dx-searchbox .dx-texteditor-input,\r\n.dx-searchbox .dx-placeholder:before {\r\n    padding-left: 24px;\r\n}\r\n.dx-rtl .dx-searchbox .dx-texteditor-input,\r\n.dx-rtl .dx-searchbox .dx-placeholder:before,\r\n.dx-rtl.dx-searchbox .dx-texteditor-input,\r\n.dx-rtl.dx-searchbox .dx-placeholder:before {\r\n    padding-right: 24px;\r\n}\r\n.dx-searchbar {\r\n    padding-bottom: 5px;\r\n}\r\n.dx-searchbar .dx-texteditor {\r\n    margin: 0;\r\n}\r\n.dx-dropdowneditor-button {\r\n    width: 24px;\r\n    padding: 1px;\r\n}\r\n.dx-state-disabled .dx-dropdowneditor-button .dx-dropdowneditor-icon,\r\n.dx-state-disabled .dx-dropdowneditor-button .dx-dropdowneditor-icon {\r\n    opacity: 1;\r\n}\r\n.dx-state-readonly .dx-dropdowneditor-button .dx-dropdowneditor-icon {\r\n    opacity: 1;\r\n}\r\n.dx-dropdowneditor-icon {\r\n    border: 1px solid transparent;\r\n    color: #333;\r\n    font: 14px/1 DXIcons;\r\n    width: 22px;\r\n    height: 100%;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    -webkit-border-radius: -1px;\r\n    -moz-border-radius: -1px;\r\n    -ms-border-radius: -1px;\r\n    -o-border-radius: -1px;\r\n    border-radius: -1px;\r\n}\r\n.dx-dropdowneditor-icon:before {\r\n    content: '\\F001';\r\n}\r\n.dx-dropdowneditor-icon:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-dropdowneditor-input-wrapper .dx-texteditor.dx-state-focused {\r\n    border: none;\r\n    box-shadow: none;\r\n}\r\n.dx-dropdowneditor .dx-clear-button-area {\r\n    width: 22px;\r\n}\r\n.dx-dropdowneditor-button-visible.dx-show-clear-button .dx-texteditor-input {\r\n    padding-right: 46px;\r\n}\r\n.dx-rtl .dx-dropdowneditor-button-visible.dx-show-clear-button .dx-texteditor-input,\r\n.dx-rtl.dx-dropdowneditor-button-visible.dx-show-clear-button .dx-texteditor-input {\r\n    padding-right: 5px;\r\n    padding-left: 46px;\r\n}\r\n.dx-rtl.dx-searchbox.dx-dropdowneditor-button-visible.dx-show-clear-button .dx-texteditor-input,\r\n.dx-rtl .dx-searchbox.dx-dropdowneditor-button-visible.dx-show-clear-button .dx-texteditor-input {\r\n    padding-right: 24px;\r\n}\r\n.dx-dropdowneditor-button-visible .dx-texteditor-input {\r\n    padding-right: 24px;\r\n}\r\n.dx-rtl .dx-dropdowneditor-button-visible .dx-texteditor-input,\r\n.dx-rtl.dx-dropdowneditor-button-visible .dx-texteditor-input {\r\n    padding-right: 5px;\r\n    padding-left: 24px;\r\n}\r\n.dx-dropdowneditor-button-visible.dx-invalid .dx-texteditor-input {\r\n    padding-right: 44px;\r\n}\r\n.dx-dropdowneditor-button-visible.dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 44px;\r\n}\r\n.dx-dropdowneditor-button-visible.dx-invalid.dx-show-clear-button .dx-texteditor-input {\r\n    padding-right: 66px;\r\n}\r\n.dx-dropdowneditor-button-visible.dx-invalid.dx-show-clear-button.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 66px;\r\n}\r\n.dx-dropdowneditor.dx-state-hover .dx-dropdowneditor-icon,\r\n.dx-dropdowneditor.dx-state-active .dx-dropdowneditor-icon {\r\n    background-color: #e6e6e6;\r\n    border-color: transparent;\r\n}\r\n.dx-dropdowneditor.dx-dropdowneditor-active .dx-dropdowneditor-icon,\r\n.dx-dropdowneditor-button.dx-state-active .dx-dropdowneditor-icon {\r\n    background-color: #d4d4d4;\r\n    border-color: transparent;\r\n    color: #333;\r\n    opacity: 1;\r\n}\r\n.dx-invalid.dx-dropdowneditor .dx-texteditor-container:after {\r\n    right: 26px;\r\n}\r\n.dx-rtl .dx-invalid.dx-dropdowneditor .dx-texteditor-container:after,\r\n.dx-rtl.dx-invalid.dx-dropdowneditor .dx-texteditor-container:after {\r\n    right: auto;\r\n    left: 26px;\r\n}\r\n.dx-invalid.dx-dropdowneditor.dx-show-clear-button:not(.dx-texteditor-empty) .dx-texteditor-container:after {\r\n    right: 48px;\r\n}\r\n.dx-rtl .dx-invalid.dx-dropdowneditor.dx-show-clear-button:not(.dx-texteditor-empty) .dx-texteditor-container:after,\r\n.dx-rtl.dx-invalid.dx-dropdowneditor.dx-show-clear-button:not(.dx-texteditor-empty) .dx-texteditor-container:after {\r\n    right: auto;\r\n    left: 48px;\r\n}\r\n.dx-list-item-chevron {\r\n    -webkit-transform: rotate(0);\r\n    -moz-transform: rotate(0);\r\n    -ms-transform: rotate(0);\r\n    -o-transform: rotate(0);\r\n    transform: rotate(0);\r\n    border: none;\r\n    opacity: 1;\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-left: -5px;\r\n    color: #333;\r\n}\r\n.dx-rtl .dx-list-item-chevron {\r\n    -webkit-transform: rotate(0);\r\n    -moz-transform: rotate(0);\r\n    -ms-transform: rotate(0);\r\n    -o-transform: rotate(0);\r\n    transform: rotate(0);\r\n}\r\n.dx-list-item-chevron:before {\r\n    content: '\\F010';\r\n}\r\n.dx-rtl .dx-list-item-chevron:before {\r\n    content: '\\F012';\r\n}\r\n.dx-list {\r\n    border: none;\r\n}\r\n.dx-list .dx-empty-message {\r\n    text-align: left;\r\n}\r\n.dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-hover .dx-radiobutton-icon:before,\r\n.dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-hover .dx-checkbox-icon {\r\n    border-color: #265a87;\r\n}\r\n.dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-focused .dx-radiobutton {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-focused .dx-radiobutton-icon:before,\r\n.dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-focused .dx-checkbox-icon {\r\n    border: 1px solid #337ab7;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-hover {\r\n    background-color: #f5f5f5;\r\n    color: #333;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-list-item-selected {\r\n    background-color: #e6e6e6;\r\n    color: #333;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-list-item-selected.dx-state-hover:not(.dx-state-focused) {\r\n    background-color: #f5f5f5;\r\n    color: #333;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-focused {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-focused .dx-list-item-chevron {\r\n    border-color: #fff;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-focused.dx-list-item-selected {\r\n    background-color: rgba(51, 122, 183, 0.7);\r\n    color: #fff;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-active {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-active .dx-list-slide-item-content {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item .dx-icon {\r\n    color: #333;\r\n}\r\n.dx-list-group-header {\r\n    font-weight: bold;\r\n    padding: 20px 5px 5px 5px;\r\n    border-top: 0px solid #ddd;\r\n    border-bottom: 2px solid #ddd;\r\n    background: rgba(238, 238, 238, 0.05);\r\n    color: #333;\r\n}\r\n.dx-list-group:first-of-type .dx-list-group-header {\r\n    border-top: none;\r\n}\r\n.dx-list-group-header:before {\r\n    border-top-color: #333;\r\n}\r\n.dx-list-group-collapsed .dx-list-group-header:before {\r\n    border-bottom-color: #333;\r\n}\r\n.dx-list-item:first-of-type {\r\n    border-top: none;\r\n}\r\n.dx-list-item:last-of-type {\r\n    border-bottom: none;\r\n}\r\n.dx-list-item .dx-icon-toggle-delete {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAA0ElEQVRYw+2Y0QrDMAhFEwYj7/mM+1V+sx/UvWywQexiNbdQqq/FQ8y1akq5bY2hokOgUAg6anZ4xWa4ZoRvZvhvb5H0bA6vuSnKSp0b8HYCwoGJICYxUcQE5sB1eyXgFO0xQach7JRNVvest+XnMM9CgCTpal9j6YjRWQiQxAqxqwV9CaT/QmTwySPcHuSvtkq8B+kJkFG6nuGJQE64eIaEr1PxpB/kdfoJqf1SBgnSSEQZ7khjKmngJq0OpCWItM6RFlPSik17LCA+e9z2sRfnMjs2IEgNwQAAAABJRU5ErkJggg==);\r\n    -webkit-background-size: 100%;\r\n    -moz-background-size: 100%;\r\n    background-size: 100%;\r\n}\r\n.dx-list-item.dx-list-item-ghost-reordering.dx-state-focused.dx-state-hover {\r\n    color: #959595;\r\n    background: #fff;\r\n    border-top: 1px solid rgba(51, 122, 183, 0.5);\r\n    border-bottom: 1px solid rgba(51, 122, 183, 0.5);\r\n    -webkit-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n}\r\n.dx-list-item,\r\n.dx-list .dx-empty-message {\r\n    border-top: 0px solid #ddd;\r\n    color: #333;\r\n}\r\n.dx-list-item-separator-hidden .dx-list-item,\r\n.dx-list-item-separator-hidden .dx-list .dx-empty-message {\r\n    border-top: none;\r\n    border-bottom: none;\r\n}\r\n.dx-list-item-content,\r\n.dx-list .dx-empty-message {\r\n    padding: 5px 5px;\r\n}\r\n.dx-list-next-button .dx-button .dx-button-content {\r\n    padding: 4px 10px 4px;\r\n}\r\n.dx-list-next-button .dx-button .dx-icon {\r\n    color: #333;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 7px;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-list-next-button .dx-button .dx-icon,\r\n.dx-rtl.dx-list-next-button .dx-button .dx-icon {\r\n    margin-left: 7px;\r\n    margin-right: 0;\r\n}\r\n.dx-list-item-chevron-container {\r\n    width: 11px;\r\n}\r\n.dx-list-border-visible {\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-list-border-visible .dx-list-select-all {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-list-item-before-bag.dx-list-toggle-delete-switch-container {\r\n    width: 24px;\r\n}\r\n.dx-list-item-before-bag.dx-list-select-checkbox-container,\r\n.dx-list-item-before-bag.dx-list-select-radiobutton-container {\r\n    width: 26px;\r\n}\r\n.dx-list-item-before-bag .dx-button.dx-list-toggle-delete-switch {\r\n    border: none;\r\n    background: transparent;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-list-item-before-bag .dx-button.dx-list-toggle-delete-switch .dx-button-content {\r\n    padding: 0;\r\n}\r\n.dx-list-item-before-bag .dx-icon-toggle-delete {\r\n    margin: 2.5px 2.5px 2.5px 5px;\r\n    width: 14px;\r\n    height: 14px;\r\n}\r\n.dx-list-item-before-bag .dx-list-select-checkbox,\r\n.dx-list-item-before-bag .dx-list-select-radiobutton {\r\n    margin-top: 1px;\r\n    margin-bottom: -3px;\r\n    margin-left: 5px;\r\n}\r\n.dx-list-select-all {\r\n    padding: 4px 0;\r\n}\r\n.dx-list-select-all-checkbox {\r\n    float: left;\r\n    margin-top: -1px;\r\n    margin-bottom: -3px;\r\n    margin-left: 5px;\r\n}\r\n.dx-list-select-all-label {\r\n    line-height: 1;\r\n    padding: 0 6px;\r\n    margin-top: 0;\r\n}\r\n.dx-list-item-after-bag.dx-list-static-delete-button-container {\r\n    width: 23px;\r\n}\r\n.dx-list-item-after-bag.dx-list-reorder-handle-container {\r\n    width: 23.2px;\r\n}\r\n.dx-list-item-after-bag .dx-list-reorder-handle {\r\n    font: 14px/1 DXIcons;\r\n    width: 22.4px;\r\n    height: 22.4px;\r\n    background-position: 4px 4px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 4px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-list-item-after-bag .dx-list-reorder-handle:before {\r\n    content: '\\F038';\r\n}\r\n.dx-list-slide-menu-button {\r\n    bottom: 1px;\r\n}\r\n.dx-list-slide-menu-button-delete {\r\n    border: 1px solid transparent;\r\n    color: #fff;\r\n    background-color: #d9534f;\r\n}\r\n.dx-list-slide-menu-button-menu {\r\n    border: 1px solid transparent;\r\n    color: #fff;\r\n    background-color: #337ab7;\r\n}\r\n.dx-list-switchable-delete-button,\r\n.dx-list-static-delete-button {\r\n    margin-right: 5px;\r\n    padding: 0;\r\n}\r\n.dx-list-switchable-delete-button .dx-button-content,\r\n.dx-list-static-delete-button .dx-button-content {\r\n    padding: 1px;\r\n}\r\n.dx-list-context-menucontent {\r\n    background-color: #fff;\r\n    border: 1px solid #ddd;\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n    -webkit-box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n    -moz-box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n}\r\n.dx-state-disabled.dx-list-item,\r\n.dx-state-disabled .dx-list-item {\r\n    background-color: transparent;\r\n    opacity: .6;\r\n}\r\n.dx-rtl .dx-list .dx-empty-message,\r\n.dx-rtl.dx-list .dx-empty-message {\r\n    text-align: right;\r\n}\r\n.dx-rtl .dx-list .dx-list-item-before-bag .dx-icon-toggle-delete,\r\n.dx-rtl.dx-list .dx-list-item-before-bag .dx-icon-toggle-delete {\r\n    margin: 2.5px 5px 2.5px 2.5px;\r\n}\r\n.dx-rtl .dx-list .dx-list-item-before-bag .dx-list-select-checkbox,\r\n.dx-rtl.dx-list .dx-list-item-before-bag .dx-list-select-checkbox,\r\n.dx-rtl .dx-list .dx-list-item-before-bag .dx-list-select-radiobutton,\r\n.dx-rtl.dx-list .dx-list-item-before-bag .dx-list-select-radiobutton {\r\n    margin-right: 5px;\r\n    margin-left: 1px;\r\n}\r\n.dx-rtl .dx-list .dx-list-select-all-checkbox,\r\n.dx-rtl.dx-list .dx-list-select-all-checkbox {\r\n    float: right;\r\n    margin-right: 5px;\r\n    margin-left: 1px;\r\n}\r\n.dx-rtl .dx-list .dx-list-switchable-delete-button,\r\n.dx-rtl.dx-list .dx-list-switchable-delete-button {\r\n    margin-left: 5px;\r\n    margin-right: 0;\r\n}\r\n.dx-device-mobile .dx-list {\r\n    border: none;\r\n}\r\n.dx-device-mobile .dx-list .dx-empty-message {\r\n    text-align: left;\r\n}\r\n.dx-device-mobile .dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-hover .dx-radiobutton-icon:before,\r\n.dx-device-mobile .dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-hover .dx-checkbox-icon {\r\n    border-color: #265a87;\r\n}\r\n.dx-device-mobile .dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-focused .dx-radiobutton {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-device-mobile .dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-focused .dx-radiobutton-icon:before,\r\n.dx-device-mobile .dx-list.dx-list-select-decorator-enabled .dx-list-item.dx-state-focused .dx-checkbox-icon {\r\n    border: 1px solid #337ab7;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-hover {\r\n    background-color: #f5f5f5;\r\n    color: #333;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-list-item-selected {\r\n    background-color: #e6e6e6;\r\n    color: #333;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-list-item-selected.dx-state-hover:not(.dx-state-focused) {\r\n    background-color: #f5f5f5;\r\n    color: #333;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-focused {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-focused .dx-list-item-chevron {\r\n    border-color: #fff;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-focused.dx-list-item-selected {\r\n    background-color: rgba(51, 122, 183, 0.7);\r\n    color: #fff;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-active {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item.dx-state-active .dx-list-slide-item-content {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-device-mobile .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item .dx-icon {\r\n    color: #333;\r\n}\r\n.dx-device-mobile .dx-list-group-header {\r\n    font-weight: bold;\r\n    padding: 20px 15px 5px 15px;\r\n    border-top: 0px solid #ddd;\r\n    border-bottom: 2px solid #ddd;\r\n    background: rgba(238, 238, 238, 0.05);\r\n    color: #333;\r\n}\r\n.dx-list-group:first-of-type .dx-device-mobile .dx-list-group-header {\r\n    border-top: none;\r\n}\r\n.dx-device-mobile .dx-list-group-header:before {\r\n    border-top-color: #333;\r\n}\r\n.dx-list-group-collapsed .dx-device-mobile .dx-list-group-header:before {\r\n    border-bottom-color: #333;\r\n}\r\n.dx-device-mobile .dx-list-item:first-of-type {\r\n    border-top: none;\r\n}\r\n.dx-device-mobile .dx-list-item:last-of-type {\r\n    border-bottom: none;\r\n}\r\n.dx-device-mobile .dx-list-item .dx-icon-toggle-delete {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAA0ElEQVRYw+2Y0QrDMAhFEwYj7/mM+1V+sx/UvWywQexiNbdQqq/FQ8y1akq5bY2hokOgUAg6anZ4xWa4ZoRvZvhvb5H0bA6vuSnKSp0b8HYCwoGJICYxUcQE5sB1eyXgFO0xQach7JRNVvest+XnMM9CgCTpal9j6YjRWQiQxAqxqwV9CaT/QmTwySPcHuSvtkq8B+kJkFG6nuGJQE64eIaEr1PxpB/kdfoJqf1SBgnSSEQZ7khjKmngJq0OpCWItM6RFlPSik17LCA+e9z2sRfnMjs2IEgNwQAAAABJRU5ErkJggg==);\r\n    -webkit-background-size: 100%;\r\n    -moz-background-size: 100%;\r\n    background-size: 100%;\r\n}\r\n.dx-device-mobile .dx-list-item.dx-list-item-ghost-reordering.dx-state-focused.dx-state-hover {\r\n    color: #959595;\r\n    background: #fff;\r\n    border-top: 1px solid rgba(51, 122, 183, 0.5);\r\n    border-bottom: 1px solid rgba(51, 122, 183, 0.5);\r\n    -webkit-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n}\r\n.dx-device-mobile .dx-list-item,\r\n.dx-device-mobile .dx-list .dx-empty-message {\r\n    border-top: 0px solid #ddd;\r\n    color: #333;\r\n}\r\n.dx-list-item-separator-hidden .dx-device-mobile .dx-list-item,\r\n.dx-list-item-separator-hidden .dx-device-mobile .dx-list .dx-empty-message {\r\n    border-top: none;\r\n    border-bottom: none;\r\n}\r\n.dx-device-mobile .dx-list-item-content,\r\n.dx-device-mobile .dx-list .dx-empty-message {\r\n    padding: 5px 15px;\r\n}\r\n.dx-device-mobile .dx-list-next-button .dx-button .dx-button-content {\r\n    padding: 4px 10px 4px;\r\n}\r\n.dx-device-mobile .dx-list-next-button .dx-button .dx-icon {\r\n    color: #333;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 7px;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-device-mobile .dx-list-next-button .dx-button .dx-icon,\r\n.dx-rtl.dx-device-mobile .dx-list-next-button .dx-button .dx-icon {\r\n    margin-left: 7px;\r\n    margin-right: 0;\r\n}\r\n.dx-device-mobile .dx-list-item-chevron-container {\r\n    width: 21px;\r\n}\r\n.dx-device-mobile .dx-list-border-visible {\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-device-mobile .dx-list-border-visible .dx-list-select-all {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-device-mobile .dx-list-item-before-bag.dx-list-toggle-delete-switch-container {\r\n    width: 34px;\r\n}\r\n.dx-device-mobile .dx-list-item-before-bag.dx-list-select-checkbox-container,\r\n.dx-device-mobile .dx-list-item-before-bag.dx-list-select-radiobutton-container {\r\n    width: 36px;\r\n}\r\n.dx-device-mobile .dx-list-item-before-bag .dx-button.dx-list-toggle-delete-switch {\r\n    border: none;\r\n    background: transparent;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-device-mobile .dx-list-item-before-bag .dx-button.dx-list-toggle-delete-switch .dx-button-content {\r\n    padding: 0;\r\n}\r\n.dx-device-mobile .dx-list-item-before-bag .dx-icon-toggle-delete {\r\n    margin: 2.5px 7.5px 2.5px 15px;\r\n    width: 14px;\r\n    height: 14px;\r\n}\r\n.dx-device-mobile .dx-list-item-before-bag .dx-list-select-checkbox,\r\n.dx-device-mobile .dx-list-item-before-bag .dx-list-select-radiobutton {\r\n    margin-top: 1px;\r\n    margin-bottom: -3px;\r\n    margin-left: 15px;\r\n}\r\n.dx-device-mobile .dx-list-select-all {\r\n    padding: 4px 0;\r\n}\r\n.dx-device-mobile .dx-list-select-all-checkbox {\r\n    float: left;\r\n    margin-top: -1px;\r\n    margin-bottom: -3px;\r\n    margin-left: 15px;\r\n}\r\n.dx-device-mobile .dx-list-select-all-label {\r\n    line-height: 1;\r\n    padding: 0 6px;\r\n    margin-top: 0;\r\n}\r\n.dx-device-mobile .dx-list-item-after-bag.dx-list-static-delete-button-container {\r\n    width: 33px;\r\n}\r\n.dx-device-mobile .dx-list-item-after-bag.dx-list-reorder-handle-container {\r\n    width: 33.2px;\r\n}\r\n.dx-device-mobile .dx-list-item-after-bag .dx-list-reorder-handle {\r\n    font: 14px/1 DXIcons;\r\n    width: 22.4px;\r\n    height: 22.4px;\r\n    background-position: 4px 4px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 4px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-device-mobile .dx-list-item-after-bag .dx-list-reorder-handle:before {\r\n    content: '\\F038';\r\n}\r\n.dx-device-mobile .dx-list-slide-menu-button {\r\n    bottom: 1px;\r\n}\r\n.dx-device-mobile .dx-list-slide-menu-button-delete {\r\n    border: 1px solid transparent;\r\n    color: #fff;\r\n    background-color: #d9534f;\r\n}\r\n.dx-device-mobile .dx-list-slide-menu-button-menu {\r\n    border: 1px solid transparent;\r\n    color: #fff;\r\n    background-color: #337ab7;\r\n}\r\n.dx-device-mobile .dx-list-switchable-delete-button,\r\n.dx-device-mobile .dx-list-static-delete-button {\r\n    margin-right: 15px;\r\n    padding: 0;\r\n}\r\n.dx-device-mobile .dx-list-switchable-delete-button .dx-button-content,\r\n.dx-device-mobile .dx-list-static-delete-button .dx-button-content {\r\n    padding: 1px;\r\n}\r\n.dx-device-mobile .dx-list-context-menucontent {\r\n    background-color: #fff;\r\n    border: 1px solid #ddd;\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n    -webkit-box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n    -moz-box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n}\r\n.dx-device-mobile .dx-state-disabled.dx-list-item,\r\n.dx-device-mobile .dx-state-disabled .dx-list-item {\r\n    background-color: transparent;\r\n    opacity: .6;\r\n}\r\n.dx-device-mobile .dx-rtl .dx-list .dx-empty-message,\r\n.dx-device-mobile .dx-rtl.dx-list .dx-empty-message {\r\n    text-align: right;\r\n}\r\n.dx-device-mobile .dx-rtl .dx-list .dx-list-item-before-bag .dx-icon-toggle-delete,\r\n.dx-device-mobile .dx-rtl.dx-list .dx-list-item-before-bag .dx-icon-toggle-delete {\r\n    margin: 2.5px 15px 2.5px 7.5px;\r\n}\r\n.dx-device-mobile .dx-rtl .dx-list .dx-list-item-before-bag .dx-list-select-checkbox,\r\n.dx-device-mobile .dx-rtl.dx-list .dx-list-item-before-bag .dx-list-select-checkbox,\r\n.dx-device-mobile .dx-rtl .dx-list .dx-list-item-before-bag .dx-list-select-radiobutton,\r\n.dx-device-mobile .dx-rtl.dx-list .dx-list-item-before-bag .dx-list-select-radiobutton {\r\n    margin-right: 15px;\r\n    margin-left: 1px;\r\n}\r\n.dx-device-mobile .dx-rtl .dx-list .dx-list-select-all-checkbox,\r\n.dx-device-mobile .dx-rtl.dx-list .dx-list-select-all-checkbox {\r\n    float: right;\r\n    margin-right: 15px;\r\n    margin-left: 1px;\r\n}\r\n.dx-device-mobile .dx-rtl .dx-list .dx-list-switchable-delete-button,\r\n.dx-device-mobile .dx-rtl.dx-list .dx-list-switchable-delete-button {\r\n    margin-left: 15px;\r\n    margin-right: 0;\r\n}\r\n.dx-dropdownlist-popup-wrapper {\r\n    height: 100%;\r\n}\r\n.dx-dropdownlist-popup-wrapper.dx-popup-wrapper .dx-overlay-content {\r\n    border-top-width: 0;\r\n    border-bottom-width: 1px;\r\n}\r\n.dx-dropdownlist-popup-wrapper.dx-popup-wrapper .dx-overlay-content.dx-dropdowneditor-overlay-flipped {\r\n    border-top-width: 1px;\r\n    border-bottom-width: 0;\r\n}\r\n.dx-dropdownlist-popup-wrapper .dx-popup-content {\r\n    height: 100%;\r\n    padding: 1px;\r\n}\r\n.dx-dropdownlist-popup-wrapper .dx-list {\r\n    height: 100%;\r\n    min-height: 33px;\r\n}\r\n.dx-dropdownlist-popup-wrapper .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item-content {\r\n    padding: 2px 4px;\r\n}\r\n.dx-dropdownlist-popup-wrapper .dx-list-select-all {\r\n    padding: 7px 0 3px;\r\n}\r\n.dx-dropdownlist-popup-wrapper .dx-list-item,\r\n.dx-dropdownlist-popup-wrapper .dx-empty-message {\r\n    border-top: 0;\r\n}\r\n.dx-dropdownlist-popup-wrapper .dx-list-item:last-of-type,\r\n.dx-dropdownlist-popup-wrapper .dx-empty-message:last-of-type {\r\n    border-bottom: none;\r\n}\r\n.dx-textarea {\r\n    height: auto;\r\n}\r\n.dx-textarea .dx-icon-clear {\r\n    top: 0;\r\n    margin-top: 0;\r\n}\r\n.dx-textarea.dx-invalid .dx-texteditor-container:after {\r\n    top: 4px;\r\n    margin-top: 0;\r\n}\r\n.dx-numberbox-spin-container {\r\n    overflow: hidden;\r\n    width: 20px;\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n}\r\n.dx-numberbox-spin-up-icon {\r\n    font: 14px/1 DXIcons;\r\n    color: #333;\r\n}\r\n.dx-numberbox-spin-up-icon:before {\r\n    content: '\\F002';\r\n}\r\n.dx-numberbox-spin-down-icon {\r\n    font: 14px/1 DXIcons;\r\n    color: #333;\r\n}\r\n.dx-numberbox-spin-down-icon:before {\r\n    content: '\\F001';\r\n}\r\n.dx-numberbox-spin-up-icon,\r\n.dx-numberbox-spin-down-icon {\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    -webkit-border-radius: -1px;\r\n    -moz-border-radius: -1px;\r\n    -ms-border-radius: -1px;\r\n    -o-border-radius: -1px;\r\n    border-radius: -1px;\r\n}\r\n.dx-numberbox-spin-up-icon:before,\r\n.dx-numberbox-spin-down-icon:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-numberbox-spin.dx-show-clear-button .dx-texteditor-input {\r\n    padding-right: 40px;\r\n}\r\n.dx-numberbox-spin-button {\r\n    background-color: #fff;\r\n    padding: 1px;\r\n}\r\n.dx-state-hover.dx-numberbox-spin-button .dx-numberbox-spin-down-icon,\r\n.dx-state-hover.dx-numberbox-spin-button .dx-numberbox-spin-up-icon {\r\n    border: 1px solid transparent;\r\n    background-color: #e6e6e6;\r\n}\r\n.dx-state-active.dx-numberbox-spin-button .dx-numberbox-spin-down-icon,\r\n.dx-state-active.dx-numberbox-spin-button .dx-numberbox-spin-up-icon {\r\n    background-color: #d4d4d4;\r\n    color: #333;\r\n}\r\n.dx-numberbox-spin.dx-invalid .dx-texteditor-input {\r\n    padding-right: 44px;\r\n}\r\n.dx-numberbox-spin.dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 44px;\r\n}\r\n.dx-numberbox-spin.dx-invalid .dx-texteditor-container:after {\r\n    right: 22px;\r\n}\r\n.dx-rtl .dx-numberbox-spin.dx-invalid .dx-texteditor-container:after {\r\n    left: 22px;\r\n    right: auto;\r\n}\r\n.dx-numberbox-spin.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-input {\r\n    padding-right: 68px;\r\n}\r\n.dx-numberbox-spin.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 68px;\r\n}\r\n.dx-numberbox-spin.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-container:after {\r\n    right: 46px;\r\n}\r\n.dx-rtl .dx-numberbox-spin.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-container:after {\r\n    left: 46px;\r\n    right: auto;\r\n}\r\n.dx-numberbox-spin-touch-friendly.dx-invalid .dx-texteditor-input {\r\n    padding-right: 84px;\r\n}\r\n.dx-numberbox-spin-touch-friendly.dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 84px;\r\n}\r\n.dx-numberbox-spin-touch-friendly.dx-invalid .dx-texteditor-container:after {\r\n    right: 62px;\r\n}\r\n.dx-rtl .dx-numberbox-spin-touch-friendly.dx-invalid .dx-texteditor-container:after {\r\n    left: 62px;\r\n    right: auto;\r\n}\r\n.dx-numberbox-spin-touch-friendly.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-input {\r\n    padding-right: 108px;\r\n}\r\n.dx-numberbox-spin-touch-friendly.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 108px;\r\n}\r\n.dx-numberbox-spin-touch-friendly.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-container:after {\r\n    right: 86px;\r\n}\r\n.dx-rtl .dx-numberbox-spin-touch-friendly.dx-show-clear-button:not(.dx-texteditor-empty).dx-invalid .dx-texteditor-container:after {\r\n    left: 86px;\r\n    right: auto;\r\n}\r\n.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-container {\r\n    width: 60px;\r\n}\r\n.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-container {\r\n    border-left: none;\r\n}\r\n.dx-numberbox-spin-touch-friendly.dx-show-clear-button .dx-texteditor-input {\r\n    padding-right: 80px;\r\n}\r\n.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-up-icon,\r\n.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-down-icon {\r\n    background-position: center;\r\n}\r\n.dx-rtl .dx-numberbox.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-container,\r\n.dx-numberbox.dx-rtl.dx-numberbox-spin-touch-friendly .dx-numberbox-spin-container {\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-numberbox.dx-numberbox-spin-touch-friendly.dx-show-clear-button .dx-texteditor-input,\r\n.dx-numberbox.dx-rtl.dx-numberbox-spin-touch-friendly.dx-show-clear-button .dx-texteditor-input {\r\n    padding-left: 80px;\r\n}\r\n.dx-rtl .dx-numberbox.dx-numberbox-spin.dx-show-clear-button .dx-texteditor-input,\r\n.dx-numberbox.dx-rtl.dx-numberbox-spin.dx-show-clear-button .dx-texteditor-input {\r\n    padding-left: 40px;\r\n}\r\n.dx-rtl .dx-numberbox.dx-numberbox-spin .dx-texteditor-input,\r\n.dx-numberbox.dx-rtl.dx-numberbox-spin .dx-texteditor-input {\r\n    padding-right: 5px;\r\n}\r\n.dx-datebox-wrapper .dx-popup-title {\r\n    min-height: 10px;\r\n    border-bottom: none;\r\n    background: none;\r\n}\r\n.dx-datebox-wrapper .dx-item {\r\n    border: none;\r\n}\r\n.dx-datebox-wrapper .dx-popup-bottom .dx-button {\r\n    min-width: 60px;\r\n    width: auto;\r\n}\r\n.dx-datebox-wrapper-rollers.dx-datebox-wrapper-time .dx-popup-content {\r\n    margin: 0 14px;\r\n}\r\n.dx-datebox-wrapper-list .dx-overlay-content {\r\n    border-top: none;\r\n}\r\n.dx-device-phone .dx-datebox-wrapper-rollers .dx-popup-content {\r\n    padding: 10px;\r\n}\r\n.dx-datebox-calendar .dx-dropdowneditor-icon {\r\n    font: 14px/1 DXIcons;\r\n    width: 22px;\r\n    height: 100%;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    -webkit-border-radius: -1px;\r\n    -moz-border-radius: -1px;\r\n    -ms-border-radius: -1px;\r\n    -o-border-radius: -1px;\r\n    border-radius: -1px;\r\n}\r\n.dx-datebox-calendar .dx-dropdowneditor-icon:before {\r\n    content: '\\F026';\r\n}\r\n.dx-datebox-calendar .dx-dropdowneditor-icon:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-datebox-calendar.dx-dropdowneditor-active {\r\n    -webkit-box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.16);\r\n    -moz-box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.16);\r\n    box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.16);\r\n}\r\n.dx-datebox-calendar.dx-dropdowneditor-active .dx-texteditor-input {\r\n    background: #fff;\r\n}\r\n.dx-datebox-calendar.dx-rtl.dx-dropdowneditor-active .dx-dropdowneditor-button .dx-dropdowneditor-icon {\r\n    opacity: 1;\r\n}\r\n.dx-datebox-wrapper-calendar .dx-popup-content {\r\n    padding: 0;\r\n}\r\n.dx-datebox-wrapper-calendar .dx-calendar {\r\n    border: none;\r\n    margin: 15px;\r\n}\r\n.dx-datebox-wrapper-calendar .dx-datebox-container-cell {\r\n    margin-right: 15px;\r\n    margin-bottom: 15px;\r\n}\r\n.dx-datebox-wrapper-calendar.dx-datebox-wrapper-datetime .dx-calendar {\r\n    margin-right: 7.5px;\r\n    margin-bottom: 7.5px;\r\n}\r\n.dx-datebox-wrapper-calendar.dx-datebox-wrapper-datetime .dx-timeview {\r\n    margin: 15px 15px 7.5px 7.5px;\r\n}\r\n.dx-datebox-adaptivity-mode.dx-datebox-wrapper-calendar.dx-datebox-wrapper-datetime .dx-timeview {\r\n    margin: 0 7.5px 7.5px;\r\n}\r\n.dx-datebox-wrapper-calendar.dx-datebox-wrapper-datetime .dx-datebox-container-cell {\r\n    margin-top: -1px;\r\n    margin-right: 15px;\r\n}\r\n@media (max-width: 320px) {\r\n    .dx-datebox-wrapper-calendar .dx-calendar {\r\n        margin: 15px;\r\n    }\r\n}\r\n.dx-rtl .dx-datebox-wrapper .dx-popup-bottom .dx-toolbar-button + .dx-toolbar-button .dx-button {\r\n    margin-right: 5px;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-datebox-wrapper-calendar.dx-datebox-wrapper-datetime .dx-calendar {\r\n    margin-left: 7.5px;\r\n    margin-right: 15px;\r\n}\r\n.dx-rtl .dx-datebox-wrapper-calendar.dx-datebox-wrapper-datetime .dx-timeview {\r\n    margin-right: 7.5px;\r\n    margin-left: 15px;\r\n}\r\n.dx-datebox-list .dx-dropdowneditor-icon {\r\n    font: 14px/1 DXIcons;\r\n    width: 22px;\r\n    height: 100%;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    -webkit-border-radius: -1px;\r\n    -moz-border-radius: -1px;\r\n    -ms-border-radius: -1px;\r\n    -o-border-radius: -1px;\r\n    border-radius: -1px;\r\n}\r\n.dx-datebox-list .dx-dropdowneditor-icon:before {\r\n    content: '\\F01D';\r\n}\r\n.dx-datebox-list .dx-dropdowneditor-icon:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-datebox-wrapper-list .dx-popup-content {\r\n    padding: 0px;\r\n}\r\n.dx-datebox input[type='date'] {\r\n    line-height: normal;\r\n}\r\n.dx-device-ios .dx-datebox.dx-texteditor-empty .dx-texteditor-input {\r\n    min-height: 23px;\r\n}\r\n.dx-dateview-rollers {\r\n    width: auto;\r\n    text-align: center;\r\n    display: block;\r\n}\r\n.dx-dateviewroller-current .dx-dateview-item {\r\n    -webkit-transition: font-size .2s ease-out;\r\n    -moz-transition: font-size .2s ease-out;\r\n    -o-transition: font-size .2s ease-out;\r\n    transition: font-size .2s ease-out;\r\n}\r\n.dx-dateviewroller {\r\n    min-width: 4em;\r\n    text-align: center;\r\n    display: inline-block;\r\n}\r\n.dx-dateviewroller .dx-button {\r\n    display: none;\r\n}\r\n.dx-dateviewroller .dx-scrollable-content:before,\r\n.dx-dateviewroller .dx-scrollable-content:after {\r\n    content: '';\r\n    height: 59px;\r\n    display: block;\r\n}\r\n.dx-dateviewroller .dx-scrollable-container {\r\n    height: 152px;\r\n}\r\n.dx-dateviewroller.dx-dateviewroller-year {\r\n    min-width: 4.85em;\r\n}\r\n.dx-dateviewroller.dx-state-active .dx-button {\r\n    display: none;\r\n}\r\n.dx-dateviewroller-month {\r\n    min-width: 12em;\r\n}\r\n.dx-dateviewroller-hours:after {\r\n    content: ':';\r\n    font-size: 2.2em;\r\n    position: absolute;\r\n    right: -9%;\r\n    font-weight: bold;\r\n    top: 37%;\r\n    color: #333;\r\n}\r\n.dx-dateviewroller-hours .dx-dateview-item-selected-frame {\r\n    padding-left: 20%;\r\n}\r\n.dx-dateviewroller-minutes .dx-dateview-item-selected-frame {\r\n    width: 80%;\r\n}\r\n.dx-dateview-item {\r\n    height: 34px;\r\n    line-height: 34px;\r\n    text-align: center;\r\n    font-size: 1.3em;\r\n    color: #333;\r\n}\r\n.dx-dateview-item-selected {\r\n    font-size: 2.2em;\r\n}\r\n.dx-rtl.dx-dateviewroller-hours:after {\r\n    left: -9%;\r\n    right: auto;\r\n}\r\n.dx-dateview-item-selected-frame {\r\n    position: absolute;\r\n    top: 59px;\r\n    width: 100%;\r\n}\r\n.dx-dateview-item-selected-frame:before,\r\n.dx-dateview-item-selected-frame:after {\r\n    -webkit-backface-visibility: hidden;\r\n    -moz-backface-visibility: hidden;\r\n    -ms-backface-visibility: hidden;\r\n    backface-visibility: hidden;\r\n    content: '';\r\n    display: block;\r\n    width: 100%;\r\n    position: absolute;\r\n    height: 59px;\r\n}\r\n.dx-dateview-item-selected-frame:before {\r\n    top: -59px;\r\n    border-bottom: 1px solid #ddd;\r\n    background-repeat: no-repeat;\r\n    background-image: -webkit-linear-gradient(bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 60%);\r\n    background-image: -moz-linear-gradient(bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 60%);\r\n    background-image: -ms-linear-gradient(bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 60%);\r\n    background-image: -o-linear-gradient(bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 60%);\r\n}\r\n.dx-dateview-item-selected-frame:after {\r\n    top: 34px;\r\n    border-top: 1px solid #ddd;\r\n    background-repeat: no-repeat;\r\n    background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 60%);\r\n    background-image: -moz-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 60%);\r\n    background-image: -ms-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 60%);\r\n    background-image: -o-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 60%);\r\n}\r\n.dx-device-tablet .dx-dateview-rollers,\r\n.dx-device-phone .dx-dateview-rollers {\r\n    display: -webkit-box;\r\n    display: -webkit-flex;\r\n    display: -moz-flex;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-flex-flow: row nowrap;\r\n    -moz-flex-flow: row nowrap;\r\n    -ms-flex-direction: row;\r\n    -ms-flex-wrap: nowrap;\r\n    -ms-flex-flow: row nowrap;\r\n    flex-flow: row nowrap;\r\n}\r\n.dx-device-tablet .dx-dateviewroller-month,\r\n.dx-device-phone .dx-dateviewroller-month {\r\n    min-width: 4em;\r\n}\r\n.dx-device-tablet .dx-dateview-item,\r\n.dx-device-phone .dx-dateview-item {\r\n    font-size: 1.1em;\r\n}\r\n.dx-device-tablet .dx-dateview-item-selected,\r\n.dx-device-phone .dx-dateview-item-selected {\r\n    font-size: 1.4em;\r\n}\r\n.dx-toolbar {\r\n    background-color: #fff;\r\n    color: #333;\r\n    padding: 0;\r\n    overflow: visible;\r\n}\r\n.dx-toolbar .dx-toolbar-before {\r\n    padding-right: 15px;\r\n}\r\n.dx-rtl .dx-toolbar .dx-toolbar-before {\r\n    padding-right: 0;\r\n    padding-left: 15px;\r\n}\r\n.dx-toolbar .dx-toolbar-after {\r\n    padding-left: 15px;\r\n}\r\n.dx-rtl .dx-toolbar .dx-toolbar-after {\r\n    padding-left: 0;\r\n    padding-right: 15px;\r\n}\r\n.dx-toolbar .dx-toolbar-before:empty,\r\n.dx-toolbar .dx-toolbar-after:empty {\r\n    padding: 0;\r\n}\r\n.dx-toolbar .dx-toolbar-items-container {\r\n    height: 26px;\r\n    overflow: visible;\r\n}\r\n.dx-toolbar .dx-toolbar-menu-container {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-rtl .dx-toolbar .dx-toolbar-menu-container {\r\n    padding: 0 5px 0 0;\r\n}\r\n.dx-toolbar .dx-toolbar-item {\r\n    padding: 0 5px 0 0;\r\n}\r\n.dx-toolbar .dx-toolbar-item.dx-toolbar-first-in-group {\r\n    padding-left: 20px;\r\n}\r\n.dx-toolbar .dx-toolbar-item:last-child {\r\n    padding: 0;\r\n}\r\n.dx-rtl .dx-toolbar .dx-toolbar-item {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-rtl .dx-toolbar .dx-toolbar-item:last-child {\r\n    padding: 0;\r\n}\r\n.dx-toolbar .dx-toolbar-label {\r\n    font-size: 18px;\r\n}\r\n.dx-device-mobile .dx-toolbar {\r\n    padding: 0;\r\n    overflow: visible;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-before {\r\n    padding-right: 15px;\r\n}\r\n.dx-rtl .dx-device-mobile .dx-toolbar .dx-toolbar-before {\r\n    padding-right: 0;\r\n    padding-left: 15px;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-after {\r\n    padding-left: 15px;\r\n}\r\n.dx-rtl .dx-device-mobile .dx-toolbar .dx-toolbar-after {\r\n    padding-left: 0;\r\n    padding-right: 15px;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-before:empty,\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-after:empty {\r\n    padding: 0;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-items-container {\r\n    height: 36px;\r\n    overflow: visible;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-menu-container {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-rtl .dx-device-mobile .dx-toolbar .dx-toolbar-menu-container {\r\n    padding: 0 5px 0 0;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-item {\r\n    padding: 0 5px 0 0;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-item.dx-toolbar-first-in-group {\r\n    padding-left: 20px;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-item:last-child {\r\n    padding: 0;\r\n}\r\n.dx-rtl .dx-device-mobile .dx-toolbar .dx-toolbar-item {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-rtl .dx-device-mobile .dx-toolbar .dx-toolbar-item:last-child {\r\n    padding: 0;\r\n}\r\n.dx-device-mobile .dx-toolbar .dx-toolbar-label {\r\n    font-size: 20px;\r\n}\r\n.dx-toolbar.dx-state-disabled {\r\n    opacity: 1;\r\n}\r\n.dx-toolbar-after .dx-toolbar-item {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-toolbar-after .dx-toolbar-item:last-child {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-toolbar-after .dx-toolbar-item:first-child {\r\n    padding: 0;\r\n}\r\n.dx-rtl .dx-toolbar-after .dx-toolbar-item:first-child {\r\n    padding-left: 5px;\r\n}\r\n.dx-device-mobile .dx-toolbar-after .dx-toolbar-item {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-device-mobile .dx-toolbar-after .dx-toolbar-item:last-child {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-device-mobile .dx-toolbar-after .dx-toolbar-item:first-child {\r\n    padding: 0;\r\n}\r\n.dx-rtl .dx-device-mobile .dx-toolbar-after .dx-toolbar-item:first-child {\r\n    padding-left: 5px;\r\n}\r\n.dx-toolbar-background {\r\n    background-color: #fff;\r\n}\r\n.dx-toolbar-menu-section {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-toolbar-menu-section .dx-toolbar-hidden-button .dx-list-item-content {\r\n    padding: 0;\r\n}\r\n.dx-toolbar-menu-section .dx-button-content {\r\n    padding: 4px;\r\n}\r\n.dx-toolbar-menu-section .dx-toolbar-item-auto-hide {\r\n    padding: 5px 10px;\r\n}\r\n.dx-toolbar-text-auto-hide .dx-button .dx-button-content {\r\n    padding: 5px;\r\n}\r\n.dx-toolbar-text-auto-hide .dx-button .dx-icon {\r\n    color: #333;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n}\r\n.dx-rtl .dx-toolbar-text-auto-hide .dx-button .dx-icon,\r\n.dx-rtl.dx-toolbar-text-auto-hide .dx-button .dx-icon {\r\n    margin-left: 0;\r\n    margin-right: 0;\r\n}\r\n.dx-toolbar .dx-tab {\r\n    padding: 4px;\r\n}\r\n.dx-tile {\r\n    color: #333;\r\n    background-color: #fff;\r\n    border: 1px solid rgba(221, 221, 221, 0.6);\r\n    text-align: left;\r\n}\r\n.dx-tile.dx-state-focused,\r\n.dx-tile.dx-state-hover {\r\n    background-color: #fff;\r\n    border-color: rgba(51, 122, 183, 0.4);\r\n}\r\n.dx-tile.dx-state-active {\r\n    background-color: rgba(96, 96, 96, 0.2);\r\n    color: #333;\r\n    border-color: transparent;\r\n}\r\n.dx-overlay-shader {\r\n    background-color: rgba(255, 255, 255, 0.8);\r\n}\r\n.dx-overlay-wrapper {\r\n    color: #333;\r\n    font-weight: normal;\r\n    font-size: 12px;\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-overlay-wrapper input,\r\n.dx-overlay-wrapper textarea {\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-popup-wrapper .dx-state-focused.dx-overlay-content {\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-toast-content {\r\n    color: #fff;\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    line-height: 25px;\r\n    padding: 5px;\r\n    -webkit-box-shadow: 0px 2px 3px 0px transparent;\r\n    -moz-box-shadow: 0px 2px 3px 0px transparent;\r\n    box-shadow: 0px 2px 3px 0px transparent;\r\n    -webkit-border-radius: 2px;\r\n    -moz-border-radius: 2px;\r\n    -ms-border-radius: 2px;\r\n    -o-border-radius: 2px;\r\n    border-radius: 2px;\r\n}\r\n.dx-toast-icon {\r\n    width: 25px;\r\n    height: 25px;\r\n}\r\n.dx-toast-info {\r\n    background-color: #337ab7;\r\n}\r\n.dx-toast-info .dx-toast-icon {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAQAAAC00HvSAAABoklEQVRIx63WPUvDQBjA8QMFsZNLlgpxtINjBsFVqINghm4dRAe/Rpdm6UcQHERwUYdAJ8HvkKHEQdrPEBQUrf7PoabtveSSSrit3PPjeve8RCCsyyMkIiYlAzJSYiJCPPt+248BfRKkdSX0CcoZnx7jAiJfY3r4LqbNsITI15B2EdNlVBGRSEZ0bUyXyQqIRDJZQIu/M1oRmZ2ovcz4zjt558NxR/6C6Vk2fHLPOXtsIhA0aHHGA1/Gvl7OBMYT/3BF05poTS5Be/5gxvQ15JWjgtyerWPelP19hMDTMvabQyciEJwoJ0rwBKF2lutSRCC4UWJCQaQx+5WYAyUmEsQas1WJ2VJiYkGqMTuVmG0lJhVkGnNaiblQYjKhZYHkmY1SpMGLEoN5Gskt605kjTstIjPvRiJ50tuSksePxv7UfKm8HAe0DGKXgZbB85eKHLWdKkjHUpjzvAmdHaUKIgnNmrIzLiTBs1W4ybiQvwq39RuV6TB1jpvA1f1yxo0sdT9XLy5DlF5cPBmmq0yG2uZUbVOzthle2xdFbd83//za+gXw/JH9LjmoAgAAAABJRU5ErkJggg==);\r\n}\r\n.dx-toast-message {\r\n    line-height: 16px;\r\n}\r\n.dx-toast-warning {\r\n    background-color: #f0ad4e;\r\n}\r\n.dx-toast-warning .dx-toast-icon {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAQAAAC00HvSAAABJklEQVRIx62WvW2EQBBGpwlSArdgSrBESuKIQhySLJJbcAuXrXTZteCAAG3GlWBRwVsHB+Ykw8zeafVlaPSY/1lBdlXQ0OMJzMBMwNPTUOzb732scAzEXQ04KhtT0jEdIFZNdJQapuZsIFadqY8wLWMiJBIZafcwLdcHIJHIdQNt4YwPQm4e1feYMjkn/3NUbpjuSUgk0q2YSinx5xL0SSl/dcM45V8r5qLYOEQoDjs2FTNQCI0a+deC+VatGqFPwugD0gs+A8YLQTW4LJgf1SoIcxJG751ZIAMGy5sp1ZuQgHkxMMGqVJq81Tdp6q0unnhFeDMK3lgz9b6k+MOaKX3CUzDO3jd2UH/7JtP2y7aLM12GbHcq29XMdsOzvSiyvW+efG39AmPXSbHWZjgLAAAAAElFTkSuQmCC);\r\n}\r\n.dx-toast-error {\r\n    background-color: #d9534f;\r\n}\r\n.dx-toast-error .dx-toast-icon {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAQAAAC00HvSAAABeklEQVRIx62WMWrDQBBFx01I5zQinQ5hdINA3Kp3mUNEnSBIdwgEcgeBC18gVRojjDr7BklUxAE3b1NYihVrdmWbZbpl9FjN/zOzgqgREJNTUFEDNRUFOTGBnq8dRmQsMWosyYiGMSEpawuijTUpoQszZT6AaGPO1IaZsToRYjCsmGmYGZszIAbD5gA6/M7qTMj+RtMuJjy5Jv0ahQdMeiHEYEhbTKRK/KN+9K3IH+0xmZK+4Jb33mnChM/eaYYIgeLYBdcI4yNQgiBM+Oo5OxBi5S5l0ztdUNJoGrPr5cdCrtbgGOSCGHKhsCjQBbkhhkKorFK2oKsBiKESaocnys58sUMMtYDTXA8NZMSbIwv3bZJO/48VH3VuY6/NYwO4V+Tv1aYYgMTsVB8dKZUPQmyG/OcbzcUvijot6IYPzcVaT225UyQuCRjxrGyLwNbhW54Un5S8KrmZa96cGn/zxtP08zaLPW0Gb3vK29b0tsO9vSi8vW8ufG39AnvvGenmMu5AAAAAAElFTkSuQmCC);\r\n}\r\n.dx-toast-success {\r\n    background-color: #5cb85c;\r\n}\r\n.dx-toast-success .dx-toast-icon {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAQAAAC00HvSAAABlklEQVRIx62Wv0rDUBSHTxE6uHTKGhDEzS2jg4vUMeBmX8BR8AFiJQEfwck3cAh2cxBcXEup3VoHF3UxS1FBvuvQhPy5N0lTwplyknz33HN+95wriNEsXAJCZkRAxIyQABfL/L3J6eAzRhltjI9Tj7HxmJcgEpvjYVdh+oxqEImN6JdhBkzXhCgUUwYmzIBFA4hCsUhB6XamDSGriPpZjL12TvQc2SnG2xCiUHgJxqktcdbe+SmU31lh/AaQJQ4HfOR8PiJYpYrVDU4RhD1+c8q2BLdBLNdxXW8KflcI1obcs4UgnGlvAiE0/DDhW/O90EMQDnMbWlkozDTnMz2OC6AvdhGEHT4Ny86EqOB6i1fNgv44QhC2mRi3Gwlozqs4kSnoHEHocFdWQT0ahWKYA93GT5elyY9MucmDHukiCCeGuDO5CUteJaAOgrDPskIKYZVuhpkG/1qpqKBaxRcIQpeHGmG6dWfKM0hfnxZW/Ql/qj0k/ib9Rh83Tqvdr7Ve3NJkaG1OtTY1W5vhrd0oWrvfbHjb+gdn1DPEHv9HmQAAAABJRU5ErkJggg==);\r\n}\r\n.dx-popup-wrapper > .dx-overlay-content {\r\n    border: 1px solid #ddd;\r\n    background: #fff;\r\n    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\r\n    -moz-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\r\n    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\r\n    -webkit-border-radius: 2px;\r\n    -moz-border-radius: 2px;\r\n    -ms-border-radius: 2px;\r\n    -o-border-radius: 2px;\r\n    border-radius: 2px;\r\n}\r\n.dx-popup-wrapper > .dx-popup-fullscreen {\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n}\r\n.dx-popup-title {\r\n    position: relative;\r\n    padding: 2px 10px;\r\n    min-height: 28px;\r\n    border-bottom: 1px solid #ddd;\r\n    background: transparent;\r\n    color: #333;\r\n}\r\n.dx-popup-title.dx-toolbar {\r\n    padding: 2px 10px;\r\n    overflow: visible;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-before {\r\n    padding-right: 15px;\r\n}\r\n.dx-rtl .dx-popup-title.dx-toolbar .dx-toolbar-before {\r\n    padding-right: 0;\r\n    padding-left: 15px;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-after {\r\n    padding-left: 15px;\r\n}\r\n.dx-rtl .dx-popup-title.dx-toolbar .dx-toolbar-after {\r\n    padding-left: 0;\r\n    padding-right: 15px;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-before:empty,\r\n.dx-popup-title.dx-toolbar .dx-toolbar-after:empty {\r\n    padding: 0;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-items-container {\r\n    height: 26px;\r\n    overflow: visible;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-menu-container {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-rtl .dx-popup-title.dx-toolbar .dx-toolbar-menu-container {\r\n    padding: 0 5px 0 0;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-item {\r\n    padding: 0 5px 0 0;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-item.dx-toolbar-first-in-group {\r\n    padding-left: 20px;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-item:last-child {\r\n    padding: 0;\r\n}\r\n.dx-rtl .dx-popup-title.dx-toolbar .dx-toolbar-item {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-rtl .dx-popup-title.dx-toolbar .dx-toolbar-item:last-child {\r\n    padding: 0;\r\n}\r\n.dx-popup-title.dx-toolbar .dx-toolbar-label {\r\n    font-size: 18px;\r\n}\r\n.dx-popup-title .dx-closebutton {\r\n    display: block;\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n    -webkit-box-shadow: 0 1px 2px transparent;\r\n    -moz-box-shadow: 0 1px 2px transparent;\r\n    box-shadow: 0 1px 2px transparent;\r\n    border-width: 1px;\r\n    border-style: solid;\r\n    background-color: #fff;\r\n    border-color: #ddd;\r\n    color: #333;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n    background: transparent;\r\n    border-color: transparent;\r\n    width: 19px;\r\n    height: 19px;\r\n    margin: 0 -4px 0 4px;\r\n}\r\n.dx-popup-title .dx-closebutton .dx-button-content {\r\n    padding: 0;\r\n}\r\n.dx-popup-title .dx-closebutton .dx-icon {\r\n    -webkit-box-sizing: border-box;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n}\r\n.dx-popup-title .dx-closebutton.dx-state-hover {\r\n    -webkit-box-shadow: 0 1px 2px transparent;\r\n    -moz-box-shadow: 0 1px 2px transparent;\r\n    box-shadow: 0 1px 2px transparent;\r\n}\r\n.dx-popup-title .dx-closebutton.dx-state-focused {\r\n    -webkit-box-shadow: 0 1px 2px transparent;\r\n    -moz-box-shadow: 0 1px 2px transparent;\r\n    box-shadow: 0 1px 2px transparent;\r\n}\r\n.dx-popup-title .dx-closebutton.dx-state-active {\r\n    -webkit-box-shadow: 0 1px 2px transparent;\r\n    -moz-box-shadow: 0 1px 2px transparent;\r\n    box-shadow: 0 1px 2px transparent;\r\n}\r\n.dx-state-disabled.dx-popup-title .dx-closebutton .dx-icon,\r\n.dx-state-disabled .dx-popup-title .dx-closebutton .dx-icon {\r\n    opacity: 0.6;\r\n}\r\n.dx-state-disabled.dx-popup-title .dx-closebutton .dx-button-text,\r\n.dx-state-disabled .dx-popup-title .dx-closebutton .dx-button-text {\r\n    opacity: 0.5;\r\n}\r\n.dx-popup-title .dx-closebutton .dx-icon {\r\n    color: #333;\r\n}\r\n.dx-popup-title .dx-closebutton.dx-state-hover {\r\n    background-color: #e6e6e6;\r\n    border-color: #bebebe;\r\n}\r\n.dx-popup-title .dx-closebutton.dx-state-focused {\r\n    background-color: #e6e6e6;\r\n    border-color: #9d9d9d;\r\n}\r\n.dx-popup-title .dx-closebutton.dx-state-active {\r\n    background-color: #d4d4d4;\r\n    border-color: #9d9d9d;\r\n    color: #333;\r\n}\r\n.dx-rtl .dx-popup-title .dx-closebutton {\r\n    margin: 0 4px 0 -4px;\r\n}\r\n.dx-popup-title .dx-closebutton .dx-icon {\r\n    width: 17px;\r\n    height: 17px;\r\n    background-position: 3px 3px;\r\n    -webkit-background-size: 11px 11px;\r\n    -moz-background-size: 11px 11px;\r\n    background-size: 11px 11px;\r\n    padding: 3px;\r\n    font-size: 11px;\r\n    text-align: center;\r\n    line-height: 11px;\r\n}\r\n.dx-device-mobile .dx-popup-title .dx-closebutton {\r\n    width: 37px;\r\n    height: 37px;\r\n    margin: 0 -11px 0 11px;\r\n}\r\n.dx-rtl .dx-device-mobile .dx-popup-title .dx-closebutton {\r\n    margin: 0 11px 0 -11px;\r\n}\r\n.dx-device-mobile .dx-popup-title .dx-closebutton .dx-icon {\r\n    width: 35px;\r\n    height: 35px;\r\n    background-position: 10px 10px;\r\n    -webkit-background-size: 15px 15px;\r\n    -moz-background-size: 15px 15px;\r\n    background-size: 15px 15px;\r\n    padding: 10px;\r\n    font-size: 15px;\r\n    text-align: center;\r\n    line-height: 15px;\r\n}\r\n.dx-popup-content {\r\n    padding: 10px;\r\n}\r\n.dx-popup-content > .dx-button {\r\n    margin: 0 5px;\r\n}\r\n.dx-popup-bottom {\r\n    background: transparent;\r\n    color: #333;\r\n}\r\n.dx-popup-bottom.dx-toolbar {\r\n    padding: 10px;\r\n    overflow: visible;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-before {\r\n    padding-right: 15px;\r\n}\r\n.dx-rtl .dx-popup-bottom.dx-toolbar .dx-toolbar-before {\r\n    padding-right: 0;\r\n    padding-left: 15px;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-after {\r\n    padding-left: 15px;\r\n}\r\n.dx-rtl .dx-popup-bottom.dx-toolbar .dx-toolbar-after {\r\n    padding-left: 0;\r\n    padding-right: 15px;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-before:empty,\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-after:empty {\r\n    padding: 0;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-items-container {\r\n    height: 26px;\r\n    overflow: visible;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-menu-container {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-rtl .dx-popup-bottom.dx-toolbar .dx-toolbar-menu-container {\r\n    padding: 0 5px 0 0;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-item {\r\n    padding: 0 5px 0 0;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-item.dx-toolbar-first-in-group {\r\n    padding-left: 20px;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-item:last-child {\r\n    padding: 0;\r\n}\r\n.dx-rtl .dx-popup-bottom.dx-toolbar .dx-toolbar-item {\r\n    padding: 0 0 0 5px;\r\n}\r\n.dx-rtl .dx-popup-bottom.dx-toolbar .dx-toolbar-item:last-child {\r\n    padding: 0;\r\n}\r\n.dx-popup-bottom.dx-toolbar .dx-toolbar-label {\r\n    font-size: 18px;\r\n}\r\n.dx-popup-bottom .dx-button {\r\n    min-width: 100px;\r\n}\r\n.dx-popup-content.dx-dialog-content {\r\n    min-width: 220px;\r\n    padding: 10px;\r\n}\r\n.dx-dialog-message {\r\n    padding: 0;\r\n}\r\n.dx-popover-wrapper.dx-position-bottom .dx-popover-arrow:after {\r\n    background: #fff;\r\n}\r\n.dx-popover-wrapper .dx-popup-title {\r\n    margin: 0;\r\n}\r\n.dx-popover-wrapper .dx-popup-title.dx-toolbar {\r\n    padding-left: 15px;\r\n}\r\n.dx-popover-wrapper .dx-popover-arrow:after,\r\n.dx-popover-wrapper.dx-popover-without-title .dx-popover-arrow:after {\r\n    background: #fff;\r\n}\r\n.dx-popover-arrow:after {\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-popover-wrapper .dx-rtl.dx-popup-title.dx-toolbar {\r\n    padding-right: 15px;\r\n    padding-left: 0;\r\n}\r\n.dx-progressbar-container {\r\n    height: 6px;\r\n    border: 1px solid #ddd;\r\n    background-color: #dddddd;\r\n    -webkit-border-radius: 2px;\r\n    -moz-border-radius: 2px;\r\n    -ms-border-radius: 2px;\r\n    -o-border-radius: 2px;\r\n    border-radius: 2px;\r\n}\r\n.dx-progressbar-range {\r\n    position: relative;\r\n    border: 1px solid #337ab7;\r\n    background-color: #337ab7;\r\n    margin-top: -1px;\r\n    -webkit-box-sizing: content-box;\r\n    -moz-box-sizing: content-box;\r\n    box-sizing: content-box;\r\n    -webkit-border-top-left-radius: 2px;\r\n    -moz-border-top-left-radius: 2px;\r\n    border-top-left-radius: 2px;\r\n    -webkit-border-bottom-left-radius: 2px;\r\n    -moz-border-bottom-left-radius: 2px;\r\n    border-bottom-left-radius: 2px;\r\n}\r\n.dx-progressbar-animating-container {\r\n    height: 6px;\r\n    background-color: #dddddd;\r\n    background-size: 90% 5px;\r\n    border: 1px solid #ddd;\r\n    -webkit-border-radius: 2px;\r\n    -moz-border-radius: 2px;\r\n    -ms-border-radius: 2px;\r\n    -o-border-radius: 2px;\r\n    border-radius: 2px;\r\n    -webkit-animation: loader 2s linear infinite;\r\n    -moz-animation: loader 2s linear infinite;\r\n    -o-animation: loader 2s linear infinite;\r\n    animation: loader 2s linear infinite;\r\n    background-repeat: no-repeat;\r\n    background-image: -webkit-linear-gradient(left, transparent 5%, #337ab7, transparent 95%);\r\n    background-image: -moz-linear-gradient(left, transparent 5%, #337ab7, transparent 95%);\r\n    background-image: -ms-linear-gradient(left, transparent 5%, #337ab7, transparent 95%);\r\n    background-image: -o-linear-gradient(left, transparent 5%, #337ab7, transparent 95%);\r\n    background-repeat: repeat;\r\n}\r\n.dx-state-disabled .dx-progressbar-range {\r\n    background-color: rgba(51, 122, 183, 0.6);\r\n}\r\n.dx-state-disabled .dx-progressbar-animating-container {\r\n    -webkit-animation: none;\r\n    -moz-animation: none;\r\n    -o-animation: none;\r\n    animation: none;\r\n    background-position-x: 45%;\r\n}\r\n.dx-rtl .dx-progressbar .dx-progressbar-animating-container,\r\n.dx-rtl.dx-progressbar .dx-progressbar-animating-container {\r\n    -webkit-animation: loader-rtl 2s linear infinite;\r\n    -moz-animation: loader-rtl 2s linear infinite;\r\n    -o-animation: loader-rtl 2s linear infinite;\r\n    animation: loader-rtl 2s linear infinite;\r\n    background-repeat: no-repeat;\r\n    background-image: -webkit-linear-gradient(left, transparent 5%, #337ab7, transparent 95%);\r\n    background-image: -moz-linear-gradient(left, transparent 5%, #337ab7, transparent 95%);\r\n    background-image: -ms-linear-gradient(left, transparent 5%, #337ab7, transparent 95%);\r\n    background-image: -o-linear-gradient(left, transparent 5%, #337ab7, transparent 95%);\r\n    background-repeat: repeat;\r\n}\r\n@-webkit-keyframes loader {\r\n    0% {\r\n        background-position-x: 0;\r\n    }\r\n    100% {\r\n        background-position-x: 900%;\r\n    }\r\n}\r\n@-moz-keyframes loader {\r\n    0% {\r\n        background-position-x: 0;\r\n    }\r\n    100% {\r\n        background-position-x: 900%;\r\n    }\r\n}\r\n@keyframes loader {\r\n    0% {\r\n        background-position-x: 0;\r\n    }\r\n    100% {\r\n        background-position-x: 900%;\r\n    }\r\n}\r\n@-ms-keyframes loader {\r\n    0% {\r\n        background-position-x: 0;\r\n    }\r\n    100% {\r\n        background-position-x: 900%;\r\n    }\r\n}\r\n@-webkit-keyframes loader-rtl {\r\n    0% {\r\n        background-position-x: 0;\r\n    }\r\n    100% {\r\n        background-position-x: -900%;\r\n    }\r\n}\r\n@-moz-keyframes loader-rtl {\r\n    0% {\r\n        background-position-x: 0;\r\n    }\r\n    100% {\r\n        background-position-x: -900%;\r\n    }\r\n}\r\n@keyframes loader-rtl {\r\n    0% {\r\n        background-position-x: 0;\r\n    }\r\n    100% {\r\n        background-position-x: -900%;\r\n    }\r\n}\r\n@-ms-keyframes loader-rtl {\r\n    0% {\r\n        background-position-x: 0;\r\n    }\r\n    100% {\r\n        background-position-x: -900%;\r\n    }\r\n}\r\n.dx-tooltip-wrapper .dx-overlay-content {\r\n    border: 1px solid #ddd;\r\n    background-color: #fff;\r\n    color: #333;\r\n    -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r\n    -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n}\r\n.dx-tooltip-wrapper.dx-popover-wrapper .dx-popover-arrow:after {\r\n    border: 1px solid #ddd;\r\n    background: #fff;\r\n}\r\n.dx-slider .dx-tooltip-wrapper .dx-overlay-content {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-slider-wrapper {\r\n    height: 20px;\r\n}\r\n.dx-slider-bar {\r\n    margin: 10px 4.5px;\r\n    height: 2px;\r\n    background: #ddd;\r\n    -webkit-border-radius: 2px;\r\n    -moz-border-radius: 2px;\r\n    -ms-border-radius: 2px;\r\n    -o-border-radius: 2px;\r\n    border-radius: 2px;\r\n}\r\n.dx-slider-range {\r\n    border: 1px solid transparent;\r\n    height: 0px;\r\n    -webkit-box-sizing: content-box;\r\n    -moz-box-sizing: content-box;\r\n    box-sizing: content-box;\r\n}\r\n.dx-slider-range.dx-slider-range-visible {\r\n    border: 1px solid #337ab7;\r\n    background: #337ab7;\r\n    -webkit-border-radius: 2px;\r\n    -moz-border-radius: 2px;\r\n    -ms-border-radius: 2px;\r\n    -o-border-radius: 2px;\r\n    border-radius: 2px;\r\n}\r\n.dx-slider-label-position-bottom .dx-slider-label {\r\n    bottom: -17px;\r\n}\r\n.dx-slider-label-position-top .dx-slider-label {\r\n    top: -14px;\r\n}\r\n.dx-slider-handle {\r\n    margin-top: -10px;\r\n    margin-right: -4.5px;\r\n    width: 9px;\r\n    height: 20px;\r\n    border: 1px solid #fff;\r\n    background-color: #337ab7;\r\n    -webkit-border-radius: -1px;\r\n    -moz-border-radius: -1px;\r\n    -ms-border-radius: -1px;\r\n    -o-border-radius: -1px;\r\n    border-radius: -1px;\r\n    -webkit-box-sizing: content-box;\r\n    -moz-box-sizing: content-box;\r\n    box-sizing: content-box;\r\n}\r\n.dx-state-disabled .dx-slider,\r\n.dx-state-disabled.dx-slider {\r\n    opacity: 1;\r\n}\r\n.dx-state-disabled .dx-slider .dx-slider-bar,\r\n.dx-state-disabled.dx-slider .dx-slider-bar {\r\n    opacity: .5;\r\n}\r\n.dx-state-active.dx-slider-handle {\r\n    border: 1px solid #fff;\r\n    background: #204d73;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-state-focused.dx-slider-handle:not(.dx-state-active) {\r\n    border: 1px solid #fff;\r\n    background: #285f8f;\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-state-hover.dx-slider-handle:not(.dx-state-active) {\r\n    border: 1px solid #fff;\r\n    background: #285f8f;\r\n}\r\n.dx-rtl .dx-slider-handle {\r\n    margin-left: -5px;\r\n}\r\n.dx-rangeslider-start-handle {\r\n    margin-left: -7px;\r\n}\r\n.dx-rtl .dx-rangeslider-start-handle {\r\n    margin-right: -7px;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev,\r\n.dx-gallery .dx-gallery-nav-button-next {\r\n    position: absolute;\r\n    top: 0;\r\n    width: 34%;\r\n    height: 100%;\r\n    background: #fff;\r\n    background: transparent;\r\n    cursor: pointer;\r\n    font-size: 32px;\r\n    text-align: center;\r\n    line-height: 32px;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev.dx-state-hover:after,\r\n.dx-gallery .dx-gallery-nav-button-next.dx-state-hover:after {\r\n    background-color: rgba(51, 122, 183, 0.5);\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev.dx-state-active:after,\r\n.dx-gallery .dx-gallery-nav-button-next.dx-state-active:after {\r\n    background-color: rgba(51, 122, 183, 0.7);\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev:before,\r\n.dx-gallery .dx-gallery-nav-button-next:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 32px;\r\n    top: 50%;\r\n    margin-top: -16px;\r\n    left: 50%;\r\n    margin-left: -16px;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev:after,\r\n.dx-gallery .dx-gallery-nav-button-next:after {\r\n    content: '';\r\n    position: absolute;\r\n    width: 32px;\r\n    height: 100%;\r\n    -webkit-border-radius: -4px;\r\n    -moz-border-radius: -4px;\r\n    -ms-border-radius: -4px;\r\n    -o-border-radius: -4px;\r\n    border-radius: -4px;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev:before,\r\n.dx-gallery .dx-gallery-nav-button-next:before {\r\n    position: absolute;\r\n    z-index: 10;\r\n    clear: both;\r\n    font-size: 32px;\r\n    color: #fff;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev:before {\r\n    content: '\\F012';\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev:after {\r\n    left: 0;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-prev:before {\r\n    left: 0;\r\n    right: auto;\r\n    margin-left: 0;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-next {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-next:before {\r\n    content: '\\F010';\r\n}\r\n.dx-gallery .dx-gallery-nav-button-next:after {\r\n    right: 0;\r\n}\r\n.dx-gallery .dx-gallery-nav-button-next:before {\r\n    right: 0;\r\n    left: auto;\r\n}\r\n.dx-gallery-indicator {\r\n    pointer-events: none;\r\n    text-align: center;\r\n}\r\n.dx-gallery-indicator-item {\r\n    -webkit-border-radius: 50%;\r\n    -moz-border-radius: 50%;\r\n    -ms-border-radius: 50%;\r\n    -o-border-radius: 50%;\r\n    border-radius: 50%;\r\n    -webkit-box-sizing: border-box;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n    border: 1px solid #337ab7;\r\n    pointer-events: auto;\r\n    margin: 2px 6px;\r\n    width: 6px;\r\n    height: 6px;\r\n    background: #fff;\r\n}\r\n.dx-gallery-indicator-item-active,\r\n.dx-gallery-indicator-item-selected {\r\n    width: 7px;\r\n    height: 7px;\r\n    background: #337ab7;\r\n    border: 2px solid rgba(255, 255, 255, 0.8);\r\n    margin: 1.5px 6px;\r\n}\r\n.dx-state-focused.dx-gallery .dx-gallery-indicator-item-selected {\r\n    background: #22527b;\r\n}\r\n.dx-lookup {\r\n    height: 26px;\r\n    border: 1px solid #ddd;\r\n    background: #fff;\r\n}\r\n.dx-lookup-field {\r\n    padding: 4px 24px 4px 5px;\r\n    font-size: 1em;\r\n}\r\n.dx-rtl .dx-lookup-field {\r\n    padding: 4px 5px 4px 24px;\r\n}\r\n.dx-lookup-arrow {\r\n    font: 14px/1 DXIcons;\r\n    width: 24px;\r\n    color: #333;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-lookup-arrow:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-rtl .dx-lookup-arrow:before {\r\n    content: '\\F04F';\r\n}\r\n.dx-lookup-arrow:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-state-readonly .dx-lookup-field:before {\r\n    opacity: .5;\r\n}\r\n.dx-lookup-popup-wrapper .dx-list-item {\r\n    border-top: none;\r\n}\r\n.dx-lookup-popup-wrapper .dx-list-item:last-of-type {\r\n    border-bottom: none;\r\n}\r\n.dx-lookup-popup-wrapper .dx-list-item-content {\r\n    padding-left: 10px;\r\n    padding-right: 10px;\r\n}\r\n.dx-lookup-popup-wrapper .dx-popup-content {\r\n    top: 0;\r\n    padding: 0;\r\n}\r\n.dx-lookup-popup-wrapper .dx-popup-title + .dx-popup-content {\r\n    top: 36px;\r\n}\r\n.dx-lookup-empty .dx-lookup-field {\r\n    color: #999999;\r\n}\r\n.dx-invalid.dx-lookup .dx-lookup-field:after {\r\n    right: 26px;\r\n    pointer-events: none;\r\n    font-weight: bold;\r\n    background-color: #d9534f;\r\n    color: #fff;\r\n    content: '!';\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -8px;\r\n    width: 16px;\r\n    height: 16px;\r\n    -webkit-border-radius: 50%;\r\n    -moz-border-radius: 50%;\r\n    -ms-border-radius: 50%;\r\n    -o-border-radius: 50%;\r\n    border-radius: 50%;\r\n    text-align: center;\r\n    line-height: 16px;\r\n    font-size: 11px;\r\n}\r\n.dx-rtl .dx-invalid.dx-lookup .dx-lookup-field:after,\r\n.dx-rtl.dx-invalid.dx-lookup .dx-lookup-field:after {\r\n    right: auto;\r\n    left: 26px;\r\n}\r\n.dx-lookup-validation-message {\r\n    font-size: 12px;\r\n    line-height: 12px;\r\n    padding: 7px 10px 10px;\r\n    margin-bottom: 10px;\r\n    margin-left: -10px;\r\n    border-bottom: 1px solid #ddd;\r\n    color: #d9534f;\r\n}\r\n.dx-rtl .dx-lookup-validation-message {\r\n    margin-right: -10px;\r\n    margin-left: 0;\r\n}\r\n.dx-lookup-popup-search .dx-list {\r\n    height: calc(100% - 45px);\r\n}\r\n.dx-lookup-search-wrapper {\r\n    padding: 10px;\r\n    padding-bottom: 4px;\r\n}\r\n.dx-popup-content.dx-lookup-invalid {\r\n    padding-top: 0;\r\n}\r\n.dx-popup-content.dx-lookup-invalid .dx-lookup-validation-message {\r\n    display: inline-block;\r\n}\r\n.dx-popup-content.dx-lookup-invalid .dx-list {\r\n    top: 30px;\r\n}\r\n.dx-lookup-popup-search .dx-popup-content.dx-lookup-invalid .dx-list {\r\n    top: 75px;\r\n}\r\n.dx-actionsheet-container .dx-actionsheet-item {\r\n    margin: 0 0 5px 0;\r\n}\r\n.dx-actionsheet-container .dx-button {\r\n    margin: 0;\r\n}\r\n.dx-button.dx-actionsheet-cancel {\r\n    margin: 0;\r\n}\r\n.dx-loadindicator {\r\n    background-color: transparent;\r\n}\r\n.dx-loadindicator-image {\r\n    background-image: url(data:image/gif;base64,R0lGODlhQABAAKECADI6RTI6Rv///////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQABACwAAAAAQABAAAACkIyPqcvtD6OctEpgs1ag9w1m3heW0Eia6oJi63u08BygNGzfq6ybeV/6AUHCoaZotIySoSXz6HlunNIKsnqKYinUbaTrzabCjyuZoz07wGpW+w2Py+f0uv2VtrPl5ne/zVP3B5hHtxc3eBZoeAiXSLY49wjZSFipFsk36ZWJuMn5idXiwtjpN3qHqhd61wpTAAAh+QQJCQABACwAAAAAQABAAAACk4yPqcvtD6OctNqLs968+w+G4giUI2meYQmoK+t+bBt3c22nuHbvPOzL9IKWIbFiPEqSygiz6XhCG8Cps2qNYrNUkzQ7+1rDW66BrDMf0DT1Gu1GsONvMv0Mv8/1+zi77Zd3Vwc4KGYWNihXRnfIlaiIx+gGGVmp6AiWObY51ek5GZiGGUpZajpKGrnK2ur6CotQAAAh+QQJCQACACwAAAAAQABAAAACoJSPqcvtD6OctNqLs968+w+G4kiW5omm6sq27qsADyDDCd3QuI3ssc7r1W66YRBIRAYNSmZxeWgKntAoIGCVLpXUqnPY9VLDYlzRWJaR01NtFbh+n33e77kunOOz931b7zdHVyeIlqY2ePhnuIUUd+ToBunzaNNV+RKG6UKmgwUVJ8m5JtryWLoSIInK5rfA6BorO0tba3uLm6u7y9ubUAAAIfkECQkAAwAsAAAAAEAAQAAAAqKcj6nL7Q+jnLTai7PevPsPhhwAiCKJmh+aqh1buiMsb3BcY3eu0bzO+mV8wgqxSDkiI8olpOl0BKMSKHUxvWIRWW2CdOh6ueHW+GsQnwcp9bltXpfZcTmdDrbP3WN4Xt9Stxb4Z0eIY5gn+KZYKGfmyPgX2edIqbWYePmYuRbQOQhauRlKOoqoh2eKyScperWTmtZ6ippKyyiru8vb6/t7VQAAIfkECQkAAwAsAAAAAEAAQAAAAp2cj6nL7Q+jnNSBC6reCWMOTp4Xls1ImmqHZuvbuu/aznNt02MO77yK+uk+QpOvWEohQ8clR+ncQKOaKVVEvFazWoq1C+GCI9/x6WL2otMSMfv8bsviljn9dM/rc/Y9ou9nABg4uLcW+Feod4g44Ob3uBiZN3lXRlkZd2nJSJj5tqkZytYE+ZkW5DlqlmrYillKF6N6ylqLetuoK1EAACH5BAkJAAMALAAAAABAAEAAAAKLnI+pB+2+opw0vtuq3hR7wIXi54mmRj7nOqXsK33wHF/0nZT4Ptj87vvdgsIZsfgKqJC0JRPmfL4gUii1yrpiV5ntFOTNhsfksvmMTqvX7Lb7DY/L5/S6/Y7P6/d8BLjeBfg3F0hYKHcYp6WY+BYF9+i46HZEGcmGwViZRmKpg5YySRbaWObieXlSAAAh+QQJCQADACwAAAAAQABAAAACepyPqQnt30ZctFoLs3a3e7aF2UdW4vmUKnKa46pu8Exq9O29+E5B/N/jAIcHIZFoPA4nyqbzCY1Kp9Sq9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+f0uv2Oz+vXAH4fnVQWOJZi5kNmA3WIISOFgkL1KHIlucjV8lMAACH5BAkJAAMALAAAAABAAEAAAAJ3nI+pC+0Plpy0IohztLwbDWbeKIUmRqZiZabe4w5hTG30p926le9+CfkJGY2h8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y4fO8pBPUrcAwZyU6Q0w9G3dLJY+MS4UvVoowUpVAAAIfkECQkAAwAsAAAAAEAAQAAAAn2cj6nL7Q/jALRaK7NGt/sNat4YluJImWqEru5DvnISz/bU3Xqu23wv+wFdwqGqaCwhk5sl81R5rqLSqvWKzWq33K73Cw6Lx+Sy+YxOq9fstvsNj8vn9FBKjUlf8PmzU7yH9gc2+FXoddj1IZi4VVPWYoYCYBYwGUgYWWdSAAAh+QQJCQADACwAAAAAQABAAAACkpyPqcvtD6OctEKAs93c5N+F1AeKpkNq56qkAAsjaUwPc83e+KnvYu/rAIMbEtFkPAqTymKp6VRBK8Pp5WmdYLORLffB/ILD4ga5vDijW9K1GeOOy+f0uv2Oh73ytrbdS6c2BxjoV0cohxgnmGh46DgIGQmXx7io6GaZiYlWNUmJp7nmecnZKXoq+bnHZ9P6ylUAACH5BAkJAAMALAAAAABAAEAAAAKTnI+py+0Po5y02ouz3rz7D3YAEJbHOJomSqog675o/MG0ON8b2+oZ79PYghcgsTg8ToxKCrMpSUIh0qnjab3mso8qV8HbfhFh8XhQTp3J5TU77D614+h5PE2vw+l4vt3ddzdjlucFSOjXk2dguNboiHiotsgYCTlJ+XimOWZ5qbjI+SU6iplpGopKucra6voK+1oAACH5BAkJAAMALAAAAABAAEAAAAKenI+py+0Po5y02ouz3rz7D4biSJbmiabqyrYe4GbAHF8zvNxBndzMjeMdfD2gEEEs0o6GQNJgZA6fUemgWrVin1pitrv8So1i8JVrPQOX6ek62Fav4+45XV4ev+HtPT9NxhYX+AcGg6bng8gUlSe0VXgEOVjlFMnztRhj5wYoptnCiXQZuij4qHmKSXp15/oKGys7S1tre4ubq7urUQAAIfkECQkAAwAsAAAAAEAAQAAAAqKcj6nL7Q+jnLTai7PevPsPhhwAiCJJmiGaqh1buiMsb3BcZ3Sus7zm+2GCwguxSDkiJ6jAsqJ8QqJSB6raaB2uWIaW2h18teEEl1s2t9Dp7ZrcFr9xcXmMHffh23p6vV+HABho0OfHd7WXFnS4iNZYRgTnSAbZBYaomKeZOfmHGQkayjnquUkatkNoh4p1s8pqSilbSpsqGgqru8vb6/srVAAAIfkECQkAAwAsAAAAAEAAQAAAApqcj6nL7Q+jnNSBC6reCmcOUt4Vls+ImWqHrq6Bfu/azm5tq3huevzt+/WCwhKxCDoiOallSOkUNaMbKFUyvUpJ2kq2i+WCJ+Jx2CxFk9VrdkTmtsTndBu8nijjD/r9oI/3tScYCEhndWg4h7hImKjoxhgnyUapNuIH4zhpaYbpt/O4eflZFzMYGnkq2qkVAwn2ito6Rpt5K1EAACH5BAkJAAMALAAAAABAAEAAAAKLnI+pCe2wopxUvgur3hR7DoaDh4lmRWbnOqXsa5XwrMj0bVz4Pj487vvdgsIZsQhzIGnKpVHlZDWjUijV1Li+stqVtQsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7Hf91ceR8+9XbE90dYyDaI6BAAmKimI+iYBtn2UUm5RvLoYpYiqeWJKRYaSBaaqflSAAAh+QQJCQADACwAAAAAQABAAAACeZyPqQrtD5actCaIc7S8Gw1i3iiFpkOmB2hBKpm9sufOdove+pTv/tX4CVeb4bBoTCqXzKbzCY1Kp9Sq9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+f0ut0cLPfEe/CDXOMX6BVDWLh0yBDidNL41GgiBZkoGXGyUwAAIfkECQkAAwAsAAAAAEAAQAAAAnecj6lr4A+YnLQ2iLPdHOUPduICluY4YtuJrlE7lPDsavQ9ffjOqPzvcQCHxKLxiEwql8ym8wmNSqfUqvWKzWq33K73Cw6Lx+Sy+YxOq9fstvsNj8vn9LriEbZ1Q3s+7fXDkoJXZAIooXNkuAjBxGj49OhDBclTAAAh+QQJCQADACwAAAAAQABAAAACfpyPqcvtD+MBtFqJ87K8Bw2GRneJJkZS5xql7NuQ8KzI9D10+K3vc+97AYMrDhE2PIqMymKpaXpCl4Cp9YrNarfcrvcLDovH5LL5jE6r1+y2+w2Py+d0dEXNPCfHe37e3CcWGDYIVvhlA5hI5qLXyJiiAhkp1UX5yHV5VydSAAA7);\r\n}\r\n.dx-loadindicator-icon {\r\n    position: relative;\r\n    top: 15%;\r\n    left: 15%;\r\n    width: 70%;\r\n    height: 70%;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment {\r\n    position: absolute;\r\n    width: 19%;\r\n    height: 30%;\r\n    left: 44.5%;\r\n    top: 37%;\r\n    opacity: 0;\r\n    background: #606060;\r\n    -webkit-border-radius: 50%;\r\n    -moz-border-radius: 50%;\r\n    -ms-border-radius: 50%;\r\n    -o-border-radius: 50%;\r\n    border-radius: 50%;\r\n    -webkit-border-top-left-radius: 10%;\r\n    -moz-border-top-left-radius: 10%;\r\n    border-top-left-radius: 10%;\r\n    -webkit-border-top-right-radius: 10%;\r\n    -moz-border-top-right-radius: 10%;\r\n    border-top-right-radius: 10%;\r\n    -webkit-box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);\r\n    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);\r\n    -webkit-animation: dx-generic-loadindicator-opacity 1s linear infinite;\r\n    -moz-animation: dx-generic-loadindicator-opacity 1s linear infinite;\r\n    -o-animation: dx-generic-loadindicator-opacity 1s linear infinite;\r\n    animation: dx-generic-loadindicator-opacity 1s linear infinite;\r\n}\r\n@-webkit-keyframes dx-generic-loadindicator-opacity {\r\n    from {\r\n        opacity: 1;\r\n    }\r\n    to {\r\n        opacity: 0.55;\r\n    }\r\n}\r\n@-moz-keyframes dx-generic-loadindicator-opacity {\r\n    from {\r\n        opacity: 1;\r\n    }\r\n    to {\r\n        opacity: 0.55;\r\n    }\r\n}\r\n@-ms-keyframes dx-generic-loadindicator-opacity {\r\n    from {\r\n        opacity: 1;\r\n    }\r\n    to {\r\n        opacity: 0.85;\r\n    }\r\n}\r\n@-o-keyframes dx-generic-loadindicator-opacity {\r\n    from {\r\n        opacity: 1;\r\n    }\r\n    to {\r\n        opacity: 0.55;\r\n    }\r\n}\r\n@keyframes dx-generic-loadindicator-opacity {\r\n    from {\r\n        opacity: 1;\r\n    }\r\n    to {\r\n        opacity: 0.55;\r\n    }\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment0 {\r\n    -webkit-transform: rotate(0deg) translate(0, -142%);\r\n    -moz-transform: rotate(0deg) translate(0, -142%);\r\n    -ms-transform: rotate(0deg) translate(0, -142%);\r\n    -o-transform: rotate(0deg) translate(0, -142%);\r\n    transform: rotate(0deg) translate(0, -142%);\r\n    -webkit-animation-delay: 0s;\r\n    -moz-animation-delay: 0s;\r\n    -o-animation-delay: 0s;\r\n    animation-delay: 0s;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment1 {\r\n    -webkit-transform: rotate(45deg) translate(0, -142%);\r\n    -moz-transform: rotate(45deg) translate(0, -142%);\r\n    -ms-transform: rotate(45deg) translate(0, -142%);\r\n    -o-transform: rotate(45deg) translate(0, -142%);\r\n    transform: rotate(45deg) translate(0, -142%);\r\n    -webkit-animation-delay: -0.875s;\r\n    -moz-animation-delay: -0.875s;\r\n    -o-animation-delay: -0.875s;\r\n    animation-delay: -0.875s;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment2 {\r\n    -webkit-transform: rotate(90deg) translate(0, -142%);\r\n    -moz-transform: rotate(90deg) translate(0, -142%);\r\n    -ms-transform: rotate(90deg) translate(0, -142%);\r\n    -o-transform: rotate(90deg) translate(0, -142%);\r\n    transform: rotate(90deg) translate(0, -142%);\r\n    -webkit-animation-delay: -0.75s;\r\n    -moz-animation-delay: -0.75s;\r\n    -o-animation-delay: -0.75s;\r\n    animation-delay: -0.75s;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment3 {\r\n    -webkit-transform: rotate(135deg) translate(0, -142%);\r\n    -moz-transform: rotate(135deg) translate(0, -142%);\r\n    -ms-transform: rotate(135deg) translate(0, -142%);\r\n    -o-transform: rotate(135deg) translate(0, -142%);\r\n    transform: rotate(135deg) translate(0, -142%);\r\n    -webkit-animation-delay: -0.625s;\r\n    -moz-animation-delay: -0.625s;\r\n    -o-animation-delay: -0.625s;\r\n    animation-delay: -0.625s;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment4 {\r\n    -webkit-transform: rotate(180deg) translate(0, -142%);\r\n    -moz-transform: rotate(180deg) translate(0, -142%);\r\n    -ms-transform: rotate(180deg) translate(0, -142%);\r\n    -o-transform: rotate(180deg) translate(0, -142%);\r\n    transform: rotate(180deg) translate(0, -142%);\r\n    -webkit-animation-delay: -0.5s;\r\n    -moz-animation-delay: -0.5s;\r\n    -o-animation-delay: -0.5s;\r\n    animation-delay: -0.5s;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment5 {\r\n    -webkit-transform: rotate(225deg) translate(0, -142%);\r\n    -moz-transform: rotate(225deg) translate(0, -142%);\r\n    -ms-transform: rotate(225deg) translate(0, -142%);\r\n    -o-transform: rotate(225deg) translate(0, -142%);\r\n    transform: rotate(225deg) translate(0, -142%);\r\n    -webkit-animation-delay: -0.375s;\r\n    -moz-animation-delay: -0.375s;\r\n    -o-animation-delay: -0.375s;\r\n    animation-delay: -0.375s;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment6 {\r\n    -webkit-transform: rotate(270deg) translate(0, -142%);\r\n    -moz-transform: rotate(270deg) translate(0, -142%);\r\n    -ms-transform: rotate(270deg) translate(0, -142%);\r\n    -o-transform: rotate(270deg) translate(0, -142%);\r\n    transform: rotate(270deg) translate(0, -142%);\r\n    -webkit-animation-delay: -0.25s;\r\n    -moz-animation-delay: -0.25s;\r\n    -o-animation-delay: -0.25s;\r\n    animation-delay: -0.25s;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment7 {\r\n    -webkit-transform: rotate(315deg) translate(0, -142%);\r\n    -moz-transform: rotate(315deg) translate(0, -142%);\r\n    -ms-transform: rotate(315deg) translate(0, -142%);\r\n    -o-transform: rotate(315deg) translate(0, -142%);\r\n    transform: rotate(315deg) translate(0, -142%);\r\n    -webkit-animation-delay: -0.125s;\r\n    -moz-animation-delay: -0.125s;\r\n    -o-animation-delay: -0.125s;\r\n    animation-delay: -0.125s;\r\n}\r\n.dx-loadindicator-icon .dx-loadindicator-segment8,\r\n.dx-loadindicator-icon .dx-loadindicator-segment9,\r\n.dx-loadindicator-icon .dx-loadindicator-segment10,\r\n.dx-loadindicator-icon .dx-loadindicator-segment11,\r\n.dx-loadindicator-icon .dx-loadindicator-segment12,\r\n.dx-loadindicator-icon .dx-loadindicator-segment13,\r\n.dx-loadindicator-icon .dx-loadindicator-segment14,\r\n.dx-loadindicator-icon .dx-loadindicator-segment15 {\r\n    display: none;\r\n}\r\n.dx-rtl .dx-loadindicator-icon {\r\n    right: 15%;\r\n    left: 0;\r\n}\r\n.dx-loadpanel-content {\r\n    border: 1px solid #ddd;\r\n    background: #fff;\r\n    -webkit-border-radius: 2px;\r\n    -moz-border-radius: 2px;\r\n    -ms-border-radius: 2px;\r\n    -o-border-radius: 2px;\r\n    border-radius: 2px;\r\n    -webkit-box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);\r\n    -moz-box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);\r\n    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);\r\n}\r\n.dx-autocomplete .dx-texteditor-input {\r\n    font-size: 1em;\r\n}\r\n.dx-autocomplete.dx-invalid .dx-texteditor-container:after {\r\n    right: 4px;\r\n}\r\n.dx-rtl .dx-autocomplete.dx-invalid .dx-texteditor-container:after,\r\n.dx-rtl.dx-autocomplete.dx-invalid .dx-texteditor-container:after {\r\n    left: 4px;\r\n}\r\n.dx-dropdownmenu-popup-wrapper .dx-overlay-content .dx-popup-content {\r\n    padding: 1px;\r\n}\r\n.dx-dropdownmenu-popup-wrapper .dx-dropdownmenu-list {\r\n    -webkit-border-radius: 8px;\r\n    -moz-border-radius: 8px;\r\n    -ms-border-radius: 8px;\r\n    -o-border-radius: 8px;\r\n    border-radius: 8px;\r\n}\r\n.dx-dropdownmenu-popup-wrapper .dx-list-item {\r\n    border-top: 0;\r\n}\r\n.dx-selectbox-popup-wrapper .dx-overlay-content {\r\n    -webkit-box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.175);\r\n    -moz-box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.175);\r\n    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.175);\r\n}\r\n.dx-selectbox-popup-wrapper .dx-list {\r\n    background-color: #fff;\r\n}\r\n.dx-tagbox:not(.dx-texteditor-empty).dx-tagbox-default-template.dx-tagbox-only-select .dx-tag-container {\r\n    padding-bottom: 2px;\r\n}\r\n.dx-tagbox:not(.dx-texteditor-empty) .dx-texteditor-input {\r\n    padding-left: 0;\r\n    margin-left: 3px;\r\n}\r\n.dx-rtl .dx-tagbox:not(.dx-texteditor-empty) .dx-texteditor-input,\r\n.dx-rtl.dx-tagbox:not(.dx-texteditor-empty) .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-right: 0;\r\n    margin-right: 3px;\r\n    margin-left: 0;\r\n}\r\n.dx-tag-container {\r\n    padding-right: 24px;\r\n}\r\n.dx-show-clear-button .dx-tag-container {\r\n    padding-right: 48px;\r\n}\r\n.dx-tagbox-single-line.dx-dropdowneditor-button-visible .dx-texteditor-container {\r\n    width: calc(100% - 24px);\r\n}\r\n.dx-tagbox-single-line .dx-tag-container {\r\n    padding-right: 0;\r\n}\r\n.dx-tag-content {\r\n    margin: 2px 0 0 2px;\r\n    padding: 2px 17px 2px 4px;\r\n    min-width: 40px;\r\n    background-color: #dddddd;\r\n    border-radius: -2px;\r\n    color: #333;\r\n    vertical-align: top;\r\n}\r\n.dx-tag-remove-button {\r\n    width: 17px;\r\n    height: 100%;\r\n}\r\n.dx-tag-remove-button:before,\r\n.dx-tag-remove-button:after {\r\n    right: 7px;\r\n    margin-top: -5px;\r\n    width: 3px;\r\n    height: 11px;\r\n    background: #aaaaaa;\r\n}\r\n.dx-tag-remove-button:after {\r\n    right: 3px;\r\n    margin-top: -1px;\r\n    width: 11px;\r\n    height: 3px;\r\n}\r\n.dx-tag-remove-button:active:before,\r\n.dx-tag-remove-button:active:after {\r\n    background: #dddddd;\r\n}\r\n.dx-tag.dx-state-focused .dx-tag-content {\r\n    background-color: #cbcbcb;\r\n    color: #333;\r\n}\r\n.dx-tag.dx-state-focused .dx-tag-remove-button:before,\r\n.dx-tag.dx-state-focused .dx-tag-remove-button:after {\r\n    background-color: #aaaaaa;\r\n}\r\n.dx-tag.dx-state-focused .dx-tag-remove-button:active:before,\r\n.dx-tag.dx-state-focused .dx-tag-remove-button:active:after {\r\n    background: #dddddd;\r\n}\r\n.dx-tagbox.dx-invalid .dx-texteditor-container:after {\r\n    right: 4px;\r\n}\r\n.dx-rtl .dx-tagbox.dx-invalid .dx-texteditor-container:after,\r\n.dx-rtl.dx-tagbox.dx-invalid .dx-texteditor-container:after {\r\n    left: 4px;\r\n}\r\n.dx-tagbox-popup-wrapper .dx-list-select-all {\r\n    border-bottom: 1px solid #ddd;\r\n    padding-bottom: 7px;\r\n    margin-bottom: 1px;\r\n}\r\n.dx-rtl .dx-tag-content {\r\n    padding-right: 4px;\r\n    padding-left: 17px;\r\n}\r\n.dx-rtl .dx-tag-remove-button:before {\r\n    right: auto;\r\n    left: 7px;\r\n}\r\n.dx-rtl .dx-tag-remove-button:after {\r\n    right: auto;\r\n    left: 3px;\r\n}\r\n.dx-rtl .dx-tag-container {\r\n    padding-left: 24px;\r\n    padding-right: 0;\r\n}\r\n.dx-radiobutton-icon {\r\n    width: 16px;\r\n    height: 16px;\r\n}\r\n.dx-radiobutton-icon:before {\r\n    display: block;\r\n    width: 14px;\r\n    height: 14px;\r\n    border: 1px solid #ddd;\r\n    background-color: #fff;\r\n    content: '';\r\n    -webkit-border-radius: 8px;\r\n    -moz-border-radius: 8px;\r\n    -ms-border-radius: 8px;\r\n    -o-border-radius: 8px;\r\n    border-radius: 8px;\r\n    -webkit-box-sizing: content-box;\r\n    -moz-box-sizing: content-box;\r\n    box-sizing: content-box;\r\n}\r\n.dx-radiobutton-checked .dx-radiobutton-icon-dot {\r\n    display: block;\r\n    margin-top: -12px;\r\n    margin-left: 4px;\r\n    width: 8px;\r\n    height: 8px;\r\n    background: #337ab7;\r\n    content: '';\r\n    -webkit-border-radius: 4px;\r\n    -moz-border-radius: 4px;\r\n    -ms-border-radius: 4px;\r\n    -o-border-radius: 4px;\r\n    border-radius: 4px;\r\n}\r\n.dx-radiobutton {\r\n    line-height: 16px;\r\n}\r\n.dx-radiobutton.dx-state-readonly .dx-radiobutton-icon:before {\r\n    border-color: #f4f4f4;\r\n    background-color: #fff;\r\n}\r\n.dx-radiobutton.dx-state-hover .dx-radiobutton-icon:before {\r\n    border-color: rgba(51, 122, 183, 0.4);\r\n}\r\n.dx-radiobutton.dx-state-active .dx-radiobutton-icon:before {\r\n    background-color: rgba(96, 96, 96, 0.2);\r\n}\r\n.dx-radiobutton.dx-state-focused {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-radiobutton.dx-state-focused:not(.dx-state-active) .dx-radiobutton-icon:before {\r\n    border: 1px solid #337ab7;\r\n}\r\n.dx-invalid .dx-radiobutton-icon:before {\r\n    border-color: rgba(217, 83, 79, 0.4);\r\n}\r\n.dx-invalid .dx-state-hover.dx-radiobutton .dx-radiobutton-icon:before {\r\n    border-color: #d9534f;\r\n}\r\n.dx-invalid .dx-state-focused.dx-radiobutton .dx-radiobutton-icon:before {\r\n    border-color: #d9534f;\r\n}\r\n.dx-rtl .dx-radiobutton.dx-radiobutton-checked .dx-radiobutton-icon-dot,\r\n.dx-rtl.dx-radiobutton.dx-radiobutton-checked .dx-radiobutton-icon-dot {\r\n    margin-right: 4.5px;\r\n    margin-left: 0;\r\n}\r\n.dx-radio-value-container {\r\n    padding-left: 0;\r\n}\r\n.dx-radiogroup .dx-radiobutton,\r\n.dx-radiogroup .dx-radiobutton-icon {\r\n    margin: 1px 0;\r\n}\r\n.dx-radiogroup.dx-state-readonly .dx-radiobutton-icon:before {\r\n    border-color: #f4f4f4;\r\n    background-color: #fff;\r\n}\r\n.dx-radiogroup.dx-state-focused {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-radiogroup-horizontal .dx-radiobutton {\r\n    margin-right: 17px;\r\n}\r\n.dx-rtl .dx-radiogroup-horizontal .dx-radiobutton,\r\n.dx-rtl.dx-radiogroup-horizontal .dx-radiobutton {\r\n    margin-right: 0;\r\n    margin-left: 17px;\r\n}\r\n.dx-pivottabs {\r\n    height: 46px;\r\n}\r\n.dx-pivottabs-tab,\r\n.dx-pivottabs-ghosttab {\r\n    padding: 3px 7px;\r\n    color: #959595;\r\n    font-size: 30px;\r\n}\r\n.dx-pivottabs-tab-selected {\r\n    color: #333;\r\n}\r\n.dx-pivot-itemcontainer {\r\n    top: 46px;\r\n}\r\n.dx-panorama-title,\r\n.dx-panorama-ghosttitle {\r\n    height: 60px;\r\n    font-size: 55px;\r\n}\r\n.dx-panorama-itemscontainer {\r\n    top: 60px;\r\n}\r\n.dx-panorama-item-title {\r\n    font-size: 23.33333333px;\r\n}\r\n.dx-panorama-item-content {\r\n    top: 35px;\r\n}\r\n.dx-accordion {\r\n    color: #333;\r\n}\r\n.dx-accordion-item {\r\n    border: 1px solid transparent;\r\n    border-top-color: #ddd;\r\n}\r\n.dx-accordion-item:last-child {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-accordion-item.dx-state-active:not(.dx-accordion-item-opened) .dx-icon {\r\n    color: #333;\r\n}\r\n.dx-accordion-item.dx-state-active:not(.dx-accordion-item-opened) > .dx-accordion-item-title {\r\n    color: #333;\r\n    background-color: rgba(96, 96, 96, 0.2);\r\n}\r\n.dx-accordion-item.dx-state-hover > .dx-accordion-item-title {\r\n    background-color: #f5f5f5;\r\n}\r\n.dx-accordion-item.dx-state-hover:not(:last-child):not(.dx-accordion-item-opened):not(.dx-state-focused) {\r\n    border-bottom-color: #f5f5f5;\r\n}\r\n.dx-accordion-item-opened {\r\n    border-color: #ddd;\r\n}\r\n.dx-accordion-item-opened.dx-state-hover > .dx-accordion-item-title {\r\n    background-color: transparent;\r\n}\r\n.dx-accordion-item-opened > .dx-accordion-item-title {\r\n    background-color: transparent;\r\n}\r\n.dx-accordion-item-opened > .dx-accordion-item-title:before {\r\n    content: '\\F014';\r\n}\r\n.dx-accordion-item-opened + .dx-accordion-item {\r\n    border-top-color: transparent;\r\n}\r\n.dx-accordion-item-opened + .dx-accordion-item.dx-state-hover:not(.dx-state-focused) {\r\n    border-top-color: #f5f5f5;\r\n}\r\n.dx-accordion-item-title {\r\n    color: #333;\r\n    padding: 5px 7px;\r\n    font-size: 16px;\r\n}\r\n.dx-accordion-item-title:before {\r\n    font-weight: normal;\r\n    color: #333;\r\n    content: '\\F016';\r\n    font-family: DXIcons;\r\n    font-size: 14px;\r\n    margin-left: 7px;\r\n    margin-right: 0;\r\n    line-height: 21px;\r\n}\r\n.dx-accordion-item-title .dx-icon {\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    margin-right: 7px;\r\n    margin-left: 0;\r\n    display: inline-block;\r\n    color: #333;\r\n}\r\n.dx-rtl .dx-accordion-item-title .dx-icon,\r\n.dx-rtl.dx-accordion-item-title .dx-icon {\r\n    margin-left: 7px;\r\n    margin-right: 0;\r\n}\r\n.dx-state-disabled.dx-accordion-item {\r\n    opacity: 0.5;\r\n}\r\n.dx-state-focused.dx-accordion-item {\r\n    border-color: #337ab7;\r\n}\r\n.dx-accordion-item-body {\r\n    padding: 3px 7px 12px;\r\n    font-size: 12px;\r\n}\r\n.dx-rtl .dx-accordion-item-title:before {\r\n    margin-left: 0;\r\n    margin-right: 7px;\r\n}\r\n.dx-slideoutview-content {\r\n    -webkit-box-sizing: content-box;\r\n    -moz-box-sizing: content-box;\r\n    box-sizing: content-box;\r\n    margin-left: -1px;\r\n    border-style: solid;\r\n    border-width: 0 1px;\r\n}\r\n.dx-slideout-menu .dx-list-item .dx-icon {\r\n    width: 18px;\r\n    height: 18px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 18px 18px;\r\n    -moz-background-size: 18px 18px;\r\n    background-size: 18px 18px;\r\n    padding: 0px;\r\n    font-size: 18px;\r\n    text-align: center;\r\n    line-height: 18px;\r\n    margin-right: 9px;\r\n    margin-left: 0;\r\n    margin-top: -2px;\r\n    margin-bottom: -2px;\r\n}\r\n.dx-rtl .dx-slideout-menu .dx-list-item .dx-icon,\r\n.dx-rtl.dx-slideout-menu .dx-list-item .dx-icon {\r\n    margin-left: 9px;\r\n    margin-right: 0;\r\n}\r\n.dx-slideoutview-menu-content,\r\n.dx-slideoutview-content {\r\n    background-color: #fff;\r\n}\r\n.dx-slideoutview-content {\r\n    border-color: rgba(221, 221, 221, 0.5);\r\n}\r\n.dx-slideoutview-content {\r\n    -webkit-box-sizing: content-box;\r\n    -moz-box-sizing: content-box;\r\n    box-sizing: content-box;\r\n    margin-left: -1px;\r\n    border-style: solid;\r\n    border-width: 0 1px;\r\n}\r\n.dx-slideout-menu .dx-list-item .dx-icon {\r\n    width: 18px;\r\n    height: 18px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 18px 18px;\r\n    -moz-background-size: 18px 18px;\r\n    background-size: 18px 18px;\r\n    padding: 0px;\r\n    font-size: 18px;\r\n    text-align: center;\r\n    line-height: 18px;\r\n    margin-right: 9px;\r\n    margin-left: 0;\r\n    margin-top: -2px;\r\n    margin-bottom: -2px;\r\n}\r\n.dx-rtl .dx-slideout-menu .dx-list-item .dx-icon,\r\n.dx-rtl.dx-slideout-menu .dx-list-item .dx-icon {\r\n    margin-left: 9px;\r\n    margin-right: 0;\r\n}\r\n.dx-pager {\r\n    padding-top: 5px;\r\n    padding-bottom: 5px;\r\n}\r\n.dx-pager.dx-light-mode .dx-page-sizes {\r\n    min-width: 42px;\r\n}\r\n.dx-pager.dx-light-mode .dx-page-index {\r\n    min-width: 19px;\r\n}\r\n.dx-pager .dx-pages .dx-page {\r\n    padding: 4px 6px 5px;\r\n}\r\n.dx-pager .dx-pages .dx-separator {\r\n    padding-left: 4px;\r\n    padding-right: 4px;\r\n}\r\n.dx-pager .dx-pages .dx-navigate-button {\r\n    width: 9px;\r\n    height: 16px;\r\n    padding: 5px 7px;\r\n}\r\n.dx-pager .dx-pages .dx-prev-button {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-pager .dx-pages .dx-prev-button:before {\r\n    content: '\\F012';\r\n}\r\n.dx-pager .dx-pages .dx-next-button {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-pager .dx-pages .dx-next-button:before {\r\n    content: '\\F010';\r\n}\r\n.dx-pager .dx-pages .dx-prev-button,\r\n.dx-pager .dx-pages .dx-next-button {\r\n    font-size: 21px;\r\n    text-align: center;\r\n    line-height: 21px;\r\n}\r\n.dx-pager .dx-pages .dx-prev-button:before,\r\n.dx-pager .dx-pages .dx-next-button:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 21px;\r\n    top: 50%;\r\n    margin-top: -10.5px;\r\n    left: 50%;\r\n    margin-left: -10.5px;\r\n}\r\n.dx-pager .dx-page,\r\n.dx-pager .dx-page-size {\r\n    -webkit-border-radius: -1px;\r\n    -moz-border-radius: -1px;\r\n    -ms-border-radius: -1px;\r\n    -o-border-radius: -1px;\r\n    border-radius: -1px;\r\n    border-style: solid;\r\n    border-width: 1px;\r\n    border-color: transparent;\r\n}\r\n.dx-pager .dx-page-sizes .dx-page-size {\r\n    padding-left: 8px;\r\n    padding-right: 6px;\r\n    padding-top: 4px;\r\n    padding-bottom: 5px;\r\n}\r\n.dx-pager .dx-pages .dx-selection,\r\n.dx-pager .dx-page-sizes .dx-selection {\r\n    color: #333;\r\n    border-color: transparent;\r\n    background-color: #d4d4d4;\r\n}\r\n.dx-colorview-container {\r\n    width: 316px;\r\n}\r\n.dx-colorview-container label {\r\n    line-height: 25px;\r\n}\r\n.dx-colorview-container label.dx-colorview-label-hex {\r\n    margin: 5px 0 0 0;\r\n}\r\n.dx-colorview-container label.dx-colorview-alpha-channel-label {\r\n    margin-left: 29px;\r\n    width: 92px;\r\n}\r\n.dx-colorview-container label .dx-texteditor {\r\n    width: 51px;\r\n    margin: 1px 1px 8px 0;\r\n}\r\n.dx-colorview-hue-scale-cell {\r\n    margin-left: 15px;\r\n}\r\n.dx-colorview-palette {\r\n    width: 190px;\r\n    height: 200px;\r\n}\r\n.dx-colorview-alpha-channel-scale {\r\n    width: 190px;\r\n}\r\n.dx-colorview-container-row.dx-colorview-alpha-channel-row {\r\n    margin-top: 5px;\r\n}\r\n.dx-colorview-hue-scale {\r\n    width: 18px;\r\n    height: 200px;\r\n}\r\n.dx-colorview-alpha-channel-cell {\r\n    width: 194px;\r\n}\r\n.dx-colorview-hue-scale-wrapper {\r\n    height: 202px;\r\n}\r\n.dx-colorview-color-preview {\r\n    width: 100%;\r\n    height: 25px;\r\n}\r\n.dx-colorview-controls-container {\r\n    width: 70px;\r\n    margin-left: 15px;\r\n}\r\n.dx-colorview-container label {\r\n    color: #333;\r\n}\r\n.dx-colorview-palette-cell,\r\n.dx-colorview-alpha-channel-border,\r\n.dx-colorview-hue-scale-wrapper,\r\n.dx-colorview-color-preview-container {\r\n    padding: 1px;\r\n    margin: 1px;\r\n    margin-top: 0;\r\n    background-color: #fff;\r\n    box-shadow: 0 0 0 1px #ddd;\r\n}\r\n.dx-colorview-color-preview-container {\r\n    margin-bottom: 15px;\r\n}\r\n.dx-state-focused.dx-colorview {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-rtl .dx-colorview-controls-container {\r\n    margin-left: 0;\r\n    margin-right: 15px;\r\n}\r\n.dx-rtl .dx-colorview-hue-scale-cell {\r\n    margin-left: 0;\r\n    margin-right: 15px;\r\n}\r\n.dx-rtl .dx-colorview-container label.dx-colorview-alpha-channel-label {\r\n    margin-left: 0;\r\n    margin-right: 29px;\r\n}\r\n.dx-colorbox.dx-state-focused .dx-colorbox-input {\r\n    padding-left: 40px;\r\n}\r\n.dx-colorbox .dx-placeholder {\r\n    left: 32px;\r\n}\r\n.dx-colorbox-input-container.dx-colorbox-color-is-not-defined .dx-colorbox-color-result-preview {\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAQAAACRZI9xAAAAdElEQVQoU4XR0Q3AIAgFQCarie7UrToMc3QIiyIFFGNe5INcgETAegpQefFCCFPwYZI2qFA/M4EQMQAhKxJgiEcKHFFkwUQY3Q4sBAhUerYzkbaiTUk7Ije0dYoMyeYGi35igUeDzMCiTiKgaPx0BAR1csgHXJxUKOJqsbEAAAAASUVORK5CYII=) no-repeat 0 0;\r\n}\r\n.dx-colorbox-color-result-preview {\r\n    border-color: #ddd;\r\n}\r\n.dx-colorbox-overlay {\r\n    padding: 0;\r\n}\r\n.dx-colorbox-overlay.dx-overlay-content {\r\n    background-color: #fff;\r\n}\r\n.dx-colorbox-overlay .dx-popup-content {\r\n    padding: 10px;\r\n}\r\n.dx-rtl.dx-colorbox.dx-state-focused .dx-colorbox-input,\r\n.dx-rtl .dx-colorbox.dx-state-focused .dx-colorbox-input {\r\n    padding-right: 40px;\r\n}\r\n.dx-rtl .dx-colorbox-overlay .dx-toolbar-item:first-child {\r\n    padding-left: 10px;\r\n    padding-right: 0;\r\n}\r\n.dx-datagrid {\r\n    line-height: inherit;\r\n}\r\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-headers,\r\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-rowsview,\r\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-total-footer {\r\n    border-left: 1px solid #ddd;\r\n    border-right: 1px solid #ddd;\r\n}\r\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-rowsview,\r\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-total-footer {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-pager,\r\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-headers,\r\n.dx-datagrid.dx-datagrid-borders > .dx-datagrid-rowsview {\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-datagrid .dx-menu {\r\n    background-color: transparent;\r\n    height: 100%;\r\n}\r\n.dx-datagrid .dx-menu .dx-menu-item .dx-menu-item-content {\r\n    padding: 5px 3px 3px;\r\n}\r\n.dx-datagrid .dx-menu .dx-menu-item .dx-menu-item-content .dx-icon {\r\n    margin: 0px 3px;\r\n}\r\n.dx-datagrid .dx-menu-item-has-submenu.dx-state-hover {\r\n    background-color: transparent;\r\n}\r\n.dx-datagrid .dx-menu-item-has-submenu.dx-menu-item-expanded.dx-state-hover {\r\n    background-color: #fff;\r\n}\r\n.dx-datagrid .dx-menu-item-has-icon .dx-icon {\r\n    color: #898989;\r\n}\r\n.dx-datagrid.dx-context-menu .dx-menu-items-container .dx-icon-context-menu-sort-asc {\r\n    font: 14px/1 DXIcons;\r\n    width: 16px;\r\n    height: 16px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 16px 16px;\r\n    -moz-background-size: 16px 16px;\r\n    background-size: 16px 16px;\r\n    padding: 0px;\r\n    font-size: 16px;\r\n    text-align: center;\r\n    line-height: 16px;\r\n}\r\n.dx-datagrid.dx-context-menu .dx-menu-items-container .dx-icon-context-menu-sort-asc:before {\r\n    content: '\\F053';\r\n}\r\n.dx-datagrid.dx-context-menu .dx-menu-items-container .dx-icon-context-menu-sort-desc {\r\n    font: 14px/1 DXIcons;\r\n    width: 16px;\r\n    height: 16px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 16px 16px;\r\n    -moz-background-size: 16px 16px;\r\n    background-size: 16px 16px;\r\n    padding: 0px;\r\n    font-size: 16px;\r\n    text-align: center;\r\n    line-height: 16px;\r\n}\r\n.dx-datagrid.dx-context-menu .dx-menu-items-container .dx-icon-context-menu-sort-desc:before {\r\n    content: '\\F054';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-equals {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-equals:before {\r\n    content: '\\F044';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-default {\r\n    font: 14px/1 DXIcons;\r\n    width: 12px;\r\n    height: 12px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 12px 12px;\r\n    -moz-background-size: 12px 12px;\r\n    background-size: 12px 12px;\r\n    padding: 0px;\r\n    font-size: 12px;\r\n    text-align: center;\r\n    line-height: 12px;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-default:before {\r\n    content: '\\F027';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-not-equals {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-not-equals:before {\r\n    content: '\\F045';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-less {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-less:before {\r\n    content: '\\F046';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-less-equal {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-less-equal:before {\r\n    content: '\\F048';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-greater {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-greater:before {\r\n    content: '\\F047';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-greater-equal {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-greater-equal:before {\r\n    content: '\\F049';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-contains {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-contains:before {\r\n    content: '\\F063';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-not-contains {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-not-contains:before {\r\n    content: '\\F066';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-starts-with {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-starts-with:before {\r\n    content: '\\F064';\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-ends-with {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-datagrid .dx-icon-filter-operation-ends-with:before {\r\n    content: '\\F065';\r\n}\r\n.dx-datagrid .dx-menu-items-container .dx-menu-item-has-icon .dx-icon-filter-operation-between {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAFCAQAAADbc8WkAAAAHElEQVQYV2NI+J/A8B8DJoAQbgmsEKwDC8QtAQC2WDWbJkSICQAAAABJRU5ErkJggg==);\r\n    background-repeat: no-repeat;\r\n    background-position: center center;\r\n    background-size: 14px 5px;\r\n}\r\n.dx-datagrid .dx-menu-items-container .dx-menu-item-has-icon.dx-menu-item-selected .dx-icon-filter-operation-between {\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAFCAQAAADbc8WkAAAAGUlEQVQY02P8/5+BkQET/GfEJ4EVMJJsFACqkg38+KlM0gAAAABJRU5ErkJggg==);\r\n}\r\n.dx-datagrid .dx-row-alt > td {\r\n    background-color: #f5f5f5;\r\n}\r\n.dx-datagrid .dx-row-alt.dx-row:not(.dx-row-removed) {\r\n    border-bottom-color: transparent;\r\n}\r\n.dx-datagrid .dx-link {\r\n    color: #337ab7;\r\n}\r\n.dx-datagrid .dx-checkbox-indeterminate .dx-checkbox-icon:before {\r\n    width: 6px;\r\n    height: 6px;\r\n    left: 4px;\r\n    top: 4px;\r\n}\r\n.dx-datagrid .dx-row-lines > td {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-datagrid .dx-column-lines > td {\r\n    border-left: 1px solid #ddd;\r\n    border-right: 1px solid #ddd;\r\n}\r\n.dx-datagrid .dx-error-row td {\r\n    background-color: rgba(217, 83, 79, 0.6);\r\n    color: #fff;\r\n    padding: 5px;\r\n}\r\n.dx-datagrid .dx-error-row td .dx-error-message {\r\n    white-space: normal;\r\n    word-wrap: break-word;\r\n    padding-right: 35px;\r\n}\r\n.dx-datagrid .dx-error-row td .dx-closebutton {\r\n    float: right;\r\n    margin-top: 2px;\r\n    margin-right: 2px;\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-datagrid .dx-error-row td .dx-closebutton:before {\r\n    content: '\\F00A';\r\n}\r\n.dx-datagrid .dx-row > td {\r\n    padding: 5px;\r\n}\r\n.dx-datagrid-headers .dx-texteditor-input,\r\n.dx-datagrid-rowsview .dx-texteditor-input {\r\n    padding: 5px;\r\n    min-height: 26px;\r\n}\r\n.dx-datagrid-headers .dx-lookup,\r\n.dx-datagrid-rowsview .dx-lookup {\r\n    height: auto;\r\n}\r\n.dx-datagrid-headers .dx-lookup-field,\r\n.dx-datagrid-rowsview .dx-lookup-field {\r\n    padding-left: 5px;\r\n    padding-top: 5px;\r\n    padding-bottom: 5px;\r\n}\r\n.dx-datagrid-headers .dx-dropdowneditor-button-visible.dx-show-clear-button .dx-texteditor-input,\r\n.dx-datagrid-rowsview .dx-dropdowneditor-button-visible.dx-show-clear-button .dx-texteditor-input {\r\n    padding-right: 46px;\r\n}\r\n.dx-datagrid-headers .dx-dropdowneditor-button-visible.dx-show-clear-button.dx-invalid .dx-texteditor-input,\r\n.dx-datagrid-rowsview .dx-dropdowneditor-button-visible.dx-show-clear-button.dx-invalid .dx-texteditor-input {\r\n    padding-right: 66px;\r\n}\r\n.dx-datagrid-headers .dx-dropdowneditor-button-visible.dx-show-clear-button.dx-invalid.dx-rtl .dx-texteditor-input,\r\n.dx-datagrid-rowsview .dx-dropdowneditor-button-visible.dx-show-clear-button.dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 66px;\r\n}\r\n.dx-datagrid-headers .dx-dropdowneditor-button-visible.dx-invalid .dx-texteditor-input,\r\n.dx-datagrid-rowsview .dx-dropdowneditor-button-visible.dx-invalid .dx-texteditor-input {\r\n    padding-right: 44px;\r\n}\r\n.dx-datagrid-headers .dx-dropdowneditor-button-visible.dx-invalid.dx-rtl .dx-texteditor-input,\r\n.dx-datagrid-rowsview .dx-dropdowneditor-button-visible.dx-invalid.dx-rtl .dx-texteditor-input {\r\n    padding: 4px 5px 4px;\r\n    padding-left: 44px;\r\n}\r\n.dx-datagrid-headers .dx-dropdowneditor-button-visible .dx-texteditor-input,\r\n.dx-datagrid-rowsview .dx-dropdowneditor-button-visible .dx-texteditor-input {\r\n    padding-right: 24px;\r\n}\r\n.dx-datagrid-headers .dx-searchbox .dx-texteditor-input,\r\n.dx-datagrid-rowsview .dx-searchbox .dx-texteditor-input,\r\n.dx-datagrid-headers .dx-searchbox .dx-placeholder:before,\r\n.dx-datagrid-rowsview .dx-searchbox .dx-placeholder:before {\r\n    padding-left: 24px;\r\n}\r\n.dx-rtl .dx-datagrid-headers .dx-searchbox .dx-texteditor-input,\r\n.dx-rtl .dx-datagrid-rowsview .dx-searchbox .dx-texteditor-input,\r\n.dx-rtl .dx-datagrid-headers .dx-searchbox .dx-placeholder:before,\r\n.dx-rtl .dx-datagrid-rowsview .dx-searchbox .dx-placeholder:before,\r\n.dx-rtl.dx-datagrid-headers .dx-searchbox .dx-texteditor-input,\r\n.dx-rtl.dx-datagrid-rowsview .dx-searchbox .dx-texteditor-input,\r\n.dx-rtl.dx-datagrid-headers .dx-searchbox .dx-placeholder:before,\r\n.dx-rtl.dx-datagrid-rowsview .dx-searchbox .dx-placeholder:before {\r\n    padding-right: 24px;\r\n}\r\n.dx-editor-cell .dx-numberbox-spin-button {\r\n    background-color: transparent;\r\n}\r\n.dx-editor-cell .dx-checkbox.dx-checkbox-checked .dx-checkbox-icon {\r\n    font-size: 10px;\r\n}\r\n.dx-editor-cell .dx-texteditor {\r\n    background: #fff;\r\n}\r\n.dx-editor-cell .dx-texteditor .dx-texteditor-input {\r\n    background: #fff;\r\n}\r\n.dx-editor-cell .dx-texteditor.dx-numberbox-spin .dx-texteditor-input {\r\n    padding-right: 20px;\r\n}\r\n.dx-editor-cell .dx-texteditor.dx-numberbox-spin-touch-friendly .dx-texteditor-input {\r\n    padding-right: 60px;\r\n}\r\n.dx-editor-cell .dx-dropdowneditor {\r\n    background-color: #fff;\r\n}\r\n.dx-editor-cell.dx-focused .dx-dropdowneditor-icon {\r\n    border-radius: 0;\r\n}\r\n.dx-editor-cell.dx-editor-inline-block .dx-highlight-outline::before {\r\n    padding-top: 5px;\r\n    padding-bottom: 5px;\r\n}\r\n.dx-datagrid-checkbox-size {\r\n    line-height: normal;\r\n}\r\n.dx-datagrid-checkbox-size .dx-checkbox-icon {\r\n    height: 16px;\r\n    width: 16px;\r\n}\r\n.dx-device-mobile .dx-datagrid-column-chooser-list .dx-empty-message,\r\n.dx-datagrid-column-chooser-list .dx-empty-message {\r\n    color: #999999;\r\n    padding: 0 10px;\r\n}\r\n.dx-datagrid-column-chooser.dx-datagrid-column-chooser-mode-drag .dx-popup-content {\r\n    padding: 0px 10px 10px 10px;\r\n}\r\n.dx-datagrid-column-chooser.dx-datagrid-column-chooser-mode-drag .dx-popup-content .dx-treeview-node {\r\n    padding-left: 20px;\r\n}\r\n.dx-datagrid-column-chooser.dx-datagrid-column-chooser-mode-select .dx-popup-content {\r\n    padding: 0px 5px 10px 5px;\r\n}\r\n.dx-datagrid-column-chooser .dx-overlay-content {\r\n    background-color: #fff;\r\n    -webkit-border-radius: 2px;\r\n    -moz-border-radius: 2px;\r\n    -ms-border-radius: 2px;\r\n    -o-border-radius: 2px;\r\n    border-radius: 2px;\r\n    -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n}\r\n.dx-datagrid-column-chooser .dx-overlay-content .dx-popup-title {\r\n    padding-top: 7px;\r\n    padding-bottom: 9px;\r\n    background-color: transparent;\r\n}\r\n.dx-datagrid-column-chooser .dx-overlay-content .dx-popup-content .dx-column-chooser-item {\r\n    margin-bottom: 5px;\r\n    background-color: #fff;\r\n    color: #959595;\r\n    font-weight: normal;\r\n    border: 1px solid #ddd;\r\n    padding: 5px;\r\n    -webkit-box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.2);\r\n    box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.2);\r\n}\r\n.dx-datagrid-drag-header {\r\n    -webkit-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    -moz-box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.2);\r\n    color: #959595;\r\n    font-weight: normal;\r\n    padding: 5px;\r\n    border: 1px solid rgba(51, 122, 183, 0.5);\r\n    background-color: #fff;\r\n}\r\n.dx-datagrid-columns-separator {\r\n    background-color: rgba(51, 122, 183, 0.5);\r\n}\r\n.dx-datagrid-columns-separator-transparent {\r\n    background-color: transparent;\r\n}\r\n.dx-datagrid-drop-highlight > td {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-datagrid-focus-overlay {\r\n    border: 2px solid #337ab7;\r\n}\r\n.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row) > td:not(.dx-focused) {\r\n    background-color: #f5f5f5;\r\n    color: #333;\r\n}\r\n.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row) > td:not(.dx-focused).dx-datagrid-group-space {\r\n    border-right-color: #f5f5f5;\r\n}\r\n.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row) > .dx-datagrid-readonly .dx-texteditor .dx-texteditor-input {\r\n    background-color: #f5f5f5;\r\n    color: #333;\r\n}\r\n.dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row) > td.dx-pointer-events-none {\r\n    background-color: transparent;\r\n}\r\n.dx-datagrid-table .dx-row .dx-command-select {\r\n    width: 55px;\r\n    min-width: 55px;\r\n}\r\n.dx-datagrid-table .dx-row .dx-command-edit {\r\n    width: 70px;\r\n    min-width: 70px;\r\n}\r\n.dx-datagrid-table .dx-row .dx-command-expand {\r\n    width: 15px;\r\n    min-width: 15px;\r\n}\r\n.dx-datagrid-headers {\r\n    color: #959595;\r\n    font-weight: normal;\r\n    -ms-touch-action: pinch-zoom;\r\n    touch-action: pinch-zoom;\r\n}\r\n.dx-datagrid-borders .dx-datagrid-headers .dx-datagrid-table {\r\n    border-bottom-width: 1px;\r\n}\r\n.dx-datagrid-headers .dx-datagrid-table .dx-row > td {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-datagrid-filter-row .dx-menu .dx-overlay-content {\r\n    color: #333;\r\n}\r\n.dx-datagrid-filter-row .dx-menu-item.dx-state-focused {\r\n    background-color: transparent;\r\n}\r\n.dx-datagrid-filter-row .dx-menu-item.dx-state-focused:after {\r\n    border: 2px solid #337ab7;\r\n}\r\n.dx-datagrid-filter-row .dx-menu-item.dx-state-focused.dx-menu-item-expanded {\r\n    background-color: #fff;\r\n}\r\n.dx-datagrid-filter-row .dx-menu-item.dx-state-focused.dx-menu-item-expanded:after {\r\n    border-color: transparent;\r\n}\r\n.dx-datagrid-filter-row .dx-highlight-outline::after {\r\n    border-color: rgba(92, 184, 92, 0.5);\r\n}\r\n.dx-datagrid-filter-row .dx-menu-item-content .dx-icon {\r\n    color: #898989;\r\n}\r\n.dx-datagrid-filter-row td .dx-editor-container .dx-filter-range-content {\r\n    padding: 5px 5px 5px 24px;\r\n}\r\n.dx-datagrid-filter-range-overlay .dx-overlay-content {\r\n    border: 1px solid #ddd;\r\n    overflow: inherit;\r\n    -webkit-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.15);\r\n    -moz-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.15);\r\n    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.15);\r\n}\r\n.dx-datagrid-filter-range-overlay .dx-overlay-content .dx-editor-container.dx-highlight-outline::after {\r\n    border-color: rgba(92, 184, 92, 0.5);\r\n    left: 0px;\r\n}\r\n.dx-datagrid-filter-range-overlay .dx-overlay-content .dx-texteditor .dx-texteditor-input {\r\n    background-color: #fff;\r\n    padding: 5px;\r\n}\r\n.dx-datagrid-filter-range-overlay .dx-overlay-content .dx-texteditor.dx-state-focused:after {\r\n    border: 2px solid #337ab7;\r\n}\r\n.dx-filter-menu .dx-menu-item-content .dx-icon.dx-icon-filter-operation-default {\r\n    margin-top: 2px;\r\n}\r\n.dx-editor-with-menu .dx-filter-menu .dx-menu-item-content .dx-icon.dx-icon-filter-operation-default {\r\n    margin-top: 2px;\r\n}\r\n.dx-highlight-outline {\r\n    padding: 5px;\r\n}\r\n.dx-datagrid-header-panel {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-datagrid-header-panel .dx-toolbar {\r\n    margin-bottom: 5px;\r\n}\r\n.dx-datagrid-header-panel .dx-apply-button {\r\n    background-color: #5cb85c;\r\n    border-color: #4cae4c;\r\n    color: #fff;\r\n}\r\n.dx-datagrid-header-panel .dx-apply-button .dx-icon {\r\n    color: #fff;\r\n}\r\n.dx-datagrid-header-panel .dx-apply-button.dx-state-hover {\r\n    background-color: #449d44;\r\n    border-color: #398439;\r\n}\r\n.dx-datagrid-header-panel .dx-apply-button.dx-state-focused {\r\n    background-color: #449d44;\r\n    border-color: #255625;\r\n}\r\n.dx-datagrid-header-panel .dx-apply-button.dx-state-active {\r\n    background-color: #398439;\r\n    border-color: #255625;\r\n    color: #fff;\r\n}\r\n.dx-icon-column-chooser {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-icon-column-chooser:before {\r\n    content: '\\F04D';\r\n}\r\n.dx-datagrid-addrow-button .dx-icon-edit-button-addrow {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-datagrid-addrow-button .dx-icon-edit-button-addrow:before {\r\n    content: '\\F00B';\r\n}\r\n.dx-datagrid-cancel-button .dx-icon-edit-button-cancel {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-datagrid-cancel-button .dx-icon-edit-button-cancel:before {\r\n    content: '\\F04C';\r\n}\r\n.dx-datagrid-save-button .dx-icon-edit-button-save {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-datagrid-save-button .dx-icon-edit-button-save:before {\r\n    content: '\\F041';\r\n}\r\n.dx-apply-button .dx-icon-apply-filter {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-apply-button .dx-icon-apply-filter:before {\r\n    content: '\\F050';\r\n}\r\n.dx-datagrid-export-button .dx-icon-export-to {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-datagrid-export-button .dx-icon-export-to:before {\r\n    content: '\\F05F';\r\n}\r\n.dx-datagrid-export-button .dx-icon-export-excel-button {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-datagrid-export-button .dx-icon-export-excel-button:before {\r\n    content: '\\F060';\r\n}\r\n.dx-datagrid-adaptive-more {\r\n    width: 17px;\r\n    height: 17px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 17px 17px;\r\n    -moz-background-size: 17px 17px;\r\n    background-size: 17px 17px;\r\n    padding: 0px;\r\n    font-size: 17px;\r\n    text-align: center;\r\n    line-height: 17px;\r\n}\r\n.dx-datagrid-group-panel {\r\n    -ms-touch-action: pinch-zoom;\r\n    touch-action: pinch-zoom;\r\n}\r\n.dx-datagrid-group-panel .dx-group-panel-message {\r\n    color: #959595;\r\n    font-weight: normal;\r\n    padding: 5px;\r\n    border-top: 1px solid transparent;\r\n    border-bottom: 1px solid transparent;\r\n}\r\n.dx-datagrid-group-panel .dx-group-panel-item {\r\n    margin-right: 5px;\r\n    color: #959595;\r\n    font-weight: normal;\r\n    border: 1px solid #ddd;\r\n    padding: 5px;\r\n}\r\n.dx-datagrid-group-panel .dx-block-separator {\r\n    margin-right: 5px;\r\n    color: #959595;\r\n    font-weight: normal;\r\n    padding: 6px;\r\n    background-color: #eeeeee;\r\n}\r\n.dx-datagrid-group-panel .dx-sort {\r\n    color: #898989;\r\n}\r\n.dx-datagrid-rowsview {\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-datagrid-rowsview .dx-row.dx-group-row:first-child {\r\n    border-top: none;\r\n}\r\n.dx-datagrid-rowsview .dx-row {\r\n    border-top: 1px solid transparent;\r\n    border-bottom: 1px solid transparent;\r\n}\r\n.dx-datagrid-rowsview .dx-row.dx-edit-row:first-child > td {\r\n    border-top-width: 0px;\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-datagrid-rowsview .dx-row.dx-edit-row > td {\r\n    border-top: 1px solid #ddd;\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-datagrid-rowsview .dx-master-detail-row > .dx-datagrid-group-space,\r\n.dx-datagrid-rowsview .dx-master-detail-row .dx-master-detail-cell {\r\n    border-top: 1px solid #ddd;\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-datagrid-rowsview .dx-master-detail-row:not(.dx-datagrid-edit-form) > .dx-datagrid-group-space,\r\n.dx-datagrid-rowsview .dx-master-detail-row:not(.dx-datagrid-edit-form) .dx-master-detail-cell {\r\n    background-color: #fafafa;\r\n}\r\n.dx-datagrid-rowsview .dx-data-row .dx-validator.dx-datagrid-invalid .dx-highlight-outline::after {\r\n    border: 1px solid rgba(217, 83, 79, 0.4);\r\n}\r\n.dx-datagrid-rowsview .dx-data-row .dx-validator.dx-datagrid-invalid.dx-focused > .dx-highlight-outline::after {\r\n    border: 1px solid #d9534f;\r\n}\r\n.dx-datagrid-rowsview .dx-data-row .dx-invalid-message .dx-overlay-content {\r\n    padding: 9px 17px 9px;\r\n}\r\n.dx-datagrid-rowsview .dx-data-row .dx-cell-modified .dx-highlight-outline::after {\r\n    border-color: rgba(92, 184, 92, 0.5);\r\n}\r\n.dx-datagrid-rowsview .dx-row-removed > td {\r\n    background-color: rgba(92, 184, 92, 0.5);\r\n    border-top: 1px solid rgba(92, 184, 92, 0.5);\r\n    border-bottom: 1px solid rgba(92, 184, 92, 0.5);\r\n}\r\n.dx-datagrid-rowsview .dx-row.dx-group-row {\r\n    color: #959595;\r\n    background-color: #f7f7f7;\r\n    font-weight: bold;\r\n}\r\n.dx-datagrid-rowsview .dx-row.dx-group-row td {\r\n    border-top-color: #ddd;\r\n    border-bottom-color: #ddd;\r\n}\r\n.dx-datagrid-rowsview .dx-adaptive-detail-row .dx-adaptive-item-text {\r\n    padding-top: 6px;\r\n    padding-bottom: 6px;\r\n    padding-left: 6px;\r\n}\r\n.dx-datagrid-rowsview .dx-adaptive-detail-row .dx-datagrid-invalid {\r\n    border: 1px solid rgba(217, 83, 79, 0.4);\r\n}\r\n.dx-datagrid-rowsview .dx-adaptive-detail-row .dx-datagrid-invalid.dx-adaptive-item-text {\r\n    padding-top: 5px;\r\n    padding-bottom: 5px;\r\n    padding-left: 5px;\r\n}\r\n.dx-datagrid-rowsview .dx-item-modified {\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n    border: 2px solid rgba(92, 184, 92, 0.5);\r\n}\r\n.dx-datagrid-rowsview .dx-item-modified.dx-adaptive-item-text {\r\n    padding-top: 4px;\r\n    padding-bottom: 4px;\r\n    padding-left: 4px;\r\n}\r\n.dx-datagrid-rowsview .dx-selection.dx-row > td,\r\n.dx-datagrid-rowsview .dx-selection.dx-row:hover > td {\r\n    background-color: #e6e6e6;\r\n    color: #333;\r\n}\r\n.dx-datagrid-rowsview .dx-selection.dx-row > td.dx-datagrid-group-space,\r\n.dx-datagrid-rowsview .dx-selection.dx-row:hover > td.dx-datagrid-group-space {\r\n    border-right-color: #e6e6e6;\r\n}\r\n.dx-datagrid-rowsview .dx-selection.dx-row > td.dx-pointer-events-none,\r\n.dx-datagrid-rowsview .dx-selection.dx-row:hover > td.dx-pointer-events-none {\r\n    border-left-color: #ddd;\r\n    border-right-color: #ddd;\r\n}\r\n.dx-datagrid-rowsview .dx-selection.dx-row > td.dx-focused,\r\n.dx-datagrid-rowsview .dx-selection.dx-row:hover > td.dx-focused {\r\n    background-color: #fff;\r\n    color: #333;\r\n}\r\n.dx-datagrid-rowsview .dx-selection.dx-row:not(.dx-row-lines) > td,\r\n.dx-datagrid-rowsview .dx-selection.dx-row:hover:not(.dx-row-lines) > td {\r\n    border-bottom: 1px solid #e6e6e6;\r\n    border-top: 1px solid #e6e6e6;\r\n}\r\n.dx-datagrid-rowsview .dx-selection.dx-row.dx-column-lines > td,\r\n.dx-datagrid-rowsview .dx-selection.dx-row:hover.dx-column-lines > td {\r\n    border-left-color: #ddd;\r\n    border-right-color: #ddd;\r\n}\r\n.dx-datagrid-rowsview .dx-selection.dx-row.dx-row-lines > td,\r\n.dx-datagrid-rowsview .dx-selection.dx-row:hover.dx-row-lines > td {\r\n    border-bottom-color: #ddd;\r\n}\r\n.dx-datagrid-rowsview.dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-both .dx-scrollable-content {\r\n    padding-right: 0;\r\n}\r\n.dx-datagrid-group-opened {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    color: #959595;\r\n}\r\n.dx-datagrid-group-opened:before {\r\n    content: '\\F001';\r\n}\r\n.dx-datagrid-group-closed {\r\n    font: 14px/1 DXIcons;\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    color: #959595;\r\n}\r\n.dx-datagrid-group-closed:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-datagrid-group-opened,\r\n.dx-datagrid-group-closed {\r\n    width: 100%;\r\n}\r\n.dx-datagrid-search-text {\r\n    color: #fff;\r\n    background-color: #337ab7;\r\n}\r\n.dx-datagrid-nodata {\r\n    color: #999999;\r\n    font-size: 17px;\r\n}\r\n.dx-datagrid-bottom-load-panel {\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-datagrid-pager {\r\n    border-top: 3px double #ddd;\r\n}\r\n.dx-datagrid-pager.dx-widget {\r\n    color: #333;\r\n}\r\n.dx-datagrid-summary-item {\r\n    color: rgba(51, 51, 51, 0.7);\r\n}\r\n.dx-datagrid-total-footer {\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-row.dx-datagrid-group-footer.dx-column-lines {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-row.dx-datagrid-group-footer > td {\r\n    background-color: #fff;\r\n    border-top: 1px solid #ddd;\r\n    border-left-width: 0;\r\n    border-right-width: 0;\r\n}\r\n.dx-datagrid-revert-tooltip .dx-overlay-content {\r\n    background-color: #fff;\r\n    min-width: inherit;\r\n}\r\n.dx-datagrid-revert-tooltip .dx-revert-button {\r\n    margin: 0px 1px;\r\n    margin-left: 1px;\r\n    background-color: #d9534f;\r\n    border-color: #d43f3a;\r\n    color: #fff;\r\n}\r\n.dx-datagrid-revert-tooltip .dx-revert-button .dx-icon {\r\n    color: #fff;\r\n}\r\n.dx-datagrid-revert-tooltip .dx-revert-button.dx-state-hover {\r\n    background-color: #c9302c;\r\n    border-color: #ac2925;\r\n}\r\n.dx-datagrid-revert-tooltip .dx-revert-button.dx-state-focused {\r\n    background-color: #c9302c;\r\n    border-color: #761c19;\r\n}\r\n.dx-datagrid-revert-tooltip .dx-revert-button.dx-state-active {\r\n    background-color: #8b211e;\r\n    border-color: #761c19;\r\n    color: #fff;\r\n}\r\n.dx-datagrid-revert-tooltip .dx-revert-button > .dx-button-content {\r\n    padding: 4px;\r\n}\r\n.dx-toolbar-menu-section .dx-datagrid-checkbox-size {\r\n    width: 100%;\r\n}\r\n.dx-toolbar-menu-section .dx-datagrid-checkbox-size .dx-checkbox-container {\r\n    padding: 14px;\r\n}\r\n.dx-toolbar-menu-section .dx-datagrid-checkbox-size .dx-checkbox-text {\r\n    padding-left: 34px;\r\n}\r\n.dx-rtl .dx-toolbar-menu-section .dx-checkbox-text {\r\n    padding-right: 34px;\r\n    padding-left: 27px;\r\n}\r\n.dx-rtl .dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row) > td:not(.dx-focused).dx-datagrid-group-space {\r\n    border-left-color: #f5f5f5;\r\n    border-right-color: transparent;\r\n}\r\n.dx-rtl .dx-datagrid .dx-menu .dx-menu-item-has-submenu.dx-menu-item-has-icon .dx-icon {\r\n    margin: 0px 3px;\r\n}\r\n.dx-rtl .dx-datagrid .dx-datagrid-filter-row td .dx-editor-container .dx-filter-range-content {\r\n    padding: 5px 24px 5px 5px;\r\n}\r\n.dx-rtl .dx-datagrid-rowsview .dx-selection.dx-row > td:not(.dx-focused).dx-datagrid-group-space,\r\n.dx-rtl .dx-datagrid-rowsview .dx-selection.dx-row:hover > td:not(.dx-focused).dx-datagrid-group-space {\r\n    border-left-color: #e6e6e6;\r\n}\r\n.dx-rtl .dx-datagrid-rowsview .dx-selection.dx-row > td,\r\n.dx-rtl .dx-datagrid-rowsview .dx-selection.dx-row:hover > td {\r\n    border-right-color: #ddd;\r\n}\r\n.dx-rtl .dx-datagrid-rowsview .dx-selection.dx-row > td.dx-pointer-events-none,\r\n.dx-rtl .dx-datagrid-rowsview .dx-selection.dx-row:hover > td.dx-pointer-events-none {\r\n    border-left-color: #ddd;\r\n}\r\n.dx-rtl .dx-datagrid-rowsview.dx-scrollable-scrollbars-alwaysvisible.dx-scrollable-both .dx-scrollable-content {\r\n    padding-left: 0;\r\n}\r\n.dx-rtl .dx-datagrid-group-panel .dx-group-panel-item,\r\n.dx-rtl .dx-datagrid-group-panel .dx-block-separator {\r\n    margin-left: 5px;\r\n}\r\n.dx-datagrid-table-fixed .dx-row.dx-group-row td {\r\n    background-color: #f7f7f7;\r\n}\r\n.dx-pivotgrid {\r\n    background-color: #fff;\r\n}\r\n.dx-pivotgrid .dx-area-description-cell .dx-button-content {\r\n    padding: 5px;\r\n}\r\n.dx-pivotgrid .dx-column-header .dx-pivotgrid-toolbar .dx-button-content,\r\n.dx-pivotgrid .dx-filter-header .dx-pivotgrid-toolbar .dx-button-content {\r\n    padding: 5px;\r\n}\r\n.dx-pivotgrid .dx-column-header .dx-pivotgrid-toolbar .dx-button,\r\n.dx-pivotgrid .dx-filter-header .dx-pivotgrid-toolbar .dx-button {\r\n    margin-top: 10px;\r\n}\r\n.dx-pivotgrid .dx-expand-icon-container {\r\n    font: 14px/1 DXIcons;\r\n}\r\n.dx-pivotgrid .dx-expand-icon-container:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-pivotgrid .dx-expand-icon-container:before {\r\n    visibility: hidden;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-collapsed .dx-expand {\r\n    font: 14px/1 DXIcons;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    color: #959595;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-collapsed .dx-expand:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-collapsed .dx-expand:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-expanded .dx-expand {\r\n    font: 14px/1 DXIcons;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n    color: #959595;\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-expanded .dx-expand:before {\r\n    content: '\\F001';\r\n}\r\n.dx-pivotgrid .dx-pivotgrid-expanded .dx-expand:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-pivotgrid .dx-area-tree-view td.dx-white-space-column {\r\n    width: 16px;\r\n    min-width: 16px;\r\n}\r\n.dx-pivotgridfieldchooser {\r\n    background-color: #fff;\r\n}\r\n.dx-pivotgrid-fields-container .dx-position-indicator {\r\n    background-color: gray;\r\n}\r\n.dx-menu-item {\r\n    color: #333;\r\n}\r\n.dx-menu-item.dx-state-hover {\r\n    background-color: #f5f5f5;\r\n}\r\n.dx-menu-item.dx-state-focused {\r\n    background-color: #337ab7;\r\n    color: #fff;\r\n}\r\n.dx-menu-item.dx-menu-item-has-text .dx-icon {\r\n    margin-right: -14px;\r\n}\r\n.dx-menu-item-selected {\r\n    background-color: #e6e6e6;\r\n    color: #333;\r\n}\r\n.dx-menu-item-selected.dx-state-focused {\r\n    background-color: rgba(51, 122, 183, 0.7);\r\n    color: #fff;\r\n}\r\n.dx-menu-item-expanded {\r\n    color: #333;\r\n    background-color: #f5f5f5;\r\n}\r\n.dx-menu-item.dx-state-focused,\r\n.dx-menu-item.dx-state-active,\r\n.dx-menu-item-expanded {\r\n    outline: none;\r\n}\r\n.dx-menu-base {\r\n    color: #333;\r\n    font-weight: normal;\r\n    font-size: 12px;\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-menu-base input,\r\n.dx-menu-base textarea {\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-menu-base.dx-state-focused {\r\n    outline: none;\r\n}\r\n.dx-menu-base .dx-icon {\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-menu-base .dx-menu-item-content {\r\n    padding: 1px 3px 5px;\r\n}\r\n.dx-menu-base .dx-menu-item-content .dx-menu-item-text {\r\n    padding: 0 23px 3px 17px;\r\n}\r\n.dx-menu-base .dx-menu-item-content .dx-menu-item-popout {\r\n    min-width: 7px;\r\n    min-height: 7px;\r\n}\r\n.dx-menu-base.dx-rtl .dx-menu-item-content .dx-menu-item-text {\r\n    padding: 0 17px 3px 23px;\r\n}\r\n.dx-menu-base.dx-rtl .dx-menu-item-content .dx-icon {\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}\r\n.dx-menu-base.dx-rtl .dx-menu-item-content .dx-menu-item-popout-container {\r\n    margin-left: 0;\r\n    margin-right: auto;\r\n}\r\n.dx-menu-base.dx-rtl .dx-menu-item-content .dx-menu-item-popout-container .dx-menu-item-popout {\r\n    -moz-transform: scaleX(-1);\r\n    -o-transform: scaleX(-1);\r\n    -webkit-transform: scaleX(-1);\r\n    transform: scaleX(-1);\r\n}\r\n.dx-menu-base.dx-rtl .dx-menu-item-has-text .dx-icon {\r\n    margin-left: -14px;\r\n}\r\n.dx-context-menu-container-border {\r\n    background-color: transparent;\r\n    border: 1px solid #ddd;\r\n    -webkit-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);\r\n    -moz-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);\r\n    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);\r\n}\r\n.dx-context-menu-content-delimiter {\r\n    background-color: #fff;\r\n}\r\n.dx-menu {\r\n    color: #333;\r\n}\r\n.dx-menu .dx-menu-item-expanded {\r\n    background-color: #fff;\r\n}\r\n.dx-menu .dx-menu-item-has-icon.dx-menu-item-has-submenu .dx-icon {\r\n    margin: 0 17px 0 1px;\r\n}\r\n.dx-menu .dx-menu-item-has-text .dx-menu-item-text {\r\n    padding: 0 3px;\r\n}\r\n.dx-menu .dx-menu-item-has-text.dx-menu-item-has-icon .dx-icon {\r\n    margin: 0 1px;\r\n}\r\n.dx-menu .dx-menu-item-has-text.dx-menu-item-has-submenu .dx-menu-item-text {\r\n    padding: 0 17px 3px 3px;\r\n}\r\n.dx-menu .dx-menu-horizontal .dx-menu-item-popout {\r\n    font: 14px/1 DXIcons;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-menu .dx-menu-horizontal .dx-menu-item-popout:before {\r\n    content: '\\F001';\r\n}\r\n.dx-menu .dx-menu-horizontal .dx-menu-item-popout:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-menu .dx-menu-vertical .dx-menu-item-popout {\r\n    font: 14px/1 DXIcons;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-menu .dx-menu-vertical .dx-menu-item-popout:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-menu .dx-menu-vertical .dx-menu-item-popout:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-menu.dx-rtl .dx-menu-item-has-icon.dx-menu-item-has-submenu .dx-icon {\r\n    margin: 0 1px 0 17px;\r\n}\r\n.dx-menu.dx-rtl .dx-menu-item-has-text .dx-menu-item-text {\r\n    padding: 0 3px 3px 0;\r\n}\r\n.dx-menu.dx-rtl .dx-menu-item-has-text.dx-menu-item-has-submenu .dx-menu-item-text {\r\n    padding: 0 3px 3px 17px;\r\n}\r\n.dx-menu-adaptive-mode {\r\n    background-color: #fff;\r\n}\r\n.dx-menu-adaptive-mode .dx-treeview {\r\n    border: 1px solid #ddd;\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n}\r\n.dx-menu-adaptive-mode .dx-treeview,\r\n.dx-menu-adaptive-mode .dx-treeview.dx-state-focused {\r\n    -webkit-box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n    -moz-box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);\r\n}\r\n.dx-menu-adaptive-mode .dx-treeview .dx-treeview-toggle-item-visibility {\r\n    font-size: 18px;\r\n}\r\n.dx-menu-adaptive-mode .dx-treeview .dx-treeview-node.dx-state-focused .dx-treeview-node .dx-treeview-toggle-item-visibility {\r\n    color: inherit;\r\n}\r\n.dx-menu-adaptive-mode .dx-treeview-node.dx-state-focused .dx-treeview-toggle-item-visibility {\r\n    color: #fff;\r\n}\r\n.dx-menu-adaptive-mode .dx-treeview-node-container:first-child > .dx-treeview-node {\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n.dx-context-menu {\r\n    color: #333;\r\n}\r\n.dx-context-menu.dx-overlay-content.dx-state-focused {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-context-menu .dx-submenu {\r\n    background-color: #fff;\r\n    border: 1px solid #ddd;\r\n    -webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);\r\n    -moz-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);\r\n    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);\r\n}\r\n.dx-context-menu .dx-menu-item-popout {\r\n    font: 14px/1 DXIcons;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-context-menu .dx-menu-item-popout:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-context-menu .dx-menu-item-popout:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 14px;\r\n    top: 50%;\r\n    margin-top: -7px;\r\n    left: 50%;\r\n    margin-left: -7px;\r\n}\r\n.dx-context-menu .dx-menu-separator {\r\n    background-color: #ddd;\r\n}\r\n.dx-context-menu .dx-menu-no-icons > .dx-menu-item-wrapper > .dx-menu-item > .dx-menu-item-content .dx-menu-item-text {\r\n    padding-left: 3px;\r\n}\r\n.dx-rtl .dx-context-menu .dx-menu-no-icons > .dx-menu-item-wrapper > .dx-menu-item > .dx-menu-item-content .dx-menu-item-text,\r\n.dx-rtl.dx-context-menu .dx-menu-no-icons > .dx-menu-item-wrapper > .dx-menu-item > .dx-menu-item-content .dx-menu-item-text {\r\n    padding-right: 3px;\r\n    padding-left: 23px;\r\n}\r\n.dx-context-menu.dx-rtl .dx-menu-item-content {\r\n    padding: 3px 1px 3px 3px;\r\n}\r\n.dx-context-menu.dx-rtl .dx-menu-item-content .dx-menu-item-text {\r\n    padding: 0 17px 3px 23px;\r\n}\r\n.dx-calendar {\r\n    width: 232px;\r\n    min-width: 232px;\r\n    height: 225.4px;\r\n    min-height: 225.4px;\r\n    background-color: #fff;\r\n    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n    outline: 0;\r\n    border: 1px solid transparent;\r\n}\r\n.dx-calendar.dx-calendar-with-footer {\r\n    height: 270.4px;\r\n    min-height: 240.4px;\r\n}\r\n.dx-calendar.dx-calendar-with-footer .dx-calendar-body {\r\n    bottom: 45px;\r\n}\r\n.dx-calendar.dx-calendar-with-footer .dx-calendar-footer {\r\n    text-align: center;\r\n    height: 35px;\r\n    width: 100%;\r\n}\r\n.dx-calendar.dx-calendar-with-footer .dx-calendar-footer .dx-button {\r\n    background: none;\r\n}\r\n.dx-calendar.dx-calendar-with-footer .dx-calendar-footer .dx-button.dx-state-active {\r\n    background-color: #d4d4d4;\r\n}\r\n.dx-calendar-navigator {\r\n    line-height: 1.6;\r\n    height: 30px;\r\n    display: table;\r\n    border-collapse: collapse;\r\n}\r\n.dx-calendar-navigator .dx-button {\r\n    height: 100%;\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n    display: table-cell;\r\n    border-color: #ddd;\r\n}\r\n.dx-calendar-navigator .dx-button .dx-icon {\r\n    font-size: 14px;\r\n}\r\n.dx-calendar-navigator .dx-button.dx-calendar-disabled-navigator-link {\r\n    border-collapse: collapse;\r\n    visibility: visible;\r\n    opacity: 1;\r\n}\r\n.dx-calendar-navigator .dx-button.dx-calendar-disabled-navigator-link .dx-button-content {\r\n    opacity: .5;\r\n}\r\n.dx-calendar-navigator .dx-button.dx-state-active:not(.dx-calendar-disabled-navigator-link) {\r\n    z-index: 1;\r\n}\r\n.dx-calendar-navigator .dx-button.dx-state-hover:not(.dx-calendar-disabled-navigator-link) {\r\n    z-index: 1;\r\n    border-color: #bebebe;\r\n}\r\n.dx-calendar-navigator .dx-calendar-caption-button {\r\n    font-size: 14px;\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n    text-transform: uppercase;\r\n    right: 24px;\r\n    left: 24px;\r\n}\r\n.dx-calendar-navigator .dx-calendar-caption-button.dx-button.dx-state-active {\r\n    background-color: #d4d4d4;\r\n}\r\n.dx-calendar-navigator .dx-calendar-caption-button.dx-button .dx-button-content {\r\n    padding: 3px 3px;\r\n}\r\n.dx-calendar-navigator-previous-month {\r\n    width: 24px;\r\n    background: none;\r\n}\r\n.dx-calendar-navigator-previous-month.dx-button {\r\n    margin: 0 2px;\r\n}\r\n.dx-calendar-navigator-previous-month .dx-button-content {\r\n    padding: 0;\r\n}\r\n.dx-calendar-navigator-previous-month.dx-state-hover {\r\n    z-index: 1;\r\n}\r\n.dx-calendar-navigator-previous-month,\r\n.dx-calendar-navigator-next-view {\r\n    width: 24px;\r\n    background: none;\r\n}\r\n.dx-calendar-navigator-previous-month.dx-button,\r\n.dx-calendar-navigator-next-view.dx-button {\r\n    margin: 0px 1px;\r\n}\r\n.dx-calendar-navigator-previous-month .dx-button-content,\r\n.dx-calendar-navigator-next-view .dx-button-content {\r\n    padding: 0;\r\n}\r\n.dx-calendar-navigator-previous-view,\r\n.dx-calendar-navigator-previous-month {\r\n    left: 0px;\r\n}\r\n.dx-calendar-navigator-previous-view.dx-button,\r\n.dx-calendar-navigator-previous-month.dx-button {\r\n    -webkit-border-radius: 0 0 0 0;\r\n    -moz-border-radius: 0 0 0 0;\r\n    border-radius: 0 0 0 0;\r\n}\r\n.dx-calendar-navigator-previous-view.dx-button .dx-icon,\r\n.dx-calendar-navigator-previous-month.dx-button .dx-icon {\r\n    color: #337ab7;\r\n}\r\n.dx-calendar-navigator-next-view,\r\n.dx-calendar-navigator-next-month {\r\n    right: 0px;\r\n}\r\n.dx-calendar-navigator-next-view.dx-button,\r\n.dx-calendar-navigator-next-month.dx-button {\r\n    -webkit-border-radius: 0 0 0 0;\r\n    -moz-border-radius: 0 0 0 0;\r\n    border-radius: 0 0 0 0;\r\n}\r\n.dx-calendar-navigator-next-view.dx-button .dx-icon,\r\n.dx-calendar-navigator-next-month.dx-button .dx-icon {\r\n    color: #337ab7;\r\n}\r\n.dx-calendar-body {\r\n    top: 42px;\r\n}\r\n.dx-calendar-body thead {\r\n    font-size: 10px;\r\n    font-weight: bold;\r\n    text-transform: uppercase;\r\n    line-height: 1.2;\r\n}\r\n.dx-calendar-body thead tr {\r\n    height: 25px;\r\n    padding-bottom: 10px;\r\n}\r\n.dx-calendar-body thead tr th {\r\n    -webkit-box-shadow: inset 0px -1px 0px #ddd;\r\n    -moz-box-shadow: inset 0px -1px 0px #ddd;\r\n    box-shadow: inset 0px -1px 0px #ddd;\r\n    color: #999999;\r\n}\r\n.dx-calendar-body table {\r\n    border-spacing: 0px;\r\n}\r\n.dx-calendar-body table th {\r\n    color: #999999;\r\n    text-align: center;\r\n    font-size: 10px;\r\n    padding: 1px 0 2px 0;\r\n}\r\n.dx-calendar-cell {\r\n    text-align: center;\r\n    padding: 1px 3px 2px;\r\n    color: #333;\r\n    font-size: 13px;\r\n    border: 1px double transparent;\r\n    width: 39px;\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n}\r\n.dx-calendar-cell.dx-calendar-today {\r\n    text-shadow: 0 1px 0 #333;\r\n}\r\n.dx-calendar-cell.dx-state-hover {\r\n    -webkit-box-shadow: inset 0px -1px 0px 1000px #f5f5f5;\r\n    -moz-box-shadow: inset 0px -1px 0px 1000px #f5f5f5;\r\n    box-shadow: inset 0px -1px 0px 1000px #f5f5f5;\r\n    color: #333;\r\n}\r\n.dx-calendar-cell.dx-calendar-other-view,\r\n.dx-calendar-cell.dx-calendar-empty-cell {\r\n    color: #b0b0b0;\r\n}\r\n.dx-calendar-cell.dx-calendar-other-view.dx-state-hover,\r\n.dx-calendar-cell.dx-calendar-empty-cell.dx-state-hover,\r\n.dx-calendar-cell.dx-calendar-other-view.dx-state-active,\r\n.dx-calendar-cell.dx-calendar-empty-cell.dx-state-active {\r\n    color: #b0b0b0;\r\n}\r\n.dx-calendar-cell.dx-calendar-empty-cell {\r\n    cursor: default;\r\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAm0lEQVRIx7XVwQnAIAwF0ExSdBF1a6Er9dIRqsVAazWJmh4+iuBT4YMQ4w4pWxk1clt5YlOOFKeAumJZXAgKOKIBb6yBv9AansU/aAsexZtoD5biXZSCOZxEObiHs6gErnERKoURP0uCZM9IpRB2WvDz+eIqzvRUhMNkT1mcQz1xsKfwWZTFV1ASX0W7uAbaxPOCUUBr3MBfn+kF3CNLT2/yky4AAAAASUVORK5CYII=) center center no-repeat;\r\n}\r\n.dx-calendar-cell.dx-calendar-empty-cell.dx-state-hover {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-calendar-cell.dx-state-active:not(.dx-calendar-empty-cell):not(.dx-calendar-selected-date) {\r\n    -webkit-box-shadow: inset 0px -1px 0px 1000px rgba(96, 96, 96, 0.2);\r\n    -moz-box-shadow: inset 0px -1px 0px 1000px rgba(96, 96, 96, 0.2);\r\n    box-shadow: inset 0px -1px 0px 1000px rgba(96, 96, 96, 0.2);\r\n}\r\n.dx-calendar-cell.dx-calendar-contoured-date {\r\n    -webkit-box-shadow: inset 0px 0px 0px 1px #bebebe;\r\n    -moz-box-shadow: inset 0px 0px 0px 1px #bebebe;\r\n    box-shadow: inset 0px 0px 0px 1px #bebebe;\r\n}\r\n.dx-calendar-cell.dx-calendar-selected-date,\r\n.dx-calendar-cell.dx-calendar-selected-date.dx-calendar-today {\r\n    color: #fff;\r\n    -webkit-box-shadow: inset 0px 0px 0px 1000px #337ab7;\r\n    -moz-box-shadow: inset 0px 0px 0px 1000px #337ab7;\r\n    box-shadow: inset 0px 0px 0px 1000px #337ab7;\r\n    text-shadow: 0 1px 0 #fff;\r\n    font-weight: normal;\r\n}\r\n.dx-calendar-cell.dx-calendar-selected-date.dx-calendar-contoured-date,\r\n.dx-calendar-cell.dx-calendar-selected-date.dx-calendar-today.dx-calendar-contoured-date {\r\n    box-shadow: inset 0px 0px 0px 1px #bebebe, inset 0px 0px 0px 1000px #337ab7;\r\n}\r\n.dx-state-focused.dx-calendar {\r\n    -webkit-box-shadow: none;\r\n    -moz-box-shadow: none;\r\n    box-shadow: none;\r\n}\r\n.dx-invalid.dx-calendar {\r\n    border-color: rgba(217, 83, 79, 0.4);\r\n}\r\n.dx-invalid.dx-calendar.dx-state-focused {\r\n    border-color: #d9534f;\r\n}\r\n.dx-popup-wrapper .dx-calendar .dx-calendar-caption-button {\r\n    margin: 0;\r\n}\r\n.dx-treeview-node-loadindicator {\r\n    top: 8px;\r\n    left: -1px;\r\n    width: 11px;\r\n    height: 11px;\r\n}\r\n.dx-treeview.dx-treeview-border-visible {\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-treeview.dx-treeview-border-visible .dx-treeview-select-all-item {\r\n    padding-left: 20px;\r\n}\r\n.dx-treeview.dx-treeview-border-visible .dx-scrollable-content > .dx-treeview-node-container {\r\n    padding: 1px 1px 1px 6px;\r\n}\r\n.dx-treeview .dx-treeview-select-all-item {\r\n    margin: 0 0 6px 0;\r\n    border-bottom: 1px solid #ddd;\r\n    padding: 6px 0 8px 15px;\r\n}\r\n.dx-treeview .dx-treeview-select-all-item .dx-checkbox-text {\r\n    padding-left: 26px;\r\n}\r\n.dx-treeview .dx-treeview-node {\r\n    padding-left: 10px;\r\n}\r\n.dx-treeview .dx-treeview-node.dx-state-selected > .dx-treeview-item {\r\n    color: #333;\r\n}\r\n.dx-treeview .dx-treeview-node.dx-treeview-item-with-checkbox .dx-treeview-item {\r\n    color: #333;\r\n    padding-left: 31px;\r\n}\r\n.dx-treeview .dx-treeview-node.dx-treeview-item-with-checkbox .dx-checkbox {\r\n    top: 5px;\r\n    left: 14px;\r\n}\r\n.dx-treeview .dx-treeview-node.dx-treeview-item-with-checkbox.dx-state-focused > .dx-checkbox .dx-checkbox-icon {\r\n    border: 1px solid #337ab7;\r\n}\r\n.dx-treeview .dx-treeview-node:not(.dx-treeview-item-with-checkbox).dx-state-selected > .dx-treeview-item {\r\n    color: #333;\r\n    background-color: #e6e6e6;\r\n}\r\n.dx-treeview .dx-treeview-node:not(.dx-treeview-item-with-checkbox).dx-state-focused > .dx-treeview-item {\r\n    background-color: #337ab7;\r\n}\r\n.dx-treeview .dx-treeview-node:not(.dx-treeview-item-with-checkbox).dx-state-focused > .dx-treeview-item * {\r\n    color: #fff;\r\n}\r\n.dx-treeview .dx-treeview-item {\r\n    padding: 4px 6px;\r\n    min-height: 28px;\r\n}\r\n.dx-treeview .dx-treeview-item .dx-icon {\r\n    width: 14px;\r\n    height: 14px;\r\n    background-position: 0px 0px;\r\n    -webkit-background-size: 14px 14px;\r\n    -moz-background-size: 14px 14px;\r\n    background-size: 14px 14px;\r\n    padding: 0px;\r\n    font-size: 14px;\r\n    text-align: center;\r\n    line-height: 14px;\r\n}\r\n.dx-treeview .dx-treeview-item.dx-state-hover {\r\n    background-color: #f5f5f5;\r\n    color: #333;\r\n}\r\n.dx-treeview .dx-treeview-toggle-item-visibility {\r\n    font: 14px/1 DXIcons;\r\n    font-size: 18px;\r\n    text-align: center;\r\n    line-height: 18px;\r\n    color: #333;\r\n    width: 16px;\r\n    height: 28px;\r\n    top: 0;\r\n    left: -4px;\r\n}\r\n.dx-treeview .dx-treeview-toggle-item-visibility:before {\r\n    content: '\\F04E';\r\n}\r\n.dx-treeview .dx-treeview-toggle-item-visibility:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 18px;\r\n    top: 50%;\r\n    margin-top: -9px;\r\n    left: 50%;\r\n    margin-left: -9px;\r\n}\r\n.dx-treeview .dx-treeview-toggle-item-visibility.dx-treeview-toggle-item-visibility-opened {\r\n    font: 14px/1 DXIcons;\r\n    font-size: 18px;\r\n    text-align: center;\r\n    line-height: 18px;\r\n}\r\n.dx-treeview .dx-treeview-toggle-item-visibility.dx-treeview-toggle-item-visibility-opened:before {\r\n    content: '\\F001';\r\n}\r\n.dx-treeview .dx-treeview-toggle-item-visibility.dx-treeview-toggle-item-visibility-opened:before {\r\n    position: absolute;\r\n    display: block;\r\n    width: 18px;\r\n    top: 50%;\r\n    margin-top: -9px;\r\n    left: 50%;\r\n    margin-left: -9px;\r\n}\r\n.dx-treeview.dx-rtl .dx-loadindicator {\r\n    left: auto;\r\n    right: 0px;\r\n}\r\n.dx-treeview.dx-rtl.dx-treeview-border-visible .dx-treeview-select-all-item {\r\n    padding-left: 0;\r\n    padding-right: 20px;\r\n}\r\n.dx-treeview.dx-rtl.dx-treeview-border-visible .dx-scrollable-content > .dx-treeview-node-container {\r\n    padding-left: 1px;\r\n    padding-right: 6px;\r\n}\r\n.dx-treeview.dx-rtl .dx-treeview-node {\r\n    padding-right: 10px;\r\n}\r\n.dx-treeview.dx-rtl .dx-treeview-item .dx-icon {\r\n    margin-left: 5px;\r\n}\r\n.dx-treeview.dx-rtl .dx-treeview-item-with-checkbox .dx-treeview-item {\r\n    padding-right: 31px;\r\n}\r\n.dx-treeview.dx-rtl .dx-treeview-item-with-checkbox .dx-checkbox {\r\n    right: 14px;\r\n}\r\n.dx-treeview.dx-rtl .dx-treeview-select-all-item {\r\n    padding-left: 0;\r\n    padding-right: 14px;\r\n}\r\n.dx-treeview.dx-rtl .dx-treeview-select-all-item .dx-checkbox-text {\r\n    padding-left: 0;\r\n    padding-right: 26px;\r\n}\r\n.dx-treeview.dx-rtl.dx-rtl .dx-treeview-node .dx-checkbox {\r\n    left: auto;\r\n}\r\n.dx-treeview.dx-rtl .dx-treeview-toggle-item-visibility {\r\n    right: -4px;\r\n}\r\n.dx-treeview.dx-rtl .dx-treeview-item-with-checkbox .dx-checkbox {\r\n    overflow: visible;\r\n}\r\n.dx-field {\r\n    color: #333;\r\n    font-weight: normal;\r\n    font-size: 12px;\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-field input,\r\n.dx-field textarea {\r\n    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Verdana, sans-serif;\r\n    line-height: 1.33334;\r\n}\r\n.dx-field-label {\r\n    color: #333;\r\n    cursor: default;\r\n}\r\n.dx-field-value.dx-attention {\r\n    color: #d9534f;\r\n    padding-left: 22px;\r\n}\r\n.dx-field-value.dx-attention:before {\r\n    pointer-events: none;\r\n    font-weight: bold;\r\n    background-color: #d9534f;\r\n    color: #fff;\r\n    content: '!';\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -8px;\r\n    width: 16px;\r\n    height: 16px;\r\n    -webkit-border-radius: 50%;\r\n    -moz-border-radius: 50%;\r\n    -ms-border-radius: 50%;\r\n    -o-border-radius: 50%;\r\n    border-radius: 50%;\r\n    text-align: center;\r\n    line-height: 16px;\r\n    font-size: 11px;\r\n}\r\n.dx-field-value:not(.dx-switch):not(.dx-checkbox):not(.dx-button),\r\n.dx-field-value-static {\r\n    width: 60%;\r\n}\r\n.dx-field-label {\r\n    padding: 5px 8px 5px 0;\r\n}\r\n.dx-field {\r\n    min-height: 26px;\r\n    padding: 0;\r\n}\r\n.dx-field-value.dx-widget,\r\n.dx-field-value:not(.dx-widget) > .dx-widget {\r\n    margin: 0;\r\n}\r\n.dx-field-value:not(.dx-widget) > .dx-button,\r\n.dx-field-value:not(.dx-widget) > .dx-checkbox,\r\n.dx-field-value:not(.dx-widget) > .dx-switch {\r\n    float: right;\r\n}\r\n.dx-field-value.dx-checkbox,\r\n.dx-field-value:not(.dx-widget) > .dx-checkbox {\r\n    margin: 5px 0;\r\n}\r\n.dx-field-value.dx-switch,\r\n.dx-field-value:not(.dx-widget) > .dx-switch {\r\n    margin: 4px 0;\r\n}\r\n.dx-field-value.dx-slider,\r\n.dx-field-value:not(.dx-widget) > .dx-slider {\r\n    margin: 3px 0;\r\n}\r\n.dx-field-value.dx-radiogroup,\r\n.dx-field-value:not(.dx-widget) > .dx-radiogroup {\r\n    margin: 3px 0;\r\n}\r\n.dx-field-value.dx-attention {\r\n    padding: 5px 6px 5px;\r\n    position: relative;\r\n    padding-left: 22px;\r\n}\r\n.dx-field-value.dx-attention:before {\r\n    left: 0;\r\n}\r\n.dx-field-value-static {\r\n    padding: 5px 6px 5px;\r\n}\r\n.dx-fieldset {\r\n    margin: 15px 10px;\r\n    padding: 0;\r\n}\r\n.dx-rtl.dx-fieldset .dx-field-value:not(.dx-widget) > .dx-button,\r\n.dx-rtl .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-button,\r\n.dx-rtl.dx-fieldset .dx-field-value:not(.dx-widget) > .dx-checkbox,\r\n.dx-rtl .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-checkbox,\r\n.dx-rtl.dx-fieldset .dx-field-value:not(.dx-widget) > .dx-switch,\r\n.dx-rtl .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-switch {\r\n    float: left;\r\n}\r\n.dx-fieldset-header {\r\n    margin: 0 0 10px 0;\r\n    font-weight: 500;\r\n    font-size: 16px;\r\n}\r\n.dx-field {\r\n    margin: 0 0 5px 0;\r\n}\r\n.dx-field:last-of-type {\r\n    margin: 0;\r\n}\r\n.dx-device-mobile .dx-fieldset {\r\n    margin: 20px 15px;\r\n    padding: 0;\r\n}\r\n.dx-rtl.dx-device-mobile .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-button,\r\n.dx-rtl .dx-device-mobile .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-button,\r\n.dx-rtl.dx-device-mobile .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-checkbox,\r\n.dx-rtl .dx-device-mobile .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-checkbox,\r\n.dx-rtl.dx-device-mobile .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-switch,\r\n.dx-rtl .dx-device-mobile .dx-fieldset .dx-field-value:not(.dx-widget) > .dx-switch {\r\n    float: left;\r\n}\r\n.dx-device-mobile .dx-fieldset-header {\r\n    margin: 0 0 20px 0;\r\n    font-weight: 500;\r\n    font-size: 16px;\r\n}\r\n.dx-device-mobile .dx-field {\r\n    margin: 0 0 10px 0;\r\n}\r\n.dx-device-mobile .dx-field:last-of-type {\r\n    margin: 0;\r\n}\r\n.dx-tabpanel .dx-tabs {\r\n    display: block;\r\n    border-bottom: none;\r\n    background-color: #f7f7f7;\r\n}\r\n.dx-empty-collection.dx-tabpanel .dx-tabs {\r\n    border-top: none;\r\n}\r\n.dx-tabpanel .dx-tab {\r\n    width: 140px;\r\n}\r\n.dx-tabpanel .dx-tab:not(.dx-tab-selected):not(.dx-state-hover) {\r\n    background: none;\r\n}\r\n.dx-tabpanel .dx-tab-selected:before {\r\n    content: '';\r\n    pointer-events: none;\r\n    position: absolute;\r\n    top: 100%;\r\n    bottom: -1px;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 2;\r\n    height: 0;\r\n    border-bottom: 1.5px solid #fff;\r\n    bottom: -1.4px;\r\n}\r\n.dx-tabpanel .dx-tabs-wrapper {\r\n    display: block;\r\n}\r\n.dx-tabpanel.dx-state-focused .dx-multiview-wrapper {\r\n    border: 1px solid #337ab7;\r\n}\r\n.dx-tabpanel.dx-state-focused .dx-tab:not(.dx-tab-selected):before {\r\n    content: '';\r\n    pointer-events: none;\r\n    position: absolute;\r\n    top: 100%;\r\n    bottom: -1px;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 2;\r\n    height: 0;\r\n    border-bottom: 1.5px solid #337ab7;\r\n    bottom: -1.4px;\r\n}\r\n.dx-tabpanel.dx-state-focused .dx-tab-selected:after {\r\n    border-top: 1px solid #337ab7;\r\n    border-right: 1px solid #337ab7;\r\n    border-left: 1px solid #337ab7;\r\n}\r\n.dx-tabpanel.dx-state-focused .dx-tabs-scrollable .dx-tab-selected:after {\r\n    border-bottom: 1.5px solid #f7f7f7;\r\n}\r\n.dx-tabpanel .dx-multiview-wrapper {\r\n    border: 1px solid #ddd;\r\n}\r\n.dx-fileuploader-wrapper {\r\n    padding: 2px;\r\n}\r\n.dx-fileuploader-content > .dx-fileuploader-upload-button {\r\n    margin-left: 3px;\r\n    margin-right: 3px;\r\n}\r\n.dx-fileuploader-input-wrapper {\r\n    padding: 2px 0 2px;\r\n    border: 3px dashed transparent;\r\n}\r\n.dx-fileuploader.dx-state-disabled .dx-fileuploader-input-label {\r\n    position: relative;\r\n}\r\n.dx-fileuploader-dragover .dx-fileuploader-input-wrapper {\r\n    border: none;\r\n    padding: 0;\r\n}\r\n.dx-fileuploader-dragover .dx-fileuploader-input-wrapper .dx-fileuploader-button {\r\n    display: none;\r\n}\r\n.dx-fileuploader-dragover .dx-fileuploader-input-label {\r\n    text-align: center;\r\n}\r\n.dx-fileuploader-dragover .dx-fileuploader-input-container {\r\n    display: block;\r\n    border: 3px dashed #ddd;\r\n    width: 100%;\r\n}\r\n.dx-fileuploader-dragover .dx-fileuploader-input {\r\n    display: block;\r\n    width: 100%;\r\n    padding: 4px 3px;\r\n    margin-bottom: 1px;\r\n    -webkit-box-sizing: content-box;\r\n    -moz-box-sizing: content-box;\r\n    box-sizing: content-box;\r\n}\r\n.dx-fileuploader-dragover .dx-fileuploader-input-label {\r\n    padding: 4px 4px;\r\n}\r\n.dx-fileuploader-file-status-message,\r\n.dx-fileuploader-file-size {\r\n    color: #999999;\r\n}\r\n.dx-fileuploader-input {\r\n    padding: 2px 0;\r\n}\r\n.dx-fileuploader-input-label {\r\n    padding: 5px 4px;\r\n    color: #333;\r\n    overflow: hidden;\r\n    -o-text-overflow: ellipsis;\r\n    -ms-text-overflow: ellipsis;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n.dx-fileuploader-files-container {\r\n    padding: 12px 3px 0;\r\n}\r\n.dx-fileuploader-empty .dx-fileuploader-files-container {\r\n    padding: 0;\r\n}\r\n.dx-invalid .dx-fileuploader-files-container {\r\n    padding-top: 50px;\r\n}\r\n.dx-fileuploader-files-container .dx-fileuploader-button .dx-button-content {\r\n    padding: 0;\r\n}\r\n.dx-fileuploader-file {\r\n    padding-top: 5px;\r\n    line-height: 13px;\r\n}\r\n.dx-fileuploader-file-name {\r\n    padding-bottom: 1px;\r\n    color: #333;\r\n}\r\n.dx-fileuploader-file-size {\r\n    padding-bottom: 1px;\r\n}\r\n.dx-invalid-message > .dx-overlay-content {\r\n    -webkit-border-radius: 0;\r\n    -moz-border-radius: 0;\r\n    -ms-border-radius: 0;\r\n    -o-border-radius: 0;\r\n    border-radius: 0;\r\n}\r\n.dx-timeview {\r\n    height: auto;\r\n    width: auto;\r\n}\r\n.dx-timeview-clock {\r\n    min-height: 169px;\r\n    min-width: 169px;\r\n    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIxOTFweCIgaGVpZ2h0PSIxOTFweCIgdmlld0JveD0iMCAwIDE5MSAxOTEiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE5MSAxOTEiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjNjM2MzYzIiBkPSJNOTUuNSwwQzQyLjgsMCwwLDQyLjgsMCw5NS41UzQyLjgsMTkxLDk1LjUsMTkxUzE5MSwxNDguMiwxOTEsOTUuNVMxNDguMiwwLDk1LjUsMHogTTk1LjUsMTg3LjYKCWMtNTAuODQ4LDAtOTIuMS00MS4yNS05Mi4xLTkyLjFjMC01MC44NDgsNDEuMjUyLTkyLjEsOTIuMS05Mi4xYzUwLjg1LDAsOTIuMSw0MS4yNTIsOTIuMSw5Mi4xCglDMTg3LjYsMTQ2LjM1LDE0Ni4zNSwxODcuNiw5NS41LDE4Ny42eiIvPgo8Zz4KCTxwYXRoIGZpbGw9IiM2MzYzNjMiIGQ9Ik05Mi45LDEwdjguNkg5MXYtNi41Yy0wLjEsMC4xLTAuMiwwLjItMC40LDAuM2MtMC4yLDAuMS0wLjMsMC4yLTAuNCwwLjJjLTAuMSwwLTAuMywwLjEtMC41LDAuMgoJCWMtMC4yLDAuMS0wLjMsMC4xLTAuNSwwLjF2LTEuNmMwLjUtMC4xLDAuOS0wLjMsMS40LTAuNWMwLjUtMC4yLDAuOC0wLjUsMS4yLTAuN2gxLjFWMTB6Ii8+Cgk8cGF0aCBmaWxsPSIjNjM2MzYzIiBkPSJNOTcuMSwxNy4xaDMuNjAydjEuNWgtNS42VjE4YzAtMC40LDAuMS0wLjgsMC4yLTEuMmMwLjEtMC40LDAuMy0wLjYsMC41LTAuOWMwLjItMC4zLDAuNS0wLjUsMC43LTAuNwoJCWMwLjItMC4yLDAuNS0wLjQsMC43LTAuNmMwLjE5OS0wLjIsMC41LTAuMywwLjYtMC41YzAuMTAyLTAuMiwwLjMwMS0wLjMsMC41LTAuNWMwLjItMC4yLDAuMi0wLjMsMC4zMDEtMC41CgkJYzAuMTAxLTAuMiwwLjEwMS0wLjMsMC4xMDEtMC41YzAtMC40LTAuMTAxLTAuNi0wLjMtMC44Yy0wLjItMC4yLTAuNC0wLjMtMC44MDEtMC4zYy0wLjY5OSwwLTEuMzk5LDAuMy0yLjEwMSwwLjl2LTEuNgoJCWMwLjctMC41LDEuNS0wLjcsMi41LTAuN2MwLjM5OSwwLDAuOCwwLjEsMS4xMDEsMC4yYzAuMzAxLDAuMSwwLjYwMSwwLjMsMC44OTksMC41YzAuMywwLjIsMC4zOTksMC41LDAuNSwwLjgKCQljMC4xMDEsMC4zLDAuMiwwLjYsMC4yLDFzLTAuMTAyLDAuNy0wLjIsMWMtMC4wOTksMC4zLTAuMywwLjYtMC41LDAuOGMtMC4yLDAuMi0wLjM5OSwwLjUtMC43LDAuN2MtMC4zLDAuMi0wLjUsMC40LTAuOCwwLjYKCQljLTAuMiwwLjEtMC4zOTksMC4zLTAuNSwwLjRzLTAuMywwLjMtMC41LDAuNHMtMC4yLDAuMy0wLjMsMC40Qzk3LjEsMTcsOTcuMSwxNyw5Ny4xLDE3LjF6Ii8+CjwvZz4KPGc+Cgk8cGF0aCBmaWxsPSIjNjM2MzYzIiBkPSJNMTUsOTUuNGMwLDAuNy0wLjEsMS40LTAuMiwyYy0wLjEsMC42LTAuNCwxLjEtMC43LDEuNUMxMy44LDk5LjMsMTMuNCw5OS42LDEyLjksOTkuOHMtMSwwLjMtMS41LDAuMwoJCWMtMC43LDAtMS4zLTAuMS0xLjgtMC4zdi0xLjVjMC40LDAuMywxLDAuNCwxLjYsMC40YzAuNiwwLDEuMS0wLjIsMS41LTAuN2MwLjQtMC41LDAuNS0xLjEsMC41LTEuOWwwLDAKCQlDMTIuOCw5Ni43LDEyLjMsOTYuOSwxMS41LDk2LjljLTAuMywwLTAuNy0wLjEwMi0xLTAuMmMtMC4zLTAuMTAxLTAuNS0wLjMtMC44LTAuNWMtMC4zLTAuMi0wLjQtMC41LTAuNS0wLjgKCQljLTAuMS0wLjMtMC4yLTAuNy0wLjItMWMwLTAuNCwwLjEtMC44LDAuMi0xLjJjMC4xLTAuNCwwLjMtMC43LDAuNi0wLjljMC4zLTAuMiwwLjYtMC41LDAuOS0wLjZjMC4zLTAuMSwwLjgtMC4yLDEuMi0wLjIKCQljMC41LDAsMC45LDAuMSwxLjIsMC4zYzAuMywwLjIsMC43LDAuNCwwLjksMC44czAuNSwwLjcsMC42LDEuMlMxNSw5NC44LDE1LDk1LjR6IE0xMy4xLDk0LjRjMC0wLjIsMC0wLjQtMC4xLTAuNgoJCWMtMC4xLTAuMi0wLjEtMC40LTAuMi0wLjVjLTAuMS0wLjEtMC4yLTAuMi0wLjQtMC4zYy0wLjItMC4xLTAuMy0wLjEtMC41LTAuMWMtMC4yLDAtMC4zLDAtMC40LDAuMXMtMC4zLDAuMi0wLjMsMC4zCgkJYzAsMC4xLTAuMiwwLjMtMC4yLDAuNGMwLDAuMS0wLjEsMC40LTAuMSwwLjZjMCwwLjIsMCwwLjQsMC4xLDAuNmMwLjEsMC4yLDAuMSwwLjMsMC4yLDAuNGMwLjEsMC4xLDAuMiwwLjIsMC40LDAuMwoJCWMwLjIsMC4xLDAuMywwLjEsMC41LDAuMWMwLjIsMCwwLjMsMCwwLjQtMC4xczAuMi0wLjIsMC4zLTAuM2MwLjEtMC4xLDAuMi0wLjIsMC4yLTAuNEMxMyw5NC43LDEzLjEsOTQuNiwxMy4xLDk0LjR6Ii8+CjwvZz4KPGc+Cgk8cGF0aCBmaWxsPSIjNjM2MzYzIiBkPSJNMTc2LDk5LjdWOTguMWMwLjYsMC40LDEuMiwwLjYwMiwyLDAuNjAyYzAuNSwwLDAuOC0wLjEwMiwxLjEtMC4zMDFjMC4zMDEtMC4xOTksMC40LTAuNSwwLjQtMC44MDEKCQljMC0wLjM5OC0wLjItMC42OTktMC41LTAuODk4Yy0wLjMtMC4yLTAuOC0wLjMwMS0xLjMtMC4zMDFoLTAuODAyVjk1aDAuNzAxYzEuMTAxLDAsMS42MDEtMC40LDEuNjAxLTEuMWMwLTAuNy0wLjQtMS0xLjMwMi0xCgkJYy0wLjYsMC0xLjEsMC4yLTEuNiwwLjV2LTEuNWMwLjYtMC4zLDEuMzAxLTAuNCwyLjEtMC40YzAuOSwwLDEuNSwwLjIsMiwwLjZzMC43MDEsMC45LDAuNzAxLDEuNWMwLDEuMS0wLjYwMSwxLjgtMS43MDEsMi4xbDAsMAoJCWMwLjYwMiwwLjEsMS4xMDIsMC4zLDEuNCwwLjZzMC41LDAuOCwwLjUsMS4zYzAsMC44MDEtMC4zLDEuNC0wLjksMS45Yy0wLjYsMC41LTEuMzk4LDAuNy0yLjM5OCwwLjcKCQlDMTc3LjIsMTAwLjEsMTc2LjUsMTAwLDE3Niw5OS43eiIvPgo8L2c+CjxnPgoJPHBhdGggZmlsbD0iIzYzNjM2MyIgZD0iTTk4LjUsMTc5LjEwMmMwLDAuMzk4LTAuMSwwLjc5OS0wLjIsMS4xOTlDOTguMiwxODAuNyw5OCwxODEsOTcuNywxODEuMnMtMC42MDEsMC41LTAuOSwwLjYwMQoJCWMtMC4zLDAuMS0wLjcsMC4xOTktMS4yLDAuMTk5Yy0wLjUsMC0wLjktMC4xLTEuMy0wLjNjLTAuNC0wLjItMC43LTAuMzk5LTAuOS0wLjhjLTAuMi0wLjQtMC41LTAuNy0wLjYtMS4yCgkJYy0wLjEtMC41LTAuMi0xLTAuMi0xLjYwMWMwLTAuNjk5LDAuMS0xLjM5OSwwLjMtMmMwLjItMC42MDEsMC40LTEuMTAxLDAuOC0xLjVjMC40LTAuMzk5LDAuNy0wLjY5OSwxLjItMWMwLjUtMC4zLDEtMC4zLDEuNi0wLjMKCQljMC42LDAsMS4yLDAuMTAxLDEuNSwwLjE5OXYxLjVjLTAuNC0wLjE5OS0wLjktMC4zOTktMS40LTAuMzk5Yy0wLjMsMC0wLjYsMC4xMDEtMC44LDAuMmMtMC4yLDAuMTAxLTAuNSwwLjMtMC43LDAuNQoJCWMtMC4yLDAuMTk5LTAuMywwLjUtMC40LDAuOGMtMC4xLDAuMzAxLTAuMiwwLjctMC4yLDEuMTAxbDAsMGMwLjQtMC42MDEsMS0wLjgsMS44LTAuOGMwLjMsMCwwLjcsMC4xLDAuOSwwLjE5OQoJCWMwLjIsMC4xMDEsMC41LDAuMzAxLDAuNywwLjVjMC4xOTksMC4yLDAuMzk4LDAuNSwwLjUsMC44MDFDOTguNSwxNzguMiw5OC41LDE3OC43LDk4LjUsMTc5LjEwMnogTTk2LjcsMTc5LjIKCQljMC0wLjg5OS0wLjQtMS4zOTktMS4xLTEuMzk5Yy0wLjIsMC0wLjMsMC0wLjUsMC4xYy0wLjIsMC4xMDEtMC4zLDAuMjAxLTAuNCwwLjMwMWMtMC4xLDAuMTAxLTAuMiwwLjE5OS0wLjIsMC40CgkJYzAsMC4xOTktMC4xLDAuMjk5LTAuMSwwLjVjMCwwLjE5OSwwLDAuMzk4LDAuMSwwLjZzMC4xLDAuMywwLjIsMC41YzAuMSwwLjE5OSwwLjIsMC4xOTksMC40LDAuM2MwLjIsMC4xMDEsMC4zLDAuMTAxLDAuNSwwLjEwMQoJCWMwLjIsMCwwLjMsMCwwLjUtMC4xMDFjMC4yLTAuMTAxLDAuMzAxLTAuMTk5LDAuMzAxLTAuM2MwLTAuMSwwLjE5OS0wLjMwMSwwLjE5OS0wLjM5OUM5Ni42LDE3OS43LDk2LjcsMTc5LjQsOTYuNywxNzkuMnoiLz4KPC9nPgo8Y2lyY2xlIGZpbGw9IiM2MzYzNjMiIGN4PSI5NSIgY3k9Ijk1IiByPSI3Ii8+Cjwvc3ZnPgo=) no-repeat 50% 50%;\r\n    background-size: 161px;\r\n}\r\n.dx-timeview-hourarrow {\r\n    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI1cHgiIGhlaWdodD0iNTdweCIgdmlld0JveD0iMCAwIDUgNTciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUgNTciIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjNjM2MzYzIiBkPSJNNSw1NGMwLDEuNy0xLjEsMy0yLjUsM1MwLDU1LjcsMCw1NFYzYzAtMS42LDEuMS0zLDIuNS0zUzUsMS40LDUsM1Y1NHoiLz4KPC9zdmc+Cg==);\r\n    background-size: 5px 37px;\r\n}\r\n.dx-timeview-minutearrow {\r\n    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI1cHgiIGhlaWdodD0iNzlweCIgdmlld0JveD0iMCAwIDUgNzkiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUgNzkiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjNjM2MzYzIiBkPSJNNSw3NmMwLDEuNy0xLjEsMy0yLjUsM1MwLDc3LjcsMCw3NlYzYzAtMS42LDEuMS0zLDIuNS0zUzUsMS40LDUsM1Y3NnoiLz4KPC9zdmc+Cg==);\r\n    background-size: 5px 69px;\r\n}\r\n.dx-timeview-time-separator {\r\n    margin: 0 5px;\r\n}\r\n.dx-timeview-field {\r\n    min-height: 32px;\r\n}\r\n.dx-timeview-field .dx-numberbox {\r\n    width: 54px;\r\n}\r\n.dx-timeview-field .dx-numberbox.dx-numberbox-spin-touch-friendly {\r\n    width: 94px;\r\n}\r\n.dx-scheduler-time-panel {\r\n    margin-top: -36px;\r\n}\r\n.dx-scheduler-time-panel-cell {\r\n    height: 72px;\r\n}\r\n.dx-scheduler-date-table-cell {\r\n    height: 36px;\r\n}\r\n.dx-scheduler-all-day-title {\r\n    height: 54px;\r\n    line-height: 54px;\r\n    font-size: 11px;\r\n    font-weight: bold;\r\n    top: 39px;\r\n}\r\n.dx-scheduler-work-space-all-day-collapsed .dx-scheduler-all-day-title {\r\n    height: 18px;\r\n    line-height: 18px;\r\n}\r\n[dx-group-row-count='1'] .dx-scheduler-all-day-title {\r\n    top: 74px;\r\n}\r\n[dx-group-row-count='1'] .dx-scheduler-all-day-title:before {\r\n    top: -19px;\r\n    height: 18px;\r\n}\r\n[dx-group-row-count='2'] .dx-scheduler-all-day-title {\r\n    top: 104px;\r\n}\r\n[dx-group-row-count='2'] .dx-scheduler-all-day-title:before {\r\n    top: -49px;\r\n    height: 48px;\r\n}\r\n[dx-group-row-count='3'] .dx-scheduler-all-day-title {\r\n    top: 134px;\r\n}\r\n[dx-group-row-count='3'] .dx-scheduler-all-day-title:before {\r\n    top: -79px;\r\n    height: 78px;\r\n}\r\n.dx-scheduler-work-space-week .dx-scheduler-all-day-title,\r\n.dx-scheduler-work-space-work-week .dx-scheduler-all-day-title {\r\n    top: 75px;\r\n}\r\n.dx-scheduler-work-space-week[dx-group-row-count='1'] .dx-scheduler-all-day-title,\r\n.dx-scheduler-work-space-work-week[dx-group-row-count='1'] .dx-scheduler-all-day-title {\r\n    top: 105px;\r\n}\r\n.dx-scheduler-work-space-week[dx-group-row-count='1'] .dx-scheduler-all-day-title:before,\r\n.dx-scheduler-work-space-work-week[dx-group-row-count='1'] .dx-scheduler-all-day-title:before {\r\n    top: -50px;\r\n    height: 49px;\r\n}\r\n.dx-scheduler-work-space-week[dx-group-row-count='2'] .dx-scheduler-all-day-title,\r\n.dx-scheduler-work-space-work-week[dx-group-row-count='2'] .dx-scheduler-all-day-title {\r\n    top: 135px;\r\n}\r\n.dx-scheduler-work-space-week[dx-group-row-count='2'] .dx-scheduler-all-day-title:before,\r\n.dx-scheduler-work-space-work-week[dx-group-row-count='2'] .dx-scheduler-all-day-title:before {\r\n    top: -80px;\r\n    height: 79px;\r\n}\r\n.dx-scheduler-work-space-week[dx-group-row-count='3'] .dx-scheduler-all-day-title,\r\n.dx-scheduler-work-space-work-week[dx-group-row-count='3'] .dx-scheduler-all-day-title {\r\n    top: 165px;\r\n}\r\n.dx-scheduler-work-space-week[dx-group-row-count='3'] .dx-scheduler-all-day-title:before,\r\n.dx-scheduler-work-space-work-week[dx-group-row-count='3'] .dx-scheduler-all-day-title:before {\r\n    top: -110px;\r\n    height: 109px;\r\n}\r\n.dx-scheduler-all-day-table {\r\n    height: 54px;\r\n}\r\n.dx-scheduler-work-space-all-day-collapsed .dx-scheduler-all-day-table {\r\n    height: 18px;\r\n}\r\n.dx-scheduler-header-panel {\r\n    margin-top: 5px;\r\n}\r\n.dx-scheduler-header-panel-cell {\r\n    height: 31px;\r\n}\r\n.dx-scheduler-work-space .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 36px;\r\n    margin-bottom: -36px;\r\n}\r\n.dx-scheduler-work-space[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 66px;\r\n    margin-bottom: -66px;\r\n}\r\n.dx-scheduler-work-space[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 96px;\r\n    margin-bottom: -96px;\r\n}\r\n.dx-scheduler-work-space[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 126px;\r\n    margin-bottom: -126px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 90px;\r\n    margin-bottom: -90px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 120px;\r\n    margin-bottom: -120px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 150px;\r\n    margin-bottom: -150px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 180px;\r\n    margin-bottom: -180px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 54px;\r\n    margin-bottom: -54px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 84px;\r\n    margin-bottom: -84px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 114px;\r\n    margin-bottom: -114px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 144px;\r\n    margin-bottom: -144px;\r\n}\r\n.dx-scheduler-work-space-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 5px;\r\n    margin-bottom: -5px;\r\n}\r\n.dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 35px;\r\n    margin-bottom: -35px;\r\n}\r\n.dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 65px;\r\n    margin-bottom: -65px;\r\n}\r\n.dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 95px;\r\n    margin-bottom: -95px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 59px;\r\n    margin-bottom: -59px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 89px;\r\n    margin-bottom: -89px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 119px;\r\n    margin-bottom: -119px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 149px;\r\n    margin-bottom: -149px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 23px;\r\n    margin-bottom: -23px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 53px;\r\n    margin-bottom: -53px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 83px;\r\n    margin-bottom: -83px;\r\n}\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 113px;\r\n    margin-bottom: -113px;\r\n}\r\n.dx-scheduler-work-space-day .dx-scheduler-header-panel .dx-scheduler-group-row:not(:first-child) {\r\n    border-bottom: none;\r\n}\r\n.dx-scheduler-work-space-day:not(.dx-scheduler-work-space-grouped) .dx-scheduler-all-day-title {\r\n    top: 40px;\r\n}\r\n.dx-scheduler-work-space-month .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-month .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 36px;\r\n    margin-bottom: -36px;\r\n}\r\n.dx-scheduler-work-space-month[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-month[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 66px;\r\n    margin-bottom: -66px;\r\n}\r\n.dx-scheduler-work-space-month[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-month[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 96px;\r\n    margin-bottom: -96px;\r\n}\r\n.dx-scheduler-work-space-month[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-month[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 126px;\r\n    margin-bottom: -126px;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-appointment-content {\r\n    font-size: 11px;\r\n}\r\n.dx-scheduler-appointment-tooltip .dx-button-content {\r\n    font-size: 10.76923077px;\r\n}\r\n.dx-scheduler-appointment-tooltip .dx-button-content .dx-icon {\r\n    font-size: 14px;\r\n}\r\n.dx-scheduler-appointment-tooltip .dx-scheduler-appointment-tooltip-title {\r\n    font-size: 14px;\r\n}\r\n.dx-scheduler-dropdown-appointments .dx-button-content {\r\n    padding: 0;\r\n}\r\n.dx-scheduler-header {\r\n    background-color: #f5f5f5;\r\n    border: 1px solid rgba(221, 221, 221, 0.6);\r\n    height: 39px;\r\n}\r\n.dx-scheduler-navigator {\r\n    padding: 7px;\r\n}\r\n.dx-scheduler-navigator .dx-button {\r\n    margin-top: -1px;\r\n    height: 25px;\r\n}\r\n.dx-scheduler-navigator .dx-button-has-icon .dx-button-content {\r\n    padding: 4px;\r\n}\r\n.dx-scheduler-navigator-caption {\r\n    border-radius: 0;\r\n    border-right-width: 0;\r\n    border-left-width: 0;\r\n}\r\n.dx-scheduler-navigator-caption.dx-state-focused,\r\n.dx-scheduler-navigator-caption.dx-state-hover,\r\n.dx-scheduler-navigator-caption.dx-state-active {\r\n    border-right-width: 1px;\r\n    border-left-width: 1px;\r\n}\r\n.dx-scheduler-navigator-previous {\r\n    border-radius: 0 0 0 0;\r\n}\r\n.dx-rtl .dx-scheduler-navigator-previous {\r\n    border-radius: 0 0 0 0;\r\n}\r\n.dx-scheduler-navigator-next {\r\n    border-radius: 0 0 0 0;\r\n}\r\n.dx-rtl .dx-scheduler-navigator-next {\r\n    border-radius: 0 0 0 0;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs {\r\n    font-size: 12px;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tab:not(.dx-tab-selected):not(.dx-state-hover) {\r\n    background: none;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tab.dx-tab-selected {\r\n    background-color: #fff;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tab.dx-tab-selected:before {\r\n    background-color: #fff;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tab.dx-state-focused:after {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-top: 1px solid #337ab7;\r\n    border-bottom: none;\r\n}\r\n.dx-scheduler-view-switcher.dx-tabs .dx-tab.dx-tab-selected:after {\r\n    height: 39px;\r\n}\r\n.dx-scheduler-view-switcher.dx-dropdownmenu {\r\n    margin-top: 6px;\r\n}\r\n.dx-scheduler-view-switcher-label {\r\n    margin-top: 11.2px;\r\n    right: 60px;\r\n}\r\n.dx-rtl .dx-scheduler-view-switcher-label {\r\n    left: 60px;\r\n    right: auto;\r\n}\r\n.dx-scheduler-header-panel .dx-scheduler-group-row:not(:first-child) {\r\n    border-bottom: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-header-panel .dx-scheduler-group-row:not(:first-child) .dx-scheduler-group-header {\r\n    font-size: 12px;\r\n    color: #333;\r\n}\r\n.dx-scheduler-header-panel .dx-scheduler-group-row .dx-scheduler-group-header {\r\n    font-weight: bold;\r\n    font-size: 18px;\r\n    color: #333;\r\n}\r\n.dx-scheduler-all-day-panel {\r\n    background-color: #fff;\r\n}\r\n.dx-scheduler-work-space {\r\n    padding-top: 39px;\r\n    margin-top: -39px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-grouped .dx-scheduler-all-day-title {\r\n    border-top: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-grouped .dx-scheduler-date-table-cell {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-work-space-grouped.dx-scheduler-agenda .dx-scheduler-date-table-cell {\r\n    border: none;\r\n}\r\n.dx-rtl .dx-scheduler-work-space.dx-scheduler-work-space-grouped.dx-scheduler-timeline .dx-scheduler-group-row th {\r\n    border-left: none;\r\n    border-right: none;\r\n}\r\n.dx-scheduler-work-space-week .dx-scheduler-date-table-row:first-child {\r\n    border-top: none;\r\n}\r\n.dx-scheduler-date-table-cell {\r\n    border-left: 1px solid rgba(221, 221, 221, 0.6);\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-all-day-table-cell.dx-state-active,\r\n.dx-scheduler-date-table-cell.dx-state-active {\r\n    background-color: rgba(221, 221, 221, 0.7);\r\n}\r\n.dx-scheduler-all-day-table-cell.dx-state-hover,\r\n.dx-scheduler-date-table-cell.dx-state-hover {\r\n    background-color: #f5f5f5;\r\n    color: #959595;\r\n}\r\n.dx-recurrence-editor-container {\r\n    position: relative;\r\n    margin-top: 15px;\r\n    margin-bottom: 21px;\r\n    padding-top: 17px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-popup-content {\r\n    padding: 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-fieldset {\r\n    margin: 0 15px 15px 10px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-popup-title {\r\n    background-color: #fff;\r\n    border-bottom: none;\r\n}\r\n.dx-scheduler-appointment-popup .dx-popup-title .dx-closebutton,\r\n.dx-scheduler-appointment-popup .dx-popup-title .dx-closebutton.dx-rtl {\r\n    margin: 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-toolbar-after {\r\n    margin-right: 4px;\r\n}\r\n.dx-rtl .dx-scheduler-appointment-popup .dx-toolbar-after {\r\n    margin-left: 4px;\r\n    margin-right: 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-recurrence-repeat-end-container {\r\n    margin: 0;\r\n}\r\n.dx-scheduler-appointment-popup .dx-recurrence-switch {\r\n    margin-top: 6px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-appointment-popup-recurrence-field {\r\n    margin-bottom: 13px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-recurrence-radiogroup-repeat-type-label,\r\n.dx-scheduler-appointment-popup .dx-recurrence-repeat-end-label {\r\n    line-height: 26px;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item:before {\r\n    background-color: #fff;\r\n}\r\n.dx-scheduler-appointment-popup .dx-scheduler-recurrence-rule-item.dx-scheduler-recurrence-rule-item-opened:before {\r\n    border-top: 1px solid #f2f2f2;\r\n    border-bottom: 1px solid #f2f2f2;\r\n}\r\n.dx-scheduler-appointment-popup .dx-form-validation-summary {\r\n    padding: 10px 20px;\r\n}\r\n.dx-scheduler-appointment-tooltip-buttons:before,\r\n.dx-scheduler-appointment-tooltip-buttons:after {\r\n    display: table;\r\n    content: '';\r\n    line-height: 0;\r\n}\r\n.dx-scheduler-appointment-tooltip-buttons:after {\r\n    clear: both;\r\n}\r\n.dx-scheduler-appointment-tooltip-buttons:before,\r\n.dx-scheduler-appointment-tooltip-buttons:after {\r\n    display: table;\r\n    content: '';\r\n    line-height: 0;\r\n}\r\n.dx-scheduler-appointment-tooltip-buttons:after {\r\n    clear: both;\r\n}\r\n.dx-scheduler-appointment-tooltip-buttons .dx-button:nth-child(even) {\r\n    float: right;\r\n    margin-right: 0;\r\n}\r\n.dx-scheduler-appointment-tooltip-buttons .dx-button:nth-child(odd) {\r\n    float: left;\r\n    margin-left: 0;\r\n}\r\n.dx-scheduler-appointment-tooltip-buttons .dx-button .dx-button-content {\r\n    padding: 2px 10px 3px 10px;\r\n}\r\n.dx-scheduler-work-space-month .dx-scheduler-date-table-cell {\r\n    font-size: 14px;\r\n}\r\n.dx-scheduler-header-panel,\r\n.dx-scheduler-time-panel {\r\n    font-size: 16px;\r\n}\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-week .dx-scheduler-date-table-cell:nth-child(7n+7),\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-week .dx-scheduler-all-day-table-cell:nth-child(7n+7),\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-week th:nth-child(7n+7),\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-month .dx-scheduler-date-table-cell:nth-child(7n+7),\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-month th:nth-child(7n+7),\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-day .dx-scheduler-date-table-cell,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-day .dx-scheduler-all-day-table-cell,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-day th,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week .dx-scheduler-date-table-cell:nth-child(5n+5),\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week .dx-scheduler-all-day-table-cell:nth-child(5n+5),\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week th:nth-child(5n+5),\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-agenda) .dx-scheduler-group-row th {\r\n    border-right: 1px solid #aaaaaa;\r\n}\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-week .dx-scheduler-date-table-cell:nth-child(7n+7):last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-week .dx-scheduler-all-day-table-cell:nth-child(7n+7):last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-week th:nth-child(7n+7):last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-month .dx-scheduler-date-table-cell:nth-child(7n+7):last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-month th:nth-child(7n+7):last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-day .dx-scheduler-date-table-cell:last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-day .dx-scheduler-all-day-table-cell:last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-day th:last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week .dx-scheduler-date-table-cell:nth-child(5n+5):last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week .dx-scheduler-all-day-table-cell:nth-child(5n+5):last-child,\r\n.dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week th:nth-child(5n+5):last-child,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-agenda) .dx-scheduler-group-row th:last-child {\r\n    border-right: none;\r\n}\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-week .dx-scheduler-date-table-cell:nth-child(7n+7),\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-week .dx-scheduler-all-day-table-cell:nth-child(7n+7),\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-week th:nth-child(7n+7),\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-month .dx-scheduler-date-table-cell:nth-child(7n+7),\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-month th:nth-child(7n+7),\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-day .dx-scheduler-date-table-cell,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-day .dx-scheduler-all-day-table-cell,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-day th,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week .dx-scheduler-date-table-cell:nth-child(5n+5),\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week .dx-scheduler-all-day-table-cell:nth-child(5n+5),\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week th:nth-child(5n+5),\r\n.dx-rtl .dx-scheduler-work-space-grouped:not(.dx-scheduler-agenda) .dx-scheduler-group-row th {\r\n    border-left: 1px solid #aaaaaa;\r\n    border-right: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-week .dx-scheduler-date-table-cell:nth-child(7n+7):last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-week .dx-scheduler-all-day-table-cell:nth-child(7n+7):last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-week th:nth-child(7n+7):last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-month .dx-scheduler-date-table-cell:nth-child(7n+7):last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-month th:nth-child(7n+7):last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-day .dx-scheduler-date-table-cell:last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-day .dx-scheduler-all-day-table-cell:last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-day th:last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week .dx-scheduler-date-table-cell:nth-child(5n+5):last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week .dx-scheduler-all-day-table-cell:nth-child(5n+5):last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped.dx-scheduler-work-space-work-week th:nth-child(5n+5):last-child,\r\n.dx-rtl .dx-scheduler-work-space-grouped:not(.dx-scheduler-agenda) .dx-scheduler-group-row th:last-child {\r\n    border-left: none;\r\n}\r\n.dx-scheduler-appointment.dx-state-focused {\r\n    color: #fff;\r\n}\r\n.dx-scheduler-dropdown-appointment {\r\n    border-bottom: 1px solid rgba(221, 221, 221, 0.6);\r\n}\r\n.dx-scheduler-dropdown-appointment-date {\r\n    color: #959595;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 67px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 97px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 127px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda) .dx-scheduler-header-scrollable {\r\n    height: 37px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda) .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda) .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 36px;\r\n    margin-bottom: -36px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 66px;\r\n    margin-bottom: -66px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 96px;\r\n    margin-bottom: -96px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda)[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 126px;\r\n    margin-bottom: -126px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 36px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 66px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 96px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day .dx-scheduler-header-scrollable {\r\n    height: 6px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 5px;\r\n    margin-bottom: -5px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 35px;\r\n    margin-bottom: -35px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 65px;\r\n    margin-bottom: -65px;\r\n}\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space-grouped:not(.dx-scheduler-work-space-all-day):not(.dx-scheduler-timeline):not(.dx-scheduler-agenda).dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scrollable.dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 95px;\r\n    margin-bottom: -95px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week[dx-group-row-count='1'] .dx-scheduler-header-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 98px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week[dx-group-row-count='2'] .dx-scheduler-header-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 128px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week[dx-group-row-count='3'] .dx-scheduler-header-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 158px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week .dx-scheduler-header-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week .dx-scheduler-header-scrollable {\r\n    height: 68px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable {\r\n    padding-bottom: 67px;\r\n    margin-bottom: -67px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable:before,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week.dx-scheduler-work-space-grouped .dx-scheduler-sidebar-scrollable:before {\r\n    height: 68px;\r\n    margin-top: -68px;\r\n}\r\n.dx-scheduler-work-space.dx-scheduler-timeline-week .dx-scrollable.dx-scheduler-date-table-scrollable,\r\n.dx-scheduler-work-space.dx-scheduler-timeline-work-week .dx-scrollable.dx-scheduler-date-table-scrollable {\r\n    padding-bottom: 67px;\r\n    margin-bottom: -67px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-title {\r\n    background-color: #fff;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-all-day-title:before {\r\n    background-color: #fff;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-date-table-cell {\r\n    height: 36px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 67px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 97px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 127px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar .dx-scheduler-header-scrollable {\r\n    height: 37px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 31px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 61px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 91px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space-day .dx-scheduler-header-scrollable {\r\n    height: 1px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 121px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 151px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 181px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day .dx-scheduler-header-scrollable {\r\n    height: 91px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 85px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 115px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 145px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-all-day-collapsed .dx-scheduler-header-scrollable {\r\n    height: 55px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 90px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 120px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 150px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day .dx-scheduler-header-scrollable {\r\n    height: 60px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 54px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 84px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 114px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-all-day.dx-scheduler-work-space-day.dx-scheduler-work-space-all-day-collapsed .dx-scheduler-header-scrollable {\r\n    height: 24px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-month[dx-group-row-count='1'] .dx-scheduler-header-scrollable {\r\n    height: 67px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-month[dx-group-row-count='2'] .dx-scheduler-header-scrollable {\r\n    height: 97px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-month[dx-group-row-count='3'] .dx-scheduler-header-scrollable {\r\n    height: 127px;\r\n}\r\n.dx-scheduler-work-space-both-scrollbar.dx-scheduler-work-space.dx-scheduler-work-space-month .dx-scheduler-header-scrollable {\r\n    height: 37px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-appointment-content {\r\n    font-size: 14px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-appointment-content .dx-scheduler-appointment-content-date {\r\n    font-size: 11px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-group-header {\r\n    font-size: 14px;\r\n    width: 60px;\r\n}\r\n.dx-scheduler-agenda .dx-scheduler-group-header-content {\r\n    width: 60px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-date-table {\r\n    margin-right: -60px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-date-table {\r\n    margin-left: -30px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-date-table {\r\n    margin-left: -60px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-date-table {\r\n    margin-left: -30px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 160px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 80px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 0;\r\n    padding-right: 160px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='1'] .dx-scheduler-scrollable-appointments {\r\n    padding-right: 80px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-date-table {\r\n    margin-right: -120px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-date-table {\r\n    margin-left: -60px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-date-table {\r\n    margin-left: -120px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-date-table {\r\n    margin-left: -60px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 220px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 110px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 0;\r\n    padding-right: 220px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='2'] .dx-scheduler-scrollable-appointments {\r\n    padding-right: 110px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-date-table {\r\n    margin-right: -180px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-date-table {\r\n    margin-left: -90px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-date-table {\r\n    margin-left: -180px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-date-table {\r\n    margin-left: -90px;\r\n}\r\n.dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 280px;\r\n}\r\n.dx-scheduler-small .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 140px;\r\n}\r\n.dx-rtl .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-scrollable-appointments {\r\n    padding-left: 0;\r\n    padding-right: 280px;\r\n}\r\n.dx-scheduler-small .dx-rtl .dx-scheduler-agenda[dx-group-column-count='3'] .dx-scheduler-scrollable-appointments {\r\n    padding-right: 140px;\r\n}\r\n.dx-scheduler-agenda-nodata {\r\n    font-size: 16px;\r\n}\r\n.dx-form-group-with-caption > .dx-form-group-content {\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-form-group-caption {\r\n    font-size: 16px;\r\n}\r\n.dx-form-group-with-caption .dx-form-group-content {\r\n    padding-bottom: 10px;\r\n}\r\n.dx-field-item-label-text {\r\n    color: #333;\r\n}\r\n.dx-field-item-help-text {\r\n    color: #333;\r\n}\r\n.dx-field-item-required-mark {\r\n    color: #ea4444;\r\n}\r\n.dx-field-item-optional-mark {\r\n    color: #afafaf;\r\n}\r\n.dx-desktop-layout-main-menu {\r\n    background: #337ab7;\r\n}\r\n.dx-desktop-layout-main-menu .dx-nav-item {\r\n    background: #337ab7;\r\n}\r\n.dx-desktop-layout-main-menu .dx-nav-item.dx-tab-selected {\r\n    background: #f7f7f7;\r\n    border-top: 1px solid #ddd;\r\n}\r\n.dx-desktop-layout-main-menu .dx-nav-item.dx-tab-selected .dx-tab-text {\r\n    color: #333;\r\n}\r\n.dx-desktop-layout-main-menu .dx-nav-item.dx-tab-selected.dx-state-hover {\r\n    background: #f7f7f7;\r\n}\r\n.dx-desktop-layout-main-menu .dx-nav-item.dx-tab-selected.dx-state-hover .dx-tab-text {\r\n    color: #333;\r\n}\r\n.dx-desktop-layout-main-menu .dx-nav-item.dx-state-hover {\r\n    background: #63a0d4;\r\n}\r\n.dx-desktop-layout-main-menu .dx-nav-item.dx-state-hover .dx-tab-text {\r\n    color: #efefef;\r\n}\r\n.dx-desktop-layout-main-menu .dx-nav-item .dx-tab-text {\r\n    color: #efefef;\r\n}\r\n.dx-desktop-layout-copyright {\r\n    color: #818181;\r\n}\r\n.dx-desktop-layout-toolbar {\r\n    background: #f7f7f7;\r\n    border-bottom-color: #ddd;\r\n}\r\n.dx-splitter {\r\n    border-right-color: #ddd;\r\n}", ""]);

// exports


/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(231), __webpack_require__(53)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, export_1, export_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(export_1);
    __export(export_2);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 774:
/***/ (function(module, exports) {

module.exports = "<a class=\"t--toolbar-item\" click.delegate=\"data.guardedExecute()\">\r\n  <div if.bind=\"data.command.badgeText\" class=\"t--toolbar-item-badge\" tr=\"key.bind: data.command.badgeText\">\r\n  </div>\r\n  <div class=\"t--toolbar-item-content\">\r\n    <div if.bind=\"data.command.icon\" class=\"t--toolbar-item-icon\">\r\n      <i class=\"fa-fw\" fa-icon=\"icon.bind: data.command.icon\"></i>\r\n    </div>\r\n    <div if.bind=\"data.command.title\" class=\"t--toolbar-item-title\" tr=\"key.bind: data.command.title\">\r\n    </div>\r\n  </div>\r\n</a>\r\n";

/***/ }),

/***/ 777:
/***/ (function(module, exports) {

module.exports = {
	"framework/security/views/authgroup/authgroup-edit-form": {
		"idParent": null,
		"category": null,
		"caption": "authgroup-edit.authgroup-edit_caption",
		"route": "security/authgroup/:id",
		"icon": null,
		"moduleId": "framework/security/views/authgroup/authgroup-edit-form",
		"isEnabled": false
	},
	"framework/security/views/authgroup/authgroup-list-form": {
		"idParent": "settings",
		"category": null,
		"caption": "authgroup-list.authgroup-list_caption",
		"route": "security/authgroup",
		"icon": null,
		"moduleId": "framework/security/views/authgroup/authgroup-list-form",
		"isEnabled": true
	}
};

/***/ }),

/***/ 778:
/***/ (function(module, exports) {

module.exports = {
	"login-form": {
		"login-form_caption": "Anmeldedaten",
		"enter_user_password_text": "Geben Sie hier Ihren Benutzernamen und Passwort ein und klicken Sie auf \"Anmelden\".",
		"username_caption": "Benutzername",
		"password_caption": "Passwort",
		"stayloggodon_caption": "Angemeldet bleiben"
	},
	"base": {
		"add": "Neuer Datensatz",
		"save": "Speichern",
		"delete": "Löschen",
		"question": "Frage",
		"information": "Information",
		"error": "Fehler",
		"sure_delete_question": "Sind Sie sicher, dass sie den aktuellen Datensatz löschen wollen?",
		"save_success": "Daten wurden erfolgreich gespeichert",
		"validation_error": "Daten können aufgrund ungültiger Validierung nicht gespeichert werden",
		"login": "Anmelden",
		"logout": "Abmelden",
		"navigation": "Navigation"
	},
	"default_ui": {
		"search": "Suchen ..."
	},
	"forms": {
		"validator_required": "{0} ist ein Pflichtfeld",
		"validator_email": "{0} ist keine gültige Emailadresse",
		"validator_stringLengthMinMax": "{0} muss zwischen {1} und {2} Zeichen haben",
		"validator_stringLengthMin": "{0} muss mindestens {1} Zeichen haben",
		"validator_stringLengthMax": "{0} darf maximal {1} Zeichen haben",
		"file_uploadClickHere": "Hier klicken, um eine Datei hochzuladen.",
		"lookup_selectItem": "Element auswählen"
	},
	"login-form-funcs": {
		"anmelden_caption": "Anmelden"
	},
	"routes": {
		"settings": "Einstellungen"
	},
	"authgroup-edit": {
		"authgroup-edit_caption": "Berechtigungsgruppe",
		"info_text": {
			"text": "Hallo Kollege - {0}",
			"parameters": [
				"models.data.$m_A.Name"
			]
		},
		"colnichts_caption": "Nichts",
		"colnichts2_caption": "Nichts2",
		"mandator_caption": "Mandant"
	},
	"authgroup-list": {
		"authgroup-list_caption": "Berechtigungsgruppen",
		"name_caption": "Bezeichnung",
		"mandantor_caption": "Mandant"
	}
};

/***/ }),

/***/ 779:
/***/ (function(module, exports) {

module.exports = {
	"mandator": {
		"id": "mandator",
		"elementName": "select-box",
		"valueMember": "Id",
		"displayMember": "Name",
		"action": "base/Security/Mandator",
		"columns": [
			"Name",
			"Id"
		]
	}
};

/***/ }),

/***/ 780:
/***/ (function(module, exports) {

module.exports = [
	{
		"id": "settings",
		"caption": "routes.settings",
		"icon": "shield"
	}
];

/***/ }),

/***/ 805:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 361,
	"./af.js": 361,
	"./ar": 368,
	"./ar-dz": 362,
	"./ar-dz.js": 362,
	"./ar-kw": 363,
	"./ar-kw.js": 363,
	"./ar-ly": 364,
	"./ar-ly.js": 364,
	"./ar-ma": 365,
	"./ar-ma.js": 365,
	"./ar-sa": 366,
	"./ar-sa.js": 366,
	"./ar-tn": 367,
	"./ar-tn.js": 367,
	"./ar.js": 368,
	"./az": 369,
	"./az.js": 369,
	"./be": 370,
	"./be.js": 370,
	"./bg": 371,
	"./bg.js": 371,
	"./bn": 372,
	"./bn.js": 372,
	"./bo": 373,
	"./bo.js": 373,
	"./br": 374,
	"./br.js": 374,
	"./bs": 375,
	"./bs.js": 375,
	"./ca": 376,
	"./ca.js": 376,
	"./cs": 377,
	"./cs.js": 377,
	"./cv": 378,
	"./cv.js": 378,
	"./cy": 379,
	"./cy.js": 379,
	"./da": 380,
	"./da.js": 380,
	"./de": 383,
	"./de-at": 381,
	"./de-at.js": 381,
	"./de-ch": 382,
	"./de-ch.js": 382,
	"./de.js": 383,
	"./dv": 384,
	"./dv.js": 384,
	"./el": 385,
	"./el.js": 385,
	"./en-au": 386,
	"./en-au.js": 386,
	"./en-ca": 387,
	"./en-ca.js": 387,
	"./en-gb": 388,
	"./en-gb.js": 388,
	"./en-ie": 389,
	"./en-ie.js": 389,
	"./en-nz": 390,
	"./en-nz.js": 390,
	"./eo": 391,
	"./eo.js": 391,
	"./es": 393,
	"./es-do": 392,
	"./es-do.js": 392,
	"./es.js": 393,
	"./et": 394,
	"./et.js": 394,
	"./eu": 395,
	"./eu.js": 395,
	"./fa": 396,
	"./fa.js": 396,
	"./fi": 397,
	"./fi.js": 397,
	"./fo": 398,
	"./fo.js": 398,
	"./fr": 401,
	"./fr-ca": 399,
	"./fr-ca.js": 399,
	"./fr-ch": 400,
	"./fr-ch.js": 400,
	"./fr.js": 401,
	"./fy": 402,
	"./fy.js": 402,
	"./gd": 403,
	"./gd.js": 403,
	"./gl": 404,
	"./gl.js": 404,
	"./gom-latn": 405,
	"./gom-latn.js": 405,
	"./he": 406,
	"./he.js": 406,
	"./hi": 407,
	"./hi.js": 407,
	"./hr": 408,
	"./hr.js": 408,
	"./hu": 409,
	"./hu.js": 409,
	"./hy-am": 410,
	"./hy-am.js": 410,
	"./id": 411,
	"./id.js": 411,
	"./is": 412,
	"./is.js": 412,
	"./it": 413,
	"./it.js": 413,
	"./ja": 414,
	"./ja.js": 414,
	"./jv": 415,
	"./jv.js": 415,
	"./ka": 416,
	"./ka.js": 416,
	"./kk": 417,
	"./kk.js": 417,
	"./km": 418,
	"./km.js": 418,
	"./kn": 419,
	"./kn.js": 419,
	"./ko": 420,
	"./ko.js": 420,
	"./ky": 421,
	"./ky.js": 421,
	"./lb": 422,
	"./lb.js": 422,
	"./lo": 423,
	"./lo.js": 423,
	"./lt": 424,
	"./lt.js": 424,
	"./lv": 425,
	"./lv.js": 425,
	"./me": 426,
	"./me.js": 426,
	"./mi": 427,
	"./mi.js": 427,
	"./mk": 428,
	"./mk.js": 428,
	"./ml": 429,
	"./ml.js": 429,
	"./mr": 430,
	"./mr.js": 430,
	"./ms": 432,
	"./ms-my": 431,
	"./ms-my.js": 431,
	"./ms.js": 432,
	"./my": 433,
	"./my.js": 433,
	"./nb": 434,
	"./nb.js": 434,
	"./ne": 435,
	"./ne.js": 435,
	"./nl": 437,
	"./nl-be": 436,
	"./nl-be.js": 436,
	"./nl.js": 437,
	"./nn": 438,
	"./nn.js": 438,
	"./pa-in": 439,
	"./pa-in.js": 439,
	"./pl": 440,
	"./pl.js": 440,
	"./pt": 442,
	"./pt-br": 441,
	"./pt-br.js": 441,
	"./pt.js": 442,
	"./ro": 443,
	"./ro.js": 443,
	"./ru": 444,
	"./ru.js": 444,
	"./sd": 445,
	"./sd.js": 445,
	"./se": 446,
	"./se.js": 446,
	"./si": 447,
	"./si.js": 447,
	"./sk": 448,
	"./sk.js": 448,
	"./sl": 449,
	"./sl.js": 449,
	"./sq": 450,
	"./sq.js": 450,
	"./sr": 452,
	"./sr-cyrl": 451,
	"./sr-cyrl.js": 451,
	"./sr.js": 452,
	"./ss": 453,
	"./ss.js": 453,
	"./sv": 454,
	"./sv.js": 454,
	"./sw": 455,
	"./sw.js": 455,
	"./ta": 456,
	"./ta.js": 456,
	"./te": 457,
	"./te.js": 457,
	"./tet": 458,
	"./tet.js": 458,
	"./th": 459,
	"./th.js": 459,
	"./tl-ph": 460,
	"./tl-ph.js": 460,
	"./tlh": 461,
	"./tlh.js": 461,
	"./tr": 462,
	"./tr.js": 462,
	"./tzl": 463,
	"./tzl.js": 463,
	"./tzm": 465,
	"./tzm-latn": 464,
	"./tzm-latn.js": 464,
	"./tzm.js": 465,
	"./uk": 466,
	"./uk.js": 466,
	"./ur": 467,
	"./ur.js": 467,
	"./uz": 469,
	"./uz-latn": 468,
	"./uz-latn.js": 468,
	"./uz.js": 469,
	"./vi": 470,
	"./vi.js": 470,
	"./x-pseudo": 471,
	"./x-pseudo.js": 471,
	"./yo": 472,
	"./yo.js": 472,
	"./zh-cn": 473,
	"./zh-cn.js": 473,
	"./zh-hk": 474,
	"./zh-hk.js": 474,
	"./zh-tw": 475,
	"./zh-tw.js": 475
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 805;

/***/ }),

/***/ 818:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(529);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/less-loader/dist/index.js!./grid.less", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/less-loader/dist/index.js!./grid.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 819:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(530);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./styles.less", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./styles.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 820:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(531);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./popup.less", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./popup.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 821:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(532);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./styles.less", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./styles.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 822:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(533);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./toolbar.less", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./toolbar.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 823:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(534);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./styles.less", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/less-loader/dist/index.js!./styles.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 824:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(535);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./dx.common.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./dx.common.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 825:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(536);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(63)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./dx.custom.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./dx.custom.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 826:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 827:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shortcuts;
    (function (Shortcuts) {
        Shortcuts[Shortcuts["save"] = 0] = "save";
        Shortcuts[Shortcuts["saveAndNew"] = 1] = "saveAndNew";
        Shortcuts[Shortcuts["delete"] = 2] = "delete";
        Shortcuts[Shortcuts["new"] = 3] = "new";
    })(Shortcuts = exports.Shortcuts || (exports.Shortcuts = {}));
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 828:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    DeepObserverService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [aurelia_framework_1.BindingEngine])
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 829:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(234)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, localization_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorService = (function () {
        function ErrorService(localization) {
            this.localization = localization;
        }
        ErrorService.prototype.showError = function (error) {
            var message = error;
            if (error instanceof Error) {
                message = error.message;
            }
            DevExpress.ui.dialog.alert(message, this.localization.translate(null, "base.error"));
        };
        ErrorService.prototype.logError = function (error) {
        };
        ErrorService.prototype.showAndLogError = function (error) {
            this.logError(error);
            this.showError(error);
        };
        return ErrorService;
    }());
    ErrorService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [localization_service_1.LocalizationService])
    ], ErrorService);
    exports.ErrorService = ErrorService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 830:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(232), __webpack_require__(142)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, authorization_service_1, rest_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileService = (function () {
        function FileService(authorization, rest) {
            this.authorization = authorization;
            this.rest = rest;
        }
        FileService.prototype.getDownloadUrl = function (key) {
            if (!key) {
                return null;
            }
            var authKey = this.authorization.getAuthorizationKey();
            if (authKey) {
                authKey = "&authKey=" + encodeURIComponent(authKey);
            }
            return this.rest.getApiUrl("base/File/Download?key=" + key + authKey);
        };
        FileService.prototype.download = function () {
        };
        FileService.prototype.upload = function (file) {
            var formData = new FormData();
            formData.append("file", file);
            return this.rest.post({
                url: this.rest.getApiUrl("base/File/Upload"),
                data: formData
            });
        };
        return FileService;
    }());
    FileService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [authorization_service_1.AuthorizationService,
            rest_service_1.RestService])
    ], FileService);
    exports.FileService = FileService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 831:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__(2), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, moment, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GlobalizationService = (function () {
        function GlobalizationService() {
            this.groupRegex = /\B(?=(\d{3})+(?!\d))/g;
            this.escapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
            this.current = new GermanGlobalizationProvider();
            this.formatters = {};
            this.parsers = {};
        }
        GlobalizationService.prototype.setProvider = function (provider) {
            this.current = provider;
            this.formatters = {};
            this.parsers = {};
        };
        GlobalizationService.prototype.format = function (value, format) {
            return this.getFormatter(format)(value);
        };
        GlobalizationService.prototype.getFormatter = function (format) {
            var _this = this;
            var formatter = this.formatters[format];
            if (formatter == void (0)) {
                formatter = function (value) {
                    if (value == void (0)) {
                        return null;
                    }
                    if (format.length === 1) {
                        return moment(value).locale(_this.current.culture).format(_this.current[format]);
                    }
                    else {
                        var count = parseInt(format.substr(1));
                        var formatClass = format.substr(0, 1);
                        if (formatClass === "p") {
                            value = value * 100;
                        }
                        var a = value % 1;
                        var b = value - a;
                        a = Math.round(a * Math.pow(10, count));
                        if (a === 1) {
                            b += 1;
                            a = 0;
                        }
                        switch (formatClass) {
                            case "n": {
                                return "" + _this.addGroupSeparator(b) + _this.addDecimalSeparator(a, count);
                            }
                            case "f": {
                                return "" + b + _this.addDecimalSeparator(a, count);
                            }
                            case "p": {
                                return "" + _this.addGroupSeparator(b) + _this.addDecimalSeparator(a, count) + " %";
                            }
                            default: {
                                throw new Error("Not implemented format " + format);
                            }
                        }
                    }
                };
                this.formatters[format] = formatter;
            }
            return formatter;
        };
        GlobalizationService.prototype.getParser = function (format) {
            var _this = this;
            var parser = this.parsers[format];
            if (parser == void (0)) {
                parser = function (value) {
                    if (value == void (0)) {
                        return null;
                    }
                    if (format.length === 1) {
                        var result = moment(value, _this.current[format]);
                        if (result.isValid()) {
                            return result.toDate();
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        var groupFinder = _this.current.groupSeparator.replace(_this.escapeRegex, "\\$&");
                        value = value
                            .replace(new RegExp(groupFinder, "g"), "")
                            .replace(new RegExp("%", "g"), "")
                            .replace(new RegExp(" ", "g"), "");
                        var indexOf = value.indexOf(_this.current.commaSeparator);
                        var b = value;
                        var a = "";
                        if (indexOf >= 0) {
                            b = value.substr(0, indexOf);
                            a = value.substr(indexOf + 1);
                        }
                        var count = parseInt(format.substr(1));
                        var formatClass = format.substr(0, 1);
                        switch (formatClass) {
                            case "f":
                            case "n": {
                                return parseInt(b) + _this.makeComma(a);
                            }
                            case "p": {
                                return (parseInt(b) + _this.makeComma(a)) / 100;
                            }
                            default: {
                                throw new Error("Not implemented format " + format);
                            }
                        }
                    }
                };
                this.parsers[format] = parser;
            }
            return parser;
        };
        GlobalizationService.prototype.getFormatterParser = function (format) {
            return {
                formatter: this.getFormatter(format),
                parser: this.getParser(format)
            };
        };
        GlobalizationService.prototype.addGroupSeparator = function (value) {
            return value.toString().replace(this.groupRegex, this.current.groupSeparator);
        };
        GlobalizationService.prototype.addDecimalSeparator = function (value, count) {
            var r = "";
            if (count > 0) {
                r += this.current.commaSeparator;
                var c = value.toString();
                while (c.length < count) {
                    c += "0";
                }
                r += c;
            }
            return r;
        };
        GlobalizationService.prototype.makeComma = function (value) {
            return parseInt(value) / Math.pow(10, value.length);
        };
        return GlobalizationService;
    }());
    GlobalizationService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [])
    ], GlobalizationService);
    exports.GlobalizationService = GlobalizationService;
    var GermanGlobalizationProvider = (function () {
        function GermanGlobalizationProvider() {
            this.culture = "de";
            this.d = "DD.MM.YYYY";
            this.D = "dddd, DD. MMM YYYY";
            this.f = "dddd, DD. MMM YYYY, HH:mm";
            this.F = "dddd, DD. MMM yyyy, HH:mm:ss";
            this.g = "DD.MM.YYYY HH:mm";
            this.G = "DD.MM.YYYY HH:mm:ss";
            this.t = "HH:mm";
            this.T = "HH:mm:ss";
            this.commaSeparator = ",";
            this.groupSeparator = " ";
        }
        return GermanGlobalizationProvider;
    }());
    exports.GermanGlobalizationProvider = GermanGlobalizationProvider;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 832:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(141)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, custom_event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LocationService = (function () {
        function LocationService(onLocationGoTo) {
            this.onLocationGoTo = onLocationGoTo;
        }
        LocationService.prototype.goTo = function (url, currentViewModel) {
            var args = {
                url: url,
                currentViewModel: currentViewModel,
                isHandled: false
            };
            this.onLocationGoTo
                .fire(args)
                .then(function () {
                if (!args.isHandled) {
                    location.assign(url);
                }
            });
        };
        return LocationService;
    }());
    LocationService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [custom_event_1.CustomEvent])
    ], LocationService);
    exports.LocationService = LocationService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 833:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PermissionService = (function () {
        function PermissionService() {
        }
        PermissionService.prototype.canWebApiNew = function (webApiAction) {
            return true;
        };
        PermissionService.prototype.canWebApiModify = function (webApiAction) {
            return true;
        };
        PermissionService.prototype.canWebApiDelete = function (webApiAction) {
            return true;
        };
        return PermissionService;
    }());
    PermissionService = tslib_1.__decorate([
        aurelia_framework_1.autoinject
    ], PermissionService);
    exports.PermissionService = PermissionService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 834:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(231), __webpack_require__(483), __webpack_require__(806), __webpack_require__(807)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, mousetrap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShortcutService = (function () {
        function ShortcutService(onShortcutExecute) {
            this.onShortcutExecute = onShortcutExecute;
            this.bind();
        }
        ShortcutService.prototype.bind = function () {
            var _this = this;
            mousetrap.bindGlobal("f10", function (e) { return _this.fire(export_2.Shortcuts.save); });
            mousetrap.bindGlobal("ctrl+f10", function (e) { return _this.fire(export_2.Shortcuts.saveAndNew); });
            mousetrap.bindGlobal("f8", function (e) { return _this.fire(export_2.Shortcuts.delete); });
            mousetrap.bindGlobal("f7", function (e) { return _this.fire(export_2.Shortcuts.new); });
        };
        ShortcutService.prototype.fire = function (shortcut) {
            if (document.activeElement) {
                var activeElement = document.activeElement;
                if (activeElement.blur) {
                    activeElement.blur();
                }
            }
            this.onShortcutExecute.fire({
                shortcut: shortcut
            });
        };
        return ShortcutService;
    }());
    ShortcutService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.CustomEvent])
    ], ShortcutService);
    exports.ShortcutService = ShortcutService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 835:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(141)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, custom_event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowService = (function () {
        function WindowService(onWindowSizeChanged) {
            this.onWindowSizeChanged = onWindowSizeChanged;
            this.registerEvents();
        }
        WindowService.prototype.registerEvents = function () {
            var _this = this;
            window.addEventListener("resize", function () {
                _this.onWindowSizeChanged.fire({});
            });
        };
        return WindowService;
    }());
    WindowService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [custom_event_1.CustomEvent])
    ], WindowService);
    exports.WindowService = WindowService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 836:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(235)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, export_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(export_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 837:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(57)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderService = (function () {
        function HeaderService(onSearch) {
            this.onSearch = onSearch;
            this.logoUrl = "http://2014.erp-future.com/sites/2014.erp-future.com/files/1_business/Logo_U_TIP.png";
            this.text = "TIP Technik und Informatik Partner GmbH";
            this.commands = [];
            this.avatarCommands = [];
            this.avatarUrlChanged();
        }
        HeaderService.prototype.avatarUrlChanged = function () {
            var image = this.avatarUrl
                || "https://www.colourbox.de/preview/2753241-kleine-graue-katze-im-grunen-gras.jpg";
            this.avatarStyle = {
                "background-image": "url(" + image + ")"
            };
        };
        return HeaderService;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.observable,
        tslib_1.__metadata("design:type", String)
    ], HeaderService.prototype, "avatarUrl", void 0);
    HeaderService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.CustomEvent])
    ], HeaderService);
    exports.HeaderService = HeaderService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 838:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DevExpress = __webpack_require__(146);
    __webpack_require__(10);
    __webpack_require__(268);
    __webpack_require__(193);
    __webpack_require__(60);
    __webpack_require__(72);
    __webpack_require__(153);
    __webpack_require__(14);
    __webpack_require__(155);
    __webpack_require__(552);
    var data = DevExpress.data = __webpack_require__(537);
    var ui = DevExpress.ui = __webpack_require__(538);
    ui.themes = __webpack_require__(26);
    ui.setTemplateEngine = __webpack_require__(691);
    ui.dialog = __webpack_require__(200);
    ui.notify = __webpack_require__(637);
    ui.dxActionSheet = __webpack_require__(196);
    ui.dxAutocomplete = __webpack_require__(558);
    ui.dxBox = __webpack_require__(156);
    ui.dxButton = __webpack_require__(24);
    ui.dxCalendar = __webpack_require__(197);
    ui.dxCheckBox = __webpack_require__(102);
    ui.dxColorBox = __webpack_require__(565);
    ui.dxDateBox = __webpack_require__(159);
    ui.dxDeferRendering = __webpack_require__(610);
    ui.dxDropDownMenu = __webpack_require__(132);
    ui.dxFileUploader = __webpack_require__(611);
    ui.dxForm = __webpack_require__(161);
    ui.dxGallery = __webpack_require__(614);
    ui.dxList = __webpack_require__(104);
    ui.dxLoadIndicator = __webpack_require__(62);
    ui.dxLoadPanel = __webpack_require__(163);
    ui.dxLookup = __webpack_require__(628);
    ui.dxMap = __webpack_require__(629);
    ui.dxMultiView = __webpack_require__(289);
    ui.dxNavBar = __webpack_require__(635);
    ui.dxNumberBox = __webpack_require__(85);
    ui.dxOverlay = __webpack_require__(48);
    ui.dxPopover = __webpack_require__(106);
    ui.dxPopup = __webpack_require__(50);
    ui.dxProgressBar = __webpack_require__(292);
    ui.dxRadioGroup = __webpack_require__(293);
    ui.dxRangeSlider = __webpack_require__(656);
    ui.dxResizable = __webpack_require__(206);
    ui.dxResponsiveBox = __webpack_require__(294);
    ui.dxScrollView = __webpack_require__(210);
    ui.dxSelectBox = __webpack_require__(108);
    ui.dxSlider = __webpack_require__(305);
    ui.dxSwitch = __webpack_require__(307);
    ui.dxTabPanel = __webpack_require__(308);
    ui.dxTabs = __webpack_require__(166);
    ui.dxTagBox = __webpack_require__(310);
    ui.dxTextArea = __webpack_require__(311);
    ui.dxTextBox = __webpack_require__(87);
    ui.dxTileView = __webpack_require__(697);
    ui.dxToast = __webpack_require__(314);
    ui.dxToolbar = __webpack_require__(315);
    ui.dxTooltip = __webpack_require__(167);
    ui.dxTrackBar = __webpack_require__(212);
    DevExpress.validationEngine = __webpack_require__(88);
    ui.dxValidationSummary = __webpack_require__(213);
    ui.dxValidationGroup = __webpack_require__(319);
    ui.dxValidator = __webpack_require__(170);
    ui.dxAccordion = __webpack_require__(557);
    ui.dxContextMenu = __webpack_require__(103);
    ui.dxDataGrid = __webpack_require__(570);
    ui.dxMenu = __webpack_require__(288);
    ui.dxPivotGrid = __webpack_require__(640);
    ui.dxPivotGridFieldChooser = __webpack_require__(653);
    data.PivotGridDataSource = __webpack_require__(164);
    data.XmlaStore = __webpack_require__(652);
    ui.dxScheduler = __webpack_require__(657);
    ui.dxTreeView = __webpack_require__(134);
    var viz = DevExpress.viz = __webpack_require__(539);
    viz.currentTheme = __webpack_require__(90).currentTheme;
    viz.registerTheme = __webpack_require__(90).registerTheme;
    viz.exportFromMarkup = __webpack_require__(726).exportFromMarkup;
    viz.currentPalette = __webpack_require__(178).currentPalette;
    viz.getPalette = __webpack_require__(178).getPalette;
    viz.registerPalette = __webpack_require__(178).registerPalette;
    viz.dxChart = __webpack_require__(710);
    viz.dxPieChart = __webpack_require__(735);
    viz.dxPolarChart = __webpack_require__(736);
    viz.dxLinearGauge = __webpack_require__(734);
    viz.dxCircularGauge = __webpack_require__(717);
    viz.dxBarGauge = __webpack_require__(708);
    viz.dxRangeSelector = __webpack_require__(737);
    viz.dxVectorMap = __webpack_require__(763);
    viz.map = {};
    viz.map.sources = {};
    viz.map.projection = __webpack_require__(340).projection;
    viz.dxSparkline = __webpack_require__(756);
    viz.dxBullet = __webpack_require__(709);
    var DxLoader = (function () {
        function DxLoader() {
            this.data = data;
            this.ui = ui;
            this.viz = viz;
        }
        return DxLoader;
    }());
    exports.DxLoader = DxLoader;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 839:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(184)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dx_template_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DxTemplateService = dx_template_service_1.DxTemplateService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 840:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(489), __webpack_require__(490), __webpack_require__(491), __webpack_require__(492), __webpack_require__(493), __webpack_require__(494), __webpack_require__(495), __webpack_require__(496), __webpack_require__(497)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, command_server_data_1, commands_1, context_menu_1, edit_popups_1, form_base_1, functions_1, models_1, nested_forms_1, variables_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandServerData = command_server_data_1.CommandServerData;
    exports.Commands = commands_1.Commands;
    exports.ContextMenu = context_menu_1.ContextMenu;
    exports.EditPopups = edit_popups_1.EditPopups;
    exports.FormBase = form_base_1.FormBase;
    exports.Functions = functions_1.Functions;
    exports.Models = models_1.Models;
    exports.NestedForms = nested_forms_1.NestedForms;
    exports.Variables = variables_1.Variables;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 841:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(495), __webpack_require__(494), __webpack_require__(490), __webpack_require__(497), __webpack_require__(492), __webpack_require__(496), __webpack_require__(489), __webpack_require__(239), __webpack_require__(499), __webpack_require__(237), __webpack_require__(501), __webpack_require__(57), __webpack_require__(143)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, models_1, functions_1, commands_1, variables_1, edit_popups_1, nested_forms_1, command_server_data_1, toolbar_service_1, default_commands_service_1, command_service_1, widget_creator_service_1, export_1, router_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormBaseImport = (function () {
        function FormBaseImport(bindingEngine, taskQueue, widgetCreator, command, toolbar, defaultCommands, router, error, models, nestedForms, variables, functions, commands, editPopups, binding, globalization, localization, commandServerData, onAttached, onReady, onReactivated, onValidating) {
            this.bindingEngine = bindingEngine;
            this.taskQueue = taskQueue;
            this.widgetCreator = widgetCreator;
            this.command = command;
            this.toolbar = toolbar;
            this.defaultCommands = defaultCommands;
            this.router = router;
            this.error = error;
            this.models = models;
            this.nestedForms = nestedForms;
            this.variables = variables;
            this.functions = functions;
            this.commands = commands;
            this.editPopups = editPopups;
            this.binding = binding;
            this.globalization = globalization;
            this.localization = localization;
            this.commandServerData = commandServerData;
            this.onAttached = onAttached;
            this.onReady = onReady;
            this.onReactivated = onReactivated;
            this.onValidating = onValidating;
        }
        return FormBaseImport;
    }());
    FormBaseImport = tslib_1.__decorate([
        aurelia_framework_1.transient(),
        tslib_1.__metadata("design:paramtypes", [aurelia_framework_1.BindingEngine,
            aurelia_framework_1.TaskQueue,
            widget_creator_service_1.WidgetCreatorService,
            command_service_1.CommandService,
            toolbar_service_1.ToolbarService,
            default_commands_service_1.DefaultCommandsService,
            router_service_1.RouterService,
            export_1.ErrorService,
            models_1.Models,
            nested_forms_1.NestedForms,
            variables_1.Variables,
            functions_1.Functions,
            commands_1.Commands,
            edit_popups_1.EditPopups,
            export_1.BindingService,
            export_1.GlobalizationService,
            export_1.LocalizationService,
            command_server_data_1.CommandServerData,
            export_1.CustomEvent,
            export_1.CustomEvent,
            export_1.CustomEvent,
            export_1.CustomEvent])
    ], FormBaseImport);
    exports.FormBaseImport = FormBaseImport;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 842:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("framework/forms/elements/file-uploader-with-viewer/tip-file-uploader-with-viewer")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tip_file_uploader_with_viewer_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(tip_file_uploader_with_viewer_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 843:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(498)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, selection_mode_enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionModeEnum = selection_mode_enum_1.SelectionModeEnum;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 844:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(840), __webpack_require__(843), __webpack_require__(238), __webpack_require__(848), __webpack_require__(842)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, export_1, export_2, export_3, export_4, export_5) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(export_1);
    __export(export_2);
    __export(export_3);
    __export(export_4);
    __export(export_5);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 845:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(839), __webpack_require__(779)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, selectItems) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectItemService = (function () {
        function SelectItemService(dxTemplate) {
            this.dxTemplate = dxTemplate;
            this.registerTemplates();
        }
        SelectItemService.prototype.getSelectItem = function (id) {
            if (!selectItems) {
                throw new Error("No select-items defined");
            }
            if (!selectItems[id]) {
                throw new Error("Select-item " + id + " is not defined");
            }
            return selectItems[id];
        };
        SelectItemService.prototype.registerTemplates = function () {
            for (var key in selectItems) {
                var selectItem = selectItems[key];
                if (selectItem.titleTemplate) {
                    this.dxTemplate.registerTemplate("from-select-title-template-" + selectItem.id, selectItem.titleTemplate);
                }
                if (selectItem.itemTemplate) {
                    this.dxTemplate.registerTemplate("from-select-item-template-" + selectItem.id, selectItem.itemTemplate);
                }
                if (selectItem.fieldTemplate) {
                    this.dxTemplate.registerTemplate("from-select-field-template-" + selectItem.id, selectItem.titleTemplate);
                }
            }
        };
        return SelectItemService;
    }());
    SelectItemService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.DxTemplateService])
    ], SelectItemService);
    exports.SelectItemService = SelectItemService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 846:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(57)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationService = (function () {
        function ValidationService(localization) {
            this.localization = localization;
            this.validators = {};
            this.registerRequired();
            this.registerEmail();
            this.registerStringLength();
        }
        ValidationService.prototype.registerValidator = function (type, callback) {
            this.validators[type] = callback;
        };
        ValidationService.prototype.getValidator = function (scopeContainer, type, caption, parameters) {
            var validator = this.validators[type];
            if (!validator) {
                throw new Error("Validator " + type + " not found");
            }
            return validator(scopeContainer, caption, parameters);
        };
        ValidationService.prototype.registerRequired = function () {
            var _this = this;
            this.registerValidator("required", function (scopeContainer, caption, parameters) {
                return {
                    type: "required",
                    message: _this.localization.translate([_this.localization.translate(null, caption)], "forms.validator_required")
                };
            });
        };
        ValidationService.prototype.registerEmail = function () {
            var _this = this;
            this.registerValidator("email", function (scopeContainer, caption, parameters) {
                return {
                    type: "email",
                    message: _this.localization.translate([_this.localization.translate(null, caption)], "forms.validator_email")
                };
            });
        };
        ValidationService.prototype.registerStringLength = function () {
            var _this = this;
            this.registerValidator("stringLength", function (scopeContainer, caption, parameters) {
                if (parameters.min && parameters.max) {
                    return {
                        type: "stringLength",
                        message: _this.localization.translate([_this.localization.translate(null, caption), parameters.min, parameters.max], "forms.validator_stringLengthMinMax")
                    };
                }
                else if (parameters.min) {
                    return {
                        type: "stringLength",
                        message: _this.localization.translate([_this.localization.translate(null, caption), parameters.min], "forms.validator_stringLengthMin")
                    };
                }
                else if (parameters.max) {
                    return {
                        type: "stringLength",
                        message: _this.localization.translate([_this.localization.translate(null, caption), parameters.max], "forms.validator_stringLengthMax")
                    };
                }
                else {
                    throw new Error("No min/max specified");
                }
            });
        };
        return ValidationService;
    }());
    ValidationService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.LocalizationService])
    ], ValidationService);
    exports.ValidationService = ValidationService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 847:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(240), __webpack_require__(53), __webpack_require__(498)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, base_widget_creator_service_1, export_1, selection_mode_enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataGridWidgetCreatorService = (function () {
        function DataGridWidgetCreatorService(baseWidgetCreator, globalization, localization) {
            this.baseWidgetCreator = baseWidgetCreator;
            this.globalization = globalization;
            this.localization = localization;
        }
        DataGridWidgetCreatorService.prototype.addDataGrid = function (form, options) {
            var _this = this;
            var dataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.dataModel) {
                var dataSource_1 = this.baseWidgetCreator.createListDataSource(form, options);
                dataGridOptions.dataSource = dataSource_1;
                dataGridOptions.remoteOperations = {
                    filtering: true,
                    paging: true,
                    sorting: true
                };
                form.onReactivated.register(function (e) {
                    dataSource_1.reload();
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
                        column.caption = _this.localization.translate(form.scopeContainer, col.caption);
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
                    if (col.format) {
                        column.format = _this.globalization.getFormatterParser(col.format);
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
            var clickActions = this.baseWidgetCreator.getListClickActions(form, options);
            if (clickActions.length > 0) {
                dataGridOptions.hoverStateEnabled = true;
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
            if (options.height) {
                dataGridOptions.height = options.height;
            }
            this.baseWidgetCreator.checkListToolbar(form, options);
            this.baseWidgetCreator.checkListRelationEdit(form, options);
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
    DataGridWidgetCreatorService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [base_widget_creator_service_1.BaseWidgetCreatorService,
            export_1.GlobalizationService,
            export_1.LocalizationService])
    ], DataGridWidgetCreatorService);
    exports.DataGridWidgetCreatorService = DataGridWidgetCreatorService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 848:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(501)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, widget_creator_service_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(widget_creator_service_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 849:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(240)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, base_widget_creator_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListWidgetCreatorService = (function () {
        function ListWidgetCreatorService(baseWidgetCreator) {
            this.baseWidgetCreator = baseWidgetCreator;
        }
        ListWidgetCreatorService.prototype.addList = function (form, options) {
            var listOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            listOptions.itemTemplate = "itemTemplate";
            if (options.dataModel) {
                var dataSource_1 = this.baseWidgetCreator.createListDataSource(form, options);
                listOptions.dataSource = dataSource_1;
                form.onReactivated.register(function (e) {
                    dataSource_1.reload();
                    return Promise.resolve();
                });
            }
            else if (options.binding.bindTo) {
                listOptions.bindingOptions["dataSource"] = options.binding.bindToFQ;
            }
            var clickActions = this.baseWidgetCreator.getListClickActions(form, options);
            if (clickActions.length > 0) {
                listOptions.onItemClick = function (e) {
                    e.data = e.itemData;
                    clickActions.forEach(function (item) {
                        item(e);
                    });
                };
            }
            this.baseWidgetCreator.checkListToolbar(form, options);
            this.baseWidgetCreator.checkListRelationEdit(form, options);
        };
        return ListWidgetCreatorService;
    }());
    ListWidgetCreatorService = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [base_widget_creator_service_1.BaseWidgetCreatorService])
    ], ListWidgetCreatorService);
    exports.ListWidgetCreatorService = ListWidgetCreatorService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 850:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(57), __webpack_require__(185)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginFuncs = (function () {
        function LoginFuncs(authorization, history) {
            var _this = this;
            this.authorization = authorization;
            this.history = history;
            this.loginCommand = {
                id: "$login",
                title: "login-form-funcs.anmelden_caption",
                execute: function () {
                    _this.authorization
                        .login(_this.form.models.data.$m_login)
                        .then(function (r) {
                        if (r && _this.goToUrlAfterLogin) {
                            _this.history.pipelineUrl = _this.goToUrlAfterLogin;
                        }
                    });
                }
            };
        }
        LoginFuncs.prototype.bind = function (form) {
            this.form = form;
            this.goToUrlAfterLogin = this.history.lastRequestUrl;
            this.form.onReady.register(function (r) {
                return Promise.resolve();
            });
            form.models.data.$m_login = {
                StayLoggedOn: false
            };
        };
        return LoginFuncs;
    }());
    LoginFuncs = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.AuthorizationService,
            export_2.HistoryService])
    ], LoginFuncs);
    exports.LoginFuncs = LoginFuncs;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 851:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(502)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, view_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewItem = view_item_1.ViewItem;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 852:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RoutesCreatorService = (function () {
        function RoutesCreatorService() {
        }
        RoutesCreatorService.prototype.createRoutes = function (structure, routeForms) {
            var routes = [];
            var parentDic = {};
            structure.forEach(function (s) {
                var route = {
                    caption: s.caption,
                    navigation: {
                        icon: s.icon
                    },
                    children: []
                };
                routes.push(route);
                parentDic[s.id] = route;
            });
            for (var routeFormKey in routeForms) {
                var routeForm = routeForms[routeFormKey];
                var route = {
                    caption: routeForm.caption,
                    route: routeForm.route,
                    moduleId: routeForm.moduleId
                };
                if (routeForm.isEnabled) {
                    route.navigation = {};
                    if (routeForm.category) {
                        route.navigation.category = routeForm.category;
                    }
                    if (routeForm.icon) {
                        route.navigation.icon = routeForm.icon;
                    }
                }
                if (routeForm.idParent) {
                    parentDic[routeForm.idParent].children.push(route);
                }
                else {
                    routes.push(route);
                }
            }
            return routes;
        };
        return RoutesCreatorService;
    }());
    exports.RoutesCreatorService = RoutesCreatorService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 853:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleLoader = (function () {
        function ModuleLoader() {
            'framework/login/views/login/login-form';
            'framework/security/views/authgroup/authgroup-edit-form';
            'framework/security/views/authgroup/authgroup-list-form';
        }
        return ModuleLoader;
    }());
    exports.ModuleLoader = ModuleLoader;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 860:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "91732a2beb42a3a3c0a9ad3b56d1bf7a.ttf";

/***/ }),

/***/ 861:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "9c18694294666d556dd5dcdb2a062156.woff";

/***/ }),

/***/ 862:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "e85c5f6a413d104bbfadd04e8bb548cb.jpg";

/***/ }),

/***/ 870:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 871:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(506);
__webpack_require__(242);
__webpack_require__(505);
module.exports = __webpack_require__(504);


/***/ }),

/***/ "app":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(503), __webpack_require__(235), __webpack_require__(836), __webpack_require__(777), __webpack_require__(780)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, export_3, routesForm, routesStructure) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(router, routesCreator, layout, header) {
            this.router = router;
            this.routesCreator = routesCreator;
            this.layout = layout;
            this.header = header;
            this.routes = [];
            this.routes = routesCreator.createRoutes(routesStructure, routesForm);
            this.layout.activateTheme();
            this.header.onSearch.register(function () {
                return Promise.resolve();
            });
            this.header.commands.push({
                id: "dummy",
                title: "Mails",
                icon: "envelope-o",
                execute: function () {
                    DevExpress.ui.dialog.alert("Neues Mail wird erstellt", "Information");
                }
            });
        }
        App.prototype.attached = function () {
            this.router.registerRoutes(this.routes, "security/authgroup");
        };
        return App;
    }());
    App = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.RouterService,
            export_1.RoutesCreatorService,
            export_2.LayoutService,
            export_3.HeaderService])
    ], App);
    exports.App = App;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "app.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template>\r\n  <require from=\"./framework/default-ui/views/container/container\"></require>\r\n  <container></container>\r\n</template>\r\n";

/***/ }),

/***/ "framework/base/attributes/icon/fa-icon-attribute":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FaIconAttribute = (function () {
        function FaIconAttribute(element) {
            this.element = element;
        }
        FaIconAttribute.prototype.bind = function () {
            this.setClass();
        };
        FaIconAttribute.prototype.iconChanged = function (newValue, oldValue) {
            this.setClass();
        };
        FaIconAttribute.prototype.setClass = function () {
            var element = $(this.element);
            if (this.currentIcon) {
                element.removeClass(this.currentIcon);
                this.currentIcon = null;
            }
            if (this.icon) {
                this.currentIcon = "fa fa-" + this.icon;
                element.addClass(this.currentIcon);
            }
        };
        return FaIconAttribute;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], FaIconAttribute.prototype, "icon", void 0);
    FaIconAttribute = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.customAttribute("fa-icon"),
        tslib_1.__metadata("design:paramtypes", [Element])
    ], FaIconAttribute);
    exports.FaIconAttribute = FaIconAttribute;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/base/attributes/translation/translation-attribute":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(53), __webpack_require__(482)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, scope_container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrCustomAttribute = (function () {
        function TrCustomAttribute(element, localization) {
            this.element = element;
            this.localization = localization;
        }
        TrCustomAttribute.prototype.bind = function (bindingContext, overrideContext) {
            this.scope = {
                bindingContext: bindingContext,
                overrideContext: overrideContext
            };
            this.scopeContainer = new scope_container_1.ScopeContainer(this.scope);
            this.setInnerHtml();
        };
        TrCustomAttribute.prototype.unbind = function () {
            this.scopeContainer.disposeAll();
        };
        TrCustomAttribute.prototype.keyChanged = function (newValue, oldValue) {
            this.setInnerHtml();
        };
        TrCustomAttribute.prototype.setInnerHtml = function () {
            var _this = this;
            this.localization.translate(this.scopeContainer, this.key, function (val) {
                _this.element.innerHTML = val;
            });
        };
        return TrCustomAttribute;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], TrCustomAttribute.prototype, "mode", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], TrCustomAttribute.prototype, "key", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Boolean)
    ], TrCustomAttribute.prototype, "markdown", void 0);
    TrCustomAttribute = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.customAttribute("tr"),
        tslib_1.__metadata("design:paramtypes", [Element,
            export_1.LocalizationService])
    ], TrCustomAttribute);
    exports.TrCustomAttribute = TrCustomAttribute;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/base/index":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework"), __webpack_require__(819)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources('./attributes/icon/fa-icon-attribute')
            .globalResources('./attributes/translation/translation-attribute')
            .globalResources('./value-converters/translation/translation-value-converter')
            .globalResources('./value-converters/sort/sort-value-converter');
    }
    exports.configure = configure;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/base/value-converters/sort/sort-value-converter":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(53)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SortValueConverter = (function () {
        function SortValueConverter(localization) {
            this.localization = localization;
        }
        SortValueConverter.prototype.toView = function (data, propertyName, direction, translate) {
            var _this = this;
            if (direction === void 0) { direction = "asc"; }
            if (translate === void 0) { translate = false; }
            var factor = direction === "asc" ? 1 : -1;
            return data
                .slice(0)
                .sort(function (a, b) {
                var valA = a[propertyName];
                if (valA == void (0)) {
                    valA = "";
                }
                var valB = b[propertyName];
                if (valB == void (0)) {
                    valB = "";
                }
                if (translate) {
                    if (valA) {
                        valA = _this.localization.translate(null, valA) || "";
                    }
                    if (valB) {
                        valB = _this.localization.translate(null, valB) || "";
                    }
                }
                return valA.localeCompare(valB) * factor;
            });
        };
        return SortValueConverter;
    }());
    SortValueConverter = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.LocalizationService])
    ], SortValueConverter);
    exports.SortValueConverter = SortValueConverter;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/base/value-converters/translation/translation-value-converter":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(234)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, localization_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TranslationValueConverter = (function () {
        function TranslationValueConverter(localization) {
            this.localization = localization;
        }
        TranslationValueConverter.prototype.toView = function (value) {
            return this.localization.translate(null, value);
        };
        return TranslationValueConverter;
    }());
    TranslationValueConverter = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.valueConverter("tr"),
        tslib_1.__metadata("design:paramtypes", [localization_service_1.LocalizationService])
    ], TranslationValueConverter);
    exports.TranslationValueConverter = TranslationValueConverter;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/index":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(821), __webpack_require__(822), __webpack_require__(820)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) { }
    exports.configure = configure;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/views/container/container":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(183)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, layout_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom("layout.isSidebarCollapsed"),
        tslib_1.__metadata("design:type", String),
        tslib_1.__metadata("design:paramtypes", [])
    ], Container.prototype, "className", null);
    Container = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [layout_service_1.LayoutService])
    ], Container);
    exports.Container = Container;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/views/container/container.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--container\" class.bind=\"className\">\r\n  <require from=\"./container.less\"></require>\r\n  \r\n  <require from=\"../loading/loading\"></require>\r\n  <require from=\"../sidebar/sidebar\"></require>\r\n  <require from=\"../header/header\"></require>\r\n  <require from=\"../content/content\"></require>\r\n\r\n  <loading></loading>\r\n  <sidebar></sidebar>\r\n  <header></header>\r\n  <content></content>\r\n</template>\r\n";

/***/ }),

/***/ "framework/default-ui/views/container/container.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--container {\n  display: block;\n  width: 100vw;\n  height: 100vh;\n}\n.t--toolbar-title {\n  min-width: 220px;\n  padding: 0 12px;\n  font-size: 20px;\n  font-weight: 100;\n  color: white;\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/default-ui/views/content/content":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(183)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, layout_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Content = (function () {
        function Content(layout) {
            this.layout = layout;
        }
        return Content;
    }());
    Content = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [layout_service_1.LayoutService])
    ], Content);
    exports.Content = Content;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/views/content/content.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--content\">\r\n  <require from=\"./content.less\"></require>\r\n\r\n  <stack-router></stack-router>\r\n</template>\r\n";

/***/ }),

/***/ "framework/default-ui/views/content/content.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--content {\n  display: block;\n  margin-left: 280px;\n  height: calc(100% - 60px);\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: margin-left;\n}\n.t--sidebar-collapsed .t--content {\n  margin-left: 60px;\n}\n.t--view-current {\n  display: block;\n}\n.t--view-history {\n  display: none;\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/default-ui/views/header/header":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(185), __webpack_require__(57), __webpack_require__(235), __webpack_require__(844)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, export_3, export_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Header = (function () {
        function Header(taskQueue, router, authorization, header, localization, command) {
            var _this = this;
            this.taskQueue = taskQueue;
            this.router = router;
            this.authorization = authorization;
            this.header = header;
            this.localization = localization;
            this.command = command;
            this.searchTextOptions = {
                mode: "search",
                placeholder: this.localization.translate(null, "default_ui.search"),
                onKeyPress: function (e) {
                    if (e.jQueryEvent.keyCode !== 13) {
                        return;
                    }
                    _this.taskQueue.queueTask(function () {
                        var value = e.component.option("value");
                        if (value == void (null) || value == "") {
                            return;
                        }
                        _this.header.onSearch.fire({
                            text: value
                        });
                    });
                }
            };
            this.avatarPopoverOptions = {
                contentTemplate: "contentTemplate",
                width: "250px"
            };
            if (!this.header.avatarCommands.find(function (c) { return c.id === "logout"; })) {
                this.header.avatarCommands.push({
                    id: "logout",
                    title: "Abmelden",
                    execute: function () {
                        _this.logout();
                    }
                });
            }
        }
        Header.prototype.bind = function (bindingContext, overrideContext) {
            this.scope = {
                bindingContext: bindingContext,
                overrideContext: overrideContext
            };
            this.scopeContainer = new export_2.ScopeContainer(this.scope);
            this.prepareCommands();
        };
        Header.prototype.unbind = function () {
            this.scopeContainer.disposeAll();
        };
        Header.prototype.logout = function () {
            this.authorization.logout();
        };
        Header.prototype.onAvatarClick = function () {
            var popover = this.avatarPopover.instance;
            popover.show(this.avatar);
        };
        Header.prototype.prepareCommands = function () {
            var _this = this;
            if (this.header.avatarCommands) {
                this.avatarCommands = this.header.avatarCommands.map(function (c) {
                    return _this.convertCommand(c);
                });
            }
            if (this.header.commands) {
                this.commands = this.header.commands.map(function (c) {
                    return _this.convertCommand(c);
                });
            }
        };
        Header.prototype.convertCommand = function (command) {
            var _this = this;
            return {
                id: command.id,
                title: command.title,
                icon: command.icon,
                isEnabled: this.command.isEnabled(this.scope, command),
                isVisible: this.command.isVisible(this.scope, command),
                execute: function () {
                    _this.command.execute(_this.scope, command);
                }
            };
        };
        return Header;
    }());
    Header = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [aurelia_framework_1.TaskQueue,
            export_1.RouterService,
            export_2.AuthorizationService,
            export_3.HeaderService,
            export_2.LocalizationService,
            export_4.CommandService])
    ], Header);
    exports.Header = Header;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/views/header/header.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--header\">\r\n  <require from=\"./header.less\"></require>\r\n\r\n  <div class=\"t--header-flex\">\r\n    <div class=\"t--header-logo\" if.bind=\"header.logoUrl\">\r\n      <img src.bind=\"header.logoUrl\">\r\n    </div>\r\n    <div class=\"t--header-title\" if.bind=\"header.text\">\r\n      ${header.text}\r\n    </div>\r\n    <div class=\"t--header-search\" if.bind=\"header.onSearch.anyRegistered\">\r\n      <dx-widget name=\"dxTextBox\" options.bind=\"searchTextOptions\"></dx-widget>\r\n    </div>\r\n    <div class=\"t--header-between\"></div>\r\n    <div class=\"t--header-options\">\r\n      <div repeat.for=\"command of commands\" click.delegate=\"command.execute()\" if.bind=\"command.isVisible && command.isEnabled\">\r\n        <div class=\"t--header-command\">\r\n          <i class=\"fa fa-${command.icon}\" if.bind=\"command.icon\"></i>\r\n          <div>${command.title}</div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"t--header-avatar\" click.delegate=\"onAvatarClick()\" ref=\"avatar\">\r\n        <div css.bind=\"header.avatarStyle\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <dx-widget name=\"dxPopover\" options.bind=\"avatarPopoverOptions\" view-model.ref=\"avatarPopover\">\r\n    <dx-template name=\"contentTemplate\">\r\n      <div class=\"t--header-avatar-command-container\">\r\n        <div repeat.for=\"command of avatarCommands\" click.delegate=\"command.execute()\" if.bind=\"command.isVisible && command.isEnabled\">\r\n          <div class=\"t--header-avatar-command\">\r\n            ${command.title}\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </dx-template>\r\n  </dx-widget>\r\n</template>";

/***/ }),

/***/ "framework/default-ui/views/header/header.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--header {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  margin-left: 280px;\n  padding-left: 12px;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: margin-left;\n}\n.t--sidebar-collapsed .t--header {\n  margin-left: 60px;\n}\n.t--header-flex {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n}\n.t--header-flex > div:not(:first-child) {\n  margin-left: 24px;\n}\n.t--header-logo {\n  height: 35px;\n}\n.t--header-logo > img {\n  height: 100%;\n}\n.t--header-title {\n  display: flex;\n  align-items: center;\n}\n.t--header-between {\n  flex-grow: 1;\n}\n.t--header-options {\n  display: flex;\n  height: 100%;\n  align-items: center;\n}\n.t--header-options > div {\n  height: 100%;\n  padding: 0 12px;\n  border-left: 1px solid #eeeeee;\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n}\n.t--header-options > div:not(.t--header-avatar):hover {\n  background-color: #eeeeee;\n}\n.t--header-avatar > div {\n  height: 35px;\n  width: 35px;\n  border-radius: 35px;\n  border: 1px solid darkgray;\n  background-position: center center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n.t--header-avatar-command-container {\n  padding: 12px;\n}\n.t--header-avatar-command {\n  cursor: pointer;\n}\n.t--header-command {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  cursor: pointer;\n}\n.t--header-command i {\n  margin-bottom: 6px;\n  font-size: 16px;\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/default-ui/views/loading-spinner/loading-spinner":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadingSpinner = (function () {
        function LoadingSpinner(element) {
            this.element = element;
        }
        LoadingSpinner.prototype.bind = function () {
            $(this.element).removeClass("t--loading-active");
        };
        LoadingSpinner.prototype.attached = function () {
            var _this = this;
            setTimeout(function () {
                $(_this.element).addClass("t--loading-active");
            }, 500);
        };
        return LoadingSpinner;
    }());
    LoadingSpinner = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [Element])
    ], LoadingSpinner);
    exports.LoadingSpinner = LoadingSpinner;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/views/loading-spinner/loading-spinner.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--loading\">\r\n  <require from=\"./loading-spinner.less\"></require>\r\n  \r\n  <div class=\"t--loading-spinner\">\r\n    <div class=\"t--loading-rect1\"></div>\r\n    <div class=\"t--loading-rect2\"></div>\r\n    <div class=\"t--loading-rect3\"></div>\r\n    <div class=\"t--loading-rect4\"></div>\r\n    <div class=\"t--loading-rect5\"></div>\r\n  </div>\r\n</template>";

/***/ }),

/***/ "framework/default-ui/views/loading-spinner/loading-spinner.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--loading {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  font-family: \"Helvetica Neue\", \"Segoe UI\", Helvetica, Verdana, sans-serif;\n  font-size: 60px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(255, 255, 255, 0.8);\n  z-index: 9999;\n  opacity: 0;\n  transition-delay: 500ms;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: opacity;\n}\n.t--loading.t--loading-active {\n  opacity: 1;\n}\n.t--loading-spinner {\n  margin: 100px auto;\n  width: 50px;\n  height: 40px;\n  text-align: center;\n  font-size: 10px;\n}\n.t--loading-spinner > div {\n  background-color: #333;\n  height: 100%;\n  width: 6px;\n  display: inline-block;\n  -webkit-animation: animationLoadingSpinner 1.2s infinite ease-in-out;\n  animation: animationLoadingSpinner 1.2s infinite ease-in-out;\n}\n.t--loading-spinner > .t--loading-rect2 {\n  -webkit-animation-delay: -1.1s;\n  animation-delay: -1.1s;\n}\n.t--loading-spinner > .t--loading-rect3 {\n  -webkit-animation-delay: -1s;\n  animation-delay: -1s;\n}\n.t--loading-spinner > .t--loading-rect4 {\n  -webkit-animation-delay: -0.9s;\n  animation-delay: -0.9s;\n}\n.t--loading-spinner > .t--loading-rect5 {\n  -webkit-animation-delay: -0.8s;\n  animation-delay: -0.8s;\n}\n@-webkit-keyframes animationLoading {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes animationLoading {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes animationLoadingSpinner {\n  0%,\n  40%,\n  100% {\n    -webkit-transform: scaleY(0.4);\n  }\n  20% {\n    -webkit-transform: scaleY(1);\n  }\n}\n@keyframes animationLoadingSpinner {\n  0%,\n  40%,\n  100% {\n    transform: scaleY(0.4);\n    -webkit-transform: scaleY(0.4);\n  }\n  20% {\n    transform: scaleY(1);\n    -webkit-transform: scaleY(1);\n  }\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/default-ui/views/loading/loading":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(488)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, loading_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Loading = (function () {
        function Loading(loading) {
            this.loading = loading;
        }
        return Loading;
    }());
    Loading = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [loading_service_1.LoadingService])
    ], Loading);
    exports.Loading = Loading;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/views/loading/loading.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template>\r\n  <require from=\"../loading-spinner/loading-spinner\"></require>\r\n\r\n  <loading-spinner if.bind=\"loading.isLoading\"></loading-spinner>\r\n</template>";

/***/ }),

/***/ "framework/default-ui/views/sidebar-sub/sidebar-sub":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SidebarSub = (function () {
        function SidebarSub() {
        }
        return SidebarSub;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Object)
    ], SidebarSub.prototype, "route", void 0);
    SidebarSub = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [])
    ], SidebarSub);
    exports.SidebarSub = SidebarSub;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/views/sidebar-sub/sidebar-sub.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--sidebar-sub au-animate\">\r\n  <require from=\"./sidebar-sub.less\"></require>\r\n\r\n  <ul class=\"t--sidebar-sub-ul\">\r\n    <li repeat.for=\"child of route.children | sort:'caption':'asc':true\">\r\n      <a \r\n        href.bind=\"child.route ? '#' + child.route : ''\" \r\n        class=\"t--sidebar-sub-item\"\r\n        stack-router-link=\"clear-stack.bind: true\">\r\n        <span class=\"t--sidebar-sub-item-title\" tr=\"key.bind: child.caption\">\r\n        </span>\r\n      </a>\r\n    </li>\r\n  </ul>\r\n</template>";

/***/ }),

/***/ "framework/default-ui/views/sidebar-sub/sidebar-sub.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, ".t--sidebar-sub-ul {\n  column-fill: auto;\n  column-count: 2;\n  column-width: 200px;\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/default-ui/views/sidebar/sidebar":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(183), __webpack_require__(185), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, layout_service_1, export_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sidebar = (function () {
        function Sidebar(layout, router) {
            this.layout = layout;
            this.router = router;
            this.sidebarExpandedProp = "sidebarExpanded";
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
        Sidebar.prototype.attached = function () {
            window.addEventListener("click", this.onWindowClick.bind(this));
        };
        Sidebar.prototype.detached = function () {
            window.removeEventListener("click", this.onWindowClick.bind(this));
        };
        Sidebar.prototype.onHeaderClicked = function () {
            this.layout.isSidebarCollapsed = !this.layout.isSidebarCollapsed;
        };
        Sidebar.prototype.onRouteClicked = function (route) {
            if (this.routeExpanded) {
                this.routeExpanded[this.sidebarExpandedProp] = false;
                this.routeExpanded = null;
            }
            if (route.children.length === 0) {
                return;
            }
            this.routeExpanded = route;
            this.routeExpanded[this.sidebarExpandedProp] = true;
        };
        Sidebar.prototype.onWindowClick = function (e) {
            if (!this.routeExpanded) {
                return;
            }
            var target = $(e.target);
            if (target.hasClass("t--sidebar-item") || target.parents(".t--sidebar-item").length > 0) {
                return;
            }
            this.routeExpanded[this.sidebarExpandedProp] = false;
            this.routeExpanded = null;
        };
        return Sidebar;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom("layout.isSidebarCollapsed"),
        tslib_1.__metadata("design:type", String),
        tslib_1.__metadata("design:paramtypes", [])
    ], Sidebar.prototype, "headerIcon", null);
    Sidebar = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [layout_service_1.LayoutService,
            export_1.RouterService])
    ], Sidebar);
    exports.Sidebar = Sidebar;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/default-ui/views/sidebar/sidebar.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--sidebar\">\r\n  <require from=\"../sidebar-sub/sidebar-sub\"></require>\r\n  <require from=\"./sidebar.less\"></require>\r\n\r\n  <div class=\"t--sidebar-header\" click.delegate=\"onHeaderClicked()\">\r\n    <div class=\"t--sidebar-header-title\" tr=\"key: base.navigation\">\r\n    </div>\r\n    <div class=\"t--sidebar-header-icon\">\r\n      <i class=\"fa fa-${headerIcon}\"></i>\r\n    </div>\r\n  </div>\r\n\r\n  <ul>\r\n    <li\r\n      repeat.for=\"route of router.navigationRoutes\">\r\n      <sidebar-sub route.bind=\"route\" if.bind=\"route.sidebarExpanded\"></sidebar-sub>\r\n      <a \r\n        href.bind=\"route.route ? '#' + route.route : ''\" \r\n        class=\"t--sidebar-item\"\r\n        click.delegate=\"onRouteClicked(route)\"\r\n        stack-router-link=\"clear-stack.bind: true\">\r\n        <span class=\"t--sidebar-item-title\" tr=\"key.bind: route.caption\">\r\n        </span>\r\n        <span class=\"t--sidebar-item-icon\" if.bind=\"route.navigation.icon\" title.bind=\"route.caption | tr\">\r\n          <i class=\"fa fa-${route.navigation.icon}\"></i>\r\n        </span>\r\n      </a>\r\n    </li>\r\n  </ul>\r\n</template>\r\n";

/***/ }),

/***/ "framework/default-ui/views/sidebar/sidebar.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--sidebar {\n  display: block;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  width: 280px;\n  background-color: #2a2e35;\n  font-size: 14px;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: left;\n}\n.t--sidebar ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.t--sidebar-collapsed .t--sidebar {\n  left: -220px;\n}\n.t--sidebar-collapsed .t--sidebar-sub {\n  left: 60px;\n}\n.t--sidebar-header {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  background-color: #262930;\n  color: white;\n  cursor: pointer;\n}\n.t--sidebar-header-title {\n  flex-grow: 1;\n  font-size: 26px;\n  font-weight: 100;\n  padding: 12px;\n}\n.t--sidebar-header-icon {\n  display: flex;\n  width: 60px;\n  align-items: center;\n  justify-content: center;\n}\n.t--sidebar-item {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  color: lightgray;\n  text-decoration: none;\n}\n.t--sidebar-item:hover {\n  color: white;\n}\n.t--sidebar-item-title {\n  flex-grow: 1;\n  padding: 12px;\n}\n.t--sidebar-item-icon {\n  display: flex;\n  width: 60px;\n  align-items: center;\n  justify-content: center;\n}\n.t--sidebar-sub {\n  position: fixed;\n  z-index: -9;\n  left: 280px;\n  min-width: 280px;\n  background-color: #2a2e35;\n  padding: 12px;\n}\n.t--sidebar-sub.au-enter-active {\n  animation: leftFadeIn 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n}\n.t--sidebar-sub-item {\n  color: lightgray;\n  text-decoration: none;\n}\n.t--sidebar-sub-item:hover {\n  color: white;\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/dx/elements/dx-widget":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(184), __webpack_require__(57), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, dx_template_service_1, export_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DxWidget = DxWidget_1 = (function () {
        function DxWidget(element, templatingEngine, binding, deepObserver, dxTemplate) {
            this.element = element;
            this.templatingEngine = templatingEngine;
            this.binding = binding;
            this.deepObserver = deepObserver;
            this.dxTemplate = dxTemplate;
            this.templates = {};
        }
        DxWidget.prototype.created = function (owningView, myView) {
            this.owningView = owningView;
        };
        DxWidget.prototype.bind = function (bindingContext, overrideContext) {
            this.scope = {
                bindingContext: bindingContext,
                overrideContext: overrideContext
            };
            this.scopeContainer = new export_1.ScopeContainer(this.scope);
            this.extractTemplates();
            this.checkBindings();
        };
        DxWidget.prototype.unbind = function () {
            this.scopeContainer.disposeAll();
        };
        DxWidget.prototype.attached = function () {
            this.renderInline();
            this.options = this.options || {};
            this.options.onOptionChanged = this.onOptionChanged.bind(this);
            this.options.modelByElement = DxWidget_1.modelByElement;
            this.options.integrationOptions = {
                templates: this.templates
            };
            var element = $(this.element);
            if (!element[this.name]) {
                throw new Error("Widget " + this.name + " does not exist");
            }
            element = element[this.name](this.options);
            var validatorElement;
            if (this.validator) {
                validatorElement = element.dxValidator(this.validator);
            }
            else if (this.options["validators"]) {
                validatorElement = element.dxValidator({
                    validationRules: this.options["validators"]
                });
            }
            if (validatorElement) {
                this.validatorInstance = validatorElement.dxValidator("instance");
            }
            this.instance = element[this.name]("instance");
            this.registerBindings();
        };
        DxWidget.prototype.detached = function () {
            if (this.instance) {
                this.instance._dispose();
                this.instance = null;
            }
            if (this.validatorInstance) {
                this.validatorInstance._dispose();
                this.validatorInstance = null;
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
        DxWidget.prototype.isChangingProperty = function (propertyName) {
            return this._currentChangingProperty === propertyName;
        };
        DxWidget.prototype.resetValidation = function () {
            if (this.instance.option("isValid") === false) {
                this.setOptionValue("isValid", true);
            }
        };
        DxWidget.modelByElement = function (element) {
            if (element.jquery) {
                element = element.get(0);
            }
            if (!element.au || !element.au.controller || !element.au.controller.viewModel || !element.au.controller.viewModel.scope) {
                return null;
            }
            return element.au.controller.viewModel.scope.bindingContext;
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
                        return _this.dxTemplate.render(item, renderData.container, _this.owningView.resources, _this.scope, renderData.model);
                    }
                };
                $(item).remove();
            });
            Object.assign(this.templates, this.dxTemplate.getTemplates(this.scope, this.owningView.resources));
        };
        DxWidget.prototype.registerBindings = function () {
            var _this = this;
            if (!this.options.bindingOptions) {
                return;
            }
            var _loop_1 = function (property) {
                var binding = this_1.options.bindingOptions[property];
                this_1.binding.observe(this_1.scopeContainer, binding.expression, function (newValue, oldValue) {
                    _this.setOptionValue(property, newValue, true);
                    _this.registerDeepObserver(binding, property, value);
                });
                var value = this_1.binding.evaluate(this_1.scope, binding.expression);
                this_1.setOptionValue(property, value, true);
                this_1.registerDeepObserver(binding, property, value);
            };
            var this_1 = this;
            for (var property in this.options.bindingOptions) {
                _loop_1(property);
            }
        };
        DxWidget.prototype.checkBindings = function () {
            if (!this.options) {
                throw new Error("Invalid or no options for " + this.name);
            }
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
                _this.setOptionValue(property, value, true);
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
            var currValue = this.binding.evaluate(this.scope, binding.expression);
            if (currValue === e.value) {
                return;
            }
            this.binding.assign(this.scope, binding.expression, e.value);
        };
        DxWidget.prototype.renderInline = function () {
            var _this = this;
            $(this.element).children().each(function (index, child) {
                var result = _this.templatingEngine.enhance({
                    element: child,
                    resources: _this.owningView.resources,
                    bindingContext: _this.scope.bindingContext,
                    overrideContext: _this.scope.overrideContext
                });
                result.attached();
            });
        };
        DxWidget.prototype.setOptionValue = function (propertyName, value, isValid) {
            if (value == void (0) && (propertyName === "items" || propertyName === "dataSource")) {
                value = [];
            }
            var currentValue = this.instance.option(propertyName);
            if (currentValue === value) {
                return;
            }
            this._currentChangingProperty = propertyName;
            if (isValid && propertyName == "value") {
                var data = {};
                data[propertyName] = value;
                data["isValid"] = true;
                this.instance.option(data);
            }
            else {
                this.instance.option(propertyName, value);
            }
            this._currentChangingProperty = null;
        };
        return DxWidget;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], DxWidget.prototype, "name", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Object)
    ], DxWidget.prototype, "options", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Object)
    ], DxWidget.prototype, "validator", void 0);
    DxWidget = DxWidget_1 = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.processContent(false),
        tslib_1.__metadata("design:paramtypes", [Element,
            aurelia_framework_1.TemplatingEngine,
            export_1.BindingService,
            export_1.DeepObserverService,
            dx_template_service_1.DxTemplateService])
    ], DxWidget);
    exports.DxWidget = DxWidget;
    var DxWidget_1;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/dx/elements/dx-widget.html":
/***/ (function(module, exports) {

module.exports = "<template class=\"dx-widget\">\r\n</template>";

/***/ }),

/***/ "framework/dx/index":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework"), __webpack_require__(838)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1, dx_loader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        var dxLoader = new dx_loader_1.DxLoader();
        config
            .globalResources('./elements/dx-widget');
    }
    exports.configure = configure;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/forms/elements/file-uploader-with-viewer/tip-file-uploader-with-viewer":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(57), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TipFileUploaderWithViewer = (function () {
        function TipFileUploaderWithViewer(file, localization, binding, bindingEngine, taskQueue) {
            var _this = this;
            this.file = file;
            this.localization = localization;
            this.binding = binding;
            this.bindingEngine = bindingEngine;
            this.taskQueue = taskQueue;
            this.observables = [];
            this.downloadButtonOptions = {
                text: "Download",
                onClick: function () {
                    window.open(_this.downloadUrl, "_blank");
                }
            };
        }
        TipFileUploaderWithViewer.prototype.bind = function (bindingContext, overrideContext) {
            var _this = this;
            this.bindingContext = bindingContext;
            this.overrideContext = overrideContext;
            var bindingOptions = this.options["bindingOptions"];
            if (bindingOptions && bindingOptions.value) {
                this.observeValue(bindingOptions.value, function (v) { return _this.currentValue = v; });
            }
            if (this.options.iconDownloadExpression) {
                this.observeValue(this.options.iconDownloadExpression, function (v) { return _this.iconDownload = v; });
            }
            else if (this.options.iconDownload) {
                this.iconDownload = this.options.iconDownload;
            }
            if (this.options.placeholderImageExpression) {
                this.observeValue(this.options.placeholderImageExpression, function (v) { return _this.placeholderImage = v; });
            }
            else if (this.options.placeholderImage) {
                this.placeholderImage = this.options.placeholderImage;
            }
            if (this.options.placeholderIconExpression) {
                this.observeValue(this.options.placeholderIconExpression, function (v) { return _this.placeholderIcon = v; });
            }
            else if (this.options.placeholderIcon) {
                this.placeholderIcon = this.options.placeholderIcon;
            }
            this.placeholderImageText = this.options.placeholderImageText
                || this.localization.translate(null, "forms.file_uploadClickHere");
            if (this.options.height) {
                this.imageStyle = {
                    height: this.options.height
                };
            }
        };
        TipFileUploaderWithViewer.prototype.unbind = function () {
            if (this.observables) {
                this.observables.forEach(function (c) { return c.dispose(); });
                this.observables.length = 0;
            }
        };
        TipFileUploaderWithViewer.prototype.attached = function () {
            var _this = this;
            $(this.input).on("change", function (e) {
                if (_this.input.files.length !== 1) {
                    return;
                }
                _this.taskQueue.queueMicroTask(function () {
                    _this.file
                        .upload(_this.input.files[0])
                        .then(function (r) {
                        if (!r || !r.length) {
                            return;
                        }
                        _this.currentValue = r[0];
                        var bindingOptions = _this.options["bindingOptions"];
                        if (bindingOptions && bindingOptions.value) {
                            var expression = _this.bindingEngine.parseExpression(bindingOptions.value);
                            expression.assign({
                                bindingContext: _this.bindingContext,
                                overrideContext: _this.overrideContext
                            }, r[0], null);
                        }
                    });
                });
            });
        };
        TipFileUploaderWithViewer.prototype.getExpressionContext = function (propertyName) {
            return this.binding.getBindingContext({
                bindingContext: this.bindingContext,
                overrideContext: this.overrideContext
            }, propertyName);
        };
        TipFileUploaderWithViewer.prototype.observeValue = function (propertyName, setValueCallback) {
            var _this = this;
            var expression = this.bindingEngine.parseExpression(propertyName);
            var context = this.getExpressionContext(propertyName);
            var observer = this.bindingEngine.expressionObserver(context, propertyName);
            this.observables.push(observer.subscribe(function (newValue, oldValue) {
                setValueCallback(expression.evaluate({
                    bindingContext: _this.bindingContext,
                    overrideContext: _this.overrideContext
                }));
            }));
            setValueCallback(expression.evaluate({
                bindingContext: this.bindingContext,
                overrideContext: this.overrideContext
            }));
        };
        TipFileUploaderWithViewer.prototype.currentValueChanged = function (newValue) {
            if (newValue) {
                this.downloadUrl = this.file.getDownloadUrl(newValue);
            }
            else {
                this.downloadUrl = null;
            }
        };
        TipFileUploaderWithViewer.prototype.iconDownloadChanged = function (newValue) {
            var downloadButton = this["downloadButton"];
            var icon = "fa fa-" + (this.iconDownload || "cloud-download");
            if (downloadButton) {
                downloadButton.option("icon", icon);
            }
            else {
                this.downloadButtonOptions.icon = icon;
            }
        };
        TipFileUploaderWithViewer.prototype.onClick = function (event) {
            $(this.input).trigger("click");
            event.stopPropagation();
            event.preventDefault();
        };
        return TipFileUploaderWithViewer;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Object)
    ], TipFileUploaderWithViewer.prototype, "options", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.observable,
        tslib_1.__metadata("design:type", Object)
    ], TipFileUploaderWithViewer.prototype, "currentValue", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.observable,
        tslib_1.__metadata("design:type", String)
    ], TipFileUploaderWithViewer.prototype, "iconDownload", void 0);
    TipFileUploaderWithViewer = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.FileService,
            export_1.LocalizationService,
            export_1.BindingService,
            aurelia_framework_1.BindingEngine,
            aurelia_framework_1.TaskQueue])
    ], TipFileUploaderWithViewer);
    exports.TipFileUploaderWithViewer = TipFileUploaderWithViewer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/forms/elements/file-uploader-with-viewer/tip-file-uploader-with-viewer.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--file-uploader-with-viewer\">\r\n  <require from=\"./tip-file-uploader-with-viewer.less\"></require>\r\n  <input type=\"file\" accept.bind=\"options.acceptType\" ref=\"input\">\r\n\r\n  <div class=\"t--file-uploader-with-viewer-click-region\" click.delegate=\"onClick($event)\">\r\n    <div if.bind=\"placeholderImage && !downloadUrl\" class=\"t--file-uploader-placeholder-image\" css.bind=\"imageStyle\">\r\n      <img src.bind=\"placeholderImage\" />\r\n    </div>\r\n    <div if.bind=\"placeholderImageText && !downloadUrl\" class=\"t--file-uploader-placeholder-image-text\"></div>\r\n      <span>${placeholderImageText}</span>\r\n    <div if.bind=\"placeholderIcon && !downloadUrl\" class=\"t--file-uploader-placeholder-icon\">\r\n      <i class=\"fa fa-${placeholderIcon}\"></i>\r\n    </div>\r\n\r\n    <div if.bind=\"downloadUrl\" class=\"t--file-uploader-image\" css.bind=\"imageStyle\">\r\n      <img src.bind=\"downloadUrl\" />\r\n    </div>\r\n\r\n    <dx-widget class=\"t--file-uploader-with-viewer-download\" if.bind=\"downloadUrl\" view-model.ref=\"downloadButton\" name=\"dxButton\" options.bind=\"downloadButtonOptions\"></dx-widget>\r\n  </div>\r\n</template>";

/***/ }),

/***/ "framework/forms/elements/file-uploader-with-viewer/tip-file-uploader-with-viewer.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, ".t--file-uploader-with-viewer input {\n  height: 0;\n  width: 0;\n}\n.t--file-uploader-with-viewer .t--file-uploader-with-viewer-click-region {\n  display: block;\n  width: 100%;\n  min-height: 150px;\n  border: 3px dotted gray;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 12px;\n}\n.t--file-uploader-with-viewer .t--file-uploader-image,\n.t--file-uploader-with-viewer t--file-uploader-placeholder-image {\n  width: 100%;\n  min-height: 150px;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-content: center;\n}\n.t--file-uploader-with-viewer .t--file-uploader-with-viewer-download {\n  margin-top: 12px;\n}\n.t--file-uploader-with-viewer img {\n  max-height: 100%;\n  max-width: 100%;\n  position: absolute;\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/forms/index":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework"), __webpack_require__(184), __webpack_require__(823)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1, dx_template_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources('./elements/file-uploader-with-viewer/tip-file-uploader-with-viewer');
        var dxTemplate = config.container.get(dx_template_service_1.DxTemplateService);
        DevExpress.ui.dxPopover.defaultOptions({
            options: {
                animation: { show: { type: 'fade', from: 0, to: 1 }, hide: { type: 'fade', to: 0 } },
                position: "bottom"
            }
        });
        DevExpress.ui.dxPopup.defaultOptions({
            options: {
                animation: {
                    show: {
                        type: "slide",
                        from: { opacity: 0, my: "center", at: "center", of: "window", left: "+=30" },
                        to: { opacity: 1, my: "center", at: "center", of: "window" },
                        duration: 300,
                        easing: "cubic-bezier(.62,.28,.23,.99)"
                    }
                },
                position: { my: 'center', at: 'center', of: window }
            }
        });
    }
    exports.configure = configure;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/login/login":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(185)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, export_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Login = (function () {
        function Login(router) {
            this.router = router;
        }
        Object.defineProperty(Login.prototype, "title", {
            get: function () {
                if (!this.router.currentViewItem || !this.router.currentViewItem.controller) {
                    return null;
                }
                var currentViewModel = this.router.currentViewItem.controller["currentViewModel"];
                if (!currentViewModel) {
                    return;
                }
                return currentViewModel.title;
            },
            enumerable: true,
            configurable: true
        });
        Login.prototype.attached = function () {
            this.router.registerRoutes([
                {
                    moduleId: "framework/login/views/login/login-form",
                    caption: "base.login",
                    route: "login"
                }
            ], "login");
        };
        return Login;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom("router.currentViewItem.controller.currentViewModel.title"),
        tslib_1.__metadata("design:type", String),
        tslib_1.__metadata("design:paramtypes", [])
    ], Login.prototype, "title", null);
    Login = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.RouterService])
    ], Login);
    exports.Login = Login;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/login/login.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template>\r\n  <require from=\"../stack-router/views/stack-router/stack-router\"></require>\r\n  <require from=\"../../framework/default-ui/views/loading/loading\"></require>\r\n  <require from=\"./login.less\"></require>\r\n\r\n  <loading></loading>\r\n  <div class=\"t--login-container\">\r\n    <div class=\"t--login-image\">\r\n      <div class=\"t--login-banner\" tr=\"key.bind: title\">\r\n      </div>\r\n    </div>  \r\n    <div class=\"t--login-data\">\r\n      <stack-router create-toolbar.bind=\"false\"></stack-router>\r\n    </div>\r\n  </div>\r\n</template>";

/***/ }),

/***/ "framework/login/login.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--login-container {\n  display: flex;\n  height: 100vh;\n  width: 100vw;\n}\n.t--login-image {\n  position: relative;\n  flex-grow: 1;\n  background-image: url(" + __webpack_require__(862) + ");\n  background-position: center center;\n  background-size: cover;\n  border-right: 1px solid lightgray;\n}\n.t--login-banner {\n  position: absolute;\n  padding: 12px 36px;\n  bottom: 30vh;\n  font-size: 60px;\n  font-weight: 100;\n  color: white;\n  background-color: rgba(0, 0, 0, 0.3);\n}\n.t--login-data {\n  display: flex;\n  width: 350px;\n  align-items: center;\n  background-color: #f7f7f7;\n}\n.t--login-data .t--view-content {\n  display: flex;\n  margin-top: 4vh;\n  flex-direction: column;\n  justify-content: center;\n}\n.t--login-logo {\n  margin-bottom: 40px;\n  text-align: center;\n}\n.t--login-logo img {\n  max-width: 200px;\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/login/views/login/login-form":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__(236), __webpack_require__(850)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, fwx, login_form_funcs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginForm = (function (_super) {
        tslib_1.__extends(LoginForm, _super);
        function LoginForm(element, formBaseImport, $f) {
            var _this = _super.call(this, element, formBaseImport) || this;
            _this.$f = $f;
            _this.id = "login-form";
            _this.title = "login-form.login-form_caption";
            _this.addModel({ "id": "$m_login", "filters": [] });
            _this.addFunction("$f", $f, "functions.$f");
            _this.widgetCreator.addValidationGroup(_this, { "id": "wd1", "options": { "optionsName": "wd1Options", "optionsNameFQ": "wd1Options" } });
            _this.widgetCreator.addTextBox(_this, { "caption": "login-form.username_caption", "binding": { "dataContext": "$m_login", "bindTo": "Username", "bindToFQ": "models.data.$m_login.Username" }, "validationRules": [], "id": "username", "options": { "optionsName": "usernameOptions", "optionsNameFQ": "usernameOptions" } });
            _this.widgetCreator.addTextBox(_this, { "mode": "password", "caption": "login-form.password_caption", "binding": { "dataContext": "$m_login", "bindTo": "Password", "bindToFQ": "models.data.$m_login.Password" }, "validationRules": [], "id": "password", "options": { "optionsName": "passwordOptions", "optionsNameFQ": "passwordOptions" } });
            _this.widgetCreator.addCheckBox(_this, { "caption": "login-form.stayloggodon_caption", "binding": { "dataContext": "$m_login", "bindTo": "StayLoggedOn", "bindToFQ": "models.data.$m_login.StayLoggedOn" }, "validationRules": [], "id": "stayLoggodOn", "options": { "optionsName": "stayLoggodOnOptions", "optionsNameFQ": "stayLoggodOnOptions" } });
            _this.widgetCreator.addCommand(_this, { "id": "wd2", "options": { "optionsName": "wd2Options", "optionsNameFQ": "wd2Options" }, "binding": { "bindTo": "$f.loginCommand", "bindToFQ": "functions.$f.loginCommand", "propertyPrefix": "$f" } });
            _super.prototype.onConstructionFinished.call(_this);
            return _this;
        }
        return LoginForm;
    }(fwx.FormBase));
    LoginForm = tslib_1.__decorate([
        fwx.autoinject,
        tslib_1.__metadata("design:paramtypes", [Element, fwx.FormBaseImport, login_form_funcs_1.LoginFuncs])
    ], LoginForm);
    exports.LoginForm = LoginForm;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/login/views/login/login-form.html":
/***/ (function(module, exports) {

module.exports = "<template><dx-widget class=\"t--form-validation-group\" name=\"dxValidationGroup\" options.bind=\"wd1Options\" view-model.ref=\"wd1\"><div class=\"container t--form-container\"><div class=\"col-xs-12 t--login-logo\"><img class=\"t--form-element-image\" src=\"http://2014.erp-future.com/sites/2014.erp-future.com/files/1_business/Logo_U_TIP.png\"></img></div><div class=\"col-xs-12\"><form submit.delegate=\"submitForm('functions.$f.loginCommand')\"><button class=\"t--invisible-submit\" type=\"submit\"></button><div class=\"container\"><div class=\"col-xs-12\"><div tr=\"key: login-form.enter_user_password_text; markdown: true; mode: html\"></div></div><div class=\"col-xs-12\"><div class=\"t--editor-caption\" tr=\"key: login-form.username_caption\"></div><dx-widget name=\"dxTextBox\" options.bind=\"usernameOptions\" view-model.ref=\"username\"></dx-widget></div><div class=\"col-xs-12\"><div class=\"t--editor-caption\" tr=\"key: login-form.password_caption\"></div><dx-widget name=\"dxTextBox\" options.bind=\"passwordOptions\" view-model.ref=\"password\"></dx-widget></div><div class=\"col-xs-12\"><div class=\"t--editor-caption\">&nbsp;</div><dx-widget name=\"dxCheckBox\" options.bind=\"stayLoggodOnOptions\" view-model.ref=\"stayLoggodOn\"></dx-widget></div><div class=\"col-xs-12\"><dx-widget name=\"dxButton\" options.bind=\"wd2Options\"></dx-widget></div></div></form></div></div></dx-widget></template>";

/***/ }),

/***/ "framework/security/index":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/security/views/authgroup/authgroup-edit-form":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__(236)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, fwx) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthgroupEditForm = (function (_super) {
        tslib_1.__extends(AuthgroupEditForm, _super);
        function AuthgroupEditForm(element, formBaseImport) {
            var _this = _super.call(this, element, formBaseImport) || this;
            _this.id = "authgroup-edit";
            _this.title = "authgroup-edit.authgroup-edit_caption";
            _this.addModel({ "id": "$m_A", "webApiAction": "base/Security/Authgroup", "key": "variables.data.$id", "postOnSave": true, "filters": [] });
            _this.widgetCreator.addValidationGroup(_this, { "id": "wd1", "options": { "optionsName": "wd1Options", "optionsNameFQ": "wd1Options" } });
            _this.widgetCreator.addDataGrid(_this, { "columns": [{ "id": "colNichts", "caption": "authgroup-edit.colnichts_caption" }, { "id": "colNichts2", "caption": "authgroup-edit.colnichts2_caption" }], "optionsToolbar": { "optionsName": "dataGridTestToolbarOptions", "optionsNameFQ": "dataGridTestToolbarOptions" }, "binding": { "dataContext": "$m_A", "bindToFQ": "models.data.$m_A." }, "dataModel": "$m_A", "height": "100%", "edits": [], "filters": [], "commands": [], "id": "dataGridTest", "options": { "optionsName": "dataGridTestOptions", "optionsNameFQ": "dataGridTestOptions" } });
            _this.widgetCreator.addSelectBox(_this, { "idSelect": "mandator", "customs": [], "caption": "authgroup-edit.mandator_caption", "binding": { "dataContext": "$m_A", "bindTo": "IdMandator", "bindToFQ": "models.data.$m_A.IdMandator" }, "validationRules": [{ "item": { "type": "required", "parameters": [] } }], "id": "mandator", "options": { "optionsName": "mandatorOptions", "optionsNameFQ": "mandatorOptions" } });
            _super.prototype.onConstructionFinished.call(_this);
            return _this;
        }
        return AuthgroupEditForm;
    }(fwx.FormBase));
    AuthgroupEditForm = tslib_1.__decorate([
        fwx.autoinject,
        tslib_1.__metadata("design:paramtypes", [Element, fwx.FormBaseImport])
    ], AuthgroupEditForm);
    exports.AuthgroupEditForm = AuthgroupEditForm;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/security/views/authgroup/authgroup-edit-form.html":
/***/ (function(module, exports) {

module.exports = "<template><dx-widget class=\"t--form-validation-group\" name=\"dxValidationGroup\" options.bind=\"wd1Options\" view-model.ref=\"wd1\"><div class=\"container t--form-container\"><div class=\"col-xs-12\"><div class=\"t--form-element-flex-box\" style=\"flex-direction: column;height: 100%\"><div class=\"col-xs-12\"><div tr=\"key: authgroup-edit.info_text; markdown: true; mode: html\"></div></div><div class=\"col-xs-12 t--form-relative-container\" style=\"flex-grow: 1\"><div class=\"t--form-absolute-container\"><dx-widget name=\"dxDataGrid\" options.bind=\"dataGridTestOptions\" view-model.ref=\"dataGridTest\"></dx-widget></div></div><div class=\"col-xs-12\"><div class=\"t--editor-caption\" tr=\"key: authgroup-edit.mandator_caption\"></div><dx-widget name=\"dxSelectBox\" options.bind=\"mandatorOptions\" view-model.ref=\"mandator\"></dx-widget></div></div></div></div></dx-widget></template>";

/***/ }),

/***/ "framework/security/views/authgroup/authgroup-list-form":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__(236)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, fwx) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthgroupListForm = (function (_super) {
        tslib_1.__extends(AuthgroupListForm, _super);
        function AuthgroupListForm(element, formBaseImport) {
            var _this = _super.call(this, element, formBaseImport) || this;
            _this.id = "authgroup-list";
            _this.title = "authgroup-list.authgroup-list_caption";
            _this.addModel({ "id": "$m_A", "webApiAction": "base/Security/Authgroup", "webApiExpand": { Mandator: null }, "filters": [] });
            _this.addModel({ "id": "$m_A_Edit", "filters": [] });
            _this.addEditPopup({ "idContent": "editContent", "mappings": [{ "to": "$id", "binding": { "dataContext": "$m_A_Edit", "bindTo": "Id", "bindToFQ": "models.data.$m_A_Edit.Id" } }], "id": "edit", "options": { "optionsName": "editOptions", "optionsNameFQ": "editOptions" }, "commands": [] });
            _this.widgetCreator.addValidationGroup(_this, { "id": "wd1", "options": { "optionsName": "wd1Options", "optionsNameFQ": "wd1Options" } });
            _this.widgetCreator.addDataGrid(_this, { "columns": [{ "id": "name", "caption": "authgroup-list.name_caption", "bindTo": "Name", "sortIndex": 0, "sortOrder": "asc" }, { "id": "mandantor", "caption": "authgroup-list.mandantor_caption", "bindTo": "Mandator.Name" }], "optionsToolbar": { "optionsName": "authgroupsToolbarOptions", "optionsNameFQ": "authgroupsToolbarOptions" }, "binding": { "dataContext": "$m_A", "bindToFQ": "models.data.$m_A." }, "dataModel": "$m_A", "editDataContext": "$m_A_Edit", "idEditPopup": "edit", "addShortscuts": true, "isMainList": true, "height": "100%", "edits": [], "filters": [], "commands": [], "id": "authgroups", "options": { "optionsName": "authgroupsOptions", "optionsNameFQ": "authgroupsOptions" } });
            _super.prototype.onConstructionFinished.call(_this);
            return _this;
        }
        return AuthgroupListForm;
    }(fwx.FormBase));
    AuthgroupListForm = tslib_1.__decorate([
        fwx.autoinject,
        tslib_1.__metadata("design:paramtypes", [Element, fwx.FormBaseImport])
    ], AuthgroupListForm);
    exports.AuthgroupListForm = AuthgroupListForm;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/security/views/authgroup/authgroup-list-form.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template><require from=\"./authgroup-edit-form\"></require><dx-widget class=\"t--form-validation-group\" name=\"dxValidationGroup\" options.bind=\"wd1Options\" view-model.ref=\"wd1\"><div class=\"container t--form-container\"><dx-widget name=\"dxPopup\" options.bind=\"editOptions\" view-model.ref=\"edit\"><dx-template name=\"contentTemplate\"><div class=\"parent-container\"><authgroup-edit-form view-model.ref=\"editContent\" is-edit-form=\"true\"></authgroup-edit-form></div></dx-template></dx-widget><div class=\"col-xs-12 t--form-relative-container\"><div class=\"t--form-absolute-container\"><dx-widget name=\"dxDataGrid\" options.bind=\"authgroupsOptions\" view-model.ref=\"authgroups\"></dx-widget></div></div></div></dx-widget></template>";

/***/ }),

/***/ "framework/stack-router/attributes/stack-router-link/stack-router-link":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(241)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, history_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                    var href = _this.element.getAttribute("href");
                    if (href) {
                        _this.history.navigateByCode(_this.element.getAttribute("href"), _this.clearStack);
                    }
                    e.preventDefault();
                }
            });
        };
        return StackRouterLinkCustomAttribute;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Boolean)
    ], StackRouterLinkCustomAttribute.prototype, "clearStack", void 0);
    StackRouterLinkCustomAttribute = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [Element,
            history_service_1.HistoryService])
    ], StackRouterLinkCustomAttribute);
    exports.StackRouterLinkCustomAttribute = StackRouterLinkCustomAttribute;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/stack-router/index":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework")], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources('./views/stack-router/stack-router')
            .globalResources('./attributes/stack-router-link/stack-router-link');
    }
    exports.configure = configure;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/stack-router/views/stack-router/stack-router":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__("aurelia-event-aggregator"), __webpack_require__(143), __webpack_require__(241)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, aurelia_event_aggregator_1, router_service_1, history_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StackRouter = (function () {
        function StackRouter(history, router, eventAggregator) {
            this.history = history;
            this.router = router;
            this.eventAggregator = eventAggregator;
            this.createToolbar = true;
        }
        StackRouter.prototype.created = function (owningView) {
            this.owningView = owningView;
        };
        StackRouter.prototype.attached = function () {
            this.history.navigateCurrentOrInPipeline();
        };
        return StackRouter;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Boolean)
    ], StackRouter.prototype, "createToolbar", void 0);
    StackRouter = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [history_service_1.HistoryService,
            router_service_1.RouterService,
            aurelia_event_aggregator_1.EventAggregator])
    ], StackRouter);
    exports.StackRouter = StackRouter;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/stack-router/views/stack-router/stack-router.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--stack-router\">\r\n  <require from=\"./stack-router.less\"></require>\r\n  <require from=\"../view/view\"></require>\r\n\r\n  <div \r\n    class=\"t--stack-router-item\" \r\n    class.bind=\"item.className\"\r\n    repeat.for=\"item of router.viewStack\">\r\n    <view view.bind=\"item\" create-toolbar.bind=\"$parent.createToolbar\"></view>\r\n  </div>\r\n</template>";

/***/ }),

/***/ "framework/stack-router/views/stack-router/stack-router.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, ".t--stack-router,\n.t--stack-router-item {\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n", ""]);

// exports


/***/ }),

/***/ "framework/stack-router/views/view/view":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(8), __webpack_require__("aurelia-framework"), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tslib_1, aurelia_framework_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var View = (function () {
        function View(element, bindingEngine, taskQueue) {
            this.element = element;
            this.bindingEngine = bindingEngine;
            this.taskQueue = taskQueue;
            this.createToolbar = true;
        }
        Object.defineProperty(View.prototype, "className", {
            get: function () {
                if (this.createToolbar) {
                    return "t--view-with-toolbar";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "toolbarOptions", {
            get: function () {
                if (!this.view || !this.view.controller || !this.view.controller.currentViewModel) {
                    return null;
                }
                return this.view.controller.currentViewModel.toolbarOptions;
            },
            enumerable: true,
            configurable: true
        });
        View.prototype.bind = function () {
            $(this.element).find(".t--view-content").removeClass("t--view-content-attached");
            $(this.element).removeClass("t--view-attached");
        };
        View.prototype.attached = function () {
            var _this = this;
            setTimeout(function () {
                $(_this.element).addClass("t--view-attached");
                $(_this.element).find(".t--view-content").addClass("t--view-content-attached");
            }, 100);
        };
        return View;
    }());
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Boolean)
    ], View.prototype, "createToolbar", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Object)
    ], View.prototype, "view", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom("createToolbar"),
        tslib_1.__metadata("design:type", String),
        tslib_1.__metadata("design:paramtypes", [])
    ], View.prototype, "className", null);
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom("view.controller.currentViewModel.toolbarOptions"),
        tslib_1.__metadata("design:type", Object),
        tslib_1.__metadata("design:paramtypes", [])
    ], View.prototype, "toolbarOptions", null);
    View = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [Element,
            aurelia_framework_1.BindingEngine,
            aurelia_framework_1.TaskQueue])
    ], View);
    exports.View = View;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "framework/stack-router/views/view/view.html":
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<template class=\"t--view\" class.bind=\"className\">\r\n  <require from=\"./view.less\"></require>\r\n\r\n  <div class=\"t--toolbar\" if.bind=\"createToolbar\">\r\n    <dx-widget if.bind=\"toolbarOptions\" name=\"dxToolbar\" options.bind=\"toolbarOptions\"></dx-widget>\r\n  </div>\r\n  <div class=\"t--view-content-wrapper\">\r\n    <div class=\"parent-container\">\r\n      <compose\r\n        view-model.ref=\"view.controller\" \r\n        view-model.bind=\"view.moduleId\" \r\n        model.bind=\"view.model\" \r\n        class=\"t--view-content\"></compose>\r\n    </div>\r\n  </div>\r\n</template>";

/***/ }),

/***/ "framework/stack-router/views/view/view.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)(undefined);
// imports


// module
exports.push([module.i, "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--view {\n  display: block;\n  position: relative;\n  height: 100%;\n  overflow-x: hidden;\n}\n.t--view-content-wrapper {\n  display: block;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.t--view-content {\n  display: block;\n  width: 100%;\n  height: 1px;\n  min-height: 100%;\n  -webkit-overflow-scrolling: touch;\n}\n.t--view-with-toolbar .t--view-content-wrapper {\n  height: calc(100% - 60px);\n}\n.t--view-with-toolbar .t--view-content-wrapper > .parent-container {\n  height: calc(100% - 12px);\n  margin-bottom: 6px;\n}\n", ""]);

// exports


/***/ }),

/***/ "main":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__("aurelia-framework"), __webpack_require__(232), __webpack_require__(853), __webpack_require__(826), __webpack_require__(869), __webpack_require__(818), __webpack_require__(817), __webpack_require__(824), __webpack_require__(825)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, aurelia_framework_1, authorization_service_1, modules_1, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .basicConfiguration()
            .plugin('aurelia-animator-css')
            .feature('framework/base/index')
            .feature('framework/dx/index')
            .feature('framework/forms/index')
            .feature('framework/default-ui/index')
            .feature('framework/stack-router/index')
            .feature('framework/security/index');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        var moduleLoader = new modules_1.ModuleLoader();
        return aurelia.start().then(function () {
            var authorization = aurelia.container.get(authorization_service_1.AuthorizationService);
            authorization.openApp();
            return Promise.resolve();
        });
    }
    exports.configure = configure;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

},[871]);