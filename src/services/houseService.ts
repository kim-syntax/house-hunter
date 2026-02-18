/**
 * House API Service
 */

import { apiClient, handleApiCall } from '../api/client';
import type {
  House,
  CreateHouseData,
  UpdateHouseData,
  PaginatedResponse,
  SearchFilters,
  HousePhoto,
} from '../types';

export const houseService = {
  /**
   * Get all houses (with pagination and filters)
   */
  getHouses: (page: number = 1, pageSize: number = 20, filters?: SearchFilters) =>
    handleApiCall<PaginatedResponse<House>>(
      apiClient.get('/houses', {
        params: { page, pageSize, ...filters },
      })
    ),

  /**
   * Get single house by ID
   */
  getHouseById: (id: string) =>
    handleApiCall<House>(
      apiClient.get(`/houses/${id}`)
    ),

  /**
   * Search houses
   */
  searchHouses: (query: string, page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<House>>(
      apiClient.get('/houses/search', {
        params: { q: query, page, pageSize },
      })
    ),

  /**
   * Create new house (landlord only)
   */
  createHouse: (data: CreateHouseData) =>
    handleApiCall<House>(
      apiClient.post('/houses', data)
    ),

  /**
   * Update house (landlord only)
   */
  updateHouse: (id: string, data: UpdateHouseData) =>
    handleApiCall<House>(
      apiClient.put(`/houses/${id}`, data)
    ),

  /**
   * Delete house (landlord only)
   */
  deleteHouse: (id: string) =>
    apiClient.delete(`/houses/${id}`),

  /**
   * Get houses by landlord
   */
  getLandlordHouses: (landlordId: string, page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<House>>(
      apiClient.get(`/landlords/${landlordId}/houses`, {
        params: { page, pageSize },
      })
    ),

  /**
   * Get user's own houses (when logged in)
   */
  getMyHouses: (page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<House>>(
      apiClient.get('/houses/my-listings', {
        params: { page, pageSize },
      })
    ),

  /**
   * Upload house photos
   */
  uploadPhotos: (houseId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`photos`, file);
    });
    return handleApiCall<HousePhoto[]>(
      apiClient.post(`/houses/${houseId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  },

  /**
   * Update house status (available/occupied/maintenance/delisted)
   */
  updateHouseStatus: (id: string, status: string) =>
    handleApiCall<House>(
      apiClient.patch(`/houses/${id}/status`, { status })
    ),

  /**
   * Increment house view count
   */
  incrementViewCount: (id: string) =>
    apiClient.patch(`/houses/${id}/views`),

  /**
   * Get house analytics
   */
  getHouseAnalytics: (id: string) =>
    handleApiCall<any>(
      apiClient.get(`/houses/${id}/analytics`)
    ),

  /**
   * Filter houses by location
   */
  getHousesByLocation: (city: string, estate?: string, page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<House>>(
      apiClient.get('/houses/location', {
        params: { city, estate, page, pageSize },
      })
    ),

  /**
   * Filter houses by price range
   */
  getHousesByPriceRange: (minPrice: number, maxPrice: number, page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<House>>(
      apiClient.get('/houses/price', {
        params: { minPrice, maxPrice, page, pageSize },
      })
    ),

  /**
   * Filter houses by amenities
   */
  getHousesByAmenities: (amenities: string[], page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<House>>(
      apiClient.get('/houses/amenities', {
        params: { amenities: amenities.join(','), page, pageSize },
      })
    ),
};
