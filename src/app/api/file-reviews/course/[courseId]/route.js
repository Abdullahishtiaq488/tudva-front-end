import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/file-reviews/course/[courseId] - Get reviews for a course
export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;

    console.log(`Fetching reviews for course ${courseId} from backend`);
    
    const response = await axios.get(
      `${getBackendUrl()}/api/file-reviews/course/${courseId}?page=${page}&limit=${limit}`,
      {
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching reviews from backend:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to fetch reviews',
      success: false
    }, { status: error.response?.status || 500 });
  }
}
