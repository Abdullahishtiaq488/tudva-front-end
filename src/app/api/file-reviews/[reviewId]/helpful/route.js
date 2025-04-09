import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// POST /api/file-reviews/[reviewId]/helpful - Mark a review as helpful
export async function POST(request, { params }) {
  try {
    const { reviewId } = params;
    const body = await request.json();
    const { userId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({
        error: 'Missing user ID',
        success: false
      }, { status: 400 });
    }

    console.log(`Marking review ${reviewId} as helpful by user ${userId}`);
    
    const response = await axios.post(
      `${getBackendUrl()}/api/file-reviews/${reviewId}/helpful`,
      { userId },
      {
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error marking review as helpful:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to mark review as helpful',
      success: false
    }, { status: error.response?.status || 500 });
  }
}

// GET /api/file-reviews/[reviewId]/helpful - Check if a user has marked a review as helpful
export async function GET(request, { params }) {
  try {
    const { reviewId } = params;
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId');

    // Validate required fields
    if (!userId) {
      return NextResponse.json({
        error: 'Missing user ID',
        success: false
      }, { status: 400 });
    }

    console.log(`Checking if user ${userId} has marked review ${reviewId} as helpful`);
    
    const response = await axios.get(
      `${getBackendUrl()}/api/file-reviews/${reviewId}/helpful?userId=${userId}`,
      {
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error checking if review is marked as helpful:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to check if review is marked as helpful',
      success: false
    }, { status: error.response?.status || 500 });
  }
}
