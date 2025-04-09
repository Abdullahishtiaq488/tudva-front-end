import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// PUT /api/notifications/read/[notificationId] - Mark a notification as read
export async function PUT(request, { params }) {
  const notificationId = params.notificationId;
  
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    console.log(`Marking notification ${notificationId} as read at ${getBackendUrl()}/api/notifications/${notificationId}/read`);

    // Make request to backend
    const backendResponse = await axios.put(
      `${getBackendUrl()}/api/notifications/${notificationId}/read`,
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
    console.error(`Error marking notification ${notificationId} as read:`, error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to mark notification as read',
      success: false
    }, { status: 500 });
  }
}
