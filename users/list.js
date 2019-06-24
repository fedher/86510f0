'use strict';

const dynamodb = require('../libs/dynamodb');
const logger = require('../libs/logger');

module.exports.list = async (event, context) => {  // eslint-disable-line no-unused-vars
    // Authenticated user.
    const user = event.requestContext.authorizer.principalId;
    if (user.role !== 'admin') {
        return {
            statusCode: 403,
            body: 'Not authorized to list users data'
        };
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
    };

    // fetch all todos from the database
    try {
        const result = await dynamodb.scan(params).promise();
        // create a response
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
    // handle potential errors
        logger.log('error', error);
        return {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t fetch the todo item.',
        };
    }

};
