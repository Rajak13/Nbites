import { Schema, model, Document, Model } from 'mongoose';

export interface IDriver extends Document {
  driverId: string;
  name: string;
  phone: string;
  vehiclePlate: string;
  vehicleType: string;
  isOnline: boolean;
  rating: number;
  totalTrips: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  currentOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>(
  {
    driverId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    vehiclePlate: { type: String, required: true },
    vehicleType: { type: String, default: 'Motorbike' },
    isOnline: { type: Boolean, default: false, index: true },
    rating: { type: Number, default: 4.9 },
    totalTrips: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true, // [longitude, latitude]
      },
    },
    currentOrderId: { type: String },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for finding closest available driver
DriverSchema.index({ location: '2dsphere' });

export const Driver: Model<IDriver> = model<IDriver>('Driver', DriverSchema);
