import { NextRequest, NextResponse } from 'next/server';
import ensureMockSystemInitialized from '../../mock-init';
import { authService } from '@/mocks/services';
import { ApiError } from '@/mocks/utils/errors';

export async function POST(request: NextRequest) {
  try {
    // Initialize mock system
    ensureMockSystemInitialized();

    // Parse request body
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log('Login request received');

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    // Attempt login
    try {
      const response = await authService.login(email, password);

      // Return success response with the same structure as before
      return NextResponse.json({
        message: "Logged In Success",
        success: true,
        data: response.data?.user
      }, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({
          message: "Login failed",
          success: false,
          error: error.message
        }, { status: error.status });
      }

      // Handle unexpected errors
      console.error('Login error:', error);
      return NextResponse.json({
        message: "Login failed",
        success: false,
        error: 'An unexpected error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing login request:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 });
  }
}