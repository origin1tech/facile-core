
import * as cmdr from 'commander';
import { IFacile } from '../interfaces';

/**
 * Parses Command Arguments.
 *
 * @export
 * @returns {IFacile}
 */
export function parse(): IFacile {

	let ver = this._pkg.version;

	return this;

}