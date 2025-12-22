import { sql } from "drizzle-orm";
import { integer, text, pgTable, pgSchema, timestamp, varchar, decimal, boolean, serial, uuid, index, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schema tapreview per Supabase
export const tapreviewSchema = pgSchema("tapreview");

// Tabelle nello schema tapreview - usano tapreviewSchema.table() invece di pgTable()
export const users = tapreviewSchema.table("tr_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  username: text("username").notNull().unique(),
  role: text("role").notNull().default("USER"),
  mustChangePassword: boolean("must_change_password").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const profiles = tapreviewSchema.table("tr_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  accentColor: text("accent_color").default("#CC9900"),
  businessName: text("business_name"),
  description: text("description"),
  logoUrl: text("logo_url"),
  backgroundUrl: text("background_url"),
  themeColor: text("theme_color"),
  customMessage: text("custom_message"),
  isActive: boolean("is_active").default(true),
});

export const links = tapreviewSchema.table("tr_links", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  orderIndex: integer("order_index").default(0),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  profileIdIdx: index("links_profile_id_idx").on(table.profileId),
}));

export const clicks = tapreviewSchema.table("tr_clicks", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").notNull().references(() => links.id, { onDelete: "cascade" }),
  clickedAt: timestamp("clicked_at").default(sql`CURRENT_TIMESTAMP`),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  referer: text("referer"),
  ipHash: text("ip_hash"),
});

export const passwordResets = tapreviewSchema.table("tr_password_resets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const publicPages = tapreviewSchema.table("public_pages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  theme: text("theme"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const promos = tapreviewSchema.table("promos", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  publicPageId: integer("public_page_id").references(() => publicPages.id),
  title: text("title").notNull(),
  description: text("description"),
  discountCode: text("discount_code"),
  validUntil: timestamp("valid_until"),
  isActive: boolean("is_active").default(true),
  valueKind: varchar("value_kind", { length: 20 }),
  value: decimal("value", { precision: 10, scale: 2 }),
  startAt: timestamp("start_at"),
  endAt: timestamp("end_at"),
  maxCodes: integer("max_codes").default(100),
  usesPerCode: integer("uses_per_code").default(1),
  codeFormat: varchar("code_format", { length: 20 }).default("short"),
  qrMode: varchar("qr_mode", { length: 20 }).default("url"),
  active: boolean("active").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  profileIdIdx: index("promos_profile_id_idx").on(table.profileId),
  activeIdx: index("promos_active_idx").on(table.active),
}));

export const tickets = tapreviewSchema.table("tickets", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  title: text("title"),
  description: text("description"),
  status: text("status").default("ACTIVE"),
  validUntil: timestamp("valid_until"),
  customerSurname: varchar("customer_surname", { length: 255 }),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  statusIdx: index("tickets_status_idx").on(table.status),
  profileIdIdx: index("tickets_profile_id_idx").on(table.profileId),
}));

export const scanLogs = tapreviewSchema.table("scan_logs", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id),
  result: varchar("result", { length: 20 }).notNull(),
  at: timestamp("at").default(sql`CURRENT_TIMESTAMP`),
  meta: text("meta"),
}, (table) => ({
  ticketIdIdx: index("scan_logs_ticket_id_idx").on(table.ticketId),
}));

export const promotionalContacts = tapreviewSchema.table("promotional_contacts", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lastPromoRequested: varchar("last_promo_requested", { length: 255 }),
  totalPromoRequests: integer("total_promo_requests").default(1),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const promoEmails = tapreviewSchema.table("promo_emails", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  email: text("email"),
  code: text("code"),
  promoTitle: text("promo_title"),
  status: text("status").default("queued"),
  error: text("error"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Codici tracciabili per recensioni (struttura semplificata)
export const reviewCodes = tapreviewSchema.table("review_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  expiresAt: timestamp("expires_at"),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  password_hash: true,
  createdAt: true,
}).extend({
  password: z.string().min(6),
});

export const insertUserDbSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true,
});

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  profileId: true,
  createdAt: true,
  clicks: true,
});

export const insertClickSchema = createInsertSchema(clicks).omit({
  id: true,
  createdAt: true,
  clickedAt: true,
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
  profileId: true,
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

export const insertPromotionalContactSchema = createInsertSchema(promotionalContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPromoEmailSchema = createInsertSchema(promoEmails).omit({
  id: true,
  createdAt: true,
});

export const insertReviewCodeSchema = createInsertSchema(reviewCodes).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserDb = z.infer<typeof insertUserDbSchema>;
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
export type InsertPromotionalContact = z.infer<typeof insertPromotionalContactSchema>;
export type PromotionalContact = typeof promotionalContacts.$inferSelect;
export type InsertPromoEmail = z.infer<typeof insertPromoEmailSchema>;
export type PromoEmail = typeof promoEmails.$inferSelect;
export type InsertReviewCode = z.infer<typeof insertReviewCodeSchema>;
export type ReviewCode = typeof reviewCodes.$inferSelect;
