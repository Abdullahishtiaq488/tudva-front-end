/**
 * Mock Course Service
 *
 * This file provides mock course-related services.
 */

import { mockDb } from '../utils/mockDb';
import { randomDelay } from '../utils/delay';
import { ApiError, ErrorType } from '../utils/errors';
import { createSuccessResponse, createPaginatedResponse } from '../utils/response';
import { getItem } from '../utils/storage';
import {
  Course,
  Module,
  Lecture,
  FAQ,
  mockCourses,
  mockModules,
  mockLectures,
  mockFAQs
} from '../data/index';

// Initialize courses in the mock database
const initCourses = () => {
  const existingCourses = mockDb.getAll<Course>('courses');
  if (existingCourses.length === 0) {
    // Initialize courses
    mockCourses.forEach(course => {
      mockDb.create('courses', course);
    });

    // Initialize modules
    mockModules.forEach(module => {
      mockDb.create('modules', module);
    });

    // Initialize lectures
    mockLectures.forEach(lecture => {
      mockDb.create('lectures', lecture);
    });

    // Initialize FAQs
    mockFAQs.forEach(faq => {
      mockDb.create('faqs', faq);
    });
  }
};

// Get all courses with pagination and filtering
export const getAllCourses = async (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  level?: string;
  format?: string;
  instructor_id?: string;
  status?: string;
  seminarDayId?: string;
} = {}) => {
  await randomDelay();

  // Initialize courses if needed
  initCourses();

  // Get all courses
  let courses = mockDb.getAll<Course>('courses');

  // Apply filters
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    courses = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      (course.description && course.description.toLowerCase().includes(searchTerm))
    );
  }

  if (params.category) {
    courses = courses.filter(course => course.category === params.category);
  }

  if (params.level) {
    courses = courses.filter(course => course.level === params.level);
  }

  if (params.format) {
    courses = courses.filter(course => course.format === params.format);
  }

  if (params.instructor_id) {
    courses = courses.filter(course => course.instructor_id === params.instructor_id);
  }

  if (params.status) {
    courses = courses.filter(course => course.status === params.status);
  }

  if (params.seminarDayId) {
    courses = courses.filter(course => course.seminarDayId === params.seminarDayId);
  }

  // Apply pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const total = courses.length;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCourses = courses.slice(startIndex, endIndex);

  // Return paginated response
  return createPaginatedResponse(
    paginatedCourses,
    page,
    pageSize,
    total,
    'Courses retrieved successfully'
  );
};

// Get course by ID
export const getCourseById = async (courseId: string) => {
  await randomDelay();

  // Initialize courses if needed
  initCourses();

  // Get course
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Get modules for this course
  const modules = mockDb.query<Module>('modules', module => module.course_id === courseId)
    .sort((a, b) => a.order - b.order);

  // Get lectures for this course
  const lectures = mockDb.query<Lecture>('lectures', lecture => lecture.course_id === courseId)
    .sort((a, b) => a.order - b.order);

  // Get FAQs for this course
  const faqs = mockDb.query<FAQ>('faqs', faq => faq.course_id === courseId);

  // Return success response
  return createSuccessResponse({
    course,
    modules,
    lectures,
    faqs,
  }, 'Course retrieved successfully');
};

// Create a new course
export const createCourse = async (courseData: Partial<Course>) => {
  await randomDelay();

  // Initialize courses if needed
  initCourses();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is an instructor or admin
  if (userData.role !== 'instructor' && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'Only instructors and admins can create courses');
  }

  // Create new course
  const newCourse: Course = {
    id: mockDb.generateId(),
    title: courseData.title || 'Untitled Course',
    short_description: courseData.short_description || '',
    description: courseData.description || '',
    format: courseData.format || 'recorded',
    courseType: courseData.courseType || 'recorded',
    category: courseData.category || '',
    level: courseData.level || 'Beginner',
    language: courseData.language || 'English',
    modules_count: courseData.modules_count || 0,
    estimatedDuration: courseData.estimatedDuration || 0,
    totalLectures: courseData.totalLectures || 0,
    color: courseData.color || '#4CAF50',
    icon: courseData.icon || 'school',
    promo_video_url: courseData.promo_video_url || '',
    instructor_id: userData.id,
    seminarDayId: courseData.seminarDayId,
    status: courseData.status || 'pending',
    averageRating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save course to database
  const savedCourse = mockDb.create('courses', newCourse);

  // Return success response
  return createSuccessResponse(savedCourse, 'Course created successfully');
};

