#!/usr/bin/env node
'use strict';
const serverless = require('serverless-http');
const app = require('./app.js');
const auth = require('./src/λAuth');

module.exports = {
    app: serverless(app),
    auth: auth,
}
