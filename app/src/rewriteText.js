const {rewriteBareHostname, rewriteUrlHostname} = require('./utils/domainRewrite');

function rewriteText(req, res, text) {
    const {originType} = req.params;

    let body = text;
    body = body.replace(/(https?:)?\/\/([^/"'\s,;()\[\]=]+)/g, rewriteUrlHostname);
    body = body.replace(/([^/"'\s,;()\[\]=]+)/g, rewriteBareHostname);
    res.setHeader('content-type', originType);
    res.write(body);
    res.end();
}

module.exports = rewriteText;
