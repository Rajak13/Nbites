import { Request, Response } from 'express';
import { z } from 'zod';
import { Order, OrderStatus, PaymentMethod } from '../models/order.model';
import { Restaurant } from '../models/restaurant.model';
import { esewaService } from '../services/esewa.service';
import { khaltiService } from '../services/khalti.service';
import { calculateDistanceKm } from '../utils/geo.utils';
import { config } from '../config/env';

const createOrderSchema = z.object({
  customerPhone: z.string().min(10),
  customerName: z.string().optional().default('Customer'),
  restaurantId: z.string().min(1), // can be MongoDB ObjectId or slug
  deliveryLandmark: z.string().min(3),
  deliveryAddress: z.string().optional(),
  dropoffInstruction: z.string().optional().default('call'),
  deliveryLat: z.number().optional(),
  deliveryLng: z.number().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string(),
        name: z.string(),
        basePrice: z.number().positive(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        selectedModifiers: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              price: z.number(),
            })
          )
          .optional(),
        specialInstructions: z.string().optional(),
      })
    )
    .min(1),
  paymentMethod: z.enum(['ESEWA', 'KHALTI', 'COD']).default('ESEWA'),
});

export class OrderController {
  /**
   * POST /api/v1/orders
   * Creates an order in MongoDB, validates restaurant, calculates spatial fees, and initiates payment.
   */
  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const validated = createOrderSchema.parse(req.body);

      // 1. Verify restaurant exists
      let restaurant = await Restaurant.findById(validated.restaurantId).lean();
      if (!restaurant) {
        restaurant = await Restaurant.findOne({ slug: validated.restaurantId }).lean();
      }

      if (!restaurant) {
        res.status(404).json({
          success: false,
          error: {
            code: 'RESTAURANT_NOT_FOUND',
            message: `Target kitchen '${validated.restaurantId}' not found.`,
          },
        });
        return;
      }

      if (!restaurant.isOpen) {
        res.status(400).json({
          success: false,
          error: {
            code: 'RESTAURANT_CLOSED',
            message: `${restaurant.name} is currently closed. Orders cannot be placed at this time.`,
          },
        });
        return;
      }

      // 2. Financial calculation
      const foodSubtotal = validated.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Distance calculation if customer coordinates provided
      let deliveryDistanceKm = 1.5;
      if (
        validated.deliveryLat !== undefined &&
        validated.deliveryLng !== undefined &&
        restaurant.location?.coordinates
      ) {
        deliveryDistanceKm = calculateDistanceKm(
          {
            lat: restaurant.location.coordinates[1],
            lng: restaurant.location.coordinates[0],
          },
          { lat: validated.deliveryLat, lng: validated.deliveryLng }
        );
      }

      // Distance Fee formula: Base Rs. 50 up to 2km, then +Rs. 15 per extra km (PRD §2.4)
      const baseFee = restaurant.deliveryFeeBase || 50;
      let deliveryFee = baseFee;
      if (deliveryDistanceKm > 2) {
        deliveryFee = Math.round(baseFee + (deliveryDistanceKm - 2) * 15);
      }

      const packagingFee = 0;
      const platformFee = 0;
      const totalPayable = foodSubtotal + deliveryFee + packagingFee + platformFee;

      // 3. PRD COD Fraud limit (< NPR 5,000)
      if (validated.paymentMethod === 'COD' && totalPayable > 5000) {
        res.status(400).json({
          success: false,
          error: {
            code: 'COD_LIMIT_EXCEEDED',
            message:
              'Cash on Delivery is limited to orders under NPR 5,000 as per anti-fraud rules.',
          },
        });
        return;
      }

      // 4. Generate unique identifiers
      const orderNumber = `ORD-KTM-${Date.now().toString().slice(-4)}${Math.floor(
        100 + Math.random() * 900
      )}`;
      const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString();

      // 5. Payment gateway payload initiation
      let paymentHandoff = null;
      const transactionUuid = `${orderNumber}-${Date.now()}`;

