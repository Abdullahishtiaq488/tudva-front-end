/**
 * Mock Wishlist Data
 * 
 * This file provides mock data for user wishlists.
 */

export interface Wishlist {
  id: string;
  user_id: string;
  course_id: string;
  createdAt: string;
  updatedAt: string;
}

// Mock wishlist items
export const mockWishlist: Wishlist[] = [
  // Wishlist items for User 4 (Alice Learner)
  {
    id: '1',
    user_id: '4', // Alice Learner
    course_id: '5', // Mobile App Development with React Native
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z',
  },
  {
    id: '2',
    user_id: '4', // Alice Learner
    course_id: '6', // UI/UX Design Principles
    createdAt: '2025-02-11T00:00:00.000Z',
    updatedAt: '2025-02-11T00:00:00.000Z',
  },
  {
    id: '3',
    user_id: '4', // Alice Learner
    course_id: '7', // DevOps and CI/CD Pipelines
    createdAt: '2025-02-12T00:00:00.000Z',
    updatedAt: '2025-02-12T00:00:00.000Z',
  },
  
  // Wishlist items for User 5 (Bob Learner)
  {
    id: '4',
    user_id: '5', // Bob Learner
    course_id: '3', // Data Science Fundamentals
    createdAt: '2025-02-13T00:00:00.000Z',
    updatedAt: '2025-02-13T00:00:00.000Z',
  },
  {
    id: '5',
    user_id: '5', // Bob Learner
    course_id: '8', // Blockchain Development
    createdAt: '2025-02-14T00:00:00.000Z',
    updatedAt: '2025-02-14T00:00:00.000Z',
  },
  
  // Wishlist items for User 8 (Charlie Learner)
  {
    id: '6',
    user_id: '8', // Charlie Learner
    course_id: '2', // Advanced JavaScript Concepts
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: '7',
    user_id: '8', // Charlie Learner
    course_id: '4', // Machine Learning with Python
    createdAt: '2025-02-16T00:00:00.000Z',
    updatedAt: '2025-02-16T00:00:00.000Z',
  },
  {
    id: '8',
    user_id: '8', // Charlie Learner
    course_id: '9', // Cloud Computing with AWS
    createdAt: '2025-02-17T00:00:00.000Z',
    updatedAt: '2025-02-17T00:00:00.000Z',
  },
];

export default {
  wishlist: mockWishlist,
};
