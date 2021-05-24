const redirect = require('./redirect');
const shouldProxy = require("./shouldProxy");
const thisHost = process.env.HOST;

function rewriteHostname(req, res, target, targetHost, path, search) {
    if (thisHost === req.headers['host'] && shouldProxy(target)) {
        const newHost = targetHost.replace(/\./g, '-').replace(/:/, '-') + '.' + thisHost;
        req.params.url = 'http://' + newHost;
    } else {
        req.params.url = target;
    }
    if (path)
        req.params.url += path;
    if (search)
        req.params.url += search;
}

function parseReq(req) {
    let host = req.headers['host'].replace(/-/g, '.').replace(/-(\d+)$/, ':$1').replace('.' + thisHost, '');
    let target = 'https://' + host;
    let [path, search] = req.originalUrl.split('?');
    search = '?' + search;
    req.params.target = target;
    req.params.host = host;
    req.params.path = path;
    req.params.search = search;
    req.params.url = target + path + search;
}

function parseQueryUrl(url) {
    let parsed = (new URL(url));
    const target = parsed.protocol + '//' + parsed.host;
    return [target, parsed.host, parsed.pathname, parsed.search] ;
}  

function paramsRewrite(req, res, next) {
    const queryUrl = req.query.url;
    let [target, host, path, search] = ['', '', '', ''];
    if (queryUrl) {
        [target, host, path, search] = parseQueryUrl(queryUrl) || next();
        rewriteHostname(req, res, target, host, path, search);
        redirect(req, res);
    } else {
        parseReq(req);
    }
    if (!res.headersSent) next();
}

module.exports = paramsRewrite;
