import { NextResponse } from 'next/server';
import { getToken } from '@/utils/auth';

export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    
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
    const response = await fetch(`${backendUrl}/api/file-booking/check/${courseId}`, {
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
        message: data.message || 'Failed to check enrollment status' 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'An error occurred while checking enrollment status' 
    }, { status: 500 });
  }
}
