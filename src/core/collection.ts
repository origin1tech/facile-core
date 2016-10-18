import { clone } from 'lodash';

interface ICollectionMap<T> {
	[name: string]: T;
}

interface ICollectionType<T> {
	new(): T;
}

/**
 * Collection
 * @desc stores collection of components.
 *
 * @export
 * @class Collection
 * @template T
 */
export class Collection<T>  {

	/**
	 * _components
	 *
	 * @desc contains map of components.
	 * @member _components;
	 * @private
	 * @type {ICollectionMap<T>}
	 * @memberOf Collection
	 */
	private _components: ICollectionMap<T> = {};

	/**
	 * _name
	 *
	 * @desc stores the collection name.
	 * @member _name;
	 * @private
	 * @type {string}
	 * @memberOf Collection
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
	 * @memberOf Collection
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
	 * @param {ICollectionType<T>} Type
	 * @param {any[]} [args]
	 * @returns {T}
	 *
	 * @memberOf Collection
	 */
	private _activate(Type: ICollectionType<T>, args?: any[]): any {
		let comp: any = Object.create(Type.prototype);
		Type.apply(comp, args);
		return comp;
	}

	/**
	 * Creates an instance of Components.
	 *
	 * @param {string} name
	 * @constructor
	 * @memberOf Collection
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
	 * @memberOf Collection
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
	 * @memberOf Collection
	 */
	get<T>(name: string): T {
		let component: T = this._get(name);
		return component;
	}

	/**
	 * getAll
	 *
	 * @desc gets all components.
	 * @method getAll
	 * @returns {}
	 * @memberOf Collection
	 */
	getAll(): {} {
		return this._components;
	}

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
	 * @memberOf Collection
	 */
	init(name: string, ...args: any[]): T {
		let comp = this._components[name] = this._activate(this._get(name), args);
		if (comp.init)
			comp.init();
		return this._components[name];
	}

	/**
	 * initAll
	 *
	 * @method initAll
	 * @param {...any[]} args
	 * @returns
	 *
	 * @memberOf Collection
	 */
	initAll(...args: any[]) {
		let keys = Object.keys(this._components);
		keys.forEach((key) => {
			let _args = clone(args);
			_args.unshift(key);
			this.init.apply(this, _args);
		});
		return this;
	}

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
	remove(name: string) {
		delete this._components[name];
		return this;
	}

}
