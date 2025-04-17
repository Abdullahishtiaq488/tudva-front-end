/**
 * Utility functions for syncing data between the database and file-based storage
 */

import axiosInstance from './axiosInstance';

/**
 * Sync all courses from the database to file-based storage
 * @returns {Promise<Object>} The result of the sync operation
 */
export const syncAllCourses = async () => {
  try {
    const response = await axiosInstance.post('/api/sync/courses');
    return response.data;
  } catch (error) {
    console.error('Error syncing courses:', error);
    throw error;
  }
};

/**
 * Sync a specific course from the database to file-based storage
 * @param {string} courseId The ID of the course to sync
 * @returns {Promise<Object>} The result of the sync operation
 */
export const syncCourse = async (courseId) => {
  try {
    const response = await axiosInstance.post(`/api/sync/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error syncing course ${courseId}:`, error);
    throw error;
  }
};
