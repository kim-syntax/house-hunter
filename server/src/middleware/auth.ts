/**
 * Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { id: string; email: string; role: string };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

/**
 * Check if user is landlord
 */
export const isLandlord = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'LANDLORD') {
    return res.status(403).json({
      success: false,
      error: 'Only landlords can access this resource',
    });
  }
  next();
};

/**
 * Check if user is tenant
 */
export const isTenant = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'TENANT') {
    return res.status(403).json({
      success: false,
      error: 'Only tenants can access this resource',
    });
  }
  next();
};

/**
 * Check if user is admin
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Only admins can access this resource',
    });
  }
  next();
};
