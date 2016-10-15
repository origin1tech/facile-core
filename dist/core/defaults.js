"use strict";
var cons = require('consolidate');
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
    logLevel: 'info',
    host: '127.0.0.1',
    port: 8080,
    maxConnections: 128,
    views: {
        layout: 'index',
        engine: {
            name: 'ejs',
            renderer: cons.ejs
        },
        views: '/'
    },
    // Set to false to disable.
    routes: {
        controller: 'DefaultController',
        securityFilter: 'DefaultFilter.isAuthenticated',
        // When defined rest routes created.
        rest: {
            find: 'get /api/{model}',
            findOne: 'get /api/{model}/:id',
            create: 'post /api/{model}',
            update: 'put /api/{model}/:id',
            destroy: 'del /api/{model}/:id'
        }
    }
};
//# sourceMappingURL=defaults.js.map