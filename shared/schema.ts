import { sql } from "drizzle-orm";
import { integer, text, pgTable, timestamp, pgEnum, pgSchema, varchar, decimal, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema dedicato per TapReview per evitare conflitti con tabelle esistenti
const tapreview = pgSchema("tapreview");

export const userRoleEnum = tapreview.enum("trv_user_role", ["USER", "ADMIN"]);
export const ticketStatusEnum = tapreview.enum("trv_ticket_status", ["ACTIVE", "USED", "EXPIRED"]);

export const users = tapreview.table("tr_users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username").notNull().unique(),
  role: userRoleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const profiles = tapreview.table("tr_profiles", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  accentColor: text("accent_color").default("#CC9900"),
});

export const links = tapreview.table("tr_links", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  clicks: integer("clicks").default(0),
});

export const clicks = tapreview.table("tr_clicks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  linkId: integer("link_id").notNull().references(() => links.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  userAgent: text("user_agent"),
  referer: text("referer"),
  ipHash: text("ip_hash"),
});

export const passwordResets = tapreview.table("tr_password_resets", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false), // Fixed per PostgreSQL
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Public Pages table
export const publicPages = tapreview.table("public_pages", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  theme: text("theme"), // JSON string per colori, layout, etc.
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Promos table
export const promos = tapreview.table("promos", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  publicPageId: integer("public_page_id").references(() => publicPages.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // 'coupon' | 'invito' | 'omaggio'
  valueKind: varchar("value_kind", { length: 20 }), // 'percent' | 'amount'
  value: decimal("value", { precision: 10, scale: 2 }),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),
  maxCodes: integer("max_codes").default(100),
  usesPerCode: integer("uses_per_code").default(1),
  codeFormat: varchar("code_format", { length: 20 }).default("short"), // 'short' | 'uuid'
  qrMode: varchar("qr_mode", { length: 20 }).default("url"), // 'url' | 'jwt'
  active: boolean("active").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Tickets table
export const tickets = tapreview.table("tickets", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  promoId: integer("promo_id").notNull().references(() => promos.id, { onDelete: "cascade" }),
  customerName: varchar("customer_name", { length: 255 }),
  customerSurname: varchar("customer_surname", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  qrUrl: text("qr_url").notNull(),
  status: varchar("status", { length: 20 }).default("ACTIVE"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  expiresAt: timestamp("expires_at"),
});

// Scan Logs table
export const scanLogs = tapreview.table("scan_logs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  ticketId: integer("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id),
  result: varchar("result", { length: 20 }).notNull(), // 'valid'|'expired'|'used'
  at: timestamp("at").default(sql`CURRENT_TIMESTAMP`),
  meta: text("meta"), // userAgent, ip hash, device info
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

export const insertPasswordResetSchema = createInsertSchema(passwordResets).omit({
  id: true,
  createdAt: true,
});

export const insertPublicPageSchema = createInsertSchema(publicPages).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPromoSchema = createInsertSchema(promos).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  expiresAt: true,
  usedAt: true,
});

export const insertScanLogSchema = createInsertSchema(scanLogs).omit({
  id: true,
  at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;
export type InsertClick = z.infer<typeof insertClickSchema>;
export type Click = typeof clicks.$inferSelect;
export type InsertPasswordReset = z.infer<typeof insertPasswordResetSchema>;
export type PasswordReset = typeof passwordResets.$inferSelect;
export type InsertPublicPage = z.infer<typeof insertPublicPageSchema>;
export type PublicPage = typeof publicPages.$inferSelect;
export type InsertPromo = z.infer<typeof insertPromoSchema>;
export type Promo = typeof promos.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertScanLog = z.infer<typeof insertScanLogSchema>;
export type ScanLog = typeof scanLogs.$inferSelect;
