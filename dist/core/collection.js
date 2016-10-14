"use strict";
/**
 * Collection
 * @desc stores collection of components.
 *
 * @export
 * @class Collection
 * @template T
 */
var Collection = (function () {
    /**
     * Creates an instance of Components.
     *
     * @param {string} name
     * @constructor
     * @memberOf Collection
     */
    function Collection(name) {
        /**
         * _components
         *
         * @desc contains map of components.
         * @member _components;
         * @private
         * @type {ICollectionMap<T>}
         * @memberOf Collection
         */
        this._components = {};
        this._name = name;
    }
    /**
     * _get
     *
     * @method _get
     * @desc gets a component anonymously.
     * @private
     * @param {string} name
     * @returns {*}
     *
     * @memberOf Collection
     */
    Collection.prototype._get = function (name) {
        return this._components[name];
    };
    /**
     * activate
     *
     * @desc activates a class as instance.
     * @method activate
     * @private
     * @param {ICollectionType<T>} Type
     * @param {any[]} [args]
     * @returns {T}
     *
     * @memberOf Collection
     */
    Collection.prototype._activate = function (Type, args) {
        function F() {
            Type.apply(this, args);
        }
        F.prototype = Type.prototype;
        return new F();
    };
    /**
     * name
     *
     * @desc returns the name of the collection.
     * @method name
     * @returns {string}
     * @memberOf Collection
     */
    Collection.prototype.name = function () {
        return this._name;
    };
    /**
     * get<T>
     *
     * @desc gets a component by type.
     * @method get<T>
     * @template T
     * @param {string} name
     * @returns {T}
     *
     * @memberOf Collection
     */
    Collection.prototype.get = function (name) {
        var component = this._get(name);
        return component;
    };
    /**
     * getAll
     *
     * @desc gets all components.
     * @method getAll
     * @returns {}
     * @memberOf Collection
     */
    Collection.prototype.getAll = function () {
        return this._components;
    };
    /**
     * add
     *
     * @desc adds a component to the collection
     * @method add
     * @param {string} name
     * @param {T} item
     * @returns {Collection}
     *
     * @memberOf Collection
     */
    Collection.prototype.add = function (name, component) {
        this._components[name] = component;
        return this;
    };
    /**
     * initialize
     *
     * @desc initializes component instance.
     * @method initialize
     * @param {string} name
     * @param {...any[]} args
     * @returns {*}
     *
     * @memberOf Collection
     */
    Collection.prototype.init = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var component = this._activate(this._get(name), args);
        this._components[name] = component;
        return component;
    };
    /**
     * remove
     *
     * @desc removes a component from the collection.
     * @method remove
     * @param {string} name
     * @returns {Collection}
     *
     * @memberOf Collection
     */
    Collection.prototype.remove = function (name) {
        delete this._components[name];
        return this;
    };
    return Collection;
}());
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map