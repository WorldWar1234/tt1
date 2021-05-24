const {rewriteBareHostname, rewriteUrlHostname} = require('./utils/domainRewrite');

function rewriteHeaders(source, target) {
    if (typeof source.headers.entries === 'function') {
        for (const [key, value] of source.headers.entries()) {
            try {
                let newValue = value;
                //newValue = newValue.replace(/(https?:)?\/\/([^/"'\s,;()\[\]=]+)/g, rewriteUrlHostname);
                //newValue = newValue.replace(/([^/"'\s,;()\[\]\\\/=]+)/g, rewriteBareHostname);
                // We decompress stuff in order to rewrite content, so we drop the content-encoding header.
                if (key != 'content-encoding') {
                    target.setHeader(key, newValue)
                }
            } catch (e) {
                console.log(e.message)
            }
        }
    }
}

module.exports = rewriteHeaders;
