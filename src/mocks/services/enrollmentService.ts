/**
 * Mock Enrollment Service
 *
 * This file provides mock enrollment/booking services.
 */

import { mockDb } from '../utils/mockDb';
import { randomDelay } from '../utils/delay';
import { ApiError, ErrorType } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';
import { getItem } from '../utils/storage';
import {
  Booking,
  BookingSlot,
  Course,
  mockBookings,
  mockBookingSlots,
  mockSlots,
  mockSeminarDays
} from '../data/index';

// Initialize bookings in the mock database
const initBookings = () => {
  const existingBookings = mockDb.getAll<Booking>('bookings');
  if (existingBookings.length === 0) {
    // Initialize bookings
    mockBookings.forEach(booking => {
      mockDb.create('bookings', booking);
    });

    // Initialize booking slots
    mockBookingSlots.forEach(slot => {
      mockDb.create('bookingSlots', slot);
    });

    // Initialize slots
    mockSlots.forEach(slot => {
      mockDb.create('slots', slot);
    });

    // Initialize seminar days
    mockSeminarDays.forEach(day => {
      mockDb.create('seminarDays', day);
    });
  }
};

// Get all bookings for a user
export const getUserBookings = async (userId: string) => {
  await randomDelay();

  // Initialize bookings if needed
  initBookings();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is requesting their own bookings or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to view these bookings');
  }

  // Get bookings for this user
  const bookings = mockDb.query<Booking>('bookings', booking => booking.user_id === userId);

  // Get booking slots for each booking
  const bookingsWithSlots = await Promise.all(bookings.map(async booking => {
    const bookingSlots = mockDb.query<BookingSlot>('bookingSlots', slot => slot.booking_id === booking.id);

    // Get course details
    const course = mockDb.getById<Course>('courses', booking.course_id);

    return {
      ...booking,
      slots: bookingSlots,
      course: course || { title: 'Unknown Course' },
    };
  }));

  // Return success response
  return createSuccessResponse(bookingsWithSlots, 'Bookings retrieved successfully');
};

// Create a new booking/enrollment
export const createBooking = async (userId: string, courseId: string, selectedSlots: string[] = []) => {
  await randomDelay();

  // Initialize bookings if needed
  initBookings();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Check if user is creating a booking for themselves or is an admin
  if (userData.id !== userId && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to create bookings for this user');
  }

  // Check if course exists
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Check if user is already enrolled in this course
  const existingBooking = mockDb.query<Booking>('bookings', booking =>
    booking.user_id === userId && booking.course_id === courseId
  );

  if (existingBooking.length > 0) {
    throw new ApiError(ErrorType.CONFLICT, 'You are already enrolled in this course');
  }

  // Create new booking
  const newBooking: Booking = {
    id: mockDb.generateId(),
    user_id: userId,
    course_id: courseId,
    bookingStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save booking to database
  const savedBooking = mockDb.create('bookings', newBooking);

  // Create booking slots if provided
  if (selectedSlots && selectedSlots.length > 0) {
    selectedSlots.forEach(slotId => {
      const newBookingSlot: BookingSlot = {
        id: mockDb.generateId(),
        booking_id: savedBooking.id,
        slot_id: slotId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockDb.create('bookingSlots', newBookingSlot);
    });
  }

  // Return success response
  return createSuccessResponse(savedBooking, 'Enrollment successful');
};

// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  await randomDelay();

  // Initialize bookings if needed
  initBookings();

  // Check if user is authenticated
  const userData = getItem<{ id?: string; role?: string }>('user_data');

  if (!userData) {
    throw new ApiError(ErrorType.UNAUTHORIZED, 'Not authenticated');
  }

  // Get booking
  const booking = mockDb.getById<Booking>('bookings', bookingId);

  if (!booking) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Booking not found');
  }

  // Check if user is the owner of this booking or an admin
  if (booking.user_id !== userData.id && userData.role !== 'admin') {
    throw new ApiError(ErrorType.FORBIDDEN, 'You are not authorized to cancel this booking');
  }

  // Update booking status
  const updatedBooking = mockDb.update('bookings', bookingId, {
    bookingStatus: 'cancelled',
    updatedAt: new Date().toISOString(),
  });

  if (!updatedBooking) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Booking not found');
  }

  // Return success response
  return createSuccessResponse(updatedBooking, 'Booking cancelled successfully');
};

// Get available slots for a course
export const getAvailableSlots = async (courseId: string) => {
  await randomDelay();

  // Initialize bookings if needed
  initBookings();

  // Check if course exists
  const course = mockDb.getById<Course>('courses', courseId);

  if (!course) {
    throw new ApiError(ErrorType.NOT_FOUND, 'Course not found');
  }

  // Get all slots
  const allSlots = mockDb.getAll('slots');

  // Get all booking slots for this course
  const bookings = mockDb.query<Booking>('bookings', booking => booking.course_id === courseId);
  const bookingIds = bookings.map(booking => booking.id);

  const bookedSlots = mockDb.query<BookingSlot>('bookingSlots', slot =>
    bookingIds.includes(slot.booking_id)
  );

  const bookedSlotIds = bookedSlots.map(slot => slot.slot_id);

  // Filter out booked slots
  const availableSlots = allSlots.filter(slot => !bookedSlotIds.includes(slot.id));

  // Return success response
  return createSuccessResponse(availableSlots, 'Available slots retrieved successfully');
};

export default {
  getUserBookings,
  createBooking,
  cancelBooking,
  getAvailableSlots,
};
