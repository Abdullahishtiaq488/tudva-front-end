'use client';

import { Card, CardBody, Col, Row, Badge } from "react-bootstrap";

const CourseCardSkeleton = ({ variant = 'horizontal' }) => {
  // Horizontal card skeleton (default)
  if (variant === 'horizontal') {
    return (
      <Card className="rounded overflow-hidden shadow h-100 course-card-skeleton">
        <Row className="g-0">
          <Col md={4}>
            <div className="skeleton-box" style={{ height: '100%', minHeight: '200px' }}></div>
          </Col>
          <Col md={8}>
            <CardBody>
              <div className="d-flex justify-content-between mb-2">
                <div className="skeleton-box" style={{ height: '24px', width: '70%', borderRadius: '0.25rem' }}></div>
                <div className="skeleton-box" style={{ height: '24px', width: '24px', borderRadius: '50%' }}></div>
              </div>
              <ul className="list-inline mb-1">
                <li className="list-inline-item h6 fw-light mb-1 mb-sm-0">
                  <div className="skeleton-box" style={{ height: '16px', width: '80px', borderRadius: '0.25rem', display: 'inline-block' }}></div>
                </li>
                <li className="list-inline-item h6 fw-light mb-1 mb-sm-0">
                  <div className="skeleton-box" style={{ height: '16px', width: '100px', borderRadius: '0.25rem', display: 'inline-block' }}></div>
                </li>
                <li className="list-inline-item h6 fw-light">
                  <div className="skeleton-box" style={{ height: '16px', width: '60px', borderRadius: '0.25rem', display: 'inline-block' }}></div>
                </li>
              </ul>
              <div className="d-flex align-items-center mb-3">
                <div className="skeleton-box me-2" style={{ height: '20px', width: '100px', borderRadius: '0.25rem' }}></div>
                <div className="skeleton-box" style={{ height: '20px', width: '80px', borderRadius: '0.25rem' }}></div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="skeleton-box" style={{ height: '24px', width: '100px', borderRadius: '0.25rem' }}></div>
                <div className="skeleton-box" style={{ height: '36px', width: '100px', borderRadius: '0.25rem' }}></div>
              </div>
            </CardBody>
          </Col>
        </Row>
      </Card>
    );
  }

  // Vertical card skeleton
  return (
    <Card className="rounded overflow-hidden shadow h-100 course-card-skeleton">
      <div className="skeleton-box" style={{ height: '200px' }}></div>
      <CardBody>
        <div className="d-flex justify-content-between mb-2">
          <div className="skeleton-box" style={{ height: '20px', width: '70%', borderRadius: '0.25rem' }}></div>
          <div className="skeleton-box" style={{ height: '20px', width: '20px', borderRadius: '50%' }}></div>
        </div>
        <div className="d-flex align-items-center mb-3">
          <div className="skeleton-box rounded-circle me-2" style={{ height: '30px', width: '30px' }}></div>
          <div className="skeleton-box" style={{ height: '16px', width: '120px', borderRadius: '0.25rem' }}></div>
        </div>
        <div className="d-flex align-items-center mb-3">
          <div className="skeleton-box me-2" style={{ height: '20px', width: '100px', borderRadius: '0.25rem' }}></div>
          <div className="skeleton-box" style={{ height: '20px', width: '80px', borderRadius: '0.25rem' }}></div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="skeleton-box" style={{ height: '24px', width: '80px', borderRadius: '0.25rem' }}></div>
          <div className="skeleton-box" style={{ height: '36px', width: '100px', borderRadius: '0.25rem' }}></div>
        </div>
      </CardBody>

      <style jsx>{`
        .course-card-skeleton {
          transition: transform 0.3s ease;
        }

        .skeleton-box {
          position: relative;
          overflow: hidden;
          background-color: #e9ecef;
        }

        .skeleton-box::after {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Card>
  );
};

export default CourseCardSkeleton;
