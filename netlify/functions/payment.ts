import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
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
    const pathSegments = event.path.split('/');
    const action = pathSegments[pathSegments.length - 1];
    
    switch (event.httpMethod) {
      case 'POST':
        if (action === 'create-checkout' || event.path.includes('create-checkout')) {
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
                  currency: 'eur',
                  product_data: {
                    name: 'Manifestation AI Blueprint - Starter Package',
                    description: 'Complete manifestation guide with AI meditation tools',
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
              product: 'starter_package',
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
        if (event.path.includes('checkout-status')) {
          const sessionId = pathSegments[pathSegments.length - 1];
          
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
    console.error('Event path:', event.path);
    console.error('Event method:', event.httpMethod);
    console.error('Event body:', event.body);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      })
    };
  }
}; 