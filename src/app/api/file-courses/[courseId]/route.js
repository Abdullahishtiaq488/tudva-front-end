import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// GET /api/file-courses/[courseId] - Get course by ID
export async function GET(request, { params }) {
  const courseId = params.courseId;
  
  try {
    console.log(`Fetching course with ID ${courseId} from file-based API`);
    
    // Try to get the course from the backend first
    try {
      const backendResponse = await axios.get(
        `${getBackendUrl()}/api/file-courses/${courseId}`,
        { timeout: 5000 }
      );
      
      if (backendResponse.data && backendResponse.data.course) {
        console.log('Successfully fetched course from backend file API');
        return NextResponse.json(backendResponse.data);
      }
    } catch (backendError) {
      console.warn(`Error fetching course from backend file API: ${backendError.message}`);
    }
    
    // If backend fails, try to get all courses and find the one with matching ID
    try {
      const allCoursesResponse = await axios.get(
        `${getBackendUrl()}/api/file-courses/all`,
        { timeout: 5000 }
      );
      
      if (allCoursesResponse.data && Array.isArray(allCoursesResponse.data)) {
        const course = allCoursesResponse.data.find(c => c.id === courseId);
        
        if (course) {
          console.log('Found course in all courses from file API');
          return NextResponse.json({
            success: true,
            course
          });
        }
      }
    } catch (allCoursesError) {
      console.warn(`Error fetching all courses from file API: ${allCoursesError.message}`);
    }
    
    // If all backend attempts fail, try to get courses from localStorage on client side
    return NextResponse.json({
      success: false,
      error: 'Course not found in file-based API',
      fallbackToLocalStorage: true
    });
  } catch (error) {
    console.error(`Error in file-courses API route: ${error.message}`);
    return NextResponse.json({
      error: error.message || 'Failed to fetch course',
      success: false
    }, { status: 500 });
  }
}
