'use strict';

module.exports.get = async (event, context) => {
    // create a response
    return {
        statusCode: 200,
        body: 'list',
    };
};
