# Blog CMS & Scheduled Publishing (Cron)

## Overview

- **CMS**: Blog posts can be stored in the database (`content_library`) with status `scheduled` and a `scheduled_for` date.
- **Cron**: A Netlify scheduled function runs **daily at midnight UTC** and sets status to `posted` for any blog post whose `scheduled_for` has passed.
- **Frontend**: The blog list and post pages merge static posts (from `src/data/blogPosts.ts`) with CMS posts and sort by date.

## Requirements

- `DATABASE_URL` set in Netlify (and locally for testing).
- The `content_library` table is created automatically by `db-setup.js` when any function that calls `setupDatabase()` runs (e.g. admin-influencers, stripe-webhook). For cron-only deploys, ensure the table exists (run a deploy that hits a DB function once, or run migrations manually).

## Scheduling a post (admin / blogging agent)

**Endpoint:** `POST /api/schedule-blog-post`  
**Auth:** Admin (same as marketing dashboard: `Authorization: Bearer <ADMIN_PASSWORD>` or `?admin_key=<ADMIN_PASSWORD>`).

**Body (JSON):**

```json
{
  "slug": "my-valentines-post",
  "title": "My Valentine's Post",
  "date": "Feb 14, 2026",
  "category": "Practice",
  "excerpt": "Short summary for the list.",
  "content": [
    { "type": "blockquote", "text": "Quote." },
    { "type": "p", "text": "Paragraph." },
    { "type": "h2", "text": "Section" },
    { "type": "tip", "title": "Tip", "text": "Tip text." }
  ],
  "scheduledFor": "2026-02-14T09:00:00.000Z"
}
```

- `scheduledFor` is optional. If omitted, it is derived from `date` (same day at 09:00 UTC).
- `content` must match the app’s block types: `blockquote`, `p`, `h2`, `tip`.

**Example (curl):**

```bash
curl -X POST https://your-site.netlify.app/api/schedule-blog-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -d '{"slug":"valentines-2026","title":"Love & Manifestation","date":"Feb 14, 2026","category":"Practice","excerpt":"...","content":[...]}'
```

## Cron (scheduled publish)

- **Function:** `scheduled-publish-blog`
- **Schedule:** `@daily` (midnight UTC).
- **Behavior:** Finds rows in `content_library` where `channel = 'blog'`, `status = 'scheduled'`, and `scheduled_for <= NOW()`, and sets `status = 'posted'`.

Scheduled functions only run on **published** deploys (not branch deploys). You can trigger a run manually in Netlify: Functions → `scheduled-publish-blog` → Run now.

## API for the frontend

- **GET /api/get-blog-posts**  
  Returns `{ posts: [...] }` for all CMS posts with `channel = 'blog'` and `status = 'posted'`. The app merges these with static `BLOG_POSTS` and sorts by date.

- **GET /api/get-blog-posts?slug=my-slug**  
  Returns `{ post: { ... } }` for the CMS post with that slug, or 404. Used by the single post page when the slug isn’t in the static list.
