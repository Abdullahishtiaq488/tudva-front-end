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
    console.log('Login request received at /api/user/login with:', { email });

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required',
      }, { status: 400 });
    }

    // For mock system, hardcode the password check
    // In a real system, this would be handled by the backend
    if (password !== 'password') {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
      }, { status: 401 });
    }

    // Find user by email from mock data
    try {
      // For simplicity, we'll use a hardcoded list of users
      const mockUsers = [
        {
          id: '1',
          email: 'admin@example.com',
          fullName: 'Admin User',
          role: 'admin',
          profilePicture: '/assets/images/avatar/01.jpg'
        },
        {
          id: '2',
          email: 'instructor1@example.com',
          fullName: 'John Instructor',
          role: 'instructor',
          profilePicture: '/assets/images/avatar/02.jpg'
        },
        {
          id: '3',
          email: 'instructor2@example.com',
          fullName: 'Jane Instructor',
          role: 'instructor',
          profilePicture: '/assets/images/avatar/03.jpg'
        },
        {
          id: '4',
          email: 'learner1@example.com',
          fullName: 'Alice Learner',
          role: 'learner',
          profilePicture: '/assets/images/avatar/04.jpg'
        },
        {
          id: '5',
          email: 'learner2@example.com',
          fullName: 'Bob Learner',
          role: 'learner',
          profilePicture: '/assets/images/avatar/05.jpg'
        }
      ];

      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'Invalid email or password',
        }, { status: 401 });
      }

      // Generate a token
      const token = `mock_token_${user.id}_${Date.now()}`;

      // Return success response with the structure expected by the frontend
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: user,
        token: token
      }, { status: 200 });
    } catch (error) {
      console.error('Login error:', error);
      return NextResponse.json({
        success: false,
        message: 'An unexpected error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing login request:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
