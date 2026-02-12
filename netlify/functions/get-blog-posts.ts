/**
 * GET /api/get-blog-posts
 * Returns blog posts from the CMS (content_library where channel='blog' and status='posted').
 * Optional ?slug=... returns a single post (for BlogPost page).
 * Frontend merges these with static BLOG_POSTS and sorts by date.
 */
import type { Handler } from '@netlify/functions';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

function json(body: object, status = 200) {
  return { statusCode: status, headers, body: JSON.stringify(body) };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') return json({ error: 'Method not allowed' }, 405);

  const slug = event.queryStringParameters?.slug;

  if (!process.env.DATABASE_URL) {
    if (slug) return json({ error: 'Not found' }, 404);
    return json({ posts: [] });
  }

  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);

    if (slug) {
      const rows = await sql`
        SELECT content_id, content, metadata, scheduled_for
        FROM content_library
        WHERE channel = 'blog' AND status = 'posted'
          AND (metadata->>'slug' = ${slug} OR (content::jsonb->>'slug') = ${slug})
        LIMIT 1
      `;
      const row = Array.isArray(rows) ? rows[0] : null;
      if (!row?.content) return json({ error: 'Not found' }, 404);
      const post = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
      return json({ post });
    }

    const rows = await sql`
      SELECT content_id, content, metadata, scheduled_for
      FROM content_library
      WHERE channel = 'blog' AND status = 'posted'
      ORDER BY scheduled_for DESC NULLS LAST, generated_at DESC
    `;

    const posts = (Array.isArray(rows) ? rows : []).map((row: { content: string | object }) => {
      const c = row.content;
      return typeof c === 'string' ? JSON.parse(c) : c;
    });

    return json({ posts });
  } catch (e) {
    console.error('get-blog-posts error:', e);
    if (slug) return json({ error: 'Not found' }, 404);
    return json({ posts: [] });
  }
};
