# Update Audio URLs for CDN

## Quick Solution: Host on External CDN

Your audio files (43MB total) aren't deploying with Netlify. Host them on a CDN instead.

## Recommended: Cloudinary (Free)

1. **Sign up**: https://cloudinary.com (Free: 25GB storage)
2. **Upload files**: Go to Media Library → Upload
   - Upload all files from: `public/audio/free-meditations/*.mp3`
3. **Get URLs**: Each file will have a URL like:
   ```
   https://res.cloudinary.com/YOUR_CLOUD_NAME/audio/upload/v1/1-cosmic-grounding.mp3
   ```

4. **Update code**: Replace URLs in `src/pages/FreeMeditations.tsx`

## Alternative: AWS S3 / Cloudflare R2

Both offer free tiers for static file hosting.

## After uploading to Cloudinary:

Update the audioUrl values in `src/pages/FreeMeditations.tsx`:

```typescript
const MOCK_MEDITATIONS = [
  {
    id: '1',
    title: 'Cosmic Grounding',
    audioUrl: 'https://res.cloudinary.com/YOUR_CLOUD/audio/upload/v1/1-cosmic-grounding.mp3',
    // ... rest
  },
  // ... etc
];
```

## Or keep them local for development

You can also:
1. Keep files in `public/audio/` for local dev
2. Use environment variable for CDN URL prefix
3. Switch between local/production:

```typescript
const AUDIO_BASE_URL = import.meta.env.PROD 
  ? 'https://res.cloudinary.com/YOUR_CLOUD/audio/upload/v1'
  : '/audio/free-meditations';

const MOCK_MEDITATIONS = [
  {
    audioUrl: `${AUDIO_BASE_URL}/1-cosmic-grounding.mp3`,
    // ...
  }
];
```
