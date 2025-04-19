"use client";

import { Card, CardBody } from "react-bootstrap";
import Playlist from "./Playlist";
import { FaBookOpen } from "react-icons/fa";

const AllPlayList = ({ course, onVideoSelect }) => {
  // Count total lectures across all modules
  const totalLectures = Object.values(course?.modules || {}).reduce(
    (total, lectures) => total + (Array.isArray(lectures) ? lectures.length : 0),
    0
  );

  return (
    <Card className="shadow p-0 mb-4">
      <div className="d-flex justify-content-between align-items-center p-3 bg-primary bg-opacity-10 border-bottom">
        <h4 className="mb-0 text-primary">
          <FaBookOpen className="me-2" />
          Course Content
        </h4>
        <span className="badge bg-primary">{totalLectures} lectures</span>
      </div>
      <CardBody className="p-3">
        <Playlist course={course} onVideoSelect={onVideoSelect} />
      </CardBody>
    </Card>
  );
};

export default AllPlayList;
