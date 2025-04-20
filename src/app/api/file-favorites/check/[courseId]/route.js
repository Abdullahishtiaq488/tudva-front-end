import { NextResponse } from 'next/server';
import api from '@/services/api';

// GET /api/file-favorites/check/[courseId] - Check if a course is in the user's favorites
export async function GET(request, { params }) {
  const courseId = params.courseId;

  try {
    // Get user ID from auth token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }
    
    // Extract user ID from token (in a real app, you would verify the token)
    const token = authHeader.replace('Bearer ', '');
    const userId = token.split('-')[1]; // Mock token format: mock-token-{userId}-{timestamp}
    
    console.log(`Checking if course ${courseId} is in favorites for user ${userId}`);
    
    // Call API service
    const response = await api.wishlist.check(courseId, userId);
    
    // Return response
    return NextResponse.json({
      success: response.success,
      isFavorite: response.isInWishlist,
      error: response.error
    }, { status: response.success ? 200 : 500 });
  } catch (error) {
    console.error(`Error checking if course ${courseId} is in favorites:`, error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred',
      isFavorite: false
    }, { status: 500 });
  }
}
