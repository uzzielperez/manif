import { Handler } from '@netlify/functions';
import { setupDatabase } from '../../db-setup.js';
import { db } from '../../server/db';
import { influencerEvents } from '../../shared/schema';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { influencerId, eventType, amount } = JSON.parse(event.body || '{}');

    if (!influencerId || !eventType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    await setupDatabase();

    await db.insert(influencerEvents).values({
      influencerId,
      eventType,
      amount: amount || 0,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Track referral error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
