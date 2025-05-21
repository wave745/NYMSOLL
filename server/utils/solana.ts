import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Set up Solana connection (use mainnet-beta)
const RPC_ENDPOINT = process.env.SOLANA_RPC_URL || clusterApiUrl('mainnet-beta');
export const connection = new Connection(RPC_ENDPOINT);

/**
 * Truncates a Solana address for display
 */
export function truncateAddress(address: string, length = 4): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

// Simplified implementations for domain-related functions
// In a real implementation, these would interact with the Solana blockchain

interface DomainInfo {
  available: boolean;
  owner: string;
}

/**
 * Domain data for common domains
 */
const MOCK_DOMAINS: Record<string, DomainInfo> = {
  'solana': { 
    available: false, 
    owner: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' 
  },
  'crypto': { 
    available: false, 
    owner: '7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi' 
  },
  'bitcoin': { 
    available: false, 
    owner: '9CgzHNMUog4ZVvFu7diVQRyaP2VYruqnS5sAr7XGStBq' 
  },
  'ethereum': { 
    available: false, 
    owner: '39K1snWYPzxiGZjKG9GKcSbGLqeNyzYPJjZ4EUPVxeVY' 
  },
  'nft': { 
    available: false, 
    owner: '5ZWj7a1f8tWkjBESHKgrLmXshuXxqeYvRN5ynRJWxiQg' 
  }
};

/**
 * Check if a domain name is available
 */
export async function checkDomainAvailability(domainName: string): Promise<boolean> {
  // For predefined domains, return their status
  const lowerName = domainName.toLowerCase();
  if (MOCK_DOMAINS[lowerName]) {
    return false;
  }
  
  // For simplicity, use a deterministic algorithm to make some domains 
  // available and some unavailable
  const sum = domainName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return sum % 5 !== 0; // 80% of domains are available
}

/**
 * Get domain key from domain name (simplified)
 */
export async function getDomainKey(domainName: string): Promise<{ pubkey: PublicKey }> {
  // Just create a deterministic public key based on the domain name
  const seed = new Uint8Array(Buffer.from(domainName));
  const keyPair = PublicKey.findProgramAddressSync([seed], 
    new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx')
  );
  
  return { pubkey: keyPair[0] };
}

/**
 * Get owner of a domain name
 */
export async function getDomainOwner(domainName: string): Promise<PublicKey | null> {
  const name = domainName.replace('.sol', '').toLowerCase();
  
  // Check if domain is in our mock data
  if (MOCK_DOMAINS[name]) {
    return new PublicKey(MOCK_DOMAINS[name].owner);
  }
  
  // For other domains, generate deterministic "owner" for unavailable domains
  const isAvailable = await checkDomainAvailability(name);
  if (isAvailable) {
    return null; // Available domains have no owner
  }
  
  // Generate a deterministic public key based on domain name
  const seed = new Uint8Array(Buffer.from('owner-' + name));
  const [ownerKey] = PublicKey.findProgramAddressSync(
    [seed],
    new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx')
  );
  
  return ownerKey;
}

/**
 * Generate similar domain suggestions
 */
export function generateSimilarDomains(domain: string): string[] {
  const suggestions: string[] = [];
  
  // Add a number at the end
  suggestions.push(`${domain}01.sol`);
  
  // Add a prefix
  suggestions.push(`my${domain}.sol`);
  suggestions.push(`the${domain}.sol`);
  
  // Add a suffix
  suggestions.push(`${domain}-nft.sol`);
  suggestions.push(`${domain}-sol.sol`);
  
  return suggestions;
}

/**
 * Calculate domain registration fee
 */
export function calculateDomainFee(domain: string): number {
  // Calculate based on domain length - shorter domains cost more
  if (domain.length <= 3) {
    return 2.5; // SOL
  } else if (domain.length <= 5) {
    return 1.0; // SOL
  } else {
    return 0.5; // SOL
  }
}