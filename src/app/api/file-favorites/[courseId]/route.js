import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAuthTokenFromRequest } from '@/utils/authUtils';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/file-favorites/[courseId] - Check if a course is in favorites
export async function GET(request, { params }) {
  try {
    const courseId = params.courseId;
    
    // Get auth token from request
    const token = getAuthTokenFromRequest(request);
    const userId = request.headers.get('X-User-Id');
    
    if (!token && !userId) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false,
        isFavorite: false
      }, { status: 401 });
    }

    // Try to check if course is in favorites using the backend
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const backendResponse = await axios.get(
        `${getBackendUrl()}/api/file-favorites${userId ? `/${userId}/check/${courseId}` : `/${courseId}`}`,
        {
          headers,
          timeout: 5000 // 5 second timeout
        }
      );

      return NextResponse.json({
        success: true,
        isFavorite: backendResponse.data.isFavorite || false
      });
    } catch (backendError) {
      console.warn(`Error checking favorite status from backend: ${backendError.message}`);
      
      // If backend fails, return false
      return NextResponse.json({
        success: true,
        isFavorite: false
      });
    }
  } catch (error) {
    console.error('Error in file-favorites API route:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to check favorite status',
      success: false,
      isFavorite: false
    }, { status: 500 });
  }
}

// DELETE /api/file-favorites/[courseId] - Remove a course from favorites
export async function DELETE(request, { params }) {
  try {
    const courseId = params.courseId;
    
    // Get auth token from request
    const token = getAuthTokenFromRequest(request);
    const userId = request.headers.get('X-User-Id');
    
    if (!token && !userId) {
      return NextResponse.json({
        error: 'Authentication required',
        success: false
      }, { status: 401 });
    }

    // Try to remove from favorites using the backend
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const backendResponse = await axios.delete(
        `${getBackendUrl()}/api/file-favorites${userId ? `/${userId}/remove/${courseId}` : `/${courseId}`}`,
        {
          headers,
          timeout: 5000 // 5 second timeout
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Course removed from favorites',
        ...backendResponse.data
      });
    } catch (backendError) {
      console.warn(`Error removing from favorites from backend: ${backendError.message}`);
      
      // If backend fails, return error
      return NextResponse.json({
        error: 'Failed to remove from favorites',
        success: false
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in file-favorites API route:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to remove from favorites',
      success: false
    }, { status: 500 });
  }
}
