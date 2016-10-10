"use strict";
var cons = require('consolidate');
var path_1 = require('path');
exports.packages = {
    pkg: require('../../package.json'),
    appPkg: require(path_1.join(process.cwd(), 'package.json'))
};
exports.config = {
    cwd: process.cwd(),
    pkg: exports.packages.appPkg,
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
        // 'view engine': 'ejs',
        views: '/'
    },
    auto: undefined
};
//# sourceMappingURL=defaults.js.map