'use client';

import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaVideo, FaChalkboardTeacher, FaLock, FaUnlock, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { isLectureAccessible } from '@/utils/lectureAccess';
import { lectureSchedules, courses, timeSlots } from '@/data/mockData';

const UpcomingLectures = ({ enrolledCourses = [] }) => {
  const [upcomingLectures, setUpcomingLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use time slots from our centralized mock data

  // Simply use lecture schedules directly from mock data
  useEffect(() => {
    // Just get the upcoming lectures directly from our mock data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter for upcoming lectures (today and future)
    const upcoming = lectureSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.scheduledDate);
      scheduleDate.setHours(0, 0, 0, 0);
      return scheduleDate >= today;
    });

    // Sort by date (ascending)
    upcoming.sort((a, b) => {
      return new Date(a.scheduledDate) - new Date(b.scheduledDate);
    });

    // Take only the next 5 lectures
    setUpcomingLectures(upcoming.slice(0, 5));
    setIsLoading(false);
  }, []);

  // Handle lecture click
  const handleLectureClick = (schedule) => {
    const accessible = isLectureAccessible(schedule, schedule.course?.format);

    if (accessible) {
      // Navigate to lecture or play video
      toast.success(`Opening lecture: ${schedule.lecture?.title || 'Untitled Lecture'}`);
      // TODO: Implement navigation to lecture
    } else {
      toast.error('This lecture is not yet available');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm mb-0">
        <Card.Header className="bg-primary bg-opacity-10 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" />
              Upcoming Lectures
            </h5>
          </div>
        </Card.Header>
        <div className="p-2">
          <div className="upcoming-lectures-list-loading">
            {[1, 2, 3].map((item) => (
              <div key={item} className="upcoming-lecture-card-skeleton">
                <div className="skeleton-line skeleton-date mb-3"></div>
                <div className="skeleton-line skeleton-time mb-4"></div>
                <div className="skeleton-line skeleton-title mb-2"></div>
                <div className="skeleton-line skeleton-course mb-3"></div>
                <div className="skeleton-badges">
                  <div className="skeleton-badge"></div>
                  <div className="skeleton-badge"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card.Footer className="bg-light border-0 text-center p-2">
          <small className="text-muted">
            Loading your upcoming lectures...
          </small>
        </Card.Footer>

        <style jsx global>{`
          .upcoming-lectures-list-loading {
            display: flex;
            gap: 12px;
            padding: 4px 2px;
            overflow-x: hidden;
          }

          .upcoming-lecture-card-skeleton {
            flex: 0 0 auto;
            min-width: 280px;
            max-width: 320px;
            padding: 16px;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.08);
            border: 1px solid rgba(0,0,0,0.05);
          }

          .skeleton-line {
            background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
          }

          .skeleton-date {
            height: 24px;
            width: 60%;
          }

          .skeleton-time {
            height: 18px;
            width: 80%;
          }

          .skeleton-title {
            height: 22px;
            width: 90%;
          }

          .skeleton-course {
            height: 16px;
            width: 70%;
          }

          .skeleton-badges {
            display: flex;
            gap: 8px;
          }

          .skeleton-badge {
            height: 24px;
            width: 80px;
            border-radius: 12px;
            background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }

          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-sm mb-0">
        <Card.Header className="bg-primary bg-opacity-10 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" />
              Upcoming Lectures
            </h5>
          </div>
        </Card.Header>
        <div className="p-2">
          <div className="upcoming-lectures-list-error">
            <div className="error-card">
              <FaExclamationTriangle className="error-icon" />
              <h5>Unable to Load Lectures</h5>
              <p className="text-muted">
                {error}
              </p>
              <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Card.Footer className="bg-light border-0 text-center p-2">
          <small className="text-muted">
            Please try refreshing the page or contact support if the problem persists.
          </small>
        </Card.Footer>

        <style jsx global>{`
          .upcoming-lectures-list-error {
            display: flex;
            justify-content: center;
            padding: 20px 0;
          }

          .error-card {
            text-align: center;
            padding: 20px;
          }

          .error-icon {
            font-size: 3rem;
            color: #dc3545;
            margin-bottom: 1rem;
            opacity: 0.7;
          }
        `}</style>
      </Card>
    );
  }

  if (upcomingLectures.length === 0) {
    return (
      <Card className="border-0 shadow-sm mb-0">
        <Card.Header className="bg-primary bg-opacity-10 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" />
              Upcoming Lectures
            </h5>
          </div>
        </Card.Header>
        <div className="p-2">
          <div className="upcoming-lectures-list-empty">
            <div className="empty-state-card">
              <FaCalendarAlt className="empty-icon" />
              <h5>No Upcoming Lectures</h5>
              <p className="text-muted">
                You don't have any upcoming lectures scheduled.
              </p>
              <Button variant="outline-primary" size="sm" href="/courses">
                Browse Courses
              </Button>
            </div>
          </div>
        </div>
        <Card.Footer className="bg-light border-0 text-center p-2">
          <small className="text-muted">
            Enroll in courses to see your upcoming lectures.
          </small>
        </Card.Footer>

        <style jsx global>{`
          .upcoming-lectures-list-empty {
            display: flex;
            justify-content: center;
            padding: 20px 0;
          }

          .empty-state-card {
            text-align: center;
            padding: 20px;
          }

          .empty-icon {
            font-size: 3rem;
            color: #6c757d;
            margin-bottom: 1rem;
            opacity: 0.5;
          }
        `}</style>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm mb-0">
      <Card.Header className="bg-primary bg-opacity-10 border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaCalendarAlt className="me-2" />
            Upcoming Lectures
          </h5>
          <Button variant="outline-primary" size="sm" href="/student/schedule">
            View All
          </Button>
        </div>
      </Card.Header>
      <div className="p-2">
        <div className="upcoming-lectures-list">
          {upcomingLectures.map((schedule) => {
            const accessible = isLectureAccessible(schedule, schedule.course?.format);
            const slotInfo = timeSlots.find(slot => slot.id.toString() === schedule.slot_id?.toString());

            return (
              <div
                key={schedule.id}
                onClick={() => handleLectureClick(schedule)}
                className={`upcoming-lecture-card ${accessible ? '' : 'text-muted'}`}
              >
                <div className="lecture-date text-center mb-2">
                  <div className="date-badge">
                    {formatDate(schedule.scheduledDate)}
                  </div>
                  <div className="time-badge">
                    <FaClock className="me-1" />
                    {slotInfo?.time || 'Unknown time'}
                  </div>
                </div>

                <div className="lecture-info">
                  <h6 className="mb-1 lecture-title">{schedule.lecture?.title || 'Untitled Lecture'}</h6>
                  <div className="small text-muted mb-2 lecture-course">
                    {schedule.course?.title || 'Unknown Course'} • {schedule.lecture?.moduleName || 'Unknown Module'}
                  </div>
                  <div className="lecture-badges">
                    {schedule.lecture?.isDemoLecture && (
                      <Badge bg="warning" className="me-1">Demo</Badge>
                    )}
                    <Badge
                      bg={schedule.course?.format === 'live' ? 'danger' : 'success'}
                      className="me-1"
                    >
                      {schedule.course?.format === 'live' ? (
                        <><FaChalkboardTeacher className="me-1" /> Live</>
                      ) : (
                        <><FaVideo className="me-1" /> Recorded</>
                      )}
                    </Badge>
                    {schedule.isRescheduled && (
                      <Badge bg="info" className="me-1">Rescheduled</Badge>
                    )}
                    <Badge
                      bg={accessible ? 'primary' : 'secondary'}
                    >
                      {accessible ? (
                        <><FaUnlock className="me-1" /> Available</>
                      ) : (
                        <><FaLock className="me-1" /> Locked</>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Card.Footer className="bg-light border-0 text-center p-2">
        <small className="text-muted">
          Click on a lecture to view it. Live lectures are only available on their scheduled date.
        </small>
      </Card.Footer>

      {/* CSS Styles */}
      <style jsx global>{`
        .upcoming-lectures-list {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
          gap: 12px;
          padding: 4px 2px;
        }

        .upcoming-lectures-list::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .upcoming-lecture-card {
          flex: 0 0 auto;
          min-width: 280px;
          max-width: 320px;
          padding: 16px;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .upcoming-lecture-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.12);
        }

        @media (max-width: 768px) {
          .upcoming-lecture-card {
            min-width: 240px;
          }
        }

        .lecture-date {
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        .date-badge {
          font-weight: 600;
          color: #0d6efd;
          font-size: 1.1rem;
        }

        .time-badge {
          font-size: 0.85rem;
          color: #6c757d;
          margin-top: 4px;
        }

        .lecture-title {
          font-weight: 600;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .lecture-course {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .lecture-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
      `}</style>
    </Card>
  );
};

export default UpcomingLectures;
