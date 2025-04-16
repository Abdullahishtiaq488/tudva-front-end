'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import WeeklyCalendar from '../dashboard/components/WeeklyCalendar';
import UpcomingLectures from '../dashboard/components/UpcomingLectures';


const SchedulePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try file-based API first
        const response = await fetch('/api/file-enrollments/user');

        if (!response.ok) {
          // If file-based API fails, try the database API
          const dbResponse = await fetch('/api/enrollments/user');

          if (!dbResponse.ok) {
            throw new Error('Failed to fetch enrolled courses');
          }

          const data = await dbResponse.json();
          if (data.success && data.enrollments) {
            setEnrolledCourses(data.enrollments.map(enrollment => enrollment.course));
          } else {
            throw new Error(data.message || 'No enrolled courses found');
          }
        } else {
          const data = await response.json();
          if (data.success && data.enrollments) {
            setEnrolledCourses(data.enrollments.map(enrollment => enrollment.course));
          } else {
            throw new Error(data.message || 'No enrolled courses found');
          }
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError(err.message || 'Failed to load your enrolled courses');

        // Generate mock courses for demo purposes
        generateMockCourses();
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Generate mock courses for demo purposes
  const generateMockCourses = () => {
    const mockCourses = [
      {
        id: 'mock-1',
        title: 'Introduction to Web Development',
        format: 'recorded',
        image: '/images/courses/course-1.jpg'
      },
      {
        id: 'mock-2',
        title: 'Advanced JavaScript Concepts',
        format: 'live',
        image: '/images/courses/course-2.jpg'
      },
      {
        id: 'mock-3',
        title: 'React.js Fundamentals',
        format: 'recorded',
        image: '/images/courses/course-3.jpg'
      },
      {
        id: 'mock-4',
        title: 'Node.js Backend Development',
        format: 'live',
        image: '/images/courses/course-4.jpg'
      },
      {
        id: 'mock-5',
        title: 'Database Design and SQL',
        format: 'recorded',
        image: '/images/courses/course-5.jpg'
      }
    ];

    setEnrolledCourses(mockCourses);
  };

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
        <Col lg={8}>
          <WeeklyCalendar enrolledCourses={enrolledCourses} />
        </Col>
        <Col lg={4}>
          <UpcomingLectures enrolledCourses={enrolledCourses} />
        </Col>
      </Row>
    </>
  );
};

export default SchedulePage;
