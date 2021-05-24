const DEFAULT_QUALITY = 1;

function paramsHeaders(req, res, next) {

    const target = req.headers['x-bandwidth-hero-target'];
    if (!target) return res.end('bandwidth-hero-proxy');
    res.setHeader('x-bandwidth-hero-target', target);
    req.params.target = target;

    const host = req.headers['x-bandwidth-hero-host'];
    if (!host) return res.end('bandwidth-hero-proxy');
    res.setHeader('x-bandwidth-hero-host', host);
    req.params.host = host;

    const path = req.headers['x-bandwidth-hero-path'];
    if (!path) return res.end('bandwidth-hero-proxy');
    res.setHeader('x-bandwidth-hero-path', path)
    req.params.path = path;

    const search = req.headers['x-bandwidth-hero-search'];
    res.setHeader('x-bandwidth-hero-search', search)
    req.params.search = search;

    req.params.url = target + path + search;

    req.params.webp = !req.headers['x-bandwidth-hero-jpeg'];
    req.params.grayscale = req.headers['x-bandwidth-hero-bw'] != 0;
    req.params.quality = parseInt(req.headers['x-bandwidth-hero-l'], 10) || DEFAULT_QUALITY;

    next()
}

module.exports = paramsHeaders;
