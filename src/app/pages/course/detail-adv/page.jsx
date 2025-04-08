import React from 'react';
import TopNavigationBar from './components/TopNavigationBar';
import CourseDetails from './components/CourseDetails';
import Footer from '@/components/Footer';
export const metadata = {
  title: 'Course Advance'
};
const CourseAdvanceDetails = () => {
  return <>
      <TopNavigationBar />
      <main>
        <CourseDetails />
      </main>
      <Footer className='bg-light' />
    </>;
};
export default CourseAdvanceDetails;
