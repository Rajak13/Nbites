import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Public auth endpoints
router.post('/request-otp', authRateLimiter, (req, res) =>
  authController.requestOtp(req, res)
);

router.post('/verify-otp', (req, res) =>
  authController.verifyOtp(req, res)
);

router.post('/firebase-login', (req, res) =>
  authController.firebaseLogin(req, res)
);

// Protected session endpoints
router.get('/me', requireAuth, (req, res) =>
  authController.getMe(req, res)
);

router.patch('/me', requireAuth, (req, res) =>
  authController.updateProfile(req, res)
);

router.get('/my-orders', requireAuth, (req, res) =>
  authController.getMyOrders(req, res)
);

export default router;
