import { prisma } from "./lib/prisma";
import type { User, InsertUser, Profile, InsertProfile, Link, InsertLink } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
}

export class PrismaStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
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
}

export const storage = new PrismaStorage();
