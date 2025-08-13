import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    const keyStart = process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) : 'MISSING';
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        stripe_configured: hasStripeKey,
        stripe_key_start: keyStart,
        environment: process.env.NODE_ENV || 'unknown',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Test failed',
        details: error instanceof Error ? error.message : String(error)
      })
    };
  }
};
