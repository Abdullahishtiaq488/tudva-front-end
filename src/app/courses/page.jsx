import PageBanner from "../components/banner/PageBanner";
import CourseList from "../components/courses/CourseList";
export const metadata = {
  title: 'Course'
};
const CourseHome = () => {
  return <>
        <PageBanner 
          bannerHeadline="all courdes on tudva"
        />
        <CourseList />
    </>;
};
export default CourseHome;
