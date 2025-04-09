import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/notification-preferences - Get notification preferences
export async function GET(request) {
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
    const backendResponse = await axios.get(
      `${getBackendUrl()}/api/notification-preferences`,
      {
        headers: {
          'Authorization': authHeader
        },
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching notification preferences:', error.message);
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to fetch notification preferences',
      success: false
    }, { status: 500 });
  }
}

// PATCH /api/notification-preferences - Update multiple notification preferences
export async function PATCH(request) {
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    // Make request to backend
    const backendResponse = await axios.patch(
      `${getBackendUrl()}/api/notification-preferences`,
      body,
      {
        headers: {
          'Authorization': authHeader
        },
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error) {
    console.error('Error updating notification preferences:', error.message);
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to update notification preferences',
      success: false
    }, { status: 500 });
  }
}
