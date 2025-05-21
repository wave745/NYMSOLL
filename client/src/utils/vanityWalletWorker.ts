import { Keypair } from '@solana/web3.js';

// We're inside a web worker
const ctx: Worker = self as any;

let startTime: number;
let addressesTried = 0;
let running = false;
let targetPrefix = '';

// Format time remaining in human-readable format
function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) {
    return `~${Math.ceil(seconds)} sec`;
  } else if (seconds < 3600) {
    return `~${Math.ceil(seconds / 60)} min`;
  } else {
    return `~${Math.ceil(seconds / 3600)} hr`;
  }
}

// Generate a random Solana keypair and check if it matches the prefix
function generateVanityAddress() {
  if (!running) return;

  // Generate a keypair
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  
  // Check if it starts with our target prefix
  if (publicKey.toLowerCase().startsWith(targetPrefix.toLowerCase())) {
    // Found a match!
    ctx.postMessage({
      type: 'result',
      publicKey: publicKey,
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    });
    
    // Stop searching
    running = false;
    return;
  }
  
  // Update progress periodically
  addressesTried++;
  if (addressesTried % 100 === 0) {
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const rate = addressesTried / elapsedSeconds;
    
    // Estimate probability: 1/(58^n) where n is prefix length
    // 58 is the number of possible base58 characters
    const probability = 1 / Math.pow(58, targetPrefix.length);
    const estimatedTotalTries = 1 / probability;
    const estimatedTriesRemaining = estimatedTotalTries - addressesTried;
    const estimatedSecondsRemaining = estimatedTriesRemaining / rate;
    
    ctx.postMessage({
      type: 'progress',
      addressesTried,
      timeRemaining: formatTimeRemaining(estimatedSecondsRemaining),
    });
  }
  
  // Schedule next generation
  if (running) {
    if (addressesTried % 10 === 0) {
      // Use setTimeout occasionally to avoid blocking UI
      setTimeout(generateVanityAddress, 0);
    } else {
      // Run directly for better performance
      generateVanityAddress();
    }
  }
}

// Handle messages from the main thread
ctx.addEventListener('message', (event) => {
  const { type, prefix } = event.data;
  
  if (type === 'start') {
    // Start generation with the given prefix
    targetPrefix = prefix;
    addressesTried = 0;
    running = true;
    startTime = Date.now();
    
    // Start generating addresses
    generateVanityAddress();
  } else if (type === 'stop') {
    // Stop generation
    running = false;
  }
});

// Handle errors
ctx.addEventListener('error', (error) => {
  ctx.postMessage({
    type: 'error',
    error: error.message,
  });
  running = false;
});
