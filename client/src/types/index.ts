import { PublicKey } from "@solana/web3.js";

// Domain related types
export interface SolanaDomain {
  name: string;
  owner: PublicKey | null;
  expiresAt: Date | null;
}

export interface DomainSearchResponse {
  available: boolean;
  name: string;
  owner?: string;
  fee?: number;
  suggestions?: string[];
}

// Vanity wallet related types
export interface VanityWallet {
  id: string;
  publicKey: string;
  prefix: string;
  createdAt: Date;
}

// User related types
export interface UserDomain {
  name: string;
  registrationDate: Date;
  expiryDate: Date;
  status: "active" | "expiring" | "expired";
}

export interface UserBalance {
  sol: number;
  usd: number;
}
