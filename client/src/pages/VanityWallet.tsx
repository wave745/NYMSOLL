import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconTextButton } from "@/components/IconTextButton";
import { useToast } from "@/hooks/useToast";

// Popular prefixes for quick selection
const POPULAR_PREFIXES = ["ape", "sol", "moon", "cool", "nym"];

interface VanityWalletResult {
  publicKey: string;
  privateKey: string;
  prefix: string;
}

interface GeneratorStatus {
  isRunning: boolean;
  prefix: string;
  addressesTried: number;
  timeRemaining: string;
}

export default function VanityWallet() {
  const [prefix, setPrefix] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [vanityResult, setVanityResult] = useState<VanityWalletResult | null>(null);
  const [generatorStatus, setGeneratorStatus] = useState<GeneratorStatus>({
    isRunning: false,
    prefix: "",
    addressesTried: 0,
    timeRemaining: "calculating...",
  });
  
  const workerRef = useRef<Worker | null>(null);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize web worker
  useEffect(() => {
    // Clean up worker on component unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const startGenerator = (inputPrefix: string) => {
    const prefixToUse = inputPrefix.trim().toLowerCase();
    
    if (!prefixToUse) {
      toast({
        title: "Error",
        description: "Please enter a prefix to generate a vanity address.",
        variant: "destructive",
      });
      return;
    }
    
    if (prefixToUse.length > 5) {
      toast({
        title: "Warning",
        description: "Long prefixes may take a very long time to generate.",
        variant: "warning",
      });
    }
    
    // Reset previous results
    setVanityResult(null);
    
    // Update generator status
    setGeneratorStatus({
      isRunning: true,
      prefix: prefixToUse,
      addressesTried: 0,
      timeRemaining: "calculating...",
    });

    // Initialize worker if not already created
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../utils/vanityWalletWorker.ts", import.meta.url),
        { type: "module" }
      );
    }

    // Handle messages from worker
    workerRef.current.onmessage = (event) => {
      const data = event.data;
      
      if (data.type === "progress") {
        setGeneratorStatus((prev) => ({
          ...prev,
          addressesTried: data.addressesTried,
          timeRemaining: data.timeRemaining,
        }));
      } else if (data.type === "result") {
        // We found a match!
        setGeneratorStatus((prev) => ({
          ...prev,
          isRunning: false,
        }));
        
        setVanityResult({
          publicKey: data.publicKey,
          privateKey: data.privateKey,
          prefix: prefixToUse,
        });
        
        // Clean up
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        toast({
          title: "Success!",
          description: `Found a wallet address with prefix "${prefixToUse}"`,
          variant: "success",
        });
      } else if (data.type === "error") {
        setGeneratorStatus((prev) => ({
          ...prev,
          isRunning: false,
        }));
        
        toast({
          title: "Error",
          description: data.error || "Failed to generate vanity address",
          variant: "destructive",
        });
      }
    };

    // Start the worker
    workerRef.current.postMessage({
      type: "start",
      prefix: prefixToUse,
    });
  };

  const cancelGenerator = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    
    setGeneratorStatus((prev) => ({
      ...prev,
      isRunning: false,
    }));
    
    toast({
      title: "Cancelled",
      description: "Vanity address generation was cancelled",
      variant: "default",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startGenerator(prefix);
  };

  const copyToClipboard = (text: string, type: 'public' | 'private') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: `${type === 'public' ? 'Public key' : 'Private key'} copied to clipboard`,
          variant: "success",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      });
  };

  const downloadKeyFile = () => {
    if (!vanityResult) return;
    
    const keyData = JSON.stringify({
      publicKey: vanityResult.publicKey,
      privateKey: vanityResult.privateKey,
      prefix: vanityResult.prefix,
      createdAt: new Date().toISOString(),
    }, null, 2);
    
    const blob = new Blob([keyData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vanityResult.prefix}-vanity-wallet.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Key file has been downloaded. Keep it safe!",
      variant: "success",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="text-center mb-12 mt-8 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Generate a <span className="gradient-text">Vanity</span> Solana Address
        </h1>
        <p className="text-neutral text-lg">
          Create a custom Solana wallet address that starts with your chosen characters.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="bg-background-card rounded-xl p-6 border border-neutral-dark/30 card-shadow mb-8">
          <form id="vanity-form" className="mb-6" onSubmit={handleSubmit}>
            <label htmlFor="prefix" className="block text-neutral-light font-medium mb-2">
              Enter your desired prefix:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g. ape, zero, etc."
                className="flex-grow px-5 py-4 rounded-xl bg-background-lighter border border-neutral-dark/50 focus:border-primary outline-none transition-colors text-neutral-light font-medium"
                disabled={generatorStatus.isRunning}
              />
              <IconTextButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={generatorStatus.isRunning}
              >
                Generate
              </IconTextButton>
            </div>
            <p className="text-neutral text-sm mt-2">
              Longer prefixes will take more time to generate. Case-insensitive.
            </p>
          </form>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {POPULAR_PREFIXES.map((prefixOption) => (
                <span
                  key={prefixOption}
                  className="px-3 py-1 rounded-lg bg-background-lighter text-neutral-light text-sm cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => {
                    if (!generatorStatus.isRunning) {
                      setPrefix(prefixOption);
                    }
                  }}
                >
                  {prefixOption}
                </span>
              ))}
            </div>
            <p className="text-neutral text-sm mt-2">Popular prefixes. Click to use.</p>
          </div>
        </div>

        {/* Generator Status */}
        <AnimatePresence mode="wait">
          {generatorStatus.isRunning && (
            <motion.div
              key="generator-status"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-background-card rounded-xl p-6 border border-neutral-dark/30 card-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mr-4"></div>
                  <div>
                    <h3 className="text-lg font-medium text-neutral-light">
                      Generating Your Vanity Address
                    </h3>
                    <p className="text-neutral">
                      Searching for an address starting with "
                      <span className="text-white font-medium">{generatorStatus.prefix}</span>"
                    </p>
                  </div>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral">Addresses tried:</span>
                    <span className="text-neutral-light font-mono">
                      {generatorStatus.addressesTried.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral">Estimated time remaining:</span>
                    <span className="text-neutral-light font-mono">
                      {generatorStatus.timeRemaining}
                    </span>
                  </div>
                </div>
                <IconTextButton
                  variant="outline"
                  fullWidth
                  className="mt-4 border-error/50 text-error"
                  onClick={cancelGenerator}
                >
                  Cancel Generation
                </IconTextButton>
              </div>
            </motion.div>
          )}

          {/* Generator Result */}
          {vanityResult && (
            <motion.div
              key="generator-result"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-background-card rounded-xl p-6 border border-success/30 card-shadow">
                <div className="flex items-start mb-6">
                  <i className="ri-checkbox-circle-fill text-success text-2xl mt-1 mr-3"></i>
                  <div>
                    <h3 className="text-xl font-medium text-neutral-light mb-1">
                      Vanity Address Generated!
                    </h3>
                    <p className="text-neutral">
                      We found an address with your requested prefix. Please save your keys securely!
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-neutral mb-1">Public Key (Address)</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={vanityResult.publicKey}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg bg-background border border-neutral-dark/50 text-neutral-light font-mono text-sm"
                      />
                      <button
                        className="ml-2 px-3 rounded-lg bg-background-lighter border border-neutral-dark/50 hover:bg-background text-neutral-light transition-colors"
                        title="Copy to clipboard"
                        onClick={() => copyToClipboard(vanityResult.publicKey, 'public')}
                      >
                        <i className="ri-file-copy-line"></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral mb-1">Private Key</label>
                    <div className="relative">
                      <div className="flex">
                        <input
                          type={showPrivateKey ? "text" : "password"}
                          value={vanityResult.privateKey}
                          readOnly
                          className="w-full px-4 py-3 rounded-lg bg-background border border-neutral-dark/50 text-neutral-light font-mono text-sm"
                        />
                        <button
                          className="ml-2 px-3 rounded-lg bg-background-lighter border border-neutral-dark/50 hover:bg-background text-neutral-light transition-colors"
                          title="Show/Hide"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                        >
                          <i className={showPrivateKey ? "ri-eye-off-line" : "ri-eye-line"}></i>
                        </button>
                        <button
                          className="ml-2 px-3 rounded-lg bg-background-lighter border border-neutral-dark/50 hover:bg-background text-neutral-light transition-colors"
                          title="Copy to clipboard"
                          onClick={() => copyToClipboard(vanityResult.privateKey, 'private')}
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                      </div>
                      <p className="text-warning text-sm flex items-center mt-2">
                        <i className="ri-alert-line mr-1"></i>
                        Never share your private key with anyone!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <IconTextButton
                    variant="primary"
                    fullWidth
                    onClick={downloadKeyFile}
                  >
                    Download Key File
                  </IconTextButton>
                  <IconTextButton
                    variant="outline"
                    onClick={() => {
                      setVanityResult(null);
                      setPrefix("");
                    }}
                  >
                    Generate Another
                  </IconTextButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Information Section */}
        <div className="rounded-xl bg-background-lighter p-6 border border-neutral-dark/30 card-shadow">
          <h3 className="text-xl font-display font-medium mb-4">What is a Vanity Address?</h3>
          <p className="text-neutral mb-4">
            A vanity address is a cryptocurrency address that contains a personalized prefix that you choose. 
            Instead of a completely random string of characters, your address will start with your selected characters.
          </p>
          
          <div className="bg-background p-4 rounded-lg mb-4">
            <p className="text-sm text-neutral-light mb-1">
              Example address with prefix "ape":
            </p>
            <p className="font-mono text-sm text-white">
              ape5ZqcjPNT5hZWSvRqbRkFXbtKKNpCFBbCHVy4LD6K
            </p>
          </div>
          
          <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg">
            <h4 className="text-warning font-medium mb-2 flex items-center">
              <i className="ri-shield-keyhole-line mr-2"></i>
              Security Warning
            </h4>
            <p className="text-neutral-light text-sm">
              Always keep your private key secure. Never share it with anyone. 
              This tool generates your keys directly in your browser - no data is sent to any server.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
