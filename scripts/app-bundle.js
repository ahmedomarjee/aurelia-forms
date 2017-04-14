define('framework/base/event-args/custom-event-args',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/services/object-info-service',["require", "exports"], function (require, exports) {
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
});

define('framework/base/classes/custom-event',["require", "exports", "tslib", "aurelia-framework", "../services/object-info-service"], function (require, exports, tslib_1, aurelia_framework_1, object_info_service_1) {
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
});

define('framework/base/event-args/unauthorized',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/event-args/location-go-to',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/enumerations/shortcuts',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shortcuts;
    (function (Shortcuts) {
        Shortcuts[Shortcuts["save"] = 0] = "save";
        Shortcuts[Shortcuts["saveAndNew"] = 1] = "saveAndNew";
        Shortcuts[Shortcuts["delete"] = 2] = "delete";
        Shortcuts[Shortcuts["new"] = 3] = "new";
    })(Shortcuts = exports.Shortcuts || (exports.Shortcuts = {}));
});

define('framework/base/enumerations/export',["require", "exports", "./shortcuts"], function (require, exports, shortcuts_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(shortcuts_1);
});

define('framework/base/event-args/shortcut-execute',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/event-args/window-size-changed',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/event-args/export',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/services/json-service',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/base/interfaces/data-source-option-filter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/interfaces/data-source-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/interfaces/data-source-customization-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/interfaces/rest-delete-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/interfaces/rest-get-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/interfaces/rest-post-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/interfaces/style-property',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/interfaces/style-class',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/base/interfaces/export',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('config',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        baseUrl: "http://10.20.50.53/TIP.ERP",
        apiUrl: "http://10.20.50.53/TIP.ERP/api",
        webApiUrl: "http://10.20.50.53/TIP.ERP/api/data",
        appUrl: "http://localhost:9000",
        loginApp: "framework/login/login",
        mainApp: "app"
    };
});

define('framework/base/services/rest-service',["require", "exports", "tslib", "aurelia-framework", "aurelia-fetch-client", "../classes/custom-event", "./json-service", "../../../config"], function (require, exports, tslib_1, aurelia_framework_1, aurelia_fetch_client_1, custom_event_1, json_service_1, config_1) {
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
});

define('framework/base/services/authorization-service',["require", "exports", "tslib", "aurelia-framework", "./rest-service", "../../../config"], function (require, exports, tslib_1, aurelia_framework_1, rest_service_1, config_1) {
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
});

define('framework/base/classes/scope-container',["require", "exports"], function (require, exports) {
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
});

define('framework/base/services/binding-service',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/base/services/data-source-service',["require", "exports", "tslib", "aurelia-framework", "./rest-service", "./binding-service"], function (require, exports, tslib_1, aurelia_framework_1, rest_service_1, binding_service_1) {
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
            if (options.webApiWhere) {
                var where = [];
                if (!this.constructWhere(scopeContainer, options.webApiWhere, where)) {
                    return null;
                }
                if (where.length > 0) {
                    getOptions.where = where;
                }
            }
            if (options.filters) {
                var customs = [];
                var where = [];
                if (!this.constructFilters(scopeContainer, options, customs, where)) {
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
            if (customizationOptions && customizationOptions.getCustomWhere) {
                var customWhere = customizationOptions.getCustomWhere();
                if (customWhere) {
                    if (getOptions.where) {
                        getOptions.where = [getOptions.where, customWhere];
                    }
                    else {
                        getOptions.where = customWhere;
                    }
                }
            }
            if (customizationOptions && customizationOptions.getSearchText) {
                getOptions.searchText = customizationOptions.getSearchText();
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
        DataSourceService.prototype.constructFilters = function (scopeContainer, options, customs, where) {
            for (var _i = 0, _a = options.filters; _i < _a.length; _i++) {
                var item = _a[_i];
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
});

define('framework/base/services/deep-observer-service',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/base/services/error-service',["require", "exports", "tslib", "aurelia-framework", "./localization-service"], function (require, exports, tslib_1, aurelia_framework_1, localization_service_1) {
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
});

define('framework/base/services/globalization-service',["require", "exports", "tslib", "moment", "aurelia-framework"], function (require, exports, tslib_1, moment, aurelia_framework_1) {
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
});

define('framework/base/services/localization-service',["require", "exports", "tslib", "aurelia-framework", "./rest-service", "./binding-service", "text!../../../autodata/localization-neutral.json"], function (require, exports, tslib_1, aurelia_framework_1, rest_service_1, binding_service_1, localizationNeutral) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LocalizationService = (function () {
        function LocalizationService(rest, binding) {
            this.rest = rest;
            this.binding = binding;
            this.neutral = JSON.parse(localizationNeutral);
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
            var item = this.neutral;
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
});

define('framework/base/services/location-service',["require", "exports", "tslib", "aurelia-framework", "../classes/custom-event"], function (require, exports, tslib_1, aurelia_framework_1, custom_event_1) {
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
});

define('framework/base/services/permission-service',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/base/classes/export',["require", "exports", "./custom-event", "./scope-container"], function (require, exports, custom_event_1, scope_container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomEvent = custom_event_1.CustomEvent;
    exports.ScopeContainer = scope_container_1.ScopeContainer;
});

define('framework/base/services/shortcut-service',["require", "exports", "tslib", "aurelia-framework", "../classes/export", "../enumerations/export", "mousetrap"], function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, mousetrap) {
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
});

define('framework/base/services/style-service',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/base/services/window-service',["require", "exports", "tslib", "aurelia-framework", "../classes/custom-event"], function (require, exports, tslib_1, aurelia_framework_1, custom_event_1) {
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
});

define('framework/base/services/file-service',["require", "exports", "tslib", "aurelia-framework", "./authorization-service", "./rest-service"], function (require, exports, tslib_1, aurelia_framework_1, authorization_service_1, rest_service_1) {
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
});

define('framework/base/services/export',["require", "exports", "./authorization-service", "./binding-service", "./data-source-service", "./deep-observer-service", "./error-service", "./globalization-service", "./localization-service", "./location-service", "./json-service", "./object-info-service", "./permission-service", "./rest-service", "./shortcut-service", "./style-service", "./window-service", "./file-service"], function (require, exports, authorization_service_1, binding_service_1, data_source_service_1, deep_observer_service_1, error_service_1, globalization_service_1, localization_service_1, location_service_1, json_service_1, object_info_service_1, permission_service_1, rest_service_1, shortcut_service_1, style_service_1, window_service_1, file_service_1) {
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
});

define('framework/stack-router/interfaces/history-state',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/stack-router/interfaces/route',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/stack-router/interfaces/route-info',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/stack-router/interfaces/navigation-args',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/stack-router/interfaces/navigation-route',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/stack-router/interfaces/export',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/stack-router/classes/view-item',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/stack-router/services/router-service',["require", "exports", "tslib", "aurelia-framework", "../classes/view-item", "../../base/enumerations/export", "../../base/services/export"], function (require, exports, tslib_1, aurelia_framework_1, view_item_1, export_1, export_2) {
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
});

define('framework/stack-router/services/history-service',["require", "exports", "tslib", "aurelia-framework", "aurelia-event-aggregator", "../../base/services/export", "./router-service"], function (require, exports, tslib_1, aurelia_framework_1, aurelia_event_aggregator_1, export_1, router_service_1) {
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
});

define('framework/stack-router/services/routes-creator-service',["require", "exports"], function (require, exports) {
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
});

define('framework/stack-router/services/export',["require", "exports", "./history-service", "./router-service", "./routes-creator-service"], function (require, exports, history_service_1, router_service_1, routes_creator_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoryService = history_service_1.HistoryService;
    exports.RouterService = router_service_1.RouterService;
    exports.RoutesCreatorService = routes_creator_service_1.RoutesCreatorService;
});

define('framework/default-ui/services/layout-service',["require", "exports", "tslib", "aurelia-framework", "../../base/services/style-service"], function (require, exports, tslib_1, aurelia_framework_1, style_service_1) {
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
                            propertyName: "background-color",
                            value: "rgba(255,255,255,0.4)"
                        }, {
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
});

define('framework/default-ui/services/export',["require", "exports", "./layout-service"], function (require, exports, layout_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LayoutService = layout_service_1.LayoutService;
});

define('app',["require", "exports", "tslib", "aurelia-framework", "./framework/stack-router/services/export", "./framework/default-ui/services/export", "text!./autodata/forms.json", "text!./route-info/structure.json"], function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, routesForm, routesStructure) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(router, routesCreator, layout) {
            this.router = router;
            this.routesCreator = routesCreator;
            this.layout = layout;
            this.routes = [];
            this.routes = routesCreator.createRoutes(JSON.parse(routesStructure), JSON.parse(routesForm));
            this.layout.activateTheme();
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
            export_2.LayoutService])
    ], App);
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

