/**
 * Mock Lecture Access Service
 *
 * This file provides mock lecture access and scheduling services.
 */

import { mockDb } from '../utils/mockDb';
import { randomDelay } from '../utils/delay';
import { ApiError, ErrorType } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';
import { getItem } from '../utils/storage';
import {
  LectureAccess,
  LectureSchedule,
  Lecture,
  Course,
  Booking,
  mockLectureAccess,
  mockLectureSchedules
} from '../data/index';

// Initialize lecture access in the mock database
const initLectureAccess = () => {
  const existingAccess = mockDb.getAll<LectureAccess>('lectureAccess');
  if (existingAccess.length === 0) {
    // Initialize lecture access
    mockLectureAccess.forEach(access => {
      mockDb.create('lectureAccess', access);
    });

    // Initialize lecture schedules
    mockLectureSchedules.forEach(schedule => {
      mockDb.create('lectureSchedules', schedule);
    });
  }
};

// Get lecture access for a user
export const getUserLectureAccess = async (userId: string, courseId: string) => {
  await randomDelay();

  // Initialize lecture access if needed
  initLectureAccess();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is requesting their own access or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to view this lecture access');
  }

  // Check if user is enrolled in this course
  const bookings = mockDb.query<Booking>('bookings', booking =>
    booking.user_id === userId && booking.course_id === courseId && booking.bookingStatus === 'active'
  );

  if (bookings.length === 0) {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not enrolled in this course');
  }

  // Get lecture access for this user and course
  const lectureAccess = mockDb.query<LectureAccess>('lectureAccess', access =>
    access.user_id === userId && access.course_id === courseId
  );

  // Get all lectures for this course
  const lectures = mockDb.query<Lecture>('lectures', lecture => lecture.course_id === courseId);

  // Map lectures to access status
  const lecturesWithAccess = lectures.map(lecture => {
    const access = lectureAccess.find(a => a.lecture_id === lecture.id);

    return {
      ...lecture,
      access: access || {
        progress: 0,
        completed: false,
        lastAccessedAt: null,
      },
    };
  });

  // Return success response
  return createSuccessResponse(lecturesWithAccess, 'Lecture access retrieved successfully');
};

// Update lecture access
export const updateLectureAccess = async (userId: string, lectureId: string, progress: number, completed: boolean) => {
  await randomDelay();

  // Initialize lecture access if needed
  initLectureAccess();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is updating their own access or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to update this lecture access');
  }

  // Get lecture
  const lecture = mockDb.getById<Lecture>('lectures', lectureId);

  if (!lecture) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Lecture not found');
  }

  // Check if user is enrolled in this course
  const bookings = mockDb.query<Booking>('bookings', booking =>
    booking.user_id === userId && booking.course_id === lecture.course_id && booking.bookingStatus === 'active'
  );

  if (bookings.length === 0) {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not enrolled in this course');
  }

  // Find existing access record
  const existingAccess = mockDb.query<LectureAccess>('lectureAccess', access =>
    access.user_id === userId && access.lecture_id === lectureId
  );

  if (existingAccess.length > 0) {
    // Update existing access
    const updatedAccess = mockDb.update('lectureAccess', existingAccess[0].id, {
      progress,
      completed,
      lastAccessedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Return success response
    return createSuccessResponse(updatedAccess, 'Lecture access updated successfully');
  } else {
    // Create new access record
    const newAccess: LectureAccess = {
      id: mockDb.generateId(),
      user_id: userId,
      lecture_id: lectureId,
      course_id: lecture.course_id,
      progress,
      completed,
      lastAccessedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedAccess = mockDb.create('lectureAccess', newAccess);

    // Return success response
    return createSuccessResponse(savedAccess, 'Lecture access created successfully');
  }
};

// Get lecture schedules for a course
export const getLectureSchedules = async (courseId: string) => {
  await randomDelay();

  // Initialize lecture access if needed
  initLectureAccess();

  // Check if course exists
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Get lecture schedules for this course
  const schedules = mockDb.query<LectureSchedule>('lectureSchedules', schedule => schedule.course_id === courseId);

  // Get lectures for this course
  const lectures = mockDb.query<Lecture>('lectures', lecture => lecture.course_id === courseId);

  // Map schedules to include lecture details
  const schedulesWithLectures = schedules.map(schedule => {
    const lecture = lectures.find(l => l.id === schedule.lecture_id);

    return {
      ...schedule,
      lecture: lecture || { title: 'Unknown Lecture' },
    };
  });

  // Sort schedules by date
  schedulesWithLectures.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  // Return success response
  return createSuccessResponse(schedulesWithLectures, 'Lecture schedules retrieved successfully');
};

// Create a lecture schedule
export const createLectureSchedule = async (lectureId: string, slotId: string, scheduledDate: string) => {
  await randomDelay();

  // Initialize lecture access if needed
  initLectureAccess();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is an instructor or admin
  if (userData.role !== 'instructor' && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'Only instructors and admins can create lecture schedules');
  }

  // Get lecture
  const lecture = mockDb.getById<Lecture>('lectures', lectureId);

  if (!lecture) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Lecture not found');
  }

  // Get course
  const course = mockDb.getById<Course>('courses', lecture.course_id);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor of this course or an admin
  if (course.instructor_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to create schedules for this course');
  }

  // Create new schedule
  const newSchedule: LectureSchedule = {
    id: mockDb.generateId(),
    lecture_id: lectureId,
    course_id: lecture.course_id,
    slot_id: slotId,
    scheduledDate,
    isRescheduled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save schedule to database
  const savedSchedule = mockDb.create('lectureSchedules', newSchedule);

  // Return success response
  return createSuccessResponse(savedSchedule, 'Lecture schedule created successfully');
};

// Update a lecture schedule
export const updateLectureSchedule = async (scheduleId: string, updates: Partial<LectureSchedule>) => {
  await randomDelay();

  // Initialize lecture access if needed
  initLectureAccess();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get schedule
  const schedule = mockDb.getById<LectureSchedule>('lectureSchedules', scheduleId);

  if (!schedule) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Schedule not found');
  }

  // Get course
  const course = mockDb.getById<Course>('courses', schedule.course_id);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor of this course or an admin
  if (course.instructor_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to update schedules for this course');
  }

  // Update schedule
  const updatedSchedule = mockDb.update('lectureSchedules', scheduleId, {
    ...updates,
    isRescheduled: true, // Mark as rescheduled if updated
    updatedAt: new Date().toISOString(),
  });

  if (!updatedSchedule) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Schedule not found');
  }

  // Return success response
  return createSuccessResponse(updatedSchedule, 'Lecture schedule updated successfully');
};

export default {
  getUserLectureAccess,
  updateLectureAccess,
  getLectureSchedules,
  createLectureSchedule,
  updateLectureSchedule,
};
