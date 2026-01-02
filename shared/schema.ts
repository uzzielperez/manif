import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const meditations = pgTable("meditations", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  content: text("content"),
  rating: integer("rating"),
  model: text("model"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const influencerEvents = pgTable("influencer_events", {
  id: serial("id").primaryKey(),
  influencerId: text("influencer_id").notNull(),
  eventType: text("event_type").notNull(), // 'unlock', 'payment', 'signup'
  amount: integer("amount").default(0), // amount in cents if applicable
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});

export const meditationsRelations = relations(meditations, ({ many }) => ({}));

export const insertMeditationSchema = createInsertSchema(meditations)
  .pick({ prompt: true, model: true })
  .extend({
    prompt: z.string().min(1, "Please enter a meditation prompt"),
    model: z.string().optional(),
  });

export const updateMeditationSchema = createInsertSchema(meditations)
  .pick({ rating: true })
  .extend({
    rating: z.number().min(1).max(5),
  });

export const insertInfluencerEventSchema = createInsertSchema(influencerEvents);

export type InsertMeditation = z.infer<typeof insertMeditationSchema>;
export type UpdateMeditation = z.infer<typeof updateMeditationSchema>;
export type Meditation = typeof meditations.$inferSelect;
export type InfluencerEvent = typeof influencerEvents.$inferSelect;
export type InsertInfluencerEvent = z.infer<typeof insertInfluencerEventSchema>;
