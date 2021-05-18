const fetch = require('node-fetch');
// TODO: drop lodash.pick in favor of a native destructure.
const pick = require('lodash.pick');
const shouldCompress = require('./shouldCompress');
const shouldRewrite = require("./shouldRewrite");
const redirect = require('./redirect');
const compress = require('./compress');
const rewrite = require('./rewrite');
const bypass = require('./bypass');
const copyHeaders = require('./copyHeaders');

function proxy(req, res) {
    fetch(
        req.params.url,
        {
            headers: {
                ...pick(req.headers, ['cookie', 'dnt', 'referer']),
                'user-agent': 'Bandwidth-Hero Core',
                'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip,
                via: '1.1 bandwidth-hero'
            },
        })
        .then(origin => {
            if (!origin.ok) {
                return redirect(req, res);
            }
            req.params.originType = origin.headers.get('content-type') || '';
            // text processing
            if (shouldRewrite(req)) {
                origin.text().then(text => {
                    rewrite(req, res, text);
                });
            // binary processing
            } else {
                origin.buffer().then(buffer => {
                    req.params.originSize = buffer.length;
                    copyHeaders(origin, res);
                    res.setHeader('content-encoding', 'identity');
                    if (shouldCompress(req)) {
                        compress(req, res, buffer)
                    } else {
                        bypass(req, res, buffer)
                    }
                })
            }
        })
        .catch(e => console.log(e));
}

module.exports = proxy;
