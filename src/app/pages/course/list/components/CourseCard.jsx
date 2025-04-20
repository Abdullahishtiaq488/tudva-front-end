import useToggle from "@/hooks/useToggle";
import Image from "next/image";
import Link from "next/link";
import { Button, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { FaHeart, FaRegClock, FaRegHeart, FaSignal, FaStar, FaTable } from "react-icons/fa";
import FavoriteButton from "@/components/common/FavoriteButton";
const CourseCard = ({
  course
}) => {
  const {
    isTrue,
    toggle
  } = useToggle();
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
    level = 'All Levels',
    price = 0,
    instructor = {},
    category = 'Development'
  } = course;

  // Calculate total lectures from either lectures or totalLectures
  const lectureCount = lectures || totalLectures || 0;

  // Get instructor data
  const avatar = instructor?.profilePicture || '/assets/images/avatar/01.jpg';
  const name = instructor?.fullName || instructor?.name || 'Instructor';
  return <Card className="shadow overflow-hidden p-2">
    <Row className="g-0">
      <Col md={5} className="overflow-hidden">
        <Image src={image} className="rounded-2" alt="Card image" />
        {price === 0 && <div className="card-img-overlay">
          <div className="ribbon"><span>Free</span></div>
        </div>}
      </Col>
      <Col md={7}>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <a href="#" className="badge text-bg-primary mb-2 mb-sm-0">{category}</a>
            <div>
              <span className="h6 fw-light me-3"><FaStar className="text-warning me-1" />{rating.star}</span>
              <FavoriteButton courseId={id} variant="link" className="p-0" iconOnly={true} />
            </div>
          </div>
          <CardTitle><Link href={`/course/${id}`}>{title}</Link></CardTitle>
          <p className="text-truncate-2 d-none d-lg-block">{description}</p>
          <ul className="list-inline">
            <li className="list-inline-item h6 fw-light mb-1 mb-sm-0"><FaRegClock className="text-danger me-2" />{duration}</li>
            <li className="list-inline-item h6 fw-light mb-1 mb-sm-0"><FaTable className="text-orange me-2" />{lectureCount} lectures</li>
            <li className="list-inline-item h6 fw-light"><FaSignal className="text-success me-2" />{badge.text || level}</li>
          </ul>
          <div className="d-sm-flex justify-content-sm-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="avatar">
                <Image className="avatar-img rounded-circle" src={avatar} alt="avatar" />
              </div>
              <p className="mb-0 ms-2"><a href="#" className="h6 fw-light">{name}</a></p>
            </div>
            <div className="mt-3 mt-sm-0">
              <Button variant="dark" onClick={() => window.location.href = `/course/${id}`}>View more</Button>
            </div>
          </div>
        </CardBody>
      </Col>
    </Row>
  </Card>;
};
export default CourseCard;
