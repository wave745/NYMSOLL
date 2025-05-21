import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useToast } from "@/hooks/useToast";
import { FaXTwitter } from "react-icons/fa6";

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
          <Link href="/search" className={`transition-colors font-medium text-sm ${location === "/search" || location === "/" ? "text-neutral-light" : "text-neutral hover:text-white"}`}>
            Domain Search
          </Link>
          <Link href="/vanity" className={`transition-colors font-medium text-sm ${location === "/vanity" ? "text-neutral-light" : "text-neutral hover:text-white"}`}>
            Vanity Wallet
          </Link>
          <Link href="/dashboard" className={`transition-colors font-medium text-sm ${location === "/dashboard" ? "text-neutral-light" : "text-neutral hover:text-white"}`}>
            Dashboard
          </Link>
          <a 
            href="https://x.com/nym_sol" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-neutral hover:text-white transition-colors"
            title="Follow us on X.com"
          >
            <FaXTwitter size={16} />
            <span className="text-sm font-medium">@nym_sol</span>
          </a>
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
              <Link href="/search" className={`block py-3 px-4 rounded-lg transition-colors ${location === "/search" || location === "/" ? "text-neutral-light bg-background-card" : "text-neutral hover:bg-background-card"}`}>
                Domain Search
              </Link>
              <Link href="/vanity" className={`block py-3 px-4 rounded-lg transition-colors ${location === "/vanity" ? "text-neutral-light bg-background-card" : "text-neutral hover:bg-background-card"}`}>
                Vanity Wallet
              </Link>
              <Link href="/dashboard" className={`block py-3 px-4 rounded-lg transition-colors ${location === "/dashboard" ? "text-neutral-light bg-background-card" : "text-neutral hover:bg-background-card"}`}>
                Dashboard
              </Link>
              <a 
                href="https://x.com/nym_sol" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 py-3 px-4 rounded-lg text-neutral hover:bg-background-card transition-colors"
              >
                <FaXTwitter size={16} />
                <span>Follow @nym_sol</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
