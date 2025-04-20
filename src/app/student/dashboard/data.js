import { FaClipboardCheck, FaMedal, FaTv } from "react-icons/fa";
import { courses, enrollments } from '@/data/mockData';

// Calculate counts from our centralized mock data
const totalCourses = courses.length;
const completedLectures = 52; // This could be calculated from enrollments if we had progress data
const totalEnrollments = enrollments.length;

export const counterData = [{
  count: totalCourses,
  title: 'Total Courses',
  icon: FaTv,
  variant: 'orange'
}, {
  count: completedLectures,
  title: 'Completed Lectures',
  icon: FaClipboardCheck,
  variant: 'purple'
}, {
  count: totalEnrollments,
  title: 'Enrolled Courses',
  icon: FaMedal,
  variant: 'success'
}];
