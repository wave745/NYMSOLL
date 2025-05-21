import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import { storage } from "../storage";

// Import Solana utilities directly with absolute path
const solanaUtils = require('../../server/utils/solana');
const { connection, checkDomainAvailability, getDomainOwner, generateSimilarDomains, calculateDomainFee } = solanaUtils;

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
        // Check if the domain is available
        const isAvailable = await checkDomainAvailability(domainName);
        
        if (isAvailable) {
          // Domain is available
          return res.json({
            status: "available",
            domain: domainName,
            fee: calculateDomainFee(domainName)
          });
        } else {
          // Domain is taken, get the owner
          const owner = await getDomainOwner(domainName);
          
          // Return owner information
          return res.json({
            status: "taken",
            domain: domainName,
            owner: owner ? owner.toString() : "Unknown",
            similarDomains: generateSimilarDomains(domainName)
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