function rewrite(req, res, text) {
    const {originType, target, host, path, search} = req.params;

    let body = text;
    res.write(body);
    res.end();
}

module.exports = rewrite;
