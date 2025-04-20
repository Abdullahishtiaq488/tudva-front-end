/**
 * Mock Lecture Access Data
 * 
 * This file provides mock data for lecture access and schedules.
 */

export interface LectureAccess {
  id: string;
  user_id: string;
  lecture_id: string;
  course_id: string;
  lastAccessedAt: string;
  progress: number; // 0-100
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LectureSchedule {
  id: string;
  lecture_id: string;
  course_id: string;
  slot_id: string;
  scheduledDate: string;
  isRescheduled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock lecture access records
export const mockLectureAccess: LectureAccess[] = [
  // Lecture access for User 4 (Alice Learner) - Course 1
  {
    id: '1',
    user_id: '4', // Alice Learner
    lecture_id: '1', // Introduction to HTML
    course_id: '1', // Introduction to Web Development
    lastAccessedAt: '2025-02-15T10:30:00.000Z',
    progress: 100,
    completed: true,
    createdAt: '2025-02-15T09:00:00.000Z',
    updatedAt: '2025-02-15T10:30:00.000Z',
  },
  {
    id: '2',
    user_id: '4', // Alice Learner
    lecture_id: '2', // HTML Document Structure
    course_id: '1', // Introduction to Web Development
    lastAccessedAt: '2025-02-16T11:15:00.000Z',
    progress: 75,
    completed: false,
    createdAt: '2025-02-16T10:00:00.000Z',
    updatedAt: '2025-02-16T11:15:00.000Z',
  },
  {
    id: '3',
    user_id: '4', // Alice Learner
    lecture_id: '3', // HTML Tags and Elements
    course_id: '1', // Introduction to Web Development
    lastAccessedAt: '2025-02-17T09:45:00.000Z',
    progress: 30,
    completed: false,
    createdAt: '2025-02-17T09:00:00.000Z',
    updatedAt: '2025-02-17T09:45:00.000Z',
  },
  
  // Lecture access for User 5 (Bob Learner) - Course 2
  {
    id: '4',
    user_id: '5', // Bob Learner
    lecture_id: '4', // Introduction to CSS
    course_id: '1', // Introduction to Web Development
    lastAccessedAt: '2025-02-18T14:30:00.000Z',
    progress: 100,
    completed: true,
    createdAt: '2025-02-18T13:00:00.000Z',
    updatedAt: '2025-02-18T14:30:00.000Z',
  },
  {
    id: '5',
    user_id: '5', // Bob Learner
    lecture_id: '5', // CSS Selectors
    course_id: '1', // Introduction to Web Development
    lastAccessedAt: '2025-02-19T15:15:00.000Z',
    progress: 50,
    completed: false,
    createdAt: '2025-02-19T14:00:00.000Z',
    updatedAt: '2025-02-19T15:15:00.000Z',
  },
  
  // Lecture access for User 8 (Charlie Learner) - Course 1
  {
    id: '6',
    user_id: '8', // Charlie Learner
    lecture_id: '1', // Introduction to HTML
    course_id: '1', // Introduction to Web Development
    lastAccessedAt: '2025-02-20T10:30:00.000Z',
    progress: 100,
    completed: true,
    createdAt: '2025-02-20T09:00:00.000Z',
    updatedAt: '2025-02-20T10:30:00.000Z',
  },
  {
    id: '7',
    user_id: '8', // Charlie Learner
    lecture_id: '2', // HTML Document Structure
    course_id: '1', // Introduction to Web Development
    lastAccessedAt: '2025-02-21T11:15:00.000Z',
    progress: 100,
    completed: true,
    createdAt: '2025-02-21T10:00:00.000Z',
    updatedAt: '2025-02-21T11:15:00.000Z',
  },
];

// Mock lecture schedules
export const mockLectureSchedules: LectureSchedule[] = [
  // Lecture schedules for Course 2 (Advanced JavaScript Concepts)
  {
    id: '1',
    lecture_id: '1', // Introduction to HTML (using as placeholder)
    course_id: '2', // Advanced JavaScript Concepts
    slot_id: '5', // 1:00 PM - 1:45 PM
    scheduledDate: '2025-03-02T13:00:00.000Z', // Monday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '2',
    lecture_id: '2', // HTML Document Structure (using as placeholder)
    course_id: '2', // Advanced JavaScript Concepts
    slot_id: '6', // 2:00 PM - 2:45 PM
    scheduledDate: '2025-03-02T14:00:00.000Z', // Monday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '3',
    lecture_id: '3', // HTML Tags and Elements (using as placeholder)
    course_id: '2', // Advanced JavaScript Concepts
    slot_id: '5', // 1:00 PM - 1:45 PM
    scheduledDate: '2025-03-09T13:00:00.000Z', // Next Monday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '4',
    lecture_id: '4', // Introduction to CSS (using as placeholder)
    course_id: '2', // Advanced JavaScript Concepts
    slot_id: '6', // 2:00 PM - 2:45 PM
    scheduledDate: '2025-03-09T14:00:00.000Z', // Next Monday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  
  // Lecture schedules for Course 4 (Machine Learning with Python)
  {
    id: '5',
    lecture_id: '1', // Introduction to HTML (using as placeholder)
    course_id: '4', // Machine Learning with Python
    slot_id: '7', // 3:00 PM - 3:45 PM
    scheduledDate: '2025-03-03T15:00:00.000Z', // Tuesday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '6',
    lecture_id: '2', // HTML Document Structure (using as placeholder)
    course_id: '4', // Machine Learning with Python
    slot_id: '8', // 4:00 PM - 4:45 PM
    scheduledDate: '2025-03-03T16:00:00.000Z', // Tuesday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '7',
    lecture_id: '3', // HTML Tags and Elements (using as placeholder)
    course_id: '4', // Machine Learning with Python
    slot_id: '7', // 3:00 PM - 3:45 PM
    scheduledDate: '2025-03-10T15:00:00.000Z', // Next Tuesday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '8',
    lecture_id: '4', // Introduction to CSS (using as placeholder)
    course_id: '4', // Machine Learning with Python
    slot_id: '8', // 4:00 PM - 4:45 PM
    scheduledDate: '2025-03-10T16:00:00.000Z', // Next Tuesday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  
  // Lecture schedules for Course 6 (UI/UX Design Principles)
  {
    id: '9',
    lecture_id: '1', // Introduction to HTML (using as placeholder)
    course_id: '6', // UI/UX Design Principles
    slot_id: '3', // 11:00 AM - 11:45 AM
    scheduledDate: '2025-03-05T11:00:00.000Z', // Wednesday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '10',
    lecture_id: '2', // HTML Document Structure (using as placeholder)
    course_id: '6', // UI/UX Design Principles
    slot_id: '4', // 12:00 PM - 12:45 PM
    scheduledDate: '2025-03-05T12:00:00.000Z', // Wednesday
    isRescheduled: false,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
];

export default {
  lectureAccess: mockLectureAccess,
  lectureSchedules: mockLectureSchedules,
};
