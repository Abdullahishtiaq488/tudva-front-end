/**
 * Centralized Mock Data
 *
 * This file contains all the mock data used in the application.
 * Components can import this data directly without any complex initialization.
 */

// Import avatar images
import avatar01 from '@/assets/images/avatar/01.jpg';
import avatar02 from '@/assets/images/avatar/02.jpg';
import avatar03 from '@/assets/images/avatar/03.jpg';
import avatar04 from '@/assets/images/avatar/04.jpg';
import avatar05 from '@/assets/images/avatar/05.jpg';
import avatar06 from '@/assets/images/avatar/06.jpg';
import avatar07 from '@/assets/images/avatar/07.jpg';
import avatar08 from '@/assets/images/avatar/08.jpg';
import avatar09 from '@/assets/images/avatar/09.jpg';
import avatar10 from '@/assets/images/avatar/10.jpg';

// Import course images
import course01 from '@/assets/images/courses/4by3/01.jpg';
import course02 from '@/assets/images/courses/4by3/02.jpg';
import course03 from '@/assets/images/courses/4by3/03.jpg';
import course04 from '@/assets/images/courses/4by3/04.jpg';
import course05 from '@/assets/images/courses/4by3/05.jpg';

// Mock users
export const users = [
  {
    id: '1',
    email: 'admin@example.com',
    fullName: 'Admin User',
    name: 'Admin User',
    password: 'password',
    role: 'admin',
    profilePicture: avatar01,
    aboutMe: 'I am the admin of this platform.',
    phoneNo: '+1234567890',
    location: 'New York, USA',
    education: [{ degree: 'MBA', institution: 'Business School' }],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: '2',
    email: 'instructor1@example.com',
    fullName: 'John Instructor',
    name: 'John Instructor',
    password: 'password',
    role: 'instructor',
    profilePicture: avatar02,
    aboutMe: 'I am an experienced instructor with expertise in web development.',
    phoneNo: '+1234567890',
    location: 'San Francisco, USA',
    education: [{ degree: 'PhD in Computer Science', institution: 'Tech University' }],
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02'
  },
  {
    id: '3',
    email: 'instructor2@example.com',
    fullName: 'Jane Instructor',
    name: 'Jane Instructor',
    password: 'password',
    role: 'instructor',
    profilePicture: avatar03,
    aboutMe: 'I specialize in data science and machine learning.',
    phoneNo: '+1234567890',
    location: 'Boston, USA',
    education: [{ degree: 'MSc in Data Science', institution: 'Data University' }],
    createdAt: '2023-01-03',
    updatedAt: '2023-01-03'
  },
  {
    id: '4',
    email: 'learner1@example.com',
    fullName: 'Alice Learner',
    name: 'Alice Learner',
    password: 'password',
    role: 'learner',
    profilePicture: avatar04,
    aboutMe: 'I am a student interested in learning new skills.',
    phoneNo: '+1234567890',
    location: 'Chicago, USA',
    education: [{ degree: 'Bachelor of Science', institution: 'University of Example' }],
    createdAt: '2023-01-04',
    updatedAt: '2023-01-04'
  },
  {
    id: '5',
    email: 'learner2@example.com',
    fullName: 'Bob Learner',
    name: 'Bob Learner',
    password: 'password',
    role: 'learner',
    profilePicture: avatar05,
    aboutMe: 'I am looking to advance my career through online courses.',
    phoneNo: '+1234567890',
    location: 'Seattle, USA',
    education: [{ degree: 'Bachelor of Arts', institution: 'Liberal Arts College' }],
    createdAt: '2023-01-05',
    updatedAt: '2023-01-05'
  }
];

