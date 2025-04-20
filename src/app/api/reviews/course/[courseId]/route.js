import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/reviews/course/[courseId] - Get reviews for a course
export async function GET(request, { params }) {
  const courseId = params.courseId;

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    // Build query string for backend
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    console.log(`Fetching reviews for course ${courseId}`);

    // Try the regular API
    console.log(`Trying regular API: ${getBackendUrl()}/api/reviews/course/${courseId}?${queryParams.toString()}`);
    const backendResponse = await axios.get(
      `${getBackendUrl()}/api/reviews/course/${courseId}?${queryParams.toString()}`,
      {
        timeout: 5000 // 5 second timeout
      }
    );

    console.log('Regular API response:', backendResponse.data);

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error) {
    console.error(`Error fetching reviews for course ${courseId}:`, error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    return NextResponse.json({
      error: error.message || 'Failed to fetch reviews',
      success: false,
      reviews: [] // Return empty reviews array to prevent frontend errors
    }, { status: error.response?.status || 500 });
  }
}
