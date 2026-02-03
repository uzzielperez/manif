import { Handler } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { getInfluencerByCode } from '../../shared/influencers';
import crypto from 'node:crypto';

const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getEnvPasswords(): Record<string, string> {
  const raw = process.env.INFLUENCER_DASHBOARD_PASSWORDS;
  if (!raw || typeof raw !== 'string') return {};
  const trimmed = raw.trim();
  if (!trimmed) return {};
  try {
    const parsed = JSON.parse(trimmed) as Record<string, string>;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch {
    try {
      const unescaped = trimmed.replace(/\\"/g, '"');
      const parsed = JSON.parse(unescaped) as Record<string, string>;
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {
      // ignore
    }
  }
  return {};
}

function signToken(payload: { id: string; exp: number }): string {
  const secret = process.env.INFLUENCER_JWT_SECRET || process.env.ADMIN_PASSWORD || 'influencer-dashboard-secret';
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr, 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
  return `${payloadB64}.${sig}`;
}

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
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { code, password } = body;

    if (!code || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Partner code and dashboard password are required' }),
      };
    }

    const codeNorm = String(code).trim().toUpperCase();

    if (process.env.DATABASE_URL) {
      try {
        const { setupDatabase } = await import('../../db-setup.js');
        const { db } = await import('../../server/db');
        const { influencers, influencerDashboardPasswords } = await import('../../shared/schema');
        const { eq } = await import('drizzle-orm');
        await setupDatabase();
        const fromDb = await db.select().from(influencers).where(eq(influencers.code, codeNorm));
        if (fromDb.length > 0) {
          const inf = fromDb[0];
          const pwRows = await db.select().from(influencerDashboardPasswords).where(eq(influencerDashboardPasswords.influencerId, inf.id));
          if (pwRows.length > 0) {
            const match = await bcrypt.compare(String(password), pwRows[0].passwordHash);
            if (match) {
              const exp = Date.now() + TOKEN_EXPIRY_MS;
              const token = signToken({ id: inf.id, exp });
              return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                  success: true,
                  influencer: {
                    id: inf.id,
                    name: inf.name,
                    code: inf.code,
                    commissionRate: inf.commissionRate,
                    payoutMethod: inf.payoutMethod,
                  },
                  token,
                  expiresAt: exp,
                }),
              };
            }
          } else {
            return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Dashboard password not set. Ask admin to set it.' }) };
          }
        }
      } catch (dbErr) {
        console.error('Influencer auth DB fallback:', dbErr);
      }
    }

    const influencer = getInfluencerByCode(codeNorm);
    if (!influencer) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid partner code. Check the code (e.g. MAGIC25M, FLOW20) and try again.',
        }),
      };
    }
    const envPasswords = getEnvPasswords();
    const expectedPassword = envPasswords[influencer.id];
    if (!expectedPassword) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Dashboard password not set for ${influencer.name}. In Netlify, set INFLUENCER_DASHBOARD_PASSWORDS to: {"${influencer.id}":"yourpassword"}`,
        }),
      };
    }
    if (expectedPassword !== String(password)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid partner code or password' }),
      };
    }
    const exp = Date.now() + TOKEN_EXPIRY_MS;
    const token = signToken({ id: influencer.id, exp });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        influencer: {
          id: influencer.id,
          name: influencer.name,
          code: influencer.code,
          commissionRate: influencer.commissionRate,
          payoutMethod: influencer.payoutMethod,
        },
        token,
        expiresAt: exp,
      }),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Influencer auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: process.env.NODE_ENV === 'development' ? message : 'Internal server error',
      }),
    };
  }
};
