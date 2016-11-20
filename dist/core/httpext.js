"use strict";
var Boom = require('boom');
var lodash_1 = require('lodash');
var http = require('http');
var res = http.OutgoingMessage.prototype;
function response(facile) {
    // Return if extending with boom is disabled.
    if (facile._config.boom === false)
        return;
    // Expose common Boom events to framework.
    facile._errors = Boom;
    return function (req, res, next) {
        res.errors = res.errors || {};
        lodash_1.each(facile._errors, function (v, k) {
            if (lodash_1.isFunction(v)) {
                res.errors[k] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    if (k !== 'create' || k !== 'wrap') {
                        var boom = facile._errors[k].apply(Boom, args);
                        return res.status(boom.output.statusCode).send(boom.output.payload);
                    }
                };
            }
        });
        next();
    };
}
exports.response = response;
//# sourceMappingURL=httpext.js.map