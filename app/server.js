const app = require('./index');
const server = require('http').createServer(app);
server.listen(process.env.PORT || 8080);
