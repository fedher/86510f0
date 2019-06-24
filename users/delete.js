'use strict';

const dynamodb = require('../libs/dynamodb');

module.exports.delete = async (event, context) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    // delete the todo from the database
    try {
        const result = await dynamodb.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({}),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t remove the todo item.',
        };
    }
};
