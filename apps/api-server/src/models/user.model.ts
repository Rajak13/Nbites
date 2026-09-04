import { Schema, model, Document, Model } from 'mongoose';

export type UserRole = 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'ADMIN';
export type ThemePreference = 'cream' | 'dark';

export interface IUser extends Document {
  phone: string;
  name?: string;
  role: UserRole;
  themePreference: ThemePreference;
  lastLoginAt?: Date;
  restaurantId?: string;
  driverId?: string;
  savedAddresses?: {
    label: string;
    landmark: string;
    address: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    role: {
      type: String,
      enum: ['CUSTOMER', 'MERCHANT', 'DRIVER', 'ADMIN'],
      default: 'CUSTOMER',
      index: true,
    },
    themePreference: {
      type: String,
      enum: ['cream', 'dark'],
      default: 'cream',
    },
    lastLoginAt: { type: Date },
    restaurantId: { type: String },
    driverId: { type: String },
    savedAddresses: [
      {
        label: { type: String, default: 'Home' },
        landmark: { type: String, required: true },
        address: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = model<IUser>('User', UserSchema);
