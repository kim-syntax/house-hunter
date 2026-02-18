/**
 * Type definitions for House Hunting App
 */

// ============ USER TYPES ============
export type UserRole = 'tenant' | 'landlord' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

// ============ LANDLORD TYPES ============
export interface LandlordProfile {
  id: string;
  userId: string;
  bio?: string;
  idType: 'passport' | 'driver_license' | 'national_id';
  idNumber: string;
  idPhotoUrl: string;
  verificationStatus: VerificationStatus;
  verificationDate?: Date;
  averageRating: number;
  totalReviews: number;
  responseTimeHours: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface CreateLandlordProfileData {
  bio?: string;
  idType: string;
  idNumber: string;
  idPhotoUrl: string;
}

// ============ HOUSE TYPES ============
export type HouseType = 'bedsitter' | '1br' | '2br' | '3br' | '4br_plus';
export type HouseStatus = 'available' | 'occupied' | 'maintenance' | 'delisted';
export type AmenityType = 
  | 'wifi' | 'parking' | 'water_24h' | 'security' | 'gate' 
  | 'shopping_nearby' | 'school_nearby' | 'public_transport' 
  | 'furnished' | 'kitchen_equipped' | 'balcony' | 'garden' 
  | 'pet_friendly' | 'cctv' | 'backup_power';

export interface House {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  houseType: HouseType;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  monthlyRent: number;
  deposit: number;
  waterCharge?: number;
  electricityCharge?: number;
  parkingCharge?: number;
  address: string;
  city: string;
  estate: string;
  street: string;
  latitude: number;
  longitude: number;
  availabilityDate: Date;
  status: HouseStatus;
  viewCount: number;
  favoriteCount: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  photos?: HousePhoto[];
  amenities?: HouseAmenity[];
  rules?: HouseRule[];
  landlord?: LandlordProfile;
}

export interface CreateHouseData {
  title: string;
  description: string;
  houseType: HouseType;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  monthlyRent: number;
  deposit: number;
  waterCharge?: number;
  electricityCharge?: number;
  parkingCharge?: number;
  address: string;
  city: string;
  estate: string;
  street: string;
  latitude: number;
  longitude: number;
  availabilityDate: Date;
  amenities: AmenityType[];
  rules: string[];
}

export interface UpdateHouseData extends Partial<CreateHouseData> {}

export interface HousePhoto {
  id: string;
  houseId: string;
  photoUrl: string;
  caption?: string;
  displayOrder: number;
  isPrimary: boolean;
  uploadedAt: Date;
}

export interface HouseAmenity {
  id: string;
  houseId: string;
  amenity: AmenityType;
}

export interface HouseRule {
  id: string;
  houseId: string;
  rule: string;
}

// ============ REVIEW TYPES ============
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  houseId: string;
  tenantId: string;
  rating: number; // 1-5
  title: string;
  reviewText: string;
  cleanlinessRating: number; // 1-5
  landlordResponsivenessRating: number; // 1-5
  valueForMoneyRating: number; // 1-5
  moderationStatus: ModerationStatus;
  flaggedReason?: string;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  tenant?: User;
  house?: House;
}

export interface CreateReviewData {
  houseId: string;
  rating: number;
  title: string;
  reviewText: string;
  cleanlinessRating: number;
  landlordResponsivenessRating: number;
  valueForMoneyRating: number;
}

// ============ COMMENT TYPES ============
export interface Comment {
  id: string;
  houseId: string;
  tenantId: string;
  commentText: string;
  moderationStatus: ModerationStatus;
  flaggedReason?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  tenant?: User;
}

export interface CreateCommentData {
  houseId: string;
  commentText: string;
}

// ============ MESSAGE TYPES ============
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  houseId?: string;
  messageText: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  sender?: User;
  receiver?: User;
}

export interface CreateMessageData {
  receiverId: string;
  messageText: string;
  houseId?: string;
}

export interface Conversation {
  id?: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  houseId?: string;
}

// ============ FAVORITE TYPES ============
export interface Favorite {
  id: string;
  tenantId: string;
  houseId: string;
  createdAt: Date;
  house?: House;
}

// ============ NOTIFICATION TYPES ============
export type NotificationType = 'new_message' | 'review_posted' | 'house_posted' | 'favorite_updated';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  relatedHouseId?: string;
  relatedUserId?: string;
  title: string;
  body: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

// ============ SEARCH/FILTER TYPES ============
export interface SearchFilters {
  location?: {
    city?: string;
    estate?: string;
    street?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  houseTypes?: HouseType[];
  amenities?: AmenityType[];
  bedrooms?: number;
  bathrooms?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ============ API RESPONSE TYPES ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============ REPORT TYPES ============
export type ReportedContentType = 'review' | 'comment' | 'house_listing' | 'user_profile';
export type ReportStatus = 'pending' | 'investigating' | 'action_taken' | 'dismissed';

export interface ReportedContent {
  id: string;
  reportedBy: string;
  contentType: ReportedContentType;
  contentId: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportData {
  contentType: ReportedContentType;
  contentId: string;
  reason: string;
  description?: string;
}

// ============ ANALYTICS TYPES ============
export interface HouseAnalytics {
  houseId: string;
  viewsThisMonth: number;
  favoritesThisMonth: number;
  messagesThisMonth: number;
  reviewsThisMonth: number;
  conversionRate: number; // views to inquiries
  dailyViews?: Record<string, number>;
  dailyFavorites?: Record<string, number>;
}

export interface LandlordAnalytics {
  landlordId: string;
  totalListings: number;
  totalViews: number;
  totalFavorites: number;
  totalMessages: number;
  averageRating: number;
  responseTime: number;
}
