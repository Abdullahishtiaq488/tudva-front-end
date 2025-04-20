/**
 * Mock Course Data
 * 
 * This file provides mock data for courses.
 */

export interface Course {
  id: string;
  title: string;
  short_description?: string;
  description?: string;
  format: 'live' | 'recorded';
  courseType: 'live' | 'recorded';
  category?: string;
  level?: string;
  language?: string;
  modules_count?: number;
  estimatedDuration?: number;
  totalLectures?: number;
  color?: string;
  icon?: string;
  promo_video_url?: string;
  instructor_id: string;
  seminarDayId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  module_id: string;
  course_id: string;
  order: number;
  duration: number; // in minutes
  video_url?: string;
  is_preview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  course_id: string;
  createdAt: string;
  updatedAt: string;
}

// Course colors
const courseColors = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#F44336', // Red
  '#009688', // Teal
  '#FF5722', // Deep Orange
  '#673AB7', // Deep Purple
];

// Course icons
const courseIcons = [
  'code', 'data_object', 'database', 'desktop_windows', 
  'devices', 'language', 'memory', 'psychology',
  'school', 'science', 'security', 'smart_toy'
];

// Mock courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    short_description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript.',
    description: 'This comprehensive course covers everything you need to know to get started with web development. You will learn HTML for structure, CSS for styling, and JavaScript for interactivity. By the end of this course, you will be able to build responsive websites from scratch.',
    format: 'recorded',
    courseType: 'recorded',
    category: 'Web Development',
    level: 'Beginner',
    language: 'English',
    modules_count: 4,
    estimatedDuration: 1200, // 20 hours in minutes
    totalLectures: 24,
    color: courseColors[0],
    icon: courseIcons[0],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '2', // John Instructor
    status: 'approved',
    averageRating: 4.7,
    reviewCount: 120,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts',
    short_description: 'Master advanced JavaScript concepts and modern ES6+ features.',
    description: 'Take your JavaScript skills to the next level with this advanced course. Learn about closures, prototypes, async/await, generators, and other advanced concepts. This course also covers modern JavaScript features introduced in ES6 and beyond.',
    format: 'live',
    courseType: 'live',
    category: 'Web Development',
    level: 'Advanced',
    language: 'English',
    modules_count: 5,
    estimatedDuration: 900, // 15 hours in minutes
    totalLectures: 20,
    color: courseColors[1],
    icon: courseIcons[1],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '2', // John Instructor
    seminarDayId: '1', // Monday
    status: 'approved',
    averageRating: 4.9,
    reviewCount: 85,
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Data Science Fundamentals',
    short_description: 'Introduction to data science with Python, pandas, and matplotlib.',
    description: 'This course provides a comprehensive introduction to data science using Python. You will learn how to manipulate data with pandas, visualize it with matplotlib, and perform basic statistical analysis. Perfect for beginners who want to enter the field of data science.',
    format: 'recorded',
    courseType: 'recorded',
    category: 'Data Science',
    level: 'Beginner',
    language: 'English',
    modules_count: 6,
    estimatedDuration: 1500, // 25 hours in minutes
    totalLectures: 30,
    color: courseColors[2],
    icon: courseIcons[2],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '3', // Jane Instructor
    status: 'approved',
    averageRating: 4.6,
    reviewCount: 95,
    createdAt: '2025-01-12T00:00:00.000Z',
    updatedAt: '2025-01-12T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'Machine Learning with Python',
    short_description: 'Learn practical machine learning techniques with scikit-learn and TensorFlow.',
    description: 'This course teaches you how to build machine learning models using Python libraries like scikit-learn and TensorFlow. You will learn about supervised and unsupervised learning, model evaluation, and how to deploy models to production. Includes hands-on projects with real-world datasets.',
    format: 'live',
    courseType: 'live',
    category: 'Data Science',
    level: 'Intermediate',
    language: 'English',
    modules_count: 8,
    estimatedDuration: 1800, // 30 hours in minutes
    totalLectures: 40,
    color: courseColors[3],
    icon: courseIcons[3],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '3', // Jane Instructor
    seminarDayId: '2', // Tuesday
    status: 'approved',
    averageRating: 4.8,
    reviewCount: 75,
    createdAt: '2025-01-13T00:00:00.000Z',
    updatedAt: '2025-01-13T00:00:00.000Z',
  },
  {
    id: '5',
    title: 'Mobile App Development with React Native',
    short_description: 'Build cross-platform mobile apps with React Native.',
    description: 'Learn how to develop mobile applications for iOS and Android using React Native. This course covers components, navigation, state management, and how to access native device features. By the end, you will be able to build and deploy your own mobile apps.',
    format: 'recorded',
    courseType: 'recorded',
    category: 'Mobile Development',
    level: 'Intermediate',
    language: 'English',
    modules_count: 7,
    estimatedDuration: 1350, // 22.5 hours in minutes
    totalLectures: 35,
    color: courseColors[4],
    icon: courseIcons[4],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '7', // Michael Instructor
    status: 'approved',
    averageRating: 4.5,
    reviewCount: 60,
    createdAt: '2025-01-14T00:00:00.000Z',
    updatedAt: '2025-01-14T00:00:00.000Z',
  },
  {
    id: '6',
    title: 'UI/UX Design Principles',
    short_description: 'Master the principles of user interface and user experience design.',
    description: 'This course teaches you the fundamentals of UI/UX design. Learn about user research, wireframing, prototyping, and usability testing. You will also learn how to use design tools like Figma and Adobe XD to create beautiful and functional interfaces.',
    format: 'live',
    courseType: 'live',
    category: 'Design',
    level: 'Beginner',
    language: 'English',
    modules_count: 5,
    estimatedDuration: 900, // 15 hours in minutes
    totalLectures: 25,
    color: courseColors[5],
    icon: courseIcons[5],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '7', // Michael Instructor
    seminarDayId: '3', // Wednesday
    status: 'approved',
    averageRating: 4.7,
    reviewCount: 50,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: '7',
    title: 'DevOps and CI/CD Pipelines',
    short_description: 'Learn how to implement DevOps practices and CI/CD pipelines.',
    description: 'This course covers DevOps principles and practices, including continuous integration and continuous deployment (CI/CD). Learn how to use tools like Docker, Kubernetes, Jenkins, and GitHub Actions to automate your development workflow and improve software delivery.',
    format: 'recorded',
    courseType: 'recorded',
    category: 'DevOps',
    level: 'Advanced',
    language: 'English',
    modules_count: 6,
    estimatedDuration: 1200, // 20 hours in minutes
    totalLectures: 30,
    color: courseColors[6],
    icon: courseIcons[6],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '2', // John Instructor
    status: 'approved',
    averageRating: 4.6,
    reviewCount: 40,
    createdAt: '2025-01-16T00:00:00.000Z',
    updatedAt: '2025-01-16T00:00:00.000Z',
  },
  {
    id: '8',
    title: 'Blockchain Development',
    short_description: 'Introduction to blockchain technology and smart contract development.',
    description: 'Learn the fundamentals of blockchain technology and how to develop smart contracts using Solidity. This course covers the Ethereum blockchain, decentralized applications (dApps), and how to integrate blockchain into web applications.',
    format: 'live',
    courseType: 'live',
    category: 'Blockchain',
    level: 'Intermediate',
    language: 'English',
    modules_count: 5,
    estimatedDuration: 1050, // 17.5 hours in minutes
    totalLectures: 25,
    color: courseColors[7],
    icon: courseIcons[7],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '2', // John Instructor
    seminarDayId: '4', // Thursday
    status: 'approved',
    averageRating: 4.4,
    reviewCount: 30,
    createdAt: '2025-01-17T00:00:00.000Z',
    updatedAt: '2025-01-17T00:00:00.000Z',
  },
  {
    id: '9',
    title: 'Cloud Computing with AWS',
    short_description: 'Master cloud computing concepts and AWS services.',
    description: 'This course provides a comprehensive introduction to cloud computing with Amazon Web Services (AWS). Learn about EC2, S3, Lambda, DynamoDB, and other essential AWS services. By the end, you will be able to architect and deploy scalable applications on AWS.',
    format: 'recorded',
    courseType: 'recorded',
    category: 'Cloud Computing',
    level: 'Intermediate',
    language: 'English',
    modules_count: 7,
    estimatedDuration: 1500, // 25 hours in minutes
    totalLectures: 35,
    color: courseColors[0],
    icon: courseIcons[8],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '3', // Jane Instructor
    status: 'approved',
    averageRating: 4.7,
    reviewCount: 55,
    createdAt: '2025-01-18T00:00:00.000Z',
    updatedAt: '2025-01-18T00:00:00.000Z',
  },
  {
    id: '10',
    title: 'Cybersecurity Fundamentals',
    short_description: 'Learn the basics of cybersecurity and ethical hacking.',
    description: 'This course introduces you to the world of cybersecurity. Learn about common vulnerabilities, threat modeling, encryption, network security, and ethical hacking techniques. Includes hands-on labs to practice your skills in a safe environment.',
    format: 'live',
    courseType: 'live',
    category: 'Cybersecurity',
    level: 'Beginner',
    language: 'English',
    modules_count: 6,
    estimatedDuration: 1200, // 20 hours in minutes
    totalLectures: 30,
    color: courseColors[1],
    icon: courseIcons[9],
    promo_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instructor_id: '3', // Jane Instructor
    seminarDayId: '5', // Friday
    status: 'approved',
    averageRating: 4.8,
    reviewCount: 45,
    createdAt: '2025-01-19T00:00:00.000Z',
    updatedAt: '2025-01-19T00:00:00.000Z',
  },
];

