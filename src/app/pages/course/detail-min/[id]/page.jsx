"use client"
import Footer from "@/components/Footer";
import BannerVideo from "./components/BannerVideo";
import CourseDetails from "./components/CourseDetails";
import TopNavigationBar from "./components/TopNavigationBar";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { checkIsLoggedInUser } from "@/helpers/checkLoggedInUser";
import axiosInstance from "@/utils/axiosInstance";

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

        // Get courses from localStorage
        const coursesStr = localStorage.getItem('courses');
        if (!coursesStr) {
          console.error('No courses found in localStorage');
          setIsLoading(false);
          return;
        }

        const courses = JSON.parse(coursesStr);
        const course = courses.find(c => c.id === courseId);

        if (!course) {
          console.error(`Course with ID ${courseId} not found`);
          setIsLoading(false);
          return;
        }

        // Format the course data to match the expected structure
        const courseData = {
          course: {
            ...course,
            modules_count: course.modulesCount || 4,
            short_description: course.shortDesription || '',
            level: course.level || 'Beginner',
            instructor: {
              name: 'Instructor Name',
              title: 'Course Instructor',
              avatar: '/assets/images/avatar/01.jpg',
              bio: 'Experienced instructor with expertise in this subject.',
              id: course.instructor_id || 'local_instructor'
            },
            rating: 4.5,
            enrolled: Math.floor(Math.random() * 1000) + 100, // Random number for enrolled students
            price: course.price || 0,
            duration: '10 weeks',
            language: course.language || 'English',
            certificate: true,
            updated_at: course.updatedAt || new Date().toISOString()
          },
          lectures: course.lectures || [],
          faqs: course.faqs || [],
          tags: course.tags || [],
          reviews: [
            {
              id: 1,
              user: {
                name: 'John Doe',
                avatar: '/assets/images/avatar/02.jpg'
              },
              rating: 5,
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              comment: 'Great course! I learned a lot from this course.'
            },
            {
              id: 2,
              user: {
                name: 'Jane Smith',
                avatar: '/assets/images/avatar/03.jpg'
              },
              rating: 4,
              date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              comment: 'Very informative and well-structured course.'
            }
          ]
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
              title: lecture.topicName,
              description: lecture.description,
              duration: '10:00',
              videoUrl: lecture.videoFile || 'https://www.youtube.com/embed/tXHviS-4ygo',
              watched: false
            });
          });

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
    setCurrentVideo(video);

    console.log(video, "in the page")
  };
  console.log(currentVideo, "in the ccccccccccccc")

  if (isLoading) {
    return <div>Loading course...</div>;
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
