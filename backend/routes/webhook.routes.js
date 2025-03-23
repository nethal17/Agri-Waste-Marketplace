import express from 'express';
import { handleWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// Stripe webhook route
router.post('/webhooks', express.raw({ type: 'application/json' }), handleWebhook);

export default router;