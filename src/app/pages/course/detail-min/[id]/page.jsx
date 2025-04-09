"use client"
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
import { useParams } from "next/navigation";
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

const DetailMinimal = () => {
  const params = useParams();
  const courseId = params?.id;
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);

  console.log(courseId, "-------------d")
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      console.log(courseId, "----------------")
      try {
        setIsLoading(true);

        // Try to get courses from file-based API first
        let courses = [];
        let course = null;

        try {
          // Try file-based API first
          courses = await getAllFileCourses();
          console.log('Courses from file-based API:', courses);
          course = courses.find(c => c.id === courseId);

          if (!course) {
            // If course not found, try direct API
            console.log('Course not found in file-based API, trying direct API');
            courses = await getAllDirectCourses();
            console.log('Courses from direct API:', courses);
            course = courses.find(c => c.id === courseId);

            if (!course) {
              // If still not found, try simplified API
              console.log('Course not found in direct API, trying simplified API');
              courses = await getAllSimpleCourses();
              console.log('Courses from simplified API:', courses);
              course = courses.find(c => c.id === courseId);
            }
          }
        } catch (apiError) {
          console.warn('Error fetching from APIs, falling back to localStorage:', apiError);
          // Fall back to localStorage if APIs fail
          const coursesStr = localStorage.getItem('courses');
          if (coursesStr) {
            courses = JSON.parse(coursesStr);
            course = courses.find(c => c.id === courseId);
          }
        }

        if (!course) {
          console.error(`Course with ID ${courseId} not found`);
          setIsLoading(false);
          return;
        }

        // Format the course data to match the expected structure
        const courseData = {
          course: {
            ...course,
            modules_count: course.modulesCount || course.modules_count || 4,
            short_description: course.shortDesription || course.short_description || '',
            level: course.level || 'Beginner',
            color: course.color || '#ffffff',
            icon: course.icon || 'FaBook',
            promo_video_url: course.promo_video_url || course.promoVideoUrl || '',
            instructor: course.instructor || {
              name: 'Instructor Name',
              title: 'Course Instructor',
              avatar: '/assets/images/avatar/placeholder.svg',
              bio: 'Experienced instructor with expertise in this subject.',
              id: course.instructor_id || 'local_instructor'
            },
            rating: course.averageRating || 4.5,
            enrolled: course.enrollmentCount || 0, // Use real enrollment count
            price: course.price || 0,
            duration: '10 weeks',
            language: course.language || 'English',
            certificate: true,
            updated_at: course.updatedAt || new Date().toISOString()
          },
          lectures: course.lectures || [],
          faqs: course.faqs || [],
          tags: course.tags || [],
          reviews: course.reviews || [],
          // Use actual rating from course if available
          averageRating: course.averageRating || 5.0,
          reviewCount: course.reviewCount || 0
        };

        // Create modules from lectures
        if (course.lectures && course.lectures.length > 0) {
          // Group lectures by module
          const moduleMap = {};
          course.lectures.forEach(lecture => {
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

          console.log('Created modules from lectures:', moduleMap);

          courseData.modules = moduleMap;
        } else {
          // Create sample modules if no lectures exist
          courseData.modules = {
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

        setCourse(courseData);
        console.log(courseData);

        // Generate lecture groups dynamically based on module count
        const moduleCount = courseData.course.modules_count || 0;
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

  if (isLoading) {
    return (
      <>
        <TopNavigationBar />
        <CourseDetailSkeleton />
        <Footer className="bg-light" />
      </>
    );
  }

  return <>
    <TopNavigationBar />
    <main>
      <BannerVideo course={course} selectedVideo={currentVideo} onVideoSelect={handleVideoSelect} />
      <CourseDetails course={course} onVideoSelect={handleVideoSelect} />
    </main>
    <Footer className="bg-light" />
  </>;
};
export default DetailMinimal;
