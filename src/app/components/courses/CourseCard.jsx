"use client";

import useToggle from "@/hooks/useToggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { FaBaseballBall, FaHeart, FaNode, FaNodeJs, FaPython, FaRegClock, FaRegHeart, FaRegStar, FaSignal, FaStar, FaStarHalfAlt, FaTable } from "react-icons/fa";


import * as FaIcons from "react-icons/fa";

const DynamicIcon = ({ iconName }) => {
  console.log('Rendering icon:', iconName);

  // Handle null or undefined iconName
  if (!iconName) {
    console.warn('No icon name provided, using default');
    const DefaultIcon = FaIcons.FaBook;
    return <DefaultIcon size={'sm'} className="w-25" />;
  }

  // Check if the iconName is a full URL (from cloud storage)
  if (iconName.includes('storage.googleapis.com') || iconName.includes('supabase.co')) {
    console.log('Using cloud storage URL for icon:', iconName);
    return (
      <img
        src={iconName}
        alt="Course Icon"
        className="w-25"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        onError={(e) => {
          console.error('Failed to load icon from cloud storage URL:', iconName);
          e.target.onerror = null;
          // Use a Font Awesome icon as fallback
          e.target.style.display = 'none';
          e.target.parentNode.innerHTML = '<i class="fas fa-book fs-1 text-primary"></i>';
        }}
      />
    );
  }

  // Check if the iconName is a custom icon (contains a file extension)
  if (iconName.includes('.png') || iconName.includes('.jpg') || iconName.includes('.svg') || iconName.includes('.jpeg') || iconName.includes('.gif')) {
    // Fix the path by removing spaces and ensuring correct format
    // Try different path formats to ensure the icon is found
    const paths = [
      `/assets/all icons 96px/${iconName}`,
      `/assets/all%20icons%2096px/${iconName}`,
      `/assets/icons/${iconName}`,
      `/assets/images/icons/${iconName}`,
      `/assets/images/${iconName}`,
      `/assets/${iconName}`,
      `/${iconName}`
    ];

    console.log('Trying icon paths for file:', iconName);

    return (
      <img
        src={paths[0]}
        alt="Course Icon"
        className="w-25"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        onError={(e) => {
          console.error('Failed to load icon from path:', e.target.src);
          // Try the next path
          const currentPath = e.target.src;
          const currentIndex = paths.findIndex(path => currentPath.endsWith(path));

          if (currentIndex >= 0 && currentIndex < paths.length - 1) {
            console.log('Trying next path:', paths[currentIndex + 1]);
            e.target.src = paths[currentIndex + 1];
          } else {
            console.error('All icon paths failed, using fallback icon');
            e.target.onerror = null;
            // Use a Font Awesome icon as fallback
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<i class="fas fa-book fs-1 text-primary"></i>';
          }
        }}
      />
    );
  }

  // Try to use Font Awesome icons
  try {
    // Check if iconName is a valid Font Awesome icon name
    const IconComponent = FaIcons[iconName]; // Dynamically get the icon

    if (IconComponent) {
      console.log('Using Font Awesome icon:', iconName);
      return <IconComponent size={'sm'} className="w-25" />;
    }
  } catch (error) {
    console.error('Error rendering Font Awesome icon:', error);
  }

  // If all else fails, use a default icon
  console.warn('Icon not found or invalid format:', iconName, 'Using default icon');
  const DefaultIcon = FaIcons.FaBook;
  return <DefaultIcon size={'sm'} className="w-25" />;
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
  // Log the course ID to help with debugging
  console.log('Course card clicked with ID:', id);

  return <Card
    onClick={() => {
      // Use the correct path format with leading slash
      router.push(`/pages/course/detail-min/${id}`);
    }}
    className="rounded overflow-hidden shadow"
    role="button"
    style={{ cursor: 'pointer' }}>
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
