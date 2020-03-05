#!/usr/bin/env node
'use strict';
const params = require('./src/params');
const proxy = require('./src/proxy');
// Use basic auth middleware if we have credentials on hand
const LOGIN = process.env.LOGIN;
const PASSWORD = process.env.PASSWORD;
let app;
if (LOGIN && PASSWORD) {
    const basicAuth = require('./src/basicAuth');

    app = (req, res) => {
        basicAuth({
            users: {[LOGIN]: PASSWORD},
            challenge: true,
            realm: 'Bandwidth-Hero Compression Service'
        })(req, res, () => (params(req, res, proxy)))
    };

} else {
    app = (req, res) => {
        params(req, res, proxy);
    };
}
//app.enable('trust proxy');
//app.get('/', params, proxy);
//app.get('/favicon.ico', (req, res) => res.status(204).end());

module.exports = app;
