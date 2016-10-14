/**
 * PLACEHOLDER
 * This is a placeholder for
 * custom router.
 */
"use strict";
var express_1 = require('express');
var util_1 = require('util');
var Router = (function () {
    function Router() {
        return express_1.Router.call(this, arguments);
    }
    Router.prototype.other = function () {
    };
    return Router;
}());
util_1.inherits(Router, express_1.Router);
var rtr = new Router();
//# sourceMappingURL=router.js.map