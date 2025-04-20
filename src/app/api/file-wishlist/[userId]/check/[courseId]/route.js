import { NextResponse } from 'next/server';
import ensureMockSystemInitialized from '../../../../mock-init';
import { wishlistService } from '@/mocks/services';
import { ApiError } from '@/mocks/utils/errors';

// GET /api/file-wishlist/[userId]/check/[courseId] - Check if a course is in wishlist
export async function GET(request, { params }) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();
    
    const { userId, courseId } = params;
    
    if (!userId || !courseId) {
      return NextResponse.json({
        success: false,
        error: 'User ID and Course ID are required',
      }, { status: 400 });
    }
    
    console.log(`Checking if course ${courseId} is in wishlist for user ${userId}`);
    
    // Call mock service
    try {
      const response = await wishlistService.isInWishlist(userId, courseId);
      
      // Return success response
      return NextResponse.json({
        success: true,
        isInWishlist: response.data?.inWishlist || false
      }, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message,
          isInWishlist: false // Default to false on error
        }, { status: error.status });
      }
      
      // Handle unexpected errors
      console.error('Error checking wishlist:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred',
        isInWishlist: false // Default to false on error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing wishlist check request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false,
      isInWishlist: false // Default to false on error
    }, { status: 500 });
  }
}
