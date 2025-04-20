"use client";

import { Fragment, useState, useEffect } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from "react-bootstrap";
import { FaCheck, FaRegClock, FaStar } from "react-icons/fa";
import * as FaIcons from 'react-icons/fa';
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import LectureScheduleDisplay from "./LectureScheduleDisplay";
import Image from "next/image";

// Helper function to split an array into chunks
const splitArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

// Overview component
const Overview = ({ course }) => {
  // Log course data for debugging
  console.log('Course data in Overview:', course);

  // Extract course details - directly use course object from our mock data
  const courseData = course || {};

  return (
    <>
      <h5 className="mb-3">Course Description</h5>
      <div className="mb-4" dangerouslySetInnerHTML={{ __html: courseData.description || '' }} />

      {courseData.prerequisites && (
        <>
          <h5 className="mb-3 mt-4">Prerequisites</h5>
          <ul className="list-group list-group-borderless mb-4">
            {(Array.isArray(courseData.prerequisites) ? courseData.prerequisites : [courseData.prerequisites]).map((prereq, idx) => (
              <li key={idx} className="list-group-item d-flex align-items-center">
                <i className="fas fa-check-circle text-success me-2"></i>
                {prereq}
              </li>
            ))}
          </ul>
        </>
      )}

      {courseData.targetAudience && (
        <>
          <h5 className="mb-3 mt-4">Who This Course is For</h5>
          <p>{courseData.targetAudience}</p>
        </>
      )}
    </>
  );
};

// Schedule component
const Schedule = ({ course }) => {
  // Log course data for debugging
  console.log('Course data in Schedule:', course);

  return (
    <>
      <h5 className="mb-3">Course Schedule</h5>
      <LectureScheduleDisplay
        courseId={course?.id}
        courseType={course?.courseType || course?.format || 'recorded'}
      />
    </>
  );
};

