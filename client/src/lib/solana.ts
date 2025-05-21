import { Connection, PublicKey, clusterApiUrl, Transaction } from "@solana/web3.js";
import { NameRegistryState } from "@bonfida/spl-name-service";

// Set up Solana connection (use mainnet-beta)
// Use import.meta.env for Vite environment variables
const RPC_ENDPOINT = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta');
export const connection = new Connection(RPC_ENDPOINT);

/**
 * Truncates a Solana address for display
 */
export function truncateAddress(address: string, length = 4): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

// Mock domains data for the frontend - in a real app, these would come from the blockchain
const MOCK_DOMAINS: Record<string, { owner: string }> = {
  'solana': { owner: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  'crypto': { owner: '7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi' },
  'bitcoin': { owner: '9CgzHNMUog4ZVvFu7diVQRyaP2VYruqnS5sAr7XGStBq' },
  'ethereum': { owner: '39K1snWYPzxiGZjKG9GKcSbGLqeNyzYPJjZ4EUPVxeVY' },
  'nft': { owner: '5ZWj7a1f8tWkjBESHKgrLmXshuXxqeYvRN5ynRJWxiQg' }
};

/**
 * Check if a domain name is available
 */
export async function checkDomainAvailability(domainName: string): Promise<boolean> {
  try {
    // For demo purposes, check our mock data first
    const lowerName = domainName.toLowerCase();
    if (MOCK_DOMAINS[lowerName]) {
      return false;
    }

    // For other domains, use a deterministic approach for the demo
    const sum = domainName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return sum % 5 !== 0; // 80% of domains are available
  } catch (error) {
    console.error("Error checking domain availability:", error);
    return true;
  }
}

/**
 * Get domain key from domain name
 */
export async function getDomainKey(domainName: string): Promise<{ pubkey: PublicKey }> {
  // For demo, generate a deterministic pubkey from the domain name
  const input = new TextEncoder().encode(domainName);
  const seed = new Uint8Array(input);
  const [pubkey] = PublicKey.findProgramAddressSync(
    [seed],
    new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
  );
  
  return { pubkey };
}

/**
 * Get owner of a domain name
 */
export async function getDomainOwner(domainName: string): Promise<PublicKey | null> {
  try {
    const name = domainName.replace('.sol', '').toLowerCase();
    
    // Check our mock data first
    if (MOCK_DOMAINS[name]) {
      return new PublicKey(MOCK_DOMAINS[name].owner);
    }
    
    // For demo, determine if domain is available
    const isAvailable = await checkDomainAvailability(name);
    if (isAvailable) {
      return null; // Available domains have no owner
    }
    
    // For unavailable domains not in mock data, generate a deterministic public key
    const seed = new TextEncoder().encode('owner-' + name);
    const [ownerKey] = PublicKey.findProgramAddressSync(
      [seed],
      new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx')
    );
    
    return ownerKey;
  } catch (error) {
    console.error("Error getting domain owner:", error);
    return null;
  }
}

/**
 * Signs and sends a transaction
 */
export async function signAndSendTransaction(transaction: Transaction): Promise<string> {
  if (!window.solana) {
    throw new Error("Phantom wallet not found");
  }

  try {
    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    
    // For Phantom wallet integration in our demo
    // We check if the wallet is connected and has the necessary methods
    if (!window.solana.publicKey) {
      throw new Error("Wallet not connected");
    }
    
    // Set the fee payer to the connected wallet
    transaction.feePayer = window.solana.publicKey;
    
    // Use the Phantom wallet to sign the transaction
    // Note: This is a simplified implementation for the demo
    // In a real app, we would need to handle different wallet adapters
    const signed = await window.solana.signTransaction?.(transaction);
    if (!signed) {
      throw new Error("Failed to sign transaction");
    }
    
    // Send the transaction
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // Confirm the transaction
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error("Error signing and sending transaction:", error);
    throw error;
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
  
  // Add a related word (simplified version)
  suggestions.push(`${domain}dao.sol`);
  
  return suggestions;
}
