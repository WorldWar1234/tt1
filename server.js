#!/usr/bin/env node
'use strict';
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

    const PORT = process.env.PORT || 8080;
    const app = require('./app.js');
    const fs = require('fs');


    // Turn on SSL if possible, but run http2c if not.
    // http2c makes if SSL is offloaded.
    const keyPath = './cert/privkey.pem';
    const certPath = './cert/fullchain.pem';
    let options = {allowHTTP1: true};
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        options = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
        };
    }

    const http2 = require('http2');
    const server = http2.createSecureServer(options, app);
    server.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
