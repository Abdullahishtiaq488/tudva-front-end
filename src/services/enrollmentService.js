import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with auth token
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Enrollment API functions
export const enrollmentService = {
  // Get user's enrolled courses
  getEnrolledCourses: async () => {
    try {
      // Try using the database API first
      const response = await apiClient.get('/bookings/user');
      return response.data;
    } catch (error) {
      // Fall back to file-based API if database fails
      try {
        const fallbackResponse = await apiClient.get('/file-booking/user');
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Error fetching enrolled courses:', fallbackError);

        // Return empty data instead of throwing error
        // This prevents UI errors when authentication fails
        return {
          success: true,
          bookings: [],
          message: 'No enrolled courses found or not authenticated'
        };
      }
    }
  },

  // Enroll in a course
  enrollInCourse: async (courseId, selectedSlots = null) => {
    if (!courseId) {
      console.error('Missing courseId in enrollInCourse');
      return { success: false, error: 'Course ID is required' };
    }

    // If no slots are provided, we'll use the default schedule from the course
    // This simplifies the enrollment process
    console.log(`Enrolling in course ${courseId} with slots:`, selectedSlots || 'default schedule');

    try {
      // Try using the database API first
      console.log('Attempting enrollment with database API...');
      const response = await apiClient.post('/bookings', {
        courseId,
        selectedSlots
      });
      console.log('Database API enrollment successful:', response.data);
      return response.data;
    } catch (error) {
      console.warn('Database API enrollment failed, trying file-based API...', error.message);

      // Fall back to file-based API if database fails
      try {
        console.log('Attempting enrollment with file-based API...');
        const fallbackResponse = await apiClient.post('/file-booking/create', {
          courseId,
          selectedSlots
        });
        console.log('File-based API enrollment successful:', fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Error enrolling in course (both APIs failed):', fallbackError);

        // Return a structured error response instead of throwing
        return {
          success: false,
          error: fallbackError.response?.data?.error || fallbackError.message || 'Failed to enroll in course'
        };
      }
    }
  },

  // Cancel enrollment
  cancelEnrollment: async (bookingId) => {
    try {
      // Try using the database API first
      const response = await apiClient.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      // Fall back to file-based API if database fails
      try {
        const fallbackResponse = await apiClient.post(`/file-booking/cancel/${bookingId}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Error cancelling enrollment:', fallbackError);

        // Return a structured error response instead of throwing
        return {
          success: false,
          error: fallbackError.response?.data?.error || fallbackError.message || 'Failed to cancel enrollment'
        };
      }
    }
  },

  // Reschedule a booking
  rescheduleBooking: async (bookingId, newSeminarDayId, newSlotIds, newScheduledDate) => {
    if (!bookingId || !newSeminarDayId || !newSlotIds || !newScheduledDate) {
      console.error('Missing required parameters in rescheduleBooking');
      return {
        success: false,
        error: 'Booking ID, seminar day, slot IDs, and scheduled date are all required'
      };
    }

    console.log(`Rescheduling booking ${bookingId} to day ${newSeminarDayId}, slots:`, newSlotIds, 'date:', newScheduledDate);

    try {
      // Try using the database API first
      console.log('Attempting reschedule with database API...');
      const response = await apiClient.post(`/bookings/reschedule/${bookingId}`, {
        newSeminarDayId,
        newSlotIds,
        newScheduledDate
      });
      console.log('Database API reschedule successful:', response.data);
      return response.data;
    } catch (error) {
      console.warn('Database API reschedule failed, trying file-based API...', error.message);

      // Fall back to file-based API if database fails
      try {
        console.log('Attempting reschedule with file-based API...');
        const fallbackResponse = await apiClient.post(`/file-booking/reschedule/${bookingId}`, {
          newSeminarDayId,
          newSlotIds,
          newScheduledDate
        });
        console.log('File-based API reschedule successful:', fallbackResponse.data);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Error rescheduling booking (both APIs failed):', fallbackError);

        // Return a structured error response instead of throwing
        return {
          success: false,
          error: fallbackError.response?.data?.error || fallbackError.message || 'Failed to reschedule booking'
        };
      }
    }
  },

  // Check for day-level conflicts
  checkConflicts: async (courseId, seminarDayId) => {
    try {
      // Try using the database API first
      const response = await apiClient.post('/bookings/check-conflicts', {
        courseId,
        seminarDayId
      });
      return response.data;
    } catch (error) {
      // Fall back to file-based API if database fails
      try {
        const fallbackResponse = await apiClient.post('/file-booking/check-conflicts', {
          courseId,
          seminarDayId
        });
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Error checking conflicts:', fallbackError);

        // Return a structured error response instead of throwing
        // Default to no conflicts when authentication fails
        return {
          success: true,
          hasConflicts: false,
          conflicts: [],
          message: 'Unable to check for conflicts due to authentication issues'
        };
      }
    }
  }
};

// Lecture Access API functions
export const lectureAccessService = {
  // Check if a lecture is accessible
  checkLectureAccess: async (lectureId) => {
    try {
      // Try using the database API first
      const response = await apiClient.get(`/lecture-access/check/${lectureId}`);
      return response.data;
    } catch (error) {
      // Fall back to file-based API if database fails
      try {
        const fallbackResponse = await apiClient.get(`/file-lecture-access/check/${lectureId}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Error checking lecture access:', fallbackError);

        // Return a structured error response instead of throwing
        // Default to not accessible when authentication fails
        return {
          success: true,
          isAccessible: false,
          message: 'Unable to check lecture access due to authentication issues'
        };
      }
    }
  },

  // Record lecture access
  recordLectureAccess: async (lectureId) => {
    try {
      // Try using the database API first
      const response = await apiClient.post(`/lecture-access/record/${lectureId}`);
      return response.data;
    } catch (error) {
      // Fall back to file-based API if database fails
      try {
        const fallbackResponse = await apiClient.post(`/file-lecture-access/record/${lectureId}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Error recording lecture access:', fallbackError);

        // Return a structured error response instead of throwing
        return {
          success: false,
          error: fallbackError.response?.data?.error || fallbackError.message || 'Failed to record lecture access',
          message: 'Unable to record lecture access due to authentication issues'
        };
      }
    }
  }
};

// Helper functions
export const formatTimeRemaining = (milliseconds) => {
  if (milliseconds <= 0) return 'Available now';

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

// Get current week dates
export const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust when Sunday

  const monday = new Date(today.setDate(diff));

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    weekDates.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      label: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
      dayOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][i],
    });
  }

  return weekDates;
};
