import * as chai from 'chai';
import * as mocha from 'mocha';
import { Facile, facile } from '../src';

const expect = chai.expect;
const should = chai.should;
const assert = chai.assert;

// Properties on Facile instance.
let instanceProps = [
	'logger', 'express', 'app', 'Boom',	'_pkg',	'_config',
	'_configs',	'_routers',	'_nextSocketId', '_sockets',
	'_services', '_middlewares', '_filters', '_models',
	'_controllers',	'_listeners',	'_beforeEvents', '_afterEvents'
];

// Pretty print array as strings.
function prettyPrintArray(arr: string[], title?: string, pad?: string) {
	let str = '';
	let ctr = 1;
	pad = pad || '      ';
	arr.forEach((s) => {
		if (ctr === 1)
			str += ('\n' + pad);
		if (ctr < 5)
			str += (s + ', ');
		ctr += 1;
		if (ctr === 5)
			ctr = 1;
	});
	str = str.substring(0, str.length - 2);
	return str;
}

// configure with defaults.
facile.configure({ auto: false });

// Describe Facile.
describe('Facile', () => {

	it('should be an instance of Facile', () => {
		assert.instanceOf(facile, Facile);
	});

	it('should have properties on instance.' + '\n' +
						prettyPrintArray(instanceProps), () => {

		instanceProps.forEach((p) => {
			assert.property(facile, p);
		});

	});

});
