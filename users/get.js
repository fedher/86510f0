'use strict';

const dynamodb = require('./dynamodb');

module.exports.get = async (event, context) => {
    console.log('--- id: ', event.pathParameters.id);
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    // fetch todo from the database
    try {
        const result = await dynamodb.get(params).promise();
        // create a response
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t fetch the todo item.',
        };
    }

    // create a response
    return {
        statusCode: 400,
    // body: JSON.stringify(result.Item),
    };
};
