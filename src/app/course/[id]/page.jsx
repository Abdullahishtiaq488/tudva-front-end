"use client"
import dynamic from 'next/dynamic';
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkIsLoggedInUser } from "@/helpers/checkLoggedInUser";
import { courses, users } from '@/data/mockData';
import axiosInstance from "@/utils/axiosInstance";
import { toast } from 'react-hot-toast';

// Dynamically import components that use window/browser APIs with ssr: false
const BannerVideo = dynamic(() => import("./components/BannerVideo"), { ssr: false });
const CourseDetailSkeleton = dynamic(() => import("./components/CourseDetailSkeleton"), { ssr: false });
const CourseBanner = dynamic(() => import("./components/CourseBanner"), { ssr: false });
const CourseDetails = dynamic(() => import("./components/CourseDetails"), { ssr: false });

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id;
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [error, setError] = useState(null);

  // Initialize course detail page with courseId

  // Helper function to format and set course data
  const formatAndSetCourse = (courseData) => {
    if (!courseData) {
      console.error('No course data to format');
      return;
    }

    try {
      // Format the course data to match the expected structure
      const formattedCourse = {
        ...courseData,
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
          rating: courseData.averageRating || 0,
          enrolled: courseData.enrollmentCount || 0,
          price: courseData.price || 0,
          duration: courseData.estimatedDuration || 'Not specified',
          certificate: courseData.certificate !== undefined ? courseData.certificate : true,
          createdAt: courseData.createdAt || new Date().toISOString(),
          updatedAt: courseData.updatedAt || new Date().toISOString(),
          status: courseData.status || 'published',
          instructor: courseData.instructor || (() => {
            // If instructor_id exists but instructor object doesn't, find the instructor
            if (courseData.instructor_id) {
              const instructor = users.find(user => user.id === courseData.instructor_id);
              if (instructor) {
                console.log('Found instructor by ID:', instructor);
                return instructor;
              }
            }
            // Default instructor if not found
            return {
              id: courseData.instructor_id || '1',
              fullName: 'Instructor Name',
              profilePicture: '/assets/images/avatar/01.jpg'
            };
          })()
        },
        lectures: courseData.lectures || [],
        reviews: courseData.reviews || [],
        // Convert string tags to objects with tag_name property if needed
        tags: Array.isArray(courseData.tags)
          ? courseData.tags.map(tag => {
            // If tag is already an object with tag_name, return it as is
            if (typeof tag === 'object' && tag.tag_name) {
              return tag;
            }
            // If tag is a string, convert it to an object with tag_name
            return { id: `tag-${Math.random().toString(36).substr(2, 9)}`, tag_name: tag };
          })
          : [],
      };

      // Create modules from lectures or use provided modules
      if (courseData.modules && typeof courseData.modules === 'object' && !Array.isArray(courseData.modules)) {
        // If modules is already in the correct format, use it directly
        formattedCourse.modules = courseData.modules;
        // Using existing modules object
      } else if (courseData.modulesList && Array.isArray(courseData.modulesList) && courseData.modulesList.length > 0) {
        // If modulesList is available (new format), use it to create the modules map
        // Using modulesList to create modules
        const moduleMap = {};

        courseData.modulesList.forEach(module => {
          const moduleName = module.title || `Module ${module.moduleNumber || 1}`;
          moduleMap[moduleName] = [];

          // Find lectures for this module
          if (Array.isArray(courseData.lectures)) {
            const moduleLectures = courseData.lectures.filter(lecture =>
              lecture.moduleId === module.id || lecture.moduleName === moduleName
            );

            moduleLectures.forEach(lecture => {
              moduleMap[moduleName].push({
                id: lecture.id,
                title: lecture.title || lecture.topicName || 'Untitled Lecture',
                description: lecture.description || '',
                duration: lecture.durationMinutes ? `${lecture.durationMinutes}:00` : '45:00',
                videoUrl: lecture.videoUrl || lecture.videoFile || lecture.video_url || 'https://www.youtube.com/embed/tXHviS-4ygo',
                watched: false,
                isDemoLecture: lecture.isDemoLecture || false,
                isAccessible: lecture.isAccessible || false
              });
            });
          }
        });

        formattedCourse.modules = moduleMap;
      } else if (Array.isArray(courseData.modules) && courseData.modules.length > 0) {
        // If modules is an array, convert it to the expected format
        // Converting modules array to map
        const moduleMap = {};
        courseData.modules.forEach((module, index) => {
          const moduleName = module.title || `Module ${index + 1}`;
          moduleMap[moduleName] = [];

          // Add lectures from this module if they exist
          if (Array.isArray(module.lectures)) {
            module.lectures.forEach(lecture => {
              moduleMap[moduleName].push({
                id: lecture.id,
                title: lecture.title || 'Untitled Lecture',
                description: lecture.description || '',
                duration: lecture.durationMinutes ? `${lecture.durationMinutes}:00` : '45:00',
                videoUrl: lecture.videoUrl || lecture.videoFile || lecture.video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                watched: false,
                isDemoLecture: lecture.isDemoLecture || false,
                isAccessible: lecture.isAccessible || false
              });
            });
          }
        });

        formattedCourse.modules = moduleMap;
      } else if (Array.isArray(courseData.lectures) && courseData.lectures.length > 0) {
        // Group lectures by module if no modules are provided
        // Grouping lectures by moduleName
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
            duration: lecture.durationMinutes ? `${lecture.durationMinutes}:00` : '45:00',
            videoUrl: lecture.videoUrl || lecture.videoFile || lecture.video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            watched: false,
            isDemoLecture: lecture.isDemoLecture || false,
            isAccessible: lecture.isAccessible || false
          });
        });

        formattedCourse.modules = moduleMap;
      } else {
        // If no modules or lectures exist, create a single empty module
        // No modules or lectures found, creating empty module structure
        formattedCourse.modules = {
          'Module 1': []
        };

        // Create some dummy lectures for testing
        formattedCourse.modules['Module 1'] = [
          {
            id: 'dummy-1',
            title: 'Introduction to the Course',
            description: 'An overview of what you will learn in this course.',
            duration: '10:00',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            watched: false,
            isDemoLecture: true,
            isAccessible: true
          },
          {
            id: 'dummy-2',
            title: 'Getting Started',
            description: 'How to get started with the course materials.',
            duration: '15:00',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            watched: false,
            isDemoLecture: false,
            isAccessible: false
          }
        ];

        // Add a second module with some lectures
        formattedCourse.modules['Module 2'] = [
          {
            id: 'dummy-3',
            title: 'Core Concepts',
            description: 'Understanding the core concepts.',
            duration: '20:00',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            watched: false,
            isDemoLecture: false,
            isAccessible: false
          },
          {
            id: 'dummy-4',
            title: 'Advanced Techniques',
            description: 'Learning advanced techniques.',
            duration: '25:00',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            watched: false,
            isDemoLecture: false,
            isAccessible: false
          }
        ];
      }

      // Course data formatted successfully
      console.log('Formatted course data:', formattedCourse);
      setCourse(formattedCourse);

      // Set the first video as current if available
      // First try to find a demo lecture
      let firstVideo = null;

      // Look through all modules for a demo lecture
      for (const moduleName in formattedCourse.modules) {
        const lectures = formattedCourse.modules[moduleName];
        if (Array.isArray(lectures) && lectures.length > 0) {
          // First look for a demo lecture
          const demoLecture = lectures.find(lecture => lecture.isDemoLecture && lecture.videoUrl);
          if (demoLecture) {
            firstVideo = demoLecture;
            break;
          }
          // If no demo lecture, use the first lecture with a videoUrl
          if (!firstVideo) {
            const firstLectureWithVideo = lectures.find(lecture => lecture.videoUrl);
            if (firstLectureWithVideo) {
              firstVideo = firstLectureWithVideo;
              // Don't break here, continue looking for demo lectures in other modules
            }
          }
        }
      }

      // If no video found in modules, try the lectures array
      if (!firstVideo && Array.isArray(formattedCourse.lectures) && formattedCourse.lectures.length > 0) {
        firstVideo = formattedCourse.lectures.find(lecture => lecture.videoUrl);
      }

      if (firstVideo) {
        // Set first video as current
        setCurrentVideo(firstVideo);
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
        // Found course in localStorage
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

      // Fetching course data
      try {
        setIsLoading(true);

        // Get course directly from our centralized mock data
        let course = null;

        // Find the course by ID
        course = courses.find(c => c.id === courseId);

        // If course not found, use the first course as fallback
        if (!course && courses.length > 0) {
          course = courses[0];
        }

        // Log the course data
        console.log('Found course by ID:', courseId, course);


        // If still not found, try localStorage as a last resort
        if (!course) {
          try {
            // Trying to get course from localStorage
            const coursesStr = localStorage.getItem('courses');
            if (coursesStr) {
              const courses = JSON.parse(coursesStr);
              course = courses.find(c => c.id === courseId);

              if (course) {
                // Found course in localStorage
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
    // Handle video selection
    if (video && video.videoUrl) {
      setCurrentVideo(video);
      // Store the selected video in localStorage for persistence
      try {
        localStorage.setItem('lastSelectedVideo_' + courseId, JSON.stringify(video));
      } catch (error) {
        console.warn('Failed to store selected video in localStorage:', error);
      }
    } else {
      console.warn('Attempted to select a video without a videoUrl:', video);
    }
  };

  // Load the last selected video from localStorage on initial load
  useEffect(() => {
    if (courseId) {
      try {
        const savedVideo = localStorage.getItem('lastSelectedVideo_' + courseId);
        if (savedVideo) {
          const parsedVideo = JSON.parse(savedVideo);
          if (parsedVideo && parsedVideo.videoUrl) {
            // Loaded last selected video from localStorage
            setCurrentVideo(parsedVideo);
          }
        }
      } catch (error) {
        console.warn('Failed to load selected video from localStorage:', error);
      }
    }
  }, [courseId]);

  // Show loading state while fetching course data
  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  // Show error state if course data is not available
  if (!course) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 p-4">
              <div className="card-body text-center">
                <i className="fas fa-exclamation-circle text-danger mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="mb-3">Course Not Found</h2>
                <p className="mb-4">{error || 'The course you are looking for could not be found. Please try again later or check the URL.'}</p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => {
                    // Go back to courses page
                    router.push('/pages/course/grid');
                  }}
                >
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* Course banner with title, instructor, and metadata */}
      <CourseBanner course={course} />

      {/* Video player section */}
      <BannerVideo
        course={course}
        selectedVideo={currentVideo}
        onVideoSelect={handleVideoSelect}
        isPageLoading={isLoading}
      />

      {/* Course details with tabs and sidebar */}
      <CourseDetails
        course={course}
        onVideoSelect={handleVideoSelect}
        selectedVideo={currentVideo}
      />
    </main>
  );
};

export default CourseDetailPage;
