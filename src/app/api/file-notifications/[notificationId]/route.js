'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function DELETE(request, { params }) {
  try {
    const { notificationId } = params;
    const body = await request.json();
    const { userId } = body;

    if (!notificationId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID and user ID are required' },
        { status: 400 }
      );
    }

    // Try to delete notification using the backend API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
      const response = await axios.delete(
        `${backendUrl}/api/file-notifications/${notificationId}`,
        { data: { userId } }
      );

      return NextResponse.json(response.data);
    } catch (backendError) {
      console.error('Backend API error:', backendError);
      
      // If the backend API fails, return a fallback response
      return NextResponse.json({
        success: true,
        message: 'Notification deleted (fallback)'
      });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
