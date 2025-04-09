import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/courses/[id] - Get course by ID
export async function GET(request, { params }) {
  const courseId = params.id;
  
  try {
    // Get auth header if available
    const authHeader = request.headers.get('Authorization');
    const headers = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log(`Fetching course with ID ${courseId} from ${getBackendUrl()}/api/courses/${courseId}`);

    // Make request to backend
    const backendResponse = await axios.get(
      `${getBackendUrl()}/api/courses/${courseId}`,
      {
        headers,
        timeout: 5000 // 5 second timeout
      }
    );

    console.log('Backend response:', backendResponse.data);

    return NextResponse.json(backendResponse.data, { status: 200 });
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
