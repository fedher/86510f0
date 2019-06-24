'use strict';

const dynamodb = require('./users/dynamodb');

module.exports.auth = async (event, context) => { // eslint-disable-line no-unused-vars
    const authHeader = event.headers.Authorization;

    // console.log('-- AUTHORIZER! ', authHeader);
    if (!authHeader) {
        return 'Unauthorized';
    };

    const encodedCreds = authHeader.split(' ')[1];
    const plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':');
    const username = plainCreds[0];
    const password = plainCreds[1];

    let user = { role: 'employee' };
    try {
        const result = await getUser(username, password);
        // console.log('-- ITEMS: ', result.Items);
        if (result.Items.length === 0) {
            return 'Unauthorized';
        }

        user = result.Items[0];

    } catch (error) {
        console.log('-- ERROR: ', error);
        return 'Unauthorized';
    }

    console.log('-- USER: ', user);
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
        ProjectionExpression: 'email, #role, #name'
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
