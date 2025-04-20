import { NextResponse } from 'next/server';
import ensureMockSystemInitialized from '../../mock-init';
import { wishlistService } from '@/mocks/services';
import { ApiError } from '@/mocks/utils/errors';

// GET /api/file-wishlist/[userId] - Get wishlist for a user
export async function GET(request, { params }) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();
    
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required',
      }, { status: 400 });
    }
    
    console.log(`Fetching wishlist for user ${userId}`);
    
    // Call mock service
    try {
      const response = await wishlistService.getUserWishlist(userId);
      
      // Return success response
      return NextResponse.json({
        success: true,
        wishlist: response.data || []
      }, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message,
          wishlist: [] // Return empty wishlist array to prevent frontend errors
        }, { status: error.status });
      }
      
      // Handle unexpected errors
      console.error('Error fetching wishlist:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred',
        wishlist: [] // Return empty wishlist array to prevent frontend errors
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing wishlist request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false,
      wishlist: [] // Return empty wishlist array to prevent frontend errors
    }, { status: 500 });
  }
}
