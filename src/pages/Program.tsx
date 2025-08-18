import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
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
  {
    name: 'Enterprise',
    price: '€200/pack',
    features: [
      'Business strategy tools',
      'Vision & mission templates',
      'Financial projections',
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
  const [searchParams] = useSearchParams();

  // Auto-populate coupon code from referral links
  useEffect(() => {
    const refCode = searchParams.get('ref');
    const couponParam = searchParams.get('coupon');
    
    if (refCode) {
      // Convert referral code to coupon code (e.g., ref=sarah25 -> coupon=SARAH25)
      setCouponCode(refCode.toUpperCase());
    } else if (couponParam) {
      setCouponCode(couponParam.toUpperCase());
    }

    // Track the referral click
    if (refCode) {
      trackReferralClick(refCode);
    }
  }, [searchParams]);

  const trackReferralClick = async (refCode: string) => {
    try {
      await fetch('/.netlify/functions/track-referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referral_code: refCode,
          referral_url: document.referrer,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.log('Referral tracking failed:', error);
    }
  };

  const handleStarterPayment = () => {
    setLoading(true);
    
    // Use the direct Stripe payment link
    let paymentUrl = 'https://buy.stripe.com/dRmcN7eAI3MO33P81KcfK03';
    
    // Add success and cancel URLs as parameters
    const successUrl = encodeURIComponent(`${window.location.origin}/payment-success`);
    const cancelUrl = encodeURIComponent(`${window.location.origin}/program`);
    
    // Append success and cancel URLs
    paymentUrl += `?success_url=${successUrl}&cancel_url=${cancelUrl}`;
    
    // Handle Magic25M code for free access
    if (couponCode.toUpperCase() === 'MAGIC25M') {
      // Grant free access immediately
      localStorage.setItem('manifestation_access', 'true');
      localStorage.setItem('magic25m_used', 'true');
      
      // Redirect directly to success page
      window.location.href = `${window.location.origin}/payment-success?magic25m=true`;
      return;
    }
    
    // Redirect to Stripe payment link for regular purchases
    window.location.href = paymentUrl;
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
                        <CouponInput onCouponChange={setCouponCode} initialCoupon={couponCode} />
                      </div>
                    ) : tier.name === 'Enterprise' ? (
                      <div className="space-y-2">
                        <button
                          disabled
                          className="w-full bg-purple-600/50 text-white/80 font-semibold py-2 px-6 rounded-lg cursor-not-allowed"
                        >
                          Coming Soon
                        </button>
                        <div className="text-xs text-white/60">
                          €200 Enterprise Package
                        </div>
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
