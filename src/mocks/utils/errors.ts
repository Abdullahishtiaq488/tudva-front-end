/**
 * API Error Utilities
 * 
 * This file provides utilities for simulating API errors in a consistent way.
 */

// Define error types
export enum ErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  SERVER_ERROR = 'SERVER_ERROR',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
}

// Define error status codes
export const ErrorStatusCodes = {
  [ErrorType.UNAUTHORIZED]: 401,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.VALIDATION]: 400,
  [ErrorType.SERVER_ERROR]: 500,
  [ErrorType.FORBIDDEN]: 403,
  [ErrorType.CONFLICT]: 409,
};

// Define error messages
export const ErrorMessages = {
  [ErrorType.UNAUTHORIZED]: 'Authentication required',
  [ErrorType.NOT_FOUND]: 'Resource not found',
  [ErrorType.VALIDATION]: 'Validation error',
  [ErrorType.SERVER_ERROR]: 'Internal server error',
  [ErrorType.FORBIDDEN]: 'Access denied',
  [ErrorType.CONFLICT]: 'Resource already exists',
};

// API Error class
export class ApiError extends Error {
  type: ErrorType;
  status: number;
  details?: any;

  constructor(type: ErrorType, message?: string, details?: any) {
    super(message || ErrorMessages[type]);
    this.type = type;
    this.status = ErrorStatusCodes[type];
    this.details = details;
    this.name = 'ApiError';
  }

  // Convert to response object
  toResponse() {
    return {
      success: false,
      error: this.message,
      details: this.details,
      errorType: this.type,
    };
  }
}

// Helper functions to create specific errors
export const createUnauthorizedError = (message?: string, details?: any) => {
  return new ApiError(ErrorType.UNAUTHORIZED, message, details);
};

export const createNotFoundError = (message?: string, details?: any) => {
  return new ApiError(ErrorType.NOT_FOUND, message, details);
};

export const createValidationError = (message?: string, details?: any) => {
  return new ApiError(ErrorType.VALIDATION, message, details);
};

export const createServerError = (message?: string, details?: any) => {
  return new ApiError(ErrorType.SERVER_ERROR, message, details);
};

export const createForbiddenError = (message?: string, details?: any) => {
  return new ApiError(ErrorType.FORBIDDEN, message, details);
};

export const createConflictError = (message?: string, details?: any) => {
  return new ApiError(ErrorType.CONFLICT, message, details);
};

export default {
  ApiError,
  ErrorType,
  ErrorStatusCodes,
  ErrorMessages,
  createUnauthorizedError,
  createNotFoundError,
  createValidationError,
  createServerError,
  createForbiddenError,
  createConflictError,
};
