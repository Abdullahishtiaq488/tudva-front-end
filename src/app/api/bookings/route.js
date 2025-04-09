import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// POST /api/bookings - Create a new booking/enrollment
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.courseId) {
      return NextResponse.json({
        error: 'courseId is required',
        success: false
      }, { status: 400 });
    }

    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    console.log('Sending booking data to backend:', JSON.stringify(body, null, 2));

    // Make request to backend
    const backendResponse = await axios.post(
      `${getBackendUrl()}/api/bookings`,
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
    console.error('Error creating booking:', error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({
      error: error.message || 'Failed to create booking',
      success: false
    }, { status: 500 });
  }
}

// GET /api/bookings - Get bookings for current user
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

    console.log(`Fetching bookings from ${getBackendUrl()}/api/bookings/user`);

    // Make request to backend
    const backendResponse = await axios.get(
      `${getBackendUrl()}/api/bookings/user`,
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
    console.error('Error fetching bookings:', error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    return NextResponse.json({
      error: error.message || 'Failed to fetch bookings',
      success: false,
      bookings: [] // Return empty bookings array to prevent frontend errors
    }, { status: error.response?.status || 500 });
  }
}
