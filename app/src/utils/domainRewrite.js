const domainList = require('../data/domainList.json').rewrite;
const thisHost = process.env.HOST;
function domainCheck(host) {
    for (let domain of domainList) {
        if (host.endsWith(domain))
            return true;
    }
    return false;
}

function rewriteUrlHostname(match, protocol, host) {
    let newHost;
    if (host && domainCheck(host)) {
        newHost = host.replace(/(?<![\\\/*])\./g, '-').replace(/:/, '-') + '.' + thisHost;
        //console.log(match);
        //console.log(host);
        //console.log(newHost);
    }
    if (typeof newHost === 'undefined')
        return protocol + '//' + host;
    else
        return 'http://' + newHost;
}

function rewriteBareHostname(match, host) {
    let newHost;
    if (host && domainCheck(host)) {
        newHost = host.replace(/(?<![\\\/*])\./g, '-').replace(/:/, '-') + '.' + thisHost;

        //console.log(match);
        //console.log(host);
        //console.log(newHost);

        //return newHost;
    }
    if (typeof newHost === 'undefined')
        return host;
    else
        return newHost;
}

module.exports = {
    domainCheck,
    rewriteBareHostname,
    rewriteUrlHostname
};