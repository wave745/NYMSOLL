import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { domainController } from "./controllers/domainController";

export async function registerRoutes(app: Express): Promise<Server> {
  // Domain search endpoint
  app.get("/api/domains/search", domainController.searchDomain);
  
  // Domain registration endpoint
  app.post("/api/domains/register", domainController.registerDomain);
  
  // Similar domain suggestions endpoint
  app.get("/api/domains/suggestions", domainController.getDomainSuggestions);
  
  // Get user domains
  app.get("/api/user/domains", domainController.getUserDomains);
  
  // Get user wallet balance
  app.get("/api/user/balance", domainController.getUserBalance);
  
  // Get user vanity wallets
  app.get("/api/user/vanity-wallets", domainController.getUserVanityWallets);

  const httpServer = createServer(app);

  return httpServer;
}