define('main',["require", "exports", "./environment", "./framework/base/services/authorization-service"], function (require, exports, environment_1, authorization_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        longStackTraces: environment_1.default.debug,
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .basicConfiguration()
            .plugin("aurelia-animator-css")
            .feature("framework/base")
            .feature("framework/dx")
            .feature("framework/forms")
            .feature("framework/default-ui")
            .feature("framework/stack-router")
            .feature("framework/security");
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin("aurelia-testing");
        }
        aurelia.start().then(function () {
            var authorization = aurelia.container.get(authorization_service_1.AuthorizationService);
            authorization.openApp();
        });
    }
    exports.configure = configure;
});

define('framework/base/export',["require", "exports", "./classes/export", "./services/export"], function (require, exports, export_1, export_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(export_1);
    __export(export_2);
});

define('framework/base/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources("./attributes/icon/fa-icon-attribute")
            .globalResources("./attributes/translation/translation-attribute")
            .globalResources("./value-converters/translation/translation-value-converter")
            .globalResources("./value-converters/sort/sort-value-converter")
            .globalResources("./styles/styles.css");
    }
    exports.configure = configure;
});

define('framework/default-ui/export',["require", "exports", "./services/export"], function (require, exports, export_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(export_1);
});

define('framework/default-ui/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources("./styles/styles.css")
            .globalResources("./styles/toolbar.css")
            .globalResources("./styles/popup.css");
    }
    exports.configure = configure;
});

define('framework/dx/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources("devextreme")
            .globalResources("./elements/dx-widget");
    }
    exports.configure = configure;
});

define('framework/forms/classes/command-server-data',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/forms/interfaces/binding',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/command',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/command-data',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/context-menu-item',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/widget-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/validation-rule-item-parameter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/validation-rule-item',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/validation-rule',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/editor-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/enums/sort-order-column-enum',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/data-grid-column-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/enums/selection-mode-enum',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionModeEnum;
    (function (SelectionModeEnum) {
        SelectionModeEnum[SelectionModeEnum["None"] = 0] = "None";
        SelectionModeEnum[SelectionModeEnum["Single"] = 1] = "Single";
        SelectionModeEnum[SelectionModeEnum["Multiple"] = 2] = "Multiple";
    })(SelectionModeEnum = exports.SelectionModeEnum || (exports.SelectionModeEnum = {}));
});

define('framework/forms/widget-options/list-edit-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/list-options-base',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/accordion-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/calendar-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/check-box-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/color-box-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/command-element-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/command-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/data-grid-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/date-box-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/file-uploader-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/file-uploader-with-viewer-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/include-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/list-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/list-view-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/number-box-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/select-item',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/select-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/popover-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/popup-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/tab-page-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/tab-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/tag-box-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/text-box-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/text-area-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/validation-group-options',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/widget-options/export',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/mapping',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/edit-popup',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/function',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/model',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/popup-info',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/toolbar-manager',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/variable',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/interfaces/export',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/edit-popup-hidden',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/edit-popup-shown',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/edit-popup-model-loaded',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/model-loaded',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/model-loaded-interceptor',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/model-load-required',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/form-attached',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/form-reactivated',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/form-ready',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/form-validating',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/event-args/export',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('framework/forms/classes/models',["require", "exports", "tslib", "aurelia-framework", "../../base/export", "../../base/services/data-source-service"], function (require, exports, tslib_1, aurelia_framework_1, export_1, data_source_service_1) {
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
});

define('framework/forms/classes/functions',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/forms/classes/variables',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/forms/classes/nested-forms',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/forms/services/command-service',["require", "exports", "tslib", "aurelia-framework", "../../base/services/export"], function (require, exports, tslib_1, aurelia_framework_1, export_1) {
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
});

define('framework/dx/services/dx-template-service',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/forms/services/toolbar-service',["require", "exports", "tslib", "aurelia-framework", "../../base/services/export", "../../base/classes/export", "../services/command-service", "../../dx/services/dx-template-service", "text!../templates/toolbar-button-template.html"], function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, command_service_1, dx_template_service_1, toolbarButtonTemplate) {
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
});

define('framework/forms/classes/context-menu',["require", "exports"], function (require, exports) {
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
});

define('framework/forms/services/default-commands-service',["require", "exports", "tslib", "aurelia-framework", "../../base/services/export", "../../stack-router/services/router-service", "../classes/context-menu"], function (require, exports, tslib_1, aurelia_framework_1, export_1, router_service_1, context_menu_1) {
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
                    form.save().then(function () {
                        DevExpress.ui.notify(form.translate("base.save_success"), "SUCCESS", 3000);
                    })
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
});

define('framework/forms/services/validation-service',["require", "exports", "tslib", "aurelia-framework", "../../base/export"], function (require, exports, tslib_1, aurelia_framework_1, export_1) {
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
});

define('framework/dx/services/export',["require", "exports", "./dx-template-service"], function (require, exports, dx_template_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DxTemplateService = dx_template_service_1.DxTemplateService;
});

