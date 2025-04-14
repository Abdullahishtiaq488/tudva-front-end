import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAuthTokenFromRequest } from '@/utils/authUtils';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/file-favorites - Get all favorites for the current user
export async function GET(request) {
  try {
    // Get auth token from request
    const token = getAuthTokenFromRequest(request);
    const userId = request.headers.get('X-User-Id');
    
    if (!token && !userId) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false,
        favorites: []
      }, { status: 401 });
    }

    // Try to get favorites from the backend
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const backendResponse = await axios.get(
        `${getBackendUrl()}/api/file-favorites${userId ? `/${userId}` : ''}`,
        {
          headers,
          timeout: 5000 // 5 second timeout
        }
      );

      return NextResponse.json({
        success: true,
        favorites: backendResponse.data.favorites || []
      });
    } catch (backendError) {
      console.warn(`Error fetching favorites from backend: ${backendError.message}`);
      
      // If backend fails, return empty array
      return NextResponse.json({
        success: true,
        favorites: []
      });
    }
  } catch (error) {
    console.error('Error in file-favorites API route:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to fetch favorites',
      success: false,
      favorites: []
    }, { status: 500 });
  }
}

// POST /api/file-favorites - Add a course to favorites
export async function POST(request) {
  try {
    // Get auth token from request
    const token = getAuthTokenFromRequest(request);
    const userId = request.headers.get('X-User-Id');
    
    if (!token && !userId) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    // Get course ID from request body
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({
        error: 'Course ID is required',
        success: false
      }, { status: 400 });
    }

    // Try to add to favorites using the backend
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const backendResponse = await axios.post(
        `${getBackendUrl()}/api/file-favorites${userId ? `/${userId}/add/${courseId}` : ''}`,
        token ? { courseId } : null,
        {
          headers,
          timeout: 5000 // 5 second timeout
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Course added to favorites',
        ...backendResponse.data
      });
    } catch (backendError) {
      console.warn(`Error adding to favorites from backend: ${backendError.message}`);
      
      // If backend fails, return error
      return NextResponse.json({
        error: 'Failed to add to favorites',
        success: false
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in file-favorites API route:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to add to favorites',
      success: false
    }, { status: 500 });
  }
}
