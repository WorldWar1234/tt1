#!/usr/bin/env node
'use strict';
const app = require('express')();
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const proxy = require('./src/proxy');
app.enable('trust proxy');
app.get('/', authenticate, params, proxy);
app.get('/favicon.ico', (req, res) => res.status(204).end());

module.exports = app;
