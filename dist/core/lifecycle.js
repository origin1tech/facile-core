"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var Lifecycle = (function (_super) {
    __extends(Lifecycle, _super);
    function Lifecycle() {
        _super.call(this);
        this._events = [];
        this._events = [
            'init',
            'init:server',
            'init:services',
            'init:filters',
            'init:models',
            'init:controllers',
            'init:routes',
            'init:done'
        ];
    }
    Lifecycle.prototype.before = function (name, event) {
        var key = this._before[name] = this._before[name] || {};
        var arr = key['before'] = key['before'] || [];
        arr.push(function (cb) {
            event(cb);
        });
    };
    Lifecycle.prototype.after = function (name, event) {
        var key = this._after[name] = this._after[name] || {};
        var arr = key['after'] = key['after'] || [];
    };
    return Lifecycle;
}(events_1.EventEmitter));
exports.Lifecycle = Lifecycle;
//# sourceMappingURL=lifecycle.js.map