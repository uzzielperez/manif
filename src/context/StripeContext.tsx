import React, { createContext, useContext, ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Define the ImportMeta interface to include env property
interface ImportMetaEnv {
  VITE_STRIPE_PUBLIC_KEY: string;
}

// Extend ImportMeta interface to include env
declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

// Replace with your Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// For debugging - log if the key is available
console.log('Stripe Key available:', !!import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeContextProviderProps {
  children: ReactNode;
}

export const StripeProvider: React.FC<StripeContextProviderProps> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

// Create a context for Stripe payment functions
interface StripeContextType {
  createPaymentIntent: (amount: number) => Promise<{ clientSecret: string; paymentIntentId: string }>;
  confirmPayment: (paymentIntentId: string) => Promise<{ status: string; success: boolean }>;
}

const StripeContext = createContext<StripeContextType | null>(null);

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

// Helper functions to interact with the backend
export const createPaymentIntent = async (amount: number) => {
  const response = await fetch('http://localhost:5001/api/payment/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }
  
  return response.json();
};

export const confirmPayment = async (paymentIntentId: string) => {
  const response = await fetch('http://localhost:5001/api/payment/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentIntentId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to confirm payment');
  }
  
  return response.json();
}; 