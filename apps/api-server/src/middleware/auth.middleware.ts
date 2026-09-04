import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phone: string;
    role: 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'ADMIN';
  };
}

/**
 * Require valid JWT. Rejects with 401/403 if missing or invalid.
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
}

/**
 * Optionally attach user if JWT is present, but never reject.
 */
export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const token = extractToken(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as AuthRequest['user'];
      req.user = decoded;
    } catch { /* ignore */ }
  }
  next();
}

/**
 * Restrict to specific roles. Must come after requireAuth.
 */
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges.' });
      return;
    }
    next();
  };
}

// Backwards-compat alias used by legacy imports
export const authenticateToken = requireAuth;

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}
