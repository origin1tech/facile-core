"use strict";
var path_1 = require('path');
exports.packages = {
    pkg: require('../../package.json'),
    apppkg: require(path_1.join(process.cwd(), 'package.json'))
};
exports.config = {
    auto: undefined,
    cwd: process.cwd(),
    pkg: exports.packages.apppkg,
    env: 'development',
    logLevel: 'debug',
    host: '127.0.0.1',
    port: 8080,
    maxConnections: 128,
    views: {
        layout: 'index',
        engine: 'ejs',
        // extension: 'html' // defaults to engine.
        views: '/'
    },
    routes: {
        handlers: {
            index: 'DefaultController.index',
            view: 'DefaultController.view',
            redirect: 'DefaultController.redirect',
            security: 'DefaultFilter.isAuthenticated'
        },
        rest: {
            controller: 'DefaultController',
            actions: {
                find: 'get /api/{model}',
                findOne: 'get /api/{model}/:id',
                create: 'post /api/{model}',
                update: 'put /api/{model}/:id',
                destroy: 'del /api/{model}/:id'
            }
        },
        crud: {
            controller: 'DefaultController',
            actions: {
                find: 'get /{model}/show',
                findOne: 'get /{model}/show/:id',
                create: 'post /{model}/create',
                update: 'post /{model}/update/:id',
                destroy: 'post /{model}/destroy/:id'
            }
        },
        sort: undefined
    }
};
//# sourceMappingURL=defaults.js.map