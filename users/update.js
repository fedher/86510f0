'use strict';

const Joi = require('joi');

const dynamodb = require('../libs/dynamodb');
const logger = require('../libs/logger');

const schema = Joi.object().keys({
    name: Joi.string().min(3).max(30),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email({ minDomainAtoms: 2 })
});

module.exports.update = async (event, context) => {  // eslint-disable-line no-unused-vars
    // Authenticated user.
    const user = event.requestContext.authorizer.principalId;
    // As admin user, I can update any user data from the db. The employee user can only update their personal data.
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
            body: 'Not allowed to update other user data'
        };
    }

    const data = JSON.parse(event.body);

    // validation
    const validation = Joi.validate(data, schema);
    if (validation.error) {
        logger.log('error', 'Validation Failed: ', validation);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update the user.',
        };
    }

    try {
        const result = await updateUser(id, data);
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
    } catch (error) {
        logger.log('error', error);
        return {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update the user.',
        };
    }
};


async function updateUser(id, data) {
    const timestamp = new Date().getTime();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
        ExpressionAttributeNames: {
            '#user_name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': data.name,
            ':email': data.email,
            ':password': data.password,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #user_name = :name, email = :email, password = :password, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };
    return dynamodb.update(params).promise();
}
