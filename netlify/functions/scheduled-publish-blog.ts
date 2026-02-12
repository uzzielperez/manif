/**
 * Scheduled function: runs daily (UTC midnight) and publishes blog posts
 * whose scheduled_for date/time has passed.
 * Requires DATABASE_URL and content_library table (created by db-setup).
 */
// @ts-ignore - Netlify scheduled function signature
import type { Config } from '@netlify/functions';

export default async (req: Request) => {
  try {
    let body: { next_run?: string } = {};
    try {
      if (req.body) body = (await req.json()) as { next_run?: string };
    } catch {
      // Scheduled invocations may have no body
    }
    if (body.next_run) console.log('Next scheduled run:', body.next_run);

    if (!process.env.DATABASE_URL) {
      console.warn('scheduled-publish-blog: DATABASE_URL not set, skipping');
      return new Response(null, { status: 204 });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      UPDATE content_library
      SET status = 'posted'
      WHERE channel = 'blog'
        AND status = 'scheduled'
        AND scheduled_for IS NOT NULL
        AND scheduled_for <= NOW()
      RETURNING id, content_id, scheduled_for
    `;

    if (Array.isArray(result) && result.length > 0) {
      console.log('scheduled-publish-blog: published', result.length, 'post(s)', result);
    }
  } catch (e) {
    console.error('scheduled-publish-blog error:', e);
  }
  return new Response(null, { status: 204 });
};

export const config: Config = {
  schedule: '@daily',
};
