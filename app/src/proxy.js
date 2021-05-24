const fetch = require('node-fetch');
// TODO: drop lodash.pick in favor of a native destructure.
const pick = require('lodash.pick');
const shouldCompress = require('./shouldCompress');
const shouldRewrite = require("./shouldRewrite");
const shouldProxy = require("./shouldProxy");
const redirect = require('./redirect');
const compress = require('./compress');
const rewriteText = require('./rewriteText');
const bypass = require('./bypass');
const copyHeaders = require('./copyHeaders');
const rewriteHeaders = require('./rewriteHeaders')

function proxy(req, res) {
    fetch(
        req.params.url,
        {
            headers: {
                ...pick(req.headers, ['cookie', 'dnt', 'referer']),
                //'user-agent': 'Bandwidth-Hero Core',
                'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip,
                via: '1.1 bandwidth-hero'
            },
        })
        .then(origin => {
            // A terrible hack for PoC.
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('upgrade-insecure-requests', 0);
            req.params.originType = origin.headers.get('content-type') || '';
            if (!shouldProxy(origin.url)) {
                return redirect(req, res);
            }
            // text processing
            if (shouldRewrite(req)) {
                origin.textConverted().then(text => {
                    //copyHeaders(origin, res);
                    //rewriteHeaders(req, res);
                    rewriteHeaders(origin, res);
                    res.removeHeader('content-encoding');
                    res.removeHeader('access-control-allow-origin');
                    res.removeHeader('content-security-policy');
                    res.removeHeader('referrer-policy');
                    res.removeHeader('permissions-policy');
                    res.removeHeader('x-frame-options');
                    res.removeHeader('x-content-options');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    rewriteText(req, res, text);
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
