const DEFAULT_QUALITY = 1;

function params(req, res, next) {
    const path = req.headers[':path'];
    const query = require('url').parse(path, true).query;
    req.params = {};
    let url = query.url;
    if (Array.isArray(url)) url = url.join('&url=');
    if (!url) return res.end('bandwidth-hero-proxy');

    url = url.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');
    req.params.url = url;
    req.params.webp = !query.jpeg;
    req.params.grayscale = query.bw != 0;
    req.params.quality = parseInt(query.l, 10) || DEFAULT_QUALITY;
    console.log(req.params);
    return next(req, res)
}

module.exports = params;
