/**
 * API Response Utilities
 * 
 * This file provides utilities for creating consistent API responses.
 */

// Define the standard API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a success response
 * @param data Response data
 * @param message Success message
 */
export const createSuccessResponse = <T>(
  data?: T,
  message?: string
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Create a paginated success response
 * @param data Response data
 * @param page Current page
 * @param limit Items per page
 * @param total Total items
 * @param message Success message
 */
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): ApiResponse<T[]> => {
  return {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Create an error response
 * @param error Error message
 * @param details Additional error details
 */
export const createErrorResponse = (
  error: string,
  details?: any
): ApiResponse => {
  return {
    success: false,
    error,
    details,
  };
};

export default {
  createSuccessResponse,
  createPaginatedResponse,
  createErrorResponse,
};
