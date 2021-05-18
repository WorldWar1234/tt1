function shouldRewrite(req) {
    const {originType} = req.params;

    if (originType.startsWith('text')) return true;
    switch (originType) {
        case 'vnd.mpegurl':
        case 'vnd.apple.mpegurl':
            return true;
        default:
            return false;
    }
}

module.exports = shouldRewrite;
