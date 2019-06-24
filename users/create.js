'use strict';

module.exports.create = async (event, context) => {
    // create a response
    return {
        statusCode: 200,
        body: 'test',
    };
};
