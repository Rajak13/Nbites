import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { paymentRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// eSewa v2 Routes
router.post('/esewa/initiate', paymentRateLimiter, (req, res) =>
  paymentController.initiateEsewa(req, res)
);
router.get('/esewa/verify', (req, res) =>
  paymentController.verifyEsewaCallback(req, res)
);

// Khalti v2 Routes
router.post('/khalti/initiate', paymentRateLimiter, (req, res) =>
  paymentController.initiateKhalti(req, res)
);
router.post('/khalti/verify', (req, res) =>
  paymentController.verifyKhalti(req, res)
);

export default router;
