"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CustomAgGridComponent = void 0;
var core_1 = require("@angular/core");
var functions_1 = require("@app/helpers/functions");
var setting_button_1 = require("./setting-button");
var CustomAgGridComponent = /** @class */ (function () {
    function CustomAgGridComponent(cdr) {
        this.cdr = cdr;
        this.agGridSizeControl = {
            selectedType: 'sizeToFit'
        };
        this.agColumnDefs = [];
        this._details = [];
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                resizable: true
            },
            rowHeight: 38,
            rowSelection: 'multiple',
            suppressRowClickSelection: true,
            suppressCellSelection: true,
            suppressPaginationPanel: true
        };
        this._columns = [];
        this.rowClick = new core_1.EventEmitter();
        this.frameworkComponents = {
            settings: setting_button_1.SettingButtonComponent
        };
    }
    Object.defineProperty(CustomAgGridComponent.prototype, "details", {
        get: function () {
            return this._details;
        },
        set: function (val) {
            this._details = functions_1.cloneObject(val);
            this.re_new();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomAgGridComponent.prototype, "columns", {
        get: function () {
            return this._columns;
        },
        set: function (val) {
            var _this = this;
            if (!val) {
                return;
            }
            var isDetailsReady = function () {
                var _a;
                if ((_a = _this.details) === null || _a === void 0 ? void 0 : _a.length) {
                    var firstItemOfDetails = _this.details[0];
                    _this._columns = Object.entries(firstItemOfDetails)
                        .filter(function (_a) {
                        var key = _a[0], value = _a[1];
                        return typeof value !== 'object' || value instanceof Array;
                    })
                        .map(function (_a) {
                        var key = _a[0];
                        var aliasFromKey = {
                            'srcAlias_srcPort': 'SRC IP with Port',
                            'dstAlias_dstPort': 'DST IP with Port',
                            'diff': 'Delta',
                            'id': 'ID',
                            'create_date': 'Date',
                            'timeSeconds': 'Timestamp',
                            'ip_tos': 'IP TOS',
                            'Msg_Size': 'Msg. Size'
                        };
                        // console.log({ key, al: aliasFromKey[key] });
                        if (aliasFromKey[key]) {
                            return { field: key, headerName: aliasFromKey[key], hide: !val.includes(key) };
                        }
                        else {
                            return { field: key, hide: !val.includes(key) };
                        }
                    });
                    _this._columns.push({
                        field: '',
                        headerName: '',
                        headerComponent: 'settings',
                        hide: false,
                        pinned: 'left',
                        lockPinned: true,
                        resizable: false,
                        minWidth: 40,
                        maxWidth: 40
                    });
                    _this.re_new();
                }
                else {
                    setTimeout(function () {
                        isDetailsReady();
                    });
                }
            };
            isDetailsReady();
        },
        enumerable: false,
        configurable: true
    });
    CustomAgGridComponent.prototype.onDblClick = function () {
        var _this = this;
        requestAnimationFrame(function () {
            var _a;
            (_a = _this.gridApi) === null || _a === void 0 ? void 0 : _a.sizeColumnsToFit();
        });
    };
    // @HostListener('window:resize')
    CustomAgGridComponent.prototype.onResize = function () {
        var _this = this;
        if (!this.gridApi || this.agGridSizeControl.selectedType !== 'sizeToFit') {
            return;
        }
        requestAnimationFrame(function () {
            var _a;
            if (_this.agGridSizeControl.selectedType === 'sizeToFit') {
                (_a = _this.gridApi) === null || _a === void 0 ? void 0 : _a.sizeColumnsToFit();
            }
        });
    };
    CustomAgGridComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
    };
    CustomAgGridComponent.prototype.ngOnInit = function () {
        this.re_new();
    };
    CustomAgGridComponent.prototype.re_new = function () {
        this.sizeToFit();
        this.cdr.detectChanges();
    };
    CustomAgGridComponent.prototype.sizeToFit = function () {
        var _this = this;
        setTimeout(function () {
            var _a;
            (_a = _this.gridOptions.api) === null || _a === void 0 ? void 0 : _a.sizeColumnsToFit();
            _this.cdr.detectChanges();
        }, 100);
    };
    CustomAgGridComponent.prototype.getRowStyle = function (params) {
        var _style = {
            'border-bottom': '1px solid rgba(0,0,0,0.1)',
            'cursor': 'pointer'
        };
        if (params.node.rowIndex % 2 === 0) {
            _style.background = '#e4f0ec';
        }
        return _style;
    };
    CustomAgGridComponent.prototype.sortChanged = function (event) {
        this.cdr.detectChanges();
    };
    CustomAgGridComponent.prototype.cellClicked = function (event) {
        this.rowClick.emit(event);
    };
    CustomAgGridComponent.prototype.doOpenFilter = function () {
    };
    __decorate([
        core_1.Input()
    ], CustomAgGridComponent.prototype, "details");
    __decorate([
        core_1.Input()
    ], CustomAgGridComponent.prototype, "columns");
    __decorate([
        core_1.Output()
    ], CustomAgGridComponent.prototype, "rowClick");
    __decorate([
        core_1.HostListener('dblclick')
    ], CustomAgGridComponent.prototype, "onDblClick");
    CustomAgGridComponent = __decorate([
        core_1.Component({
            selector: 'custom-ag-grid',
            templateUrl: './custom-ag-grid.component.html',
            styleUrls: ['./custom-ag-grid.component.scss']
        })
    ], CustomAgGridComponent);
    return CustomAgGridComponent;
}());
exports.CustomAgGridComponent = CustomAgGridComponent;
