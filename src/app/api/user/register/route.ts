import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const reqBody = await request.json();
    console.log('Registration request received:', reqBody);

    // Validate required fields
    if (!reqBody.email || !reqBody.password || !reqBody.fullName) {
      return NextResponse.json({
        success: false,
        message: 'Email, password, and full name are required',
      }, { status: 400 });
    }

    // Check if email is already registered
    // For mock, we'll just check against a few common emails
    const existingEmails = [
      'admin@example.com',
      'instructor1@example.com',
      'instructor2@example.com',
      'learner1@example.com',
      'learner2@example.com'
    ];

    if (existingEmails.includes(reqBody.email.toLowerCase())) {
      return NextResponse.json({
        success: false,
        message: 'Email is already registered',
      }, { status: 400 });
    }

    // In a real app, we would create a new user in the database
    // For mock, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please log in.',
      user: {
        id: 'new-user-id',
        email: reqBody.email,
        fullName: reqBody.fullName,
        role: reqBody.role || 'learner'
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing registration request:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
