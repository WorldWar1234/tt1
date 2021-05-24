#!/usr/bin/env node
'use strict';
const paramsHeaders = require('./src/params.headers');
const paramsQuery = require('./src/params.query');
const paramsRewrite = require('./src/params.rewrite');
const proxy = require('./src/proxy');
const app = require('express')();
const LOGIN = process.env.LOGIN;
const PASSWORD = process.env.PASSWORD;
app.enable('trust proxy');
// Use basic auth middleware if we have credentials on hand
if (LOGIN && PASSWORD) {
    const basicAuth = require('express-basic-auth');
    app.use(basicAuth({
        users: { [LOGIN]: PASSWORD },
        challenge: true,
        realm: 'Bandwidth-Hero Compression Service'
    }));
}
// paramsQuery should have it's own route so that we can setup a session with the specified parameters.
app.get('/*', paramsQuery, paramsRewrite, proxy);
app.get('/favicon.ico', (req, res) => res.status(204).end());

module.exports = app;
