import { NextResponse } from 'next/server';
import { getToken } from '@/utils/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { courseId, selectedSlots } = body;
    
    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    // Get token for authenticated requests
    const token = await getToken();
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    
    // Call the backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId,
        selectedSlots
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Failed to enroll in course' 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'An error occurred while enrolling in course' 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    // Get token for authenticated requests
    const token = await getToken();
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }
    
    // Call the backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/bookings/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Failed to fetch enrollments' 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'An error occurred while fetching enrollments' 
    }, { status: 500 });
  }
}
