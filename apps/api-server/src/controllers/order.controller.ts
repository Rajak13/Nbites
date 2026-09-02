import { Request, Response } from 'express';
import { z } from 'zod';

const createOrderSchema = z.object({
  customerId: z.string().optional().default('cust-demo-1'),
  restaurantId: z.string().default('rest-ktm-1'),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      specialInstructions: z.string().optional(),
    })
  ).min(1),
  deliveryAddress: z.string().min(3),
  deliveryLat: z.number(),
  deliveryLng: z.number(),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['ESEWA', 'KHALTI', 'COD', 'CARD']).default('ESEWA'),
});

export class OrderController {
  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const validated = createOrderSchema.parse(req.body);

      const subtotal = validated.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const deliveryFee = 50.0;
      const totalAmount = subtotal + deliveryFee;

      const orderNumber = `ORD-KTM-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        customerId: validated.customerId,
        restaurantId: validated.restaurantId,
        status: 'PENDING',
        subtotal,
        deliveryFee,
        totalAmount,
        deliveryAddress: validated.deliveryAddress,
        deliveryLat: validated.deliveryLat,
        deliveryLng: validated.deliveryLng,
        deliveryInstructions: validated.deliveryInstructions,
        items: validated.items,
        paymentMethod: validated.paymentMethod,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: newOrder,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while creating order',
      });
    }
  }

  public async getOrderById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json({
      success: true,
      data: {
        id,
        orderNumber: id.startsWith('ORD') ? id : `ORD-KTM-8942`,
        status: 'PREPARING',
        restaurantName: 'Bajeko Sekuwa Jhamsikhel',
        customerName: 'Aayush Shrestha',
        subtotal: 760,
        deliveryFee: 50,
        totalAmount: 810,
        deliveryAddress: 'Lazimpat Heights, Kathmandu',
        estimatedDeliveryTime: new Date(Date.now() + 18 * 60000).toISOString(),
        items: [
          { name: 'Smoked Timur Pork Sekuwa', qty: 1, price: 520 },
          { name: 'Jhol Momo (Buff)', qty: 1, price: 240 },
        ],
      },
    });
  }
}

export const orderController = new OrderController();
