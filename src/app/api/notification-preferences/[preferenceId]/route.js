import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// PATCH /api/notification-preferences/[preferenceId] - Update a notification preference
export async function PATCH(request, { params }) {
  const preferenceId = params.preferenceId;
  
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
      `${getBackendUrl()}/api/notification-preferences/${preferenceId}`,
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
    console.error(`Error updating notification preference ${preferenceId}:`, error.message);
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to update notification preference',
      success: false
    }, { status: 500 });
  }
}
