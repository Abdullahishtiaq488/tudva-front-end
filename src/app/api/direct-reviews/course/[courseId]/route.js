import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the reviews data file (in the public directory for persistence)
const dataFilePath = path.join(process.cwd(), 'public', 'data', 'reviews.json');

// Helper function to read reviews data
const readReviewsData = () => {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create file if it doesn't exist
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({ reviews: [] }));
      return { reviews: [] };
    }

    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reviews data:', error);
    return { reviews: [] };
  }
};

// GET /api/direct-reviews/course/[courseId] - Get reviews for a course
export async function GET(request, { params }) {
  try {
    const courseId = params.courseId;
    const { searchParams } = new URL(request.url);
    
    if (!courseId) {
      return NextResponse.json({
        success: false,
        error: 'Course ID is required'
      }, { status: 400 });
    }
    
    // Read reviews data
    const data = readReviewsData();
    
    // Filter reviews by courseId
    const courseReviews = data.reviews.filter(review => review.courseId === courseId);
    
    // Sort by date (newest first)
    courseReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedReviews = courseReviews.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      reviews: paginatedReviews,
      pagination: {
        page,
        limit,
        total: courseReviews.length,
        totalPages: Math.ceil(courseReviews.length / limit)
      }
    });
  } catch (error) {
    console.error('Error getting reviews for course:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get reviews for course'
    }, { status: 500 });
  }
}
