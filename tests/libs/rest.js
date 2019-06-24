const request = require('superagent');

module.exports = {
    req,
    test
    // ...
};

async function req(method, uri, apiKey, data) {
    return request[method](`${uri}`)
        .set('Content-Type', 'application/json')
        .auth(apiKey.username, apiKey.secret)
        .send(data);
}

async function test(uri, apiKey, data) {
    return req('get', uri, apiKey, data);
}
