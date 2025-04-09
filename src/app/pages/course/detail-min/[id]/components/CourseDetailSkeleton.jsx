'use client';

import { Col, Container, Row } from "react-bootstrap";

const CourseDetailSkeleton = () => {
  return (
    <div className="course-detail-skeleton">
      {/* Banner Video Skeleton */}
      <section className="py-0 pb-lg-5">
        <Container>
          <Row className="g-3">
            <Col xs={12}>
              <div className="video-player rounded-3">
                <div className="skeleton-box" style={{ height: '500px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '0.5rem' }}></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Course Details Skeleton */}
      <section className="pt-0">
        <Container>
          <Row className="g-lg-5">
            <Col lg={8}>
              <Row className="g-4">
                <Col xs={12}>
                  {/* Title Skeleton */}
                  <div className="skeleton-box" style={{ height: '40px', width: '80%', backgroundColor: '#e9ecef', borderRadius: '0.25rem', marginBottom: '1rem' }}></div>
                  
                  {/* Rating Skeleton */}
                  <div className="d-flex gap-3 mb-4">
                    <div className="skeleton-box" style={{ height: '20px', width: '100px', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box" style={{ height: '20px', width: '120px', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box" style={{ height: '20px', width: '80px', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}></div>
                  </div>
                </Col>
                
                <Col xs={12}>
                  {/* Instructor Skeleton */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="skeleton-box rounded-circle" style={{ height: '80px', width: '80px', backgroundColor: '#e9ecef', marginRight: '1rem' }}></div>
                    <div>
                      <div className="skeleton-box" style={{ height: '20px', width: '150px', backgroundColor: '#e9ecef', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
                      <div className="skeleton-box" style={{ height: '16px', width: '100px', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}></div>
                    </div>
                  </div>
                </Col>
                
                {/* Tabs Skeleton */}
                <Col xs={12}>
                  <div className="d-flex gap-3 mb-4">
                    <div className="skeleton-box" style={{ height: '40px', width: '100px', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box" style={{ height: '40px', width: '100px', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box" style={{ height: '40px', width: '100px', backgroundColor: '#e9ecef', borderRadius: '0.25rem' }}></div>
                  </div>
                  
                  {/* Tab Content Skeleton */}
                  <div className="skeleton-box" style={{ height: '300px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '0.5rem' }}></div>
                </Col>
              </Row>
            </Col>
            
            {/* Sidebar Skeleton */}
            <Col lg={4}>
              <div className="skeleton-box" style={{ height: '500px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '0.5rem' }}></div>
            </Col>
          </Row>
        </Container>
      </section>
      
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
    </div>
  );
};

export default CourseDetailSkeleton;
