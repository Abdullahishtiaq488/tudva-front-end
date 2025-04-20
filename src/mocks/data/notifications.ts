/**
 * Mock Notification Data
 * 
 * This file provides mock data for notifications.
 */

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'course' | 'system' | 'lecture' | 'review' | 'enrollment';
  isRead: boolean;
  relatedId?: string; // ID of related entity (course, lecture, etc.)
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  email_course_updates: boolean;
  email_new_lectures: boolean;
  email_enrollment_confirmation: boolean;
  push_course_updates: boolean;
  push_new_lectures: boolean;
  push_enrollment_confirmation: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock notifications
export const mockNotifications: Notification[] = [
  // Notifications for User 4 (Alice Learner)
  {
    id: '1',
    user_id: '4', // Alice Learner
    title: 'Welcome to Introduction to Web Development',
    message: 'You have successfully enrolled in the course. Start learning now!',
    type: 'enrollment',
    isRead: true,
    relatedId: '1', // Course ID
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '2',
    user_id: '4', // Alice Learner
    title: 'New Lecture Available',
    message: 'A new lecture "Advanced CSS Techniques" has been added to the course.',
    type: 'lecture',
    isRead: false,
    relatedId: '1', // Course ID
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z',
  },
  {
    id: '3',
    user_id: '4', // Alice Learner
    title: 'Upcoming Lecture Reminder',
    message: 'Your lecture "Introduction to HTML" is scheduled for tomorrow at 9:00 AM.',
    type: 'lecture',
    isRead: false,
    relatedId: '1', // Lecture ID
    createdAt: '2025-02-14T00:00:00.000Z',
    updatedAt: '2025-02-14T00:00:00.000Z',
  },
  {
    id: '4',
    user_id: '4', // Alice Learner
    title: 'Welcome to Data Science Fundamentals',
    message: 'You have successfully enrolled in the course. Start learning now!',
    type: 'enrollment',
    isRead: true,
    relatedId: '3', // Course ID
    createdAt: '2025-02-02T00:00:00.000Z',
    updatedAt: '2025-02-02T00:00:00.000Z',
  },
  
  // Notifications for User 5 (Bob Learner)
  {
    id: '5',
    user_id: '5', // Bob Learner
    title: 'Welcome to Advanced JavaScript Concepts',
    message: 'You have successfully enrolled in the course. Start learning now!',
    type: 'enrollment',
    isRead: true,
    relatedId: '2', // Course ID
    createdAt: '2025-02-03T00:00:00.000Z',
    updatedAt: '2025-02-03T00:00:00.000Z',
  },
  {
    id: '6',
    user_id: '5', // Bob Learner
    title: 'Upcoming Lecture Reminder',
    message: 'Your lecture "ES6+ Features" is scheduled for tomorrow at 1:00 PM.',
    type: 'lecture',
    isRead: false,
    relatedId: '5', // Lecture ID
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: '7',
    user_id: '5', // Bob Learner
    title: 'Welcome to Machine Learning with Python',
    message: 'You have successfully enrolled in the course. Start learning now!',
    type: 'enrollment',
    isRead: true,
    relatedId: '4', // Course ID
    createdAt: '2025-02-04T00:00:00.000Z',
    updatedAt: '2025-02-04T00:00:00.000Z',
  },
  {
    id: '8',
    user_id: '5', // Bob Learner
    title: 'System Maintenance',
    message: 'The platform will be undergoing maintenance on Sunday from 2 AM to 4 AM UTC.',
    type: 'system',
    isRead: false,
    createdAt: '2025-02-16T00:00:00.000Z',
    updatedAt: '2025-02-16T00:00:00.000Z',
  },
  
  // Notifications for User 8 (Charlie Learner)
  {
    id: '9',
    user_id: '8', // Charlie Learner
    title: 'Welcome to Introduction to Web Development',
    message: 'You have successfully enrolled in the course. Start learning now!',
    type: 'enrollment',
    isRead: true,
    relatedId: '1', // Course ID
    createdAt: '2025-02-05T00:00:00.000Z',
    updatedAt: '2025-02-05T00:00:00.000Z',
  },
  {
    id: '10',
    user_id: '8', // Charlie Learner
    title: 'Welcome to Mobile App Development with React Native',
    message: 'You have successfully enrolled in the course. Start learning now!',
    type: 'enrollment',
    isRead: true,
    relatedId: '5', // Course ID
    createdAt: '2025-02-06T00:00:00.000Z',
    updatedAt: '2025-02-06T00:00:00.000Z',
  },
  {
    id: '11',
    user_id: '8', // Charlie Learner
    title: 'New Course Available',
    message: 'A new course "Blockchain Development" is now available. Check it out!',
    type: 'course',
    isRead: false,
    relatedId: '8', // Course ID
    createdAt: '2025-02-17T00:00:00.000Z',
    updatedAt: '2025-02-17T00:00:00.000Z',
  },
  {
    id: '12',
    user_id: '8', // Charlie Learner
    title: 'Your Review Was Helpful',
    message: '2 people found your review on "Introduction to Web Development" helpful.',
    type: 'review',
    isRead: false,
    relatedId: '3', // Review ID
    createdAt: '2025-02-18T00:00:00.000Z',
    updatedAt: '2025-02-18T00:00:00.000Z',
  },
];

// Mock notification preferences
export const mockNotificationPreferences: NotificationPreference[] = [
  {
    id: '1',
    user_id: '4', // Alice Learner
    email_course_updates: true,
    email_new_lectures: true,
    email_enrollment_confirmation: true,
    push_course_updates: true,
    push_new_lectures: true,
    push_enrollment_confirmation: true,
    createdAt: '2025-01-04T00:00:00.000Z',
    updatedAt: '2025-01-04T00:00:00.000Z',
  },
  {
    id: '2',
    user_id: '5', // Bob Learner
    email_course_updates: true,
    email_new_lectures: false,
    email_enrollment_confirmation: true,
    push_course_updates: true,
    push_new_lectures: true,
    push_enrollment_confirmation: true,
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z',
  },
  {
    id: '3',
    user_id: '8', // Charlie Learner
    email_course_updates: false,
    email_new_lectures: false,
    email_enrollment_confirmation: true,
    push_course_updates: true,
    push_new_lectures: false,
    push_enrollment_confirmation: true,
    createdAt: '2025-01-08T00:00:00.000Z',
    updatedAt: '2025-01-08T00:00:00.000Z',
  },
];

export default {
  notifications: mockNotifications,
  notificationPreferences: mockNotificationPreferences,
};
