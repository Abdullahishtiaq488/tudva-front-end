'use client';

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { users } from '@/data/mockData';
import Image from 'next/image';

const StudentProfilePage = () => {
  return <StudentProfileContent />;
};

const StudentProfileContent = () => {
  const { user, loading } = useAuth();

  // Use mock data if user is not logged in
  const mockUser = users.find(u => u.role === 'learner') || {
    id: '4',
    email: 'learner1@example.com',
    fullName: 'Alice Learner',
    role: 'learner',
    profilePicture: '/assets/images/avatar/04.jpg',
    aboutMe: 'I am a student interested in learning new skills.',
    createdAt: '2023-01-15'
  };

  // Use authenticated user if available, otherwise use mock user
  const displayUser = user || mockUser;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Student Profile</h4>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                {displayUser?.profilePicture ? (
                  <Image
                    src={displayUser.profilePicture}
                    alt={displayUser.fullName || displayUser.name}
                    className="rounded-circle img-thumbnail"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '150px', height: '150px', fontSize: '3rem' }}
                  >
                    {(displayUser?.fullName || displayUser?.name || 'User').charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="mt-3">{displayUser?.fullName || displayUser?.name || 'Student'}</h3>
                <p className="text-muted">{displayUser?.email}</p>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <h5>Role</h5>
                  <p>{displayUser?.role || 'learner'}</p>
                </Col>
                <Col md={6}>
                  <h5>Member Since</h5>
                  <p>{displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <h5>About Me</h5>
                  <p>{displayUser?.aboutMe || 'No information provided.'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfilePage;
