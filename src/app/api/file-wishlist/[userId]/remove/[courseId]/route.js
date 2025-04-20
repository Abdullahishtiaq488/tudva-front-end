import { NextResponse } from 'next/server';
import ensureMockSystemInitialized from '../../../../mock-init';
import { wishlistService } from '@/mocks/services';
import { ApiError } from '@/mocks/utils/errors';

// DELETE /api/file-wishlist/[userId]/remove/[courseId] - Remove a course from wishlist
export async function DELETE(request, { params }) {
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
    
    console.log(`Removing course ${courseId} from wishlist for user ${userId}`);
    
    // Call mock service
    try {
      const response = await wishlistService.removeFromWishlist(userId, courseId);
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Course removed from wishlist'
      }, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: error.status });
      }
      
      // Handle unexpected errors
      console.error('Error removing from wishlist:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing wishlist remove request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 });
  }
}
