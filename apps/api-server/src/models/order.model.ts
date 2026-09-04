import { Schema, model, Document, Model } from 'mongoose';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'DISPATCHED'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'ESEWA' | 'KHALTI' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface IOrderItem {
  menuItemId: string;
  name: string;
  basePrice: number;
  price: number;
  quantity: number;
  selectedModifiers?: { id: string; name: string; price: number }[];
  specialInstructions?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  status: OrderStatus;
  customer: {
    phone: string;
    name?: string;
  };
  restaurant: {
    id: string;
    name: string;
    slug: string;
  };
  deliveryAddress: {
    landmark: string;
    address?: string;
    dropoffInstruction?: string;
    location?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  items: IOrderItem[];
  financialBreakdown: {
    foodSubtotal: number;
    packagingFee: number;
    deliveryFee: number;
    platformFee: number;
    totalPayable: number;
  };
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionUuid?: string;
    gatewayRefId?: string;
  };
  deliveryPin: string;
  assignedDriver?: {
    driverId: string;
    name: string;
    phone: string;
    vehiclePlate: string;
  };
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: { type: String, required: true },
    name: { type: String, required: true },
    basePrice: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedModifiers: [
      {
        id: String,
        name: String,
        price: Number,
      },
    ],
    specialInstructions: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: [
        'PLACED',
        'ACCEPTED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'DISPATCHED',
        'ARRIVED',
        'DELIVERED',
        'CANCELLED',
      ],
      default: 'PLACED',
      index: true,
    },
    customer: {
      phone: { type: String, required: true, index: true },
      name: { type: String, default: 'Customer' },
    },
    restaurant: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      slug: { type: String, required: true },
    },
    deliveryAddress: {
      landmark: { type: String, required: true },
      address: { type: String },
      dropoffInstruction: { type: String, default: 'call' },
      location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: [Number],
      },
    },
    items: [OrderItemSchema],
    financialBreakdown: {
      foodSubtotal: { type: Number, required: true },
      packagingFee: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 50 },
      platformFee: { type: Number, default: 0 },
      totalPayable: { type: Number, required: true },
    },
    payment: {
      method: {
        type: String,
        enum: ['ESEWA', 'KHALTI', 'COD'],
        default: 'ESEWA',
      },
      status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
        default: 'PENDING',
      },
      transactionUuid: { type: String },
      gatewayRefId: { type: String },
    },
    deliveryPin: { type: String, required: true },
    assignedDriver: {
      driverId: String,
      name: String,
      phone: String,
      vehiclePlate: String,
    },
    cancelReason: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ 'customer.phone': 1, createdAt: -1 });
OrderSchema.index({ 'restaurant.id': 1, status: 1 });

export const Order: Model<IOrder> = model<IOrder>('Order', OrderSchema);
