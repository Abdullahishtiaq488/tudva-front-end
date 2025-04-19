"use client";

import { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button } from "react-bootstrap";
import { FaPlay, FaLock, FaCheckCircle } from "react-icons/fa";
import clsx from "clsx";
import { Fragment } from "react";

const Playlist = ({ course, onVideoSelect }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Handle video selection
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    if (onVideoSelect) {
      onVideoSelect(video);
    }
  };

  // Early return if no course data
  if (!course || !course.modules) {
    return <div>Loading course content...</div>;
  }

  // Ensure all modules have valid video arrays
  const validModules = {};
  Object.entries(course.modules).forEach(([moduleName, videos]) => {
    // Check if videos is an array
    if (Array.isArray(videos) && videos.length > 0) {
      validModules[moduleName] = videos;
    }
  });

  return (
    <Accordion defaultActiveKey='0' className="accordion-icon accordion-bg-light border-0" id="accordionExample2">
      {Object.entries(validModules).map(([moduleName, videos], moduleIdx) => (
        <AccordionItem
          eventKey={`${moduleIdx}`}
          className={clsx(Object.keys(validModules).length - 1 !== moduleIdx ? "mb-3" : "mb-0")}
          key={moduleIdx}
        >
          <AccordionHeader as='h6' className="font-base bg-light rounded-3" id={`heading-${moduleIdx}`}>
            <div className="fw-bold d-flex justify-content-between align-items-center w-100">
              <div>
                <span className="mb-0 text-primary">{moduleName}</span>
                <span className="small d-block mt-1 text-muted">({videos.length} Lectures)</span>
              </div>
              <span className="badge bg-primary rounded-pill">{moduleIdx + 1}</span>
            </div>
          </AccordionHeader>
          <AccordionBody className="mt-3">
            <div className="vstack gap-3">
              <div className="overflow-hidden">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <div className="text-primary me-2">
                      <FaPlay size={12} />
                    </div>
                    <p className="mb-0 small">
                      <span className="fw-bold">{Array.isArray(videos) ? videos.filter(video => video.watched).length : 0}</span> of <span className="fw-bold">{videos.length}</span> completed
                    </p>
                  </div>
                  <h6 className="mb-0 badge bg-success rounded-pill">
                    {videos.length > 0
                      ? Math.round(((Array.isArray(videos) ? videos.filter(video => video.watched).length : 0) / videos.length) * 100)
                      : 0}%
                  </h6>
                </div>
                <div className="progress progress-sm bg-light" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width: `${videos.length > 0
                        ? Math.round(((Array.isArray(videos) ? videos.filter(video => video.watched).length : 0) / videos.length) * 100)
                        : 0}%`,
                      height: '6px'
                    }}
                    aria-valuenow={videos.length > 0
                      ? Math.round(((Array.isArray(videos) ? videos.filter(video => video.watched).length : 0) / videos.length) * 100)
                      : 0}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>

              {videos.map((video, idx) => {
                // Only the first lecture is accessible, others are locked
                if (idx === 0 || video.isDemoLecture) {
                  return (
                    <Fragment key={video.id || idx}>
                      {video.id === selectedVideo?.id ? (
                        <div className="p-2 bg-success bg-opacity-10 rounded-3 border border-success">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="position-relative d-flex align-items-center">
                              <Button
                                variant="success"
                                size="sm"
                                className="btn btn-round btn-sm mb-0 stretched-link position-static"
                              >
                                <FaPlay className="me-0" size={11} />
                              </Button>
                              <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-bold text-success w-200px">
                                {video.title}
                              </span>
                            </div>
                            <p className="mb-0 text-truncate badge bg-success text-white">Playing</p>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center p-2 rounded-3 hover-bg-light">
                          <div className="position-relative d-flex align-items-center">
                            <Button
                              variant="primary"
                              size="sm"
                              className="btn btn-round btn-sm mb-0 stretched-link"
                              onClick={() => handleVideoClick(video)}
                            >
                              <FaPlay className="me-0" size={11} />
                            </Button>
                            <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-200px">
                              {video.title}
                            </span>
                          </div>
                          <p className="mb-0 text-truncate badge bg-light text-dark">
                            {video.duration || "10:00"}
                          </p>
                        </div>
                      )}
                    </Fragment>
                  );
                } else {
                  // Locked lecture
                  return (
                    <Fragment key={video.id || idx}>
                      <div className="p-2 bg-light rounded-3 border border-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="position-relative d-flex align-items-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="btn btn-round mb-0 position-static"
                              disabled={true}
                            >
                              <FaLock className="me-0" size={11} />
                            </Button>
                            <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-200px text-muted">
                              {video.title}
                            </span>
                          </div>
                          <p className="mb-0 text-truncate badge bg-secondary text-white">
                            Locked
                          </p>
                        </div>
                      </div>
                    </Fragment>
                  );
                }
              })}
            </div>
          </AccordionBody>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Playlist;
