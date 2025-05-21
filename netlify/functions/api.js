import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { domainController } from '../../server/controllers/domainController.js';

const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/api', router);

// Domain routes
router.get('/domains/search', domainController.searchDomain);
router.post('/domains/register', domainController.registerDomain);
router.get('/domains/suggestions', domainController.getDomainSuggestions);
router.get('/user/domains', domainController.getUserDomains);
router.get('/user/balance', domainController.getUserBalance);
router.get('/user/vanity-wallets', domainController.getUserVanityWallets);

// 404 handler
router.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Error handler
router.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export const handler = serverless(app);