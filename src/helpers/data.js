// Import only from our centralized mock data
// No more imports from other data sources
import { sleep } from "@/utils/promise";
import { courses, users, reviews, enrollments, wishlist } from "@/data/mockData";

export const getAllCourses = async () => {
  try {
    // Use simplified mock data directly
    console.log('Fetching courses from mock data');

    return courses.map(course => {
      // Calculate total lectures from modules if available
      let totalLectureCount = course.totalLectures || course.lectures || 0;
      if (course.modules && Array.isArray(course.modules)) {
        totalLectureCount = course.modules.reduce((total, module) => {
          return total + (module.lectures ? module.lectures.length : 0);
        }, 0);
      }

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        short_description: course.description?.substring(0, 100) + '...' || course.short_description || 'No description available',
        category: course.tags?.[0] || course.category || 'Web Development',
        level: course.level || 'All Levels',
        language: course.language || 'English',
        format: course.format || course.courseType || 'recorded',
        modules_count: course.modules?.length || 4,
        status: course.status || 'published',
        instructor_id: course.instructor_id || '2',
        rating: { star: course.rating || 4.5 },
        reviewCount: course.reviewCount || 0,
        duration: course.duration || '3h 15m',
        lectures: totalLectureCount,
        totalLectures: totalLectureCount,
        badge: {
          text: course.level || 'All level',
          class: getBadgeClassForLevel(course.level)
        },
        icon: course.icon || 'FaNodeJs',
        color: course.color || '#6c757d',
        image: course.thumbnail || course.image || '/assets/images/courses/4by3/01.jpg'
      };
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Return empty array instead of falling back to other data sources
    return [];
  }
};
// Helper function to get badge class based on level
const getBadgeClassForLevel = (level) => {
  if (!level) return 'bg-primary';

  const levelLower = level.toLowerCase();
  if (levelLower.includes('beginner')) return 'bg-success';
  if (levelLower.includes('intermediate')) return 'bg-warning';
  if (levelLower.includes('advanced')) return 'bg-danger';
  return 'bg-primary';
};

export const getAllEvents = async () => {
  await sleep();
  // Create events from our courses
  return courses.slice(0, 5).map(course => ({
    id: course.id,
    title: course.title,
    description: course.short_description || course.description,
    image: course.image,
    date: new Date().toISOString(),
    location: 'Online',
    price: course.price
  }));
};
export const getAllInstructors = async () => {
  try {
    // Get instructors from mock data directly
    const instructors = users.filter(user => user.role === 'instructor');

    // Map to match frontend expected format
    return instructors.map(user => ({
      id: user.id,
      name: user.fullName || user.name,
      subject: "Instructor",
      rating: 4.5,
      totalCourses: courses.filter(course => course.instructor_id === user.id).length,
      verified: true,
      students: 0,
      tasks: 0,
      department: user.role
    }));
  } catch (error) {
    console.error('Error fetching instructors:', error);
    // Return empty array instead of falling back to other data sources
    return [];
  }
};

export const getInstructorById = async id => {
  try {
    // Get instructor by ID from mock data directly
    const instructor = users.find(user => user.id === id && user.role === 'instructor');

    if (instructor) {
      return {
        id: instructor.id,
        name: instructor.fullName || instructor.name,
        subject: "Instructor",
        rating: 4.5,
        totalCourses: courses.filter(course => course.instructor_id === instructor.id).length,
        verified: true,
        students: 0,
        tasks: 0,
        department: instructor.role
      };
    }

    // Return null if not found
    return null;
  } catch (error) {
    console.error('Error fetching instructor:', error);
    // Return null if error
    return null;
  }
};
export const getAllColleges = async () => {
  await sleep();
  // Create colleges from our courses
  return courses.slice(0, 8).map((course, index) => ({
    id: `college-${index + 1}`,
    title: `${course.category || 'Online'} University`,
    image: course.image,
    location: 'Online',
    students: Math.floor(Math.random() * 10000) + 1000,
    rating: course.rating || 4.5,
    courses: Math.floor(Math.random() * 100) + 10
  }));
};
export const getAllBooks = async () => {
  await sleep();
  // Create books from our courses
  return courses.slice(0, 10).map((course, index) => ({
    id: `book-${index + 1}`,
    title: `${course.title} Handbook`,
    image: course.image,
    price: course.price || 29.99,
    rating: course.rating || 4.5,
    author: course.instructor?.fullName || course.instructor?.name || 'Unknown Author',
    category: course.category || 'Education'
  }));
};
export const getProductById = async id => {
  // Find a book from our generated books
  const books = await getAllBooks();
  const book = books.find(book => book.id === id);
  await sleep();
  return book || null;
};
export const getAllEventSchedule = async () => {
  await sleep();
  // Create event schedules from our courses
  const today = new Date();
  return courses.slice(0, 5).map((course, index) => {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + index * 2); // Every 2 days

    return {
      id: `event-${index + 1}`,
      title: `${course.title} Workshop`,
      date: eventDate.toISOString(),
      time: '10:00 AM - 12:00 PM',
      location: 'Online',
      instructor: course.instructor?.fullName || course.instructor?.name || 'Unknown Instructor',
      category: course.category || 'Workshop'
    };
  });
};
export const getAllStudents = async () => {
  try {
    // Get learners from mock data directly
    const learners = users.filter(user => user.role === 'learner');

    // Map learners to student format
    return learners.map(user => {
      // Find enrollments for this user
      const userEnrollments = enrollments.filter(enrollment => enrollment.user_id === user.id);

      // Use enrolled course or assign a random one
      let course;
      if (userEnrollments.length > 0) {
        const randomEnrollmentIndex = Math.floor(Math.random() * userEnrollments.length);
        const courseId = userEnrollments[randomEnrollmentIndex].course_id;
        course = courses.find(c => c.id === courseId) || courses[0];
      } else {
        // Assign a random course if no enrollments
        const randomCourseIndex = Math.floor(Math.random() * courses.length);
        course = courses[randomCourseIndex];
      }

      return {
        id: user.id,
        courseId: course.id,
        location: user.location || 'Unknown',
        payments: Math.floor(Math.random() * 10000),
        progress: Math.floor(Math.random() * 100),
        totalCourse: userEnrollments.length || Math.floor(Math.random() * 10) + 1,
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          short_description: course.description?.substring(0, 100) + '...' || course.short_description || 'No description available',
          category: course.tags?.[0] || course.category || 'Web Development',
          level: course.level || 'All Levels',
          language: course.language || 'English',
          format: course.format || course.courseType || 'recorded',
          modules_count: course.modules?.length || 4,
          status: course.status || 'published',
          instructor_id: course.instructor_id || '2',
          rating: { star: course.rating || 4.5 },
          duration: course.duration || '3h 15m',
          lectures: course.totalLectures || course.lectures || 12,
          badge: { text: course.level || 'All level' }
        }
      };
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    // Return empty array instead of falling back to other data sources
    return [];
  }
};
export const getAllCategories = async () => {
  try {
    // Extract unique tags and categories from courses
    const allTags = courses.flatMap(course => course.tags || []);
    const allCategories = courses.map(course => course.category).filter(Boolean);
    const uniqueCategories = [...new Set([...allTags, ...allCategories])];

    // Create categories from unique tags and categories
    const categories = uniqueCategories.map((category, index) => {
      // Count courses with this category
      const courseCount = courses.filter(course =>
        (course.tags && course.tags.includes(category)) || course.category === category
      ).length;

      return {
        id: `cat-${index + 1}`,
        title: category,
        courses: courseCount,
        variant: getRandomVariant()
      };
    });

    return categories.length > 0 ? categories : [];
  } catch (error) {
    console.error('Error creating categories from mock data:', error);
    return [];
  }
};

// Helper function to get random variant for categories
function getRandomVariant() {
  const variants = [
    'bg-success', 'bg-orange', 'bg-danger', 'bg-purple',
    'bg-info', 'bg-blue', 'bg-warning', 'bg-dark', 'bg-primary'
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}
export const getAllUserReviews = async () => {
  await sleep();
  // Create user reviews from our reviews
  return reviews.map(review => ({
    id: review.id,
    name: review.user?.fullName || review.user?.name || 'Anonymous User',
    image: review.user?.profilePicture || null,
    designation: 'Student',
    review: review.comment,
    rating: review.rating,
    date: review.date
  }));
};
export const getAllStudentsReviews = async () => {
  await sleep();
  // Create student reviews from our reviews
  return reviews.map(review => {
    const course = courses.find(course => course.id === review.course_id);
    return {
      id: review.id,
      name: review.user?.fullName || review.user?.name || 'Anonymous Student',
      image: review.user?.profilePicture || null,
      designation: 'Student',
      review: review.comment,
      rating: review.rating,
      date: review.date,
      course: course ? {
        id: course.id,
        title: course.title,
        image: course.image
      } : null
    };
  });
};
export const getAllPlaylist = async () => {
  await sleep();
  // Create playlists from our courses
  return courses.slice(0, 5).map(course => {
    // Create playlist items from course modules and lectures
    const playlistItems = [];

    course.modules.forEach(module => {
      module.lectures.forEach(lecture => {
        playlistItems.push({
          id: lecture.id,
          title: lecture.title,
          duration: lecture.duration,
          isCompleted: Math.random() > 0.5, // Randomly mark some as completed
          module: module.title
        });
      });
    });

    return {
      id: `playlist-${course.id}`,
      title: course.title,
      items: playlistItems
    };
  });
};
export const getAllBlogs = async () => {
  await sleep();
  // Create blogs from our courses
  return courses.slice(0, 8).map((course, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index * 3); // Blog posts from the past

    return {
      id: `blog-${index + 1}`,
      title: `${course.title}: A Comprehensive Guide`,
      image: course.image,
      category: course.category || 'Education',
      date: date.toISOString(),
      author: course.instructor?.fullName || course.instructor?.name || 'Admin',
      authorImage: course.instructor?.profilePicture || null,
      content: course.description || 'No content available',
      tags: course.tags || ['Education', 'Online Learning']
    };
  });
};
export const getAllPricingPlans = async () => {
  await sleep();
  // Create pricing plans
  return [
    {
      id: 'plan-1',
      title: 'Basic',
      price: 49,
      duration: 'month',
      features: [
        'Access to all basic courses',
        'Limited course materials',
        'Regular course updates',
        'Email support',
        '1 month access'
      ],
      isPopular: false,
      buttonText: 'Start with Basic'
    },
    {
      id: 'plan-2',
      title: 'Premium',
      price: 99,
      duration: 'month',
      features: [
        'Access to all premium courses',
        'All course materials',
        'Regular course updates',
        'Priority email support',
        '3 months access'
      ],
      isPopular: true,
      buttonText: 'Start with Premium'
    },
    {
      id: 'plan-3',
      title: 'Enterprise',
      price: 199,
      duration: 'month',
      features: [
        'Access to all courses',
        'All course materials',
        'Lifetime course updates',
        '24/7 support',
        'Lifetime access'
      ],
      isPopular: false,
      buttonText: 'Start with Enterprise'
    }
  ];
};
export const getBlogById = async id => {
  // Get all blogs and find the one with matching ID
  const blogs = await getAllBlogs();
  const blog = blogs.find(blog => blog.id === id);
  await sleep();
  return blog || null;
};
export const getAllTestimonials = async () => {
  await sleep();
  // Create testimonials from our reviews
  return reviews.map(review => {
    const course = courses.find(course => course.id === review.course_id);
    return {
      id: review.id,
      name: review.user?.fullName || review.user?.name || 'Anonymous User',
      image: review.user?.profilePicture || null,
      designation: 'Student',
      content: review.comment,
      rating: review.rating,
      courseId: review.course_id,
      course: course ? {
        id: course.id,
        title: course.title,
        image: course.image
      } : null
    };
  });
};
export const getAllCourseResume = async () => {
  await sleep();
  // Create course resume data from our courses
  return courses.slice(0, 3).map(course => {
    // Create playlist from course modules
    const playlist = course.modules.map(module => ({
      title: module.title,
      lectures: module.lectures.map(lecture => ({
        id: lecture.id,
        title: lecture.title,
        duration: lecture.duration,
        videoUrl: lecture.videoUrl,
        isCompleted: Math.random() > 0.5 // Randomly mark some as completed
      }))
    }));

    return {
      id: `resume-${course.id}`,
      courseId: course.id,
      course: {
        id: course.id,
        name: course.title,
        image: course.image,
        lectures: course.lectures || course.totalLectures || 12
      },
      playlist
    };
  });
};
