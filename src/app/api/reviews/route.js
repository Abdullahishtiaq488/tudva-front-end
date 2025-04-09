import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// POST /api/reviews - Create a new review
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['content', 'rating', 'course_id'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          error: `${field} is required`,
          success: false
        }, { status: 400 });
      }
    }

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    console.log('Sending review data to backend:', JSON.stringify(body, null, 2));

    // Make request to backend
    const backendResponse = await axios.post(
      `${getBackendUrl()}/api/reviews`,
      body,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      }
    );

    console.log('Backend response:', backendResponse.data);

    return NextResponse.json(backendResponse.data, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to create review',
      success: false
    }, { status: 500 });
  }
}
