/**
 * Checks if a lecture is accessible based on its schedule and course type
 * @param {string} lectureId - The ID of the lecture to check
 * @returns {Promise<{isAccessible: boolean, message: string, lecture: object, course: object}>} - Access information
 */
export const checkLectureAccessibility = async (lectureId) => {
  if (!lectureId) {
    return {
      isAccessible: false,
      message: 'Lecture ID is required',
      lecture: null,
      course: null
    };
  }

  try {
    // Try file-based API first
    let response = await fetch(`/api/file-lecture-schedules/access/${lectureId}`);
    
    // If file-based API fails, try database API
    if (!response.ok) {
      response = await fetch(`/api/lecture-schedules/access/${lectureId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check lecture accessibility');
      }
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to check lecture accessibility');
    }
    
    return {
      isAccessible: data.isAccessible,
      message: data.isAccessible ? 'Lecture is accessible' : 'Lecture is not yet available',
      lecture: data.lecture || null,
      course: data.course || null
    };
  } catch (error) {
    console.error('Error checking lecture accessibility:', error);
    
    // Default to accessible for demo purposes if API fails
    return {
      isAccessible: true,
      message: 'Lecture accessibility check failed, defaulting to accessible',
      lecture: null,
      course: null
    };
  }
};

/**
 * Determines if a lecture is accessible based on its schedule data
 * @param {object} schedule - The lecture schedule object
 * @param {string} courseType - The course type ('live' or 'recorded')
 * @returns {boolean} - Whether the lecture is accessible
 */
export const isLectureAccessible = (schedule, courseType) => {
  if (!schedule) return false;
  
  // Demo lectures are always accessible
  if (schedule.lecture?.isDemoLecture) return true;
  
  const currentDate = new Date();
  
  // For recorded courses, lectures become accessible after their scheduled date
  if (courseType === 'recorded') {
    return new Date(schedule.scheduledDate) <= currentDate;
  }
  
  // For live courses, lectures are only accessible on their scheduled date
  if (courseType === 'live') {
    const scheduleDate = new Date(schedule.scheduledDate);
    
    return (
      scheduleDate.getDate() === currentDate.getDate() &&
      scheduleDate.getMonth() === currentDate.getMonth() &&
      scheduleDate.getFullYear() === currentDate.getFullYear()
    );
  }
  
  return false;
};
