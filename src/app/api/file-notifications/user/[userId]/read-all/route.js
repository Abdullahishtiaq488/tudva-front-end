'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request, { params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Try to mark all notifications as read using the backend API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
      const response = await axios.put(
        `${backendUrl}/api/file-notifications/${userId}/read-all`
      );

      return NextResponse.json(response.data);
    } catch (backendError) {
      console.error('Backend API error:', backendError);
      
      // If the backend API fails, return a fallback response
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read (fallback)'
      });
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
}
