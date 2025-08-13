import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { referral_code, referral_url, user_agent, timestamp } = JSON.parse(event.body || '{}');

    // For now, just log the referral data
    // In production, you'd save this to your database
    console.log('Referral Click Tracked:', {
      referral_code,
      referral_url,
      user_agent,
      timestamp,
      ip: event.headers['client-ip'] || event.headers['x-forwarded-for']
    });

    // TODO: Save to database when you set up the influencer tracking DB
    // await saveReferralClick({
    //   referral_code,
    //   referral_url,
    //   user_agent,
    //   ip_address: event.headers['client-ip'] || event.headers['x-forwarded-for'],
    //   clicked_at: new Date(timestamp)
    // });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Referral tracked successfully'
      })
    };

  } catch (error) {
    console.error('Referral tracking error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to track referral',
        details: error instanceof Error ? error.message : String(error)
      })
    };
  }
};
