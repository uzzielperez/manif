import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CouponInput from '../components/CouponInput';

const tiers = [
  {
    name: 'Starter',
    price: '€19/pack',
    features: [
      'Limited (5–10 chats/mo)',
      'Basic set',
      '1 starter template',
    ],
  },
  {
    name: 'Pro',
    price: '$97/mo',
    features: [
      'Unlimited',
      'Full library',
      'All templates',
    ],
  },

];

const featureLabels = [
  'AI Chat Access',
  'Manifestation Ritual Library',
  'Goal Templates',
];

const Program: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const handleStarterPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 19,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/program`,
          couponCode: couponCode,
          metadata: {
            product: 'starter_package',
            description: 'Manifestation AI Blueprint - Starter Package',
            coupon_used: couponCode || 'none'
          }
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error('Failed to create checkout session');
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto pb-10 text-white"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-4">Manifestation AI Blueprint</h1>
        <p className="text-xl text-center text-white/80 mb-12">Tier Comparison</p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-white/5 rounded-tl-lg">Feature</th>
                {tiers.map((tier, index) => (
                  <th key={tier.name} className={`p-4 bg-white/5 ${index === tiers.length - 1 ? 'rounded-tr-lg' : ''}`}>
                    <h3 className="text-2xl font-semibold">{tier.name}</h3>
                    <p className="text-sm text-white/70">{tier.price}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map((label, featureIndex) => (
                <tr key={label} className="border-b border-white/10">
                  <td className="p-4 font-medium">{label}</td>
                  {tiers.map(tier => (
                    <td key={`${tier.name}-${label}`} className="p-4 text-white/90">
                      {tier.features[featureIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td className="p-4 bg-white/5 rounded-bl-lg"></td>
                {tiers.map((tier, index) => (
                  <td
                    key={`${tier.name}-button`}
                    className={`p-4 text-center bg-white/5 ${
                      index === tiers.length - 1 ? 'rounded-br-lg' : ''
                    }`}
                  >
                    {tier.name === 'Starter' ? (
                      <div className="space-y-3">
                        <button
                          onClick={handleStarterPayment}
                          disabled={loading}
                          className={`w-full font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:hover:transform-none ${
                            couponCode.toUpperCase() === 'MAGIC25M'
                              ? 'bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white'
                          }`}
                        >
                          {loading 
                            ? 'Processing...' 
                            : couponCode.toUpperCase() === 'MAGIC25M' 
                              ? 'Get Free Access ✨' 
                              : 'Get Started - €19'
                          }
                        </button>
                        <CouponInput onCouponChange={setCouponCode} />
                      </div>
                    ) : (
                      <button
                        disabled
                        className="inline-block bg-white/20 text-white/80 font-semibold py-2 px-6 rounded-lg cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Program;
