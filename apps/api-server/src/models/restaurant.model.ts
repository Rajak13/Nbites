import { Schema, model, Document, Model } from 'mongoose';

export interface IModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface IModifierGroup {
  id: string;
  title: string;
  type: 'single' | 'multi';
  required: boolean;
  options: IModifierOption[];
}

export interface IMenuItem {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  image?: string;
  isVeg: boolean;
  isSpicy?: boolean;
  prepTime?: string;
  isAvailable: boolean;
  groups: IModifierGroup[];
}

export interface IMenuCategory {
  id: string;
  name: string;
  sortOrder: number;
  items: IMenuItem[];
}

export interface IRestaurant extends Document {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  coverImage?: string;
  address: string;
  zone: string; // e.g. "Jhamsikhel", "Patan", "Baluwatar"
  city: string;
  phone: string;
  isOpen: boolean;
  isBusy: boolean;
  rating: number;
  reviewCount: number;
  estimatedPrepTimeMins: number;
  deliveryFeeBase: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  categories: IMenuCategory[];
  createdAt: Date;
  updatedAt: Date;
}

const ModifierOptionSchema = new Schema<IModifierOption>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ModifierGroupSchema = new Schema<IModifierGroup>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['single', 'multi'], default: 'single' },
    required: { type: Boolean, default: false },
    options: [ModifierOptionSchema],
  },
  { _id: false }
);

const MenuItemSchema = new Schema<IMenuItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    image: { type: String },
    isVeg: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    prepTime: { type: String, default: '15-20 MINS' },
    isAvailable: { type: Boolean, default: true },
    groups: [ModifierGroupSchema],
  },
  { _id: false }
);

const MenuCategorySchema = new Schema<IMenuCategory>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    items: [MenuItemSchema],
  },
  { _id: false }
);

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    tagline: { type: String },
    description: { type: String },
    coverImage: { type: String },
    address: { type: String, required: true },
    zone: { type: String, required: true },
    city: { type: String, default: 'Kathmandu' },
    phone: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    isBusy: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    estimatedPrepTimeMins: { type: Number, default: 20 },
    deliveryFeeBase: { type: Number, default: 50 },
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
    categories: [MenuCategorySchema],
  },
  {
    timestamps: true,
  }
);

// GeoJSON 2dsphere spatial index for proximity & radial queries
RestaurantSchema.index({ location: '2dsphere' });

export const Restaurant: Model<IRestaurant> =
  model<IRestaurant>('Restaurant', RestaurantSchema);
