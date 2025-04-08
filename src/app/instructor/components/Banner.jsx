'use client'

import avatar9 from '@/assets/images/avatar/11.jpg';
import patternImg from '@/assets/images/pattern/04.png';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FaSlidersH } from 'react-icons/fa';
import { checkIsLoggedInUser } from "@/helpers/checkLoggedInUser";
import { useEffect, useState } from 'react';

const Banner = ({ toggleOffCanvas }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Explicit, safer type

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { user, error } = await checkIsLoggedInUser();

        if (error) {
          setError(error || 'Not authenticated');
          return; // Return early if there's an error.
        }

        // Type assertion for user, and handle potential nulls
        setUser(user ? { profilePicture: user.profilePicture, fullName: user.fullName } : null);

      } catch (fetchError) {
        setError(fetchError.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Handle loading and error states *before* rendering the main content
  if (loading) {
    return <div>Loading...</div>;  // Or a more sophisticated loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display the error message
  }

  // Safely access user data (after the loading/error checks)
  const profilePicture = user?.profilePicture || avatar9.src; // Use a default if profilePicture is null/undefined
  const userName = user?.fullName || "Lori Stevens"; // Default name if user.fullName is null


  return (
    <section className="pt-0">
      <Container fluid className="px-0">
        <Card
          className="bg-blue h-100px h-md-200px rounded-0"
          style={{
            background: `url(${patternImg.src}) no-repeat center center`,
            backgroundSize: 'cover',
          }}
        >
        </Card>
      </Container>
      <Container className="mt-n4">
        <Row>
          <Col xs={12}>
            <Card className="bg-transparent card-body pb-0 px-0 mt-2 mt-sm-0">
              <Row className="d-sm-flex justify-sm-content-between mt-2 mt-md-0">
                <Col xs={'auto'}>
                  <div className="avatar avatar-xxl position-relative mt-n3">
                    {/* Always use regular img tag for better compatibility */}
                    <img
                      className="avatar-img rounded-circle border border-white border-3 shadow"
                      src={profilePicture}
                      alt="profile"
                      width={100}
                      height={100}
                      onError={(e) => {
                        console.log('Image failed to load, using default avatar');
                        e.target.src = avatar9.src;
                      }}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </Col>
                <Col className="d-sm-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="my-1 fs-4">{userName}</h1> {/* Use the safe variable */}
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item me-3 mb-1 mb-sm-0">
                        <span className="h6">255</span>
                        &nbsp;<span className="text-body fw-light">points</span>
                      </li>
                      <li className="list-inline-item me-3 mb-1 mb-sm-0">
                        <span className="h6">7</span>
                        &nbsp;<span className="text-body fw-light">Completed courses</span>
                      </li>
                      <li className="list-inline-item me-3 mb-1 mb-sm-0">
                        <span className="h6">52</span>
                        &nbsp;
                        <span className="text-body fw-light">Completed lessons</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-2 mt-sm-0">
                    <Link href="/instructor/create-course" className="btn btn-outline-primary mb-0">
                      Create Course
                    </Link>
                  </div>
                </Col>
              </Row>
            </Card>
            <hr className="d-xl-none" />
            <Col xs={12} xl={3} className="d-flex justify-content-between align-items-center">
              <a className="h6 mb-0 fw-bold d-xl-none" href="#">
                Menu
              </a>
              <button
                onClick={toggleOffCanvas}
                className="btn btn-primary d-xl-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasSidebar"
                aria-controls="offcanvasSidebar"
              >
                <FaSlidersH />
              </button>
            </Col>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Banner;