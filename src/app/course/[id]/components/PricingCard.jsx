"use client";

import { useState } from 'react';
import { Button, Card, CardBody, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FaCheck, FaRegClock, FaRegFileAlt, FaRegPlayCircle, FaRegStar, FaShoppingCart, FaUserGraduate } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const PricingCard = ({ course }) => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Extract course data
  const courseData = course?.course || course || {};

  // All courses are free
  const formatPrice = () => {
    return 'Free';
  };

  // Handle enrollment
  const handleEnroll = async () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    try {
      setIsEnrolling(true);

      // Call enrollment API
      const response = await fetch('/api/file-enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully enrolled in the course!');
        // Redirect to course player or dashboard
        router.push(`/course/${courseId}/learn`);
      } else {
        toast.error(data.message || 'Failed to enroll in the course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('An error occurred while enrolling in the course');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardBody className="p-4">
        {/* Free Course */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0 text-primary">{formatPrice()}</h3>
          <span className="badge bg-success">No Enrollment Fee</span>
        </div>

        {/* Course features */}
        <ListGroup variant="flush" className="mb-4 border-top border-bottom">
          <ListGroupItem className="px-0 py-3 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <FaRegClock className="text-primary me-2" />
              <span>Duration</span>
            </div>
            <span className="text-muted">{courseData.estimatedDuration || '10 hours'}</span>
          </ListGroupItem>

          <ListGroupItem className="px-0 py-3 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <FaRegPlayCircle className="text-primary me-2" />
              <span>Lectures</span>
            </div>
            <span className="text-muted">
              {Object.values(course?.modules || {}).reduce(
                (total, lectures) => total + (Array.isArray(lectures) ? lectures.length : 0),
                0
              )} lectures
            </span>
          </ListGroupItem>

          <ListGroupItem className="px-0 py-3 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <FaUserGraduate className="text-primary me-2" />
              <span>Level</span>
            </div>
            <span className="text-muted">{courseData.level || 'All Levels'}</span>
          </ListGroupItem>

          <ListGroupItem className="px-0 py-3 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <FaRegFileAlt className="text-primary me-2" />
              <span>Certificate</span>
            </div>
            <span className="text-muted">Yes</span>
          </ListGroupItem>

          <ListGroupItem className="px-0 py-3 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <i className="fas fa-globe text-primary me-2"></i>
              <span>Language</span>
            </div>
            <span className="text-muted">English</span>
          </ListGroupItem>

          <ListGroupItem className="px-0 py-3 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <i className="fas fa-calendar-alt text-primary me-2"></i>
              <span>Access</span>
            </div>
            <span className="text-muted">Lifetime</span>
          </ListGroupItem>
        </ListGroup>

        {/* Enrollment button */}
        <Button
          variant="primary"
          size="lg"
          className="w-100 mb-3"
          onClick={handleEnroll}
          disabled={isEnrolling}
        >
          {isEnrolling ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enrolling...
            </>
          ) : (
            <>Enroll Now</>
          )}
        </Button>

        {/* Course includes */}
        <h6 className="mb-3 mt-4">This course includes:</h6>
        <ul className="list-group list-group-borderless mb-0">
          <li className="list-group-item px-0 d-flex align-items-center">
            <FaCheck className="text-success me-2" size={14} />
            <span>Full lifetime access</span>
          </li>
          <li className="list-group-item px-0 d-flex align-items-center">
            <FaCheck className="text-success me-2" size={14} />
            <span>Access on mobile and desktop</span>
          </li>
          {courseData.certificate !== false && (
            <li className="list-group-item px-0 d-flex align-items-center">
              <FaCheck className="text-success me-2" size={14} />
              <span>Certificate of completion</span>
            </li>
          )}
          <li className="list-group-item px-0 d-flex align-items-center">
            <FaCheck className="text-success me-2" size={14} />
            <span>Downloadable resources</span>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};

export default PricingCard;