// UserReviews component
const UserReviews = ({ course }) => {
  // Log course data for debugging
  console.log('Course data in UserReviews:', course);

  // Get course ID from course data
  const courseId = course?.id;
  const [hasReviews, setHasReviews] = useState(false);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Check if the course has any reviews
  useEffect(() => {
    const checkReviews = async () => {
      if (!courseId) return;

      try {
        // Try to get reviews count from API
        const response = await fetch(`/api/file-reviews/course/${courseId}/count`);
        const data = await response.json();

        if (data.success && data.count > 0) {
          setHasReviews(true);
          setReviewsCount(data.count);
        } else {
          setHasReviews(false);
          setReviewsCount(0);
        }
      } catch (error) {
        console.error('Error checking reviews:', error);
        setHasReviews(false);
      }
    };

    checkReviews();
  }, [courseId]);

  if (!courseId) {
    return (
      <div className="text-center py-4">
        <p>Course information not available.</p>
        <p className="text-muted small">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }

  // If there are no reviews, show a message with a button to add a review
  if (!hasReviews) {
    return (
      <div className="text-center py-4">
        <h5 className="mb-3">No Reviews Yet</h5>
        <p>This course doesn't have any reviews yet. Be the first to review!</p>
        <Button
          variant="primary"
          onClick={() => setShowReviewForm(true)}
          className="mt-3"
        >
          Write a Review
        </Button>

        {showReviewForm && (
          <div className="mt-4 text-start">
            <ReviewForm
              courseId={courseId}
              onReviewSubmitted={async (data) => {
                try {
                  const response = await fetch('/api/file-reviews', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      course_id: courseId,
                      content: data.content,
                      rating: data.rating,
                    }),
                  });

                  const result = await response.json();

                  if (result.success) {
                    setShowReviewForm(false);
                    setHasReviews(true);
                    setReviewsCount(1);
                    return { success: true };
                  } else {
                    return { success: false, error: result.error || 'Failed to submit review' };
                  }
                } catch (error) {
                  console.error('Error submitting review:', error);
                  return { success: false, error: error.message || 'Failed to submit review' };
                }
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowReviewForm(false)}
              className="mt-2"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Row className="mb-4">
        <h5 className="mb-4">Our Student Reviews ({reviewsCount})</h5>
        <Col md={12}>
          <div className="mb-4">
            <ReviewList courseId={courseId} />
          </div>

          {!showReviewForm && (
            <Button
              variant="primary"
              onClick={() => setShowReviewForm(true)}
              className="mt-3"
            >
              Write a Review
            </Button>
          )}

          {showReviewForm && (
            <div className="mt-4 border p-4 rounded bg-light">
              <h5 className="mb-3">Write Your Review</h5>
              <ReviewForm
                courseId={courseId}
                onReviewSubmitted={async (data) => {
                  try {
                    const response = await fetch('/api/file-reviews', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        course_id: courseId,
                        content: data.content,
                        rating: data.rating,
                      }),
                    });

                    const result = await response.json();

                    if (result.success) {
                      setShowReviewForm(false);
                      // Refresh the page to show the new review
                      window.location.reload();
                      return { success: true };
                    } else {
                      return { success: false, error: result.error || 'Failed to submit review' };
                    }
                  } catch (error) {
                    console.error('Error submitting review:', error);
                    return { success: false, error: error.message || 'Failed to submit review' };
                  }
                }}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowReviewForm(false)}
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

// FAQs component
const FAQs = ({ course }) => {
  // Log course data for debugging
  console.log('Course data in FAQs:', course);

  const courseData = course || {};
  const faqs = courseData.faqs || [];

  // Default FAQs if none are provided
  const defaultFaqs = [
    {
      question: 'How long do I have access to the course?',
      answer: 'You will have lifetime access to this course after enrollment.'
    },
    {
      question: 'Can I download the course materials?',
      answer: 'Yes, all lecture materials are downloadable for enrolled students.'
    },
    {
      question: 'Is there a certificate upon completion?',
      answer: 'Yes, you will receive a certificate of completion after finishing all course modules.'
    },
    {
      question: 'What if I am not satisfied with the course?',
      answer: 'We offer a 30-day money-back guarantee if you are not satisfied with the course.'
    }
  ];

  // Use provided FAQs or default ones if none exist
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <>
      <h5 className="mb-4">Frequently Asked Questions</h5>
      <Accordion defaultActiveKey="0" className="accordion-icon accordion-bg-light">
        {displayFaqs.map((faq, index) => (
          <AccordionItem eventKey={index.toString()} key={index} className="mb-3 border rounded-3 overflow-hidden">
            <AccordionHeader className="bg-light">
              <h6 className="mb-0 fw-bold">{faq.question}</h6>
            </AccordionHeader>
            <AccordionBody className="p-3">
              <p className="mb-0">{faq.answer}</p>
            </AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

const CourseTab = ({ course }) => {
  return (
    <TabContainer defaultActiveKey='overview'>
      <Card className="shadow rounded-2 p-0">
        <CardBody className="p-0">
          <CardBody className="border-bottom px-4 py-3">
            <Nav className="nav-pills nav-tabs-line py-0" id="course-pills-tab" role="tablist">
              <NavItem className="me-2 me-sm-4" role="presentation">
                <NavLink as='button' className="mb-2 mb-md-0" type="button" eventKey="overview">Overview</NavLink>
              </NavItem>
              <NavItem className="me-2 me-sm-4" role="presentation">
                <NavLink as='button' className="mb-2 mb-md-0" type="button" eventKey="curriculum">Schedule</NavLink>
              </NavItem>
              <NavItem className="me-2 me-sm-4" role="presentation">
                <NavLink as='button' className="mb-2 mb-md-0" type="button" eventKey="instructor">Instructor</NavLink>
              </NavItem>
              <NavItem className="me-2 me-sm-4" role="presentation">
                <NavLink as='button' className="mb-2 mb-md-0" type="button" eventKey="reviews">Reviews</NavLink>
              </NavItem>
              <NavItem className="me-2 me-sm-4" role="presentation">
                <NavLink as='button' className="mb-2 mb-md-0" type="button" eventKey="faqs">FAQs</NavLink>
              </NavItem>
            </Nav>
          </CardBody>
          <CardBody className="p-4">
            <TabContent id="course-pills-tabContent">
              <TabPane eventKey='overview' className="fade" role="tabpanel">
                <Overview course={course} />
              </TabPane>
              <TabPane eventKey='curriculum' className="fade" role="tabpanel">
                <Schedule course={course} />
              </TabPane>
              <TabPane eventKey='instructor' className="fade" role="tabpanel">
                <div className="d-sm-flex align-items-start mb-4">
                  <div className="avatar avatar-xxl">
                    <Image
                      className="avatar-img rounded-circle shadow-sm"
                      src={course?.instructor?.profilePicture || '@/assets/images/avatar/01.jpg'}
                      alt={course?.instructor?.fullName || course?.instructor?.name || 'Instructor'}
                    />
                  </div>
                  <div className="ms-sm-4 mt-3">
                    <h3 className="mb-1">{course?.instructor?.fullName || course?.instructor?.name || 'Instructor Name'}</h3>
                    <p className="mb-2 text-primary">{course?.instructor?.title || 'Course Instructor'}</p>

                    <div className="d-flex align-items-center mb-3">
                      {course?.instructor?.rating && (
                        <div className="d-flex me-4">
                          <div className="text-warning me-2">
                            <FaStar size={14} />
                          </div>
                          <span className="h6 fw-light mb-0">{course?.instructor?.rating} Instructor Rating</span>
                        </div>
                      )}

                      {course?.instructor?.reviewCount && (
                        <div className="d-flex me-4">
                          <span className="h6 fw-light mb-0">{course?.instructor?.reviewCount} Reviews</span>
                        </div>
                      )}

                      {course?.instructor?.studentCount && (
                        <div className="d-flex">
                          <span className="h6 fw-light mb-0">{course?.instructor?.studentCount} Students</span>
                        </div>
                      )}
                    </div>

                    <p className="mb-3">{course?.instructor?.aboutMe || 'Information about the instructor is not available.'}</p>

                    {course?.instructor?.socialLinks && (
                      <div className="d-flex">
                        {course?.instructor?.socialLinks.map((link, idx) => (
                          <a key={idx} href={link.url} className="btn btn-sm btn-outline-light me-2" target="_blank" rel="noopener noreferrer">
                            <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {course?.instructor?.expertise && (
                  <div className="mt-4">
                    <h5 className="mb-3">Expertise</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {course?.instructor?.expertise.map((skill, idx) => (
                        <span key={idx} className="badge bg-light text-dark p-2">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </TabPane>
              <TabPane eventKey='reviews' className="fade" role="tabpanel">
                <UserReviews course={course} />
              </TabPane>
              <TabPane eventKey='faqs' className="fade" role="tabpanel">
                <FAQs course={course} />
              </TabPane>
            </TabContent>
          </CardBody>
        </CardBody>
      </Card>
    </TabContainer>
  );
};

export default CourseTab;
