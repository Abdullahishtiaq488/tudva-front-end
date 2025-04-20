'use client';

import { Col, Container, Row, Card } from "react-bootstrap";

const CourseDetailSkeleton = () => {
  return (
    <div className="course-detail-skeleton">
      {/* Course Banner Skeleton - Fixed height to prevent layout shift */}
      <section className="py-4" style={{ background: 'linear-gradient(to right, #7EAA7E, #6A9A6A)', minHeight: '200px' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={2} md={3} className="text-center mb-4 mb-md-0">
              <div className="skeleton-box rounded-circle mx-auto" style={{ width: '120px', height: '120px' }}></div>
            </Col>
            <Col lg={10} md={9}>
              <div className="skeleton-box mb-3" style={{ height: '40px', width: '80%', borderRadius: '0.25rem' }}></div>
              <div className="skeleton-box" style={{ height: '20px', width: '60%', borderRadius: '0.25rem' }}></div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Banner Video Skeleton - Fixed aspect ratio to prevent layout shift */}
      <section className="pt-4 pb-lg-5">
        <Container>
          <Row className="g-4">
            {/* Video player column */}
            <Col lg={8}>
              <div className="video-player-container position-relative rounded-3" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
                <div className="skeleton-box position-absolute top-0 start-0 w-100 h-100" style={{ borderRadius: '0.5rem' }}></div>
              </div>
              <div className="mt-3">
                <div className="skeleton-box mb-2" style={{ height: '24px', width: '70%', borderRadius: '0.25rem' }}></div>
                <div className="skeleton-box" style={{ height: '16px', width: '90%', borderRadius: '0.25rem' }}></div>
              </div>
            </Col>

            {/* Playlist column */}
            <Col lg={4} className="d-none d-lg-block">
              <Card className="shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                  <div className="skeleton-box" style={{ height: '24px', width: '50%', borderRadius: '0.25rem' }}></div>
                  <div className="skeleton-box" style={{ height: '24px', width: '20%', borderRadius: '0.25rem' }}></div>
                </div>
                <Card.Body className="p-3">
                  {/* Module Headers */}
                  <div className="skeleton-box p-3 mb-3" style={{ height: '60px', width: '100%', borderRadius: '0.25rem' }}></div>

                  {/* Lecture Items */}
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="d-flex align-items-center p-2 mb-2" style={{ height: '60px' }}>
                      <div className="skeleton-box rounded-circle me-3" style={{ height: '32px', width: '32px', flexShrink: 0 }}></div>
                      <div className="flex-grow-1">
                        <div className="skeleton-box mb-1" style={{ height: '16px', width: '80%', borderRadius: '0.25rem' }}></div>
                        <div className="skeleton-box" style={{ height: '14px', width: '40%', borderRadius: '0.25rem' }}></div>
                      </div>
                      <div className="skeleton-box ms-2" style={{ height: '16px', width: '40px', borderRadius: '0.25rem', flexShrink: 0 }}></div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Course Details Skeleton */}
      <section className="pt-0">
        <Container>
          <Row className="g-lg-5">
            {/* Main Content */}
            <Col lg={8}>
              {/* Course Tabs Skeleton */}
              <Card className="shadow rounded-2 p-0 mb-4">
                {/* Tabs Skeleton */}
                <Card.Body className="p-0">
                  <Card.Body className="border-bottom px-4 py-3">
                    <div className="d-flex gap-3 mb-0 overflow-x-auto">
                      <div className="skeleton-box" style={{ height: '40px', width: '100px', borderRadius: '0.25rem', flexShrink: 0 }}></div>
                      <div className="skeleton-box" style={{ height: '40px', width: '100px', borderRadius: '0.25rem', flexShrink: 0 }}></div>
                      <div className="skeleton-box" style={{ height: '40px', width: '100px', borderRadius: '0.25rem', flexShrink: 0 }}></div>
                      <div className="skeleton-box" style={{ height: '40px', width: '100px', borderRadius: '0.25rem', flexShrink: 0 }}></div>
                      <div className="skeleton-box" style={{ height: '40px', width: '100px', borderRadius: '0.25rem', flexShrink: 0 }}></div>
                    </div>
                  </Card.Body>

                  {/* Tab Content Skeleton */}
                  <Card.Body className="p-4">
                    {/* Overview Content */}
                    <div className="skeleton-box mb-4" style={{ height: '24px', width: '30%', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box mb-3" style={{ height: '16px', width: '100%', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box mb-3" style={{ height: '16px', width: '100%', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box mb-3" style={{ height: '16px', width: '90%', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box mb-3" style={{ height: '16px', width: '95%', borderRadius: '0.25rem' }}></div>
                    <div className="skeleton-box mb-5" style={{ height: '16px', width: '85%', borderRadius: '0.25rem' }}></div>
                  </Card.Body>
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar Skeleton - Sticky */}
            <Col lg={4}>
              <div className="position-sticky" style={{ top: '100px' }}>
                {/* Pricing Card Skeleton */}
                <Card className="shadow-sm border-0 mb-4">
                  <Card.Body className="p-4">
                    <div className="skeleton-box mb-3" style={{ height: '30px', width: '60%', borderRadius: '0.25rem' }}></div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="skeleton-box" style={{ height: '24px', width: '40%', borderRadius: '0.25rem' }}></div>
                      <div className="skeleton-box" style={{ height: '24px', width: '30%', borderRadius: '0.25rem' }}></div>
                    </div>

                    <div className="skeleton-box mb-4" style={{ height: '50px', width: '100%', borderRadius: '0.25rem' }}></div>
                  </Card.Body>
                </Card>

                {/* Tags Skeleton */}
                <Card className="shadow-sm border-0 mb-4 mt-4">
                  <div className="d-flex align-items-center p-3 bg-light border-bottom">
                    <div className="skeleton-box" style={{ height: '24px', width: '50%', borderRadius: '0.25rem' }}></div>
                  </div>
                  <Card.Body className="p-3">
                    <div className="d-flex flex-wrap gap-2" style={{ overflowX: 'hidden', maxWidth: '100%', wordBreak: 'break-word' }}>
                      <div className="skeleton-box" style={{ height: '32px', width: '120px', borderRadius: '20px' }}></div>
                      <div className="skeleton-box" style={{ height: '32px', width: '100px', borderRadius: '20px' }}></div>
                      <div className="skeleton-box" style={{ height: '32px', width: '80px', borderRadius: '20px' }}></div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
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
    </div>
  );
};

export default CourseDetailSkeleton;
