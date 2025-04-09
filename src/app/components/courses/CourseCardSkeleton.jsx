'use client';

import { Card, CardBody, Col, Row } from "react-bootstrap";

const CourseCardSkeleton = () => {
  return (
    <Card className="rounded overflow-hidden shadow">
      <Row className="g-0">
        <Col md={4}>
          <div className="skeleton-box" style={{ height: '100%', minHeight: '200px', backgroundColor: '#e9ecef' }}></div>
        </Col>
        <Col md={8}>
          <CardBody>
            <div className="d-flex justify-content-between mb-2">
              <div className="skeleton-box" style={{ height: '24px', width: '70%', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}></div>
              <div className="skeleton-box" style={{ height: '24px', width: '24px', backgroundColor: '#e9ecef', borderRadius: '50%' }}></div>
            </div>
            <ul className="list-inline mb-1">
              <li className="list-inline-item h6 fw-light mb-1 mb-sm-0">
                <div className="skeleton-box" style={{ height: '16px', width: '80px', backgroundColor: '#e9ecef', borderRadius: '0.25rem', display: 'inline-block' }}></div>
              </li>
              <li className="list-inline-item h6 fw-light mb-1 mb-sm-0">
                <div className="skeleton-box" style={{ height: '16px', width: '100px', backgroundColor: '#e9ecef', borderRadius: '0.25rem', display: 'inline-block' }}></div>
              </li>
              <li className="list-inline-item h6 fw-light">
                <div className="skeleton-box" style={{ height: '16px', width: '60px', backgroundColor: '#e9ecef', borderRadius: '0.25rem', display: 'inline-block' }}></div>
              </li>
            </ul>
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-1 small">
                <div className="skeleton-box" style={{ height: '16px', width: '16px', backgroundColor: '#e9ecef', borderRadius: '50%', display: 'inline-block' }}></div>
              </li>
              <li className="list-inline-item me-1 small">
                <div className="skeleton-box" style={{ height: '16px', width: '16px', backgroundColor: '#e9ecef', borderRadius: '50%', display: 'inline-block' }}></div>
              </li>
              <li className="list-inline-item me-1 small">
                <div className="skeleton-box" style={{ height: '16px', width: '16px', backgroundColor: '#e9ecef', borderRadius: '50%', display: 'inline-block' }}></div>
              </li>
              <li className="list-inline-item me-1 small">
                <div className="skeleton-box" style={{ height: '16px', width: '16px', backgroundColor: '#e9ecef', borderRadius: '50%', display: 'inline-block' }}></div>
              </li>
              <li className="list-inline-item me-1 small">
                <div className="skeleton-box" style={{ height: '16px', width: '16px', backgroundColor: '#e9ecef', borderRadius: '50%', display: 'inline-block' }}></div>
              </li>
              <li className="list-inline-item ms-2 h6 fw-light">
                <div className="skeleton-box" style={{ height: '16px', width: '40px', backgroundColor: '#e9ecef', borderRadius: '0.25rem', display: 'inline-block' }}></div>
              </li>
            </ul>
          </CardBody>
        </Col>
      </Row>
      
      <style jsx>{`
        .skeleton-box {
          position: relative;
          overflow: hidden;
        }
        
        .skeleton-box::after {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
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
