'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import WeeklyCalendar from '../dashboard/components/WeeklyCalendar';
import UpcomingLectures from '../dashboard/components/UpcomingLectures';
import { courses, enrollments } from '@/data/mockData';


const SchedulePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use our centralized mock data for enrolled courses
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Get enrolled courses from our centralized mock data
      console.log('Using centralized mock data for enrolled courses');

      // Get enrolled course IDs from enrollments
      const enrolledCourseIds = enrollments.map(enrollment => enrollment.course_id);

      // Get course details for enrolled courses
      const enrolledCoursesList = courses.filter(course => enrolledCourseIds.includes(course.id));

      // If no enrolled courses, use all courses
      if (enrolledCoursesList.length === 0) {
        console.log('No enrolled courses found, using all courses');
        setEnrolledCourses(courses);
      } else {
        setEnrolledCourses(enrolledCoursesList);
      }
    } catch (err) {
      console.error('Error getting enrolled courses from mock data:', err);
      setError('Failed to load your enrolled courses');

      // Fallback to using all courses
      setEnrolledCourses(courses);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your schedule...</p>
      </div>
    );
  }

  if (error && enrolledCourses.length === 0) {
    return (
      <Alert variant="warning" className="my-4">
        <div className="d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          <span>Unable to load your schedule: {error}</span>
        </div>
      </Alert>
    );
  }

  return (
    <>
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="bg-light border-0">
            <Card.Body>
              <div className="d-sm-flex justify-content-sm-between align-items-center">
                <div>
                  <h1 className="h3 mb-2 mb-sm-0">My Schedule</h1>
                  <p className="mb-0">Manage your course schedule and upcoming lectures</p>
                </div>
                <div className="d-flex mt-2 mt-sm-0">
                  <Button variant="primary" className="mb-0">
                    <FaCalendarAlt className="me-2" />
                    Export Calendar
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} className="mb-4">
          <div className="upcoming-lectures-container">
            <UpcomingLectures enrolledCourses={enrolledCourses} />
          </div>
        </Col>
        <Col xs={12}>
          <WeeklyCalendar enrolledCourses={enrolledCourses} />
        </Col>
      </Row>

      {/* CSS for horizontal scrolling without visible scrollbar */}
      <style jsx global>{`
        .upcoming-lectures-container {
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .upcoming-lectures-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </>
  );
};

export default SchedulePage;
