import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { getInfluencerByCode } from '../../shared/influencers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

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
    stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid signature' })
    };
  }

  try {
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

/** Resolve Stripe coupon ID (e.g. MAGIC25M) to influencer id and commission rate. */
async function resolveInfluencerFromCoupon(couponId: string): Promise<{ id: string; commissionRate: number } | null> {
  const codeNorm = String(couponId).trim().toUpperCase();
  if (!codeNorm) return null;

  if (process.env.DATABASE_URL) {
    try {
      const { setupDatabase } = await import('../../db-setup.js');
      const { db } = await import('../../server/db');
      const { influencers } = await import('../../shared/schema');
      const { sql } = await import('drizzle-orm');
      await setupDatabase();
      const rows = await db.select({ id: influencers.id, commissionRate: influencers.commissionRate }).from(influencers).where(sql`lower(${influencers.code}) = ${codeNorm.toLowerCase()}`);
      if (rows.length > 0) return { id: rows[0].id, commissionRate: rows[0].commissionRate };
    } catch (e) {
      console.error('Stripe webhook DB lookup:', e);
    }
  }

  const inf = getInfluencerByCode(codeNorm);
  if (inf) return { id: inf.id, commissionRate: inf.commissionRate };
  return null;
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  const finalAmountCents = session.amount_total ?? 0;
  const couponId = session.discount?.coupon?.id ?? '';

  const influencer = couponId ? await resolveInfluencerFromCoupon(couponId) : null;
  if (influencer) {
    if (process.env.DATABASE_URL) {
      try {
        const { setupDatabase } = await import('../../db-setup.js');
        const { db } = await import('../../server/db');
        const { influencerEvents } = await import('../../shared/schema');
        await setupDatabase();
        await db.insert(influencerEvents).values({
          influencerId: influencer.id,
          eventType: 'payment',
          amount: finalAmountCents,
        });
        console.log('Recorded influencer payment:', influencer.id, finalAmountCents, 'cents');
      } catch (e) {
        console.error('Stripe webhook DB insert:', e);
      }
    }
  }

  // Legacy log (no DB dependency)
  const performanceData = {
    influencer_id: influencer?.id ?? '',
    session_id: session.id,
    final_amount_cents: finalAmountCents,
    commission_rate: influencer?.commissionRate,
  };
  console.log('Performance data:', performanceData);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
}
