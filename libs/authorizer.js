'use strict';

const dynamodb = require('./dynamodb');

module.exports.auth = async (event, context) => { // eslint-disable-line no-unused-vars
    const authHeader = event.headers.Authorization;

    if (!authHeader) {
        return 'Unauthorized';
    };

    // Split the Basic HTTP Authentication Header to get the username and password.
    const encodedCreds = authHeader.split(' ')[1];
    const plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':');
    const username = plainCreds[0];
    const password = plainCreds[1];

    let user = { role: 'employee' }; // role by default
    try {
        const result = await getUser(username, password);
        // console.log('-- ITEMS: ', result.Items);
        if (result.Items.length === 0) {
            return 'Unauthorized';
        }
        // Sets the authenticated user.
        user = result.Items[0];

    } catch (error) {
        console.log('-- ERROR: ', error);
        return 'Unauthorized';
    }

    // Allows the request.
    return {
        principalId: user.role,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: '*'
                }
            ]
        }
    };
};

async function getUser(email, password) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'email_index',
        KeyConditionExpression: '#email = :email',
        ExpressionAttributeNames: {
            '#email': 'email',
            '#name': 'name',
            '#role': 'role'
        },
        ExpressionAttributeValues: {
            ':email': email
        },
        ProjectionExpression: 'id, email, #role, #name'
    };
    return dynamodb.query(params).promise();
}

// async function getUser(email, password) {
//     console.log('-- email: ', email, 'pass: ', password);
//     const params = {
//         TableName: process.env.DYNAMODB_TABLE,
//         ExpressionAttributeValues: {
//             ':email': email,
//             ':password': password
//         },
//         // FilterExpression: 'email = :email',
//         FilterExpression: 'email = :email AND password = :password'
//     };
//
//     return dynamodb.scan(params).promise();
// }
