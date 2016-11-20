import { Facile } from './';
import { IRequest, IResponse, INextFunction } from '../interfaces';
export declare function response(facile: Facile): (req: IRequest, res: IResponse, next: INextFunction) => void;
