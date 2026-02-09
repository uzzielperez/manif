import { Handler } from '@netlify/functions';
import crypto from 'node:crypto';

const secret = () => process.env.INFLUENCER_JWT_SECRET || process.env.ADMIN_PASSWORD || 'influencer-dashboard-secret';

function verifyToken(token: string): { id: string; exp: number } | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  try {
    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', secret()).update(payloadStr).digest('base64url');
    if (expectedSig !== sig) return null;
    const payload = JSON.parse(payloadStr) as { id?: string; exp?: number };
    if (!payload.id || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return { id: payload.id, exp: payload.exp };
  } catch {
    return null;
  }
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const auth = event.headers.authorization || event.headers.Authorization;
  const token = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const payload = verifyToken(token);
  if (!payload) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized. Sign in again.' }),
    };
  }

  const influencerId = payload.id;

  const empty = {
    unlocks: 0,
    payments: 0,
    revenue: 0,
    commission: 0,
    clicks: 0,
    commissionRate: 0,
  };

  if (!process.env.DATABASE_URL) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(empty),
    };
  }

  try {
    const { db } = await import('../../server/db');
    const { influencerEvents, influencers } = await import('../../shared/schema');
    const { eq } = await import('drizzle-orm');

    const [inf] = await db.select({ commissionRate: influencers.commissionRate }).from(influencers).where(eq(influencers.id, influencerId));
    const commissionRate = inf?.commissionRate ?? 0;

    const events = await db
      .select({ eventType: influencerEvents.eventType, amount: influencerEvents.amount })
      .from(influencerEvents)
      .where(eq(influencerEvents.influencerId, influencerId));

    let clicks = 0;
    let unlocks = 0;
    let payments = 0;
    let revenueCents = 0;

    for (const e of events) {
      const type = (e.eventType || '').toLowerCase();
      if (type === 'click') clicks++;
      else if (type === 'unlock') unlocks++;
      else if (type === 'payment' || type === 'purchase') {
        payments++;
        revenueCents += typeof e.amount === 'number' ? e.amount : 0;
      }
    }

    const revenue = revenueCents / 100;
    const commission = revenue * commissionRate;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        unlocks,
        payments,
        revenue: Math.round(revenue * 100) / 100,
        commission: Math.round(commission * 100) / 100,
        clicks,
        commissionRate,
      }),
    };
  } catch (err) {
    console.error('Influencer stats error:', err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        unlocks: 0,
        payments: 0,
        revenue: 0,
        commission: 0,
        clicks: 0,
        commissionRate: 0,
        error: 'Could not load stats',
      }),
    };
  }
};
