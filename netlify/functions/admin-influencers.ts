import { Handler } from '@netlify/functions';
import { setupDatabase } from '../../db-setup.js';
import { db } from '../../server/db';
import { influencers, influencerDashboardPasswords } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { checkAdminAuth } from './marketing-agents/admin-auth';

const SALT_ROUNDS = 10;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Content-Type': 'application/json',
};

function json(body: object, status = 200) {
  return { statusCode: status, headers, body: JSON.stringify(body) };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (!checkAdminAuth(event)) return json({ error: 'Unauthorized' }, 401);

  await setupDatabase();

  try {
    if (event.httpMethod === 'GET') {
      const list = await db.select().from(influencers).orderBy(influencers.createdAt);
      const withPasswords = await db.select({ influencerId: influencerDashboardPasswords.influencerId }).from(influencerDashboardPasswords);
      const passwordSet = new Set(withPasswords.map((p) => p.influencerId));
      const influencersList = list.map((inf) => ({
        id: inf.id,
        name: inf.name,
        code: inf.code,
        commissionRate: inf.commissionRate,
        payoutMethod: inf.payoutMethod,
        createdAt: inf.createdAt,
        hasPassword: passwordSet.has(inf.id),
      }));
      return json({ success: true, influencers: influencersList });
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { name, code, commissionRate, payoutMethod, password } = body;
      if (!name || !code || !password) return json({ error: 'name, code, and password required' }, 400);
      const rate = Number(commissionRate);
      if (Number.isNaN(rate) || rate < 0 || rate > 1) return json({ error: 'commissionRate must be 0–1 (e.g. 0.25 for 25%)' }, 400);
      const method = payoutMethod === 'paypal' ? 'paypal' : 'stripe';

      const existing = await db.select().from(influencers).where(eq(influencers.code, String(code).trim().toUpperCase()));
      if (existing.length) return json({ error: 'Code already in use' }, 400);

      const allIds = await db.select({ id: influencers.id }).from(influencers);
      const nextNum = allIds.length
        ? Math.max(...allIds.map((r) => parseInt((r.id || '').replace(/\D/g, ''), 10) || 0)) + 1
        : 1;
      const id = `inf-${nextNum}`;

      const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);

      await db.insert(influencers).values({
        id,
        name: String(name).trim(),
        code: String(code).trim().toUpperCase(),
        commissionRate: rate,
        payoutMethod: method,
      });
      await db.insert(influencerDashboardPasswords).values({
        influencerId: id,
        passwordHash,
      });

      return json({ success: true, influencer: { id, name, code, commissionRate: rate, payoutMethod: method } });
    }

    if (event.httpMethod === 'PATCH') {
      const body = JSON.parse(event.body || '{}');
      const { influencerId, password } = body;
      if (!influencerId || !password) return json({ error: 'influencerId and password required' }, 400);

      const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
      await db
        .insert(influencerDashboardPasswords)
        .values({ influencerId: String(influencerId), passwordHash })
        .onConflictDoUpdate({
          target: influencerDashboardPasswords.influencerId,
          set: { passwordHash, updatedAt: new Date() },
        });
      return json({ success: true });
    }

    return json({ error: 'Method not allowed' }, 405);
  } catch (err: any) {
    console.error('admin-influencers error:', err);
    return json({ error: err?.message || 'Internal server error' }, 500);
  }
};
