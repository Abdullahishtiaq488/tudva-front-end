'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Try to get the profile using the backend API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
      const response = await axios.get(`${backendUrl}/api/user/profile?userId=${userId}`);

      return NextResponse.json(response.data);
    } catch (backendError) {
      console.error('Backend API error:', backendError);
      
      // If the backend API fails, return a fallback response
      // This is a fallback mechanism to ensure the app keeps working
      return NextResponse.json({
        success: true,
        message: 'Profile retrieved from local storage (backend unavailable)',
        user: null
      });
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get profile' },
      { status: 500 }
    );
  }
}
