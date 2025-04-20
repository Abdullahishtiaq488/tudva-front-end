"use client";

import { useState, useEffect } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button } from "react-bootstrap";
import { FaPlay, FaLock, FaCheckCircle } from "react-icons/fa";
import clsx from "clsx";
import { Fragment } from "react";

const Playlist = ({ course, onVideoSelect, selectedVideo: propSelectedVideo }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Update selected video when it changes from props
  useEffect(() => {
    if (propSelectedVideo && propSelectedVideo.videoUrl) {
      setSelectedVideo(propSelectedVideo);
    }
  }, [propSelectedVideo]);

  // Handle video selection
  const handleVideoClick = (video) => {
    // Only handle videos that have a videoUrl
    if (video && video.videoUrl) {
      setSelectedVideo(video);
      if (onVideoSelect) {
        onVideoSelect(video);
        // Scroll to top to show the video player
        if (typeof window !== 'undefined' && window.scrollTo) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } else {
      alert('This video does not have a playable URL.');
    }
  };

  // Early return if no course data
  if (!course) {
    return <div>Loading course content...</div>;
  }

  // Log course data for debugging
  console.log('Course data in Playlist:', course);

  // Ensure modules exist and are in the correct format
  const modules = course.modules || [];

  // Convert modules array to the format expected by the component
  const validModules = {};

  if (Array.isArray(modules)) {
    // If modules is an array (our centralized mock data format)
    modules.forEach(module => {
      validModules[module.title] = module.lectures || [];
    });
  } else if (typeof modules === 'object') {
    // If modules is already an object (old format)
    Object.entries(modules).forEach(([moduleName, videos]) => {
      // Check if videos is an array
      if (Array.isArray(videos)) {
        validModules[moduleName] = videos;
      } else {
        // If not an array, create an empty array
        validModules[moduleName] = [];
      }
    });
  }

  // If no modules exist, create a default empty module
  if (Object.keys(validModules).length === 0) {
    validModules['Module 1'] = [];
  }

  // Check if we have any modules with videos
  const hasContent = Object.values(validModules).some(videos => videos.length > 0);

  // If no content, show a message
  if (!hasContent && Object.keys(validModules).length === 1) {
    return (
      <div className="text-center py-4">
        <p className="mb-0">This course doesn't have any content yet.</p>
        <p className="text-muted small">Check back later for updates.</p>
      </div>
    );
  }

  return (
    <Accordion defaultActiveKey='0' className="accordion-icon accordion-bg-light border-0" id="accordionExample2">
      {Object.entries(validModules).map(([moduleName, videos], moduleIdx) => (
        <AccordionItem
          eventKey={`${moduleIdx}`}
          className={clsx(Object.keys(validModules).length - 1 !== moduleIdx ? "mb-3" : "mb-0", "border rounded-3 overflow-hidden")}
          key={moduleIdx}
        >
          <AccordionHeader as='h6' className="font-base bg-light" id={`heading-${moduleIdx}`}>
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

              {videos.length === 0 ? (
                <div className="text-center py-2">
                  <p className="text-muted mb-0">No lectures available in this module.</p>
                </div>
              ) : (
                videos.map((video, idx) => {
                  // Only the first lecture is accessible, others are locked
                  if (idx === 0 || video.isDemoLecture) {
                    return (
                      <Fragment key={video.id || idx}>
                        {video.id === selectedVideo?.id ? (
                          <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="position-relative d-flex align-items-center">
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="btn btn-round btn-sm mb-0 flex-shrink-0"
                                >
                                  <FaPlay className="me-0" size={11} />
                                </Button>
                                <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-bold text-success">
                                  {video.title}
                                </span>
                              </div>
                              <p className="mb-0 text-truncate badge bg-success text-white flex-shrink-0 ms-2">Playing</p>
                            </div>
                            {video.description && (
                              <p className="small text-muted mt-2 mb-0 line-clamp-2">{video.description}</p>
                            )}
                          </div>
                        ) : (
                          <div
                            className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-2 cursor-pointer"
                            style={{ backgroundColor: '#f8f9fa', transition: 'all 0.2s ease' }}
                            onClick={() => handleVideoClick(video)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                          >
                            <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                              <Button
                                variant="primary"
                                size="sm"
                                className="btn btn-round btn-sm mb-0 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVideoClick(video);
                                }}
                              >
                                <FaPlay className="me-0" size={11} />
                              </Button>
                              <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light">
                                {video.title}
                              </span>
                            </div>
                            <p className="mb-0 text-truncate badge bg-light text-dark flex-shrink-0 ms-2">
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
                        <div className="p-3 bg-light rounded-3 border border-light mb-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="position-relative d-flex align-items-center flex-grow-1 overflow-hidden">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="btn btn-round mb-0 flex-shrink-0"
                                disabled={true}
                              >
                                <FaLock className="me-0" size={11} />
                              </Button>
                              <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light text-muted">
                                {video.title}
                              </span>
                            </div>
                            <p className="mb-0 text-truncate badge bg-secondary text-white flex-shrink-0 ms-2">
                              Locked
                            </p>
                          </div>
                          {video.description && (
                            <p className="small text-muted mt-2 mb-0 line-clamp-2">{video.description}</p>
                          )}
                        </div>
                      </Fragment>
                    );
                  }
                })
              )}
            </div>
          </AccordionBody>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Playlist;
