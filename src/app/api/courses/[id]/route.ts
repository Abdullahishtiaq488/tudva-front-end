import { NextRequest, NextResponse } from 'next/server';
import { courses as mockCourses, reviews as mockReviews } from '@/data/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;

    // Find the course by ID
    const course = mockCourses.find(c => c.id === courseId);

    if (!course) {
      return NextResponse.json({
        success: false,
        message: 'Course not found',
      }, { status: 404 });
    }

    // Get reviews for this course
    const reviews = mockReviews.filter(r => r.courseId === courseId);

    // Return the course with reviews
    return NextResponse.json({
      success: true,
      message: 'Course retrieved successfully',
      data: {
        ...course,
        reviews
      }
    }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching course:`, error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
