import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// POST /api/file-reviews - Create a new review
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userName, courseId, content, rating } = body;

    // Validate required fields
    if (!courseId || !content || !rating) {
      return NextResponse.json({
        error: 'Missing required fields',
        success: false
      }, { status: 400 });
    }

    // Use 'anonymous_user' if userId is not provided
    const actualUserId = userId || 'anonymous_user';
    const actualUserName = userName || 'Anonymous User';

    console.log(`Creating review for course ${courseId} by user ${actualUserId} (${actualUserName})`);

    const response = await axios.post(
      `${getBackendUrl()}/api/file-reviews`,
      { userId: actualUserId, userName: actualUserName, courseId, content, rating },
      {
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to create review',
      success: false
    }, { status: error.response?.status || 500 });
  }
}
