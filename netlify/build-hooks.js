/**
 * Netlify Build Hooks
 * 
 * This script copies the _redirects file to the dist folder
 * after the build process is complete.
 */
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'dist'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });
}

// Copy _redirects file to dist folder
fs.copyFileSync(
  path.join(__dirname, '_redirects'),
  path.join(__dirname, '..', 'dist', '_redirects')
);

console.log('Successfully copied _redirects file to dist folder');