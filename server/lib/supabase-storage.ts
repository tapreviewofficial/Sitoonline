// Storage layer per Supabase usando Drizzle ORM
import { eq, and, desc, asc, gte, lte, count, sql } from 'drizzle-orm';
import { db, users, profiles, links, clicks, passwordResets } from './supabase';
import type { IStorage } from '../storage';
import type { User, InsertUser, Profile, InsertProfile, Link, InsertLink, Click, InsertClick, PasswordReset, InsertPasswordReset } from "@shared/schema";

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    const user = result[0];
    if (!user) return undefined;
    return { ...user, role: user.role || 'USER' } as User;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = result[0];
    if (!user) return undefined;
    return { ...user, role: user.role || 'USER' } as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const user = result[0];
    if (!user) return undefined;
    return { ...user, role: user.role || 'USER' } as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    const newUser = result[0];
    return { ...newUser, role: newUser.role || 'USER' } as User;
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id));
  }

  // Profile methods
  async getProfile(userId: number): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return result[0] || undefined;
  }

  async getProfileByUsername(username: string): Promise<(Profile & { user: User }) | undefined> {
    const result = await db
      .select()
      .from(profiles)
      .leftJoin(users, eq(profiles.userId, users.id))
      .where(eq(users.username, username))
      .limit(1);
      
    if (!result[0] || !result[0].users) return undefined;
    
    return {
      ...result[0].profiles,
      user: result[0].users
    } as Profile & { user: User };
  }

  async upsertProfile(userId: number, profile: InsertProfile): Promise<Profile> {
    const result = await db
      .insert(profiles)
      .values({ ...profile, userId })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: profile
      })
      .returning();
    return result[0];
  }

  // Link methods
  async getLinks(userId: number): Promise<Link[]> {
    return await db.select().from(links).where(eq(links.userId, userId)).orderBy(asc(links.order));
  }

  async createLink(userId: number, link: InsertLink): Promise<Link> {
    const result = await db.insert(links).values({ ...link, userId }).returning();
    return result[0];
  }

  async updateLink(id: number, link: Partial<InsertLink>): Promise<Link> {
    const result = await db.update(links).set(link).where(eq(links.id, id)).returning();
    return result[0];
  }

  async deleteLink(id: number): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }

  async getLinksByUsername(username: string): Promise<Link[]> {
    const result = await db
      .select({
        id: links.id,
        title: links.title,
        url: links.url,
        order: links.order,
        userId: links.userId,
        createdAt: links.createdAt,
        clicks: links.clicks
      })
      .from(links)
      .leftJoin(users, eq(links.userId, users.id))
      .where(eq(users.username, username))
      .orderBy(asc(links.order));
      
    return result;
  }

  // Click methods
  async createClick(click: InsertClick): Promise<Click> {
    const result = await db.insert(clicks).values(click).returning();
    return result[0];
  }

  async incrementLinkClicks(linkId: number): Promise<void> {
    await db.update(links).set({ 
      clicks: sql`${links.clicks} + 1` 
    }).where(eq(links.id, linkId));
  }

  async getClickStats(userId: number): Promise<{ totalClicks: number; clicks7d: number; clicks30d: number }> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total clicks
    const totalResult = await db
      .select({ total: sql<number>`sum(${links.clicks})` })
      .from(links)
      .where(eq(links.userId, userId));

    // Clicks last 7 days
    const clicks7dResult = await db
      .select({ count: count() })
      .from(clicks)
      .leftJoin(links, eq(clicks.linkId, links.id))
      .where(and(
        eq(links.userId, userId),
        gte(clicks.createdAt, sevenDaysAgo)
      ));

    // Clicks last 30 days
    const clicks30dResult = await db
      .select({ count: count() })
      .from(clicks)
      .leftJoin(links, eq(clicks.linkId, links.id))
      .where(and(
        eq(links.userId, userId),
        gte(clicks.createdAt, thirtyDaysAgo)
      ));

    return {
      totalClicks: totalResult[0]?.total || 0,
      clicks7d: clicks7dResult[0]?.count || 0,
      clicks30d: clicks30dResult[0]?.count || 0
    };
  }

  async getLinkStats(userId: number): Promise<Array<{ id: number; title: string; clicksAllTime: number; clicks7d: number; clicks30d: number; order: number }>> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const result = await db
      .select({
        id: links.id,
        title: links.title,
        clicksAllTime: links.clicks,
        order: links.order,
        clicks7d: sql<number>`
          (SELECT COUNT(*) FROM ${clicks} 
           WHERE ${clicks.linkId} = ${links.id} 
           AND ${clicks.createdAt} >= ${sevenDaysAgo.toISOString()})
        `,
        clicks30d: sql<number>`
          (SELECT COUNT(*) FROM ${clicks} 
           WHERE ${clicks.linkId} = ${links.id} 
           AND ${clicks.createdAt} >= ${thirtyDaysAgo.toISOString()})
        `
      })
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(asc(links.order));

    return result.map(r => ({
      id: r.id,
      title: r.title,
      clicksAllTime: r.clicksAllTime || 0,
      clicks7d: Number(r.clicks7d),
      clicks30d: Number(r.clicks30d),
      order: r.order || 0
    }));
  }

  // Password reset methods
  async createPasswordReset(reset: InsertPasswordReset): Promise<PasswordReset> {
    const result = await db.insert(passwordResets).values({
      user_id: reset.userId,
      token: reset.token,
      expires_at: reset.expiresAt,
      used: reset.used ?? false
    }).returning();
    return result[0] as PasswordReset;
  }

  async getPasswordResetByToken(token: string): Promise<(PasswordReset & { user: User }) | undefined> {
    const result = await db
      .select()
      .from(passwordResets)
      .leftJoin(users, eq(passwordResets.userId, users.id))
      .where(eq(passwordResets.token, token))
      .limit(1);

    if (!result[0] || !result[0].users) return undefined;

    return {
      ...result[0].password_resets,
      user: result[0].users
    } as PasswordReset & { user: User };
  }

  async markPasswordResetAsUsed(id: number): Promise<void> {
    await db.update(passwordResets).set({ used: true }).where(eq(passwordResets.id, id));
  }

  async invalidateUserPasswordResets(userId: number): Promise<void> {
    await db.update(passwordResets).set({ used: true }).where(eq(passwordResets.userId, userId));
  }
}