"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button, Col, Container, Offcanvas, OffcanvasBody, OffcanvasHeader, Row } from "react-bootstrap";
import { BsCameraVideo } from "react-icons/bs";
import useToggle from "@/hooks/useToggle";
import useViewPort from "@/hooks/useViewPort";
import Playlist from "./Playlist";

const Plyr = dynamic(() => import("plyr-react"));
import "plyr-react/plyr.css";

const BannerVideo = ({ course, selectedVideo }) => {
  const { width } = useViewPort();
  const { isTrue: isOpen, toggle } = useToggle();

  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoSource, setVideoSource] = useState(selectedVideo);




  console.log("\n\n\n\n\n", selectedVideo?.videoUrl, 'in the banner video')
  // Set default video if course data is available
  useEffect(() => {
    if (course && course.modules) {
      const moduleKeys = Object.keys(course.modules);
      if (moduleKeys.length > 0) {
        const firstModuleVideos = course.modules[moduleKeys[0]];
        if (firstModuleVideos && firstModuleVideos.length > 0) {
          // Find first video with a videoUrl
          const firstVideoWithUrl = firstModuleVideos.find(video => video.videoUrl);
          if (firstVideoWithUrl) {
            setCurrentVideo(firstVideoWithUrl);
          }
        }
      }
    }
  }, [course]);

  // Update video source when current video changes
  useEffect(() => {
    if (currentVideo && currentVideo.videoUrl) {
      setVideoSource({
        type: "video",
        sources: [
          {
            src: currentVideo.videoUrl,
            type: "video/mp4"
          }
        ]
      });
    }
  }, [currentVideo]);

  // Handle video selection from playlist
  const handleVideoSelect = (video) => {
    if (video && video.videoUrl) {
      setCurrentVideo(video);
    }
  };

  return (
    <>
      <section className="py-0 pb-lg-5">
        <Container>
          <Row className="g-3">
            <Col xs={12}>
              <div className="video-player rounded-3">
                {videoSource ? (
                  // Check if it's a YouTube URL
                  (selectedVideo?.videoUrl?.includes('youtube.com') || currentVideo?.videoUrl?.includes('youtube.com')) ? (
                    // Render YouTube iframe
                    <iframe
                      className="w-100 rounded-lg shadow-lg"
                      style={{ height: '500px' }}
                      src={selectedVideo?.videoUrl || currentVideo?.videoUrl || 'https://www.youtube.com/embed/tXHviS-4ygo'}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    // Render regular video player for direct video URLs
                    <video
                      controls
                      className="w-100 rounded-lg shadow-lg"
                      style={{ maxHeight: '500px', objectFit: 'contain' }}
                      onError={(e) => {
                        console.error("Video error:", e);
                        // Try to display a fallback message or image
                        e.target.outerHTML = `<div class="text-center p-5 bg-light rounded-3">
                          <h4>Video could not be loaded</h4>
                          <p>The video may be unavailable or in an unsupported format.</p>
                        </div>`;
                      }}
                    >
                      <source
                        src={selectedVideo?.videoUrl || currentVideo?.videoUrl || ''}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <div className="text-center p-5 bg-light rounded-3">
                    <h4>No video selected or available</h4>
                    <p>Please select a video from the playlist to start watching.</p>
                  </div>
                )}
              </div>
              {currentVideo && (
                <div className="mt-3">
                  <h4>{currentVideo.title}</h4>
                  <p>{currentVideo.description}</p>
                </div>
              )}
            </Col>
            <Col xs={12} className="d-lg-none">
              <Button variant="primary" className="mb-3" type="button" onClick={toggle}>
                <BsCameraVideo className="me-1" /> Playlist
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
      {width < 992 && (
        <Offcanvas show={isOpen} onHide={toggle} placement="end" className="offcanvas-lg" tabIndex={-1} id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
          <OffcanvasHeader className="bg-dark" closeButton closeVariant="white">
            <h5 className="offcanvas-title text-white" id="offcanvasSidebarLabel">Course playlist</h5>
          </OffcanvasHeader>
          <OffcanvasBody className="p-3 p-lg-0">
            <Col xs={12}>
              <Playlist course={course} onVideoSelect={handleVideoSelect} />
            </Col>
          </OffcanvasBody>
        </Offcanvas>
      )}
    </>
  );
};

export default BannerVideo;