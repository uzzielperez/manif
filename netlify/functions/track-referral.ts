import { Handler } from '@netlify/functions';
import { setupDatabase } from '../../db-setup.js';
import { db } from '../../server/db';
import { influencerEvents, influencers } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { getInfluencerByCode } from '../../shared/influencers';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { influencerId: rawId, eventType, amount, referral_code: referralCode } = body;

    let influencerId: string | null = rawId || null;

    if (!influencerId && referralCode) {
      const codeNorm = String(referralCode).trim().toUpperCase();
      await setupDatabase();
      const fromDb = await db.select({ id: influencers.id }).from(influencers).where(eq(influencers.code, codeNorm));
      if (fromDb.length > 0) influencerId = fromDb[0].id;
      if (!influencerId) {
        const influencer = getInfluencerByCode(codeNorm);
        if (influencer) influencerId = influencer.id;
      }
      if (!influencerId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Unknown referral code', code: referralCode }),
        };
      }
    }

    const resolvedEventType = eventType || 'click';
    if (!influencerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: provide influencerId or referral_code' }),
      };
    }

    if (!body.referral_code) await setupDatabase();

    await db.insert(influencerEvents).values({
      influencerId,
      eventType: resolvedEventType,
      amount: typeof amount === 'number' ? amount : 0,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, influencerId, eventType: resolvedEventType }),
    };
  } catch (error) {
    console.error('Track referral error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
