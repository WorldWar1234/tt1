function parseUrl(url) {
    let parsed = (new URL(url));
    const target = parsed.protocol + '//' + parsed.host;
    return [target, parsed.host, parsed.pathname, parsed.search] ;
}  

function paramsRewrite(req, res, next) {
    const url = parseUrl(req.query.url) || next();
    res.setHeader('x-bandwidth-hero-paramsRewrite', 1);
    req.headers['x-bandwidth-hero-target'] = url[0];
    req.headers['x-bandwidth-hero-host'] = url[1];
    req.headers['x-bandwidth-hero-path'] = url[2];
    req.headers['x-bandwidth-hero-search'] = url[3];
    next()
}

module.exports = paramsRewrite;
