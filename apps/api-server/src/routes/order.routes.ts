import { Router } from 'express';
import { orderController } from '../controllers/order.controller';

const router = Router();

router.post('/', (req, res) => orderController.createOrder(req, res));
router.get('/:id', (req, res) => orderController.getOrderById(req, res));

export default router;
