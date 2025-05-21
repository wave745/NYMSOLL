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
    // Use the Bonfida SPL Name Service to get the domain key
    const { pubkey } = await NameRegistryState.getNameAccountKey(
      new TextEncoder().encode(domainName),
      undefined,
      new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
    );
    return { pubkey };
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
    transaction.feePayer = window.solana.publicKey as PublicKey;

    // Sign the transaction
    const signed = await window.solana.signTransaction(transaction);
    
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
