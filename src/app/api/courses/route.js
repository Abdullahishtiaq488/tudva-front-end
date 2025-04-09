import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/courses - Get all courses
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    const subject = searchParams.get('subject') || undefined;
    const format = searchParams.get('format') || undefined;
    const seminarDayId = searchParams.get('seminarDayId') || undefined;
    const search = searchParams.get('search') || undefined;

    // Build query string for backend
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('pageSize', pageSize);
    
    if (subject) queryParams.append('subject', subject);
    if (format) queryParams.append('format', format);
    if (seminarDayId) queryParams.append('seminarDayId', seminarDayId);
    if (search) queryParams.append('search', search);

    // Get auth header if available
    const authHeader = request.headers.get('Authorization');
    const headers = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log(`Fetching courses from ${getBackendUrl()}/api/courses?${queryParams.toString()}`);

    // Make request to backend
    const backendResponse = await axios.get(
      `${getBackendUrl()}/api/courses?${queryParams.toString()}`,
      {
        headers,
        timeout: 5000 // 5 second timeout
      }
    );

    console.log('Backend response:', backendResponse.data);

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses from backend:', error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    return NextResponse.json({
      error: error.message || 'Failed to fetch courses',
      success: false,
      courses: [] // Return empty courses array to prevent frontend errors
    }, { status: error.response?.status || 500 });
  }
}
