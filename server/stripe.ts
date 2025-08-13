import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion, // Use the latest API version
});

export async function createCheckoutSession(amount: number, successUrl: string, cancelUrl: string, metadata: any = {}) {
  try {
    // Convert amount to cents/smallest currency unit
    const amountInCents = Math.round(amount * 100);
    
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
            unit_amount: amountInCents,
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
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function retrieveCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      success: session.payment_status === 'paid',
      metadata: session.metadata,
      customerId: session.customer,
    };
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}

// Keep the existing payment intent functions for backward compatibility
export async function createPaymentIntent(amount: number, currency: string = 'usd') {
  try {
    // Convert amount to cents/smallest currency unit
    const amountInCents = Math.round(amount * 100);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      payment_method_types: ['card'],
      metadata: {
        product: 'meditation_download',
      },
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      status: paymentIntent.status,
      success: paymentIntent.status === 'succeeded',
    };
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw error;
  }
} 