import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: 'Authorization header is required',
      }, { status: 401 });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');

    // In a real app, we would validate the token
    // For mock, we'll just return a hardcoded user
    const mockUser = {
      id: '2',
      email: 'instructor1@example.com',
      fullName: 'John Instructor',
      role: 'instructor',
      profilePicture: '/assets/images/avatar/02.jpg'
    };

    // Return user profile
    return NextResponse.json({
      success: true,
      message: 'User profile retrieved successfully',
      user: mockUser
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing profile request:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: 'Authorization header is required',
      }, { status: 401 });
    }

    // Parse request body
    const updates = await request.json();

    // In a real app, we would update the user in the database
    // For mock, we'll just return the updated user
    const updatedUser = {
      id: '2',
      email: 'instructor1@example.com',
      fullName: updates.fullName || 'John Instructor',
      role: 'instructor',
      profilePicture: updates.profilePicture || '/assets/images/avatar/02.jpg',
      aboutMe: updates.aboutMe || 'Experienced instructor with 10+ years in web development.'
    };

    // Return updated user
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing profile update request:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
