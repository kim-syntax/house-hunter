/**
 * Express Router setup for House Hunting App
 */

import express from 'express';
import * as authController from '../controllers/authController';
import * as houseController from '../controllers/houseController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// ============ AUTH ROUTES ============

router.post('/auth/signup/tenant', authController.signupTenant);
router.post('/auth/signup/landlord', authController.signupLandlord);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/me', authenticate, authController.getCurrentUser);

// ============ HOUSE ROUTES ============

// Get houses (public)
router.get('/houses', houseController.getHouses);
router.get('/houses/:id', houseController.getHouseById);

// Create/update/delete houses (landlord only)
router.post('/houses', authenticate, houseController.createHouse);
router.put('/houses/:id', authenticate, houseController.updateHouse);
router.delete('/houses/:id', authenticate, houseController.deleteHouse);
router.patch('/houses/:id/status', authenticate, houseController.updateHouseStatus);

// Get landlord's houses
router.get('/landlords/:landlordId/houses', houseController.getLandlordHouses);
router.get('/my-houses', authenticate, houseController.getLandlordHouses);

// ============ PLACEHOLDER ROUTES ============
// These routes would be implemented following the same pattern:
// - /reviews - Review CRUD operations
// - /comments - Comment CRUD operations
// - /messages - Messaging system
// - /favorites - Favorite management
// - /users - User profile updates
// - /notifications - Notification retrieval

export default router;
