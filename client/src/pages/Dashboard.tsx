import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { IconTextButton } from "@/components/IconTextButton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { truncateAddress } from "@/lib/solana";

interface DomainInfo {
  name: string;
  registrationDate: string;
  expiryDate: string;
  status: "active" | "expiring" | "expired";
}

interface VanityWalletInfo {
  id: string;
  publicKey: string;
  prefix: string;
  createdAt: string;
}

export default function Dashboard() {
  const { connected, walletAddress } = useSolanaWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [vanityWallets, setVanityWallets] = useState<VanityWalletInfo[]>([]);

  // Fetch user domains
  const { data: domainData } = useQuery({
    queryKey: ["/api/user/domains"],
    enabled: connected,
  });

  // Fetch user wallet balance
  const { data: balanceData } = useQuery({
    queryKey: ["/api/user/balance"],
    enabled: connected,
  });

  // Fetch user vanity wallets
  const { data: walletsData } = useQuery({
    queryKey: ["/api/user/vanity-wallets"],
    enabled: connected,
  });

  useEffect(() => {
    if (domainData) {
      setDomains(domainData.domains || []);
    }
  }, [domainData]);

  useEffect(() => {
    if (balanceData) {
      setBalance(balanceData.balance || null);
    }
  }, [balanceData]);

  useEffect(() => {
    if (walletsData) {
      setVanityWallets(walletsData.wallets || []);
    }
  }, [walletsData]);

  // Mock data for display when not connected
  const useMockData = !connected;
  const mockDomains: DomainInfo[] = [
    {
      name: "mynymid.sol",
      registrationDate: "May 15, 2023",
      expiryDate: "May 15, 2024",
      status: "active",
    },
    {
      name: "solking.sol",
      registrationDate: "Jan 3, 2023",
      expiryDate: "Jan 3, 2024",
      status: "expiring",
    },
  ];

  const mockWallets: VanityWalletInfo[] = [
    {
      id: "1",
      publicKey: "ape5ZqcjPNT5hZWSvRqbRkFXbtKKNpCFBbCHVy4LD6K",
      prefix: "ape",
      createdAt: "June 10, 2023",
    },
  ];

  const displayDomains = useMockData ? mockDomains : domains;
  const displayWallets = useMockData ? mockWallets : vanityWallets;
  const displayBalance = useMockData ? 23.45 : balance;
  const displayWalletAddress = useMockData ? "8JsAQD3USuajWCn1MvBrJzUarYT3W91H5g8c" : walletAddress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 mt-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Your Dashboard
          </h1>
          <p className="text-neutral">
            Manage your Solana domains and wallet information
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="gradient-border bg-background-lighter p-4 flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <i className="ri-user-line text-white"></i>
              </div>
            </div>
            <div className="truncate">
              <p className="text-neutral-light font-medium truncate">
                {connected ? truncateAddress(displayWalletAddress || "") : "Not Connected"}
              </p>
              <p className="text-neutral text-sm">
                {connected ? "Connected with Phantom" : "Connect your wallet to view your data"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-background-card rounded-xl p-6 border border-neutral-dark/30 card-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-display font-medium">SOL Balance</h3>
            <i className="ri-coin-line text-2xl text-secondary"></i>
          </div>
          <p className="text-3xl font-display font-bold">
            {displayBalance !== null ? displayBalance.toFixed(2) : "-"}{" "}
            <span className="text-lg text-neutral font-normal">SOL</span>
          </p>
          <p className="text-neutral text-sm">
            {displayBalance !== null
              ? `≈ $${(displayBalance * 75).toFixed(2)} USD`
              : "Connect wallet to view balance"}
          </p>
          <div className="mt-4 pt-4 border-t border-neutral-dark/30">
            <IconTextButton
              variant="outline"
              fullWidth
              icon="ri-add-circle-line"
              className="text-primary py-2"
              disabled={!connected}
            >
              Add Funds
            </IconTextButton>
          </div>
        </div>

        <div className="bg-background-card rounded-xl p-6 border border-neutral-dark/30 card-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-display font-medium">Your Domains</h3>
            <i className="ri-global-line text-2xl text-secondary"></i>
          </div>
          <p className="text-3xl font-display font-bold">
            {displayDomains.length}
          </p>
          <p className="text-neutral text-sm">Active .sol domains</p>
          <div className="mt-4 pt-4 border-t border-neutral-dark/30">
            <Link href="/search">
              <IconTextButton
                variant="outline"
                fullWidth
                icon="ri-search-line"
                className="text-primary py-2"
              >
                Get More Domains
              </IconTextButton>
            </Link>
          </div>
        </div>

        <div className="bg-background-card rounded-xl p-6 border border-neutral-dark/30 card-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-display font-medium">Vanity Wallets</h3>
            <i className="ri-wallet-3-line text-2xl text-secondary"></i>
          </div>
          <p className="text-3xl font-display font-bold">
            {displayWallets.length}
          </p>
          <p className="text-neutral text-sm">Generated wallets</p>
          <div className="mt-4 pt-4 border-t border-neutral-dark/30">
            <Link href="/vanity">
              <IconTextButton
                variant="outline"
                fullWidth
                icon="ri-magic-line"
                className="text-primary py-2"
              >
                Generate New Wallet
              </IconTextButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Your Domains */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Your Domains</h2>
          <Link href="/search">
            <IconTextButton
              variant="outline"
              size="sm"
              icon="ri-add-line"
            >
              Register New
            </IconTextButton>
          </Link>
        </div>

        {displayDomains.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-background-lighter border-b border-neutral-dark/30">
                <tr>
                  <th className="py-4 px-6 text-left text-neutral font-medium">Domain</th>
                  <th className="py-4 px-6 text-left text-neutral font-medium">Registration Date</th>
                  <th className="py-4 px-6 text-left text-neutral font-medium">Expiry</th>
                  <th className="py-4 px-6 text-left text-neutral font-medium">Status</th>
                  <th className="py-4 px-6 text-neutral font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {displayDomains.map((domain, index) => (
                  <tr
                    key={index}
                    className="border-b border-neutral-dark/10 hover:bg-background-lighter transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary mr-3 flex items-center justify-center text-white font-bold">
                          {domain.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-mono font-medium">{domain.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral">{domain.registrationDate}</td>
                    <td className="py-4 px-6 text-neutral">{domain.expiryDate}</td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          domain.status === "active"
                            ? "success"
                            : domain.status === "expiring"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {domain.status === "active"
                          ? "Active"
                          : domain.status === "expiring"
                          ? "Expiring Soon"
                          : "Expired"}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <IconTextButton
                        variant="outline"
                        size="sm"
                        disabled={!connected}
                      >
                        Manage
                      </IconTextButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-background-card p-8 rounded-xl border border-neutral-dark/30 text-center">
            <i className="ri-global-line text-4xl text-neutral mb-4"></i>
            <h3 className="text-xl font-medium text-neutral-light mb-2">No Domains Found</h3>
            <p className="text-neutral mb-4">You don't have any .sol domains yet.</p>
            <Link href="/search">
              <IconTextButton
                variant="primary"
                icon="ri-search-line"
              >
                Search for Domains
              </IconTextButton>
            </Link>
          </div>
        )}
      </div>

      {/* Vanity Wallets */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Your Vanity Wallets</h2>
          <Link href="/vanity">
            <IconTextButton
              variant="outline"
              size="sm"
              icon="ri-add-line"
            >
              Generate New
            </IconTextButton>
          </Link>
        </div>

        {displayWallets.length > 0 ? (
          displayWallets.map((wallet, index) => (
            <div
              key={index}
              className="bg-background-card rounded-xl border border-neutral-dark/30 card-shadow overflow-hidden mb-4"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary mr-3 flex items-center justify-center text-white font-bold">
                        V
                      </div>
                      <h3 className="font-medium text-lg text-neutral-light">
                        Wallet #{index + 1}
                      </h3>
                    </div>
                    <p className="font-mono text-sm mb-4 md:mb-0">
                      {wallet.publicKey.substring(0, 30)}...
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <IconTextButton
                      variant="outline"
                      size="sm"
                      icon="ri-eye-line"
                    >
                      View Details
                    </IconTextButton>
                    <IconTextButton
                      variant="primary"
                      size="sm"
                      icon="ri-download-line"
                      disabled={!connected}
                    >
                      Download Key
                    </IconTextButton>
                  </div>
                </div>
              </div>
              <div className="bg-background-lighter px-6 py-4 border-t border-neutral-dark/20">
                <div className="flex items-center text-neutral text-sm">
                  <i className="ri-time-line mr-2"></i>
                  <span>Generated on {wallet.createdAt}</span>
                  <span className="mx-3">•</span>
                  <span>Prefix: "{wallet.prefix}"</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-background-card p-8 rounded-xl border border-neutral-dark/30 text-center">
            <i className="ri-wallet-3-line text-4xl text-neutral mb-4"></i>
            <h3 className="text-xl font-medium text-neutral-light mb-2">
              No Vanity Wallets Found
            </h3>
            <p className="text-neutral mb-4">
              You haven't generated any vanity wallets yet.
            </p>
            <Link href="/vanity">
              <IconTextButton variant="primary" icon="ri-magic-line">
                Generate a Vanity Wallet
              </IconTextButton>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
