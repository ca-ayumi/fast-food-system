import { APIGatewayEvent, Context } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognito = new CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.USER_POOL_ID;

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const { document } = JSON.parse(event.body || '{}');

  if (!document) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'CPF is required' }),
    };
  }

  try {
    const params = {
      UserPoolId: USER_POOL_ID!,
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
  } catch (error) {
    console.error('Error authenticating client:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