// Time slots for scheduling
export const timeSlots = [
  { id: 1, time: '9:00 AM - 9:45 AM', startTime: '09:00', endTime: '09:45', label: '09:00 - 09:45 AM' },
  { id: 2, time: '9:45 AM - 10:30 AM', startTime: '09:45', endTime: '10:30', label: '09:45 - 10:30 AM' },
  { id: 3, time: '10:30 AM - 11:15 AM', startTime: '10:30', endTime: '11:15', label: '10:30 - 11:15 AM' },
  { id: 4, time: '11:15 AM - 12:00 PM', startTime: '11:15', endTime: '12:00', label: '11:15 - 12:00 PM' },
  { id: 5, time: '12:00 PM - 12:45 PM', startTime: '12:00', endTime: '12:45', label: '12:00 - 12:45 PM' },
  { id: 6, time: '12:45 PM - 1:30 PM', startTime: '12:45', endTime: '13:30', label: '12:45 - 01:30 PM' },
  { id: 7, time: '1:30 PM - 2:15 PM', startTime: '13:30', endTime: '14:15', label: '01:30 - 02:15 PM' },
  { id: 8, time: '2:15 PM - 3:00 PM', startTime: '14:15', endTime: '15:00', label: '02:15 - 03:00 PM' },
  { id: 9, time: '3:00 PM - 3:45 PM', startTime: '15:00', endTime: '15:45', label: '03:00 - 03:45 PM' },
  { id: 10, time: '3:45 PM - 4:30 PM', startTime: '15:45', endTime: '16:30', label: '03:45 - 04:30 PM' },
  { id: 11, time: '4:30 PM - 5:15 PM', startTime: '16:30', endTime: '17:15', label: '04:30 - 05:15 PM' }
];

