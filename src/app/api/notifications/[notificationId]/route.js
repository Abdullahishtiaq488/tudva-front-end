import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// DELETE /api/notifications/[notificationId] - Delete a notification
export async function DELETE(request, { params }) {
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

    console.log(`Deleting notification ${notificationId} at ${getBackendUrl()}/api/notifications/${notificationId}`);

    // Make request to backend
    const backendResponse = await axios.delete(
      `${getBackendUrl()}/api/notifications/${notificationId}`,
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
    console.error(`Error deleting notification ${notificationId}:`, error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to delete notification',
      success: false
    }, { status: 500 });
  }
}
