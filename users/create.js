'use strict';

const uuid = require('uuid');
const Joi = require('joi');

const dynamodb = require('../libs/dynamodb');
const logger = require('../libs/logger');


const schema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    role: Joi.string().min(3).max(8).required()
});

module.exports.create = async (event, context) => { // eslint-disable-line no-unused-vars
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    const validation = Joi.validate(data, schema);
    if (validation.error) {
        logger.log('error', 'Validation Failed: ', validation);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the user.',
        };
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        await dynamodb.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
    } catch (error) {
        logger.log('error', error);
        return {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the todo item.',
        };
    }
};
