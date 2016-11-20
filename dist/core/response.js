"use strict";
var Boom = require('boom');
var lodash_1 = require('lodash');
var http = require('http');
var res = http.OutgoingMessage.prototype;
function extend(facile) {
    // Return if extending with boom is disabled.
    if (facile._config.boom === false)
        return;
    // Expose common Boom events to framework.
    facile._errors = Boom;
    // Iterate adding error events.
    res.errors = {};
    lodash_1.each(facile._errors, function (v, k) {
        if (!lodash_1.isFunction(v))
            return;
        // Only extend response with predefined
        // errors. use facile._errors.wrap
        // or from controller this.errors.wrap
        // when wrapping or creating an error.
        if (!lodash_1.includes(['wrap', 'create'], k)) {
            res.errors[k] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var boom = facile._errors[k].apply(Boom, args);
                return res.status(boom.output.statusCode).send(boom.output.payload);
            };
        }
    });
}
exports.extend = extend;
// return function(req: IRequest, res: IResponse, next: INextFunction ) {
// }; 
//# sourceMappingURL=response.js.map