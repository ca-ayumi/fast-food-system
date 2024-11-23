"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const cognito = new aws_sdk_1.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.USER_POOL_ID;
const handler = async (event, context) => {
    const { document } = JSON.parse(event.body || '{}');
    if (!document) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'CPF is required' }),
        };
    }
    try {
        const params = {
            UserPoolId: USER_POOL_ID,
            Filter: `custom:document = "${document}"`,
        };
        console.log('Params sent to Cognito:', params);
        const result = await cognito.listUsers(params).promise();
        if (!result.Users || result.Users.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Client not found' }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Authenticated successfully',
                user: result.Users?.[0] || null,
            }),
        };
    }
    catch (error) {
        console.error('Error authenticating client:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
exports.handler = handler;
