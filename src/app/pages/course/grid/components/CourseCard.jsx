'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, CardFooter, CardTitle } from "react-bootstrap";
import { FaRegClock, FaRegStar, FaStar, FaStarHalfAlt, FaTable } from "react-icons/fa";
import FavoriteButton from "@/components/common/FavoriteButton";
const CourseCard = ({
  course
}) => {
  // Extract course data with proper fallbacks
  const {
    id,
    image,
    title,
    description,
    rating = { star: 4.5 },
    duration = '3h 15m',
    lectures = 0,
    totalLectures = 0,
    reviewCount = 0,
    badge = { text: 'All Levels', class: 'bg-primary' },
    level = 'All Levels'
  } = course;

  // Calculate total lectures from either lectures or totalLectures
  const lectureCount = lectures || totalLectures || 0;

  // Ensure badge has proper class
  const badgeClass = badge.class || getBadgeClass(level);
  return <Card className="shadow h-100">
    <Image src={image} className="card-img-top" alt="course image" />
    <CardBody className="pb-0">
      <div className="d-flex justify-content-between mb-2">
        <a href="#" className={`badge ${badgeClass} bg-opacity-10`}>{badge.text || level}</a>
        <FavoriteButton courseId={id} variant="link" className="p-0" iconOnly={true} />
      </div>
      <CardTitle><Link href={`/course/${id}`}>{title}</Link></CardTitle>
      <p className="mb-2 text-truncate-2">{description}</p>
      <ul className="list-inline mb-0">
        {Array(Math.floor(rating.star)).fill(0).map((_star, idx) => <li key={idx} className="list-inline-item me-1 small"><FaStar size={14} className="text-warning" /></li>)}
        {!Number.isInteger(rating.star) && <li className="list-inline-item me-1 small"> <FaStarHalfAlt size={14} className="text-warning" /> </li>}
        {rating.star < 5 && Array(5 - Math.ceil(rating.star)).fill(0).map((_star, idx) => <li key={idx} className="list-inline-item me-1 small"><FaRegStar size={14} className="text-warning" /></li>)}
        <li className="list-inline-item ms-2 h6 fw-light mb-0">{rating.star}/5.0</li>
        <li className="list-inline-item ms-2 text-muted">({reviewCount})</li>
      </ul>
    </CardBody>
    <CardFooter className="pt-0 pb-3">
      <hr />
      <div className="d-flex justify-content-between">
        <span className="h6 fw-light mb-0"><FaRegClock className="text-danger me-2" />{duration}</span>
        <span className="h6 fw-light mb-0"><FaTable className="text-orange me-2" />{lectureCount} lectures</span>
      </div>
    </CardFooter>
  </Card>;
};
// Helper function to get badge class based on level
const getBadgeClass = (level) => {
  if (!level) return 'bg-primary';

  const levelLower = level.toLowerCase();
  if (levelLower.includes('beginner')) return 'bg-success';
  if (levelLower.includes('intermediate')) return 'bg-warning';
  if (levelLower.includes('advanced')) return 'bg-danger';
  return 'bg-primary';
};

export default CourseCard;
