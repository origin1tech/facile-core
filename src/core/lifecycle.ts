import { IFacile, ILifecycle } from '../interfaces';
import { EventEmitter } from 'events';

export class Lifecycle extends EventEmitter implements ILifecycle {

	_events: string[] = [];
	_before: any;
	_after: any;

	constructor() {

		super();

		this._events = [
			'init',
			'init:server',
			'init:services',
			'init:filters',
			'init:models',
			'init:controllers',
			'init:routes',
			'init:done'
		];

	}

	before(name: string, event: Function) {

		let key = this._before[name] = this._before[name] || {};
		let arr = key['before'] = key['before'] || [];

		arr.push(function(cb) {
			event(cb);
		});

	}

	after(name: string, event: Function) {

		let key = this._after[name] = this._after[name] || {};
		let arr = key['after'] = key['after'] || [];

	}

}