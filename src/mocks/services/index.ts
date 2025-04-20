/**
 * Mock Services Index
 * 
 * This file exports all mock services for the application.
 */

import authService from './authService';
import courseService from './courseService';
import enrollmentService from './enrollmentService';
import reviewService from './reviewService';
import notificationService from './notificationService';
import wishlistService from './wishlistService';
import lectureAccessService from './lectureAccessService';

// Export all services
export {
  authService,
  courseService,
  enrollmentService,
  reviewService,
  notificationService,
  wishlistService,
  lectureAccessService,
};

export default {
  auth: authService,
  course: courseService,
  enrollment: enrollmentService,
  review: reviewService,
  notification: notificationService,
  wishlist: wishlistService,
  lectureAccess: lectureAccessService,
};
