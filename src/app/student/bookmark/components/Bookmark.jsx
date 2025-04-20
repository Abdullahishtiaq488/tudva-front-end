'use client';

import { courses, wishlist, users } from '@/data/mockData';
import { normalizeCourseData } from '@/utils/courseDataNormalizer';
import useToggle from '@/hooks/useToggle';
import Image from 'next/image';
import React from 'react';
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap';
import { FaHeart, FaRegClock, FaRegHeart, FaRegStar, FaStar, FaStarHalfAlt, FaTable } from 'react-icons/fa';
const BookmarkCard = ({
  avatar,
  badge,
  category,
  rating,
  description,
  duration,
  id,
  image,
  label,
  lectures,
  name,
  title
}) => {
  const {
    isTrue: isOpen,
    toggle
  } = useToggle();
  return <Card className="shadow h-100">
    <Image src={image} className="card-img-top" alt="course image" />
    <CardBody className="pb-0">
      <div className="d-flex justify-content-between mb-2">
        <a href="#" className={`badge ${badge.class} bg-opacity-10`}>{badge.text}</a>
        <span role='button' className="text-danger" onClick={toggle}> {isOpen ? <FaHeart /> : <FaRegHeart />}</span>
      </div>
      <CardTitle className="fw-normal"><a href="#">{title}</a></CardTitle>
      <p className="mb-2 text-truncate-2">{description}</p>
      <ul className="list-inline mb-0 icons-center">
        {Array(Math.floor(rating.star)).fill(0).map((_star, idx) => <li key={idx} className="list-inline-item me-1 small"><FaStar size={14} className="text-warning" /></li>)}
        {!Number.isInteger(rating.star) && <li className="list-inline-item me-1 small"> <FaStarHalfAlt size={14} className="text-warning" /> </li>}
        {rating.star < 5 && Array(5 - Math.ceil(rating.star)).fill(0).map((_star, idx) => <li key={idx} className="list-inline-item me-1 small"><FaRegStar size={14} className="text-warning" /></li>)}
        <li className="list-inline-item ms-2 h6 fw-light mb-0">{rating.star}/ 5.0</li>
      </ul>
    </CardBody>
    <CardFooter className="pt-0 pb-3">
      <hr />
      <div className="d-flex justify-content-between">
        <span className="h6 fw-light mb-0"><FaRegClock className="text-danger me-2" />{duration}</span>
        <span className="h6 fw-light mb-0"><FaTable className="text-orange me-2" />{lectures} lectures</span>
      </div>
    </CardFooter>
  </Card>;
};
const Bookmark = () => {
  // Get wishlist courses
  const wishlistCourses = courses.filter(course => {
    // Find if this course is in any user's wishlist (for demo purposes)
    // In a real app, we would filter by the current user's ID
    return wishlist.some(item => item.course_id === course.id);
  });

  return <CardBody className="p-3 p-md-4">
    {wishlistCourses.length === 0 ? (
      <div className="text-center py-5">
        <h5>Your wishlist is empty</h5>
        <p className="mb-0">Add courses to your wishlist to see them here.</p>
        <a href="/pages/course/grid" className="btn btn-primary mt-3">Browse Courses</a>
      </div>
    ) : (
      <Row className="g-4">
        {wishlistCourses.map((course, idx) => {
          // Normalize course data to ensure consistent field names
          const normalizedCourse = normalizeCourseData(course);

          // Calculate total lectures if not provided
          const totalLectures = normalizedCourse.totalLectures ||
            normalizedCourse.lectures ||
            (normalizedCourse.modules ? normalizedCourse.modules.reduce((total, module) => total + module.lectures.length, 0) : 0);

          // Log course data for debugging
          console.log('Course data for bookmark:', normalizedCourse.title, 'Total lectures:', totalLectures);

          return (
            <Col sm={6} lg={4} key={idx}>
              <BookmarkCard
                id={normalizedCourse.id}
                title={normalizedCourse.title}
                description={normalizedCourse.short_description || normalizedCourse.description}
                image={normalizedCourse.image}
                duration={normalizedCourse.duration || `${Math.ceil(totalLectures * 0.75)} hours`}
                lectures={totalLectures}
                rating={{ star: normalizedCourse.rating || 4.5 }}
                badge={normalizedCourse.badge || { text: normalizedCourse.level || 'All Levels', class: 'bg-success' }}
                category={normalizedCourse.category}
                instructor={normalizedCourse.instructor?.fullName || normalizedCourse.instructor?.name}
              />
            </Col>
          );
        })}
      </Row>
    )}
  </CardBody>;
};
export default Bookmark;
