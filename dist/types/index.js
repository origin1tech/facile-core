"use strict";
/**
 * Base Controller Class
 *
 * @export
 * @class Controller
 */
var Controller = (function () {
    /**
     * Creates an instance of Controller.
     *
     * @param {IFacile} api
     *
     * @memberOf Controller
     */
    function Controller(api) {
        this.api = api;
        return this;
    }
    return Controller;
}());
exports.Controller = Controller;
/**
 * Base Model Class
 *
 * @export
 * @class Model
 */
var Model = (function () {
    /**
     * Creates an instance of Model.
     *
     * @param {IFacile} api
     *
     * @memberOf Model
     */
    function Model(api) {
        this.api = api;
        return this;
    }
    return Model;
}());
exports.Model = Model;
/**
 * Base Service Class
 *
 * @export
 * @class Service
 */
var Service = (function () {
    /**
     * Creates an instance of Service.
     *
     * @param {IFacile} api
     *
     * @memberOf Service
     */
    function Service(api) {
        this.api = api;
        return this;
    }
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=index.js.map