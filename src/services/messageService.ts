/**
 * Message API Service
 */

import { apiClient, handleApiCall } from '../api/client';
import type { Message, CreateMessageData, Conversation, PaginatedResponse } from '../types';

export const messageService = {
  /**
   * Get all conversations for current user
   */
  getConversations: (page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<Conversation>>(
      apiClient.get('/messages/conversations', {
        params: { page, pageSize },
      })
    ),

  /**
   * Get conversation with specific user
   */
  getConversation: (userId: string, page: number = 1, pageSize: number = 50) =>
    handleApiCall<PaginatedResponse<Message>>(
      apiClient.get(`/messages/conversations/${userId}`, {
        params: { page, pageSize },
      })
    ),

  /**
   * Send message
   */
  sendMessage: (data: CreateMessageData) =>
    handleApiCall<Message>(
      apiClient.post('/messages', data)
    ),

  /**
   * Get single message
   */
  getMessage: (id: string) =>
    handleApiCall<Message>(
      apiClient.get(`/messages/${id}`)
    ),

  /**
   * Mark message as read
   */
  markAsRead: (id: string) =>
    apiClient.patch(`/messages/${id}/read`),

  /**
   * Mark all messages in conversation as read
   */
  markConversationAsRead: (userId: string) =>
    apiClient.patch(`/messages/conversations/${userId}/read`),

  /**
   * Delete message
   */
  deleteMessage: (id: string) =>
    apiClient.delete(`/messages/${id}`),

  /**
   * Get unread message count
   */
  getUnreadCount: () =>
    handleApiCall<{ count: number }>(
      apiClient.get('/messages/unread-count')
    ),

  /**
   * Search messages
   */
  searchMessages: (query: string, page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<Message>>(
      apiClient.get('/messages/search', {
        params: { q: query, page, pageSize },
      })
    ),
};

/**
 * Favorite API Service
 */

import type { Favorite } from '../types';

export const favoriteService = {
  /**
   * Get user's favorite houses
   */
  getFavorites: (page: number = 1, pageSize: number = 20) =>
    handleApiCall<PaginatedResponse<Favorite>>(
      apiClient.get('/favorites', {
        params: { page, pageSize },
      })
    ),

  /**
   * Add house to favorites
   */
  addFavorite: (houseId: string) =>
    handleApiCall<Favorite>(
      apiClient.post('/favorites', { houseId })
    ),

  /**
   * Remove from favorites
   */
  removeFavorite: (houseId: string) =>
    apiClient.delete(`/favorites/${houseId}`),

  /**
   * Check if house is favorited
   */
  isFavorited: (houseId: string) =>
    handleApiCall<{ isFavorited: boolean }>(
      apiClient.get(`/favorites/${houseId}/check`)
    ),

  /**
   * Get favorite count for a house
   */
  getFavoriteCount: (houseId: string) =>
    handleApiCall<{ count: number }>(
      apiClient.get(`/houses/${houseId}/favorite-count`)
    ),
};
