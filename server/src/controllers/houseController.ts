/**
 * House Controller
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Get all houses with pagination and filters
 */
export const getHouses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 20, city, estate, minPrice, maxPrice, amenities } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const size = Math.min(100, parseInt(pageSize as string) || 20);
    const skip = (pageNum - 1) * size;

    // Build where clause
    const where: any = {
      status: 'AVAILABLE',
      deletedAt: null,
    };

    if (city) {
      where.city = city;
    }

    if (estate) {
      where.estate = estate;
    }

    if (minPrice || maxPrice) {
      where.monthlyRent = {};
      if (minPrice) where.monthlyRent.gte = parseFloat(minPrice as string);
      if (maxPrice) where.monthlyRent.lte = parseFloat(maxPrice as string);
    }

    // Get houses with relations
    const [houses, total] = await Promise.all([
      prisma.house.findMany({
        where,
        skip,
        take: size,
        include: {
          landlord: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePhotoUrl: true,
                },
              },
            },
          },
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
          amenities: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.house.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        data: houses,
        page: pageNum,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single house by ID
 */
export const getHouseById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const house = await prisma.house.findUnique({
      where: { id },
      include: {
        landlord: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
        photos: {
          orderBy: { displayOrder: 'asc' },
        },
        amenities: true,
        rules: true,
      },
    });

    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House not found',
      });
    }

    // Increment view count (async, no await)
    prisma.house.update({
      where: { id },
      data: { viewCount: house.viewCount + 1 },
    }).catch(console.error);

    res.json({
      success: true,
      data: house,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new house (landlord only)
 */
export const createHouse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'LANDLORD') {
      return res.status(403).json({
        success: false,
        error: 'Only landlords can create listings',
      });
    }

    const {
      title,
      description,
      houseType,
      bedrooms,
      bathrooms,
      sqft,
      monthlyRent,
      deposit,
      waterCharge,
      electricityCharge,
      parkingCharge,
      address,
      city,
      estate,
      street,
      latitude,
      longitude,
      availabilityDate,
      amenities,
      rules,
    } = req.body;

    // Validate required fields
    if (
      !title || !description || !houseType || !bedrooms || !bathrooms ||
      !monthlyRent || !deposit || !address || !city || !estate || !street ||
      latitude === undefined || longitude === undefined || !availabilityDate
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Get landlord profile
    const landlordProfile = await prisma.landlordProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!landlordProfile) {
      return res.status(400).json({
        success: false,
        error: 'Complete your landlord profile first',
      });
    }

    // Create house with amenities and rules
    const house = await prisma.house.create({
      data: {
        landlordId: landlordProfile.id,
        title,
        description,
        houseType,
        bedrooms,
        bathrooms,
        sqft,
        monthlyRent: parseFloat(monthlyRent),
        deposit: parseFloat(deposit),
        waterCharge: waterCharge ? parseFloat(waterCharge) : null,
        electricityCharge: electricityCharge ? parseFloat(electricityCharge) : null,
        parkingCharge: parkingCharge ? parseFloat(parkingCharge) : null,
        address,
        city,
        estate,
        street,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        availabilityDate: new Date(availabilityDate),
        amenities: {
          create: (amenities || []).map((amenity: string) => ({
            amenity,
          })),
        },
        rules: {
          create: (rules || []).map((rule: string) => ({
            rule,
          })),
        },
      },
      include: {
        amenities: true,
        rules: true,
      },
    });

    res.status(201).json({
      success: true,
      data: house,
      message: 'House listing created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update house (landlord only)
 */
export const updateHouse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'LANDLORD') {
      return res.status(403).json({
        success: false,
        error: 'Only landlords can update listings',
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if house exists and belongs to user
    const house = await prisma.house.findUnique({
      where: { id },
      include: { landlord: true },
    });

    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House not found',
      });
    }

    if (house.landlord.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this listing',
      });
    }

    // Parse numeric fields
    const dataToUpdate: any = { ...updateData };
    if (dataToUpdate.monthlyRent) dataToUpdate.monthlyRent = parseFloat(dataToUpdate.monthlyRent);
    if (dataToUpdate.deposit) dataToUpdate.deposit = parseFloat(dataToUpdate.deposit);
    if (dataToUpdate.waterCharge) dataToUpdate.waterCharge = parseFloat(dataToUpdate.waterCharge);
    if (dataToUpdate.electricityCharge) dataToUpdate.electricityCharge = parseFloat(dataToUpdate.electricityCharge);
    if (dataToUpdate.parkingCharge) dataToUpdate.parkingCharge = parseFloat(dataToUpdate.parkingCharge);
    if (dataToUpdate.latitude) dataToUpdate.latitude = parseFloat(dataToUpdate.latitude);
    if (dataToUpdate.longitude) dataToUpdate.longitude = parseFloat(dataToUpdate.longitude);
    if (dataToUpdate.availabilityDate) dataToUpdate.availabilityDate = new Date(dataToUpdate.availabilityDate);

    // Remove amenities and rules from direct update
    delete dataToUpdate.amenities;
    delete dataToUpdate.rules;

    const updatedHouse = await prisma.house.update({
      where: { id },
      data: dataToUpdate,
      include: {
        amenities: true,
        rules: true,
        photos: true,
      },
    });

    res.json({
      success: true,
      data: updatedHouse,
      message: 'House listing updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete house (landlord only)
 */
export const deleteHouse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'LANDLORD') {
      return res.status(403).json({
        success: false,
        error: 'Only landlords can delete listings',
      });
    }

    const { id } = req.params;

    // Check if house exists and belongs to user
    const house = await prisma.house.findUnique({
      where: { id },
      include: { landlord: true },
    });

    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House not found',
      });
    }

    if (house.landlord.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this listing',
      });
    }

    // Soft delete
    const deletedHouse = await prisma.house.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.json({
      success: true,
      data: deletedHouse,
      message: 'House listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get landlord's houses
 */
export const getLandlordHouses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'LANDLORD') {
      return res.status(403).json({
        success: false,
        error: 'Only landlords can view their listings',
      });
    }

    const { page = 1, pageSize = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const size = Math.min(100, parseInt(pageSize as string) || 20);
    const skip = (pageNum - 1) * size;

    // Get landlord profile
    const landlordProfile = await prisma.landlordProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!landlordProfile) {
      return res.status(400).json({
        success: false,
        error: 'Landlord profile not found',
      });
    }

    const [houses, total] = await Promise.all([
      prisma.house.findMany({
        where: {
          landlordId: landlordProfile.id,
          deletedAt: null,
        },
        skip,
        take: size,
        include: {
          photos: { where: { isPrimary: true }, take: 1 },
          amenities: true,
          _count: {
            select: { reviews: true, comments: true, favorites: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.house.count({
        where: { landlordId: landlordProfile.id, deletedAt: null },
      }),
    ]);

    res.json({
      success: true,
      data: {
        data: houses,
        page: pageNum,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update house status
 */
export const updateHouseStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'LANDLORD') {
      return res.status(403).json({
        success: false,
        error: 'Only landlords can update house status',
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'DELISTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    // Check ownership
    const house = await prisma.house.findUnique({
      where: { id },
      include: { landlord: true },
    });

    if (!house) {
      return res.status(404).json({
        success: false,
        error: 'House not found',
      });
    }

    if (house.landlord.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this listing',
      });
    }

    const updatedHouse = await prisma.house.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      data: updatedHouse,
    });
  } catch (error) {
    next(error);
  }
};
