'use strict';

const Joi = require('joi');

const dynamodb = require('./dynamodb');

const schema = Joi.object().keys({
    name: Joi.string().min(3).max(30),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email({ minDomainAtoms: 2 })
});

module.exports.update = async (event, context) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    // validation
    const validation = Joi.validate(data, schema);
    if (validation.error) {
        console.error('Validation Failed: ', validation);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update the user.',
        };
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
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

    try {
        const result = dynamodb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update the user.',
        };
    }
};
