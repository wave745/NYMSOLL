import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { NameRegistryState } from '@bonfida/spl-name-service';

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

/**
 * Check if a domain name is available
 */
export async function checkDomainAvailability(domainName: string): Promise<boolean> {
  try {
    const { pubkey } = await getDomainKey(`${domainName}.sol`);
    const owner = await NameRegistryState.retrieve(connection, pubkey);
    return !owner;
  } catch (error) {
    // If domain doesn't exist yet, it will throw an error
    return true;
  }
}

/**
 * Get domain key from domain name
 */
export async function getDomainKey(domainName: string): Promise<{ pubkey: PublicKey }> {
  try {
    // Get the .sol TLD key - this is a known value for Solana naming service
    const SOL_TLD_AUTHORITY = new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx");
    
    // Create a key for the domain name
    const hashedName = await NameRegistryState.hashName(domainName);
    const domainKey = await NameRegistryState.createNameRegistryKey(
      hashedName,
      SOL_TLD_AUTHORITY,
      undefined
    );
    
    return { pubkey: domainKey };
  } catch (error) {
    console.error("Error getting domain key:", error);
    throw error;
  }
}

/**
 * Get owner of a domain name
 */
export async function getDomainOwner(domainName: string): Promise<PublicKey | null> {
  try {
    const { pubkey } = await getDomainKey(`${domainName}.sol`);
    const nameRegistry = await NameRegistryState.retrieve(connection, pubkey);
    return nameRegistry.owner;
  } catch (error) {
    console.error("Error getting domain owner:", error);
    return null;
  }
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