      if (validated.paymentMethod === 'ESEWA') {
        const successUrl = `${config.corsOrigin}/order-tracking/${orderNumber}?payment=success`;
        const failureUrl = `${config.corsOrigin}/checkout?payment=failed`;

        const esewaPayload = esewaService.initiatePayment({
          amount: foodSubtotal,
          deliveryFee,
          transactionUuid,
          successUrl,
          failureUrl,
        });

        paymentHandoff = {
          provider: 'ESEWA',
          gatewayUrl: esewaService.getGatewayUrl(),
          payload: esewaPayload,
        };
      } else if (validated.paymentMethod === 'KHALTI') {
        try {
          const khaltiRes = await khaltiService.initiatePayment({
            return_url: `${config.corsOrigin}/order-tracking/${orderNumber}?payment=khalti_success`,
            website_url: config.corsOrigin,
            amount: Math.round(totalPayable * 100), // in Paisa
            purchase_order_id: orderNumber,
            purchase_order_name: `nBites Order ${orderNumber}`,
            customer_info: {
              name: validated.customerName,
              phone: validated.customerPhone,
              email: `${validated.customerPhone}@nbites.internal`,
            },
          });

          paymentHandoff = {
            provider: 'KHALTI',
            paymentUrl: khaltiRes.payment_url,
            pidx: khaltiRes.pidx,
          };
        } catch (khaltiErr) {
          console.warn('Khalti initiate warning (continuing with demo handoff):', khaltiErr);
          paymentHandoff = {
            provider: 'KHALTI',
            paymentUrl: `/order-tracking/${orderNumber}?payment=khalti_mock`,
            pidx: `khalti_pidx_${Date.now()}`,
          };
        }
      }

      // 6. Write Order document to MongoDB Atlas
      const newOrder = await Order.create({
        orderNumber,
        status: 'PLACED',
        customer: {
          phone: validated.customerPhone,
          name: validated.customerName,
        },
        restaurant: {
          id: restaurant._id.toString(),
          name: restaurant.name,
          slug: restaurant.slug,
        },
        deliveryAddress: {
          landmark: validated.deliveryLandmark,
          address: validated.deliveryAddress,
          dropoffInstruction: validated.dropoffInstruction,
          location:
            validated.deliveryLat && validated.deliveryLng
              ? {
                  type: 'Point',
                  coordinates: [validated.deliveryLng, validated.deliveryLat],
                }
              : undefined,
        },
        items: validated.items,
        financialBreakdown: {
          foodSubtotal,
          packagingFee,
          deliveryFee,
          platformFee,
          totalPayable,
        },
        payment: {
          method: validated.paymentMethod,
          status: 'PENDING',
          transactionUuid,
        },
        deliveryPin,
      });

      res.status(201).json({
        success: true,
        message: 'Order created and persisted successfully in MongoDB.',
        data: {
          order: {
            id: newOrder._id.toString(),
            orderNumber: newOrder.orderNumber,
            status: newOrder.status,
            restaurantName: newOrder.restaurant.name,
            totalPayable: newOrder.financialBreakdown.totalPayable,
            deliveryFee: newOrder.financialBreakdown.deliveryFee,
            deliveryPin: newOrder.deliveryPin,
            createdAt: newOrder.createdAt,
          },
          paymentHandoff,
        },
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid order input data.',
            details: error.errors,
          },
        });
        return;
      }

      console.error('Error creating order in database:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'ORDER_CREATION_FAILED',
          message: 'Failed to persist order to database.',
        },
      });
    }
  }

  /**
   * GET /api/v1/orders/:id
   * Retrieves an order by orderNumber (e.g. ORD-KTM-1082) or MongoDB _id.
   */
  public async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const order = await Order.findOne({
        $or: [{ orderNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      }).lean();

      if (!order) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: `Order '${id}' not found in database.`,
          },
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: order._id.toString(),
          orderNumber: order.orderNumber,
          status: order.status,
          customer: order.customer,
          restaurant: order.restaurant,
          deliveryAddress: order.deliveryAddress,
          items: order.items,
          financialBreakdown: order.financialBreakdown,
          payment: order.payment,
          deliveryPin: order.deliveryPin,
          assignedDriver: order.assignedDriver,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });
    } catch (error: unknown) {
      console.error('Error fetching order by ID:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to retrieve order.',
        },
      });
    }
  }

  /**
   * PATCH /api/v1/orders/:id/status
   * Updates order lifecycle status (Kitchen Acceptance, Prep, Delivery).
   */
  public async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, cancelReason } = req.body;

      const validStatuses: OrderStatus[] = [
        'PLACED',
        'ACCEPTED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'DISPATCHED',
        'ARRIVED',
        'DELIVERED',
        'CANCELLED',
      ];

      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: `Status must be one of: ${validStatuses.join(', ')}`,
          },
        });
        return;
      }

      const updatePayload: Record<string, unknown> = { status };
      if (cancelReason) {
        updatePayload.cancelReason = cancelReason;
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { $or: [{ orderNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { $set: updatePayload },
        { new: true }
      ).lean();

      if (!updatedOrder) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: `Order '${id}' not found to update status.`,
          },
        });
        return;
      }

      res.json({
        success: true,
        message: `Order ${updatedOrder.orderNumber} status transitioned to ${status}.`,
        data: {
          orderNumber: updatedOrder.orderNumber,
          status: updatedOrder.status,
          updatedAt: updatedOrder.updatedAt,
        },
      });
    } catch (error: unknown) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to update order status.',
        },
      });
    }
  }
}

export const orderController = new OrderController();
