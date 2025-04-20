/**
 * Mock Data Index
 *
 * This file exports all mock data for the application.
 */

import users, { User, mockUsers } from './users';
import courses, { Course, Module, Lecture, FAQ, mockCourses, mockModules, mockLectures, mockFAQs } from './courses';
import bookings, { Booking, BookingSlot, Slot, SeminarDay, mockBookings, mockBookingSlots, mockSlots, mockSeminarDays } from './bookings';
import reviews, { Review, ReviewHelpful, mockReviews, mockReviewHelpful } from './reviews';
import notifications, { Notification, NotificationPreference, mockNotifications, mockNotificationPreferences } from './notifications';
import wishlist, { Wishlist, mockWishlist } from './wishlist';
import lectureAccess, { LectureAccess, LectureSchedule, mockLectureAccess, mockLectureSchedules } from './lectureAccess';

// Export all interfaces as types
export type {
  User,
  Course,
  Module,
  Lecture,
  FAQ,
  Booking,
  BookingSlot,
  Slot,
  SeminarDay,
  Review,
  ReviewHelpful,
  Notification,
  NotificationPreference,
  Wishlist,
  LectureAccess,
  LectureSchedule,
};

// Export all mock data
export {
  mockUsers,
  mockCourses,
  mockModules,
  mockLectures,
  mockFAQs,
  mockBookings,
  mockBookingSlots,
  mockSlots,
  mockSeminarDays,
  mockReviews,
  mockReviewHelpful,
  mockNotifications,
  mockNotificationPreferences,
  mockWishlist,
  mockLectureAccess,
  mockLectureSchedules,
};

// Initialize the mock database with data
export const initMockData = () => {
  // This function will be used to initialize the mock database
  // with all the mock data when the application starts
  return {
    users: mockUsers,
    courses: mockCourses,
    modules: mockModules,
    lectures: mockLectures,
    faqs: mockFAQs,
    bookings: mockBookings,
    bookingSlots: mockBookingSlots,
    slots: mockSlots,
    seminarDays: mockSeminarDays,
    reviews: mockReviews,
    reviewHelpful: mockReviewHelpful,
    notifications: mockNotifications,
    notificationPreferences: mockNotificationPreferences,
    wishlist: mockWishlist,
    lectureAccess: mockLectureAccess,
    lectureSchedules: mockLectureSchedules,
  };
};

export default {
  users,
  courses,
  bookings,
  reviews,
  notifications,
  wishlist,
  lectureAccess,
  initMockData,
};
