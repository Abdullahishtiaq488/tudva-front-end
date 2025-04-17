import axios from 'axios';

// Helper function to get the backend URL
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001';
};

// Create a course using the direct API
export const createDirectCourse = async (courseData) => {
  try {
    console.log('Creating course with direct API:', courseData);

    // Create a complete course object with all required fields
    const completeCourse = {
      title: courseData.title,
      shortDesription: courseData.shortDesription || courseData.short_description,
      description: courseData.description || courseData.shortDesription || courseData.short_description,
      category: courseData.category,
      level: courseData.level,
      language: courseData.language,
      format: courseData.format || courseData.courseType || 'recorded',
      modulesCount: courseData.modulesCount || courseData.modules_count || 4,
      instructor_id: courseData.instructor_id,
      // Add missing fields
      color: courseData.color || '#630000', // Default red color
      icon: courseData.icon || 'FaBook', // Default book icon
      promo_video_url: courseData.promoVideoUrl || courseData.promo_video_url || '',
      estimatedDuration: courseData.estimatedDuration || '10 hours',
      totalLectures: courseData.totalLectures || courseData.modulesCount * 3 || 12,
      status: courseData.status || 'published',
      faqs: courseData.faqs || [],
      tags: courseData.tags || [],
      lectures: courseData.lectures || []
    };

    // Make the API call
    const response = await axios.post(
      `${getBackendUrl()}/api/direct-courses/create`,
      completeCourse
    );

    console.log('Direct course creation response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error creating course with direct API:', error);
    throw error;
  }
};

// Get all courses using the direct API
export const getAllDirectCourses = async () => {
  try {
    const response = await axios.get(`${getBackendUrl()}/api/direct-courses/all`);
    return response.data.courses || [];
  } catch (error) {
    console.error('Error getting courses with direct API:', error);
    return [];
  }
};
