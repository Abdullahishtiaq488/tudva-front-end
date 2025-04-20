// Simple course service using mock data directly
import { courses, reviews, enrollments, wishlist } from '../data/mockData';
import authService from './authService';

class CourseService {
  // Get all courses
  getAllCourses() {
    console.log('Fetching all courses from mock data');
    return courses;
  }
  
  // Get course by ID
  getCourseById(id) {
    console.log(`Fetching course with ID: ${id} from mock data`);
    
    const course = courses.find(c => c.id === id);
    
    if (!course) {
      console.error(`Course with ID ${id} not found`);
      return null;
    }
    
    // Get reviews for this course
    const courseReviews = reviews.filter(r => r.courseId === id);
    
    return {
      ...course,
      reviews: courseReviews
    };
  }
  
  // Get courses by instructor
  getCoursesByInstructor(instructorId) {
    console.log(`Fetching courses for instructor: ${instructorId} from mock data`);
    
    const instructorCourses = courses.filter(c => c.instructor.id === instructorId);
    
    return instructorCourses;
  }
  
  // Get enrolled courses for current user
  getEnrolledCourses() {
    const currentUser = authService.getUser();
    if (!currentUser) {
      console.log('No user logged in, cannot get enrolled courses');
      return [];
    }
    
    console.log(`Fetching enrolled courses for user: ${currentUser.id} from mock data`);
    
    const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);
    
    // Map enrollments to courses with enrollment data
    return userEnrollments.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      if (!course) return null;
      
      return {
        ...course,
        enrollmentId: enrollment.id,
        enrollmentDate: enrollment.enrollmentDate,
        progress: enrollment.progress,
        completionStatus: enrollment.completionStatus
      };
    }).filter(Boolean); // Remove null entries
  }
  
  // Get wishlist for current user
  getWishlist() {
    const currentUser = authService.getUser();
    if (!currentUser) {
      console.log('No user logged in, cannot get wishlist');
      return [];
    }
    
    console.log(`Fetching wishlist for user: ${currentUser.id} from mock data`);
    
    const userWishlist = wishlist.filter(w => w.userId === currentUser.id);
    
    // Map wishlist to courses with wishlist data
    return userWishlist.map(item => {
      const course = courses.find(c => c.id === item.courseId);
      if (!course) return null;
      
      return {
        ...course,
        wishlistId: item.id,
        addedDate: item.addedDate
      };
    }).filter(Boolean); // Remove null entries
  }
  
  // Add course to wishlist
  addToWishlist(courseId) {
    const currentUser = authService.getUser();
    if (!currentUser) {
      console.log('No user logged in, cannot add to wishlist');
      return {
        success: false,
        message: 'You must be logged in to add courses to your wishlist'
      };
    }
    
    // Check if course exists
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      console.error(`Course with ID ${courseId} not found`);
      return {
        success: false,
        message: 'Course not found'
      };
    }
    
    // Check if already in wishlist
    const existingItem = wishlist.find(w => w.userId === currentUser.id && w.courseId === courseId);
    if (existingItem) {
      console.log(`Course ${courseId} already in wishlist`);
      return {
        success: true,
        message: 'Course is already in your wishlist'
      };
    }
    
    // In a real app, we would add to the database
    // For mock, we'll just log it
    console.log(`Added course ${courseId} to wishlist for user ${currentUser.id}`);
    
    return {
      success: true,
      message: 'Course added to wishlist'
    };
  }
  
  // Remove course from wishlist
  removeFromWishlist(courseId) {
    const currentUser = authService.getUser();
    if (!currentUser) {
      console.log('No user logged in, cannot remove from wishlist');
      return {
        success: false,
        message: 'You must be logged in to manage your wishlist'
      };
    }
    
    // In a real app, we would remove from the database
    // For mock, we'll just log it
    console.log(`Removed course ${courseId} from wishlist for user ${currentUser.id}`);
    
    return {
      success: true,
      message: 'Course removed from wishlist'
    };
  }
  
  // Enroll in a course
  enrollInCourse(courseId) {
    const currentUser = authService.getUser();
    if (!currentUser) {
      console.log('No user logged in, cannot enroll in course');
      return {
        success: false,
        message: 'You must be logged in to enroll in courses'
      };
    }
    
    // Check if course exists
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      console.error(`Course with ID ${courseId} not found`);
      return {
        success: false,
        message: 'Course not found'
      };
    }
    
    // Check if already enrolled
    const existingEnrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId);
    if (existingEnrollment) {
      console.log(`User ${currentUser.id} already enrolled in course ${courseId}`);
      return {
        success: true,
        message: 'You are already enrolled in this course'
      };
    }
    
    // In a real app, we would add to the database
    // For mock, we'll just log it
    console.log(`Enrolled user ${currentUser.id} in course ${courseId}`);
    
    return {
      success: true,
      message: 'Successfully enrolled in course'
    };
  }
}

export default new CourseService();
