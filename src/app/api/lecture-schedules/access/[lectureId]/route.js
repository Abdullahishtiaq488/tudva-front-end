import { NextResponse } from 'next/server';
import { getToken } from '@/utils/auth';

export async function GET(request, { params }) {
  try {
    const { lectureId } = params;
    
    if (!lectureId) {
      return NextResponse.json({ success: false, message: 'Lecture ID is required' }, { status: 400 });
    }

    // Get token for authenticated requests
    const token = await getToken();
    
    // Call the backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/lecture-schedules/access/${lectureId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Failed to check lecture accessibility' 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking lecture accessibility:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
