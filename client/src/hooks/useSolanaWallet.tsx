import { useState, useEffect, useCallback } from "react";
import { WalletName } from "@solana/wallet-adapter-wallets";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "./useToast";

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: Function) => void;
      off: (event: string, callback: Function) => void;
      publicKey?: PublicKey;
      signTransaction?: (transaction: any) => Promise<any>;
    };
  }
}

interface UseSolanaWalletReturn {
  connected: boolean;
  walletName: WalletName | null;
  walletAddress: string | null;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export function useSolanaWallet(): UseSolanaWalletReturn {
  const [connected, setConnected] = useState(false);
  const [walletName, setWalletName] = useState<WalletName | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const { toast } = useToast();

  const handleAccountsChanged = useCallback(() => {
    if (window.solana?.isPhantom) {
      const newPublicKey = window.solana.publicKey;
      if (newPublicKey) {
        setPublicKey(newPublicKey);
        setWalletAddress(newPublicKey.toString());
        setConnected(true);
        setWalletName("Phantom" as WalletName);
      } else {
        setPublicKey(null);
        setWalletAddress(null);
        setConnected(false);
        setWalletName(null);
      }
    }
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.solana?.isPhantom) {
        try {
          if (window.solana?.publicKey) {
            setPublicKey(window.solana.publicKey);
            setWalletAddress(window.solana.publicKey.toString());
            setConnected(true);
            setWalletName("Phantom" as WalletName);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (window.solana?.isPhantom) {
      window.solana.on("accountsChanged", handleAccountsChanged);
      window.solana.on("disconnect", handleAccountsChanged);
    }

    return () => {
      if (window.solana?.isPhantom) {
        window.solana.off("accountsChanged", handleAccountsChanged);
        window.solana.off("disconnect", handleAccountsChanged);
      }
    };
  }, [handleAccountsChanged]);

  const connect = async () => {
    if (!window.solana) {
      toast({
        title: "Phantom Not Found",
        description: "Please install the Phantom wallet extension.",
        variant: "destructive",
      });
      throw new Error("Phantom wallet not found");
    }

    try {
      const response = await window.solana.connect();
      setPublicKey(response.publicKey);
      setWalletAddress(response.publicKey.toString());
      setConnected(true);
      setWalletName("Phantom" as WalletName);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  const disconnect = async () => {
    if (window.solana?.isPhantom) {
      try {
        await window.solana.disconnect();
        setPublicKey(null);
        setWalletAddress(null);
        setConnected(false);
        setWalletName(null);
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
        throw error;
      }
    }
  };

  return {
    connected,
    walletName,
    walletAddress,
    publicKey,
    connect,
    disconnect,
  };
}
