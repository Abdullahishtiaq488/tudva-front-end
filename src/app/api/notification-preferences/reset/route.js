import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// POST /api/notification-preferences/reset - Reset notification preferences
export async function POST(request) {
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    // Make request to backend
    const backendResponse = await axios.post(
      `${getBackendUrl()}/api/notification-preferences/reset`,
      {},
      {
        headers: {
          'Authorization': authHeader
        },
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error) {
    console.error('Error resetting notification preferences:', error.message);
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to reset notification preferences',
      success: false
    }, { status: 500 });
  }
}