define('framework/forms/services/select-item-service',["require", "exports", "tslib", "aurelia-framework", "../../dx/services/export", "text!../../../autodata/select-items.json"], function (require, exports, tslib_1, aurelia_framework_1, export_1, selectItems) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectItemService = (function () {
        function SelectItemService(dxTemplate) {
            this.dxTemplate = dxTemplate;
            this._selectItems = JSON.parse(selectItems);
            this.registerTemplates();
        }
        SelectItemService.prototype.getSelectItem = function (id) {
            if (!this._selectItems) {
                throw new Error("No select-items defined");
            }
            if (!this._selectItems[id]) {
                throw new Error("Select-item " + id + " is not defined");
            }
            return this._selectItems[id];
        };
        SelectItemService.prototype.registerTemplates = function () {
            for (var key in this._selectItems) {
                var selectItem = this._selectItems[key];
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
});

define('framework/forms/services/export',["require", "exports", "./command-service", "./default-commands-service", "./toolbar-service", "./validation-service", "./select-item-service"], function (require, exports, command_service_1, default_commands_service_1, toolbar_service_1, validation_service_1, select_item_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandService = command_service_1.CommandService;
    exports.DefaultCommandsService = default_commands_service_1.DefaultCommandsService;
    exports.ToolbarService = toolbar_service_1.ToolbarService;
    exports.ValidationService = validation_service_1.ValidationService;
    exports.SelectItemService = select_item_service_1.SelectItemService;
});

define('framework/forms/widget-services/base-widget-creator-service',["require", "exports", "tslib", "aurelia-framework", "../../base/services/export", "../services/export"], function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2) {
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
});

define('framework/forms/widget-services/simple-widget-creator-service',["require", "exports", "tslib", "aurelia-framework", "../services/export", "../../base/services/export", "./base-widget-creator-service"], function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2, base_widget_creator_service_1) {
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
            widgetOptions.animation = {
                show: {
                    type: "slide",
                    from: { opacity: 0, left: "+=30" },
                    to: { opacity: 1 },
                    duration: 300,
                    easing: "cubic-bezier(.62,.28,.23,.99)"
                }
            };
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
                    return Promise.resolve();
                }
                else {
                    var error = new Error();
                    error.message = result.brokenRules[0].message;
                    return Promise.reject(error);
                }
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
});

define('framework/forms/classes/edit-popups',["require", "exports", "tslib", "aurelia-framework", "../services/toolbar-service", "../widget-services/simple-widget-creator-service", "../../base/classes/custom-event"], function (require, exports, tslib_1, aurelia_framework_1, toolbar_service_1, simple_widget_creator_service_1, custom_event_1) {
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
});

define('framework/forms/widget-services/data-grid-widget-creator-service',["require", "exports", "tslib", "aurelia-framework", "./base-widget-creator-service", "../../base/services/export", "../enums/selection-mode-enum"], function (require, exports, tslib_1, aurelia_framework_1, base_widget_creator_service_1, export_1, selection_mode_enum_1) {
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
});

define('framework/forms/widget-services/list-widget-creator-service',["require", "exports", "tslib", "aurelia-framework", "./base-widget-creator-service"], function (require, exports, tslib_1, aurelia_framework_1, base_widget_creator_service_1) {
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
});

define('framework/forms/widget-services/widget-creator-service',["require", "exports", "tslib", "aurelia-framework", "./simple-widget-creator-service", "./data-grid-widget-creator-service", "./list-widget-creator-service"], function (require, exports, tslib_1, aurelia_framework_1, simple_widget_creator_service_1, data_grid_widget_creator_service_1, list_widget_creator_service_1) {
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
});

define('framework/forms/classes/form-base-import',["require", "exports", "tslib", "aurelia-framework", "./models", "./functions", "./commands", "./variables", "./edit-popups", "./nested-forms", "./command-server-data", "../services/toolbar-service", "../services/default-commands-service", "../services/command-service", "../widget-services/widget-creator-service", "../../base/export", "../../stack-router/services/router-service"], function (require, exports, tslib_1, aurelia_framework_1, models_1, functions_1, commands_1, variables_1, edit_popups_1, nested_forms_1, command_server_data_1, toolbar_service_1, default_commands_service_1, command_service_1, widget_creator_service_1, export_1, router_service_1) {
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
});

define('framework/forms/classes/form-base',["require", "exports", "../../base/export"], function (require, exports, export_1) {
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
                bindingContext: bindingContext,
                overrideContext: overrideContext
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
        FormBase.prototype.activate = function (routeInfo) {
            if (routeInfo && routeInfo.parameters && routeInfo.parameters.id) {
                this.variables.data.$id = routeInfo.parameters.id;
            }
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
        FormBase.prototype.validate = function () {
            return this.onValidating.fire({
                form: this
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
            if (!this.canSave() || !this.canSaveNow()) {
                return Promise.resolve();
            }
            return this.validate()
                .then(function (c) { return _this.models.save(); });
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
});

define('framework/forms/classes/commands',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/forms/classes/export',["require", "exports", "./command-server-data", "./commands", "./context-menu", "./edit-popups", "./form-base", "./functions", "./models", "./nested-forms", "./variables"], function (require, exports, command_server_data_1, commands_1, context_menu_1, edit_popups_1, form_base_1, functions_1, models_1, nested_forms_1, variables_1) {
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
});

define('framework/forms/enums/export',["require", "exports", "./selection-mode-enum"], function (require, exports, selection_mode_enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionModeEnum = selection_mode_enum_1.SelectionModeEnum;
});

define('framework/forms/widget-services/export',["require", "exports", "./widget-creator-service"], function (require, exports, widget_creator_service_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(widget_creator_service_1);
});

define('framework/forms/elements/file-uploader-with-viewer/tip-file-uploader-with-viewer',["require", "exports", "tslib", "aurelia-framework", "../../../base/export"], function (require, exports, tslib_1, aurelia_framework_1, export_1) {
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
        tslib_1.__metadata("design:type", HTMLInputElement)
    ], TipFileUploaderWithViewer.prototype, "input", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Object)
    ], TipFileUploaderWithViewer.prototype, "options", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable, aurelia_framework_1.observable,
        tslib_1.__metadata("design:type", Object)
    ], TipFileUploaderWithViewer.prototype, "currentValue", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], TipFileUploaderWithViewer.prototype, "downloadUrl", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], TipFileUploaderWithViewer.prototype, "placeholderIcon", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], TipFileUploaderWithViewer.prototype, "placeholderImage", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", String)
    ], TipFileUploaderWithViewer.prototype, "placeholderImageText", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable, aurelia_framework_1.observable,
        tslib_1.__metadata("design:type", String)
    ], TipFileUploaderWithViewer.prototype, "iconDownload", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.bindable,
        tslib_1.__metadata("design:type", Object)
    ], TipFileUploaderWithViewer.prototype, "imageStyle", void 0);
    TipFileUploaderWithViewer = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.FileService,
            export_1.LocalizationService,
            export_1.BindingService,
            aurelia_framework_1.BindingEngine,
            aurelia_framework_1.TaskQueue])
    ], TipFileUploaderWithViewer);
    exports.TipFileUploaderWithViewer = TipFileUploaderWithViewer;
});

define('framework/forms/elements/export',["require", "exports", "./file-uploader-with-viewer/tip-file-uploader-with-viewer"], function (require, exports, tip_file_uploader_with_viewer_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(tip_file_uploader_with_viewer_1);
});

define('framework/forms/export',["require", "exports", "./classes/export", "./enums/export", "./services/export", "./widget-services/export", "./elements/export"], function (require, exports, export_1, export_2, export_3, export_4, export_5) {
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
});

define('framework/forms/form-export',["require", "exports", "aurelia-framework", "./classes/form-base", "./classes/form-base-import"], function (require, exports, aurelia_framework_1, form_base_1, form_base_import_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autoinject = aurelia_framework_1.autoinject;
    exports.FormBase = form_base_1.FormBase;
    exports.FormBaseImport = form_base_import_1.FormBaseImport;
});

