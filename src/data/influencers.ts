export interface Influencer {
  id: string;
  name: string;
  code: string;
  commissionRate: number; // e.g., 0.25 for 25%
  payoutMethod: 'stripe' | 'paypal';
}

export const INFLUENCERS: Influencer[] = [
  {
    id: 'inf-1',
    name: 'Magic Master',
    code: 'Magic25M',
    commissionRate: 0.25,
    payoutMethod: 'stripe',
  },
  {
    id: 'inf-2',
    name: 'Stellar Guide',
    code: 'STARS10',
    commissionRate: 0.20,
    payoutMethod: 'paypal',
  },
  {
    id: 'inf-3',
    name: 'Quantum Creator',
    code: 'QUANTUM50',
    commissionRate: 0.30,
    payoutMethod: 'stripe',
  },
];

export function getInfluencerByCode(code: string): Influencer | undefined {
  return INFLUENCERS.find(inf => inf.code.toUpperCase() === code.toUpperCase());
}

