import { Request, Response } from 'express';
import { Restaurant } from '../models/restaurant.model';
import { calculateDistanceKm } from '../utils/geo.utils';

export class RestaurantController {
  /**
   * GET /api/v1/restaurants/nearby
   * Returns operational kitchens within radial distance of the customer's lat/lng coordinates.
   */
  public async getNearbyRestaurants(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lng, radiusKm = 6, cuisine, sort } = req.query;

      if (!lat || !lng) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_COORDINATES',
            message: 'Both lat and lng query parameters are required for proximity discovery.',
          },
        });
        return;
      }

      const customerLat = parseFloat(lat as string);
      const customerLng = parseFloat(lng as string);
      const maxDistanceMeters = parseFloat(radiusKm as string) * 1000;

      if (isNaN(customerLat) || isNaN(customerLng)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_COORDINATES',
            message: 'Latitude and longitude must be valid floating point numbers.',
          },
        });
        return;
      }

      // MongoDB 2dsphere spatial query
      const query: Record<string, unknown> = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [customerLng, customerLat], // [lng, lat]
            },
            $maxDistance: maxDistanceMeters,
          },
        },
      };

      if (cuisine && typeof cuisine === 'string') {
        query.$or = [
          { 'categories.name': { $regex: cuisine, $options: 'i' } },
          { tagline: { $regex: cuisine, $options: 'i' } },
        ];
      }

      const kitchens = await Restaurant.find(query).lean();

      // Compute exact straight-line distance in km and format response
      const results = kitchens.map((k) => {
        const distanceKm = calculateDistanceKm(
          { lat: customerLat, lng: customerLng },
          { lat: k.location.coordinates[1], lng: k.location.coordinates[0] }
        );

        return {
          id: k._id.toString(),
          name: k.name,
          slug: k.slug,
          tagline: k.tagline,
          coverImage: k.coverImage,
          address: k.address,
          zone: k.zone,
          city: k.city,
          isOpen: k.isOpen,
          isBusy: k.isBusy,
          rating: k.rating,
          reviewCount: k.reviewCount,
          distanceKm: parseFloat(distanceKm.toFixed(2)),
          estimatedPrepTimeMins: k.estimatedPrepTimeMins,
          deliveryFee: k.deliveryFeeBase,
          categoriesCount: k.categories?.length || 0,
        };
      });

      // Optional sort override
      if (sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'prepTime') {
        results.sort((a, b) => a.estimatedPrepTimeMins - b.estimatedPrepTimeMins);
      }

      res.json({
        success: true,
        data: results,
        meta: {
          total: results.length,
          customerCoordinates: { lat: customerLat, lng: customerLng },
          searchRadiusKm: radiusKm,
        },
      });
    } catch (error: unknown) {
      console.error('Error fetching nearby restaurants:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to query nearby kitchens from database.',
        },
      });
    }
  }

  /**
   * GET /api/v1/restaurants/:slug
   * Returns full restaurant details with embedded categories, menu items, and modifier groups.
   */
  public async getRestaurantBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_SLUG',
            message: 'Restaurant slug is required.',
          },
        });
        return;
      }

      const kitchen = await Restaurant.findOne({ slug: slug.toLowerCase() }).lean();

      if (!kitchen) {
        res.status(404).json({
          success: false,
          error: {
            code: 'RESTAURANT_NOT_FOUND',
            message: `Kitchen with slug '${slug}' does not exist or is inactive.`,
          },
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: kitchen._id.toString(),
          name: kitchen.name,
          slug: kitchen.slug,
          tagline: kitchen.tagline,
          description: kitchen.description,
          coverImage: kitchen.coverImage,
          address: kitchen.address,
          zone: kitchen.zone,
          city: kitchen.city,
          phone: kitchen.phone,
          isOpen: kitchen.isOpen,
          isBusy: kitchen.isBusy,
          rating: kitchen.rating,
          reviewCount: kitchen.reviewCount,
          estimatedPrepTimeMins: kitchen.estimatedPrepTimeMins,
          deliveryFeeBase: kitchen.deliveryFeeBase,
          coordinates: {
            lng: kitchen.location.coordinates[0],
            lat: kitchen.location.coordinates[1],
          },
          categories: kitchen.categories || [],
        },
      });
    } catch (error: unknown) {
      console.error('Error fetching restaurant by slug:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to retrieve restaurant details.',
        },
      });
    }
  }

  /**
   * GET /api/v1/restaurants
   * Returns all active restaurants.
   */
  public async getAllRestaurants(req: Request, res: Response): Promise<void> {
    try {
      const { city } = req.query;
      const query: Record<string, unknown> = { isOpen: true };

      if (city && typeof city === 'string' && city.toUpperCase() !== 'ALL' && city.toUpperCase() !== 'ALL SECTORS') {
        query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
      }

      const kitchens = await Restaurant.find(query).lean();

      const data = kitchens.map((k) => ({
        id: k._id.toString(),
        name: k.name,
        slug: k.slug,
        tagline: k.tagline,
        coverImage: k.coverImage,
        address: k.address,
        zone: k.zone,
        city: k.city,
        isOpen: k.isOpen,
        rating: k.rating,
        reviewCount: k.reviewCount,
        estimatedPrepTimeMins: k.estimatedPrepTimeMins,
        deliveryFeeBase: k.deliveryFeeBase,
        categoriesCount: k.categories?.length || 0,
      }));

      res.json({
        success: true,
        data,
      });
    } catch (error: unknown) {
      console.error('Error fetching all restaurants:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to list restaurants.',
        },
      });
    }
  }
}

export const restaurantController = new RestaurantController();
