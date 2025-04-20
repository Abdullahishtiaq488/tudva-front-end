import { NextResponse } from 'next/server';
import ensureMockSystemInitialized from '../../../mock-init';
import { reviewService } from '@/mocks/services';
import { ApiError } from '@/mocks/utils/errors';

// GET /api/file-reviews/course/[courseId] - Get reviews for a course
export async function GET(request, { params }) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();

    const { courseId } = params;
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log(`Fetching reviews for course ${courseId}`);

    // Call mock service
    try {
      const response = await reviewService.getCourseReviews(courseId, page, limit);

      // Return success response
      return NextResponse.json({
        success: true,
        reviews: response.data || [],
        pagination: response.pagination
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: error.message,
          reviews: [] // Return empty reviews array to prevent frontend errors
        }, { status: error.status });
      }

      // Handle unexpected errors
      console.error('Error fetching reviews:', error);
      return NextResponse.json({
        success: false,
        error: 'An unexpected error occurred',
        reviews: [] // Return empty reviews array to prevent frontend errors
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing reviews request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false,
      reviews: [] // Return empty reviews array to prevent frontend errors
    }, { status: 500 });
  }
}
