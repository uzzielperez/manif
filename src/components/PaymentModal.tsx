import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, AlertTriangle } from 'lucide-react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../context/StripeContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  
  const stripe = useStripe();
  const elements = useElements();

  // Debug information
  const stripeLoaded = !!stripe;
  const elementsLoaded = !!elements;

  useEffect(() => {
    // Log Stripe initialization status
    console.log('Stripe loaded:', stripeLoaded);
    console.log('Elements loaded:', elementsLoaded);
    
    // Reset state when modal opens
    if (isOpen) {
      setError(null);
      setLoading(false);
      
      // Create payment intent when the modal opens
      const initializePayment = async () => {
        try {
          setLoading(true);
          // Fixed price of $4.99 for the meditation download
          const response = await createPaymentIntent(4.99);
          setClientSecret(response.clientSecret);
          setPaymentIntentId(response.paymentIntentId);
          console.log('Payment intent created:', !!response.clientSecret);
        } catch (err) {
          console.error('Payment initialization error:', err);
          setError('Failed to initialize payment. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      initializePayment();
    }
  }, [isOpen, stripeLoaded, elementsLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret || !paymentIntentId) {
      setError('Payment processing unavailable. Please try again later.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });
      
      if (paymentError) {
        throw new Error(paymentError.message);
      }
      
      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntentId);
      } else {
        setError(`Payment status: ${paymentIntent.status}. Please try again.`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // For debugging only - let's bypass the payment in development
  const handleTestBypass = () => {
    if (paymentIntentId) {
      console.log('DEVELOPMENT ONLY: Bypassing payment for testing');
      onSuccess(paymentIntentId);
    } else {
      setError('Cannot bypass payment - no payment intent created');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Download Meditation</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {!stripeLoaded && (
                <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg flex items-start">
                  <AlertTriangle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium">Stripe payment not loading correctly</p>
                    <p className="text-sm mt-1">
                      There was an issue initializing the payment system. This may be due to 
                      a configuration issue or network connection problem.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-indigo-900">Premium Meditation</h3>
                      <p className="text-sm text-indigo-700">High-quality audio + text</p>
                    </div>
                    <span className="text-2xl font-semibold text-indigo-900">$4.99</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {stripeLoaded ? (
                    <div className="p-4 border rounded-lg">
                      <CardElement 
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="p-4 border rounded-lg bg-gray-50 text-gray-500 text-center">
                      <p>Payment system loading...</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !stripe || !elements || !clientSecret}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>Pay Securely</span>
                      </>
                    )}
                  </button>
                  
                  {process.env.NODE_ENV !== 'production' && (
                    <button
                      type="button"
                      onClick={handleTestBypass}
                      className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg shadow-sm transition-colors mt-2"
                    >
                      Test Mode: Skip Payment
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Secure payment powered by Stripe
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;