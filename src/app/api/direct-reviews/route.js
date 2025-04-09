import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

// Helper function to write reviews data
const writeReviewsData = (data) => {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing reviews data:', error);
    return false;
  }
};

// POST /api/direct-reviews - Create a new review
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userName, courseId, content, rating } = body;

    // Validate required fields
    if (!courseId || !content || rating === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Use default values if not provided
    const actualUserId = userId || 'anonymous_user';
    const actualUserName = userName || 'Anonymous User';

    console.log(`Creating review for course ${courseId} by user ${actualUserId} (${actualUserName})`);

    // Read existing data
    const data = readReviewsData();

    // Create new review
    const newReview = {
      id: uuidv4(),
      user_id: actualUserId,
      userName: actualUserName,
      courseId,
      content,
      rating: parseInt(rating),
      isVisible: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to reviews array
    data.reviews.push(newReview);

    // Write updated data
    if (writeReviewsData(data)) {
      return NextResponse.json({
        success: true,
        review: newReview
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to save review'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create review'
    }, { status: 500 });
  }
}

// GET /api/direct-reviews - Get all reviews
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    // Read reviews data
    const data = readReviewsData();
    
    // Filter by courseId if provided
    let reviews = data.reviews;
    if (courseId) {
      reviews = reviews.filter(review => review.courseId === courseId);
    }
    
    // Sort by date (newest first)
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedReviews = reviews.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      reviews: paginatedReviews,
      pagination: {
        page,
        limit,
        total: reviews.length,
        totalPages: Math.ceil(reviews.length / limit)
      }
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get reviews'
    }, { status: 500 });
  }
}
