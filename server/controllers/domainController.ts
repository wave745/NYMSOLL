import { Request, Response } from "express";
import { connection } from "../utils/solana";
import { PublicKey } from "@solana/web3.js";
import { NameRegistryState } from "@bonfida/spl-name-service";
import { storage } from "../storage";

export const domainController = {
  /**
   * Search for a domain and check availability
   */
  searchDomain: async (req: Request, res: Response) => {
    try {
      const { name } = req.query;
      
      if (!name || typeof name !== "string") {
        return res.status(400).json({ 
          message: "Domain name is required" 
        });
      }

      const domainName = name.toLowerCase().trim();
      
      try {
        // Get the domain key from the domain name
        const { pubkey } = await NameRegistryState.getNameAccountKey(
          new TextEncoder().encode(`${domainName}.sol`),
          undefined,
          new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
        );
        
        try {
          // Try to retrieve the domain registry
          const registry = await NameRegistryState.retrieve(connection, pubkey);
          
          // Domain exists, return owner information
          return res.json({
            status: "taken",
            domain: domainName,
            owner: registry.owner.toString(),
            similarDomains: generateSimilarDomains(domainName)
          });
        } catch (error) {
          // If we get here, domain doesn't exist (is available)
          return res.json({
            status: "available",
            domain: domainName,
            fee: calculateDomainFee(domainName)
          });
        }
      } catch (error) {
        console.error("Error checking domain:", error);
        return res.status(500).json({ 
          message: "Error checking domain availability" 
        });
      }
    } catch (error) {
      console.error("Error in domain search:", error);
      return res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  },

  /**
   * Register a domain
   */
  registerDomain: async (req: Request, res: Response) => {
    try {
      const { domain } = req.body;
      
      if (!domain) {
        return res.status(400).json({ 
          message: "Domain name is required" 
        });
      }
      
      // In a real implementation, we would:
      // 1. Verify the domain is available
      // 2. Create a registration transaction
      // 3. Return the transaction for signing by the client
      
      // For this implementation, we'll simulate a successful registration
      return res.status(200).json({
        success: true,
        message: `Domain ${domain}.sol registered successfully`,
        transactionId: "simulated_transaction_id"
      });
    } catch (error) {
      console.error("Error registering domain:", error);
      return res.status(500).json({ 
        message: "Error registering domain" 
      });
    }
  },

  /**
   * Get domain suggestions
   */
  getDomainSuggestions: async (req: Request, res: Response) => {
    try {
      const { name } = req.query;
      
      if (!name || typeof name !== "string") {
        return res.status(400).json({ 
          message: "Domain name is required" 
        });
      }
      
      const suggestions = generateSimilarDomains(name.toLowerCase().trim());
      
      return res.json({
        suggestions
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return res.status(500).json({ 
        message: "Error generating domain suggestions" 
      });
    }
  },

  /**
   * Get user's domains
   */
  getUserDomains: async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would:
      // 1. Verify the user is authenticated
      // 2. Query domains owned by the user's wallet
      
      // For this implementation, we'll return mock data
      return res.json({
        domains: [
          {
            name: "mynymid.sol",
            registrationDate: "May 15, 2023",
            expiryDate: "May 15, 2024",
            status: "active"
          },
          {
            name: "solking.sol",
            registrationDate: "Jan 3, 2023",
            expiryDate: "Jan 3, 2024",
            status: "expiring"
          }
        ]
      });
    } catch (error) {
      console.error("Error fetching user domains:", error);
      return res.status(500).json({ 
        message: "Error fetching user domains" 
      });
    }
  },

  /**
   * Get user's wallet balance
   */
  getUserBalance: async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would:
      // 1. Verify the user is authenticated
      // 2. Get the user's wallet public key
      // 3. Query the Solana blockchain for the wallet balance
      
      // For this implementation, we'll return mock data
      return res.json({
        balance: 23.45,
        usdValue: 1758.75
      });
    } catch (error) {
      console.error("Error fetching user balance:", error);
      return res.status(500).json({ 
        message: "Error fetching user balance" 
      });
    }
  },

  /**
   * Get user's vanity wallets
   */
  getUserVanityWallets: async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would:
      // 1. Verify the user is authenticated
      // 2. Query the database for the user's saved vanity wallets
      
      // For this implementation, we'll return mock data
      return res.json({
        wallets: [
          {
            id: "1",
            publicKey: "ape5ZqcjPNT5hZWSvRqbRkFXbtKKNpCFBbCHVy4LD6K",
            prefix: "ape",
            createdAt: "June 10, 2023"
          }
        ]
      });
    } catch (error) {
      console.error("Error fetching vanity wallets:", error);
      return res.status(500).json({ 
        message: "Error fetching vanity wallets" 
      });
    }
  }
};

/**
 * Generate similar domain suggestions
 */
function generateSimilarDomains(domain: string): string[] {
  const suggestions: string[] = [];
  
  // Add a number at the end
  suggestions.push(`${domain}01.sol`);
  
  // Add a prefix
  suggestions.push(`my${domain}.sol`);
  suggestions.push(`the${domain}.sol`);
  
  // Add a suffix
  suggestions.push(`${domain}-nft.sol`);
  
  return suggestions;
}

/**
 * Calculate domain registration fee
 */
function calculateDomainFee(domain: string): number {
  // In a real implementation, we would calculate based on domain length
  // For this implementation, we'll return a fixed fee
  return 0.1; // SOL
}
