import React from 'react';
import { motion } from 'framer-motion';

const tiers = [
  {
    name: 'Starter',
    price: '$29–$49/mo',
    features: [
      'Limited (5–10 chats/month)',
      'Basic set',
      'Basic template',
      '1 drop/month (3 job leads, 1 housing tip, 1 investment idea)',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
    ],
  },
  {
    name: 'Pro',
    price: '$97–$197/mo',
    features: [
      'Unlimited',
      'Full library',
      'All templates (budget tracker, job tracker, home timeline, investment planner)',
      'Weekly curated drops',
      '✔',
      '✔',
      '✔ (member forum & peer networking)',
      '—',
      '—',
      '—',
      'Email within 48 hrs',
    ],
  },
  {
    name: 'Elite',
    price: '$2k–$5k or $497/mo',
    features: [
      'Unlimited + “Concierge Mode” (AI proactively finds & sends new opportunities daily)',
      'Full library + custom rituals tailored to your exact goal',
      'All templates + pre-filled with your personal data & goals',
      'Full vault + lifetime updates + exclusive high-value leads',
      '✔ + Elite-only milestones & achievements',
      '✔ + advanced financial projections',
      '✔ + elite mastermind group',
      'Included (Notion/Sheets setup, automation integration)',
      '✔',
      '✔',
      'Dedicated VIP channel (priority within 4 hrs)',
    ],
  },
];

const featureLabels = [
  'AI Chat Access',
  'Manifestation Ritual Library',
  'Goal-Setting & Planning Templates',
  'Opportunity Vault Access',
  'Gamified Progress Dashboard',
  'ROI & Goal Calculators',
  'Community Access',
  'Done-for-You Setup',
  'Lifetime Vault Updates',
  'Exclusive Data Sources',
  'Priority Support',
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
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Program;
