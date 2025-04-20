'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Counter from './components/Counter';
import CoursesList from './components/CoursesList';
import WeeklyCalendar from './components/WeeklyCalendar';
import UpcomingLectures from './components/UpcomingLectures';
import { courses } from '@/data/mockData';

export const metadata = {
  title: 'Student Dashboard'
};

const DashboardPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Get courses directly from mock data
  useEffect(() => {
    try {
      // Use the first 5 courses
      if (courses && courses.length > 0) {
        const coursesToUse = courses.slice(0, 5).map(course => ({
          id: course.id,
          title: course.title,
          format: course.format || (Math.random() > 0.5 ? 'live' : 'recorded'),
          image: course.thumbnail || course.image || '/assets/images/courses/4by3/01.jpg'
        }));

        setEnrolledCourses(coursesToUse);
      }
    } catch (error) {
      console.error('Error processing courses:', error);
    }
  }, []);

  return (
    <>
      <Counter />
      <Row className="g-4 mb-4">
        <Col lg={12}>
          <WeeklyCalendar enrolledCourses={enrolledCourses} />
        </Col>
      </Row>
      <Row className="g-4 mb-4">
        <Col lg={12}>
          <UpcomingLectures enrolledCourses={enrolledCourses} />
        </Col>
      </Row>
      <Row className="g-4 mb-4">
        <Col lg={12}>
          <CoursesList />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
