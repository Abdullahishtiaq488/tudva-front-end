import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/courses/[courseId] - Get course by ID
export async function GET(request, { params }) {
  const courseId = params.courseId;

  try {
    // Get auth header if available
    const authHeader = request.headers.get('Authorization');
    const headers = {};

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log(`Fetching course with ID ${courseId} from ${getBackendUrl()}/api/courses/${courseId}`);

    try {
      // Try to get the course from the main API
      const backendResponse = await axios.get(
        `${getBackendUrl()}/api/courses/${courseId}`,
        {
          headers,
          timeout: 5000 // 5 second timeout
        }
      );

      console.log('Backend response:', backendResponse.data);
      return NextResponse.json(backendResponse.data, { status: 200 });
    } catch (mainApiError) {
      console.warn(`Error fetching course from main API: ${mainApiError.message}`);

      // Try to get the course from file-based API
      try {
        console.log(`Trying file-based API for course ${courseId}`);
        const fileResponse = await axios.get(
          `${getBackendUrl()}/api/file-courses/${courseId}`,
          { timeout: 5000 }
        );

        if (fileResponse.data && fileResponse.data.course) {
          console.log('File API response:', fileResponse.data);
          return NextResponse.json({
            success: true,
            course: fileResponse.data.course
          });
        }
      } catch (fileError) {
        console.warn(`Error fetching course from file API: ${fileError.message}`);
      }

      // If both APIs fail, try to get the course from localStorage on the client side
      return NextResponse.json({
        success: false,
        error: 'Course not found in any API',
        fallbackToLocalStorage: true
      });
    }
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    return NextResponse.json({
      error: error.message || 'Failed to fetch course',
      success: false
    }, { status: error.response?.status || 500 });
  }
}
