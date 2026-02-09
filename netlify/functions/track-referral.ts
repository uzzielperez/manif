import { Handler } from '@netlify/functions';
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
      if (process.env.DATABASE_URL) {
        try {
          const { setupDatabase } = await import('../../db-setup.js');
          const { db } = await import('../../server/db');
          const { influencers } = await import('../../shared/schema');
          const { sql } = await import('drizzle-orm');
          await setupDatabase();
          const fromDb = await db.select({ id: influencers.id }).from(influencers).where(sql`lower(${influencers.code}) = ${codeNorm.toLowerCase()}`);
          if (fromDb.length > 0) influencerId = fromDb[0].id;
        } catch (dbErr) {
          console.error('Track referral DB lookup:', dbErr);
        }
      }
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

    let persisted = false;
    if (process.env.DATABASE_URL) {
      try {
        const { setupDatabase } = await import('../../db-setup.js');
        const { db } = await import('../../server/db');
        const { influencerEvents } = await import('../../shared/schema');
        if (!body.referral_code) await setupDatabase();
        await db.insert(influencerEvents).values({
          influencerId,
          eventType: resolvedEventType,
          amount: typeof amount === 'number' ? amount : 0,
        });
        persisted = true;
      } catch (dbErr) {
        console.error('Track referral DB insert:', dbErr);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        influencerId,
        eventType: resolvedEventType,
        ...(persisted ? {} : { persisted: false, message: 'Event not persisted (no database)' }),
      }),
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
