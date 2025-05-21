# Setting Up Your NymSOL Custom Domain on Netlify

## Purchasing a Domain

If you don't already own a domain name, you can purchase one directly through Netlify:

1. Go to your site dashboard on Netlify
2. Navigate to "Domain settings"
3. Click "Add or register domain"
4. Follow the steps to purchase a domain through Netlify

## Using an Existing Domain

If you already own a domain, you can connect it to your Netlify site:

1. Go to your site dashboard on Netlify
2. Navigate to "Domain settings"
3. Click "Add custom domain"
4. Enter your domain name and click "Verify"
5. Follow the DNS configuration instructions provided by Netlify

## Setting Up DNS Records

### Option 1: Using Netlify DNS (Recommended)

1. In your site's "Domain settings", click "Set up Netlify DNS" for your custom domain
2. Follow the instructions to configure your domain's nameservers
3. Wait for DNS propagation (can take up to 24-48 hours)

### Option 2: Using External DNS

If you prefer to keep your domain with your current DNS provider:

1. Add a CNAME record pointing to your Netlify site
   - Name/Host: www (or subdomain of your choice)
   - Value/Target: your-site-name.netlify.app
2. For the root domain, use your DNS provider's ALIAS/ANAME record or redirect

## SSL Configuration

Netlify automatically provisions SSL certificates for custom domains through Let's Encrypt. To ensure it's working:

1. Go to "Domain settings" > "HTTPS"
2. Ensure "Netlify managed certificate" is enabled
3. Check that certificate provisioning is complete

## Domain Security Recommendations for Crypto Applications

For a cryptocurrency app like NymSOL, enhance security with these additional settings:

### DNSSEC Configuration

1. Enable DNSSEC with your domain registrar if possible
2. If using Netlify DNS, DNSSEC can be enabled in the DNS settings

### Additional Security Headers

The netlify.toml file already includes security headers:
- Content-Security-Policy
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- X-Content-Type-Options

### Domain Privacy

1. Enable domain privacy with your registrar to protect personal information
2. If you purchased through Netlify, privacy protection is typically included

## Troubleshooting

If your domain isn't working correctly:

1. Check DNS propagation using tools like whatsmydns.net
2. Verify that all DNS records are properly configured
3. Ensure SSL certificate provisioning is complete
4. Check the Netlify status page for any ongoing issues