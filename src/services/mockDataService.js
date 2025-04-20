/**
 * Mock Data Service
 * 
 * This file provides a centralized service for accessing mock data.
 * It uses the mock system to provide consistent data across all components.
 */

import { mockServiceProvider, initMockSystem } from '../mockSystem';

// Initialize the mock system when this module is imported
if (typeof window !== 'undefined') {
  initMockSystem();
}

/**
 * User Service
 */
export const userService = {
  // Get all users
  getAllUsers: async () => {
    return await mockServiceProvider.auth.getAllUsers();
  },
  
  // Get user by ID
  getUserById: async (userId) => {
    return await mockServiceProvider.auth.getUserById(userId);
  },
  
  // Get user by role
  getUsersByRole: async (role) => {
    const users = await mockServiceProvider.auth.getAllUsers();
    return users.filter(user => user.role === role);
  },
};

/**
 * Course Service
 */
export const courseService = {
  // Get all courses
  getAllCourses: async () => {
    return await mockServiceProvider.course.getAllCourses();
  },
  
  // Get course by ID
  getCourseById: async (courseId) => {
    return await mockServiceProvider.course.getCourseById(courseId);
  },
  
  // Get courses by instructor
  getCoursesByInstructor: async (instructorId) => {
    const courses = await mockServiceProvider.course.getAllCourses();
    return courses.filter(course => course.instructor_id === instructorId);
  },
  
  // Get course modules
  getCourseModules: async (courseId) => {
    return await mockServiceProvider.course.getCourseModules(courseId);
  },
  
  // Get course lectures
  getCourseLectures: async (courseId) => {
    return await mockServiceProvider.course.getCourseLectures(courseId);
  },
};

/**
 * Enrollment Service
 */
export const enrollmentService = {
  // Get all enrollments
  getAllEnrollments: async () => {
    return await mockServiceProvider.enrollment.getAllEnrollments();
  },
  
  // Get enrollments by user
  getEnrollmentsByUser: async (userId) => {
    return await mockServiceProvider.enrollment.getEnrollmentsByUser(userId);
  },
  
  // Get enrollments by course
  getEnrollmentsByCourse: async (courseId) => {
    return await mockServiceProvider.enrollment.getEnrollmentsByCourse(courseId);
  },
};

/**
 * Review Service
 */
export const reviewService = {
  // Get all reviews
  getAllReviews: async () => {
    return await mockServiceProvider.review.getAllReviews();
  },
  
  // Get reviews by course
  getReviewsByCourse: async (courseId) => {
    return await mockServiceProvider.review.getReviewsByCourse(courseId);
  },
  
  // Get reviews by user
  getReviewsByUser: async (userId) => {
    return await mockServiceProvider.review.getReviewsByUser(userId);
  },
};

/**
 * Wishlist Service
 */
export const wishlistService = {
  // Get wishlist by user
  getWishlistByUser: async (userId) => {
    return await mockServiceProvider.wishlist.getWishlistByUser(userId);
  },
  
  // Add course to wishlist
  addToWishlist: async (userId, courseId) => {
    return await mockServiceProvider.wishlist.addToWishlist(userId, courseId);
  },
  
  // Remove course from wishlist
  removeFromWishlist: async (userId, courseId) => {
    return await mockServiceProvider.wishlist.removeFromWishlist(userId, courseId);
  },
};

/**
 * Lecture Schedule Service
 */
export const lectureScheduleService = {
  // Get all lecture schedules
  getAllLectureSchedules: async () => {
    return await mockServiceProvider.lectureAccess.getAllLectureSchedules();
  },
  
  // Get lecture schedules by user
  getLectureSchedulesByUser: async (userId) => {
    return await mockServiceProvider.lectureAccess.getLectureSchedulesByUser(userId);
  },
  
  // Get lecture schedules by course
  getLectureSchedulesByCourse: async (courseId) => {
    return await mockServiceProvider.lectureAccess.getLectureSchedulesByCourse(courseId);
  },
  
  // Reschedule lecture
  rescheduleLecture: async (scheduleId, newSlotId, newDate) => {
    return await mockServiceProvider.lectureAccess.rescheduleLecture(scheduleId, newSlotId, newDate);
  },
};

/**
 * Notification Service
 */
export const notificationService = {
  // Get notifications by user
  getNotificationsByUser: async (userId) => {
    return await mockServiceProvider.notification.getNotificationsByUser(userId);
  },
  
  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    return await mockServiceProvider.notification.markNotificationAsRead(notificationId);
  },
};

// Export all services
export default {
  userService,
  courseService,
  enrollmentService,
  reviewService,
  wishlistService,
  lectureScheduleService,
  notificationService,
};
