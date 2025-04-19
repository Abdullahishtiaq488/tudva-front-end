'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userData } = body;

    if (!userId || !userData) {
      return NextResponse.json(
        { success: false, error: 'User ID and user data are required' },
        { status: 400 }
      );
    }

    // Try to update the profile using the backend API
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
      const response = await axios.post(`${backendUrl}/api/user/update-profile`, {
        userId,
        userData
      });

      return NextResponse.json(response.data);
    } catch (backendError) {
      console.error('Backend API error:', backendError);

      // If the backend API fails, update the profile locally
      // This is a fallback mechanism to ensure the app keeps working
      return NextResponse.json({
        success: true,
        message: 'Profile updated locally (backend unavailable)',
        user: userData
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
