import axios from 'axios';

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Enroll in a course
export const enrollInCourse = async (courseId, selectedSlots = null) => {
  try {
    const response = await axios.post(
      '/api/bookings',
      {
        courseId,
        selectedSlots
      },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

// Get enrolled courses for current user
export const getEnrolledCourses = async (page = 1, limit = 10, sort = 'newest', search = '') => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    queryParams.append('sort', sort);
    if (search) queryParams.append('search', search);
    
    const response = await axios.get(
      `/api/user/enrolled-courses?${queryParams.toString()}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    throw error;
  }
};

// Cancel enrollment
export const cancelEnrollment = async (bookingId) => {
  try {
    const response = await axios.delete(
      `/api/bookings/${bookingId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error canceling enrollment:', error);
    throw error;
  }
};
