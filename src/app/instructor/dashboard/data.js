import { FaGem, FaTv, FaUserGraduate } from "react-icons/fa";
import { courses, users, enrollments } from '@/data/mockData';

// For chart styling
let style;
try {
  const root = document.documentElement;
  style = getComputedStyle(root);
} catch (error) {
  // Fallback for SSR
  style = {
    getPropertyValue: () => '#0d6efd' // Default primary color
  };
}
export const basicChartOpts = {
  series: [{
    name: 'Payout',
    data: [2909, 1259, 950, 1563, 1825, 2526, 2010, 3260, 3005, 3860, 4039]
  }],
  chart: {
    height: 300,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: true
  },
  stroke: {
    curve: 'smooth'
  },
  colors: [style.getPropertyValue('--bs-primary')],
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct ', 'Nov', 'Dec'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: [{
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    }
  }],
  tooltip: {
    y: {
      title: {
        formatter: function (e) {
          return "" + "$";
        }
      }
    },
    marker: {
      show: !1
    }
  }
};
// Calculate counts from our centralized mock data
const instructorId = '2'; // Assuming we're looking at instructor with ID 2
const instructorCourses = courses.filter(course => course.instructor_id === instructorId);
const totalCourses = instructorCourses.length;
const totalStudents = users.filter(user => user.role === 'learner').length;
const totalEnrollments = enrollments.filter(enrollment =>
  instructorCourses.some(course => course.id === enrollment.course_id)
).length;

export const counterData = [{
  count: totalCourses,
  title: 'Total Courses',
  icon: FaTv,
  variant: 'warning'
}, {
  count: totalStudents,
  title: 'Total Students',
  icon: FaUserGraduate,
  variant: 'purple'
}, {
  count: totalEnrollments,
  title: 'Enrolled Students',
  icon: FaGem,
  variant: 'info'
}];
