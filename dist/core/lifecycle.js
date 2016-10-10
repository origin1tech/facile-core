"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var Events = (function (_super) {
    __extends(Events, _super);
    function Events() {
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
    Events.prototype.before = function (name, event) {
        var key = this._before[name] = this._before[name] || {};
        var arr = key['before'] = key['before'] || [];
        arr.push(function (cb) {
            event(cb);
        });
    };
    Events.prototype.after = function (name, event) {
        var key = this._after[name] = this._after[name] || {};
        var arr = key['after'] = key['after'] || [];
    };
    return Events;
}(events_1.EventEmitter));
exports.Events = Events;
//# sourceMappingURL=lifecycle.js.map