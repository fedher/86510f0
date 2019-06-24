'use strict';

const dynamodb = require('../libs/dynamodb');

module.exports.delete = async (event, context) => {  // eslint-disable-line no-unused-vars
    // Authenticated user.
    const user = event.requestContext.authorizer.principalId;
    // As admin user, I can delete any user from the db. The employee user only can remove their personal data.
    let id = user.role === 'admin' ? event.pathParameters.id : user.id;

    if (!id) {
        return {
            statusCode: 400,
            body: 'Missing id parameter'
        };
    }

    try {
        await deleteUser(id);
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

async function deleteUser(id) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
    };
    return dynamodb.delete(params).promise();
}
