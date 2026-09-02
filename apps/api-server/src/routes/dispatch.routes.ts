import { Router } from 'express';
import { dispatchController } from '../controllers/dispatch.controller';

const router = Router();

router.post('/match', (req, res) =>
  dispatchController.matchNearestDriver(req, res)
);
router.get('/fleet', (req, res) =>
  dispatchController.getFleetStatus(req, res)
);

export default router;
