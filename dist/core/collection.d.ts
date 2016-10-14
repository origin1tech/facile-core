/**
 * Collection
 * @desc stores collection of components.
 *
 * @export
 * @class Collection
 * @template T
 */
export declare class Collection<T> {
    /**
     * _components
     *
     * @desc contains map of components.
     * @member _components;
     * @private
     * @type {ICollectionMap<T>}
     * @memberOf Collection
     */
    private _components;
    /**
     * _name
     *
     * @desc stores the collection name.
     * @member _name;
     * @private
     * @type {string}
     * @memberOf Collection
     */
    private _name;
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
    private _get(name);
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
    private _activate(Type, args?);
    /**
     * Creates an instance of Components.
     *
     * @param {string} name
     * @constructor
     * @memberOf Collection
     */
    constructor(name: string);
    /**
     * name
     *
     * @desc returns the name of the collection.
     * @method name
     * @returns {string}
     * @memberOf Collection
     */
    name(): string;
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
    get<T>(name: string): T;
    /**
     * getAll
     *
     * @desc gets all components.
     * @method getAll
     * @returns {}
     * @memberOf Collection
     */
    getAll(): {};
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
    add(name: string, component: T): this;
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
    init(name: string, ...args: any[]): T;
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
    remove(name: string): this;
}
