#!/usr/bin/env node
'use strict';
const index = require('serverless-http');
const app = require('../app');
const auth = require('./λAuth');

module.exports = {
    app: index(app, {binary: ['image/webp']}),
    auth: auth,
}
