const LOGIN = process.env.LOGIN;
const PASSWORD = process.env.PASSWORD;

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};

module.exports = (event, context, callback) => {
    if (LOGIN && PASSWORD) {
        var authorizationHeader = event.headers.Authorization;
        if (!authorizationHeader) return callback('Unauthorized');
        var encodedCreds = authorizationHeader.split(' ')[1];
        var plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':');
        var username = plainCreds[0];
        var password = plainCreds[1];

        if (username === LOGIN && password === PASSWORD) {
            // if everything is good, save to request for use in other routes
            return callback(null, generatePolicy(LOGIN, 'Allow', event.methodArn))
        } else {
            const response = {
                status: '401',
                statusDescription: 'Unauthorized',
                body: 'Unauthorized',
                headers: {
                    'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic realm="Bandwidth-Hero Compression Service'}]
                },
            };
            callback(null, response);
        }
    }
    callback();
};
