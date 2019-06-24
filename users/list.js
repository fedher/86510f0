'use strict';

const dynamodb = require('../libs/dynamodb');

module.exports.list = async (event, context) => {
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
        console.error(error);
        return {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t fetch the todo item.',
        };
    }

};
