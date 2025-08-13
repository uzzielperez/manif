import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

// This should be set in your Netlify environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const body = event.body;
  const signature = event.headers['stripe-signature'];

  if (!body || !signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing body or signature' })
    };
  }

  let stripeEvent: Stripe.Event;

  try {
    // Verify the webhook signature
    stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid signature' })
    };
  }

  try {
    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(stripeEvent.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(stripeEvent.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' })
    };
  }
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  try {
    // Get the line items to see if a coupon was used
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    });

    // Check if there are any discounts (coupons)
    const discounts = session.total_details?.amount_discount || 0;
    const originalAmount = session.amount_total ? session.amount_total + discounts : 0;
    const finalAmount = session.amount_total || 0;

    // Extract coupon information
    let couponCode = '';
    let influencerId = '';
    
    if (session.discount?.coupon?.id) {
      couponCode = session.discount.coupon.id;
      // TODO: Look up influencer by coupon code in database
      // influencerId = await getInfluencerIdByCouponCode(couponCode);
    }

    // Calculate commission if this was an influencer referral
    let commissionAmount = 0;
    if (influencerId) {
      // TODO: Get commission rate from database
      const commissionRate = 0.30; // 30% default
      commissionAmount = (finalAmount / 100) * commissionRate;
    }

    // TODO: Save the performance data to database
    const performanceData = {
      influencer_id: influencerId,
      payment_intent_id: session.payment_intent as string,
      session_id: session.id,
      customer_email: session.customer_details?.email,
      original_amount: originalAmount / 100, // Convert from cents
      discount_amount: discounts / 100,
      final_amount: finalAmount / 100,
      commission_amount: commissionAmount,
      commission_paid: false,
      created_at: new Date()
    };

    console.log('Performance data to save:', performanceData);
    
    // TODO: Implement database save
    // await saveInfluencerPerformance(performanceData);

  } catch (error) {
    console.error('Error processing checkout session:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  // Additional processing if needed
  // This could be used for backup tracking or additional business logic
}

// TODO: Implement these database functions
// async function getInfluencerIdByCouponCode(couponCode: string): Promise<string | null> {
//   // Look up influencer in database by coupon code
//   return null;
// }

// async function saveInfluencerPerformance(data: any): Promise<void> {
//   // Save performance data to database
// }
