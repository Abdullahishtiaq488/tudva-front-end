"use client"
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkIsLoggedInUser } from "@/helpers/checkLoggedInUser";
import axiosInstance from "@/utils/axiosInstance";
import { getAllFileCourses } from "@/utils/fileCourseApi";
import { getAllDirectCourses } from "@/utils/directCourseApi";
import { getAllSimpleCourses } from "@/utils/simpleCourseApi";
import TopNavigationBar from "./components/TopNavigationBar";

// Dynamically import components that use window/browser APIs with ssr: false
const BannerVideo = dynamic(() => import("./components/BannerVideo"), { ssr: false });
const CourseDetails = dynamic(() => import("./components/CourseDetails"), { ssr: false });
const CourseDetailSkeleton = dynamic(() => import("./components/CourseDetailSkeleton"), { ssr: false });
const CourseBanner = dynamic(() => import("./components/CourseBanner"), { ssr: false });

const DetailMinimal = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id;
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [error, setError] = useState(null);

  console.log('Course detail page loaded with ID:', courseId);

  // Function to format and set course data
  const formatAndSetCourse = (courseData) => {
    if (!courseData || !courseData.id) {
      console.error('Invalid course data:', courseData);
      return;
    }

    console.log('Formatting course data:', courseData);

    // Format the course data to match the expected structure
    const formattedData = {
      course: {
        id: courseData.id,
        title: courseData.title || 'Untitled Course',
        description: courseData.description || '',
        modules_count: courseData.modulesCount || courseData.modules_count || 4,
        short_description: courseData.shortDescription || courseData.short_description || '',
        level: courseData.level || 'Beginner',
        color: courseData.color || '#ffffff',
        icon: courseData.icon || 'FaBook',
        promo_video_url: courseData.promo_video_url || courseData.promoVideoUrl || '',
        format: courseData.format || 'video',
        courseType: courseData.courseType || 'recorded',
        category: courseData.category || 'General',
        language: courseData.language || 'English',
        instructor_id: courseData.instructor_id || 'local_instructor',
        instructor: courseData.instructor || {
          name: 'Instructor Name',
          title: 'Course Instructor',
          avatar: '/assets/images/avatar/placeholder.svg',
          bio: 'Experienced instructor with expertise in this subject.',
          id: courseData.instructor_id || 'local_instructor'
        },
        rating: courseData.averageRating || 4.5,
        enrolled: courseData.enrollmentCount || 0,
        price: courseData.price || 0,
        duration: '10 weeks',
        certificate: true,
        createdAt: courseData.createdAt || new Date().toISOString(),
        updatedAt: courseData.updatedAt || new Date().toISOString(),
        status: courseData.status || 'published'
      },
      lectures: Array.isArray(courseData.lectures) ? courseData.lectures : [],
      faqs: Array.isArray(courseData.faqs) ? courseData.faqs : [],
      tags: Array.isArray(courseData.tags) ? courseData.tags : [],
      reviews: Array.isArray(courseData.reviews) ? courseData.reviews : [],
      averageRating: courseData.averageRating || 5.0,
      reviewCount: courseData.reviewCount || 0
    };

    console.log('Formatted course data:', formattedData);

    // Create modules from lectures
    if (Array.isArray(courseData.lectures) && courseData.lectures.length > 0) {
      // Group lectures by module
      const moduleMap = {};
      courseData.lectures.forEach(lecture => {
        const moduleName = lecture.moduleName || 'Module 1';
        if (!moduleMap[moduleName]) {
          moduleMap[moduleName] = [];
        }
        moduleMap[moduleName].push({
          id: lecture.id,
          title: lecture.topicName || lecture.title || 'Untitled Lecture',
          description: lecture.description || '',
          duration: '10:00',
          videoUrl: lecture.videoUrl || lecture.videoFile || lecture.video_url || 'https://www.youtube.com/embed/tXHviS-4ygo',
          watched: false
        });
      });

      formattedData.modules = moduleMap;
    } else {
      // Create sample modules if no lectures exist
      formattedData.modules = {
        'Module 1': [
          { id: 1, title: 'Introduction', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/tXHviS-4ygo', watched: false },
          { id: 2, title: 'Getting Started', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/tXHviS-4ygo', watched: false }
        ],
        'Module 2': [
          { id: 3, title: 'Basic Concepts', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/tXHviS-4ygo', watched: false },
          { id: 4, title: 'Advanced Topics', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/tXHviS-4ygo', watched: false }
        ]
      };
    }

    // Set the course data
    setCourse(formattedData);
    setIsLoading(false);
  };

  // Try to get the course from localStorage immediately
  useEffect(() => {
    if (!courseId) {
      console.error('No course ID provided');
      setError('No course ID provided');
      setIsLoading(false);
      return;
    }

    try {
      // Check if course is in localStorage
      const specificCourseStr = localStorage.getItem(`course_${courseId}`);
      if (specificCourseStr) {
        const localCourse = JSON.parse(specificCourseStr);
        console.log('Found course in localStorage immediately:', localCourse);
        // Format and set the course data
        formatAndSetCourse(localCourse);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [courseId])
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        console.error('No course ID provided');
        setIsLoading(false);
        return;
      }

      console.log('Fetching course with ID:', courseId);
      try {
        setIsLoading(true);

        // Try to get the course directly by ID
        let course = null;

        try {
          // Try to fetch the course directly from the backend
          console.log('Fetching course directly by ID:', courseId);
          const response = await axiosInstance.get(`/api/courses/${courseId}`);

          console.log('Backend response:', response.data);

          if (response.data && response.data.success && response.data.course) {
            console.log('Successfully fetched course from backend:', response.data.course);
            course = response.data.course;
          } else if (response.data && response.data.course) {
            console.log('Course found in response but not in success format:', response.data.course);
            course = response.data.course;
          } else {
            console.warn('Course not found in backend, trying file-based API');
            // Try file-based API for a single course
            try {
              console.log('Trying to fetch course directly from file-based API');
              const fileResponse = await axiosInstance.get(`/api/file-courses/${courseId}`);

              if (fileResponse.data && fileResponse.data.course) {
                console.log('Successfully fetched course from file-based API:', fileResponse.data.course);
                course = fileResponse.data.course;
              } else {
                console.warn('Course not found in file-based API, trying to get all courses');
                // Fall back to getting all courses
                const fileCourses = await getAllFileCourses();
                console.log('Got all file courses:', fileCourses.length);
                course = fileCourses.find(c => c.id === courseId);

                if (course) {
                  console.log('Found course in all file courses:', course);
                }
              }
            } catch (fileApiError) {
              console.warn('Error fetching from file-based API:', fileApiError);
              // Fall back to getting all courses
              const fileCourses = await getAllFileCourses();
              course = fileCourses.find(c => c.id === courseId);
            }

            if (!course) {
              console.warn('Course not found in file-based API, trying direct API');
              // Try direct API
              const directCourses = await getAllDirectCourses();
              course = directCourses.find(c => c.id === courseId);

              if (!course) {
                console.warn('Course not found in direct API, trying simplified API');
                // Try simplified API
                const simpleCourses = await getAllSimpleCourses();
                course = simpleCourses.find(c => c.id === courseId);
              }
            }
          }
        } catch (apiError) {
          console.warn('Error fetching from APIs, falling back to localStorage:', apiError);
          // Fall back to localStorage if APIs fail
          try {
            // Try courses in localStorage
            const coursesStr = localStorage.getItem('courses');
            if (coursesStr) {
              const courses = JSON.parse(coursesStr);
              course = courses.find(c => c.id === courseId);
              if (course) {
                console.log('Found course in localStorage courses:', course);
              }
            }

            // If not found, try fileCourses in localStorage
            if (!course) {
              const fileCoursesStr = localStorage.getItem('fileCourses');
              if (fileCoursesStr) {
                const fileCourses = JSON.parse(fileCoursesStr);
                course = fileCourses.find(c => c.id === courseId);
                if (course) {
                  console.log('Found course in localStorage fileCourses:', course);
                }
              }
            }

            // If still not found, try directCourses in localStorage
            if (!course) {
              const directCoursesStr = localStorage.getItem('directCourses');
              if (directCoursesStr) {
                const directCourses = JSON.parse(directCoursesStr);
                course = directCourses.find(c => c.id === courseId);
                if (course) {
                  console.log('Found course in localStorage directCourses:', course);
                }
              }
            }

            // If still not found, try specific course in localStorage
            if (!course) {
              const specificCourseStr = localStorage.getItem(`course_${courseId}`);
              if (specificCourseStr) {
                course = JSON.parse(specificCourseStr);
                console.log('Found specific course in localStorage:', course);
              }
            }
          } catch (localStorageError) {
            console.error('Error accessing localStorage:', localStorageError);
          }
        }

        if (!course) {
          console.error(`Course with ID ${courseId} not found in any API`);
          setError(`Course with ID ${courseId} not found`);
          setIsLoading(false);
          return;
        }

        console.log('Final course data before formatting:', course);

        // Format and set the course data
        formatAndSetCourse(course);

        // Store the course in localStorage for future use
        try {
          // Store in localStorage
          localStorage.setItem(`course_${courseId}`, JSON.stringify(course));

          // Also update the courses array if it exists
          const coursesStr = localStorage.getItem('courses');
          if (coursesStr) {
            const courses = JSON.parse(coursesStr);
            // Check if course already exists
            const existingIndex = courses.findIndex(c => c.id === courseId);
            if (existingIndex >= 0) {
              // Update existing course
              courses[existingIndex] = course;
            } else {
              // Add new course
              courses.push(course);
            }
            localStorage.setItem('courses', JSON.stringify(courses));
          } else {
            // Create new courses array
            localStorage.setItem('courses', JSON.stringify([course]));
          }
        } catch (storageError) {
          console.warn('Error storing course in localStorage:', storageError);
        }



        // Course data has been formatted and set
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleVideoSelect = (video) => {
    console.log('Video selected in page:', video);
    if (video && video.videoUrl) {
      setCurrentVideo(video);
    }
  };
  console.log(currentVideo, "in the ccccccccccccc")

  // Show loading state while fetching course data
  if (isLoading) {
    return (
      <>
        <TopNavigationBar />
        <CourseDetailSkeleton />
        <Footer className="bg-light" />
      </>
    );
  }

  // Show error state if course data is not available
  if (!course) {
    return (
      <>
        <TopNavigationBar />
        <div className="container my-5 py-5 text-center">
          <h2>Course Not Found</h2>
          <p>{error || 'The course you are looking for could not be found. Please try again later or check the URL.'}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              // Go back to courses page
              router.push('/pages/course/grid');
            }}
          >
            Browse Courses
          </button>
        </div>
        <Footer className="bg-light" />
      </>
    );
  }

  return <>
    <TopNavigationBar />
    <main>
      <CourseBanner course={course} />
      <BannerVideo course={course} selectedVideo={currentVideo} onVideoSelect={handleVideoSelect} />
      <CourseDetails course={course} onVideoSelect={handleVideoSelect} />
    </main>
    <Footer className="bg-light" />
  </>;
};
export default DetailMinimal;
