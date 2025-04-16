import { NextResponse } from 'next/server';
import { getToken } from '@/utils/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    // Get token for authenticated requests
    const token = await getToken();
    
    // Call the backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/lecture-schedules/${id}`, {
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
        message: data.message || 'Failed to fetch lecture schedules' 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching lecture schedules:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
