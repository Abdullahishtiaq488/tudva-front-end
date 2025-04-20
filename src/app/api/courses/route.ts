import { NextRequest, NextResponse } from 'next/server';
import { courses as mockCourses } from '@/data/mockData';

export async function GET(request: NextRequest) {
  try {
    // In a real app, we would fetch courses from a database
    // For mock, we'll just return the hardcoded courses

    return NextResponse.json({
      success: true,
      message: 'Courses retrieved successfully',
      data: mockCourses
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
