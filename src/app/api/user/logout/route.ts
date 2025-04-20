import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In a real app, we would invalidate the token on the server
    // For mock, we'll just return success

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing logout request:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
