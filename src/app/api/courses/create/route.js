import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// POST /api/courses/create - Create a new course
export async function POST(request) {
  // Get the authorization header from the request
  let authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    // Try to get token from localStorage as fallback (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
    }

    // If still no auth header, return error
    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header is required',
        success: false
      }, { status: 401 });
    }
  }

  // Make sure the token is properly formatted
  if (!authHeader.startsWith('Bearer ')) {
    authHeader = `Bearer ${authHeader}`;
  }

  console.log('Using auth header:', authHeader);

  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'shortDesription', 'category', 'level', 'language', 'modulesCount', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          error: `${field} is required`,
          success: false
        }, { status: 400 });
      }
    }

    console.log('Sending course data to backend:', JSON.stringify(body, null, 2));

    // Make request to backend
    console.log(`Sending request to ${getBackendUrl()}/api/courses`);

    // Create a complete payload with all necessary fields
    const completeBody = {
      title: body.title,
      shortDesription: body.shortDesription,
      description: body.description,
      category: body.category,
      level: body.level,
      language: body.language,
      modulesCount: body.modulesCount,
      format: body.format || 'recorded',
      color: body.color || '#630000',
      icon: body.icon || 'FaBook',
      promoVideoUrl: body.promoVideoUrl || '',
      estimatedDuration: body.estimatedDuration || body.modulesCount * 45, // 45 minutes per module
      totalLectures: body.totalLectures || body.modulesCount * 3 // Assume 3 lectures per module
    };

    // Add modules and lectures if they exist
    if (body.modules && Array.isArray(body.modules)) {
      completeBody.modules = body.modules;
    }

    if (body.lectures && Array.isArray(body.lectures)) {
      completeBody.lectures = body.lectures;
    }

    // Add FAQs and tags if they exist
    if (body.faqs && Array.isArray(body.faqs)) {
      completeBody.faqs = body.faqs;
    }

    if (body.tags && Array.isArray(body.tags)) {
      completeBody.tags = body.tags;
    }

    console.log('Complete request body:', JSON.stringify(completeBody, null, 2));

    // Simplify the auth header to avoid issues
    const simpleAuthHeader = authHeader.startsWith('Bearer ') ?
      authHeader.substring(0, 100) : // Limit token length
      `Bearer ${authHeader.substring(0, 100)}`;

    console.log('Using auth header:', simpleAuthHeader);

    const backendResponse = await axios.post(
      `${getBackendUrl()}/api/courses`,
      completeBody,
      {
        headers: {
          'Authorization': simpleAuthHeader,
          'Content-Type': 'application/json'
        },
        timeout: 15000, // Increase timeout to 15 seconds
        maxContentLength: 5 * 1024 * 1024, // 5MB max content length
        maxBodyLength: 5 * 1024 * 1024 // 5MB max body length
      }
    );

    console.log('Backend response:', backendResponse.data);

    return NextResponse.json(backendResponse.data, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error.message);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    return NextResponse.json({
      error: error.response?.data?.message || error.message || 'Failed to create course',
      success: false
    }, { status: error.response?.status || 500 });
  }
}
