"use client";

import Image from "next/image";
import { Badge, Button, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "react-bootstrap";
import { FaBookOpen, FaClock, FaCopy, FaFacebookSquare, FaGlobe, FaGraduationCap, FaLinkedin, FaMedal, FaPlay, FaShareAlt, FaSignal, FaStar, FaStopwatch, FaTwitterSquare, FaUserClock, FaUserGraduate } from "react-icons/fa";
import { useState } from "react";
import GlightBox from "@/components/GlightBox";
import { currency } from "@/context/constants";
import CourseTab from "./CourseTab";
import AllPlayList from "./AllPlayList";


const CourseDetails = ({ course, onVideoSelect, selectedVideo }) => {
  // Initialize component with course data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Log course data for debugging
  console.log('Course data in CourseDetails:', course);

  const handleVideoSelect = (video) => {
    // Handle video selection
    if (onVideoSelect && video && video.videoUrl) {
      onVideoSelect(video);
    }
  };

  // Create a pricing card component
  const PricingCard = () => {
    return (
      <Card className="shadow p-0 mb-4 z-index-9">
        <div className="d-flex justify-content-between align-items-center p-3 bg-primary bg-opacity-10 border-bottom">
          <h4 className="mb-0 text-primary">Course Details</h4>
        </div>
        <CardBody className="px-3 pt-3">

          <ul className="list-group list-group-borderless mb-3">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="h6 fw-light mb-0">
                <FaUserClock className="text-primary me-2" />
                Duration
              </span>
              <span>{course?.duration || course?.estimatedDuration || '10 hours'}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="h6 fw-light mb-0">
                <FaSignal className="text-primary me-2" />
                Level
              </span>
              <span>{course?.level || 'Beginner'}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="h6 fw-light mb-0">
                <FaUserGraduate className="text-primary me-2" />
                Instructor
              </span>
              <span>{course?.instructor?.fullName || course?.instructor?.name || 'Instructor'}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="h6 fw-light mb-0">
                <FaGlobe className="text-primary me-2" />
                Language
              </span>
              <span>{course?.language || 'English'}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="h6 fw-light mb-0">
                <FaBookOpen className="text-primary me-2" />
                Lectures
              </span>
              <span>{course?.totalLectures || course?.lectures || (course?.modules ? course.modules.reduce((total, module) => total + module.lectures.length, 0) : 0)} lectures</span>
            </li>
          </ul>
        </CardBody>
        <CardBody className="pt-0">
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="lg"
              className="mb-0"
              onClick={() => {
                // Check if user is logged in
                const isLoggedIn = localStorage.getItem('token');
                if (!isLoggedIn) {
                  // Redirect to login page
                  window.location.href = '/auth/sign-in';
                  return;
                }

                // Show enrollment confirmation
                if (window.confirm('Are you sure you want to enroll in this course?')) {
                  // Call enrollment API
                  fetch('/api/file-booking', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      course_id: course?.id,
                    }),
                  })
                    .then(response => response.json())
                    .then(data => {
                      if (data.success) {
                        alert('You have successfully enrolled in this course!');
                      } else {
                        alert(data.error || 'Failed to enroll in course. Please try again.');
                      }
                    })
                    .catch(error => {
                      // Handle enrollment error
                      alert('Failed to enroll in course. Please try again.');
                    });
                }
              }}
            >
              <FaGraduationCap className="me-2" />
              Enroll Now
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  };

  // Custom CSS to prevent horizontal scrollbar
  const customStyles = `
    .tag-container {
      overflow-x: hidden;
      max-width: 100%;
      word-break: break-word;
    }
    .tag-badge {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;

  return (
    <>
      <style jsx>{customStyles}</style>
      <section className="pb-0 py-lg-5">
        <Container>
          <Row className="g-4">
            {/* Main content */}
            <Col lg={8}>
              {/* Course tabs */}
              <CourseTab course={course} />
            </Col>

            {/* Sidebar - Sticky */}
            <Col lg={4}>
              <div className="sticky-sidebar">
                <div>
                  {/* Pricing Card */}
                  <PricingCard course={course} />

                  {/* Tags */}
                  {course?.tags && course.tags.length > 0 && (
                    <Card className="shadow p-0 mb-4 mt-4">
                      <div className="d-flex align-items-center p-3 bg-primary bg-opacity-10 border-bottom">
                        <h4 className="mb-0 text-primary">Tags</h4>
                      </div>
                      <CardBody className="p-3">
                        <div className="d-flex flex-wrap gap-2 tag-container">
                          {course.tags.map((tag, idx) => (
                            <Badge key={idx} bg="light" text="dark" className="px-3 py-2 tag-badge">
                              {typeof tag === 'string' ? tag : tag.tag_name || tag}
                            </Badge>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default CourseDetails;
