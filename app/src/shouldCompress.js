const MIN_COMPRESS_LENGTH = 2048;
const MIN_TRANSPARENT_COMPRESS_LENGTH = MIN_COMPRESS_LENGTH * 100;

function shouldCompress(req) {
    const {originType, originSize, webp} = req.params;

    if (!originType.startsWith('image')) return false;
    if (originSize === 0) return false;
    if (webp && originSize < MIN_COMPRESS_LENGTH) return false;
    return !(!webp && (
        originType.endsWith('png')
        ||
        originType.endsWith('gif')
        ) && originSize < MIN_TRANSPARENT_COMPRESS_LENGTH);
}

module.exports = shouldCompress;
