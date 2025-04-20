import CourseDetails from "./components/CourseDetails";
import ListedCourses from "./components/ListedCourses";
import PageIntro from "./components/PageIntro";

export const metadata = {
  title: 'Course Detail'
};

const CourseDetail = () => {
  return (
    <main>
      <PageIntro />
      <CourseDetails />
      <ListedCourses />
    </main>
  );
};
export default CourseDetail;
