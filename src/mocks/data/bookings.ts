/**
 * Mock Booking Data
 * 
 * This file provides mock data for bookings/enrollments.
 */

export interface Booking {
  id: string;
  user_id: string;
  course_id: string;
  bookingStatus: 'active' | 'cancelled' | 'completed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface BookingSlot {
  id: string;
  booking_id: string;
  slot_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  id: string;
  startTime: string; // Format: 'HH:MM'
  endTime: string; // Format: 'HH:MM'
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeminarDay {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock seminar days
export const mockSeminarDays: SeminarDay[] = [
  {
    id: '1',
    name: 'Monday',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Tuesday',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Wednesday',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Thursday',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'Friday',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

// Mock slots
export const mockSlots: Slot[] = [
  {
    id: '1',
    startTime: '09:00',
    endTime: '09:45',
    label: '9:00 AM - 9:45 AM',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    startTime: '10:00',
    endTime: '10:45',
    label: '10:00 AM - 10:45 AM',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    startTime: '11:00',
    endTime: '11:45',
    label: '11:00 AM - 11:45 AM',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    startTime: '12:00',
    endTime: '12:45',
    label: '12:00 PM - 12:45 PM',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '5',
    startTime: '13:00',
    endTime: '13:45',
    label: '1:00 PM - 1:45 PM',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '6',
    startTime: '14:00',
    endTime: '14:45',
    label: '2:00 PM - 2:45 PM',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '7',
    startTime: '15:00',
    endTime: '15:45',
    label: '3:00 PM - 3:45 PM',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '8',
    startTime: '16:00',
    endTime: '16:45',
    label: '4:00 PM - 4:45 PM',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    user_id: '4', // Alice Learner
    course_id: '1', // Introduction to Web Development
    bookingStatus: 'active',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '2',
    user_id: '4', // Alice Learner
    course_id: '3', // Data Science Fundamentals
    bookingStatus: 'active',
    createdAt: '2025-02-02T00:00:00.000Z',
    updatedAt: '2025-02-02T00:00:00.000Z',
  },
  {
    id: '3',
    user_id: '5', // Bob Learner
    course_id: '2', // Advanced JavaScript Concepts
    bookingStatus: 'active',
    createdAt: '2025-02-03T00:00:00.000Z',
    updatedAt: '2025-02-03T00:00:00.000Z',
  },
  {
    id: '4',
    user_id: '5', // Bob Learner
    course_id: '4', // Machine Learning with Python
    bookingStatus: 'active',
    createdAt: '2025-02-04T00:00:00.000Z',
    updatedAt: '2025-02-04T00:00:00.000Z',
  },
  {
    id: '5',
    user_id: '8', // Charlie Learner
    course_id: '1', // Introduction to Web Development
    bookingStatus: 'active',
    createdAt: '2025-02-05T00:00:00.000Z',
    updatedAt: '2025-02-05T00:00:00.000Z',
  },
  {
    id: '6',
    user_id: '8', // Charlie Learner
    course_id: '5', // Mobile App Development with React Native
    bookingStatus: 'active',
    createdAt: '2025-02-06T00:00:00.000Z',
    updatedAt: '2025-02-06T00:00:00.000Z',
  },
];

// Mock booking slots
export const mockBookingSlots: BookingSlot[] = [
  // Booking slots for Booking 1
  {
    id: '1',
    booking_id: '1',
    slot_id: '1', // 9:00 AM - 9:45 AM
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: '2',
    booking_id: '1',
    slot_id: '2', // 10:00 AM - 10:45 AM
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  
  // Booking slots for Booking 2
  {
    id: '3',
    booking_id: '2',
    slot_id: '3', // 11:00 AM - 11:45 AM
    createdAt: '2025-02-02T00:00:00.000Z',
    updatedAt: '2025-02-02T00:00:00.000Z',
  },
  {
    id: '4',
    booking_id: '2',
    slot_id: '4', // 12:00 PM - 12:45 PM
    createdAt: '2025-02-02T00:00:00.000Z',
    updatedAt: '2025-02-02T00:00:00.000Z',
  },
  
  // Booking slots for Booking 3
  {
    id: '5',
    booking_id: '3',
    slot_id: '5', // 1:00 PM - 1:45 PM
    createdAt: '2025-02-03T00:00:00.000Z',
    updatedAt: '2025-02-03T00:00:00.000Z',
  },
  {
    id: '6',
    booking_id: '3',
    slot_id: '6', // 2:00 PM - 2:45 PM
    createdAt: '2025-02-03T00:00:00.000Z',
    updatedAt: '2025-02-03T00:00:00.000Z',
  },
  
  // Booking slots for Booking 4
  {
    id: '7',
    booking_id: '4',
    slot_id: '7', // 3:00 PM - 3:45 PM
    createdAt: '2025-02-04T00:00:00.000Z',
    updatedAt: '2025-02-04T00:00:00.000Z',
  },
  {
    id: '8',
    booking_id: '4',
    slot_id: '8', // 4:00 PM - 4:45 PM
    createdAt: '2025-02-04T00:00:00.000Z',
    updatedAt: '2025-02-04T00:00:00.000Z',
  },
  
  // Booking slots for Booking 5
  {
    id: '9',
    booking_id: '5',
    slot_id: '1', // 9:00 AM - 9:45 AM
    createdAt: '2025-02-05T00:00:00.000Z',
    updatedAt: '2025-02-05T00:00:00.000Z',
  },
  {
    id: '10',
    booking_id: '5',
    slot_id: '2', // 10:00 AM - 10:45 AM
    createdAt: '2025-02-05T00:00:00.000Z',
    updatedAt: '2025-02-05T00:00:00.000Z',
  },
  
  // Booking slots for Booking 6
  {
    id: '11',
    booking_id: '6',
    slot_id: '3', // 11:00 AM - 11:45 AM
    createdAt: '2025-02-06T00:00:00.000Z',
    updatedAt: '2025-02-06T00:00:00.000Z',
  },
  {
    id: '12',
    booking_id: '6',
    slot_id: '4', // 12:00 PM - 12:45 PM
    createdAt: '2025-02-06T00:00:00.000Z',
    updatedAt: '2025-02-06T00:00:00.000Z',
  },
];

export default {
  bookings: mockBookings,
  bookingSlots: mockBookingSlots,
  slots: mockSlots,
  seminarDays: mockSeminarDays,
};
