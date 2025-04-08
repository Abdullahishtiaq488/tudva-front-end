import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log('Login request received');

    try {
      // Simple direct call to backend
      const backendResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001'}/api/user/login`,
        reqBody,
        { timeout: 10000 } // 10 second timeout
      );

      // If we get here, the login was successful
      const responseData = backendResponse.data;
      const token = responseData.token || '';
      const user = responseData.user || {};

      // Create a minimal response
      return NextResponse.json({
        message: "Logged In Success",
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name || user.fullName,
          role: user.role
        }
      }, { status: 200 });

    } catch (error) {
      console.error('Backend login error:', error.message);

      // Create a fallback response for testing
      return NextResponse.json({
        message: "Login failed",
        success: false,
        error: error.message || 'An unexpected error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 });
  }
}