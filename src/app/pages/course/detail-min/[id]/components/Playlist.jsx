"use client";

import { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, ProgressBar } from "react-bootstrap";
import { FaPlay } from "react-icons/fa";
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



  console.log(course,"in the playlist")
  // Early return if no course data
  if (!course || !course.modules) {
    return <div>Loading course content...</div>;
  }

  return (
    <Accordion defaultActiveKey='0' className="accordion-icon accordion-bg-light" id="accordionExample2">
      {Object.entries(course.modules).map(([moduleName, videos], moduleIdx) => (
        <AccordionItem 
          eventKey={`${moduleIdx}`} 
          className={clsx(Object.keys(course.modules).length - 1 !== moduleIdx ? "mb-3" : "mb-0")} 
          key={moduleIdx}
        >
          <AccordionHeader as='h6' className="font-base" id={`heading-${moduleIdx}`}>
            <div className="fw-bold rounded collapsed d-block">
              <span className="mb-0">{moduleName}</span>
              <span className="small d-block mt-1">({videos.length} Lectures)</span>
            </div>
          </AccordionHeader>
          <AccordionBody className="mt-3">
            <div className="vstack gap-3">
              <div className="overflow-hidden">
                <div className="d-flex justify-content-between">
                  <p className="mb-1 h6">
                    {videos.filter(video => video.watched).length}/{videos.length} Completed
                  </p>
                  <h6 className="mb-1 text-end">
                    {videos.length > 0 
                      ? Math.round((videos.filter(video => video.watched).length / videos.length) * 100) 
                      : 0}%
                  </h6>
                </div>
                <ProgressBar 
                  variant="primary" 
                  now={videos.length > 0 
                    ? Math.round((videos.filter(video => video.watched).length / videos.length) * 100) 
                    : 0} 
                  className="progress-sm bg-opacity-10" 
                />
              </div>
              
              {videos.map((video, idx) => (
                <Fragment key={video.id}>
                  {video.id === selectedVideo?.id ? (
                    <div className="p-2 bg-success bg-opacity-10 rounded-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="position-relative d-flex align-items-center">
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="btn btn-round btn-sm mb-0 stretched-link position-static"
                          >
                            <FaPlay className="me-0" size={11} />
                          </Button>
                          <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-200px">
                            {video.title}
                          </span>
                        </div>
                        <p className="mb-0 text-truncate">Playing</p>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="position-relative d-flex align-items-center">
                        <Button 
                          variant="danger-soft" 
                          size="sm" 
                          className="btn btn-round mb-0 stretched-link position-static"
                          onClick={() => handleVideoClick(video)}
                          disabled={!video.videoUrl}
                        >
                          <FaPlay className="me-0" size={11} />
                        </Button>
                        <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-200px">
                          {video.title}
                        </span>
                      </div>
                      <p className="mb-0 text-truncate">
                        {video.duration || "10:00"}
                      </p>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </AccordionBody>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Playlist;