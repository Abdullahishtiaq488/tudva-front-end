import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header is required',
        success: false
      }, { status: 401 });
    }

    // Forward the request to the backend
    try {
      const backendResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001'}/api/user/profile`,
        {
          headers: {
            'Authorization': authHeader
          },
          timeout: 5000 // 5 second timeout
        }
      );

      // Return the backend response
      return NextResponse.json(backendResponse.data, { status: 200 });
    } catch (error: any) {
      console.error('Error fetching user profile from backend:', error.message);
      return NextResponse.json({
        error: error.message || 'Failed to fetch user profile',
        success: false
      }, { status: error.response?.status || 500 });
    }
  } catch (error: any) {
    console.error('Error in profile API route:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the request body
    const reqBody = await request.json();
    
    // Get the token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header is required',
        success: false
      }, { status: 401 });
    }

    // Forward the request to the backend
    try {
      const backendResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001'}/api/user/profile`,
        reqBody,
        {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Return the backend response
      return NextResponse.json(backendResponse.data, { status: 200 });
    } catch (error: any) {
      console.error('Error updating user profile on backend:', error.message);
      return NextResponse.json({
        error: error.message || 'Failed to update user profile',
        success: false
      }, { status: error.response?.status || 500 });
    }
  } catch (error: any) {
    console.error('Error in profile update API route:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 });
  }
}
