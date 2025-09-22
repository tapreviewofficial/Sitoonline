import { SupabaseStorage } from "./lib/supabase-storage";
import type { User, InsertUser, InsertUserDb, Profile, InsertProfile, Link, InsertLink, Click, InsertClick, PasswordReset, InsertPasswordReset, PromotionalContact, InsertPromotionalContact } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUserDb): Promise<User>;
  updateUserPassword(id: number, hashedPassword: string): Promise<void>;
  updateUserMustChangePassword(userId: number, mustChange: boolean): Promise<void>;

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

  // Password reset methods
  createPasswordReset(reset: InsertPasswordReset): Promise<PasswordReset>;
  getPasswordResetByToken(token: string): Promise<(PasswordReset & { user: User }) | undefined>;
  markPasswordResetAsUsed(id: number): Promise<void>;
  invalidateUserPasswordResets(userId: number): Promise<void>;

  // Promotional contacts methods
  createOrUpdatePromotionalContact(contact: InsertPromotionalContact): Promise<PromotionalContact>;
  getPromotionalContacts(userId: number): Promise<PromotionalContact[]>;
  getAllPromotionalContacts(): Promise<PromotionalContact[]>;
}

// Ora usiamo Supabase invece di Prisma
export const storage: IStorage = new SupabaseStorage();