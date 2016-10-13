/**
 * Components Collection
 * @desc stores collection of components.
 *
 * @export
 * @class Components
 * @template T
 */
export declare class Collection<T> {
    /**
     * _components
     *
     * @desc contains map of components.
     * @member _components;
     * @private
     * @type {{ [name: string]: T }}
     * @methodOf Components
     */
    private _components;
    /**
     * _name
     *
     * @desc stores the collection name.
     * @member _name;
     * @private
     * @type {string}
     * @memberOf Components
     */
    private _name;
    /**
     * Creates an instance of Components.
     *
     * @param {string} name
     * @constructor
     * @memberOf Components
     */
    constructor(name: string);
    /**
     * _get
     *
     * @method _get
     * @desc gets a component anonymously.
     * @private
     * @param {string} name
     * @returns {*}
     *
     * @methodOf Components
     */
    private _get(name);
    /**
     * activate
     *
     * @desc activates a class as instance.
     * @method activate
     * @private
     * @param {{ new (): T }} Type
     * @param {any[]} [args]
     * @returns {T}
     *
     * @methodOf Components
     */
    private _activate(Type, args?);
    /**
     * name
     *
     * @desc returns the name of the collection.
     * @method name
     * @returns {string}
     * @memberOf Components
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
     * @methodOf Components
     */
    get<T>(name: string): T;
    /**
     * add
     *
     * @desc adds a component to the collection
     * @method add
     * @param {string} name
     * @param {T} item
     * @returns
     *
     * @methodOf Components
     */
    add(name: string, item: T): this;
    /**
     * initialize
     *
     * @desc initializes component instance.
     * @method initialize
     * @param {string} name
     * @param {...any[]} args
     * @returns {*}
     *
     * @methodOf Components
     */
    init(name: string, ...args: any[]): T;
    /**
     * remove
     *
     * @desc removes a component from the collection.
     * @method remove
     * @param {string} name
     * @returns
     *
     * @methodOf Components
     */
    remove(name: string): this;
}
