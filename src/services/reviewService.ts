/**
 * Review API Service
 */

import { apiClient, handleApiCall } from '../api/client';
import type { Review, CreateReviewData, PaginatedResponse } from '../types';

export const reviewService = {
  /**
   * Get reviews for a house
   */
  getHouseReviews: (houseId: string, page: number = 1, pageSize: number = 10) =>
    handleApiCall<PaginatedResponse<Review>>(
      apiClient.get(`/houses/${houseId}/reviews`, {
        params: { page, pageSize },
      })
    ),

  /**
   * Get single review
   */
  getReview: (id: string) =>
    handleApiCall<Review>(
      apiClient.get(`/reviews/${id}`)
    ),

  /**
   * Create review
   */
  createReview: (data: CreateReviewData) =>
    handleApiCall<Review>(
      apiClient.post('/reviews', data)
    ),

  /**
   * Update review
   */
  updateReview: (id: string, data: Partial<CreateReviewData>) =>
    handleApiCall<Review>(
      apiClient.put(`/reviews/${id}`, data)
    ),

  /**
   * Delete review
   */
  deleteReview: (id: string) =>
    apiClient.delete(`/reviews/${id}`),

  /**
   * Mark review as helpful
   */
  markReviewAsHelpful: (id: string) =>
    apiClient.post(`/reviews/${id}/helpful`),

  /**
   * Report review for moderation
   */
  reportReview: (id: string, reason: string) =>
    apiClient.post(`/reviews/${id}/report`, { reason }),

  /**
   * Get user's reviews
   */
  getUserReviews: (userId: string, page: number = 1, pageSize: number = 10) =>
    handleApiCall<PaginatedResponse<Review>>(
      apiClient.get(`/users/${userId}/reviews`, {
        params: { page, pageSize },
      })
    ),
};

/**
 * Comment API Service
 */
import type { Comment, CreateCommentData } from '../types';

export const commentService = {
  /**
   * Get comments for a house
   */
  getHouseComments: (houseId: string, page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<Comment>>(
      apiClient.get(`/houses/${houseId}/comments`, {
        params: { page, pageSize },
      })
    ),

  /**
   * Get single comment
   */
  getComment: (id: string) =>
    handleApiCall<Comment>(
      apiClient.get(`/comments/${id}`)
    ),

  /**
   * Create comment
   */
  createComment: (data: CreateCommentData) =>
    handleApiCall<Comment>(
      apiClient.post('/comments', data)
    ),

  /**
   * Update comment
   */
  updateComment: (id: string, data: Partial<CreateCommentData>) =>
    handleApiCall<Comment>(
      apiClient.put(`/comments/${id}`, data)
    ),

  /**
   * Delete comment
   */
  deleteComment: (id: string) =>
    apiClient.delete(`/comments/${id}`),

  /**
   * Report comment for moderation
   */
  reportComment: (id: string, reason: string) =>
    apiClient.post(`/comments/${id}/report`, { reason }),
};
