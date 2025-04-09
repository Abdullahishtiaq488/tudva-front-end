import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// POST /api/reviews/[reviewId]/helpful - Mark a review as helpful
export async function POST(request, { params }) {
  const reviewId = params.reviewId;
  
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    console.log(`Marking review ${reviewId} as helpful at ${getBackendUrl()}/api/reviews/${reviewId}/helpful`);

    // Make request to backend
    const backendResponse = await axios.post(
      `${getBackendUrl()}/api/reviews/${reviewId}/helpful`,
      {},
      {
        headers: {
          'Authorization': authHeader
        },
        timeout: 5000 // 5 second timeout
      }
    );

    console.log('Backend response:', backendResponse.data);

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error) {
    console.error(`Error marking review ${reviewId} as helpful:`, error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to mark review as helpful',
      success: false
    }, { status: 500 });
  }
}

// GET /api/reviews/[reviewId]/helpful - Check if a user has marked a review as helpful
export async function GET(request, { params }) {
  const reviewId = params.reviewId;
  
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false,
        hasMarked: false
      }, { status: 401 });
    }

    console.log(`Checking if review ${reviewId} is marked as helpful at ${getBackendUrl()}/api/reviews/${reviewId}/helpful`);

    // Make request to backend
    const backendResponse = await axios.get(
      `${getBackendUrl()}/api/reviews/${reviewId}/helpful`,
      {
        headers: {
          'Authorization': authHeader
        },
        timeout: 5000 // 5 second timeout
      }
    );

    console.log('Backend response:', backendResponse.data);

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error) {
    console.error(`Error checking if review ${reviewId} is marked as helpful:`, error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    return NextResponse.json({
      error: error.message || 'Failed to check if review is marked as helpful',
      success: false,
      hasMarked: false
    }, { status: error.response?.status || 500 });
  }
}
