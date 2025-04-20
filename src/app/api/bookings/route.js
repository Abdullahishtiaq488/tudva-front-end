import { NextResponse } from 'next/server';
import ensureMockSystemInitialized from '../mock-init';
import { enrollmentService } from '@/mocks/services';
import { ApiError } from '@/mocks/utils/errors';
import { getItem } from '@/mocks/utils/storage';

// Helper function to extract user ID from auth token
const getUserIdFromToken = (authHeader) => {
  if (!authHeader) return null;

  // In a real app, you would decode the JWT token
  // For our mock system, we'll get the user from storage
  const userData = getItem('user_data') || {};
  return userData.id || null;
};

// POST /api/bookings - Create a new booking/enrollment
export async function POST(request) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();

    const body = await request.json();

    // Validate required fields
    if (!body.courseId) {
      return NextResponse.json({
        error: 'courseId is required',
        success: false
      }, { status: 400 });
    }

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    // Get user ID from token
    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return NextResponse.json({
        error: 'Invalid authentication token',
        success: false
      }, { status: 401 });
    }

    console.log('Creating booking:', { userId, courseId: body.courseId, selectedSlots: body.selectedSlots });

    // Call mock service
    try {
      const response = await enrollmentService.createBooking(
        userId,
        body.courseId,
        body.selectedSlots
      );

      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Enrollment successful',
        booking: response.data
      }, { status: 201 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: error.status });
      }

      // Handle unexpected errors
      console.error('Error creating booking:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing booking request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 });
  }
}

// GET /api/bookings - Get bookings for current user
export async function GET(request) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    // Get user ID from token
    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return NextResponse.json({
        error: 'Invalid authentication token',
        success: false
      }, { status: 401 });
    }

    console.log(`Fetching bookings for user ${userId}`);

    // Call mock service
    try {
      const response = await enrollmentService.getUserBookings(userId);

      // Return success response
      return NextResponse.json({
        success: true,
        bookings: response.data || []
      }, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message,
          bookings: [] // Return empty bookings array to prevent frontend errors
        }, { status: error.status });
      }

      // Handle unexpected errors
      console.error('Error fetching bookings:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred',
        bookings: [] // Return empty bookings array to prevent frontend errors
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing bookings request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false,
      bookings: [] // Return empty bookings array to prevent frontend errors
    }, { status: 500 });
  }
}
