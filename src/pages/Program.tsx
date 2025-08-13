import React from 'react';
import { motion } from 'framer-motion';

const tiers = [
  {
    name: 'Starter',
    price: '$49/mo',
    features: [
      'Limited (5–10 chats/mo)',
      'Basic set',
      '1 starter template',
      '1 drop/mo (5 leads)',
      '—',
      'Quarterly resource refresh',
    ],
  },
  {
    name: 'Pro',
    price: '$97/mo',
    features: [
      'Unlimited',
      'Full library',
      'All templates',
      'Weekly curated drops',
      'Private discussion board',
      'Monthly resource refresh',
    ],
  },
  {
    name: 'Elite',
    price: '$197/mo',
    features: [
      'Unlimited + monthly “focus session” AI plan',
      'Full library + 1 exclusive ritual per month',
      'All templates + pre-filled example goals',
      'Weekly drops + early access to next month’s leads',
      'Pro board + invite-only mastermind board',
      'Monthly refresh + bonus mini-course',
    ],
  },
];

const featureLabels = [
  'AI Chat Access',
  'Manifestation Ritual Library',
  'Goal Templates',
  'Opportunity Vault',
  'Community',
  'Updates',
];

const Program: React.FC = () => {
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
                      <a
                        href="https://buy.stripe.com/dRm7sK47keiJ5ada3ofjG00"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        Get Started
                      </a>
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
