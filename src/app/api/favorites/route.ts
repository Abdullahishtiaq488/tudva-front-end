import { NextRequest, NextResponse } from 'next/server';
import ensureMockSystemInitialized from '../mock-init';
import { wishlistService } from '@/mocks/services';
import { ApiError } from '@/mocks/utils/errors';
import { getItem } from '@/mocks/utils/storage';

// Helper function to extract user ID from auth token
const getUserIdFromToken = (authHeader: string | null): string | null => {
  if (!authHeader) return null;

  // In a real app, you would decode the JWT token
  // For our mock system, we'll get the user from storage
  const userData = getItem<{ id?: string }>('user_data');
  return userData?.id || null;
};

// GET /api/favorites - Get all favorites for the current user
export async function GET(request: NextRequest) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();

    // Get the authorization header from the request
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header is required',
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

    console.log(`Fetching favorites for user ${userId}`);

    // Call mock service (reuse wishlist service for favorites)
    try {
      const response = await wishlistService.getUserWishlist(userId);

      // Return success response
      return NextResponse.json({
        success: true,
        favorites: response.data || []
      }, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message,
          favorites: [] // Return empty favorites array to prevent frontend errors
        }, { status: error.status });
      }

      // Handle unexpected errors
      console.error('Error fetching favorites:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred',
        favorites: [] // Return empty favorites array to prevent frontend errors
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing favorites request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false,
      favorites: [] // Return empty favorites array to prevent frontend errors
    }, { status: 500 });
  }
}

// POST /api/favorites - Add a course to favorites
export async function POST(request: NextRequest) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();

    // Get the authorization header from the request
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header is required',
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

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({
        error: 'Course ID is required',
        success: false
      }, { status: 400 });
    }

    console.log(`Adding course ${courseId} to favorites for user ${userId}`);

    // Call mock service (reuse wishlist service for favorites)
    try {
      const response = await wishlistService.addToWishlist(userId, courseId);

      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Course added to favorites',
        favorite: response.data
      }, { status: 201 });
    } catch (error) {
      if (error instanceof ApiError) {
        // If course is already in favorites, return success anyway to be consistent with original API
        if (error.type === 'CONFLICT') {
          return NextResponse.json({
            success: true,
            message: 'Course already in favorites'
          }, { status: 200 });
        }

        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: error.status });
      }

      // Handle unexpected errors
      console.error('Error adding to favorites:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing favorites add request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 });
  }
}
