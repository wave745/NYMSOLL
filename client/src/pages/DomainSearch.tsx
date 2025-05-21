import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useToast } from "@/hooks/useToast";
import { IconTextButton } from "@/components/IconTextButton";
import { Link } from "wouter";

interface DomainResultSuccess {
  status: "available";
  domain: string;
  fee: number;
}

interface DomainResultTaken {
  status: "taken";
  domain: string;
  owner: string;
  similarDomains?: string[];
}

type DomainResult = DomainResultSuccess | DomainResultTaken;

export default function DomainSearch() {
  const [domainName, setDomainName] = useState("");
  const [searchResult, setSearchResult] = useState<DomainResult | null>(null);
  const { connected } = useSolanaWallet();
  const { toast } = useToast();

  // Domain search mutation
  const { mutate: searchDomain, isPending: isSearching } = useMutation({
    mutationFn: async (domain: string) => {
      const response = await apiRequest("GET", `/api/domains/search?name=${domain}`);
      return response.json();
    },
    onSuccess: (data: DomainResult) => {
      setSearchResult(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to search domain: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Domain registration mutation
  const { mutate: registerDomain, isPending: isRegistering } = useMutation({
    mutationFn: async (domain: string) => {
      const response = await apiRequest("POST", "/api/domains/register", { domain });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `Your domain ${domainName}.sol was registered successfully.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: `Failed to register domain: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;
    setSearchResult(null);
    searchDomain(domainName.trim());
  };

  const handleRegister = () => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to register a domain.",
        variant: "destructive",
      });
      return;
    }
    
    if (searchResult?.status === "available") {
      registerDomain(searchResult.domain);
    }
  };

  const handleSearchAgain = () => {
    setSearchResult(null);
    setDomainName("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="text-center mb-12 mt-8 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Find Your <span className="gradient-text">Perfect</span> Solana Domain
        </h1>
        <p className="text-neutral text-lg">
          Secure your identity on Solana with a personalized .sol domain name.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="relative mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="Enter your domain name"
                className="w-full px-5 py-4 rounded-xl bg-background-lighter border border-neutral-dark/50 focus:border-primary outline-none transition-colors text-neutral-light font-medium"
              />
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-neutral-dark">
                .sol
              </span>
            </div>
            <IconTextButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSearching}
            >
              Search
            </IconTextButton>
          </form>
        </div>

        {/* Results Section */}
        <div className="mb-12">
          <AnimatePresence mode="wait">
            {isSearching && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl bg-background-card p-8 border border-neutral-dark/30 card-shadow flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-neutral-light text-lg mb-2">Checking domain availability</p>
                  <p className="text-neutral text-sm">This may take a few seconds...</p>
                </div>
              </motion.div>
            )}

            {!isSearching && searchResult?.status === "available" && (
              <motion.div
                key="available"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl bg-background-card p-6 border border-success/30 card-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-3">
                        <i className="ri-checkbox-circle-fill text-success mr-2 text-xl"></i>
                        <h2 className="text-xl font-display font-medium text-neutral-light">
                          Domain Available!
                        </h2>
                      </div>
                      <p className="text-lg font-mono mb-4">
                        <span className="text-white font-medium">
                          {searchResult.domain}.sol
                        </span>{" "}
                        can be yours!
                      </p>
                      <p className="text-neutral mb-4">
                        Registration fee:{" "}
                        <span className="text-white">{searchResult.fee} SOL</span> for 1 year
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <i className="ri-user-add-line text-6xl text-success/40"></i>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <IconTextButton
                      variant="gradient"
                      fullWidth
                      onClick={handleRegister}
                      disabled={isRegistering}
                    >
                      {isRegistering ? "Processing..." : "Register Now"}
                    </IconTextButton>
                    <IconTextButton
                      variant="outline"
                      onClick={handleSearchAgain}
                      disabled={isRegistering}
                    >
                      Search Again
                    </IconTextButton>
                  </div>
                </div>
              </motion.div>
            )}

            {!isSearching && searchResult?.status === "taken" && (
              <motion.div
                key="taken"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl bg-background-card p-6 border border-error/30 card-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-3">
                        <i className="ri-error-warning-fill text-error mr-2 text-xl"></i>
                        <h2 className="text-xl font-display font-medium text-neutral-light">
                          Domain Taken
                        </h2>
                      </div>
                      <p className="text-lg font-mono mb-4">
                        <span className="text-white font-medium">
                          {searchResult.domain}.sol
                        </span>{" "}
                        is already registered
                      </p>
                      <div className="bg-background p-3 rounded-lg mb-4">
                        <p className="text-neutral text-sm mb-1">Owner</p>
                        <p className="text-sm font-mono text-neutral-light break-all">
                          {searchResult.owner}
                        </p>
                      </div>
                    </div>
                  </div>

                  {searchResult.similarDomains && searchResult.similarDomains.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-neutral mb-3">Similar available domains:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {searchResult.similarDomains.map((domain, index) => (
                          <div
                            key={index}
                            className="bg-background-lighter rounded-lg p-3 hover:bg-background-card cursor-pointer transition-colors border border-neutral-dark/20"
                            onClick={() => {
                              setDomainName(domain.replace(".sol", ""));
                              searchDomain(domain.replace(".sol", ""));
                            }}
                          >
                            <p className="text-sm font-mono text-neutral-light">{domain}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <IconTextButton
                    variant="outline"
                    fullWidth
                    className="mt-4"
                    onClick={handleSearchAgain}
                  >
                    Search Again
                  </IconTextButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-background-lighter p-6 rounded-xl border border-neutral-dark/30 card-shadow">
            <i className="ri-lock-line text-3xl text-primary mb-4"></i>
            <h3 className="text-xl font-display font-medium mb-2">Secure Identity</h3>
            <p className="text-neutral">
              Own your web3 identity with blockchain-secured domains.
            </p>
          </div>
          <div className="bg-background-lighter p-6 rounded-xl border border-neutral-dark/30 card-shadow">
            <i className="ri-wallet-3-line text-3xl text-primary mb-4"></i>
            <h3 className="text-xl font-display font-medium mb-2">Simplified Payments</h3>
            <p className="text-neutral">
              Send and receive SOL with easy-to-remember names.
            </p>
          </div>
          <div className="bg-background-lighter p-6 rounded-xl border border-neutral-dark/30 card-shadow">
            <i className="ri-global-line text-3xl text-primary mb-4"></i>
            <h3 className="text-xl font-display font-medium mb-2">Web3 Ready</h3>
            <p className="text-neutral">
              Connect to decentralized apps with your domain.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
