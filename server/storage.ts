import { prisma } from "./lib/prisma";
import type { User, InsertUser, Profile, InsertProfile, Link, InsertLink, Click, InsertClick } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, hashedPassword: string): Promise<void>;

  // Profile methods
  getProfile(userId: number): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<(Profile & { user: User }) | undefined>;
  upsertProfile(userId: number, profile: InsertProfile): Promise<Profile>;

  // Link methods
  getLinks(userId: number): Promise<Link[]>;
  createLink(userId: number, link: InsertLink): Promise<Link>;
  updateLink(id: number, link: Partial<InsertLink>): Promise<Link>;
  deleteLink(id: number): Promise<void>;
  getLinksByUsername(username: string): Promise<Link[]>;
  
  // Click methods
  createClick(click: InsertClick): Promise<Click>;
  incrementLinkClicks(linkId: number): Promise<void>;
  getClickStats(userId: number): Promise<{ totalClicks: number; clicks7d: number; clicks30d: number }>;
  getLinkStats(userId: number): Promise<Array<{ id: number; title: string; clicksAllTime: number; clicks7d: number; clicks30d: number; order: number }>>;
}

export class PrismaStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user || undefined;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { username } });
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    return await prisma.user.create({ data: user });
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async getProfile(userId: number): Promise<Profile | undefined> {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return profile || undefined;
  }

  async getProfileByUsername(username: string): Promise<(Profile & { user: User }) | undefined> {
    const profile = await prisma.profile.findFirst({
      where: { user: { username } },
      include: { user: true },
    });
    return profile || undefined;
  }

  async upsertProfile(userId: number, profile: InsertProfile): Promise<Profile> {
    return await prisma.profile.upsert({
      where: { userId },
      update: profile,
      create: { ...profile, userId },
    });
  }

  async getLinks(userId: number): Promise<Link[]> {
    return await prisma.link.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
  }

  async createLink(userId: number, link: InsertLink): Promise<Link> {
    const count = await prisma.link.count({ where: { userId } });
    return await prisma.link.create({
      data: { ...link, userId, order: link.order ?? count },
    });
  }

  async updateLink(id: number, link: Partial<InsertLink>): Promise<Link> {
    return await prisma.link.update({
      where: { id },
      data: link,
    });
  }

  async deleteLink(id: number): Promise<void> {
    await prisma.link.delete({ where: { id } });
  }

  async getLinksByUsername(username: string): Promise<Link[]> {
    return await prisma.link.findMany({
      where: { user: { username } },
      orderBy: { order: "asc" },
    });
  }

  async createClick(click: InsertClick): Promise<Click> {
    return await prisma.click.create({ data: click });
  }

  async incrementLinkClicks(linkId: number): Promise<void> {
    await prisma.link.update({
      where: { id: linkId },
      data: { clicks: { increment: 1 } },
    });
  }

  async getClickStats(userId: number): Promise<{ totalClicks: number; clicks7d: number; clicks30d: number }> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalResult, clicks7d, clicks30d] = await Promise.all([
      prisma.link.aggregate({
        where: { userId },
        _sum: { clicks: true },
      }),
      prisma.click.count({
        where: {
          link: { userId },
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.click.count({
        where: {
          link: { userId },
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    return {
      totalClicks: totalResult._sum.clicks || 0,
      clicks7d,
      clicks30d,
    };
  }

  async getLinkStats(userId: number): Promise<Array<{ id: number; title: string; clicksAllTime: number; clicks7d: number; clicks30d: number; order: number }>> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const links = await prisma.link.findMany({
      where: { userId },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            Click: true,
          },
        },
      },
    });

    const linkStats = await Promise.all(
      links.map(async (link) => {
        const [clicks7d, clicks30d] = await Promise.all([
          prisma.click.count({
            where: {
              linkId: link.id,
              createdAt: { gte: sevenDaysAgo },
            },
          }),
          prisma.click.count({
            where: {
              linkId: link.id,
              createdAt: { gte: thirtyDaysAgo },
            },
          }),
        ]);

        return {
          id: link.id,
          title: link.title,
          clicksAllTime: link.clicks,
          clicks7d,
          clicks30d,
          order: link.order,
        };
      })
    );

    return linkStats;
  }
}

export const storage = new PrismaStorage();
