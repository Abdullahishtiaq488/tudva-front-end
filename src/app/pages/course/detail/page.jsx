import Footer from "@/components/Footer";
import CourseDetails from "./components/CourseDetails";
import ListedCourses from "./components/ListedCourses";
import PageIntro from "./components/PageIntro";
import TopNavigationBar from "./components/TopNavigationBar";
import { courseData } from "./data";

export const metadata = {
  title: 'Course Detail'
};

const CourseDetail = () => {
  return <>
    <TopNavigationBar />
    <main>
      <PageIntro />
      <CourseDetails course={courseData} />
      <ListedCourses />
    </main>
    <Footer className="bg-light" />
  </>;
};
export default CourseDetail;