// Update a course
export const updateCourse = async (courseId: string, updates: Partial<Course>) => {
  await randomDelay();

  // Initialize courses if needed
  initCourses();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get course
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor of this course or an admin
  if (course.instructor_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to update this course');
  }

  // Update course
  const updatedCourse = mockDb.update('courses', courseId, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  if (!updatedCourse) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Return success response
  return createSuccessResponse(updatedCourse, 'Course updated successfully');
};

// Delete a course
export const deleteCourse = async (courseId: string) => {
  await randomDelay();

  // Initialize courses if needed
  initCourses();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get course
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor of this course or an admin
  if (course.instructor_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to delete this course');
  }

  // Delete course
  const deleted = mockDb.remove('courses', courseId);

  if (!deleted) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Delete related modules, lectures, and FAQs
  const modules = mockDb.query<Module>('modules', module => module.course_id === courseId);
  modules.forEach(module => {
    mockDb.remove('modules', module.id);
  });

  const lectures = mockDb.query<Lecture>('lectures', lecture => lecture.course_id === courseId);
  lectures.forEach(lecture => {
    mockDb.remove('lectures', lecture.id);
  });

  const faqs = mockDb.query<FAQ>('faqs', faq => faq.course_id === courseId);
  faqs.forEach(faq => {
    mockDb.remove('faqs', faq.id);
  });

  // Return success response
  return createSuccessResponse(null, 'Course deleted successfully');
};

// Create a module
export const createModule = async (courseId: string, moduleData: Partial<Module>) => {
  await randomDelay();

  // Initialize courses if needed
  initCourses();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get course
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor of this course or an admin
  if (course.instructor_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to add modules to this course');
  }

  // Get existing modules to determine order
  const existingModules = mockDb.query<Module>('modules', module => module.course_id === courseId);
  const order = moduleData.order || existingModules.length + 1;

  // Create new module
  const newModule: Module = {
    id: mockDb.generateId(),
    title: moduleData.title || 'Untitled Module',
    description: moduleData.description || '',
    course_id: courseId,
    order,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save module to database
  const savedModule = mockDb.create('modules', newModule);

  // Update course modules count
  mockDb.update('courses', courseId, {
    modules_count: existingModules.length + 1,
    updatedAt: new Date().toISOString(),
  });

  // Return success response
  return createSuccessResponse(savedModule, 'Module created successfully');
};

// Create a lecture
export const createLecture = async (moduleId: string, lectureData: Partial<Lecture>) => {
  await randomDelay();

  // Initialize courses if needed
  initCourses();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get module
  const module = mockDb.getById<Module>('modules', moduleId);

  if (!module) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Module not found');
  }

  // Get course
  const course = mockDb.getById<Course>('courses', module.course_id);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor of this course or an admin
  if (course.instructor_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to add lectures to this course');
  }

  // Get existing lectures to determine order
  const existingLectures = mockDb.query<Lecture>('lectures', lecture => lecture.module_id === moduleId);
  const order = lectureData.order || existingLectures.length + 1;

  // Create new lecture
  const newLecture: Lecture = {
    id: mockDb.generateId(),
    title: lectureData.title || 'Untitled Lecture',
    description: lectureData.description || '',
    module_id: moduleId,
    course_id: module.course_id,
    order,
    duration: lectureData.duration || 45, // Default to 45 minutes
    video_url: lectureData.video_url || '',
    is_preview: lectureData.is_preview || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save lecture to database
  const savedLecture = mockDb.create('lectures', newLecture);

  // Update course total lectures count
  const allLectures = mockDb.query<Lecture>('lectures', lecture => lecture.course_id === module.course_id);
  mockDb.update('courses', module.course_id, {
    totalLectures: allLectures.length + 1,
    updatedAt: new Date().toISOString(),
  });

  // Return success response
  return createSuccessResponse(savedLecture, 'Lecture created successfully');
};

// Create a FAQ
export const createFAQ = async (courseId: string, faqData: Partial<FAQ>) => {
  await randomDelay();

  // Initialize courses if needed
  initCourses();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get course
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor of this course or an admin
  if (course.instructor_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to add FAQs to this course');
  }

  // Create new FAQ
  const newFAQ: FAQ = {
    id: mockDb.generateId(),
    question: faqData.question || 'Untitled Question',
    answer: faqData.answer || '',
    course_id: courseId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save FAQ to database
  const savedFAQ = mockDb.create('faqs', newFAQ);

  // Return success response
  return createSuccessResponse(savedFAQ, 'FAQ created successfully');
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  createLecture,
  createFAQ,
};
