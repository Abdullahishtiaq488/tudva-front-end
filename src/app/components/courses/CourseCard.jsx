"use client";

import useToggle from "@/hooks/useToggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { FaBaseballBall, FaHeart, FaNode, FaNodeJs, FaPython, FaRegClock, FaRegHeart, FaRegStar, FaSignal, FaStar, FaStarHalfAlt, FaTable } from "react-icons/fa";


import * as FaIcons from "react-icons/fa";

const DynamicIcon = ({ iconName }) => {
  // Check if the iconName is a full URL (from cloud storage)
  if (iconName && (iconName.includes('storage.googleapis.com') || iconName.includes('supabase.co'))) {
    return (
      <img
        src={iconName}
        alt="Course Icon"
        className="w-25"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    );
  }

  // Check if the iconName is a custom icon (contains a file extension)
  if (iconName && (iconName.includes('.png') || iconName.includes('.jpg') || iconName.includes('.svg'))) {
    // Fix the path by removing spaces and ensuring correct format
    const fixedPath = `/assets/all%20icons%2096px/${iconName}`;
    console.log('Using icon path:', fixedPath);

    return (
      <img
        src={fixedPath}
        alt="Course Icon"
        className="w-25"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        onError={(e) => {
          console.error('Failed to load icon:', fixedPath);
          e.target.onerror = null;
          e.target.src = '/assets/images/courses/4by3/01.jpg'; // Fallback image
        }}
      />
    );
  }

  // Otherwise, use Font Awesome icons
  const IconComponent = FaIcons[iconName]; // Dynamically get the icon

  if (!IconComponent) {
    return <p>Icon not found</p>;
  }

  return <IconComponent size={'sm'} className="w-25" />;
};


const CourseCard = ({
  course
}) => {
  const {
    id,
    image,
    title,
    lectures,
    duration,
    rating,
    icon,
    color,
    badge
  } = course;
  const {
    isTrue,
    toggle
  } = useToggle(true);
  const router = useRouter();
  return <Card
    onClick={() => { router.push(`pages/course/detail-min/${id}`) }}
    className="rounded overflow-hidden shadow">
    <Row className="g-0">
      <Col md={4}>
        {/* <Image src={image} className="" alt="card image" /> */}

        <>
          <div className="d-flex justify-content-center align-items-center h-100 opacity-75" style={{ backgroundColor: `${color}`, color: 'white' }}>
            {/* <FaNodeJs size={'sm'} className="w-25" /> */}
            <DynamicIcon iconName={`${icon}`} />


          </div>
        </>

      </Col>
      <Col md={8}>
        <CardBody>
          <div className="d-flex justify-content-between mb-2">
            <CardTitle className="mb-0"><a href="#">{title}</a></CardTitle>
            <span role="button" onClick={toggle}>{isTrue ? <FaRegHeart /> : <FaHeart className="text-danger" />}</span>
          </div>
          <ul className="list-inline mb-1">
            <li className="list-inline-item h6 fw-light mb-1 mb-sm-0"><FaRegClock className="text-danger me-2" />{duration}</li>
            <li className="list-inline-item h6 fw-light mb-1 mb-sm-0"><FaTable className="text-orange me-2" />{lectures} lectures</li>
            <li className="list-inline-item h6 fw-light"><FaSignal className="text-success me-2" />{badge.text}</li>
          </ul>
          <ul className="list-inline mb-0">
            {Array(Math.floor(rating.star)).fill(0).map((_star, idx) => <li key={idx} className="list-inline-item me-1 small">
              <FaStar className="text-warning" />
            </li>)}
            {!Number.isInteger(rating) && <li className="list-inline-item me-1 small">
              <FaStarHalfAlt className="text-warning" />
            </li>}
            {rating.star < 5 && Array(5 - Math.ceil(rating.star)).fill(0).map((_star, idx) => <li key={idx} className="list-inline-item me-1 small">
              <FaRegStar className="text-warning" />
            </li>)}
            <li className="list-inline-item ms-2 h6 fw-light">{rating.star}/5.0</li>
          </ul>
        </CardBody>
      </Col>
    </Row>
  </Card>;
};
export default CourseCard;
