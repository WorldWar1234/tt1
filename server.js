#!/usr/bin/env node
'use strict'
const app = require('express')()
const authenticate = require('./src/authenticate')
const params = require('./src/params')
const proxy = require('./src/proxy')
const spdy = require('spdy')
const fs = require('fs')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork()
  });
} else {
const PORT = process.env.PORT || 8080
const options = {

  // **optional** SPDY-specific options
  spdy: {
    protocols: [ 'h2', 'spdy/3.1', 'http/1.1' ],
    // ssl doesn't make sense when we have ssl termination.
    // key: fs.readFileSync(__dirname + '/keys/spdy-key.pem'),
    // Fullchain file or cert file (prefer the former)
    // cert: fs.readFileSync(__dirname + '/keys/spdy-fullchain.pem'),
    ssl: false,
    plain: true,

    connection: {
      windowSize: 1024 * 1024, // Server's window size
      // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
      autoSpdy31: true
    }
  }
};

app.enable('trust proxy')
app.get('/', authenticate, params, proxy)
app.get('/favicon.ico', (req, res) => res.status(204).end())
spdy.createServer(options, app).listen(PORT, () => console.log(`Listening on ${PORT}`))
}
