'use strict';

const dynamodb = require('../libs/dynamodb');
const logger = require('../libs/logger');

module.exports.get = async (event, context) => {  // eslint-disable-line no-unused-vars
    // Authenticated user.
    const user = event.requestContext.authorizer.principalId;
    // Admin user can read other users' details. Otherwise, the user can get their own data.
    let id = user.role === 'admin' ? event.pathParameters.id : user.id;

    if (!id) {
        return {
            statusCode: 400,
            body: 'Missing id parameter'
        };
    }

    if (user.role === 'employee' && event.pathParameters.id !== user.id) {
        return {
            statusCode: 403,
            body: 'Not allowed to get other user data'
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
        logger.log('error', error);
        return {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t get the user data.',
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
