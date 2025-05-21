# Netlify Deployment Guide for NymSOL

## Deployment Instructions

1. **Create a Netlify Account**
   - Go to [Netlify](https://www.netlify.com/) and sign up or log in.

2. **Connect Your Repository**
   - From the Netlify dashboard, click "New site from Git".
   - Connect to your Git provider (GitHub, GitLab, or Bitbucket).
   - Select this repository.

3. **Configure the Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - The netlify.toml file already includes these settings.

4. **Set Environment Variables**
   - Go to Site settings > Build & deploy > Environment
   - Add the following variables:
     - `VITE_RPC_ENDPOINT`: Your Solana RPC endpoint (e.g., https://api.mainnet-beta.solana.com)
     - `VITE_SOLANA_NETWORK`: mainnet-beta (or devnet for testing)

5. **Deploy Your Site**
   - Click "Deploy site".
   - Netlify will build and deploy your application.

## Continuous Deployment

After the initial setup, any changes pushed to your repository will automatically trigger a new build and deployment.

## Custom Domain

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to set up your domain

## Troubleshooting

- If you encounter build errors, check the build logs for details.
- Ensure all environment variables are correctly set.
- Check for any path issues in the application code.

## Function Logs

To view logs from your Netlify Functions:
1. Go to Functions in your site dashboard
2. Select the function you want to inspect
3. View the function logs to debug any issues