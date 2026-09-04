import { Router } from 'express';
import { restaurantController } from '../controllers/restaurant.controller';

const router = Router();

// GET /api/v1/restaurants/nearby?lat=...&lng=...
router.get('/nearby', (req, res) => restaurantController.getNearbyRestaurants(req, res));

// GET /api/v1/restaurants/:slug
router.get('/:slug', (req, res) => restaurantController.getRestaurantBySlug(req, res));

// GET /api/v1/restaurants
router.get('/', (req, res) => restaurantController.getAllRestaurants(req, res));

export default router;