// Mock courses
export const courses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
    short_description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
    price: 49.99,
    instructor_id: '2',
    instructor: users.find(user => user.id === '2'),
    thumbnail: course01,
    image: course01,
    studentImage: course01,
    avatar: avatar02,
    rating: 4.5,
    reviewCount: 120,
    enrollmentCount: 1500,
    duration: '10 hours',
    level: 'Beginner',
    format: 'recorded',
    courseType: 'recorded',
    language: 'English',
    category: 'Web Development',
    badge: { text: 'Beginner', class: 'bg-success' },
    icon: 'FaHtml5',
    color: '#8bc34a',
    lectures: 12,
    totalLectures: 12,
    students: 1500,
    tags: ['Web Development', 'HTML', 'CSS', 'JavaScript'],
    // Course scheduling information (from step 4 of course creation)
    scheduling: {
      day: 'monday',
      slotsPerDay: 2,
      selectedSlots: [1, 2], // Slot IDs
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), // Start from last week
      endDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(), // End in 2 months
      totalWeeks: 6,
      totalLectures: 12,
      regenerateSchedules: true
    },
    modules: [
      {
        id: 'module-1',
        title: 'HTML Fundamentals',
        lectures: [
          {
            id: 'lecture-1',
            title: 'Introduction to HTML',
            duration: '15 minutes',
            videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU'
          },
          {
            id: 'lecture-2',
            title: 'HTML Elements and Attributes',
            duration: '20 minutes',
            videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU'
          }
        ]
      },
      {
        id: 'module-2',
        title: 'CSS Basics',
        lectures: [
          {
            id: 'lecture-3',
            title: 'Introduction to CSS',
            duration: '15 minutes',
            videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU'
          },
          {
            id: 'lecture-4',
            title: 'CSS Selectors',
            duration: '20 minutes',
            videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU'
          }
        ]
      }
    ],
    faqs: [
      {
        question: 'What are the prerequisites for this course?',
        answer: 'No prior knowledge is required. This course is designed for beginners.'
      },
      {
        question: 'Will I receive a certificate upon completion?',
        answer: 'Yes, you will receive a certificate of completion once you finish all the lectures.'
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts',
    description: 'Dive deep into advanced JavaScript concepts like closures, prototypes, and async programming.',
    short_description: 'Dive deep into advanced JavaScript concepts.',
    price: 69.99,
    instructor_id: '2',
    instructor: users.find(user => user.id === '2'),
    thumbnail: course02,
    image: course02,
    studentImage: course02,
    avatar: avatar02,
    rating: 4.8,
    reviewCount: 85,
    enrollmentCount: 1200,
    duration: '12 hours',
    level: 'Intermediate',
    format: 'live',
    courseType: 'live',
    language: 'English',
    category: 'JavaScript',
    badge: { text: 'Intermediate', class: 'bg-warning' },
    icon: 'FaJs',
    color: '#ffc107',
    lectures: 15,
    totalLectures: 15,
    students: 1200,
    tags: ['JavaScript', 'Web Development', 'Programming'],
    // Course scheduling information (from step 4 of course creation)
    scheduling: {
      day: 'wednesday',
      slotsPerDay: 3,
      selectedSlots: [3, 4, 5], // Slot IDs
      startDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // Start from last week
      endDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(), // End in 1.5 months
      totalWeeks: 5,
      totalLectures: 15,
      regenerateSchedules: true
    },
    modules: [
      {
        id: 'module-1',
        title: 'JavaScript Fundamentals Review',
        lectures: [
          {
            id: 'lecture-1',
            title: 'Variables and Data Types',
            duration: '20 minutes',
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk'
          },
          {
            id: 'lecture-2',
            title: 'Functions and Scope',
            duration: '25 minutes',
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk'
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Advanced Concepts',
        lectures: [
          {
            id: 'lecture-3',
            title: 'Closures',
            duration: '30 minutes',
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk'
          },
          {
            id: 'lecture-4',
            title: 'Prototypes and Inheritance',
            duration: '35 minutes',
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk'
          }
        ]
      }
    ],
    faqs: [
      {
        question: 'What are the prerequisites for this course?',
        answer: 'Basic knowledge of JavaScript is required.'
      },
      {
        question: 'Will I receive a certificate upon completion?',
        answer: 'Yes, you will receive a certificate of completion once you finish all the lectures.'
      }
    ]
  },
  {
    id: '3',
    title: 'Data Science Fundamentals',
    description: 'Learn the basics of data science, including statistics, Python programming, and data visualization.',
    short_description: 'Learn the basics of data science.',
    price: 79.99,
    instructor_id: '3',
    instructor: users.find(user => user.id === '3'),
    thumbnail: course03,
    image: course03,
    studentImage: course03,
    avatar: avatar03,
    rating: 4.7,
    reviewCount: 95,
    enrollmentCount: 1800,
    duration: '15 hours',
    level: 'Beginner',
    format: 'recorded',
    courseType: 'recorded',
    language: 'English',
    category: 'Data Science',
    badge: { text: 'Beginner', class: 'bg-success' },
    icon: 'FaPython',
    color: '#3f51b5',
    lectures: 18,
    totalLectures: 18,
    students: 1800,
    tags: ['Data Science', 'Python', 'Statistics'],
    // Course scheduling information (from step 4 of course creation)
    scheduling: {
      day: 'friday',
      slotsPerDay: 3,
      selectedSlots: [6, 7, 8], // Slot IDs
      startDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), // Start from last week
      endDate: new Date(new Date().setDate(new Date().getDate() + 50)).toISOString(), // End in ~1.5 months
      totalWeeks: 6,
      totalLectures: 18,
      regenerateSchedules: true
    },
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Python for Data Science',
        lectures: [
          {
            id: 'lecture-1',
            title: 'Python Basics',
            duration: '25 minutes',
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw'
          },
          {
            id: 'lecture-2',
            title: 'NumPy and Pandas',
            duration: '30 minutes',
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw'
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Data Visualization',
        lectures: [
          {
            id: 'lecture-3',
            title: 'Matplotlib',
            duration: '25 minutes',
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw'
          },
          {
            id: 'lecture-4',
            title: 'Seaborn',
            duration: '30 minutes',
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw'
          }
        ]
      }
    ],
    faqs: [
      {
        question: 'What are the prerequisites for this course?',
        answer: 'No prior knowledge is required, but basic programming experience is helpful.'
      },
      {
        question: 'Will I receive a certificate upon completion?',
        answer: 'Yes, you will receive a certificate of completion once you finish all the lectures.'
      }
    ]
  }
];

// Mock reviews
export const reviews = [
  {
    id: '1',
    course_id: '1',
    user_id: '4',
    user: users.find(user => user.id === '4'),
    rating: 5,
    comment: 'Excellent course! I learned a lot and the instructor was very clear.',
    date: '2023-05-15'
  },
  {
    id: '2',
    course_id: '1',
    user_id: '5',
    user: users.find(user => user.id === '5'),
    rating: 4,
    comment: 'Good course, but could use more examples.',
    date: '2023-06-20'
  },
  {
    id: '3',
    course_id: '2',
    user_id: '4',
    user: users.find(user => user.id === '4'),
    rating: 5,
    comment: 'This course really helped me understand advanced JavaScript concepts.',
    date: '2023-07-10'
  },
  {
    id: '4',
    course_id: '3',
    user_id: '5',
    user: users.find(user => user.id === '5'),
    rating: 4,
    comment: 'Great introduction to data science. Looking forward to more advanced courses.',
    date: '2023-08-05'
  }
];

// Mock enrollments
export const enrollments = [
  {
    id: '1',
    user_id: '4',
    course_id: '1',
    enrollmentDate: '2023-05-01',
    status: 'active',
    progress: 75
  },
  {
    id: '2',
    user_id: '4',
    course_id: '2',
    enrollmentDate: '2023-06-15',
    status: 'active',
    progress: 50
  },
  {
    id: '3',
    user_id: '5',
    course_id: '1',
    enrollmentDate: '2023-05-10',
    status: 'active',
    progress: 90
  },
  {
    id: '4',
    user_id: '5',
    course_id: '3',
    enrollmentDate: '2023-07-20',
    status: 'active',
    progress: 30
  }
];

// Mock wishlist
export const wishlist = [
  {
    id: '1',
    user_id: '4',
    course_id: '3',
    addedDate: '2023-06-01'
  },
  {
    id: '2',
    user_id: '5',
    course_id: '2',
    addedDate: '2023-07-15'
  }
];

// Generate lecture schedules based on course scheduling information
const generateLectureSchedules = () => {
  const schedules = [];
  let scheduleId = 1;

  courses.forEach(course => {
    if (!course.scheduling) return;

    const { day, selectedSlots, startDate, totalLectures } = course.scheduling;
    const startDateObj = new Date(startDate);

    // Find the first occurrence of the selected day from the start date
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDayIndex = daysOfWeek.indexOf(day.toLowerCase());
    const currentDayIndex = startDateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.

    let daysToAdd = targetDayIndex - currentDayIndex;
    if (daysToAdd < 0) daysToAdd += 7;

    const firstOccurrence = new Date(startDateObj);
    firstOccurrence.setDate(startDateObj.getDate() + daysToAdd);

    // Generate schedules for each lecture
    let lectureCount = 0;
    let currentDate = new Date(firstOccurrence);

    // Get all lectures from all modules
    const allLectures = [];
    course.modules.forEach(module => {
      module.lectures.forEach(lecture => {
        allLectures.push({
          id: lecture.id,
          title: lecture.title,
          moduleName: module.title,
          durationMinutes: 45,
          isDemoLecture: allLectures.length === 0 // First lecture is demo
        });
      });
    });

    // Generate schedules for each lecture
    while (lectureCount < Math.min(totalLectures, allLectures.length)) {
      // For each selected slot on this day
      for (let i = 0; i < selectedSlots.length && lectureCount < Math.min(totalLectures, allLectures.length); i++) {
        const slotId = selectedSlots[i];
        const lecture = allLectures[lectureCount];

        schedules.push({
          id: `schedule-${scheduleId++}`,
          lecture_id: lecture.id,
          slot_id: slotId.toString(),
          scheduledDate: new Date(currentDate).toISOString(),
          isRescheduled: false,
          lecture: {
            title: lecture.title,
            moduleName: lecture.moduleName,
            durationMinutes: lecture.durationMinutes,
            isDemoLecture: lecture.isDemoLecture
          },
          course: {
            id: course.id,
            title: course.title,
            format: course.format,
            image: course.image,
            color: course.color,
            icon: course.icon
          }
        });

        lectureCount++;
      }

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }
  });

  return schedules;
};

// Mock lecture schedules
export const lectureSchedules = generateLectureSchedules();

// Export all mock data
export default {
  users,
  courses,
  reviews,
  enrollments,
  wishlist,
  lectureSchedules,
  timeSlots
};
