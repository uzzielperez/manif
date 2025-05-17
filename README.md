# Manifesto - Manifestation Meditation App

A beautiful meditation app that generates personalized manifestation meditations using AI. Built with React, Tailwind CSS, and powered by Groq and Eleven Labs.

![Manifesto App](https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- 🧘‍♀️ AI-generated personalized meditations
- 🎵 Background music with volume control
- 🗣️ Text-to-speech narration using Eleven Labs
- 💳 Secure payments with Stripe
- 📱 Fully responsive design
- ✨ Beautiful animations with Framer Motion

## Prerequisites

Before deploying, you'll need:

- Node.js 18.0.0 or higher
- A [Groq API](https://console.groq.com) account and API key
- An [Eleven Labs](https://elevenlabs.io) account and API key
- A [Stripe](https://stripe.com) account and API keys
- A [Supabase](https://supabase.com) account for database storage

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_GROQ_API_KEY=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
VITE_ELEVEN_LABS_API_KEY=your_eleven_labs_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This app can be deployed to Netlify with a single click:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/manifesto)

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Howler.js
- Lucide Icons
- Vite


## Local test
```
npm run dev
# in another terminal
npx ts-node --project tsconfig.json -r tsconfig-paths/register server/index.ts
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For support, email support@manifesto.app or open an issue in the repository.