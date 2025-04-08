import React from 'react';
import Counter from './components/Counter';
import CoursesList from './components/CoursesList';
export const metadata = {
  title: 'Student Dashboard'
};
const DashboardPage = () => {
  return <>
    <Counter />
    <CoursesList />
    </>;
};
export default DashboardPage;
