import Footer from "@/components/Footer";
import CourseDetails from "./components/CourseDetails";
import ListedCourses from "./components/ListedCourses";
import PageIntro from "./components/PageIntro";
import TopNavigationBar from "./components/TopNavigationBar";
export const metadata = {
  title: 'Course Detail'
};
const CourseDetail = () => {
  return <>
      <TopNavigationBar />
      <main>
        <PageIntro />
        <CourseDetails />
        <ListedCourses />
      </main>
      <Footer className="bg-light" />
    </>;
};
export default CourseDetail;
