'use server';

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Get the reviews data file path
const getReviewsFilePath = () => {
  return path.join(process.cwd(), 'data', 'reviews.json');
};

// Get all reviews for a specific course
export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    
    if (!courseId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Course ID is required' 
      }, { status: 400 });
    }

    // Check if the reviews file exists
    let reviews = [];
    try {
      const filePath = getReviewsFilePath();
      const fileData = await fs.readFile(filePath, 'utf8');
      reviews = JSON.parse(fileData);
    } catch (error) {
      // If file doesn't exist or can't be parsed, return empty array
      console.error('Error reading reviews file:', error);
      reviews = [];
    }

    // Filter reviews for the specified course
    const courseReviews = reviews.filter(review => review.course_id === courseId);
    
    // Return the count of reviews
    return NextResponse.json({ 
      success: true, 
      count: courseReviews.length 
    });
  } catch (error) {
    console.error('Error getting review count:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get review count' 
    }, { status: 500 });
  }
}
