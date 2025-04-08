import Footer from "@/components/Footer";
import CourseDetail from "./components/CourseDetail";
import Intro from "./components/Intro";
import TopNavigationBar from "./components/TopNavigationBar";
export const metadata = {
  title: 'Course Module'
};
const CourseDetailModule = () => {
  return <>
      <TopNavigationBar />
      <main>
        <Intro />
        <CourseDetail />
      </main>
      <Footer className="bg-light" />
    </>;
};
export default CourseDetailModule;
