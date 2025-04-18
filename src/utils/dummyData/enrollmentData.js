/**
 * Dummy data for enrollment components
 * This file provides sample data for the enhanced enrollment system
 * It's used by demo pages and for testing components
 */

// Sample time slots
export const timeSlots = [
  { id: 1, startTime: '09:00', endTime: '09:45', label: '9:00 AM - 9:45 AM' },
  { id: 2, startTime: '10:00', endTime: '10:45', label: '10:00 AM - 10:45 AM' },
  { id: 3, startTime: '11:00', endTime: '11:45', label: '11:00 AM - 11:45 AM' },
  { id: 4, startTime: '12:00', endTime: '12:45', label: '12:00 PM - 12:45 PM' },
  { id: 5, startTime: '13:00', endTime: '13:45', label: '1:00 PM - 1:45 PM' },
  { id: 6, startTime: '14:00', endTime: '14:45', label: '2:00 PM - 2:45 PM' },
  { id: 7, startTime: '15:00', endTime: '15:45', label: '3:00 PM - 3:45 PM' },
  { id: 8, startTime: '16:00', endTime: '16:45', label: '4:00 PM - 4:45 PM' },
];

// Sample seminar days
export const seminarDays = [
  { id: 1, name: 'Monday', isActive: true },
  { id: 2, name: 'Tuesday', isActive: true },
  { id: 3, name: 'Wednesday', isActive: true },
  { id: 4, name: 'Thursday', isActive: true },
  { id: 5, name: 'Friday', isActive: true },
];

// Sample courses for enrollment demo
export const sampleCourses = [
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    format: 'live',
    seminarDay: { id: 1, name: 'Monday' },
    slots: [
      { id: 1, startTime: '09:00', endTime: '09:45' },
      { id: 2, startTime: '10:00', endTime: '10:45' },
    ],
    instructor: {
      id: 'instructor-1',
      name: 'John Doe',
      avatar: '/assets/images/avatar/01.jpg',
    },
  },
  {
    id: 'course-2',
    title: 'Advanced React Development',
    description: 'Master React hooks, context, and performance optimization',
    format: 'recorded',
    seminarDay: { id: 2, name: 'Tuesday' },
    slots: [
      { id: 3, startTime: '11:00', endTime: '11:45' },
      { id: 4, startTime: '12:00', endTime: '12:45' },
    ],
    instructor: {
      id: 'instructor-2',
      name: 'Jane Smith',
      avatar: '/assets/images/avatar/02.jpg',
    },
  },
  {
    id: 'course-3',
    title: 'Database Design and SQL',
    description: 'Learn relational database design and SQL queries',
    format: 'live',
    seminarDay: { id: 3, name: 'Wednesday' },
    slots: [
      { id: 5, startTime: '13:00', endTime: '13:45' },
      { id: 6, startTime: '14:00', endTime: '14:45' },
    ],
    instructor: {
      id: 'instructor-3',
      name: 'Robert Johnson',
      avatar: '/assets/images/avatar/03.jpg',
    },
  },
];

// Sample enrolled courses
export const enrolledCourses = [
  {
    id: 'booking-1',
    course: {
      id: 'course-1',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      format: 'live',
      seminarDay: { id: 1, name: 'Monday' },
      modules: [
        {
          id: 'module-1',
          title: 'HTML Basics',
          slot: { id: 1, startTime: '09:00', endTime: '09:45' },
        },
        {
          id: 'module-2',
          title: 'CSS Styling',
          slot: { id: 2, startTime: '10:00', endTime: '10:45' },
        },
      ],
      instructor: {
        id: 'instructor-1',
        name: 'John Doe',
        avatar: '/assets/images/avatar/01.jpg',
      },
    },
    status: 'active',
    enrollmentDate: '2025-04-01T10:00:00Z',
    selectedSlots: [1, 2],
  },
];

// Sample upcoming lectures
export const upcomingLectures = [
  {
    id: 'lecture-1',
    title: 'HTML Document Structure',
    description: 'Learn about HTML document structure and semantic elements',
    courseId: 'course-1',
    courseTitle: 'Introduction to Web Development',
    moduleId: 'module-1',
    moduleTitle: 'HTML Basics',
    scheduledDate: '2025-04-22T09:00:00Z',
    durationMinutes: 45,
    isAccessible: true,
  },
  {
    id: 'lecture-2',
    title: 'CSS Selectors and Properties',
    description: 'Master CSS selectors and common properties',
    courseId: 'course-1',
    courseTitle: 'Introduction to Web Development',
    moduleId: 'module-2',
    moduleTitle: 'CSS Styling',
    scheduledDate: '2025-04-22T10:00:00Z',
    durationMinutes: 45,
    isAccessible: false,
  },
];
