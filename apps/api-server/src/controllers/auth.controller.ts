import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { generateOtp, verifyOtp } from '../services/otp.service';
import { smsService } from '../services/sms.service';
import { config } from '../config/env';
import { AuthRequest } from '../middleware/auth.middleware';
import { hashPassword, verifyPassword } from '../utils/password.util';

function sanitizeNepalPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 13 && clean.startsWith('977')) {
    return clean.slice(3);
  }
  if (clean.length === 10 && (clean.startsWith('98') || clean.startsWith('97'))) {
    return clean;
  }
  return clean;
}

function isValidNepalPhone(phone: string): boolean {
  return /^9[78]\d{8}$/.test(phone);
}

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Email-based signup requiring a valid Nepal contact mobile number
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, phone: rawPhone, name, city, termsAccepted } = req.body;

      if (!email || !password || !rawPhone) {
        res.status(400).json({
          success: false,
          message: 'Email, password, and mobile number are required.',
        });
        return;
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        res.status(400).json({
          success: false,
          message: 'Please enter a valid email address.',
        });
        return;
      }

      if (String(password).length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters.',
        });
        return;
      }

      const phone = sanitizeNepalPhone(String(rawPhone));
      if (!isValidNepalPhone(phone)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Nepal phone format. Must be a 10-digit number starting with 98 or 97.',
        });
        return;
      }

      // Check if user already exists with this email
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please sign in.',
        });
        return;
      }

      const hashedPassword = hashPassword(String(password));
      const now = new Date();

      const user = await User.create({
        email: cleanEmail,
        password: hashedPassword,
        phone,
        name: name?.trim() || 'nBites Explorer',
        role: 'CUSTOMER',
        themePreference: 'cream',
        city: city?.trim() || 'Dharan',
        termsAccepted: termsAccepted !== undefined ? Boolean(termsAccepted) : true,
        termsAcceptedAt: now,
        lastLoginAt: now,
        savedAddresses: [],
      });

      const token = jwt.sign(
        {
          id: user._id.toString(),
          email: user.email,
          phone: user.phone,
          role: user.role,
          restaurantId: user.restaurantId,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
      );

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role,
            city: user.city || 'Dharan',
            restaurantId: user.restaurantId,
            termsAccepted: user.termsAccepted ?? true,
            themePreference: user.themePreference || 'cream',
            savedAddresses: user.savedAddresses || [],
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error: any) {
      console.error('[AuthController.register] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error registering account.',
      });
    }
  }

  /**
   * POST /api/v1/auth/login
   * Email + Password authentication for Customers and Merchants/Staff
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required.',
        });
        return;
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const user = await User.findOne({ email: cleanEmail });

      if (!user || !user.password) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const isMatch = verifyPassword(String(password), user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      user.lastLoginAt = new Date();
      await user.save();

      const token = jwt.sign(
        {
          id: user._id.toString(),
          email: user.email,
          phone: user.phone,
          role: user.role,
          restaurantId: user.restaurantId,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
      );

      res.status(200).json({
        success: true,
        message: 'Signed in successfully.',
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role,
            city: user.city || 'Dharan',
            restaurantId: user.restaurantId,
            termsAccepted: user.termsAccepted ?? true,
            themePreference: user.themePreference || 'cream',
            savedAddresses: user.savedAddresses || [],
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error: any) {
      console.error('[AuthController.login] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during sign in.',
      });
    }
  }

  /**
   * POST /api/v1/auth/request-otp
   */
  async requestOtp(req: Request, res: Response): Promise<void> {
    try {
      const rawPhone = req.body.phone;
      if (!rawPhone || typeof rawPhone !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Phone number is required.',
        });
        return;
      }

      const phone = sanitizeNepalPhone(rawPhone);
      if (!isValidNepalPhone(phone)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Nepal mobile number. Must be a 10-digit number starting with 98 or 97.',
        });
        return;
      }

      const otp = await generateOtp(phone);
      await smsService.sendOtp(phone, otp);

      res.status(200).json({
        success: true,
        message: 'Security verification code transmitted successfully.',
        data: {
          phone,
        },
      });
    } catch (error: any) {
      console.error('[AuthController.requestOtp] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while transmitting OTP.',
      });
    }
  }

  /**
   * POST /api/v1/auth/verify-otp
   */
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phone: rawPhone, otp, name, city, termsAccepted } = req.body;

      if (!rawPhone || !otp) {
        res.status(400).json({
          success: false,
          message: 'Both phone and verification code are required.',
        });
        return;
      }

      const phone = sanitizeNepalPhone(String(rawPhone));
      if (!isValidNepalPhone(phone)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Nepal phone format.',
        });
        return;
      }

      const verifyResult = await verifyOtp(phone, String(otp).trim());
      if (!verifyResult.success) {
        if (verifyResult.reason === 'locked') {
          res.status(429).json({
            success: false,
            message: 'Too many failed verification attempts. Number locked for 15 minutes.',
          });
          return;
        }
        if (verifyResult.reason === 'expired') {
          res.status(400).json({
            success: false,
            message: 'Verification code has expired. Please request a new code.',
          });
          return;
        }
        res.status(400).json({
          success: false,
          message: 'Incorrect verification code. Please check and try again.',
        });
        return;
      }

      // Upsert User in MongoDB
      let user = await User.findOne({ phone });
      const now = new Date();

      if (!user) {
        user = await User.create({
          phone,
          name: name?.trim() || 'nBites Explorer',
          role: 'CUSTOMER',
          themePreference: 'cream',
          city: city?.trim() || 'Dharan',
          termsAccepted: termsAccepted !== undefined ? Boolean(termsAccepted) : true,
          termsAcceptedAt: now,
          lastLoginAt: now,
          savedAddresses: [],
        });
      } else {
        user.lastLoginAt = now;
        if (name && name.trim() && (!user.name || user.name === 'nBites Explorer')) {
          user.name = name.trim();
        }
        if (city && city.trim()) {
          user.city = city.trim();
        }
        if (termsAccepted) {
          user.termsAccepted = true;
          user.termsAcceptedAt = now;
        }
        await user.save();
      }

      // Sign JWT token
      const token = jwt.sign(
        {
          id: user._id.toString(),
          phone: user.phone,
          role: user.role,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
      );

      res.status(200).json({
        success: true,
        message: 'Verification successful.',
        data: {
          token,
          user: {
            id: user._id.toString(),
            phone: user.phone,
            name: user.name,
            role: user.role,
            city: user.city || 'Dharan',
            termsAccepted: user.termsAccepted ?? true,
            themePreference: user.themePreference || 'cream',
            savedAddresses: user.savedAddresses || [],
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error: any) {
      console.error('[AuthController.verifyOtp] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during verification.',
      });
    }
  }

  /**
   * POST /api/v1/auth/firebase-login
   * Authenticates a user who has verified their phone number via Firebase Phone Auth
   */
  async firebaseLogin(req: Request, res: Response): Promise<void> {
    try {
      const { phone: rawPhone, name, city, termsAccepted } = req.body;

      if (!rawPhone) {
        res.status(400).json({
          success: false,
          message: 'Phone number is required.',
        });
        return;
      }

      const phone = sanitizeNepalPhone(String(rawPhone));
      if (!isValidNepalPhone(phone)) {
        res.status(400).json({
          success: false,
          message: 'Invalid Nepal mobile number format.',
        });
        return;
      }

      // Upsert User in MongoDB
      let user = await User.findOne({ phone });
      const now = new Date();

      if (!user) {
        user = await User.create({
          phone,
          name: name?.trim() || 'nBites Explorer',
          role: 'CUSTOMER',
          themePreference: 'cream',
          city: city?.trim() || 'Dharan',
          termsAccepted: termsAccepted !== undefined ? Boolean(termsAccepted) : true,
          termsAcceptedAt: now,
          lastLoginAt: now,
          savedAddresses: [],
        });
      } else {
        user.lastLoginAt = now;
        if (name && name.trim() && (!user.name || user.name === 'nBites Explorer')) {
          user.name = name.trim();
        }
        if (city && city.trim()) {
          user.city = city.trim();
        }
        if (termsAccepted) {
          user.termsAccepted = true;
          user.termsAcceptedAt = now;
        }
        await user.save();
      }

      // Sign nBites JWT token
      const token = jwt.sign(
        {
          id: user._id.toString(),
          phone: user.phone,
          role: user.role,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
      );

      res.status(200).json({
        success: true,
        message: 'Firebase authentication successful.',
        data: {
          token,
          user: {
            id: user._id.toString(),
            phone: user.phone,
            name: user.name,
            role: user.role,
            city: user.city || 'Dharan',
            termsAccepted: user.termsAccepted ?? true,
            themePreference: user.themePreference || 'cream',
            savedAddresses: user.savedAddresses || [],
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error: any) {
      console.error('[AuthController.firebaseLogin] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during Firebase authentication.',
      });
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User record not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role,
            city: user.city || 'Dharan',
            restaurantId: user.restaurantId,
            termsAccepted: user.termsAccepted ?? true,
            themePreference: user.themePreference || 'cream',
            savedAddresses: user.savedAddresses || [],
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error: any) {
      console.error('[AuthController.getMe] Error:', error);
      res.status(500).json({ success: false, message: 'Error retrieving user profile.' });
    }
  }

  /**
   * PATCH /api/v1/auth/me
   */
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      const { name, themePreference, savedAddresses, city } = req.body;

      if (name !== undefined) user.name = String(name).trim();
      if (city !== undefined && typeof city === 'string') user.city = city.trim();
      if (themePreference === 'cream' || themePreference === 'dark') {
        user.themePreference = themePreference;
      }
      if (Array.isArray(savedAddresses)) {
        user.savedAddresses = savedAddresses;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile preferences updated successfully.',
        data: {
          user: {
            id: user._id.toString(),
            phone: user.phone,
            name: user.name,
            role: user.role,
            city: user.city || 'Dharan',
            termsAccepted: user.termsAccepted ?? true,
            themePreference: user.themePreference || 'cream',
            savedAddresses: user.savedAddresses || [],
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error: any) {
      console.error('[AuthController.updateProfile] Error:', error);
      res.status(500).json({ success: false, message: 'Failed to update profile.' });
    }
  }

  /**
   * GET /api/v1/auth/my-orders
   */
  async getMyOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      // Query customer orders by phone number
      const orders = await Order.find({ 'customer.phone': user.phone })
        .sort({ createdAt: -1 })
        .limit(20);

      res.status(200).json({
        success: true,
        data: {
          orders: orders.map((o) => ({
            id: o._id.toString(),
            orderNumber: o.orderNumber,
            restaurantName: o.restaurant?.name || 'Partner Kitchen',
            status: o.status,
            totalPayable: o.financialBreakdown?.totalPayable || 0,
            paymentMethod: o.payment?.method || 'COD',
            deliveryLandmark: o.deliveryAddress?.landmark || '',
            deliveryPin: o.deliveryPin,
            createdAt: o.createdAt,
            itemsCount: o.items.reduce((sum, it) => sum + it.quantity, 0),
          })),
        },
      });
    } catch (error: any) {
      console.error('[AuthController.getMyOrders] Error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve order history.' });
    }
  }
}

export const authController = new AuthController();
