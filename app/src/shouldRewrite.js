function shouldRewrite(req) {
    const {originType} = req.params;

    if (
        originType.startsWith('text')
        ||
        originType.startsWith('application/x-javascript')
        ||
        originType.startsWith('application/javascript')
    ) return true;
    switch (originType) {
        case 'vnd.mpegurl':
        case 'vnd.apple.mpegurl':
            return true;
        default:
            return false;
    }
}

module.exports = shouldRewrite;
