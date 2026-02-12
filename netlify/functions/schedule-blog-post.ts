/**
 * POST /api/schedule-blog-post
 * Admin-only. Schedules a blog post for publication at scheduledFor.
 * Body: { slug, title, date, category, excerpt, content, scheduledFor? }
 * scheduledFor: ISO string (e.g. "2026-02-14T09:00:00Z"); if omitted, derived from date.
 */
import type { Handler } from '@netlify/functions';
import { checkAdminAuth } from './marketing-agents/admin-auth';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function json(body: object, status = 200) {
  return { statusCode: status, headers, body: JSON.stringify(body) };
}

function parseScheduledFor(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (!checkAdminAuth(event)) return json({ error: 'Unauthorized' }, 401);
  if (event.httpMethod !== 'POST') return json({ error: 'Method not allowed' }, 405);

  if (!process.env.DATABASE_URL) {
    return json({ error: 'DATABASE_URL not set' }, 503);
  }

  let body: { slug?: string; title?: string; date?: string; category?: string; excerpt?: string; content?: unknown; scheduledFor?: string };
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { slug, title, date, category, excerpt, content } = body;
  if (!slug || !title || !date || !category || !excerpt || !Array.isArray(content)) {
    return json({ error: 'Missing or invalid: slug, title, date, category, excerpt, content (array)' }, 400);
  }

  const scheduledFor = body.scheduledFor || parseScheduledFor(date);
  const contentId = `blog-${slug}-${Date.now()}`;
  const post = { slug, title, date, category, excerpt, content };

  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO content_library (content_id, channel, content, metadata, status, scheduled_for)
      VALUES (
        ${contentId},
        'blog',
        ${JSON.stringify(post)},
        ${JSON.stringify({ slug })},
        'scheduled',
        ${scheduledFor}
      )
    `;

    return json({ ok: true, contentId, slug, scheduledFor });
  } catch (e) {
    console.error('schedule-blog-post error:', e);
    return json({ error: 'Failed to schedule post' }, 500);
  }
};