define('framework/forms/index',["require", "exports", "../dx/services/dx-template-service"], function (require, exports, dx_template_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources("./styles/styles.css")
            .globalResources("./elements/file-uploader-with-viewer/tip-file-uploader-with-viewer");
        var dxTemplate = config.container.get(dx_template_service_1.DxTemplateService);
    }
    exports.configure = configure;
});

define('framework/stack-router/classes/export',["require", "exports", "./view-item"], function (require, exports, view_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewItem = view_item_1.ViewItem;
});

define('framework/stack-router/export',["require", "exports", "./classes/export", "./services/export"], function (require, exports, export_1, export_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(export_1);
    __export(export_2);
});

define('framework/login/login',["require", "exports", "tslib", "aurelia-framework", "../stack-router/export"], function (require, exports, tslib_1, aurelia_framework_1, export_1) {
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
});

define('framework/security/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

define('framework/stack-router/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config
            .globalResources("./views/stack-router/stack-router")
            .globalResources("./attributes/stack-router-link/stack-router-link");
    }
    exports.configure = configure;
});

define('framework/dx/elements/dx-widget',["require", "exports", "tslib", "aurelia-framework", "../services/dx-template-service", "../../base/export", "jquery"], function (require, exports, tslib_1, aurelia_framework_1, dx_template_service_1, export_1, $) {
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
            if (this.validator) {
                element.dxValidator(this.validator);
            }
            else if (this.options["validators"]) {
                element.dxValidator({
                    validationRules: this.options["validators"]
                });
            }
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
        DxWidget.prototype.resetValidation = function () {
            if (this.instance.option("isValid") === false) {
                this.setOptionValue("isValid", true);
            }
        };
        DxWidget.modelByElement = function (element) {
            if (element.jquery) {
                element = element.get(0);
            }
            if (!element.au || !element.au.controller || !element.au.controller.viewModel) {
                return null;
            }
            return element.au.controller.viewModel.bindingContext;
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
            if (isValid && propertyName == "value") {
                var data = {};
                data[propertyName] = value;
                data["isValid"] = true;
                this.instance.option(data);
            }
            else {
                this.instance.option(propertyName, value);
            }
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
});

define('framework/base/attributes/icon/fa-icon-attribute',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/base/attributes/translation/translation-attribute',["require", "exports", "tslib", "aurelia-framework", "../../services/export", "../../classes/scope-container"], function (require, exports, tslib_1, aurelia_framework_1, export_1, scope_container_1) {
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
});

define('framework/base/value-converters/sort/sort-value-converter',["require", "exports", "tslib", "aurelia-framework", "../../services/export"], function (require, exports, tslib_1, aurelia_framework_1, export_1) {
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
});

define('framework/base/value-converters/translation/translation-value-converter',["require", "exports", "tslib", "aurelia-framework", "../../services/localization-service"], function (require, exports, tslib_1, aurelia_framework_1, localization_service_1) {
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
});

define('framework/default-ui/views/container/container',["require", "exports", "tslib", "aurelia-framework", "../../services/layout-service"], function (require, exports, tslib_1, aurelia_framework_1, layout_service_1) {
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
});

define('framework/default-ui/views/content/content',["require", "exports", "tslib", "aurelia-framework", "../../services/layout-service"], function (require, exports, tslib_1, aurelia_framework_1, layout_service_1) {
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
});

define('framework/default-ui/views/header/header',["require", "exports", "tslib", "aurelia-framework", "../../../stack-router/export", "../../../base/services/export"], function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Header = (function () {
        function Header(router, authorization) {
            this.router = router;
            this.authorization = authorization;
        }
        Header.prototype.logout = function () {
            this.authorization.logout();
        };
        return Header;
    }());
    Header = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [export_1.RouterService,
            export_2.AuthorizationService])
    ], Header);
    exports.Header = Header;
});

define('framework/default-ui/views/loading/loading',["require", "exports", "tslib", "aurelia-framework", "../../../base/services/rest-service"], function (require, exports, tslib_1, aurelia_framework_1, rest_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Loading = (function () {
        function Loading(rest) {
            this.rest = rest;
        }
        return Loading;
    }());
    Loading = tslib_1.__decorate([
        aurelia_framework_1.autoinject,
        tslib_1.__metadata("design:paramtypes", [rest_service_1.RestService])
    ], Loading);
    exports.Loading = Loading;
});

define('framework/default-ui/views/loading-spinner/loading-spinner',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/default-ui/views/sidebar/sidebar',["require", "exports", "tslib", "aurelia-framework", "../../services/layout-service", "../../../stack-router/export"], function (require, exports, tslib_1, aurelia_framework_1, layout_service_1, export_1) {
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
});

