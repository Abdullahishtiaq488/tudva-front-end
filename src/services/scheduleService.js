// Simple schedule service using mock data directly
import { lectureSchedules, enrollments } from '../data/mockData';
import authService from './authService';

class ScheduleService {
  // Get all lecture schedules for the current user
  getLectureSchedules() {
    const currentUser = authService.getUser();
    if (!currentUser) {
      console.log('No user logged in, cannot get lecture schedules');
      return [];
    }
    
    // Get enrolled courses for the current user
    const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);
    const enrolledCourseIds = userEnrollments.map(e => e.courseId);
    
    // Filter lecture schedules for enrolled courses
    const userSchedules = lectureSchedules.filter(schedule => 
      enrolledCourseIds.includes(schedule.course.id)
    );
    
    // Distribute schedules across the week
    const today = new Date();
    const distributedSchedules = userSchedules.map((schedule, index) => {
      const lectureDate = new Date(today);
      lectureDate.setDate(today.getDate() - 3 + index); // Distribute across the week
      
      return {
        ...schedule,
        scheduledDate: lectureDate.toISOString()
      };
    });
    
    return distributedSchedules;
  }
  
  // Reschedule a lecture
  rescheduleBooking(scheduleId, dayOfWeek, slotIds, scheduledDate) {
    // Find the schedule to update
    const scheduleIndex = lectureSchedules.findIndex(s => s.id === scheduleId);
    if (scheduleIndex === -1) {
      return {
        success: false,
        message: 'Schedule not found'
      };
    }
    
    // Check if the course is recorded (only recorded courses can be rescheduled)
    if (lectureSchedules[scheduleIndex].course.format !== 'recorded') {
      return {
        success: false,
        message: 'Live courses cannot be rescheduled'
      };
    }
    
    // Check if the lecture is a demo lecture (demo lectures cannot be rescheduled)
    if (lectureSchedules[scheduleIndex].lecture.isDemoLecture) {
      return {
        success: false,
        message: 'Demo lectures cannot be rescheduled'
      };
    }
    
    // Update the schedule
    const updatedSchedule = {
      ...lectureSchedules[scheduleIndex],
      scheduledDate: scheduledDate,
      slot_id: slotIds[0].toString(),
      isRescheduled: true
    };
    
    // In a real app, we would update the database
    // For mock, we'll just return success
    return {
      success: true,
      message: 'Lecture rescheduled successfully',
      schedule: updatedSchedule
    };
  }
}

export default new ScheduleService();
