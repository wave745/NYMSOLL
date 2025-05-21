import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Domains table
export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  registrationDate: timestamp("registration_date").defaultNow(),
  expiryDate: timestamp("expiry_date").notNull(),
  status: text("status").notNull(),
});

// Vanity wallets table
export const vanityWallets = pgTable("vanity_wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  publicKey: text("public_key").notNull(),
  prefix: text("prefix").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertDomainSchema = createInsertSchema(domains).pick({
  name: true,
  userId: true,
  expiryDate: true,
  status: true,
});

export const insertVanityWalletSchema = createInsertSchema(vanityWallets).pick({
  userId: true,
  publicKey: true,
  prefix: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Domain = typeof domains.$inferSelect;

export type InsertVanityWallet = z.infer<typeof insertVanityWalletSchema>;
export type VanityWallet = typeof vanityWallets.$inferSelect;
