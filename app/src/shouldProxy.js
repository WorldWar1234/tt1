function shouldProxy(url) {
    const {domainCheck} = require('./utils/domainRewrite');
    const parsed = (new URL(url));
    const domain = parsed.hostname;
    return domainCheck(domain);
}

module.exports = shouldProxy;
