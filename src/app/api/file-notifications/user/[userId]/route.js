'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Try to get notifications using the backend API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
      const response = await axios.get(
        `${backendUrl}/api/file-notifications/user/${userId}?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`
      );

      return NextResponse.json(response.data);
    } catch (backendError) {
      console.error('Backend API error:', backendError);
      
      // If the backend API fails, return a fallback response
      return NextResponse.json({
        success: true,
        message: 'Notifications retrieved from fallback (backend unavailable)',
        notifications: [],
        unreadCount: 0,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }
  } catch (error) {
    console.error('Error getting notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get notifications' },
      { status: 500 }
    );
  }
}
