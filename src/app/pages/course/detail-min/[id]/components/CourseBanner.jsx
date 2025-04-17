"use client";

import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaBook, FaGraduationCap, FaUsers, FaClock, FaStar } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';

// Create a local DynamicIcon component
const DynamicIcon = ({ iconName, size = 60, color = 'white', fallback }) => {
  // Handle null or undefined iconName
  if (!iconName) {
    console.warn('No icon name provided, using default');
    return fallback || <FaIcons.FaBook size={size} color={color} />;
  }

  // Try to use Font Awesome icons
  try {
    // Check if iconName is a valid Font Awesome icon name
    const IconComponent = FaIcons[iconName]; // Dynamically get the icon

    if (IconComponent) {
      return <IconComponent size={size} color={color} />;
    }
  } catch (error) {
    console.error('Error rendering Font Awesome icon:', error);
  }

  // If all else fails, use a default icon
  return fallback || <FaIcons.FaBook size={size} color={color} />;
};

const CourseBanner = ({ course }) => {
  // Use course color if available, otherwise use default gradient
  const courseColor = course?.course?.color || '#630000';
  const courseIcon = course?.course?.icon || 'FaBook';

  // Helper function to adjust color brightness
  function adjustColor(color, amount) {
    // If color is null or undefined, return a default
    if (!color) return '#C30010';

    // If color doesn't start with #, assume it's a valid color name and return it
    if (!color.startsWith('#')) return color;

    // Remove # if present
    color = color.replace('#', '');

    // Convert to RGB
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Adjust each channel
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  const bgStyle = {
    backgroundImage: `linear-gradient(to right, ${courseColor}, ${adjustColor(courseColor, 30)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '60px 0',
    color: 'white',
  };

  return (
    <div style={bgStyle}>
      <Container>
        <Row className="align-items-center">
          <Col lg={2} md={3} className="text-center mb-4 mb-md-0">
            <div className="course-icon-container bg-white bg-opacity-25 rounded-circle p-4 mx-auto" style={{ width: '120px', height: '120px' }}>
              <DynamicIcon
                iconName={courseIcon}
                size={60}
                color="white"
                fallback={<FaBook size={60} color="white" />}
              />
            </div>
          </Col>
          <Col lg={10} md={9}>
            <h1 className="display-5 fw-bold mb-3">{course?.course?.title}</h1>
            <p className="lead mb-4">{course?.course?.short_description}</p>

            <div className="d-flex flex-wrap gap-3 mb-3">
              <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                <FaGraduationCap className="me-2" />
                {course?.course?.level || 'All Levels'}
              </Badge>

              <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                <FaUsers className="me-2" />
                {course?.course?.enrolled || 0} Students
              </Badge>

              <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                <FaClock className="me-2" />
                {course?.course?.estimatedDuration || '10 hours'}
              </Badge>

              <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                <FaStar className="me-2" />
                {course?.course?.averageRating || 5.0} ({course?.course?.reviewCount || 0} reviews)
              </Badge>
            </div>

            <div className="mt-3">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-lg me-3">
                  <img
                    className="avatar-img rounded-circle"
                    src={course?.course?.instructor?.profilePicture || '/assets/images/avatar/01.jpg'}
                    alt="instructor avatar"
                    width={60}
                    height={60}
                  />
                </div>
                <div>
                  <h6 className="mb-0 text-white">Instructor: {course?.course?.instructor?.fullName || 'Instructor Name'}</h6>
                  <p className="mb-0 small text-white-50">{course?.course?.instructor?.aboutMe || 'Course Instructor'}</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CourseBanner;
