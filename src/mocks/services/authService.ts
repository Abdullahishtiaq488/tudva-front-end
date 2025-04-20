/**
 * Mock Authentication Service
 *
 * This file provides mock authentication services.
 */

import { mockDb } from '../utils/mockDb';
import { randomDelay } from '../utils/delay';
import { ApiError, ErrorType } from '../utils/errors';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { setItem, getItem, removeItem } from '../utils/storage';
import { User, mockUsers } from '../data/users';

// Initialize users in the mock database
const initUsers = () => {
  const existingUsers = mockDb.getAll<User>('users');
  if (existingUsers.length === 0) {
    mockUsers.forEach(user => {
      mockDb.create('users', user);
    });
  }
};

// Auth tokens storage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Login user
export const login = async (email: string, password: string) => {
  await randomDelay();

  // Initialize users if needed
  initUsers();

  // Find user by email
  const users = mockDb.getAll<User>('users');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  // Check if user exists and password is correct
  // In a real app, you would hash the password and compare hashes
  if (!user || password !== 'password') {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Invalid email or password');
  }

  // Generate a token (in a real app, this would be a JWT)
  const token = `mock_token_${user.id}_${Date.now()}`;

  // Store token and user data
  setItem(AUTH_TOKEN_KEY, token);

  // Create a sanitized user object (without passwordHash)
  const userData = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    phoneNo: user.phoneNo,
    aboutMe: user.aboutMe,
    profilePicture: user.profilePicture,
    education: user.education,
  };

  setItem(USER_DATA_KEY, userData);

  // Return success response
  return createSuccessResponse({
    token,
    user: userData,
  }, 'Login successful');
};

// Register user
export const register = async (userData: Partial<User>) => {
  await randomDelay();

  // Initialize users if needed
  initUsers();

  // Check if email is already taken
  const users = mockDb.getAll<User>('users');
  const existingUser = users.find(u => u.email.toLowerCase() === userData.email?.toLowerCase());

  if (existingUser) {
    throw new ApiError(ErrorType.CONFLICT, 'Email is already registered');
  }

  // Create new user
  const newUser: User = {
    id: mockDb.generateId(),
    email: userData.email || '',
    passwordHash: 'hashed_password', // In a real app, you would hash the password
    fullName: userData.fullName || '',
    role: userData.role || 'learner',
    isActive: true,
    phoneNo: userData.phoneNo,
    aboutMe: userData.aboutMe,
    profilePicture: userData.profilePicture,
    education: userData.education,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save user to database
  mockDb.create('users', newUser);

  // Return success response
  return createSuccessResponse({
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role,
  }, 'Registration successful');
};

// Logout user
export const logout = async () => {
  await randomDelay();

  // Remove token and user data
  removeItem(AUTH_TOKEN_KEY);
  removeItem(USER_DATA_KEY);

  // Return success response
  return createSuccessResponse(null, 'Logout successful');
};

// Get current user
export const getCurrentUser = async () => {
  await randomDelay();

  // Get user data from storage
  const userData = getItem(USER_DATA_KEY);

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Return success response
  return createSuccessResponse(userData, 'User retrieved successfully');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getItem<string>(AUTH_TOKEN_KEY);
  return !!token;
};

// Get auth token
export const getAuthToken = () => {
  return getItem<string>(AUTH_TOKEN_KEY);
};

// Get auth header
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Update user profile
export const updateProfile = async (userId: string, updates: Partial<User>) => {
  await randomDelay();

  // Initialize users if needed
  initUsers();

  // Check if user is authenticated
  const userData = getItem<{ id?: string }>(USER_DATA_KEY);

  if (!userData || userData.id !== userId) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authorized to update this profile');
  }

  // Update user in database
  const updatedUser = mockDb.update('users', userId, updates);

  if (!updatedUser) {
    throw new ApiError(ErrorType.NOT_FOUND, 'User not found');
  }

  // Create a sanitized user object (without passwordHash)
  const sanitizedUser = {
    id: updatedUser.id,
    email: updatedUser.email,
    fullName: updatedUser.fullName,
    role: updatedUser.role,
    isActive: updatedUser.isActive,
    phoneNo: updatedUser.phoneNo,
    aboutMe: updatedUser.aboutMe,
    profilePicture: updatedUser.profilePicture,
    education: updatedUser.education,
  };

  // Update user data in storage
  setItem(USER_DATA_KEY, sanitizedUser);

  // Return success response
  return createSuccessResponse(sanitizedUser, 'Profile updated successfully');
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAuthToken,
  getAuthHeader,
  updateProfile,
};
