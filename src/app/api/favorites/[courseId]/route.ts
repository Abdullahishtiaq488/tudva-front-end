import { NextRequest, NextResponse } from 'next/server';
import ensureMockSystemInitialized from '../../mock-init';
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

// GET /api/favorites/[courseId] - Check if a course is in favorites
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();

    const courseId = params.courseId;
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header is required',
        success: false,
        isFavorite: false
      }, { status: 401 });
    }

    // Get user ID from token
    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return NextResponse.json({
        error: 'Invalid authentication token',
        success: false,
        isFavorite: false
      }, { status: 401 });
    }

    console.log(`Checking if course ${courseId} is in favorites for user ${userId}`);

    // Call mock service (reuse wishlist service for favorites)
    try {
      const response = await wishlistService.isInWishlist(userId, courseId);

      // Return success response
      return NextResponse.json({
        success: true,
        isFavorite: response.data?.inWishlist || false
      }, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message,
          isFavorite: false // Default to false on error
        }, { status: error.status });
      }

      // Handle unexpected errors
      console.error('Error checking favorite status:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred',
        isFavorite: false // Default to false on error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing favorite check request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false,
      isFavorite: false // Default to false on error
    }, { status: 500 });
  }
}

// DELETE /api/favorites/[courseId] - Remove a course from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();

    const courseId = params.courseId;
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

    console.log(`Removing course ${courseId} from favorites for user ${userId}`);

    // Call mock service (reuse wishlist service for favorites)
    try {
      const response = await wishlistService.removeFromWishlist(userId, courseId);

      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Course removed from favorites'
      }, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: error.status });
      }

      // Handle unexpected errors
      console.error('Error removing from favorites:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing favorite remove request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 });
  }
}
