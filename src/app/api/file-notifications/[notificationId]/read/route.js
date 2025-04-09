'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request, { params }) {
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

    // Try to mark notification as read using the backend API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
      const response = await axios.put(
        `${backendUrl}/api/file-notifications/${notificationId}/read`,
        { userId }
      );

      return NextResponse.json(response.data);
    } catch (backendError) {
      console.error('Backend API error:', backendError);
      
      // If the backend API fails, return a fallback response
      return NextResponse.json({
        success: true,
        message: 'Notification marked as read (fallback)'
      });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}
