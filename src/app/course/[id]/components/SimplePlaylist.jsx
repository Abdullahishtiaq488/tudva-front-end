"use client";

import { useState, useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import { FaPlay, FaLock, FaChevronDown } from "react-icons/fa";

const SimplePlaylist = ({ course, onVideoSelect, selectedVideo: propSelectedVideo }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedModule, setExpandedModule] = useState(0);

  // Update selected video when it changes from props
  useEffect(() => {
    if (propSelectedVideo && propSelectedVideo.videoUrl) {
      setSelectedVideo(propSelectedVideo);
    }
  }, [propSelectedVideo]);

  // Handle video selection
  const handleVideoClick = (video) => {
    if (video && video.videoUrl) {
      console.log('Video selected:', video.title, 'URL:', video.videoUrl);
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
    return <div className="text-center p-3">Loading course content...</div>;
  }

  // Log course data for debugging
  console.log('Course data in SimplePlaylist:', course);

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
      if (Array.isArray(videos)) {
        validModules[moduleName] = videos;
      } else {
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
      <div className="text-center p-4">
        <p className="mb-0">This course doesn't have any content yet.</p>
      </div>
    );
  }

  // Count total lectures
  const totalLectures = Object.values(validModules).reduce(
    (total, videos) => total + videos.length,
    0
  );

  // Add custom styles
  const customStyles = `
    .hover-bg-light:hover {
      background-color: #f8f9fa !important;
    }
  `;

  return (
    <>
      <style jsx>{customStyles}</style>
      <Card className="border-0 shadow-sm">
        <div className="d-flex justify-content-between align-items-center p-3 bg-primary bg-opacity-10 border-bottom">
          <h4 className="mb-0 text-primary">Course Content</h4>
          <span className="badge bg-primary rounded-pill">{totalLectures} lectures</span>
        </div>
        <Card.Body className="p-0">
          {Object.entries(validModules).map(([moduleName, videos], moduleIdx) => (
            <div key={moduleIdx} className="border-bottom">
              {/* Module header */}
              <div
                className="d-flex justify-content-between align-items-center p-3 bg-light cursor-pointer"
                onClick={() => setExpandedModule(expandedModule === moduleIdx ? -1 : moduleIdx)}
              >
                <div>
                  <h6 className="mb-0 fw-bold">{moduleName}</h6>
                  <small className="text-muted">{videos.length} lectures</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-2">{moduleIdx + 1}</span>
                  <FaChevronDown
                    className={expandedModule === moduleIdx ? 'text-primary' : ''}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: expandedModule === moduleIdx ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </div>
              </div>

              {/* Module content */}
              {expandedModule === moduleIdx && (
                <div className="module-content">
                  {videos.length === 0 ? (
                    <div className="text-center py-3">
                      <p className="text-muted mb-0">No lectures available</p>
                    </div>
                  ) : (
                    videos.map((video, idx) => {
                      const isSelected = video.id === selectedVideo?.id;
                      const isAccessible = idx === 0 || video.isDemoLecture;

                      return (
                        <div
                          key={video.id || idx}
                          className={`d-flex align-items-center p-3 border-top ${isSelected ? 'bg-primary bg-opacity-10' : ''} ${isAccessible ? 'cursor-pointer hover-bg-light' : ''}`}
                          onClick={() => isAccessible && handleVideoClick(video)}
                          style={{ transition: 'background-color 0.2s ease' }}
                        >
                          <div className={`rounded-circle me-3 d-flex align-items-center justify-content-center ${isSelected ? 'bg-primary' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>
                            {isAccessible ? (
                              <FaPlay size={10} className={isSelected ? 'text-white' : 'text-primary'} />
                            ) : (
                              <FaLock size={10} className="text-secondary" />
                            )}
                          </div>
                          <div className="flex-grow-1 overflow-hidden">
                            <p className={`mb-0 text-truncate ${isSelected ? 'fw-bold text-primary' : ''} ${!isAccessible ? 'text-muted' : ''}`}>
                              {video.title}
                            </p>
                          </div>
                          <div className="ms-3">
                            <span className={`badge ${isSelected ? 'bg-primary' : 'bg-light text-dark'}`}>{video.duration || '10:00'}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ))}
        </Card.Body>
      </Card>
    </>
  );
};

export default SimplePlaylist;
