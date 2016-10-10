/// <reference types="node" />
import { IEvents } from '../interfaces';
import { EventEmitter } from 'events';
export declare class Events extends EventEmitter implements IEvents {
    _events: string[];
    _before: any;
    _after: any;
    constructor();
    before(name: string, event: Function): void;
    after(name: string, event: Function): void;
}
