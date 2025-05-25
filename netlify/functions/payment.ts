import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    switch (event.httpMethod) {
      case 'POST':
        if (event.path === '/.netlify/functions/payment/create-checkout') {
          const { amount, successUrl, cancelUrl, metadata } = JSON.parse(event.body || '{}');
          
          if (!amount || typeof amount !== 'number' || amount <= 0) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: "Valid amount is required" })
            };
          }

          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'Premium Meditation',
                    description: 'High-quality audio + text meditation content',
                  },
                  unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
              product: 'meditation_download',
              ...metadata
            },
          });

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              sessionId: session.id,
              url: session.url,
            })
          };
        }
        break;

      case 'GET':
        if (event.path.startsWith('/.netlify/functions/payment/checkout-status/')) {
          const sessionId = event.path.split('/').pop();
          
          if (!sessionId) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: "Session ID is required" })
            };
          }

          const session = await stripe.checkout.sessions.retrieve(sessionId);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              status: session.payment_status,
              success: session.payment_status === 'paid',
              metadata: session.metadata,
              customerId: session.customer,
            })
          };
        }
        break;

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Payment function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 