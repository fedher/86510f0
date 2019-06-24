'use strict';

const dynamodb = require('../libs/dynamodb');

module.exports.get = async (event, context) => {
    const user = event.requestContext.authorizer;
    let id = user.role === 'employee' ? user.id : event.pathParameters.id;

    if (!id) {
        return {
            statusCode: 400,
            body: 'Missing id parameter'
        };
    }

    try {
        const result = await getUser(id);
        if (!result.Item) {
            return {
                statusCode: 404,
                body: 'User not found'
            };
        }
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
};

async function getUser(id) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
    };
    return dynamodb.get(params).promise();
}
