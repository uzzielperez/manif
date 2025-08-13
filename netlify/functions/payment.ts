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

  // Validate Stripe key is present
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY environment variable is not set');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Payment system configuration error',
        details: 'Missing Stripe configuration'
      })
    };
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Payment function called with:', {
      path: event.path,
      method: event.httpMethod,
      body: event.body
    });
    
    const pathSegments = event.path.split('/');
    const action = pathSegments[pathSegments.length - 1];
    
    console.log('Path segments:', pathSegments);
    console.log('Action:', action);
    
    switch (event.httpMethod) {
      case 'POST':
        if (action === 'create-checkout' || event.path.includes('create-checkout')) {
          const { amount, successUrl, cancelUrl, metadata, couponCode } = JSON.parse(event.body || '{}');
          
          if (!amount || typeof amount !== 'number' || amount <= 0) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: "Valid amount is required" })
            };
          }

          // Prepare session configuration
          const sessionConfig: any = {
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
            allow_promotion_codes: true, // Enable promotion codes in checkout
          };

          // Handle special Magic25M code for free checkout
          if (couponCode && couponCode.trim().toUpperCase() === 'MAGIC25M') {
            try {
              // Create or retrieve the Magic25M coupon (100% off)
              let magicCoupon;
              try {
                magicCoupon = await stripe.coupons.retrieve('MAGIC25M');
              } catch {
                // Create the Magic25M coupon if it doesn't exist
                magicCoupon = await stripe.coupons.create({
                  id: 'MAGIC25M',
                  name: 'Magic25M - Free Access',
                  percent_off: 100,
                  duration: 'once',
                  max_redemptions: 1000, // Generous limit
                });
              }
              
              sessionConfig.discounts = [{
                coupon: magicCoupon.id
              }];
              
              // Add special metadata for Magic25M users
              sessionConfig.metadata.magic_code_used = 'true';
              sessionConfig.metadata.special_access = 'Magic25M';
              
            } catch (magicError) {
              console.error('Error handling Magic25M coupon:', magicError);
            }
          }
          // Add regular coupon if provided (not Magic25M)
          else if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
            try {
              // Try to retrieve the coupon to validate it exists
              const coupon = await stripe.coupons.retrieve(couponCode.trim());
              sessionConfig.discounts = [{
                coupon: coupon.id
              }];
            } catch (couponError) {
              console.log('Coupon not found or invalid:', couponCode);
              // Continue without coupon - let Stripe handle invalid promotion codes
            }
          }

          const session = await stripe.checkout.sessions.create(sessionConfig);

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
    console.error('Stripe key present:', !!process.env.STRIPE_SECRET_KEY);
    console.error('Stripe key starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'));
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create checkout session. Please try again.',
        details: error instanceof Error ? error.message : String(error),
        debug: {
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          eventPath: event.path,
          eventMethod: event.httpMethod
        }
      })
    };
  }
}; 