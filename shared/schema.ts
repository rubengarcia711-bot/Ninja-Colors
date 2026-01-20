import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface ColoringPage {
  id: string;
  name: string;
  category: "ninja" | "brainrot" | "battle";
  svgContent: string;
  thumbnail: string;
  isNew?: boolean;
}

export interface SavedArtwork {
  id: string;
  coloringPageId: string;
  colorData: Record<string, string>;
  completedAt: string;
  name: string;
}

export const coloringPageSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["ninja", "brainrot", "battle"]),
  svgContent: z.string(),
  thumbnail: z.string(),
  isNew: z.boolean().optional(),
});

export const savedArtworkSchema = z.object({
  id: z.string(),
  coloringPageId: z.string(),
  colorData: z.record(z.string(), z.string()),
  completedAt: z.string(),
  name: z.string(),
});

export const insertSavedArtworkSchema = savedArtworkSchema.omit({ id: true, completedAt: true });

export type InsertSavedArtwork = z.infer<typeof insertSavedArtworkSchema>;
