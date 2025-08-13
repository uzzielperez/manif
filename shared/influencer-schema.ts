import { z } from 'zod';

// Influencer Schema
export const influencerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  social_handle: z.string(),
  platform: z.enum(['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'other']),
  coupon_code: z.string(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_amount: z.number(),
  commission_rate: z.number(), // Percentage they get from each sale
  is_active: z.boolean().default(true),
  created_at: z.date(),
  updated_at: z.date()
});

// Influencer Performance Schema
export const influencerPerformanceSchema = z.object({
  id: z.string(),
  influencer_id: z.string(),
  payment_intent_id: z.string(),
  session_id: z.string().optional(),
  customer_email: z.string().optional(),
  original_amount: z.number(),
  discount_amount: z.number(),
  final_amount: z.number(),
  commission_amount: z.number(),
  commission_paid: z.boolean().default(false),
  referral_source: z.string().optional(), // URL they came from
  created_at: z.date()
});

// Referral Click Tracking Schema
export const referralClickSchema = z.object({
  id: z.string(),
  influencer_id: z.string(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  referral_url: z.string().optional(),
  clicked_at: z.date()
});

export type Influencer = z.infer<typeof influencerSchema>;
export type InfluencerPerformance = z.infer<typeof influencerPerformanceSchema>;
export type ReferralClick = z.infer<typeof referralClickSchema>;

// API Schemas
export const createInfluencerSchema = influencerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const updateInfluencerSchema = createInfluencerSchema.partial();

export type CreateInfluencer = z.infer<typeof createInfluencerSchema>;
export type UpdateInfluencer = z.infer<typeof updateInfluencerSchema>;
