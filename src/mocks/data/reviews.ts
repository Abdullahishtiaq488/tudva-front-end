/**
 * Mock Review Data
 * 
 * This file provides mock data for course reviews.
 */

export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  content: string;
  isHelpful?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewHelpful {
  id: string;
  review_id: string;
  user_id: string;
  isHelpful: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock reviews
export const mockReviews: Review[] = [
  // Reviews for Course 1: Introduction to Web Development
  {
    id: '1',
    user_id: '4', // Alice Learner
    course_id: '1',
    rating: 5,
    content: 'Excellent course for beginners! The instructor explains everything clearly and the exercises are very helpful.',
    isHelpful: 15,
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: '2',
    user_id: '5', // Bob Learner
    course_id: '1',
    rating: 4,
    content: 'Great introduction to web development. I would have liked more advanced examples, but overall it was very good.',
    isHelpful: 8,
    createdAt: '2025-02-16T00:00:00.000Z',
    updatedAt: '2025-02-16T00:00:00.000Z',
  },
  {
    id: '3',
    user_id: '8', // Charlie Learner
    course_id: '1',
    rating: 5,
    content: 'I had no prior experience with web development, and now I feel confident building my own websites. Highly recommended!',
    isHelpful: 12,
    createdAt: '2025-02-17T00:00:00.000Z',
    updatedAt: '2025-02-17T00:00:00.000Z',
  },
  
  // Reviews for Course 2: Advanced JavaScript Concepts
  {
    id: '4',
    user_id: '4', // Alice Learner
    course_id: '2',
    rating: 5,
    content: 'This course took my JavaScript skills to the next level. The sections on closures and async programming were particularly enlightening.',
    isHelpful: 20,
    createdAt: '2025-02-18T00:00:00.000Z',
    updatedAt: '2025-02-18T00:00:00.000Z',
  },
  {
    id: '5',
    user_id: '5', // Bob Learner
    course_id: '2',
    rating: 5,
    content: 'Excellent deep dive into JavaScript. The instructor really knows the language inside and out.',
    isHelpful: 18,
    createdAt: '2025-02-19T00:00:00.000Z',
    updatedAt: '2025-02-19T00:00:00.000Z',
  },
  
  // Reviews for Course 3: Data Science Fundamentals
  {
    id: '6',
    user_id: '5', // Bob Learner
    course_id: '3',
    rating: 4,
    content: 'Good introduction to data science. The pandas and matplotlib sections were very well explained.',
    isHelpful: 10,
    createdAt: '2025-02-20T00:00:00.000Z',
    updatedAt: '2025-02-20T00:00:00.000Z',
  },
  {
    id: '7',
    user_id: '8', // Charlie Learner
    course_id: '3',
    rating: 5,
    content: 'I was intimidated by data science before, but this course made it accessible and fun!',
    isHelpful: 15,
    createdAt: '2025-02-21T00:00:00.000Z',
    updatedAt: '2025-02-21T00:00:00.000Z',
  },
  
  // Reviews for Course 4: Machine Learning with Python
  {
    id: '8',
    user_id: '4', // Alice Learner
    course_id: '4',
    rating: 5,
    content: 'Comprehensive coverage of machine learning concepts and practical implementation. The projects were challenging but rewarding.',
    isHelpful: 22,
    createdAt: '2025-02-22T00:00:00.000Z',
    updatedAt: '2025-02-22T00:00:00.000Z',
  },
  
  // Reviews for Course 5: Mobile App Development with React Native
  {
    id: '9',
    user_id: '5', // Bob Learner
    course_id: '5',
    rating: 4,
    content: 'Good introduction to React Native. I was able to build my first mobile app by the end of the course.',
    isHelpful: 8,
    createdAt: '2025-02-23T00:00:00.000Z',
    updatedAt: '2025-02-23T00:00:00.000Z',
  },
  {
    id: '10',
    user_id: '8', // Charlie Learner
    course_id: '5',
    rating: 5,
    content: 'Excellent course! The instructor explains complex concepts in a simple way, and the code examples are very helpful.',
    isHelpful: 12,
    createdAt: '2025-02-24T00:00:00.000Z',
    updatedAt: '2025-02-24T00:00:00.000Z',
  },
];

// Mock review helpful records
export const mockReviewHelpful: ReviewHelpful[] = [
  {
    id: '1',
    review_id: '1',
    user_id: '5', // Bob Learner
    isHelpful: true,
    createdAt: '2025-02-15T01:00:00.000Z',
    updatedAt: '2025-02-15T01:00:00.000Z',
  },
  {
    id: '2',
    review_id: '1',
    user_id: '8', // Charlie Learner
    isHelpful: true,
    createdAt: '2025-02-15T02:00:00.000Z',
    updatedAt: '2025-02-15T02:00:00.000Z',
  },
  {
    id: '3',
    review_id: '2',
    user_id: '4', // Alice Learner
    isHelpful: true,
    createdAt: '2025-02-16T01:00:00.000Z',
    updatedAt: '2025-02-16T01:00:00.000Z',
  },
  {
    id: '4',
    review_id: '3',
    user_id: '4', // Alice Learner
    isHelpful: true,
    createdAt: '2025-02-17T01:00:00.000Z',
    updatedAt: '2025-02-17T01:00:00.000Z',
  },
  {
    id: '5',
    review_id: '3',
    user_id: '5', // Bob Learner
    isHelpful: true,
    createdAt: '2025-02-17T02:00:00.000Z',
    updatedAt: '2025-02-17T02:00:00.000Z',
  },
];

export default {
  reviews: mockReviews,
  reviewHelpful: mockReviewHelpful,
};
