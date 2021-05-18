function bypass(req, res, buffer) {
    res.setHeader('x-bandwidth-hero-bypass', 1);
    res.setHeader('content-length', buffer.length);
    res.status(200);
    res.write(buffer);
    res.end();
}

module.exports = bypass;
