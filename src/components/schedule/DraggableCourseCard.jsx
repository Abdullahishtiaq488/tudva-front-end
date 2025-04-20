'use client';

import React from 'react';
import { FaWifi, FaTree, FaCode, FaDatabase, FaChartBar, FaDesktop, FaPalette, FaLaptopCode, FaBookOpen } from 'react-icons/fa';

const DraggableCourseCard = ({ course, onDragStart, index = 0 }) => {
  // Determine if the course is draggable (only recorded courses are draggable)
  const isDraggable = course.courseType === 'recorded' || course.format === 'recorded';

  // Handle drag start
  const handleDragStart = (e) => {
    if (!isDraggable) {
      e.preventDefault();
      return;
    }

    // Set drag data
    e.dataTransfer.setData('text/plain', JSON.stringify(course));

    // Call the onDragStart callback
    if (onDragStart) {
      onDragStart(course);
    }
  };

  // Calculate progress display - ensure it's in X/Y format
  let progressDisplay;
  if (course.progress) {
    progressDisplay = course.progress;
  } else if (course.completedLectures && course.totalLectures) {
    progressDisplay = `${course.completedLectures}/${course.totalLectures}`;
  } else if (course.lecture && course.lecture.title) {
    // Extract lecture number from title if available
    const lectureNumber = parseInt(course.lecture.title.replace('Lecture ', '')) || 1;
    progressDisplay = `${lectureNumber}/10`; // Default to 10 total lectures if not specified
  } else {
    // Default fallback
    progressDisplay = '3/10';
  }

  // Determine course type for styling
  const courseType = course.courseType || course.format || 'recorded';

  // Get course color with fallback - use light green as default
  const courseColor = course.color || '#8bc34a';

  // Get course icon or use default
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'FaTree': return <FaTree />;
      case 'FaCode': return <FaCode />;
      case 'FaDatabase': return <FaDatabase />;
      case 'FaChartBar': return <FaChartBar />;
      case 'FaDesktop': return <FaDesktop />;
      case 'FaPalette': return <FaPalette />;
      case 'FaLaptopCode': return <FaLaptopCode />;
      default: return <FaTree />;
    }
  };

  const courseIcon = course.icon ? getIconComponent(course.icon) : <FaTree />;

  return (
    <div
      className={`draggable-course-card ${isDraggable ? 'draggable' : ''}`}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      style={{
        marginTop: `${index * 10}px`,
        marginLeft: `${index * 5}px`,
        zIndex: 10 - index,
      }}
    >
      <div className="card-top-bar" style={{ backgroundColor: courseColor }}>
        <div className="menu-icon">≡</div>
        <div className="card-icon">
          {courseIcon}
        </div>
      </div>

      <div className="card-content">
        <div className="course-title">
          {course.title}
        </div>

        <div className="card-bottom">
          <div className="course-progress">
            {progressDisplay}
          </div>

          {courseType === 'live' ? (
            <div className="live-badge">
              <FaWifi className="me-1" />
              LIVE
            </div>
          ) : (
            <div className="recorded-badge">
              <FaTree className="me-1" />
              REC
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraggableCourseCard;
