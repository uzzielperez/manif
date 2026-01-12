import { pgTable, text, serial, timestamp, integer, jsonb, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Marketing Agents Database Schema
 * Stores agent configurations, actions, performance metrics, and learnings
 */

// Agent configurations
export const marketingAgents = pgTable("marketing_agents", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").notNull().unique(),
  name: text("name").notNull(),
  channel: text("channel").notNull(), // 'twitter', 'reddit', 'tiktok', 'instagram', 'email', 'blog'
  enabled: boolean("enabled").default(true),
  config: jsonb("config").notNull(), // Full agent configuration JSON
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Agent actions (posts, replies, emails, etc.)
export const agentActions = pgTable("agent_actions", {
  id: serial("id").primaryKey(),
  actionId: text("action_id").notNull().unique(),
  agentId: text("agent_id").notNull(),
  type: text("type").notNull(), // 'post', 'reply', 'comment', 'email', 'schedule'
  channel: text("channel").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // Additional metadata (hashtags, media URLs, etc.)
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'posted', 'failed'
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  postedAt: timestamp("posted_at", { withTimezone: true }),
});

// Agent performance metrics
export const agentPerformance = pgTable("agent_performance", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  actionId: text("action_id").notNull(),
  metrics: jsonb("metrics").notNull(), // Engagement, conversions, reach data
  score: real("score").notNull(), // Calculated performance score (0-100)
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
});

// Agent learnings (accumulated insights)
export const agentLearnings = pgTable("agent_learnings", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").notNull().unique(),
  learnings: jsonb("learnings").notNull(), // Best performing patterns, optimal times, etc.
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
});

// Content library (generated content for reuse/approval)
export const contentLibrary = pgTable("content_library", {
  id: serial("id").primaryKey(),
  contentId: text("content_id").notNull().unique(),
  channel: text("channel").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // Keywords, hashtags, estimated engagement
  status: text("status").notNull().default("draft"), // 'draft', 'approved', 'scheduled', 'posted'
  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
});

// Buyer attribution (linking purchases to marketing channels)
export const buyerAttribution = pgTable("buyer_attribution", {
  id: serial("id").primaryKey(),
  purchaseId: text("purchase_id").notNull(), // Stripe payment intent ID
  agentId: text("agent_id"), // Which agent/channel led to purchase
  actionId: text("action_id"), // Specific action that led to purchase
  channel: text("channel"), // Marketing channel
  customerEmail: text("customer_email"),
  amount: integer("amount").notNull(), // Amount in cents
  revenue: real("revenue").notNull(), // Revenue amount
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Schemas for validation
export const insertMarketingAgentSchema = createInsertSchema(marketingAgents)
  .pick({ agentId: true, name: true, channel: true, config: true })
  .extend({
    agentId: z.string().min(1),
    name: z.string().min(1),
    channel: z.enum(['twitter', 'reddit', 'tiktok', 'instagram', 'email', 'blog']),
    config: z.record(z.any()),
  });

export const insertAgentActionSchema = createInsertSchema(agentActions)
  .pick({ actionId: true, agentId: true, type: true, channel: true, content: true, metadata: true })
  .extend({
    actionId: z.string().min(1),
    agentId: z.string().min(1),
    type: z.enum(['post', 'reply', 'comment', 'email', 'schedule']),
    channel: z.string().min(1),
    content: z.string().min(1),
    metadata: z.record(z.any()).optional(),
  });

export const insertAgentPerformanceSchema = createInsertSchema(agentPerformance)
  .pick({ agentId: true, actionId: true, metrics: true, score: true })
  .extend({
    agentId: z.string().min(1),
    actionId: z.string().min(1),
    metrics: z.record(z.any()),
    score: z.number().min(0).max(100),
  });

export const insertBuyerAttributionSchema = createInsertSchema(buyerAttribution)
  .pick({ purchaseId: true, agentId: true, actionId: true, channel: true, customerEmail: true, amount: true, revenue: true })
  .extend({
    purchaseId: z.string().min(1),
    agentId: z.string().optional(),
    actionId: z.string().optional(),
    channel: z.string().optional(),
    customerEmail: z.string().email().optional(),
    amount: z.number().int().positive(),
    revenue: z.number().positive(),
  });

// Type exports
export type MarketingAgent = typeof marketingAgents.$inferSelect;
export type AgentAction = typeof agentActions.$inferSelect;
export type AgentPerformance = typeof agentPerformance.$inferSelect;
export type AgentLearning = typeof agentLearnings.$inferSelect;
export type ContentLibrary = typeof contentLibrary.$inferSelect;
export type BuyerAttribution = typeof buyerAttribution.$inferSelect;

export type InsertMarketingAgent = z.infer<typeof insertMarketingAgentSchema>;
export type InsertAgentAction = z.infer<typeof insertAgentActionSchema>;
export type InsertAgentPerformance = z.infer<typeof insertAgentPerformanceSchema>;
export type InsertBuyerAttribution = z.infer<typeof insertBuyerAttributionSchema>;
