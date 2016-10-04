import { IFlags } from './interfaces';

/**
 * Parses value using try catch.
 *
 * @param {*} val
 * @param {*} Type
 * @returns {*}
 */
function tryParseAs(val: any, Type: any): any {
	try {
		if (Type === 'json')
			return JSON.parse(val);
		if (Type === 'number')
			return parseFloat(val);
		return new Type(val);
	} catch (e) {
		return false;
	}
}

/**
 * Command argument parsers by type.
 */
let parsers = {

	// Attempts to parse Date.
	date: function (val: any): Date | boolean {
		let d = tryParseAs(val, Date),
				n = tryParseAs(val, 'number');
		if (typeof n === 'number' && val.length < 9)
			return false;
		if (d !== 'Invalid Date' && !isNaN(d))
			return d;
		return false;
	},

	// Attempts to parse Number.
	number: function (val: any): boolean | number {
		let n = tryParseAs(val, 'number');
		if (isNaN(n))
			return false;
		return n;
	},

	// Check if is true or false.
	boolean: function (val: any): boolean {
		let likeBool = /^(true|false)$/.test(val);
		if (!likeBool)
			return false;
		return val == 'true';
	},

	// Tests for JSON like string.
	json: function (val: any): Object | boolean {
		if (/^{/.test(val))
			return tryParseAs(val, 'json');
		return false;
	},

	// Tests for RegExp like string.
	regexp: function (val: any): RegExp | boolean {
		if (/^\/.+\/(g|i|m)?([m,i]{1,2})?/.test(val))
			return tryParseAs(val, RegExp);
		return false;
	},

	// Tests for key/value type string.
	// example: 'key:value+key2:value2'
	keyValue: function (val: any): Object | boolean {
		let match, exp, tmp,
				obj, split;
		obj = {};
		exp = /[a-zA-Z0-9]+:[a-zA-Z0-9]+/g;
		match = val.match(exp);
		if (!match || !match.length)
			return false;
		while ((tmp = exp.exec(val)) !== null) {
			split = tmp[0].split(':');
			// Ensure the value is cast.
			obj[split[0]] = cast(split[1]);
		}
		return obj;
	}

};

/**
 * Casts a value to JavaScript type.
 *
 * @param {*} val
 * @returns {*}
 */
function cast(val: any): any {

	let keys = Object.keys(parsers),
			parsed,
			key,
			result;

	// If known type immediately return.
	if (typeof val === 'number' ||
			typeof val === 'boolean' ||
			typeof val === 'date' ||
			(val instanceof RegExp) ||
			(typeof val === 'object' && val !== null)) {
				return val;
			}

	// If a string trim.
	if (typeof val === 'string')
		val = val.trim();

	// Iterate until some returns truthy value.
	while (!result && keys.length) {
		key = keys.shift();
		result = parsers[key](val);
	}

	// If result is still false set to original value.
	result = result || val;

	return result;

};

/**
 * Parse command line arguments as flags.
 *
 * @export
 * @param {any[]} [argv]
 * @param {boolean} [splice]
 * @returns
 */
export function parseFlags(argv?: any[], splice?: boolean) {

	// Get argv
	argv = argv || process.argv;

	// Check if should splice first two args
	// which are likely the node paths.
	if (splice || splice === undefined)
		argv = argv.splice(2);

	// Define object to contain map of
	// configuration flags.
	let obj: IFlags = {};

	argv.forEach((arg: any, i: number) => {

		// If arg starts with a
		// "-" or "--" then parse
		// as a flag.
		if (/^(--|-)/.test(arg)) {

			// Strip prefix.
			arg = arg.replace(/^(--|-)/, '');

			// Get value of next arg.
			let val = argv[i + 1];

			// If val is undefined set to true.
			if (undefined === val)
				val = true;

			// Parse the value.
			val = cast(val);

			// Set the argument value.
			obj[arg] = val;

		}

	});

	return obj;

}

/**
 * Iterate keys in flags mapping
 * for full property name.
 *
 * @export
 * @param {*} map
 * @param {IFlags} flags
 * @returns
 */
export function mapFlags(map: any, flags: IFlags) {

	// Get map keys.
	let keys = Object.keys(map);

	// Iterate keys check if key
	// from map exists if true replace
	// with full map name.
	keys.forEach((k) => {

		if (flags[k]) {
			flags[map[k]] = flags[k];
			delete flags[k];
		}

	});

	return flags;

}

/**
 * Function for non operation.
 *
 * @export
 */
export function noop () {}

