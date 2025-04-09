import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// PUT /api/file-reviews/[reviewId] - Update a review
export async function PUT(request, { params }) {
  try {
    const { reviewId } = params;
    const body = await request.json();
    const { userId, content, rating, isAdmin } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({
        error: 'Missing user ID',
        success: false
      }, { status: 400 });
    }

    console.log(`Updating review ${reviewId} by user ${userId}`);
    
    const data = {};
    if (content !== undefined) data.content = content;
    if (rating !== undefined) data.rating = rating;
    if (isAdmin !== undefined) data.isAdmin = isAdmin;
    
    const response = await axios.put(
      `${getBackendUrl()}/api/file-reviews/${reviewId}`,
      { userId, ...data },
      {
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error updating review:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to update review',
      success: false
    }, { status: error.response?.status || 500 });
  }
}

// DELETE /api/file-reviews/[reviewId] - Delete a review
export async function DELETE(request, { params }) {
  try {
    const { reviewId } = params;
    const body = await request.json();
    const { userId, isAdmin } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({
        error: 'Missing user ID',
        success: false
      }, { status: 400 });
    }

    console.log(`Deleting review ${reviewId} by user ${userId}`);
    
    const response = await axios.delete(
      `${getBackendUrl()}/api/file-reviews/${reviewId}`,
      {
        data: { userId, isAdmin },
        timeout: 5000 // 5 second timeout
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error deleting review:', error.message);
    return NextResponse.json({
      error: error.message || 'Failed to delete review',
      success: false
    }, { status: error.response?.status || 500 });
  }
}
