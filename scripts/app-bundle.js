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

define('framework/base/event-args/unauthorized',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/event-args/location-go-to',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/event-args/export',["require", "exports"], function (require, exports) {
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
define('framework/base/services/json-service',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
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
    JsonService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [])
    ], JsonService);
    exports.JsonService = JsonService;
});

define('framework/base/interfaces/data-source-option-filter',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/interfaces/data-source-options',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/interfaces/expression-provider',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/base/interfaces/rest-delete-options',["require", "exports"], function (require, exports) {
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

define('config',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        baseUrl: "http://10.20.50.53/TIP.Aurelia",
        apiUrl: "http://10.20.50.53/TIP.Aurelia/api",
        webApiUrl: "http://10.20.50.53/TIP.Aurelia/api/data",
        appUrl: "http://localhost:9000",
        loginApp: "framework/login/login",
        mainApp: "app"
    };
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
define('framework/base/services/rest-service',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "../classes/custom-event", "./json-service", "../../../config"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, custom_event_1, json_service_1, config_1) {
    "use strict";
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
            var body = null;
            if (options.data) {
                if (typeof options.data === "string") {
                    body = options.data;
                }
                else {
                    body = this.json.stringify(options.data);
                }
            }
            return this.execute("POST", options.url, this.createHeaders(options), options.increaseLoadingCount, body);
        };
        RestService.prototype.put = function (options) {
            var body = null;
            if (options.data) {
                if (typeof options.data === "string") {
                    body = options.data;
                }
                else {
                    body = this.json.stringify(options.data);
                }
            }
            return this.execute("PUT", options.url, this.createHeaders(options), options.increaseLoadingCount, body);
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
        RestService.prototype.getAppUrl = function (suffix) {
            return config_1.default.appUrl + "/" + suffix;
        };
        RestService.prototype.createHeaders = function (options) {
            var headers = {};
            if (options.getOptions) {
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
    __decorate([
        aurelia_framework_1.computedFrom("loadingCount"),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], RestService.prototype, "isLoading", null);
    RestService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [json_service_1.JsonService,
            custom_event_1.CustomEvent])
    ], RestService);
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
define('framework/base/services/authorization-service',["require", "exports", "aurelia-framework", "./rest-service", "../../../config"], function (require, exports, aurelia_framework_1, rest_service_1, config_1) {
    "use strict";
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
                aurelia.setRoot(newValue ? config_1.default.mainApp : config_1.default.loginApp);
            });
            this.rest.getAuthHeader = this.getAuthorizationHeaders.bind(this);
            this.rest.onUnauthorizated.register(function () {
                _this.isLoggedIn = false;
                return Promise.resolve();
            });
        }
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
            var auth = localStorage.getItem(this.X_TIP_AUTH);
            if (auth) {
                headers[this.X_TIP_AUTH] = auth;
            }
            return headers;
        };
        return AuthorizationService;
    }());
    AuthorizationService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [rest_service_1.RestService,
            aurelia_framework_1.Aurelia,
            aurelia_framework_1.BindingEngine])
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
define('framework/base/services/data-source-service',["require", "exports", "aurelia-framework", "./rest-service"], function (require, exports, aurelia_framework_1, rest_service_1) {
    "use strict";
    var DataSourceService = (function () {
        function DataSourceService(rest) {
            this.rest = rest;
        }
        DataSourceService.prototype.createDataSource = function (expressionProvider, options, loadRequiredAction) {
            var _this = this;
            var dataSource = new DevExpress.data.DataSource(new DevExpress.data.CustomStore({
                key: options.keyProperty,
                byKey: function (key) {
                    var getOptions = _this.createGetOptions(expressionProvider, options);
                    return _this.rest.get({
                        url: _this.rest.getWebApiUrl(options.webApiAction + "/" + key),
                        getOptions: getOptions
                    });
                },
                load: function (loadOptions) {
                    var getOptions = _this.createGetOptions(expressionProvider, options);
                    if (getOptions == null) {
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
                        if (loadOptions.requireTotalCount) {
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
            var timeout = null;
            this.addObservers(expressionProvider, options, function () {
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
        DataSourceService.prototype.createGetOptions = function (expressionProvider, options) {
            var getOptions = {};
            getOptions.columns = options.webApiColumns;
            getOptions.expand = options.webApiExpand;
            getOptions.orderBy = options.webApiOrderBy;
            if (options.webApiWhere) {
                var where = [];
                if (!this.constructWhere(expressionProvider, options.webApiWhere, where)) {
                    return null;
                }
                if (where.length > 0) {
                    getOptions.where = where;
                }
            }
            if (options.filters) {
                var customs = [];
                var where = [];
                if (!this.constructFilters(expressionProvider, options, customs, where)) {
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
            if (options.webApiMaxRecords > 0) {
                getOptions.maxRecords = options.webApiMaxRecords;
            }
            return getOptions;
        };
        DataSourceService.prototype.addObservers = function (expressionProvider, options, action) {
            this.addObserversWhere(expressionProvider, options.webApiWhere, action);
            if (options.filters) {
                for (var _i = 0, _a = options.filters; _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.addObserversDetail(expressionProvider, item.if, action);
                    this.addObserversDetail(expressionProvider, item.webApiCustomValue, action);
                    this.addObserversWhere(expressionProvider, item.webApiWhere, action);
                }
            }
        };
        DataSourceService.prototype.addObserversDetail = function (expressionProvider, expression, action) {
            if (expression == void (0)) {
                return;
            }
            expressionProvider.createObserver(expression, action);
        };
        DataSourceService.prototype.addObserversWhere = function (expressionProvider, data, action) {
            var _this = this;
            if (data == void (0)) {
                return;
            }
            if (Array.isArray(data)) {
                data.forEach(function (item) { return _this.addObserversWhere(expressionProvider, item, action); });
            }
            else if (typeof data === "object") {
                if (data.isBound === true && data.expression != void (0)) {
                    this.addObserversDetail(expressionProvider, data.expression, action);
                }
                else {
                    for (var property in data) {
                        this.addObserversWhere(expressionProvider, data[property], action);
                    }
                }
            }
        };
        DataSourceService.prototype.constructWhere = function (expressionProvider, data, where) {
            var _this = this;
            if (data == void (0)) {
                return true;
            }
            if (Array.isArray(data)) {
                var newArr_1 = [];
                where.push(newArr_1);
                var cancel_1 = false;
                data.forEach(function (item) {
                    if (!_this.constructWhere(expressionProvider, item, newArr_1)) {
                        cancel_1 = true;
                    }
                });
                if (cancel_1) {
                    return false;
                }
            }
            else if (typeof data === "object") {
                if (data.isBound === true && data.expression != void (0)) {
                    var val = expressionProvider.evaluateExpression(data.expression);
                    if (val == void (0)) {
                        return false;
                    }
                    where.push(val);
                }
                else {
                    for (var property in data) {
                        if (!this.constructWhere(expressionProvider, data[property], where)) {
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
        DataSourceService.prototype.constructFilters = function (expressionProvider, options, customs, where) {
            for (var _i = 0, _a = options.filters; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.if) {
                    if (!expressionProvider.evaluateExpression(item.if)) {
                        continue;
                    }
                }
                if (item.webApiCustomKey && item.webApiCustomValue) {
                    customs.push({
                        key: item.webApiCustomKey,
                        value: expressionProvider.evaluateExpression(item.webApiCustomValue)
                    });
                }
                else if (item.webApiWhere) {
                    var w = [];
                    if (!this.constructWhere(expressionProvider, item.webApiWhere, w)) {
                        return false;
                    }
                    where.push(w);
                }
            }
            return true;
        };
        return DataSourceService;
    }());
    DataSourceService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [rest_service_1.RestService])
    ], DataSourceService);
    exports.DataSourceService = DataSourceService;
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

define('framework/base/services/error-service',["require", "exports"], function (require, exports) {
    "use strict";
    var ErrorService = (function () {
        function ErrorService() {
        }
        ErrorService.prototype.showError = function (error) {
            DevExpress.ui.dialog.alert(error, "Fehler");
        };
        ErrorService.prototype.logError = function (error) {
        };
        ErrorService.prototype.showAndLogError = function (error) {
            this.logError(error);
            this.showError(error);
        };
        return ErrorService;
    }());
    exports.ErrorService = ErrorService;
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
define('framework/base/services/globalization-service',["require", "exports", "moment", "aurelia-framework"], function (require, exports, moment, aurelia_framework_1) {
    "use strict";
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
                        return moment(value).locale(_this.current.culture).format(format);
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
                        return moment(value, format, _this.current.culture);
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
    GlobalizationService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [])
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('framework/base/services/localization-service',["require", "exports", "aurelia-framework", "./rest-service", "text!../../../localization-neutral.json"], function (require, exports, aurelia_framework_1, rest_service_1, localizationNeutral) {
    "use strict";
    var LocalizationService = (function () {
        function LocalizationService(rest) {
            this.rest = rest;
            this.neutral = JSON.parse(localizationNeutral);
        }
        LocalizationService.prototype.translate = function (expressionProvider, key, callback) {
            var _this = this;
            if (!key) {
                return null;
            }
            var item = this.getItem(key);
            if (!item) {
                throw new Error("No localization found for " + key);
            }
            if (callback) {
                if (typeof item === "object" && item.parameters.length > 0) {
                    item.parameters.forEach(function (expr, index) {
                        expressionProvider.createObserver(expr, function () {
                            callback(_this.translateItem(expressionProvider, item));
                        });
                    });
                }
                var result = this.translateItem(expressionProvider, item);
                callback(result);
                return result;
            }
            else {
                return this.translateItem(expressionProvider, item);
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
        LocalizationService.prototype.translateItem = function (expressionProvider, item) {
            if (typeof item === "string") {
                return item;
            }
            else if (typeof item === "object") {
                var text_1 = item.text;
                item.parameters.forEach(function (expr, index) {
                    var val = expressionProvider.evaluateExpression(expr);
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
    LocalizationService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [rest_service_1.RestService])
    ], LocalizationService);
    exports.LocalizationService = LocalizationService;
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
define('framework/base/services/location-service',["require", "exports", "aurelia-framework", "../classes/custom-event"], function (require, exports, aurelia_framework_1, custom_event_1) {
    "use strict";
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
    LocationService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [custom_event_1.CustomEvent])
    ], LocationService);
    exports.LocationService = LocationService;
});

define('framework/base/services/export',["require", "exports", "./authorization-service", "./data-source-service", "./deep-observer-service", "./error-service", "./globalization-service", "./localization-service", "./location-service", "./json-service", "./object-info-service", "./rest-service"], function (require, exports, authorization_service_1, data_source_service_1, deep_observer_service_1, error_service_1, globalization_service_1, localization_service_1, location_service_1, json_service_1, object_info_service_1, rest_service_1) {
    "use strict";
    exports.AuthorizationService = authorization_service_1.AuthorizationService;
    exports.DataSourceService = data_source_service_1.DataSourceService;
    exports.DeepObserverService = deep_observer_service_1.DeepObserverService;
    exports.ErrorService = error_service_1.ErrorService;
    exports.GlobalizationService = globalization_service_1.GlobalizationService;
    exports.LocalizationService = localization_service_1.LocalizationService;
    exports.LocationService = location_service_1.LocationService;
    exports.JsonService = json_service_1.JsonService;
    exports.ObjectInfoService = object_info_service_1.ObjectInfoService;
    exports.RestService = rest_service_1.RestService;
});

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
define('framework/stack-router/services/router-service',["require", "exports", "aurelia-framework", "../classes/view-item", "../../base/services/export"], function (require, exports, aurelia_framework_1, view_item_1, export_1) {
    "use strict";
    var RouterService = (function () {
        function RouterService(localization) {
            this.localization = localization;
            this.routes = [];
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
    RouterService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [export_1.LocalizationService])
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
define('framework/stack-router/services/history-service',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../base/services/export", "./router-service"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, export_1, router_service_1) {
    "use strict";
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
    HistoryService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator,
            aurelia_framework_1.TaskQueue,
            router_service_1.RouterService,
            export_1.LocationService])
    ], HistoryService);
    exports.HistoryService = HistoryService;
});

define('framework/stack-router/services/routes-creator-service',["require", "exports"], function (require, exports) {
    "use strict";
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
    exports.HistoryService = history_service_1.HistoryService;
    exports.RouterService = router_service_1.RouterService;
    exports.RoutesCreatorService = routes_creator_service_1.RoutesCreatorService;
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
define('app',["require", "exports", "aurelia-framework", "./framework/stack-router/services/export", "text!./routes/forms.json", "text!./routes/structure.json"], function (require, exports, aurelia_framework_1, export_1, routesForm, routesStructure) {
    "use strict";
    var App = (function () {
        function App(router, routesCreator) {
            this.router = router;
            this.routesCreator = routesCreator;
            this.routes = [];
            this.routes = routesCreator.createRoutes(JSON.parse(routesStructure), JSON.parse(routesForm));
        }
        App.prototype.attached = function () {
            this.router.registerRoutes(this.routes, "security/authgroup");
        };
        return App;
    }());
    App = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [export_1.RouterService,
            export_1.RoutesCreatorService])
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

define('framework/default-ui/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config
            .globalResources("./styles/styles.css");
    }
    exports.configure = configure;
});

define('framework/base/classes/export',["require", "exports", "./custom-event"], function (require, exports, custom_event_1) {
    "use strict";
    exports.CustomEvent = custom_event_1.CustomEvent;
});

define('framework/base/export',["require", "exports", "./classes/export", "./services/export"], function (require, exports, export_1, export_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(export_1);
    __export(export_2);
});

define('framework/base/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config
            .globalResources("./attributes/icon/fa-icon-attribute")
            .globalResources("./attributes/translation/translation-attribute")
            .globalResources("./styles/styles.css");
    }
    exports.configure = configure;
});

define('framework/dx/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config
            .globalResources("devextreme")
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

define('framework/forms/event-args/model-loaded',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/event-args/model-loaded-interceptor',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/event-args/model-load-required',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/event-args/form-attached',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/event-args/form-reactivated',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/event-args/form-ready',["require", "exports"], function (require, exports) {
    "use strict";
});

define('framework/forms/event-args/export',["require", "exports"], function (require, exports) {
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
define('framework/forms/classes/expressions',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Expressions = (function () {
        function Expressions(bindingEngine) {
            this.bindingEngine = bindingEngine;
            this.expression = new Map();
        }
        Expressions.prototype.createObserver = function (expression, action, bindingContext) {
            return this
                .bindingEngine
                .expressionObserver(bindingContext || this.form, expression)
                .subscribe(action)
                .dispose;
        };
        Expressions.prototype.evaluateExpression = function (expression, overrideContext) {
            var parsed = this.expression.get(expression);
            if (!parsed) {
                parsed = this.bindingEngine.parseExpression(expression);
                this.expression.set(expression, parsed);
            }
            return parsed.evaluate({
                bindingContext: this.form,
                overrideContext: overrideContext
            });
        };
        Expressions.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        return Expressions;
    }());
    Expressions = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        __metadata("design:paramtypes", [aurelia_framework_1.BindingEngine])
    ], Expressions);
    exports.Expressions = Expressions;
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
define('framework/forms/classes/models',["require", "exports", "aurelia-framework", "../../base/export", "../../base/services/data-source-service"], function (require, exports, aurelia_framework_1, export_1, data_source_service_1) {
    "use strict";
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
                    var getOptions = _this.dataSource.createGetOptions(_this.expressions, args.model);
                    return _this.rest.get({
                        url: _this.rest.getWebApiUrl(args.model.webApiAction + "/" + _this.expressions.evaluateExpression(args.model.key)),
                        getOptions: getOptions,
                        increaseLoadingCount: true
                    }).then(function (r) {
                        _this.onLoadedInterceptor.fire({
                            model: args.model,
                            data: r
                        });
                        _this.data[args.model.id] = r;
                        _this.onLoaded.fire({
                            model: args.model,
                            data: r
                        });
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
        Models.prototype.getModels = function () {
            var arr = [];
            for (var i in this.info) {
                arr.push(this.info[i]);
            }
            return arr;
        };
        Models.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
            this.expressions = form.expressions;
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
                    getOptions: _this.dataSource.createGetOptions(_this.expressions, m)
                }).then(function (r) {
                    _this.data[m.id] = r;
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
                    id: _this.data[m.id][m.key],
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
            this.dataSource.addObservers(this.form.expressions, model, function () {
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
            this.expressions.createObserver(expression, function (newValue, oldValue) {
                _this.onLoadRequired.fire({
                    model: model
                });
            });
        };
        return Models;
    }());
    Models = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        __metadata("design:paramtypes", [export_1.RestService,
            data_source_service_1.DataSourceService,
            export_1.CustomEvent,
            export_1.CustomEvent,
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('framework/forms/classes/nested-forms',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var NestedForms = (function () {
        function NestedForms() {
            this.nestedForms = [];
        }
        NestedForms.prototype.addInfo = function (id) {
            this.nestedForms.push(id);
        };
        NestedForms.prototype.getNestedForms = function () {
            var _this = this;
            var arr = [];
            this.nestedForms.forEach(function (i) {
                var form = _this.form[i];
                arr.push(form);
                arr.push.apply(arr, form.nestedForms.getNestedForms());
            });
            return arr;
        };
        NestedForms.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
        };
        return NestedForms;
    }());
    NestedForms = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.singleton(true),
        __metadata("design:paramtypes", [])
    ], NestedForms);
    exports.NestedForms = NestedForms;
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
define('framework/forms/services/default-commands-service',["require", "exports", "aurelia-framework", "../../base/services/export", "../../stack-router/services/router-service"], function (require, exports, aurelia_framework_1, export_1, router_service_1) {
    "use strict";
    var DefaultCommandsService = (function () {
        function DefaultCommandsService(router, localization) {
            this.router = router;
            this.localization = localization;
        }
        DefaultCommandsService.prototype.getSaveCommand = function (form) {
            return {
                id: "$cmdSave",
                icon: "floppy-o",
                title: "base.save",
                isVisible: this.canSave(form),
                isEnabled: true,
                execute: function () {
                    form.save();
                }
            };
        };
        DefaultCommandsService.prototype.getDeleteCommand = function (form) {
            var _this = this;
            var cmd = {
                id: "$cmdDelete",
                icon: "times",
                title: "base.delete",
                isVisible: this.canSave(form),
                isEnabled: this.canDelete(form),
                execute: function () {
                    DevExpress.ui.dialog.confirm(_this.localization.translate(form.expressions, "base.sure_delete_question"), _this.localization.translate(form.expressions, "base.question"))
                        .then(function (r) {
                        if (r) {
                            form.delete();
                        }
                    });
                }
            };
            form.models.onLoaded.register(function () {
                cmd.isEnabled = _this.canDelete(form);
                return Promise.resolve();
            });
            return cmd;
        };
        DefaultCommandsService.prototype.getGoBackCommand = function (form) {
            return {
                id: "$cmdGoBack",
                icon: "arrow-left",
                isVisible: this.router.viewStack.length > 1,
                execute: function () {
                    history.back();
                }
            };
        };
        DefaultCommandsService.prototype.canSave = function (form) {
            return form
                .getFormsInclOwn()
                .some(function (i) { return i.models.getModels().some(function (m) { return m.postOnSave; }); });
        };
        DefaultCommandsService.prototype.canDelete = function (form) {
            return form
                .getFormsInclOwn()
                .some(function (i) { return i.models.getModels().some(function (m) {
                if (!m.postOnSave) {
                    return false;
                }
                if (!form.models.data[m.id] || !form.models.data[m.id][m.keyProperty]) {
                    return false;
                }
                return true;
            }); });
        };
        return DefaultCommandsService;
    }());
    DefaultCommandsService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [router_service_1.RouterService,
            export_1.LocalizationService])
    ], DefaultCommandsService);
    exports.DefaultCommandsService = DefaultCommandsService;
});

define('framework/forms/services/command-service',["require", "exports"], function (require, exports) {
    "use strict";
    var CommandService = (function () {
        function CommandService() {
            this.isCommandExecuting = false;
        }
        CommandService.prototype.isVisible = function (expressionProvider, command) {
            if (command.isVisible != undefined) {
                return command.isVisible;
            }
            else if (command.isVisibleExpression) {
                return expressionProvider.evaluateExpression(command.isVisibleExpression);
            }
            return true;
        };
        CommandService.prototype.isEnabled = function (expressionProvider, command) {
            if (command.isEnabled != undefined) {
                return command.isEnabled;
            }
            else if (command.isEnabledExpression) {
                return expressionProvider.evaluateExpression(command.isEnabledExpression);
            }
            return true;
        };
        CommandService.prototype.isVisibleAndEnabled = function (expressions, command) {
            return this.isVisible(expressions, command)
                && this.isEnabled(expressions, command);
        };
        CommandService.prototype.execute = function (expressionProvider, command) {
            var _this = this;
            if (this.isCommandExecuting) {
                return;
            }
            if (!this.isVisibleAndEnabled(expressionProvider, command)) {
                return false;
            }
            if (!command.execute) {
                return false;
            }
            this.isCommandExecuting = true;
            var result = command.execute.bind(expressionProvider)();
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
    exports.CommandService = CommandService;
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
define('framework/forms/services/toolbar-service',["require", "exports", "aurelia-framework", "../../base/services/export", "../services/default-commands-service", "../services/command-service"], function (require, exports, aurelia_framework_1, export_1, default_commands_service_1, command_service_1) {
    "use strict";
    var ToolbarService = (function () {
        function ToolbarService(defaultCommands, command, localization) {
            this.defaultCommands = defaultCommands;
            this.command = command;
            this.localization = localization;
            this.titleItemTemplate = "TITEL_ITEM_TEMPLATE";
        }
        ToolbarService.prototype.createFormToolbarOptions = function (form) {
            var _this = this;
            var component;
            var options = this.createToolbarOptions(form.expressions, form.title, this.collectItems(form), function (c) {
                component = c;
            });
            form.expressions.createObserver("title", function (newValue) {
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
        ToolbarService.prototype.createToolbarOptions = function (expressionProvider, title, commands, componentCreatedCallback) {
            var _this = this;
            var component;
            var options = {
                onInitialized: function (e) {
                    component = e.component;
                    if (componentCreatedCallback) {
                        componentCreatedCallback(component);
                    }
                }
            };
            var items = commands
                .map(function (i) { return _this.createToolbarItem(expressionProvider, function () { return component; }, i); });
            var titleItem = {
                html: this.createTitleHtml(title),
                location: "before"
            };
            titleItem[this.titleItemTemplate] = this.titleItemTemplate;
            items.splice(0, 0, titleItem);
            options.items = items;
            return options;
        };
        ToolbarService.prototype.createToolbarItem = function (expressionProvider, getToolbar, command) {
            var _this = this;
            var item = {};
            this.setEnabled(expressionProvider, getToolbar, command, item);
            this.setVisible(expressionProvider, getToolbar, command, item);
            item.template = "global:toolbar-button-template";
            item.location = command.location || "before";
            item.locateInMenu = command.locateInMenu;
            item.command = command;
            item.guardedExecute = function () {
                _this.command.execute(expressionProvider, command);
            };
            return item;
        };
        ToolbarService.prototype.collectItems = function (form) {
            var items = [];
            items.push(this.defaultCommands.getGoBackCommand(form));
            items.push(this.defaultCommands.getSaveCommand(form));
            items.push(this.defaultCommands.getDeleteCommand(form));
            for (var _i = 0, _a = form.commands.getCommands(); _i < _a.length; _i++) {
                var command = _a[_i];
                items.push(command);
            }
            return items;
        };
        ToolbarService.prototype.createTitleHtml = function (title) {
            if (!title) {
                return null;
            }
            return "<div class=\"t--toolbar-title\">" + this.localization.translate(null, title) + "</div>";
        };
        ToolbarService.prototype.setEnabled = function (expressionProvider, getToolbar, command, item) {
            var _this = this;
            var setEnabled = function (val) {
                _this.setItemOption(getToolbar, item, "disabled", !val);
                item.disabled = !val;
                command.isEnabled = val;
            };
            item.disabled = !this.command.isEnabled(expressionProvider, command);
            if (command.isEnabled != undefined) {
                expressionProvider.createObserver("isEnabled", function (newValue) {
                    setEnabled(newValue);
                }, command);
            }
            else if (command.isEnabledExpression) {
                expressionProvider.createObserver(command.isEnabledExpression, function (newValue) {
                    setEnabled(newValue);
                });
            }
        };
        ToolbarService.prototype.setVisible = function (expressionProvider, getToolbar, command, item) {
            var _this = this;
            var setVisible = function (val) {
                _this.setItemOption(getToolbar, item, "visible", val);
                item.visible = val;
                command.isVisible = val;
            };
            item.visible = this.command.isVisible(expressionProvider, command);
            if (command.isVisible != undefined) {
                expressionProvider.createObserver("isVisible", function (newValue) {
                    setVisible(newValue);
                }, command);
            }
            else if (command.isVisibleExpression) {
                expressionProvider.createObserver(command.isVisibleExpression, function (newValue) {
                    setVisible(newValue);
                });
            }
        };
        ToolbarService.prototype.setItemOption = function (getToolbar, item, property, value) {
            var toolbar = getToolbar ? getToolbar() : null;
            if (!toolbar) {
                return;
            }
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
        __metadata("design:paramtypes", [default_commands_service_1.DefaultCommandsService,
            command_service_1.CommandService,
            export_1.LocalizationService])
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

define('framework/forms/widget-options/select-item-container-options',["require", "exports"], function (require, exports) {
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
define('framework/forms/widget-services/simple-widget-creator-service',["require", "exports", "aurelia-framework", "../services/toolbar-service", "../../base/services/export", "./base-widget-creator-service"], function (require, exports, aurelia_framework_1, toolbar_service_1, export_1, base_widget_creator_service_1) {
    "use strict";
    var SimpleWidgetCreatorService = (function () {
        function SimpleWidgetCreatorService(baseWidgetCreator, dataSource, globalization, localization, toolbar) {
            this.baseWidgetCreator = baseWidgetCreator;
            this.dataSource = dataSource;
            this.globalization = globalization;
            this.localization = localization;
            this.toolbar = toolbar;
        }
        SimpleWidgetCreatorService.prototype.addAccordion = function (form, options) {
            return this.baseWidgetCreator.createWidgetOptions(form, options);
        };
        SimpleWidgetCreatorService.prototype.addCalendar = function (form, options) {
            return this.createEditorOptions(form, options);
        };
        SimpleWidgetCreatorService.prototype.addCheckBox = function (form, options) {
            var editorOptions = this.createEditorOptions(form, options);
            if (options.caption) {
                editorOptions.text = this.localization.translate(form.expressions, options.caption);
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
            if (options.format) {
                editorOptions.displayFormat = this.globalization.getFormatterParser(options.format);
            }
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addCommand = function (form, options) {
            var command;
            if (options.binding.dataContext) {
                command = form.commandServerData[options.binding.dataContext + ";" + options.binding.bindTo];
            }
            else {
                command = form.expressions.evaluateExpression(options.binding.bindToFQ);
            }
            var buttonOptions = {};
            buttonOptions.text = this.localization.translate(form.expressions, command.title);
            buttonOptions.hint = this.localization.translate(form.expressions, command.tooltip);
            buttonOptions.width = "100%";
            buttonOptions.onClick = function () {
                if (typeof command.execute === "function") {
                    command.execute();
                }
                else if (typeof command.execute === "string") {
                    form.expressions.evaluateExpression(command.execute);
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
        SimpleWidgetCreatorService.prototype.addLookup = function (form, options, selectContainerOptions) {
            var editorOptions = this.createEditorOptions(form, options);
            this.addDataExpressionOptions(form, options, selectContainerOptions, editorOptions);
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
            if (options.caption) {
                widgetOptions.title = this.localization.translate(null, options.caption);
            }
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
            widgetOptions.toolbarItems = this.toolbar.createToolbarOptions(form.expressions, options.caption, []).items;
            return widgetOptions;
        };
        SimpleWidgetCreatorService.prototype.addRadioGroup = function (form, options, selectContainerOptions) {
            var editorOptions = this.createEditorOptions(form, options);
            this.addDataExpressionOptions(form, options, selectContainerOptions, editorOptions);
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addSelectBox = function (form, options, selectContainerOptions) {
            var editorOptions = this.createEditorOptions(form, options);
            this.addDataExpressionOptions(form, options, selectContainerOptions, editorOptions);
            return editorOptions;
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
                    text: _this.localization.translate(form.expressions, page.caption),
                    visible: true,
                    __options: page
                };
                if (page.if) {
                    form.expressions.createObserver(page.if, function (newValue) {
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
                form.expressions.evaluateExpression(page.__options.onActivated);
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
            if (options.mode) {
                editorOptions.mode = options.mode;
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
                editorOptions.placeholder = this.localization.translate(form.expressions, options.placeholder);
            }
            return editorOptions;
        };
        SimpleWidgetCreatorService.prototype.addDataExpressionOptions = function (form, options, selectContainerOptions, current) {
            if (selectContainerOptions.selectItem.items
                && selectContainerOptions.selectItem.items.length > 0) {
                current.dataSource = selectContainerOptions.selectItem.items;
            }
            else if (selectContainerOptions.selectItem.action) {
                var where = [];
                if (selectContainerOptions.filter) {
                    where.push(selectContainerOptions.filter);
                }
                if (selectContainerOptions.selectItem.where) {
                    where.push(selectContainerOptions.selectItem.where);
                }
                current.dataSource = this.dataSource.createDataSource(form.expressions, {
                    keyProperty: selectContainerOptions.selectItem.valueMember,
                    webApiAction: selectContainerOptions.selectItem.action,
                    webApiColumns: selectContainerOptions.selectItem.columns,
                    webApiExpand: selectContainerOptions.selectItem.expand,
                    webApiOrderBy: selectContainerOptions.selectItem.orderBy,
                    webApiWhere: where,
                    filters: selectContainerOptions.customs
                });
            }
            current.valueExpr = selectContainerOptions.selectItem.valueMember;
            current.displayExpr = selectContainerOptions.selectItem.displayMember;
        };
        return SimpleWidgetCreatorService;
    }());
    SimpleWidgetCreatorService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [base_widget_creator_service_1.BaseWidgetCreatorService,
            export_1.DataSourceService,
            export_1.GlobalizationService,
            export_1.LocalizationService,
            toolbar_service_1.ToolbarService])
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
define('framework/forms/widget-services/data-grid-widget-creator-service',["require", "exports", "aurelia-framework", "./base-widget-creator-service", "../../base/services/export", "../enums/selection-mode-enum", "../../base/services/data-source-service"], function (require, exports, aurelia_framework_1, base_widget_creator_service_1, export_1, selection_mode_enum_1, data_source_service_1) {
    "use strict";
    var DataGridWidgetCreatorService = (function () {
        function DataGridWidgetCreatorService(baseWidgetCreator, dataSource, globalization, localization, location) {
            this.baseWidgetCreator = baseWidgetCreator;
            this.dataSource = dataSource;
            this.globalization = globalization;
            this.localization = localization;
            this.location = location;
        }
        DataGridWidgetCreatorService.prototype.addDataGrid = function (form, options) {
            var _this = this;
            var dataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);
            if (options.dataModel) {
                var model = form.models.getInfo(options.dataModel);
                var dataSource_1 = this.dataSource.createDataSource(form.expressions, model);
                dataGridOptions.dataSource = dataSource_1;
                dataGridOptions.remoteOperations = {
                    filtering: true,
                    paging: true,
                    sorting: true
                };
                form.onFormReactivated.register(function (e) {
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
                        column.caption = _this.localization.translate(form.expressions, col.caption);
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
            var clickActions = [];
            if (options.onItemClick) {
                clickActions.push(function (e) {
                    form.expressions.evaluateExpression(options.onItemClick, { e: e });
                });
            }
            if (options.editDataContext) {
                clickActions.push(function (e) {
                    form.models.data[options.editDataContext] = e.data;
                });
            }
            if (options.editUrl && options.dataModel) {
                var model_1 = form.models.getInfo(options.dataModel);
                if (model_1) {
                    clickActions.push(function (e) {
                        _this.location.goTo("#" + options.editUrl + "/" + e.data[model_1.keyProperty], form);
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
        __metadata("design:paramtypes", [base_widget_creator_service_1.BaseWidgetCreatorService,
            data_source_service_1.DataSourceService,
            export_1.GlobalizationService,
            export_1.LocalizationService,
            export_1.LocationService])
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
        WidgetCreatorService.prototype.addLookup = function (form, options, selectContainerOptions) {
            return this.simpleWidgetCreator.addLookup(form, options, selectContainerOptions);
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
        WidgetCreatorService.prototype.addRadioGroup = function (form, options, selectContainerOptions) {
            return this.simpleWidgetCreator.addRadioGroup(form, options, selectContainerOptions);
        };
        WidgetCreatorService.prototype.addTab = function (form, options) {
            return this.simpleWidgetCreator.addTab(form, options);
        };
        WidgetCreatorService.prototype.addSelectBox = function (form, options, selectContainerOptions) {
            return this.simpleWidgetCreator.addSelectBox(form, options, selectContainerOptions);
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('framework/forms/classes/form-base-import',["require", "exports", "aurelia-framework", "./models", "./functions", "./commands", "./variables", "./expressions", "./nested-forms", "./command-server-data", "../services/toolbar-service", "../services/command-service", "../widget-services/widget-creator-service", "../../base/export", "../../stack-router/services/router-service"], function (require, exports, aurelia_framework_1, models_1, functions_1, commands_1, variables_1, expressions_1, nested_forms_1, command_server_data_1, toolbar_service_1, command_service_1, widget_creator_service_1, export_1, router_service_1) {
    "use strict";
    var FormBaseImport = (function () {
        function FormBaseImport(bindingEngine, taskQueue, widgetCreator, command, toolbar, router, error, models, nestedForms, variables, functions, commands, expressions, globalization, localization, commandServerData, onFormAttached, onFormReady, onFormReactivated) {
            this.bindingEngine = bindingEngine;
            this.taskQueue = taskQueue;
            this.widgetCreator = widgetCreator;
            this.command = command;
            this.toolbar = toolbar;
            this.router = router;
            this.error = error;
            this.models = models;
            this.nestedForms = nestedForms;
            this.variables = variables;
            this.functions = functions;
            this.commands = commands;
            this.expressions = expressions;
            this.globalization = globalization;
            this.localization = localization;
            this.commandServerData = commandServerData;
            this.onFormAttached = onFormAttached;
            this.onFormReady = onFormReady;
            this.onFormReactivated = onFormReactivated;
        }
        return FormBaseImport;
    }());
    FormBaseImport = __decorate([
        aurelia_framework_1.transient(),
        __metadata("design:paramtypes", [aurelia_framework_1.BindingEngine,
            aurelia_framework_1.TaskQueue,
            widget_creator_service_1.WidgetCreatorService,
            command_service_1.CommandService,
            toolbar_service_1.ToolbarService,
            router_service_1.RouterService,
            export_1.ErrorService,
            models_1.Models,
            nested_forms_1.NestedForms,
            variables_1.Variables,
            functions_1.Functions,
            commands_1.Commands,
            expressions_1.Expressions,
            export_1.GlobalizationService,
            export_1.LocalizationService,
            command_server_data_1.CommandServerData,
            export_1.CustomEvent,
            export_1.CustomEvent,
            export_1.CustomEvent])
    ], FormBaseImport);
    exports.FormBaseImport = FormBaseImport;
});

define('framework/forms/classes/form-base',["require", "exports"], function (require, exports) {
    "use strict";
    var FormBase = (function () {
        function FormBase(formBaseImport) {
            this.formBaseImport = formBaseImport;
            this.widgetCreator = formBaseImport.widgetCreator;
            this.command = formBaseImport.command;
            this.toolbar = formBaseImport.toolbar;
            this.models = formBaseImport.models;
            this.variables = formBaseImport.variables;
            this.nestedForms = formBaseImport.nestedForms;
            this.functions = formBaseImport.functions;
            this.expressions = formBaseImport.expressions;
            this.commands = formBaseImport.commands;
            this.globalization = formBaseImport.globalization;
            this.localization = formBaseImport.localization;
            this.commandServerData = formBaseImport.commandServerData;
            this.onFormAttached = formBaseImport.onFormAttached;
            this.onFormReady = formBaseImport.onFormReady;
            this.onFormReactivated = formBaseImport.onFormReactivated;
            this.models.registerForm(this);
            this.variables.registerForm(this);
            this.functions.registerForm(this);
            this.commands.registerForm(this);
            this.expressions.registerForm(this);
        }
        FormBase.prototype.attached = function () {
            var _this = this;
            var promise = this.onFormAttached.fire({
                form: this
            });
            this.formBaseImport.taskQueue.queueTask(function () {
                _this.onFormReady.fire({
                    form: _this,
                });
            });
            return promise;
        };
        FormBase.prototype.activate = function (routeInfo) {
            if (routeInfo && routeInfo.parameters && routeInfo.parameters.id) {
                this.variables.data.$id = routeInfo.parameters.id;
            }
        };
        FormBase.prototype.reactivate = function () {
            this.onFormReactivated.fire({
                form: this
            });
        };
        FormBase.prototype.getFileDownloadUrl = function (key) {
            return this.expressions.evaluateExpression(key);
        };
        FormBase.prototype.getFormsInclOwn = function () {
            return [this].concat(this.nestedForms.getNestedForms());
        };
        FormBase.prototype.save = function () {
            var _this = this;
            return this.models.save()
                .then(function () {
                DevExpress.ui.notify("Daten wurden erfolgreich gespeichert", "SUCCESS", 3000);
            })
                .catch(function (r) {
                _this.formBaseImport.error.showAndLogError(r);
            });
        };
        FormBase.prototype.delete = function () {
            var _this = this;
            return this.models.save()
                .then(function () {
                _this.formBaseImport.router.removeViewModel(_this);
            })
                .catch(function (r) {
                _this.formBaseImport.error.showAndLogError(r);
            });
        };
        FormBase.prototype.translate = function (key) {
            return this.localization.translate(this.expressions, key);
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
        FormBase.prototype.addNestedForm = function (id) {
            this.nestedForms.addInfo(id);
        };
        FormBase.prototype.addEditPopup = function (editPopup) {
        };
        FormBase.prototype.addMapping = function (mapping) {
        };
        FormBase.prototype.submitForm = function (commandExpression) {
            var command = this.expressions.evaluateExpression(commandExpression);
            if (!command || !command.execute) {
                return;
            }
            this.command.execute(this.expressions, command);
        };
        FormBase.prototype.onConstructionFinished = function () {
            this.toolbarOptions = this.toolbar.createFormToolbarOptions(this);
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
            return this.commands.map(function (i) { return _this.expressions.evaluateExpression(i.binding.bindToFQ); });
        };
        Commands.prototype.registerForm = function (form) {
            if (this.form) {
                throw new Error("Form was already registered");
            }
            this.form = form;
            this.expressions = form.expressions;
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

define('framework/forms/classes/export',["require", "exports", "./command-server-data", "./commands", "./expressions", "./form-base", "./functions", "./models", "./nested-forms", "./variables"], function (require, exports, command_server_data_1, commands_1, expressions_1, form_base_1, functions_1, models_1, nested_forms_1, variables_1) {
    "use strict";
    exports.CommandServerData = command_server_data_1.CommandServerData;
    exports.Commands = commands_1.Commands;
    exports.Expressions = expressions_1.Expressions;
    exports.FormBase = form_base_1.FormBase;
    exports.Functions = functions_1.Functions;
    exports.Models = models_1.Models;
    exports.NestedForms = nested_forms_1.NestedForms;
    exports.Variables = variables_1.Variables;
});

define('framework/forms/enums/export',["require", "exports", "./selection-mode-enum"], function (require, exports, selection_mode_enum_1) {
    "use strict";
    exports.SelectionModeEnum = selection_mode_enum_1.SelectionModeEnum;
});

define('framework/forms/services/export',["require", "exports", "./command-service", "./default-commands-service", "./toolbar-service"], function (require, exports, command_service_1, default_commands_service_1, toolbar_service_1) {
    "use strict";
    exports.CommandService = command_service_1.CommandService;
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

define('framework/forms/form-export',["require", "exports", "aurelia-framework", "./classes/form-base", "./classes/form-base-import"], function (require, exports, aurelia_framework_1, form_base_1, form_base_import_1) {
    "use strict";
    exports.autoinject = aurelia_framework_1.autoinject;
    exports.FormBase = form_base_1.FormBase;
    exports.FormBaseImport = form_base_import_1.FormBaseImport;
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
define('framework/dx/services/dx-template-service',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var DxTemplateService = (function () {
        function DxTemplateService(templatingEngine) {
            this.templatingEngine = templatingEngine;
            this.templates = {};
        }
        DxTemplateService.prototype.registerTemplate = function (key, template) {
            this.templates[key] = template;
        };
        DxTemplateService.prototype.getTemplates = function (bindingContext) {
            var _this = this;
            var result = {};
            var _loop_1 = function (templateKey) {
                result[templateKey] = {
                    render: function (renderData) {
                        var newItem = document.createElement("div");
                        newItem.innerHTML = _this.templates[templateKey];
                        var newElement = $(newItem).appendTo(renderData.container);
                        var model = null;
                        if (renderData.model) {
                            model = {};
                            model["data"] = renderData.model;
                        }
                        var result = _this.templatingEngine.enhance({
                            element: newElement.get(0),
                            bindingContext: bindingContext,
                            overrideContext: model
                        });
                        result.attached();
                        return $(newElement);
                    }
                };
            };
            for (var templateKey in this.templates) {
                _loop_1(templateKey);
            }
            return result;
        };
        return DxTemplateService;
    }());
    DxTemplateService = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_framework_1.TemplatingEngine])
    ], DxTemplateService);
    exports.DxTemplateService = DxTemplateService;
});

define('framework/forms/index',["require", "exports", "../dx/services/dx-template-service", "text!./templates/toolbar-button-template.html"], function (require, exports, dx_template_service_1, toolbarButtonTemplate) {
    "use strict";
    function configure(config) {
        config
            .globalResources("./styles/styles.css");
        var dxTemplate = config.container.get(dx_template_service_1.DxTemplateService);
        dxTemplate.registerTemplate("global:toolbar-button-template", toolbarButtonTemplate);
    }
    exports.configure = configure;
});

define('framework/stack-router/classes/export',["require", "exports", "./view-item"], function (require, exports, view_item_1) {
    "use strict";
    exports.ViewItem = view_item_1.ViewItem;
});

define('framework/stack-router/export',["require", "exports", "./classes/export", "./services/export"], function (require, exports, export_1, export_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(export_1);
    __export(export_2);
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
define('framework/login/login',["require", "exports", "aurelia-framework", "../stack-router/export"], function (require, exports, aurelia_framework_1, export_1) {
    "use strict";
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
    __decorate([
        aurelia_framework_1.computedFrom("router.currentViewItem.controller.currentViewModel.title"),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], Login.prototype, "title", null);
    Login = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [export_1.RouterService])
    ], Login);
    exports.Login = Login;
});

define('framework/security/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
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

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('framework/dx/elements/dx-widget',["require", "exports", "aurelia-framework", "../services/dx-template-service", "../../base/export", "jquery"], function (require, exports, aurelia_framework_1, dx_template_service_1, export_1, $) {
    "use strict";
    var DxWidget = (function () {
        function DxWidget(element, templatingEngine, bindingEngine, deepObserver, dxTemplate) {
            this.element = element;
            this.templatingEngine = templatingEngine;
            this.bindingEngine = bindingEngine;
            this.deepObserver = deepObserver;
            this.dxTemplate = dxTemplate;
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
                            bindingContext: _this.bindingContext,
                            overrideContext: model
                        });
                        result.attached();
                        return $(newElement);
                    }
                };
                $(item).remove();
            });
            Object.assign(this.templates, this.dxTemplate.getTemplates(this.bindingContext));
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
            export_1.DeepObserverService,
            dx_template_service_1.DxTemplateService])
    ], DxWidget);
    exports.DxWidget = DxWidget;
});

define('framework/dx/services/export',["require", "exports", "./dx-template-service"], function (require, exports, dx_template_service_1) {
    "use strict";
    exports.DxTemplateService = dx_template_service_1.DxTemplateService;
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
define('framework/default-ui/views/header/header',["require", "exports", "aurelia-framework", "../../../stack-router/export", "../../../base/services/export"], function (require, exports, aurelia_framework_1, export_1, export_2) {
    "use strict";
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
    Header = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [export_1.RouterService,
            export_2.AuthorizationService])
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
define('framework/default-ui/views/loading/loading',["require", "exports", "aurelia-framework", "../../../base/services/rest-service"], function (require, exports, aurelia_framework_1, rest_service_1) {
    "use strict";
    var Loading = (function () {
        function Loading(rest) {
            this.rest = rest;
        }
        return Loading;
    }());
    Loading = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [rest_service_1.RestService])
    ], Loading);
    exports.Loading = Loading;
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
define('framework/default-ui/views/loading-spinner/loading-spinner',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
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
    LoadingSpinner = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [Element])
    ], LoadingSpinner);
    exports.LoadingSpinner = LoadingSpinner;
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
define('framework/default-ui/views/sidebar-sub/sidebar-sub',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var SidebarSub = (function () {
        function SidebarSub() {
        }
        return SidebarSub;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], SidebarSub.prototype, "route", void 0);
    SidebarSub = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [])
    ], SidebarSub);
    exports.SidebarSub = SidebarSub;
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
define('framework/base/attributes/icon/fa-icon-attribute',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var FaIconAttribute = (function () {
        function FaIconAttribute(element) {
            this.element = element;
        }
        FaIconAttribute.prototype.bind = function (bindingContext) {
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
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], FaIconAttribute.prototype, "icon", void 0);
    FaIconAttribute = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.customAttribute("fa-icon"),
        __metadata("design:paramtypes", [Element])
    ], FaIconAttribute);
    exports.FaIconAttribute = FaIconAttribute;
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
define('framework/base/attributes/translation/translation-attribute',["require", "exports", "aurelia-framework", "../../services/localization-service"], function (require, exports, aurelia_framework_1, localization_service_1) {
    "use strict";
    var TrCustomAttribute = (function () {
        function TrCustomAttribute(element, localization) {
            this.element = element;
            this.localization = localization;
        }
        TrCustomAttribute.prototype.bind = function (bindingContext) {
            this.expressionProvider = bindingContext.expressions;
            this.setInnerHtml();
        };
        TrCustomAttribute.prototype.keyChanged = function (newValue, oldValue) {
            this.setInnerHtml();
        };
        TrCustomAttribute.prototype.setInnerHtml = function () {
            var _this = this;
            this.localization.translate(this.expressionProvider, this.key, function (val) {
                _this.element.innerHTML = val;
            });
        };
        return TrCustomAttribute;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], TrCustomAttribute.prototype, "mode", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], TrCustomAttribute.prototype, "key", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Boolean)
    ], TrCustomAttribute.prototype, "markdown", void 0);
    TrCustomAttribute = __decorate([
        aurelia_framework_1.autoinject,
        aurelia_framework_1.customAttribute("tr"),
        __metadata("design:paramtypes", [Element,
            localization_service_1.LocalizationService])
    ], TrCustomAttribute);
    exports.TrCustomAttribute = TrCustomAttribute;
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
define('framework/login/views/login/login-form-funcs',["require", "exports", "aurelia-framework", "../../../base/export", "../../../stack-router/export"], function (require, exports, aurelia_framework_1, export_1, export_2) {
    "use strict";
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
            this.form.onFormReady.register(function (r) {
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
    LoginFuncs = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [export_1.AuthorizationService,
            export_2.HistoryService])
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
define('framework/login/views/login/login-form',["require", "exports", "../../../forms/form-export", "./login-form-funcs"], function (require, exports, fwx, login_form_funcs_1) {
    "use strict";
    var LoginForm = (function (_super) {
        __extends(LoginForm, _super);
        function LoginForm(formBaseImport, $f) {
            var _this = _super.call(this, formBaseImport) || this;
            _this.$f = $f;
            _this.id = "login-form";
            _this.title = "login-form.login-form_caption";
            _this.addModel({
                "id": "$m_login",
                "filters": []
            });
            _this.addFunction("$f", $f, "functions.$f");
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
                "id": "wd1",
                "options": {
                    "optionsName": "wd1Options",
                    "optionsNameFQ": "wd1Options"
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
    LoginForm = __decorate([
        fwx.autoinject,
        __metadata("design:paramtypes", [fwx.FormBaseImport, login_form_funcs_1.LoginFuncs])
    ], LoginForm);
    exports.LoginForm = LoginForm;
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
define('framework/security/views/authgroup/authgroup-edit-form',["require", "exports", "../../../forms/form-export"], function (require, exports, fwx) {
    "use strict";
    var AuthgroupEditForm = (function (_super) {
        __extends(AuthgroupEditForm, _super);
        function AuthgroupEditForm(formBaseImport) {
            var _this = _super.call(this, formBaseImport) || this;
            _this.id = "authgroup-edit";
            _this.title = "authgroup-edit.authgroup-edit_caption";
            _this.addModel({
                "id": "$m_A",
                "webApiAction": "base/Security/Authgroup",
                "key": "variables.data.$id",
                "keyProperty": "Id",
                "postOnSave": true,
                "filters": []
            });
            _this.widgetCreator.addTextBox(_this, {
                "caption": "authgroup-edit.name_caption",
                "binding": {
                    "dataContext": "$m_A",
                    "bindTo": "Name",
                    "bindToFQ": "models.data.$m_A.Name"
                },
                "validationRules": [],
                "id": "name",
                "options": {
                    "optionsName": "nameOptions",
                    "optionsNameFQ": "nameOptions"
                }
            });
            _this.widgetCreator.addSelectBox(_this, {
                "idSelect": "mandator",
                "caption": "authgroup-edit.mandator_caption",
                "binding": {
                    "dataContext": "$m_A",
                    "bindTo": "IdMandator",
                    "bindToFQ": "models.data.$m_A.IdMandator"
                },
                "validationRules": [],
                "id": "mandator",
                "options": {
                    "optionsName": "mandatorOptions",
                    "optionsNameFQ": "mandatorOptions"
                }
            }, {
                "selectItem": {
                    "id": "mandator",
                    "elementName": "select-box",
                    "valueMember": "Id",
                    "displayMember": "Name",
                    "action": "base/Security/Mandator",
                    "columns": ["Name", "Id"]
                }
            });
            _super.prototype.onConstructionFinished.call(_this);
            return _this;
        }
        return AuthgroupEditForm;
    }(fwx.FormBase));
    AuthgroupEditForm = __decorate([
        fwx.autoinject,
        __metadata("design:paramtypes", [fwx.FormBaseImport])
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
define('framework/security/views/authgroup/authgroup-list-form',["require", "exports", "../../../forms/form-export"], function (require, exports, fwx) {
    "use strict";
    var AuthgroupListForm = (function (_super) {
        __extends(AuthgroupListForm, _super);
        function AuthgroupListForm(formBaseImport) {
            var _this = _super.call(this, formBaseImport) || this;
            _this.id = "authgroup-list";
            _this.title = "authgroup-list.authgroup-list_caption";
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
    AuthgroupListForm = __decorate([
        fwx.autoinject,
        __metadata("design:paramtypes", [fwx.FormBaseImport])
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
            this.createToolbar = true;
        }
        StackRouter.prototype.created = function (owningView) {
            this.owningView = owningView;
        };
        StackRouter.prototype.bind = function (bindingContext, overrideContext) {
            this.bindingContext = bindingContext;
            this.overrideContext = overrideContext;
        };
        StackRouter.prototype.attached = function () {
            this.history.navigateCurrentOrInPipeline();
        };
        return StackRouter;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Boolean)
    ], StackRouter.prototype, "createToolbar", void 0);
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
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Boolean)
    ], View.prototype, "createToolbar", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], View.prototype, "view", void 0);
    __decorate([
        aurelia_framework_1.computedFrom("createToolbar"),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], View.prototype, "className", null);
    __decorate([
        aurelia_framework_1.computedFrom("view.controller.currentViewModel.toolbarOptions"),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], View.prototype, "toolbarOptions", null);
    View = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [Element,
            aurelia_framework_1.BindingEngine,
            aurelia_framework_1.TaskQueue])
    ], View);
    exports.View = View;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./framework/default-ui/views/container/container\"></require>\r\n  <container></container>\r\n</template>\r\n"; });
define('text!framework/login/login.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../stack-router/views/stack-router/stack-router\"></require>\r\n  <require from=\"../../framework/default-ui/views/loading/loading\"></require>\r\n  <require from=\"./login.css\"></require>\r\n\r\n  <loading></loading>\r\n  <div class=\"t--login-container\">\r\n    <div class=\"t--login-image\">\r\n      <div class=\"t--login-banner\" tr=\"key.bind: title\">\r\n      </div>\r\n    </div>  \r\n    <div class=\"t--login-data\">\r\n      <stack-router create-toolbar.bind=\"false\"></stack-router>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!framework/dx/elements/dx-widget.html', ['module'], function(module) { module.exports = "<template class=\"dx-widget\">\r\n</template>"; });
define('text!framework/login/login.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--login-container {\n  display: flex;\n  height: 100vh;\n  width: 100vw;\n}\n.t--login-image {\n  position: relative;\n  flex-grow: 1;\n  background-image: url('http://www.aesthetic-lounge.de/wp-content/uploads/2015/02/Mann-_nr_2.jpg');\n  background-position: center center;\n  background-size: cover;\n  border-right: 1px solid lightgray;\n}\n.t--login-banner {\n  position: absolute;\n  padding: 12px 36px;\n  bottom: 30vh;\n  font-size: 60px;\n  font-weight: 100;\n  color: white;\n  background-color: rgba(0, 0, 0, 0.3);\n}\n.t--login-data {\n  display: flex;\n  width: 350px;\n  align-items: center;\n  background-color: #f7f7f7;\n}\n.t--login-data .t--view-content {\n  display: flex;\n  margin-top: 4vh;\n  flex-direction: column;\n  justify-content: center;\n}\n.t--login-logo {\n  margin-bottom: 40px;\n  text-align: center;\n}\n.t--login-logo img {\n  max-width: 200px;\n}\n"; });
define('text!framework/forms/templates/toolbar-button-template.html',[],function () { return '<a class="t--view-toolbar-item" click.delegate="data.guardedExecute()">\r\n  <div if.bind="data.command.badgeText" class="t--view-toolbar-item-badge" tr="key.bind: data.command.badgeText">\r\n  </div>\r\n  <div class="t--view-toolbar-item-content">\r\n    <div if.bind="data.command.icon" class="t--view-toolbar-item-icon">\r\n      <i class="fa-fw" fa-icon="icon.bind: data.command.icon"></i>\r\n    </div>\r\n    <div if.bind="data.command.title" class="t--view-toolbar-item-title" tr="key.bind: data.command.title">\r\n    </div>\r\n  </div>\r\n</a>\r\n';});

define('text!framework/default-ui/views/container/container.html', ['module'], function(module) { module.exports = "<template class=\"t--container\" class.bind=\"className\">\r\n  <require from=\"./container.css\"></require>\r\n  \r\n  <require from=\"../loading/loading\"></require>\r\n  <require from=\"../sidebar/sidebar\"></require>\r\n  <require from=\"../header/header\"></require>\r\n  <require from=\"../content/content\"></require>\r\n\r\n  <loading></loading>\r\n  <sidebar></sidebar>\r\n  <header></header>\r\n  <content></content>\r\n</template>\r\n"; });
define('text!framework/default-ui/styles/styles.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--view-content {\n  opacity: 0;\n  transform: translateX(10px);\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: all;\n}\n.t--view-content.t--view-content-attached {\n  opacity: 1;\n  transform: translateX(0);\n}\n"; });
define('text!framework/default-ui/views/header/header.html', ['module'], function(module) { module.exports = "<template class=\"t--header\">\r\n  <require from=\"./header.css\"></require>\r\n\r\n  <div class=\"t--header-flex\">\r\n    <div class=\"t--header-title\" tr=\"key.bind: router.currentViewItem.title\">\r\n    </div>\r\n    <div class=\"t--header-options\">\r\n      <a href=\"#\" click.delegate=\"logout()\" tr=\"key: base.logout\"></a>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!framework/default-ui/views/content/content.html', ['module'], function(module) { module.exports = "<template class=\"t--content\">\r\n  <require from=\"./content.css\"></require>\r\n\r\n  <stack-router></stack-router>\r\n</template>\r\n"; });
define('text!framework/base/styles/styles.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: \"Helvetica Neue\", \"Segoe UI\", Helvetica, Verdana, sans-serif;\n  font-size: 12px;\n}\n.t--margin-top {\n  margin-top: 12px;\n}\n.t--editor-caption {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.t--cursor-pointer {\n  cursor: pointer;\n}\n.t--invisible-submit {\n  height: 0;\n  width: 0;\n  margin: 0;\n  padding: 0;\n  border: 0;\n}\n"; });
define('text!framework/default-ui/views/loading/loading.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../loading-spinner/loading-spinner\"></require>\r\n\r\n  <loading-spinner if.bind=\"rest.isLoading\"></loading-spinner>\r\n</template>"; });
define('text!framework/base/styles/variables.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n"; });
define('text!framework/default-ui/views/sidebar/sidebar.html', ['module'], function(module) { module.exports = "<template class=\"t--sidebar\">\r\n  <require from=\"../sidebar-sub/sidebar-sub\"></require>\r\n  <require from=\"./sidebar.css\"></require>\r\n\r\n  <div class=\"t--sidebar-header\" click.delegate=\"onHeaderClicked()\">\r\n    <div class=\"t--sidebar-header-title\">\r\n      Navigation\r\n    </div>\r\n    <div class=\"t--sidebar-header-icon\">\r\n      <i class=\"fa fa-${headerIcon}\"></i>\r\n    </div>\r\n  </div>\r\n\r\n  <ul>\r\n    <li\r\n      repeat.for=\"route of router.navigationRoutes\">\r\n      <sidebar-sub route.bind=\"route\" if.bind=\"route.sidebarExpanded\"></sidebar-sub>\r\n      <a \r\n        href.bind=\"route.route ? '#' + route.route : ''\" \r\n        class=\"t--sidebar-item\"\r\n        click.delegate=\"onRouteClicked(route)\"\r\n        stack-router-link=\"clear-stack.bind: true\">\r\n        <span class=\"t--sidebar-item-title\" tr=\"key.bind: route.caption\">\r\n        </span>\r\n        <span class=\"t--sidebar-item-icon\" if.bind=\"route.navigation.icon\">\r\n          <i class=\"fa fa-${route.navigation.icon}\"></i>\r\n        </span>\r\n      </a>\r\n    </li>\r\n  </ul>\r\n</template>\r\n"; });
define('text!framework/forms/styles/styles.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--form-element-flex-box {\n  display: flex;\n}\n.t--form-element-flex-box-with-padding > *:not(:first-child) {\n  margin-left: 12px;\n}\n.t--form-element-image-inline {\n  background-size: contain;\n  background-position: center center;\n  background-repeat: no-repeat;\n}\n.t--form-element-image {\n  max-width: 100%;\n}\n"; });
define('text!framework/default-ui/views/sidebar-sub/sidebar-sub.html', ['module'], function(module) { module.exports = "<template class=\"t--sidebar-sub au-animate\">\r\n  <ul>\r\n    <li repeat.for=\"child of route.children\">\r\n      <a \r\n        href.bind=\"child.route ? '#' + child.route : ''\" \r\n        class=\"t--sidebar-sub-item\"\r\n        stack-router-link=\"clear-stack.bind: true\">\r\n        <span class=\"t--sidebar-sub-item-title\" tr=\"key.bind: route.caption\">\r\n        </span>\r\n      </a>\r\n    </li>\r\n  </ul>\r\n</template>"; });
define('text!framework/default-ui/views/loading-spinner/loading-spinner.html', ['module'], function(module) { module.exports = "<template class=\"t--loading\">\r\n  <require from=\"./loading-spinner.css\"></require>\r\n  \r\n  <div class=\"t--loading-spinner\">\r\n    <div class=\"t--loading-rect1\"></div>\r\n    <div class=\"t--loading-rect2\"></div>\r\n    <div class=\"t--loading-rect3\"></div>\r\n    <div class=\"t--loading-rect4\"></div>\r\n    <div class=\"t--loading-rect5\"></div>\r\n  </div>\r\n</template>"; });
define('text!framework/default-ui/views/container/container.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--container {\n  display: block;\n  width: 100vw;\n  height: 100vh;\n}\n.t--container .dx-toolbar {\n  height: 60px;\n}\n.t--container .dx-toolbar .dx-toolbar-items-container {\n  height: 60px;\n}\n.t--toolbar-title {\n  min-width: 220px;\n  padding: 0 12px;\n  font-size: 20px;\n  font-weight: 100;\n  color: white;\n}\n"; });
define('text!framework/security/views/authgroup/authgroup-edit-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"t--margin-top col-xs-12\">\n        <div tr=\"key: authgroup-edit.info_text; markdown: true; mode: html\"></div>\n    </div>\n    <div class=\"t--margin-top col-xs-12 col-md-6\">\n        <div class=\"t--editor-caption\" tr=\"key: authgroup-edit.name_caption\"></div>\n        <dx-widget name=\"dxTextBox\" options.bind=\"nameOptions\" view-model.ref=\"name\"></dx-widget>\n    </div>\n    <div class=\"t--margin-top col-xs-12 col-md-6\">\n        <div class=\"t--editor-caption\" tr=\"key: authgroup-edit.mandator_caption\"></div>\n        <dx-widget name=\"dxSelectBox\" options.bind=\"mandatorOptions\" view-model.ref=\"mandator\"></dx-widget>\n    </div>\n</template>"; });
define('text!framework/security/views/authgroup/authgroup-list-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"t--margin-top col-xs-12\">\n        <dx-widget name=\"dxDataGrid\" options.bind=\"authgroupsOptions\" view-model.ref=\"authgroups\"></dx-widget>\n    </div>\n</template>"; });
define('text!framework/default-ui/views/header/header.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--header {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  margin-left: 280px;\n  padding: 0 12px;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: margin-left;\n}\n.t--sidebar-collapsed .t--header {\n  margin-left: 60px;\n}\n.t--header-flex {\n  display: flex;\n  width: 100%;\n}\n.t--header-title {\n  flex-grow: 1;\n}\n"; });
define('text!framework/login/views/login/login-form.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"t--margin-top col-xs-12 t--login-logo\">\n        <img class=\"t--form-element-image\" src=\"http://2014.erp-future.com/sites/2014.erp-future.com/files/1_business/Logo_U_TIP.png\"></img>\n    </div>\n    <form submit.delegate=\"submitForm('functions.$f.loginCommand')\">\n        <button class=\"t--invisible-submit\" type=\"submit\"></button>\n        <div class=\"col-xs-12\">\n            <div tr=\"key: login-form.enter_user_password_text; markdown: true; mode: html\"></div>\n        </div>\n        <div class=\"t--margin-top col-xs-12\">\n            <div class=\"t--editor-caption\" tr=\"key: login-form.username_caption\"></div>\n            <dx-widget name=\"dxTextBox\" options.bind=\"usernameOptions\" view-model.ref=\"username\"></dx-widget>\n        </div>\n        <div class=\"t--margin-top col-xs-12\">\n            <div class=\"t--editor-caption\" tr=\"key: login-form.password_caption\"></div>\n            <dx-widget name=\"dxTextBox\" options.bind=\"passwordOptions\" view-model.ref=\"password\"></dx-widget>\n        </div>\n        <div class=\"t--margin-top col-xs-12\">\n            <div class=\"t--editor-caption\">&nbsp;</div>\n            <dx-widget name=\"dxCheckBox\" options.bind=\"stayLoggodOnOptions\" view-model.ref=\"stayLoggodOn\"></dx-widget>\n        </div>\n        <div class=\"t--margin-top col-xs-12\">\n            <div class=\"t--editor-caption\">&nbsp;</div>\n            <dx-widget name=\"dxButton\" options.bind=\"wd1Options\"></dx-widget>\n        </div>\n    </form>\n</template>"; });
define('text!framework/default-ui/views/content/content.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--content {\n  display: block;\n  margin-left: 280px;\n  height: calc(100% - 60px);\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: margin-left;\n}\n.t--sidebar-collapsed .t--content {\n  margin-left: 60px;\n}\n.t--view-current {\n  display: block;\n}\n.t--view-history {\n  display: none;\n}\n.t--view-toolbar-item {\n  display: flex;\n  height: 60px;\n  padding: 0 12px;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  color: white;\n  text-decoration: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n}\n.t--view-toolbar-item i {\n  font-size: 16px;\n}\n.t--view-toolbar-item:hover {\n  background-color: #4F4F4F;\n}\n.dx-state-disabled .t--view-toolbar-item {\n  cursor: default;\n  color: lightgray;\n}\n.dx-state-disabled .t--view-toolbar-item:hover {\n  background-color: inherit;\n}\n"; });
define('text!framework/stack-router/views/stack-router/stack-router.html', ['module'], function(module) { module.exports = "<template class=\"t--stack-router\">\r\n  <require from=\"./stack-router.css\"></require>\r\n  <require from=\"../view/view\"></require>\r\n\r\n  <div \r\n    class=\"t--stack-router-item\" \r\n    class.bind=\"item.className\"\r\n    repeat.for=\"item of router.viewStack\">\r\n    <view view.bind=\"item\" create-toolbar.bind=\"$parent.createToolbar\"></view>\r\n  </div>\r\n</template>"; });
define('text!framework/stack-router/views/view/view.html', ['module'], function(module) { module.exports = "<template class=\"t--view\" class.bind=\"className\">\r\n  <require from=\"./view.css\"></require>\r\n\r\n  <div class=\"t--view-toolbar\" if.bind=\"createToolbar\">\r\n    <dx-widget if.bind=\"toolbarOptions\" name=\"dxToolbar\" options.bind=\"toolbarOptions\">\r\n      <dx-template name=\"itemTemplate\">\r\n        <a class=\"t--view-toolbar-item\" click.delegate=\"data.guardedExecute()\">\r\n          <div if.bind=\"data.command.badgeText\" class=\"t--view-toolbar-item-badge\" tr=\"key.bind: data.command.badgeText\">\r\n          </div>\r\n          <div class=\"t--view-toolbar-item-content\">\r\n            <div if.bind=\"data.command.icon\" class=\"t--view-toolbar-item-icon\">\r\n              <i class=\"fa fa-fw fa-${data.command.icon}\"></i>\r\n            </div>\r\n            <div if.bind=\"data.command.title\" class=\"t--view-toolbar-item-title\" tr=\"key.bind: data.command.title\">\r\n            </div>\r\n          </div>\r\n        </a>\r\n      </dx-template>\r\n    </dx-widget>\r\n  </div>\r\n  <div class=\"t--view-content-wrapper\">\r\n    <div class=\"container-fluid\">\r\n      <div class=\"row\">\r\n        <compose\r\n          view-model.ref=\"view.controller\" \r\n          view-model.bind=\"view.moduleId\" \r\n          model.bind=\"view.model\" \r\n          class=\"t--view-content\"></compose>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!framework/default-ui/views/sidebar/sidebar.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--sidebar {\n  display: block;\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  width: 280px;\n  background-color: #2a2e35;\n  font-size: 14px;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: left;\n}\n.t--sidebar ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.t--sidebar-collapsed .t--sidebar {\n  left: -220px;\n}\n.t--sidebar-header {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  background-color: #262930;\n  color: white;\n  cursor: pointer;\n}\n.t--sidebar-header-title {\n  flex-grow: 1;\n  font-size: 26px;\n  font-weight: 100;\n  padding: 12px;\n}\n.t--sidebar-header-icon {\n  display: flex;\n  width: 60px;\n  align-items: center;\n  justify-content: center;\n}\n.t--sidebar-item {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  color: lightgray;\n  text-decoration: none;\n}\n.t--sidebar-item:hover {\n  background-color: #17C4BB;\n  color: white;\n}\n.t--sidebar-item-title {\n  flex-grow: 1;\n  padding: 12px;\n}\n.t--sidebar-item-icon {\n  display: flex;\n  width: 60px;\n  align-items: center;\n  justify-content: center;\n}\n.t--sidebar-sub {\n  position: fixed;\n  z-index: -9;\n  left: 280px;\n  min-width: 280px;\n  background-color: #2a2e35;\n  padding: 12px;\n}\n.t--sidebar-sub.au-enter-active {\n  animation: leftFadeIn 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n}\n.t--sidebar-sub-item {\n  color: lightgray;\n  text-decoration: none;\n}\n.t--sidebar-sub-item:hover {\n  color: white;\n}\n"; });
define('text!framework/default-ui/views/loading-spinner/loading-spinner.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--loading {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  font-family: \"Helvetica Neue\", \"Segoe UI\", Helvetica, Verdana, sans-serif;\n  font-size: 60px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(255, 255, 255, 0.8);\n  z-index: 9999;\n  opacity: 0;\n  transition-delay: 500ms;\n  transition: all 0.3s cubic-bezier(0.62, 0.28, 0.23, 0.99);\n  transition-property: opacity;\n}\n.t--loading.t--loading-active {\n  opacity: 1;\n}\n.t--loading-spinner {\n  margin: 100px auto;\n  width: 50px;\n  height: 40px;\n  text-align: center;\n  font-size: 10px;\n}\n.t--loading-spinner > div {\n  background-color: #333;\n  height: 100%;\n  width: 6px;\n  display: inline-block;\n  -webkit-animation: animationLoadingSpinner 1.2s infinite ease-in-out;\n  animation: animationLoadingSpinner 1.2s infinite ease-in-out;\n}\n.t--loading-spinner > .t--loading-rect2 {\n  -webkit-animation-delay: -1.1s;\n  animation-delay: -1.1s;\n}\n.t--loading-spinner > .t--loading-rect3 {\n  -webkit-animation-delay: -1s;\n  animation-delay: -1s;\n}\n.t--loading-spinner > .t--loading-rect4 {\n  -webkit-animation-delay: -0.9s;\n  animation-delay: -0.9s;\n}\n.t--loading-spinner > .t--loading-rect5 {\n  -webkit-animation-delay: -0.8s;\n  animation-delay: -0.8s;\n}\n@-webkit-keyframes animationLoading {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes animationLoading {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes animationLoadingSpinner {\n  0%,\n  40%,\n  100% {\n    -webkit-transform: scaleY(0.4);\n  }\n  20% {\n    -webkit-transform: scaleY(1);\n  }\n}\n@keyframes animationLoadingSpinner {\n  0%,\n  40%,\n  100% {\n    transform: scaleY(0.4);\n    -webkit-transform: scaleY(0.4);\n  }\n  20% {\n    transform: scaleY(1);\n    -webkit-transform: scaleY(1);\n  }\n}\n"; });
define('text!framework/stack-router/views/stack-router/stack-router.css', ['module'], function(module) { module.exports = ".t--stack-router,\n.t--stack-router-item {\n  display: block;\n  height: 100%;\n}\n"; });
define('text!framework/stack-router/views/view/view.css', ['module'], function(module) { module.exports = "@keyframes leftFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n.t--view {\n  display: block;\n  position: relative;\n  height: 100%;\n  overflow-x: hidden;\n}\n.t--view-toolbar {\n  display: flex;\n  align-items: center;\n  height: 60px;\n  background-color: #808080;\n  color: white;\n}\n.t--view-toolbar .dx-toolbar {\n  background-color: transparent;\n}\n.t--view-toolbar-title {\n  font-size: 26px;\n  font-weight: 100;\n  color: white;\n  padding: 0 12px;\n}\n.t--view-content-wrapper {\n  display: block;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.t--view-content {\n  display: table;\n  width: 100%;\n  margin-bottom: 12px;\n  -webkit-overflow-scrolling: touch;\n}\n.t--view-with-toolbar .t--view-content-wrapper {\n  height: calc(100% - 60px);\n}\n"; });
//# sourceMappingURL=app-bundle.js.map