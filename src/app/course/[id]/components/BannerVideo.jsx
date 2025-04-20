"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button, Col, Container, Offcanvas, OffcanvasBody, OffcanvasHeader, Row } from "react-bootstrap";
import { BsCameraVideo } from "react-icons/bs";
import useToggle from "@/hooks/useToggle";
import useViewPort from "@/hooks/useViewPort";
import Playlist from "./Playlist";
import SimplePlaylist from "./SimplePlaylist";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });
import "plyr-react/plyr.css";

const BannerVideo = ({ course, selectedVideo, onVideoSelect, isPageLoading = false }) => {
  const { width } = useViewPort();
  const { isTrue: isOpen, toggle } = useToggle();

  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoSource, setVideoSource] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

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
            console.log('Setting default video:', firstVideoWithUrl);
            setCurrentVideo(firstVideoWithUrl);
            // Also set the video source directly
            setVideoSource({
              type: "video",
              sources: [{
                src: firstVideoWithUrl.videoUrl,
                type: "video/mp4"
              }]
            });
          }
        }
      }
    }
    setIsVideoLoading(false);
  }, [course]);

  // Update video source when selected video changes
  useEffect(() => {
    if (selectedVideo && selectedVideo.videoUrl) {
      setVideoSource(selectedVideo);
      setCurrentVideo(selectedVideo);
      setIsVideoLoading(false);
    } else if (currentVideo && currentVideo.videoUrl) {
      setVideoSource(currentVideo);
      setIsVideoLoading(false);
    }
  }, [selectedVideo, currentVideo]);

  // Update video source when current video changes
  useEffect(() => {
    if (currentVideo && currentVideo.videoUrl) {
      // Set video source from current video
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

  // Update video source when selectedVideo changes
  useEffect(() => {
    if (selectedVideo && selectedVideo.videoUrl) {
      // Set video source from selected video
      setVideoSource({
        type: "video",
        sources: [
          {
            src: selectedVideo.videoUrl,
            type: "video/mp4"
          }
        ]
      });
      setCurrentVideo(selectedVideo);
    }
  }, [selectedVideo]);

  // Handle video selection from playlist
  const handleVideoSelect = (video) => {
    if (video && video.videoUrl) {
      setCurrentVideo(video);
      if (onVideoSelect) {
        onVideoSelect(video);
      }
    }
  };

  return (
    <>
      <section className="pt-4 pb-lg-5">
        <Container>
          <Row className="g-4">
            {/* Video player column */}
            <Col lg={8}>
              {/* Video player with fixed aspect ratio to prevent layout shift */}
              <div className="video-player-container position-relative rounded-3" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
                <div className="position-absolute top-0 start-0 w-100 h-100">
                  {isPageLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100 bg-light rounded-3">
                      <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading course content...</p>
                      </div>
                    </div>
                  ) : videoSource ? (
                    // Video player based on video type
                    (() => {
                      // Debug log for video source
                      console.log('Rendering video with source:', videoSource, 'URL:', selectedVideo?.videoUrl || currentVideo?.videoUrl);
                      const videoUrl = selectedVideo?.videoUrl || currentVideo?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

                      // YouTube video
                      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                        let youtubeId = '';

                        if (videoUrl.includes('youtube.com/watch?v=')) {
                          youtubeId = videoUrl.split('v=')[1];
                          if (youtubeId.includes('&')) {
                            youtubeId = youtubeId.split('&')[0];
                          }
                        } else if (videoUrl.includes('youtu.be/')) {
                          youtubeId = videoUrl.split('youtu.be/')[1];
                          if (youtubeId.includes('?')) {
                            youtubeId = youtubeId.split('?')[0];
                          }
                        } else if (videoUrl.includes('youtube.com/embed/')) {
                          youtubeId = videoUrl.split('youtube.com/embed/')[1];
                          if (youtubeId.includes('?')) {
                            youtubeId = youtubeId.split('?')[0];
                          }
                        }

                        console.log('YouTube ID extracted:', youtubeId, 'from URL:', videoUrl);

                        if (youtubeId) {
                          return (
                            <div className="ratio ratio-16x9 h-100">
                              <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-3"
                              ></iframe>
                            </div>
                          );
                        }
                      }
                      // Vimeo video
                      else if (videoUrl.includes('vimeo.com')) {
                        const vimeoId = videoUrl.split('vimeo.com/')[1];
                        if (vimeoId) {
                          return (
                            <div className="ratio ratio-16x9 h-100">
                              <iframe
                                src={`https://player.vimeo.com/video/${vimeoId}`}
                                title="Vimeo video player"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                className="rounded-3"
                              ></iframe>
                            </div>
                          );
                        }
                      }
                      // Google Cloud Storage URL
                      else if (videoUrl.includes('storage.googleapis.com')) {
                        return (
                          <video
                            controls
                            className="position-absolute top-0 start-0 w-100 h-100 rounded-3"
                            style={{ objectFit: 'contain' }}
                            onError={(e) => {
                              // Handle video error
                              e.target.outerHTML = `<div class="text-center p-5 bg-light rounded-3 h-100 d-flex align-items-center justify-content-center">
                                <div>
                                  <h4>Video could not be loaded</h4>
                                  <p>The video may be unavailable or in an unsupported format.</p>
                                </div>
                              </div>`;
                            }}
                          >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        );
                      }
                      // Blob URL (temporary)
                      else if (videoUrl && videoUrl.startsWith('blob:')) {
                        return (
                          <div className="text-center p-5 bg-light rounded-3 h-100 d-flex align-items-center justify-content-center">
                            <div>
                              <h4>Video URL is a temporary blob URL</h4>
                              <p>This video URL is temporary and will not work after page refresh.</p>
                              <p className="text-muted small">Technical details: The video was saved with a temporary blob URL instead of being uploaded to cloud storage.</p>
                            </div>
                          </div>
                        );
                      }
                      // Other video URLs
                      else if (videoUrl) {
                        return (
                          <video
                            controls
                            autoPlay
                            className="position-absolute top-0 start-0 w-100 h-100 rounded-3"
                            style={{ objectFit: 'contain' }}
                            onError={(e) => {
                              // Handle video error
                              e.target.outerHTML = `<div class="text-center p-5 bg-light rounded-3 h-100 d-flex align-items-center justify-content-center">
                                <div>
                                  <h4>Video could not be loaded</h4>
                                  <p>The video may be unavailable or in an unsupported format.</p>
                                </div>
                              </div>`;
                            }}
                          >
                            <source src={videoUrl} type="video/mp4" />
                            <source src={videoUrl} type="video/webm" />
                            <source src={videoUrl} type="video/ogg" />
                            Your browser does not support the video tag.
                          </video>
                        );
                      }
                      // No valid URL
                      else {
                        return (
                          <div className="text-center p-5 bg-light rounded-3 h-100 d-flex align-items-center justify-content-center">
                            <div>
                              <h4>Video URL is invalid</h4>
                              <p>The video URL is empty or in an unsupported format.</p>
                            </div>
                          </div>
                        );
                      }
                    })()
                  ) : (
                    <div className="text-center p-5 bg-light rounded-3 h-100 d-flex align-items-center justify-content-center">
                      <div>
                        <h4>No video selected or available</h4>
                        <p>Please select a video from the playlist to start watching.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Video title and description */}
              {currentVideo && (
                <div className="mt-3">
                  <h4 className="text-truncate">{currentVideo.title}</h4>
                  <p className="line-clamp-2">{currentVideo.description}</p>
                </div>
              )}

              {/* Mobile playlist button - Only visible on mobile */}
              <div className="d-lg-none mt-3">
                <Button variant="primary" className="w-100" type="button" onClick={toggle}>
                  <BsCameraVideo className="me-2" /> View Course Playlist
                </Button>
              </div>
            </Col>

            {/* Playlist column - Only visible on desktop */}
            <Col lg={4} className="d-none d-lg-block">
              <SimplePlaylist course={course} onVideoSelect={handleVideoSelect} selectedVideo={currentVideo} />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Mobile playlist offcanvas */}
      {width < 992 && (
        <Offcanvas show={isOpen} onHide={toggle} placement="end" className="offcanvas-lg" tabIndex={-1} id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
          <OffcanvasHeader className="bg-primary" closeButton closeVariant="white">
            <h5 className="offcanvas-title text-white" id="offcanvasSidebarLabel">Course Playlist</h5>
          </OffcanvasHeader>
          <OffcanvasBody className="p-0">
            <SimplePlaylist course={course} onVideoSelect={handleVideoSelect} selectedVideo={currentVideo} />
          </OffcanvasBody>
        </Offcanvas>
      )}
    </>
  );
};

export default BannerVideo;