define('framework/default-ui/views/sidebar-sub/sidebar-sub',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('framework/login/views/login/login-form-funcs',["require", "exports", "tslib", "aurelia-framework", "../../../base/export", "../../../stack-router/export"], function (require, exports, tslib_1, aurelia_framework_1, export_1, export_2) {
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
            var _this = this;
            this.form = form;
            this.goToUrlAfterLogin = this.history.lastRequestUrl;
            this.form.onReady.register(function (r) {
                var username = _this.form["username"].instance;
                username.focus();
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
});

define('framework/login/views/login/login-form',["require", "exports", "tslib", "../../../forms/form-export", "./login-form-funcs"], function (require, exports, tslib_1, fwx, login_form_funcs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginForm = (function (_super) {
        tslib_1.__extends(LoginForm, _super);
        function LoginForm(element, formBaseImport, $f) {
            var _this = _super.call(this, element, formBaseImport) || this;
            _this.$f = $f;
            _this.id = "login-form";
            _this.title = "login-form.login-form_caption";
            _this.addModel({
                "id": "$m_login",
                "filters": []
            });
            _this.addFunction("$f", $f, "functions.$f");
            _this.widgetCreator.addValidationGroup(_this, {
                "id": "wd1",
                "options": {
                    "optionsName": "wd1Options",
                    "optionsNameFQ": "wd1Options"
                }
            });
            _this.widgetCreator.addTextBox(_this, {
                "caption": "login-form.username_caption",
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
            _this.widgetCreator.addTextBox(_this, {
                "mode": "password",
                "caption": "login-form.password_caption",
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
            _this.widgetCreator.addCheckBox(_this, {
                "caption": "login-form.stayloggodon_caption",
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
            _this.widgetCreator.addCommand(_this, {
                "id": "wd2",
                "options": {
                    "optionsName": "wd2Options",
                    "optionsNameFQ": "wd2Options"
                },
                "binding": {
                    "bindTo": "$f.loginCommand",
                    "bindToFQ": "functions.$f.loginCommand",
                    "propertyPrefix": "$f"
                }
            });
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
});

define('framework/security/views/authgroup/authgroup-edit-form',["require", "exports", "tslib", "../../../forms/form-export"], function (require, exports, tslib_1, fwx) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthgroupEditForm = (function (_super) {
        tslib_1.__extends(AuthgroupEditForm, _super);
        function AuthgroupEditForm(element, formBaseImport) {
            var _this = _super.call(this, element, formBaseImport) || this;
            _this.id = "authgroup-edit";
            _this.title = "authgroup-edit.authgroup-edit_caption";
            _this.addModel({
                "id": "$m_A",
                "webApiAction": "base/Security/Authgroup",
                "key": "variables.data.$id",
                "postOnSave": true,
                "filters": []
            });
            _this.widgetCreator.addValidationGroup(_this, {
                "id": "wd1",
                "options": {
                    "optionsName": "wd1Options",
                    "optionsNameFQ": "wd1Options"
                }
            });
            _this.widgetCreator.addTextBox(_this, {
                "caption": "authgroup-edit.name_caption",
                "binding": {
                    "dataContext": "$m_A",
                    "bindTo": "Name",
                    "bindToFQ": "models.data.$m_A.Name"
                },
                "validationRules": [{
                        "item": {
                            "type": "required",
                            "parameters": []
                        }
                    }],
                "id": "name",
                "options": {
                    "optionsName": "nameOptions",
                    "optionsNameFQ": "nameOptions"
                }
            });
            _this.widgetCreator.addSelectBox(_this, {
                "idSelect": "mandator",
                "customs": [],
                "caption": "authgroup-edit.mandator_caption",
                "binding": {
                    "dataContext": "$m_A",
                    "bindTo": "IdMandator",
                    "bindToFQ": "models.data.$m_A.IdMandator"
                },
                "validationRules": [{
                        "item": {
                            "type": "required",
                            "parameters": []
                        }
                    }],
                "id": "mandator",
                "options": {
                    "optionsName": "mandatorOptions",
                    "optionsNameFQ": "mandatorOptions"
                }
            });
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
});

define('framework/security/views/authgroup/authgroup-list-form',["require", "exports", "tslib", "../../../forms/form-export"], function (require, exports, tslib_1, fwx) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthgroupListForm = (function (_super) {
        tslib_1.__extends(AuthgroupListForm, _super);
        function AuthgroupListForm(element, formBaseImport) {
            var _this = _super.call(this, element, formBaseImport) || this;
            _this.id = "authgroup-list";
            _this.title = "authgroup-list.authgroup-list_caption";
            _this.addModel({
                "id": "$m_A",
                "webApiAction": "base/Security/Authgroup",
                "webApiExpand": {
                    Mandator: null
                },
                "filters": []
            });
            _this.addModel({
                "id": "$m_A_Edit",
                "filters": []
            });
            _this.addEditPopup({
                "idContent": "editContent",
                "mappings": [{
                        "to": "$id",
                        "binding": {
                            "dataContext": "$m_A_Edit",
                            "bindTo": "Id",
                            "bindToFQ": "models.data.$m_A_Edit.Id"
                        }
                    }],
                "id": "edit",
                "options": {
                    "optionsName": "editOptions",
                    "optionsNameFQ": "editOptions"
                },
                "commands": []
            });
            _this.widgetCreator.addValidationGroup(_this, {
                "id": "wd1",
                "options": {
                    "optionsName": "wd1Options",
                    "optionsNameFQ": "wd1Options"
                }
            });
            _this.widgetCreator.addDataGrid(_this, {
                "columns": [{
                        "id": "name",
                        "caption": "authgroup-list.name_caption",
                        "bindTo": "Name",
                        "sortIndex": 0,
                        "sortOrder": "asc"
                    }, {
                        "id": "mandantor",
                        "caption": "authgroup-list.mandantor_caption",
                        "bindTo": "Mandator.Name"
                    }],
                "optionsToolbar": {
                    "optionsName": "authgroupsToolbarOptions",
                    "optionsNameFQ": "authgroupsToolbarOptions"
                },
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
                "id": "authgroups",
                "options": {
                    "optionsName": "authgroupsOptions",
                    "optionsNameFQ": "authgroupsOptions"
                }
            });
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
});

define('framework/stack-router/attributes/stack-router-link/stack-router-link',["require", "exports", "tslib", "aurelia-framework", "../../services/history-service"], function (require, exports, tslib_1, aurelia_framework_1, history_service_1) {
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
});

define('framework/stack-router/views/stack-router/stack-router',["require", "exports", "tslib", "aurelia-framework", "aurelia-event-aggregator", "../../services/router-service", "../../services/history-service"], function (require, exports, tslib_1, aurelia_framework_1, aurelia_event_aggregator_1, router_service_1, history_service_1) {
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
});

define('framework/stack-router/views/view/view',["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
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
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./framework/default-ui/views/container/container\"></require>\n  <container></container>\n</template>\n"; });
define('text!framework/login/login.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../stack-router/views/stack-router/stack-router\"></require>\n  <require from=\"../../framework/default-ui/views/loading/loading\"></require>\n  <require from=\"./login.css\"></require>\n\n  <loading></loading>\n  <div class=\"t--login-container\">\n    <div class=\"t--login-image\">\n      <div class=\"t--login-banner\" tr=\"key.bind: title\">\n      </div>\n    </div>  \n    <div class=\"t--login-data\">\n      <stack-router create-toolbar.bind=\"false\"></stack-router>\n    </div>\n  </div>\n</template>"; });
define('text!framework/dx/elements/dx-widget.html', ['module'], function(module) { module.exports = "<template class=\"dx-widget\">\n</template>"; });
define('text!framework/forms/templates/toolbar-button-template.html',[],function () { return '<a class="t--toolbar-item" click.delegate="data.guardedExecute()">\n  <div if.bind="data.command.badgeText" class="t--toolbar-item-badge" tr="key.bind: data.command.badgeText">\n  </div>\n  <div class="t--toolbar-item-content">\n    <div if.bind="data.command.icon" class="t--toolbar-item-icon">\n      <i class="fa-fw" fa-icon="icon.bind: data.command.icon"></i>\n    </div>\n    <div if.bind="data.command.title" class="t--toolbar-item-title" tr="key.bind: data.command.title">\n    </div>\n  </div>\n</a>\n';});

define('text!framework/login/login.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--login-container {\n  display: flex;\n  height: 100vh;\n  width: 100vw;\n}\n.t--login-image {\n  position: relative;\n  flex-grow: 1;\n  background-image: url('images/background-login.jpg');\n  background-position: center center;\n  background-size: cover;\n  border-right: 1px solid lightgray;\n}\n.t--login-banner {\n  position: absolute;\n  padding: 12px 36px;\n  bottom: 30vh;\n  font-size: 60px;\n  font-weight: 100;\n  color: white;\n  background-color: rgba(0, 0, 0, 0.3);\n}\n.t--login-data {\n  display: flex;\n  width: 350px;\n  align-items: center;\n  background-color: #f7f7f7;\n}\n.t--login-data .t--view-content {\n  display: flex;\n  margin-top: 4vh;\n  flex-direction: column;\n  justify-content: center;\n}\n.t--login-logo {\n  margin-bottom: 40px;\n  text-align: center;\n}\n.t--login-logo img {\n  max-width: 200px;\n}\n"; });
define('text!framework/default-ui/views/container/container.html', ['module'], function(module) { module.exports = "<template class=\"t--container\" class.bind=\"className\">\n  <require from=\"./container.css\"></require>\n  \n  <require from=\"../loading/loading\"></require>\n  <require from=\"../sidebar/sidebar\"></require>\n  <require from=\"../header/header\"></require>\n  <require from=\"../content/content\"></require>\n\n  <loading></loading>\n  <sidebar></sidebar>\n  <header></header>\n  <content></content>\n</template>\n"; });
define('text!framework/default-ui/views/content/content.html', ['module'], function(module) { module.exports = "<template class=\"t--content\">\n  <require from=\"./content.css\"></require>\n\n  <stack-router></stack-router>\n</template>\n"; });
define('text!framework/base/styles/styles.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: \"Helvetica Neue\", \"Segoe UI\", Helvetica, Verdana, sans-serif;\n  font-size: 12px;\n}\n.t--margin-top {\n  margin-top: 12px;\n}\n.t--editor-caption {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.t--cursor-pointer {\n  cursor: pointer;\n}\n.t--invisible-submit {\n  height: 0;\n  width: 0;\n  margin: 0;\n  padding: 0;\n  border: 0;\n}\n"; });
define('text!framework/default-ui/views/header/header.html', ['module'], function(module) { module.exports = "<template class=\"t--header\">\n  <require from=\"./header.css\"></require>\n\n  <div class=\"t--header-flex\">\n    <div class=\"t--header-title\">\n      TIP Technik und Informatik Partner GmbH\n    </div>\n    <div class=\"t--header-options\">\n      <a href=\"#\" click.delegate=\"logout()\" tr=\"key: base.logout\"></a>\n    </div>\n  </div>\n</template>"; });
define('text!framework/base/styles/variables.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n"; });
define('text!framework/default-ui/views/loading/loading.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../loading-spinner/loading-spinner\"></require>\n\n  <loading-spinner if.bind=\"rest.isLoading\"></loading-spinner>\n</template>"; });
define('text!framework/default-ui/styles/popup.css', ['module'], function(module) { module.exports = ".dx-popup-wrapper:not(.dx-dialog) > .dx-popup-normal > .dx-popup-content {\n  padding: 0;\n}\n"; });
define('text!framework/default-ui/views/loading-spinner/loading-spinner.html', ['module'], function(module) { module.exports = "<template class=\"t--loading\">\n  <require from=\"./loading-spinner.css\"></require>\n  \n  <div class=\"t--loading-spinner\">\n    <div class=\"t--loading-rect1\"></div>\n    <div class=\"t--loading-rect2\"></div>\n    <div class=\"t--loading-rect3\"></div>\n    <div class=\"t--loading-rect4\"></div>\n    <div class=\"t--loading-rect5\"></div>\n  </div>\n</template>"; });
define('text!framework/default-ui/views/sidebar/sidebar.html', ['module'], function(module) { module.exports = "<template class=\"t--sidebar\">\n  <require from=\"../sidebar-sub/sidebar-sub\"></require>\n  <require from=\"./sidebar.css\"></require>\n\n  <div class=\"t--sidebar-header\" click.delegate=\"onHeaderClicked()\">\n    <div class=\"t--sidebar-header-title\" tr=\"key: base.navigation\">\n    </div>\n    <div class=\"t--sidebar-header-icon\">\n      <i class=\"fa fa-${headerIcon}\"></i>\n    </div>\n  </div>\n\n  <ul>\n    <li\n      repeat.for=\"route of router.navigationRoutes\">\n      <sidebar-sub route.bind=\"route\" if.bind=\"route.sidebarExpanded\"></sidebar-sub>\n      <a \n        href.bind=\"route.route ? '#' + route.route : ''\" \n        class=\"t--sidebar-item\"\n        click.delegate=\"onRouteClicked(route)\"\n        stack-router-link=\"clear-stack.bind: true\">\n        <span class=\"t--sidebar-item-title\" tr=\"key.bind: route.caption\">\n        </span>\n        <span class=\"t--sidebar-item-icon\" if.bind=\"route.navigation.icon\" title.bind=\"route.caption | tr\">\n          <i class=\"fa fa-${route.navigation.icon}\"></i>\n        </span>\n      </a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!framework/default-ui/styles/styles.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--view-content {\n  opacity: 0;\n  transform: translateX(10px);\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: all;\n}\n.t--view-content.t--view-content-attached {\n  opacity: 1;\n  transform: translateX(0);\n}\n"; });
define('text!framework/default-ui/views/sidebar-sub/sidebar-sub.html', ['module'], function(module) { module.exports = "<template class=\"t--sidebar-sub au-animate\">\n  <require from=\"./sidebar-sub.css\"></require>\n\n  <ul class=\"t--sidebar-sub-ul\">\n    <li repeat.for=\"child of route.children | sort:'caption':'asc':true\">\n      <a \n        href.bind=\"child.route ? '#' + child.route : ''\" \n        class=\"t--sidebar-sub-item\"\n        stack-router-link=\"clear-stack.bind: true\">\n        <span class=\"t--sidebar-sub-item-title\" tr=\"key.bind: child.caption\">\n        </span>\n      </a>\n    </li>\n  </ul>\n</template>"; });
define('text!framework/forms/elements/file-uploader-with-viewer/tip-file-uploader-with-viewer.html', ['module'], function(module) { module.exports = "<template class=\"t--file-uploader-with-viewer\">\n  <require from=\"./tip-file-uploader-with-viewer.css\"></require>\n  <input type=\"file\" accept.bind=\"options.acceptType\" ref=\"input\">\n\n  <div class=\"t--file-uploader-with-viewer-click-region\" click.delegate=\"onClick($event)\">\n    <div if.bind=\"placeholderImage && !downloadUrl\" class=\"t--file-uploader-placeholder-image\" css.bind=\"imageStyle\">\n      <img src.bind=\"placeholderImage\" />\n    </div>\n    <div if.bind=\"placeholderImageText && !downloadUrl\" class=\"t--file-uploader-placeholder-image-text\"></div>\n      <span>${placeholderImageText}</span>\n    <div if.bind=\"placeholderIcon && !downloadUrl\" class=\"t--file-uploader-placeholder-icon\">\n      <i class=\"fa fa-${placeholderIcon}\"></i>\n    </div>\n\n    <div if.bind=\"downloadUrl\" class=\"t--file-uploader-image\" css.bind=\"imageStyle\">\n      <img src.bind=\"downloadUrl\" />\n    </div>\n\n    <dx-widget class=\"t--file-uploader-with-viewer-download\" if.bind=\"downloadUrl\" view-model.ref=\"downloadButton\" name=\"dxButton\" options.bind=\"downloadButtonOptions\"></dx-widget>\n  </div>\n</template>"; });
define('text!framework/default-ui/styles/toolbar.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--toolbar-title {\n  font-size: 16px;\n  font-weight: 100;\n  color: black;\n  padding: 0 12px;\n}\n.t--toolbar-item {\n  display: flex;\n  align-items: center;\n  height: 32px;\n  padding: 0 12px;\n  text-decoration: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n}\n.t--toolbar-item i {\n  font-size: 16px;\n}\n.t--toolbar-item:hover {\n  color: white;\n  background-color: #808080;\n}\n.t--toolbar-item-content {\n  display: flex;\n  flex-direction: row;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar {\n  height: 32px;\n  background-color: #D3D3D3;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .dx-toolbar-items-container {\n  height: 32px;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-item {\n  height: 32px;\n  color: black;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-item:hover {\n  color: white;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-item .t--toolbar-item-content {\n  flex-direction: row;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-title {\n  display: flex;\n  align-items: center;\n  height: 32px;\n  background-color: rgba(255, 255, 255, 0.4);\n  font-size: 14px;\n  font-weight: normal;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .dx-state-disabled .t--toolbar-item {\n  color: gray;\n}\n.t--toolbar.t--toolbar-inline.dx-toolbar .dx-state-disabled .t--toolbar-item:hover {\n  color: gray;\n}\n.t--toolbar.dx-popup-normal .dx-toolbar,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal.dx-popup-normal .dx-toolbar {\n  margin: 12px;\n  width: calc(100% - 12px * 2);\n  box-sizing: content-box;\n}\n.t--toolbar .dx-toolbar,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal .dx-toolbar {\n  padding: 0;\n  height: 60px;\n  background-color: #808080;\n  color: white;\n}\n.t--toolbar .dx-toolbar .dx-toolbar-items-container,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal .dx-toolbar .dx-toolbar-items-container {\n  height: 60px;\n}\n.t--toolbar .dx-state-disabled .t--toolbar-item,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal .dx-state-disabled .t--toolbar-item {\n  cursor: default;\n  color: lightgray;\n}\n.t--toolbar .dx-state-disabled .t--toolbar-item:hover,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal .dx-state-disabled .t--toolbar-item:hover {\n  background-color: inherit;\n}\n.t--toolbar .t--toolbar-title,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal .t--toolbar-title {\n  font-size: 26px;\n  color: white;\n}\n.t--toolbar .t--toolbar-item,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal .t--toolbar-item {\n  height: 60px;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  color: white;\n}\n.t--toolbar .t--toolbar-item:hover,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal .t--toolbar-item:hover {\n  background-color: #4F4F4F;\n}\n.t--toolbar .t--toolbar-item-content,\n.dx-popup-wrapper:not(.dx-dialog):not(.dx-lookup-popup-search) > .dx-popup-normal .t--toolbar-item-content {\n  flex-direction: column;\n}\n"; });
define('text!framework/login/views/login/login-form.html', ['module'], function(module) { module.exports = "<template>\n    <dx-widget name=\"dxValidationGroup\" options.bind=\"wd1Options\" view-model.ref=\"wd1\">\n        <div class=\"t--margin-top col-xs-12 t--login-logo\">\n            <img class=\"t--form-element-image\" src=\"http://2014.erp-future.com/sites/2014.erp-future.com/files/1_business/Logo_U_TIP.png\"></img>\n        </div>\n        <form submit.delegate=\"submitForm('functions.$f.loginCommand')\">\n            <button class=\"t--invisible-submit\" type=\"submit\"></button>\n            <div class=\"col-xs-12\">\n                <div tr=\"key: login-form.enter_user_password_text; markdown: true; mode: html\"></div>\n            </div>\n            <div class=\"t--margin-top col-xs-12\">\n                <div class=\"t--editor-caption\" tr=\"key: login-form.username_caption\"></div>\n                <dx-widget name=\"dxTextBox\" options.bind=\"usernameOptions\" view-model.ref=\"username\"></dx-widget>\n            </div>\n            <div class=\"t--margin-top col-xs-12\">\n                <div class=\"t--editor-caption\" tr=\"key: login-form.password_caption\"></div>\n                <dx-widget name=\"dxTextBox\" options.bind=\"passwordOptions\" view-model.ref=\"password\"></dx-widget>\n            </div>\n            <div class=\"t--margin-top col-xs-12\">\n                <div class=\"t--editor-caption\">&nbsp;</div>\n                <dx-widget name=\"dxCheckBox\" options.bind=\"stayLoggodOnOptions\" view-model.ref=\"stayLoggodOn\"></dx-widget>\n            </div>\n            <div class=\"t--margin-top col-xs-12\">\n                <div class=\"t--editor-caption\">&nbsp;</div>\n                <dx-widget name=\"dxButton\" options.bind=\"wd2Options\"></dx-widget>\n            </div>\n        </form>\n    </dx-widget>\n</template>"; });
define('text!framework/security/views/authgroup/authgroup-edit-form.html', ['module'], function(module) { module.exports = "<template>\n    <dx-widget name=\"dxValidationGroup\" options.bind=\"wd1Options\" view-model.ref=\"wd1\">\n        <div class=\"t--margin-top col-xs-12\">\n            <div tr=\"key: authgroup-edit.info_text; markdown: true; mode: html\"></div>\n        </div>\n        <div class=\"t--margin-top col-xs-12 col-md-6\">\n            <div class=\"t--editor-caption\" tr=\"key: authgroup-edit.name_caption\"></div>\n            <dx-widget name=\"dxTextBox\" options.bind=\"nameOptions\" view-model.ref=\"name\"></dx-widget>\n        </div>\n        <div class=\"t--margin-top col-xs-12 col-md-6\">\n            <div class=\"t--editor-caption\" tr=\"key: authgroup-edit.mandator_caption\"></div>\n            <dx-widget name=\"dxSelectBox\" options.bind=\"mandatorOptions\" view-model.ref=\"mandator\"></dx-widget>\n        </div>\n    </dx-widget>\n</template>"; });
define('text!framework/forms/styles/styles.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--form-element-flex-box {\n  display: flex;\n}\n.t--form-element-flex-box-with-padding > *:not(:first-child) {\n  margin-left: 12px;\n}\n.t--form-element-image-inline {\n  background-size: contain;\n  background-position: center center;\n  background-repeat: no-repeat;\n}\n.t--form-element-image {\n  max-width: 100%;\n}\n"; });
define('text!framework/security/views/authgroup/authgroup-list-form.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./authgroup-edit-form\"></require>\n    <dx-widget name=\"dxValidationGroup\" options.bind=\"wd1Options\" view-model.ref=\"wd1\">\n        <dx-widget name=\"dxPopup\" options.bind=\"editOptions\" view-model.ref=\"edit\">\n            <dx-template name=\"contentTemplate\">\n                <div class=\"container-fluid\">\n                    <div class=\"row\">\n                        <authgroup-edit-form view-model.ref=\"editContent\" is-edit-form=\"true\"></authgroup-edit-form>\n                    </div>\n                </div>\n            </dx-template>\n        </dx-widget>\n        <div class=\"t--margin-top col-xs-12\">\n            <dx-widget name=\"dxDataGrid\" options.bind=\"authgroupsOptions\" view-model.ref=\"authgroups\"></dx-widget>\n        </div>\n    </dx-widget>\n</template>"; });
define('text!framework/stack-router/views/view/view.html', ['module'], function(module) { module.exports = "<template class=\"t--view\" class.bind=\"className\">\n  <require from=\"./view.css\"></require>\n\n  <div class=\"t--toolbar\" if.bind=\"createToolbar\">\n    <dx-widget if.bind=\"toolbarOptions\" name=\"dxToolbar\" options.bind=\"toolbarOptions\"></dx-widget>\n  </div>\n  <div class=\"t--view-content-wrapper\">\n    <div class=\"container-fluid\">\n      <div class=\"row\">\n        <compose\n          view-model.ref=\"view.controller\" \n          view-model.bind=\"view.moduleId\" \n          model.bind=\"view.model\" \n          class=\"t--view-content\"></compose>\n      </div>\n    </div>\n  </div>\n</template>"; });
define('text!framework/stack-router/views/stack-router/stack-router.html', ['module'], function(module) { module.exports = "<template class=\"t--stack-router\">\n  <require from=\"./stack-router.css\"></require>\n  <require from=\"../view/view\"></require>\n\n  <div \n    class=\"t--stack-router-item\" \n    class.bind=\"item.className\"\n    repeat.for=\"item of router.viewStack\">\n    <view view.bind=\"item\" create-toolbar.bind=\"$parent.createToolbar\"></view>\n  </div>\n</template>"; });
define('text!framework/default-ui/views/container/container.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--container {\n  display: block;\n  width: 100vw;\n  height: 100vh;\n}\n.t--toolbar-title {\n  min-width: 220px;\n  padding: 0 12px;\n  font-size: 20px;\n  font-weight: 100;\n  color: white;\n}\n"; });
define('text!framework/default-ui/views/content/content.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--content {\n  display: block;\n  margin-left: 280px;\n  height: calc(100% - 60px);\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: margin-left;\n}\n.t--sidebar-collapsed .t--content {\n  margin-left: 60px;\n}\n.t--view-current {\n  display: block;\n}\n.t--view-history {\n  display: none;\n}\n"; });
define('text!framework/default-ui/views/header/header.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--header {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  margin-left: 280px;\n  padding: 0 12px;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: margin-left;\n}\n.t--sidebar-collapsed .t--header {\n  margin-left: 60px;\n}\n.t--header-flex {\n  display: flex;\n  width: 100%;\n}\n.t--header-title {\n  flex-grow: 1;\n}\n"; });
define('text!framework/default-ui/views/loading-spinner/loading-spinner.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--loading {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  font-family: \"Helvetica Neue\", \"Segoe UI\", Helvetica, Verdana, sans-serif;\n  font-size: 60px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(255, 255, 255, 0.8);\n  z-index: 9999;\n  opacity: 0;\n  transition-delay: 500ms;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: opacity;\n}\n.t--loading.t--loading-active {\n  opacity: 1;\n}\n.t--loading-spinner {\n  margin: 100px auto;\n  width: 50px;\n  height: 40px;\n  text-align: center;\n  font-size: 10px;\n}\n.t--loading-spinner > div {\n  background-color: #333;\n  height: 100%;\n  width: 6px;\n  display: inline-block;\n  -webkit-animation: animationLoadingSpinner 1.2s infinite ease-in-out;\n  animation: animationLoadingSpinner 1.2s infinite ease-in-out;\n}\n.t--loading-spinner > .t--loading-rect2 {\n  -webkit-animation-delay: -1.1s;\n  animation-delay: -1.1s;\n}\n.t--loading-spinner > .t--loading-rect3 {\n  -webkit-animation-delay: -1s;\n  animation-delay: -1s;\n}\n.t--loading-spinner > .t--loading-rect4 {\n  -webkit-animation-delay: -0.9s;\n  animation-delay: -0.9s;\n}\n.t--loading-spinner > .t--loading-rect5 {\n  -webkit-animation-delay: -0.8s;\n  animation-delay: -0.8s;\n}\n@-webkit-keyframes animationLoading {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes animationLoading {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes animationLoadingSpinner {\n  0%,\n  40%,\n  100% {\n    -webkit-transform: scaleY(0.4);\n  }\n  20% {\n    -webkit-transform: scaleY(1);\n  }\n}\n@keyframes animationLoadingSpinner {\n  0%,\n  40%,\n  100% {\n    transform: scaleY(0.4);\n    -webkit-transform: scaleY(0.4);\n  }\n  20% {\n    transform: scaleY(1);\n    -webkit-transform: scaleY(1);\n  }\n}\n"; });
define('text!framework/default-ui/views/sidebar/sidebar.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--sidebar {\n  display: block;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  width: 280px;\n  background-color: #2a2e35;\n  font-size: 14px;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: left;\n}\n.t--sidebar ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.t--sidebar-collapsed .t--sidebar {\n  left: -220px;\n}\n.t--sidebar-collapsed .t--sidebar-sub {\n  left: 60px;\n}\n.t--sidebar-header {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  background-color: #262930;\n  color: white;\n  cursor: pointer;\n}\n.t--sidebar-header-title {\n  flex-grow: 1;\n  font-size: 26px;\n  font-weight: 100;\n  padding: 12px;\n}\n.t--sidebar-header-icon {\n  display: flex;\n  width: 60px;\n  align-items: center;\n  justify-content: center;\n}\n.t--sidebar-item {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  color: lightgray;\n  text-decoration: none;\n}\n.t--sidebar-item:hover {\n  color: white;\n}\n.t--sidebar-item-title {\n  flex-grow: 1;\n  padding: 12px;\n}\n.t--sidebar-item-icon {\n  display: flex;\n  width: 60px;\n  align-items: center;\n  justify-content: center;\n}\n.t--sidebar-sub {\n  position: fixed;\n  z-index: -9;\n  left: 280px;\n  min-width: 280px;\n  background-color: #2a2e35;\n  padding: 12px;\n}\n.t--sidebar-sub.au-enter-active {\n  animation: leftFadeIn 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n}\n.t--sidebar-sub-item {\n  color: lightgray;\n  text-decoration: none;\n}\n.t--sidebar-sub-item:hover {\n  color: white;\n}\n"; });
define('text!framework/default-ui/views/sidebar-sub/sidebar-sub.css', ['module'], function(module) { module.exports = ".t--sidebar-sub-ul {\n  column-fill: auto;\n  column-count: 2;\n  column-width: 200px;\n}\n"; });
define('text!framework/forms/elements/file-uploader-with-viewer/tip-file-uploader-with-viewer.css', ['module'], function(module) { module.exports = ".t--file-uploader-with-viewer input {\n  height: 0;\n  width: 0;\n}\n.t--file-uploader-with-viewer .t--file-uploader-with-viewer-click-region {\n  display: block;\n  width: 100%;\n  min-height: 150px;\n  border: 3px dotted gray;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 12px;\n}\n.t--file-uploader-with-viewer .t--file-uploader-image,\n.t--file-uploader-with-viewer t--file-uploader-placeholder-image {\n  width: 100%;\n  min-height: 150px;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-content: center;\n}\n.t--file-uploader-with-viewer .t--file-uploader-with-viewer-download {\n  margin-top: 12px;\n}\n.t--file-uploader-with-viewer img {\n  max-height: 100%;\n  max-width: 100%;\n  position: absolute;\n}\n"; });
define('text!framework/stack-router/views/view/view.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--view {\n  display: block;\n  position: relative;\n  height: 100%;\n  overflow-x: hidden;\n}\n.t--view-content-wrapper {\n  display: block;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.t--view-content {\n  display: table;\n  width: 100%;\n  margin-bottom: 12px;\n  -webkit-overflow-scrolling: touch;\n}\n.t--view-with-toolbar .t--view-content-wrapper {\n  height: calc(100% - 60px);\n}\n"; });
define('text!framework/stack-router/views/stack-router/stack-router.css', ['module'], function(module) { module.exports = ".t--stack-router,\n.t--stack-router-item {\n  display: block;\n  height: 100%;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map