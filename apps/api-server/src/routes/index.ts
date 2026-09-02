import { Router } from 'express';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import dispatchRoutes from './dispatch.routes';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'nbites-api-server',
    region: 'Kathmandu, NP',
  });
});

// Mounted v1 API routes
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/dispatch', dispatchRoutes);

export default router;