// Mock modules
export const mockModules: Module[] = [
  // Modules for Course 1: Introduction to Web Development
  {
    id: '1',
    title: 'HTML Fundamentals',
    description: 'Learn the basics of HTML, including tags, attributes, and document structure.',
    course_id: '1',
    order: 1,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'CSS Styling',
    description: 'Learn how to style web pages using CSS, including selectors, properties, and layouts.',
    course_id: '1',
    order: 2,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'JavaScript Basics',
    description: 'Introduction to JavaScript programming, including variables, functions, and DOM manipulation.',
    course_id: '1',
    order: 3,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'Responsive Web Design',
    description: 'Learn how to create responsive websites that work on all devices.',
    course_id: '1',
    order: 4,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  
  // Modules for Course 2: Advanced JavaScript Concepts
  {
    id: '5',
    title: 'ES6+ Features',
    description: 'Learn about modern JavaScript features introduced in ES6 and beyond.',
    course_id: '2',
    order: 1,
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
  {
    id: '6',
    title: 'Closures and Prototypes',
    description: 'Deep dive into JavaScript closures and prototype-based inheritance.',
    course_id: '2',
    order: 2,
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
  {
    id: '7',
    title: 'Asynchronous JavaScript',
    description: 'Master asynchronous programming with promises, async/await, and generators.',
    course_id: '2',
    order: 3,
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
  {
    id: '8',
    title: 'Functional Programming',
    description: 'Learn functional programming concepts and techniques in JavaScript.',
    course_id: '2',
    order: 4,
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
  {
    id: '9',
    title: 'Design Patterns',
    description: 'Explore common design patterns and their implementation in JavaScript.',
    course_id: '2',
    order: 5,
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
];

// Mock lectures
export const mockLectures: Lecture[] = [
  // Lectures for Module 1: HTML Fundamentals
  {
    id: '1',
    title: 'Introduction to HTML',
    description: 'Overview of HTML and its role in web development.',
    module_id: '1',
    course_id: '1',
    order: 1,
    duration: 45,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_preview: true,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'HTML Document Structure',
    description: 'Learn about the basic structure of an HTML document.',
    module_id: '1',
    course_id: '1',
    order: 2,
    duration: 45,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_preview: false,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'HTML Tags and Elements',
    description: 'Explore common HTML tags and elements.',
    module_id: '1',
    course_id: '1',
    order: 3,
    duration: 45,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_preview: false,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  
  // Lectures for Module 2: CSS Styling
  {
    id: '4',
    title: 'Introduction to CSS',
    description: 'Overview of CSS and its role in web development.',
    module_id: '2',
    course_id: '1',
    order: 1,
    duration: 45,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_preview: false,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '5',
    title: 'CSS Selectors',
    description: 'Learn about different types of CSS selectors.',
    module_id: '2',
    course_id: '1',
    order: 2,
    duration: 45,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_preview: false,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '6',
    title: 'CSS Box Model',
    description: 'Understand the CSS box model and how it affects layout.',
    module_id: '2',
    course_id: '1',
    order: 3,
    duration: 45,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_preview: false,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
];

// Mock FAQs
export const mockFAQs: FAQ[] = [
  // FAQs for Course 1
  {
    id: '1',
    question: 'Do I need any prior experience to take this course?',
    answer: 'No, this course is designed for beginners. No prior experience is required.',
    course_id: '1',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '2',
    question: 'What software do I need for this course?',
    answer: 'You will need a text editor (like VS Code) and a modern web browser (like Chrome or Firefox).',
    course_id: '1',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '3',
    question: 'Will I receive a certificate upon completion?',
    answer: 'Yes, you will receive a certificate of completion once you finish all the lectures and assignments.',
    course_id: '1',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  
  // FAQs for Course 2
  {
    id: '4',
    question: 'What level of JavaScript knowledge is required?',
    answer: 'This is an advanced course, so you should be comfortable with JavaScript basics, including variables, functions, and objects.',
    course_id: '2',
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
  {
    id: '5',
    question: 'Is this course up-to-date with the latest JavaScript features?',
    answer: 'Yes, this course covers the latest JavaScript features up to ES2025.',
    course_id: '2',
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
  {
    id: '6',
    question: 'How long do I have access to the course materials?',
    answer: 'You will have lifetime access to all course materials, including any future updates.',
    course_id: '2',
    createdAt: '2025-01-11T00:00:00.000Z',
    updatedAt: '2025-01-11T00:00:00.000Z',
  },
];

export default {
  courses: mockCourses,
  modules: mockModules,
  lectures: mockLectures,
  faqs: mockFAQs,
};
