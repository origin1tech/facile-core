
/**
 * Components Collection
 * @desc stores collection of components.
 *
 * @export
 * @class Components
 * @template T
 */
export class Collection<T>  {

	/**
	 * _components
	 *
	 * @desc contains map of components.
	 * @member _components;
	 * @private
	 * @type {{ [name: string]: T }}
	 * @methodOf Components
	 */
	private _components: { [name: string]: T } = {};

	/**
	 * _name
	 *
	 * @desc stores the collection name.
	 * @member _name;
	 * @private
	 * @type {string}
	 * @memberOf Components
	 */
	private _name: string;

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
	private _get(name: string): any {
		return this._components[name];
	}

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
	private _activate(Type: { new (): T }, args?: any[]): T {
		function F(): void {
			Type.apply(this, args);
		}
		F.prototype = Type.prototype;
		return new F();

	}

	/**
	 * Creates an instance of Components.
	 *
	 * @param {string} name
	 * @constructor
	 * @memberOf Components
	 */
	constructor(name: string) {
		this._name = name;
	}

	/**
	 * name
	 *
	 * @desc returns the name of the collection.
	 * @method name
	 * @returns {string}
	 * @memberOf Components
	 */
	name(): string {
		return this._name;
	}

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
	get<T>(name: string): T {
		let component: T = this._get(name);
		return component;
	}

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
	add(name: string, component: T) {
		this._components[name] = component;
		return this;
	}

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
	init(name: string, ...args: any[]): T {
		let component = this._activate(this._get(name), args);
		this._components[name] = component;
		return component;
	}

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
	remove(name: string) {
		delete this._components[name];
		return this;
	}

}
