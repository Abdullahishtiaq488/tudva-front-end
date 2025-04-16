import { NextResponse } from 'next/server';
import { getToken } from '@/utils/auth';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Schedule ID is required' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    const { newDate, newSlotId } = body;
    
    if (!newDate || !newSlotId) {
      return NextResponse.json({ 
        success: false, 
        message: 'New date and slot ID are required' 
      }, { status: 400 });
    }

    // Get token for authenticated requests
    const token = await getToken();
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }
    
    // Call the backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/file-lecture-schedules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        newDate,
        newSlotId
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Failed to reschedule lecture' 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error rescheduling lecture:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
