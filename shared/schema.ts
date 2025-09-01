import { sql } from "drizzle-orm";
import { integer, text, pgTable, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username").notNull().unique(),
  role: userRoleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const profiles = pgTable("profiles", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  accentColor: text("accent_color").default("#CC9900"),
});

export const links = pgTable("links", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  clicks: integer("clicks").default(0),
});

export const clicks = pgTable("clicks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  linkId: integer("link_id").notNull().references(() => links.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  userAgent: text("user_agent"),
  referer: text("referer"),
  ipHash: text("ip_hash"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true,
});

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  userId: true,
  createdAt: true,
  clicks: true,
});

export const insertClickSchema = createInsertSchema(clicks).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;
export type InsertClick = z.infer<typeof insertClickSchema>;
export type Click = typeof clicks.$inferSelect;
