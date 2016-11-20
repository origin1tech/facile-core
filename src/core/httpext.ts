
import { Facile } from './';
import * as Boom from 'boom';
import { each, includes, isFunction } from 'lodash';
import { IRequest, IResponse, INextFunction } from '../interfaces';

let http = require('http');
let res = http.OutgoingMessage.prototype;

export function response(facile: Facile) {

	// Return if extending with boom is disabled.
	if (facile._config.boom === false)
		return;

	// Expose common Boom events to framework.
	facile._errors = Boom;

	return function(req: IRequest, res: IResponse, next: INextFunction ) {

		res.errors = res.errors || {};

		each(facile._errors, (v, k) => {

			if (isFunction(v)) {

				res.errors[k] = (...args: any[]) => {

					if (k !== 'create' || k !== 'wrap') {

						let boom = facile._errors[k].apply(Boom, args);
						return res.status(boom.output.statusCode).send(boom.output.payload);

					}

				};

			}

		});

		next();

	};

}


