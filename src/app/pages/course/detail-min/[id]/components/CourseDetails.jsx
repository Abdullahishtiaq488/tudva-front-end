import Image from "next/image";
import { Button, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "react-bootstrap";
import { FaCopy, FaFacebookSquare, FaLinkedin, FaSignal, FaStar, FaTwitterSquare, FaUserGraduate } from "react-icons/fa";
import CourseTab from "./CourseTab";
import avatar5 from '@/assets/images/avatar/05.jpg';
import AllPlayList from "./AllPlayList";
import { useState } from "react";
import DebugVideoUrl from "./DebugVideoUrl";

const CourseDetails = ({ course, onVideoSelect }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Function to pass to AllPlayList and Playlist to handle video selection
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    onVideoSelect(video)

    // console.log(video,"video")
    // You might want to trigger the video player here
    // or pass this up to a parent component
    if (window && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!course) {
    return <div>Loading course details...</div>;
  }
  // console.log("course in detail",course)
  return <section className="pt-0">
    <Container>
      <Row className="g-lg-5">
        <Col lg={8}>
          <Row className="g-4">
            <Col xs={12}>
              <h1>{course?.title}</h1>
              <ul className="list-inline mb-0">
                <li className="list-inline-item h6 me-3 mb-1 mb-sm-0"><FaStar className="text-warning me-2" />{course?.averageRating?.toFixed(1) || course?.course?.rating || 5.0}/5.0</li>
                <li className="list-inline-item h6 me-3 mb-1 mb-sm-0"><FaUserGraduate className="text-orange me-2" />{course?.course?.enrolled || 0} Enrolled</li>
                <li className="list-inline-item h6 me-3 mb-1 mb-sm-0"><FaSignal className="text-success me-2" />{course?.course?.level || "Beginner"}</li>
              </ul>
            </Col>
            <Col xs={12}>
              <div className="d-sm-flex justify-content-sm-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-lg">
                    <img
                      className="avatar-img rounded-circle"
                      src={course?.course?.instructor?.avatar || '/assets/images/avatar/01.jpg'}
                      alt="instructor avatar"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0"><a href="#">By {course?.course?.instructor?.name || 'Instructor Name'}</a></h6>
                    <p className="mb-0 small">{course?.course?.instructor?.title || 'Course Instructor'}</p>
                  </div>
                </div>
                <div className="d-flex mt-2 mt-sm-0">
                  <Button variant="danger-soft" size="sm" className="mb-0" href="#">Follow</Button>
                  <Dropdown className="ms-2">
                    <DropdownToggle size="sm" className="btn arrow-none border-0 py-2 mb-0 btn-info-soft small" role="button" id="dropdownShare" aria-expanded="false">
                      share
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare">
                      <li><DropdownItem href=""><FaTwitterSquare className="me-2" />Twitter</DropdownItem></li>
                      <li><DropdownItem href=""><FaFacebookSquare className="me-2" />Facebook</DropdownItem></li>
                      <li><DropdownItem href=""><FaLinkedin className="me-2" />LinkedIn</DropdownItem></li>
                      <li><DropdownItem href=""><FaCopy className="me-2" />Copy link</DropdownItem></li>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </Col>
            <Col xs={12}>
              <CourseTab course={course} />
            </Col>
          </Row>
        </Col>
        <Col lg={4}>
          <AllPlayList course={course} onVideoSelect={handleVideoSelect} />
          <div className="mt-4">
            <h4 className="mb-3">Tags</h4>
            <ul className="list-inline mb-0">
              {course?.tags?.map((tag, id) => (
                <li className="list-inline-item" key={id}>
                  <Button variant="outline-light" size="sm">{tag.tag_name}</Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Debug component to fix video URLs */}
          <DebugVideoUrl courseId={course?.course?.id} />
        </Col>
      </Row>
    </Container>
  </section>;
};
export default CourseDetails;
