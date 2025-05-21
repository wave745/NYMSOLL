import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useToast } from "@/hooks/useToast";

export default function NavBar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { connected, walletAddress, connect, disconnect } = useSolanaWallet();
  const { toast } = useToast();

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleConnectWallet = async () => {
    try {
      await connect();
      toast({
        title: "Success!",
        description: "Wallet connected successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-neutral-dark/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-neutral-light font-bold">N</span>
          </div>
          <h1 className="text-xl font-display font-bold">
            <span className="gradient-text">Nym</span><span className="text-neutral-light">SOL</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/search">
            <a className={`transition-colors font-medium text-sm ${location === "/search" || location === "/" ? "text-neutral-light" : "text-neutral hover:text-white"}`}>
              Domain Search
            </a>
          </Link>
          <Link href="/vanity">
            <a className={`transition-colors font-medium text-sm ${location === "/vanity" ? "text-neutral-light" : "text-neutral hover:text-white"}`}>
              Vanity Wallet
            </a>
          </Link>
          <Link href="/dashboard">
            <a className={`transition-colors font-medium text-sm ${location === "/dashboard" ? "text-neutral-light" : "text-neutral hover:text-white"}`}>
              Dashboard
            </a>
          </Link>
        </div>
        
        <button 
          onClick={connected ? disconnect : handleConnectWallet}
          className={`flex items-center px-4 py-2 rounded-full text-white text-sm font-medium transition-colors ${connected ? 'bg-success hover:bg-success/90' : 'bg-primary hover:bg-primary-light'}`}
        >
          <i className="ri-wallet-3-line mr-2"></i>
          {connected ? 'Connected' : 'Connect Wallet'}
        </button>
        
        <button 
          className="md:hidden text-white" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`text-2xl ${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
        </button>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background-lighter border-t border-neutral-dark/30"
          >
            <div className="px-4 py-2 space-y-2">
              <Link href="/search">
                <a className={`block py-3 px-4 rounded-lg transition-colors ${location === "/search" || location === "/" ? "text-neutral-light bg-background-card" : "text-neutral hover:bg-background-card"}`}>
                  Domain Search
                </a>
              </Link>
              <Link href="/vanity">
                <a className={`block py-3 px-4 rounded-lg transition-colors ${location === "/vanity" ? "text-neutral-light bg-background-card" : "text-neutral hover:bg-background-card"}`}>
                  Vanity Wallet
                </a>
              </Link>
              <Link href="/dashboard">
                <a className={`block py-3 px-4 rounded-lg transition-colors ${location === "/dashboard" ? "text-neutral-light bg-background-card" : "text-neutral hover:bg-background-card"}`}>
                  Dashboard
                </a>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
