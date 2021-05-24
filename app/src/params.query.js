const DEFAULT_QUALITY = 1;

function paramsQuery(req, res, next) {
    let url = req.query.url;
    if (url) {
        if (Array.isArray(url)) url = url.join('&url=');

        url = url.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');
        req.params.url = url;
    }
    req.params.webp = !req.query.jpeg;
    req.params.grayscale = req.query.bw === 1;
    req.params.quality = parseInt(req.query.l, 10) || DEFAULT_QUALITY;
    next()
}

module.exports = paramsQuery;
