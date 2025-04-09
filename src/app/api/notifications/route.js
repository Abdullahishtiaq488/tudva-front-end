import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/notifications - Get notifications for the current user
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const unreadOnly = searchParams.get('unreadOnly') || 'false';

    // Build query string for backend
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    queryParams.append('unreadOnly', unreadOnly);

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    console.log(`Fetching notifications from ${getBackendUrl()}/api/notifications?${queryParams.toString()}`);

    // Make request to backend
    const backendResponse = await axios.get(
      `${getBackendUrl()}/api/notifications?${queryParams.toString()}`,
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
    console.error('Error fetching notifications:', error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    return NextResponse.json({
      error: error.message || 'Failed to fetch notifications',
      success: false,
      notifications: [] // Return empty notifications array to prevent frontend errors
    }, { status: error.response?.status || 500 });
  }
}
