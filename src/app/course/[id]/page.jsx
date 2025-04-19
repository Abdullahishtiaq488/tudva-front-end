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
import TopNavigationBar from "@/app/pages/course/detail-min/[id]/components/TopNavigationBar";

// Dynamically import components that use window/browser APIs with ssr: false
const BannerVideo = dynamic(() => import("@/app/pages/course/detail-min/[id]/components/BannerVideo"), { ssr: false });
const CourseDetailSkeleton = dynamic(() => import("@/app/pages/course/detail-min/[id]/components/CourseDetailSkeleton"), { ssr: false });
const CourseBanner = dynamic(() => import("@/app/pages/course/detail-min/[id]/components/CourseBanner"), { ssr: false });

// Import our custom components
const CourseDetails = dynamic(() => import("./components/CourseDetails"), { ssr: false });

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id;
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [error, setError] = useState(null);

  console.log('Course detail page loaded with ID:', courseId);

  // Helper function to format and set course data
  const formatAndSetCourse = (courseData) => {
    if (!courseData) {
      console.error('No course data to format');
      return;
    }

    try {
      // Create a structured course object
      const formattedCourse = {
        ...courseData,
        course: courseData, // Keep the original data accessible
        modules: courseData.modules || {},
        lectures: courseData.lectures || [],
        reviews: courseData.reviews || [],
        tags: courseData.tags || [],
      };

      // If we have lectures but no modules, organize them into modules
      if (Array.isArray(formattedCourse.lectures) && formattedCourse.lectures.length > 0 && Object.keys(formattedCourse.modules).length === 0) {
        // Group lectures by module name
        const moduleGroups = {};
        formattedCourse.lectures.forEach(lecture => {
          const moduleName = lecture.moduleName || 'Module 1';
          if (!moduleGroups[moduleName]) {
            moduleGroups[moduleName] = [];
          }
          moduleGroups[moduleName].push(lecture);
        });

        formattedCourse.modules = moduleGroups;
      }

      console.log('Formatted course data:', formattedCourse);
      setCourse(formattedCourse);

      // Set the first video as current if available
      if (Array.isArray(formattedCourse.lectures) && formattedCourse.lectures.length > 0) {
        const firstVideo = formattedCourse.lectures.find(lecture => lecture.videoUrl);
        if (firstVideo) {
          console.log('Setting first video:', firstVideo);
          setCurrentVideo(firstVideo);
        }
      }
    } catch (error) {
      console.error('Error formatting course data:', error);
      setCourse(courseData); // Fallback to original data
    }
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
  }, [courseId]);

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

        // First try to fetch directly from the backend API
        try {
          console.log('Fetching course directly from backend API:', courseId);
          const response = await axiosInstance.get(`/api/courses/${courseId}`);

          if (response.data && response.data.success && response.data.course) {
            console.log('Successfully fetched course from backend API:', response.data.course);
            course = response.data.course;

            // If we have modules in the response, add them to the course
            if (response.data.modules) {
              course.modules = response.data.modules;
            }
          }
        } catch (backendError) {
          console.warn('Error fetching from backend API:', backendError);
        }

        // If not found, try the file-based API
        if (!course) {
          try {
            console.log('Fetching course from file-based API:', courseId);
            const fileCourse = await axiosInstance.get(`/api/file-course/${courseId}`);

            if (fileCourse.data && fileCourse.data.success && fileCourse.data.course) {
              console.log('Successfully fetched course from file-based API:', fileCourse.data.course);
              course = fileCourse.data.course;
            }
          } catch (fileApiError) {
            console.warn('Error fetching from file-based API:', fileApiError);
          }
        }

        // If still not found, try getting all courses from different APIs
        if (!course) {
          try {
            // Try all file courses
            const fileCourses = await getAllFileCourses();
            course = fileCourses.find(c => c.id === courseId);

            if (!course) {
              // Try all direct courses
              const directCourses = await getAllDirectCourses();
              course = directCourses.find(c => c.id === courseId);

              if (!course) {
                // Try all simple courses
                const simpleCourses = await getAllSimpleCourses();
                course = simpleCourses.find(c => c.id === courseId);
              }
            }
          } catch (allCoursesError) {
            console.warn('Error fetching all courses:', allCoursesError);
          }
        }

        // If still not found, try localStorage as a last resort
        if (!course) {
          try {
            console.log('Trying to get course from localStorage:', courseId);
            const coursesStr = localStorage.getItem('courses');
            if (coursesStr) {
              const courses = JSON.parse(coursesStr);
              course = courses.find(c => c.id === courseId);

              if (course) {
                console.log('Found course in localStorage:', course);
              }
            }
          } catch (localStorageError) {
            console.warn('Error fetching from localStorage:', localStorageError);
          }
        }

        if (!course) {
          console.error('Course not found with ID:', courseId);
          setError('Course not found');
          setIsLoading(false);
          return;
        }

        // Format and set the course data
        formatAndSetCourse(course);

        // Store the course in localStorage for faster access next time
        try {
          localStorage.setItem(`course_${courseId}`, JSON.stringify(course));
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
  console.log(currentVideo, "in the course detail page");

  // Show loading state while fetching course data
  if (isLoading) {
    return (
      <>
        <CourseDetailSkeleton />
      </>
    );
  }

  // Show error state if course data is not available
  if (!course) {
    return (
      <>
    
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
      
      </>
    );
  }

  return (
    <>
    
      <main>
        <CourseBanner course={course} />
        <BannerVideo course={course} selectedVideo={currentVideo} onVideoSelect={handleVideoSelect} />
        <CourseDetails course={course} onVideoSelect={handleVideoSelect} />
      </main>
    
    </>
  );
};

export default CourseDetailPage;
