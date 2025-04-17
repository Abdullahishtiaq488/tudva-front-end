'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaVideo, FaChalkboardTeacher, FaLock, FaUnlock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const LectureScheduleDisplay = ({ courseId, courseType }) => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate] = useState(new Date());

  // Time slots reference
  const timeSlots = [
    { id: 1, time: '9:00 AM - 9:45 AM' },
    { id: 2, time: '9:45 AM - 10:30 AM' },
    { id: 3, time: '10:30 AM - 11:15 AM' },
    { id: 4, time: '11:15 AM - 12:00 PM' },
    { id: 5, time: '12:00 PM - 12:45 PM' },
    { id: 6, time: '12:45 PM - 1:30 PM' },
    { id: 7, time: '1:30 PM - 2:15 PM' },
    { id: 8, time: '2:15 PM - 3:00 PM' },
    { id: 9, time: '3:00 PM - 3:45 PM' },
    { id: 10, time: '3:45 PM - 4:30 PM' },
    { id: 11, time: '4:30 PM - 5:15 PM' },
  ];

  // Fetch lecture schedules
  useEffect(() => {
    const fetchLectureSchedules = async () => {
      if (!courseId) {
        console.log('No course ID provided for lecture schedules');
        generateMockSchedules();
        setIsLoading(false);
        return;
      }

      console.log('Fetching lecture schedules for course ID:', courseId);
      setIsLoading(true);
      setError(null);

      try {
        // Skip API calls and generate mock schedules directly
        // This is a temporary solution until the lecture schedule APIs are implemented
        console.log('Generating mock schedules for course:', courseId);
        generateMockSchedules();
      } catch (err) {
        console.error('Error with lecture schedules:', err);
        setError(err.message || 'Failed to load lecture schedules');
        // Generate mock schedules as fallback
        generateMockSchedules();
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectureSchedules();
  }, [courseId]);

  // Generate mock schedules for demo purposes
  const generateMockSchedules = () => {
    const mockSchedules = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Start a week ago

    for (let i = 0; i < 10; i++) {
      const lectureDate = new Date(startDate);
      lectureDate.setDate(startDate.getDate() + (i * 7)); // Weekly schedule

      mockSchedules.push({
        id: `mock-${i}`,
        lecture_id: `lecture-${i}`,
        slot_id: (i % 5) + 1,
        scheduledDate: lectureDate.toISOString(),
        isRescheduled: false,
        lecture: {
          title: `Lecture ${i + 1}`,
          moduleName: `Module ${Math.floor(i / 3) + 1}`,
          durationMinutes: 45,
          isDemoLecture: i === 0
        }
      });
    }

    setSchedules(mockSchedules);
  };

  // Check if a lecture is accessible
  const isLectureAccessible = (schedule) => {
    if (!schedule) return false;

    // Demo lectures are always accessible
    if (schedule.lecture?.isDemoLecture) return true;

    // For recorded courses, lectures become accessible after their scheduled date
    if (courseType === 'recorded') {
      return new Date(schedule.scheduledDate) <= currentDate;
    }

    // For live courses, lectures are only accessible on their scheduled date
    if (courseType === 'live') {
      const scheduleDate = new Date(schedule.scheduledDate);
      const today = new Date(currentDate);

      return (
        scheduleDate.getDate() === today.getDate() &&
        scheduleDate.getMonth() === today.getMonth() &&
        scheduleDate.getFullYear() === today.getFullYear()
      );
    }

    return false;
  };

  // Handle lecture selection
  const handleLectureClick = (schedule) => {
    if (isLectureAccessible(schedule)) {
      // Navigate to lecture or play video
      toast.success(`Opening lecture: ${schedule.lecture?.title || 'Untitled Lecture'}`);
    } else {
      toast.error('This lecture is not yet available');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading lecture schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning">
        <div className="d-flex align-items-center">
          <FaCalendarAlt className="me-2" />
          <span>Unable to load lecture schedule: {error}</span>
        </div>
      </Alert>
    );
  }

  if (schedules.length === 0) {
    return (
      <Alert variant="info">
        <div className="d-flex align-items-center">
          <FaCalendarAlt className="me-2" />
          <span>No lecture schedule available for this course.</span>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-primary bg-opacity-10 border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaCalendarAlt className="me-2" />
            Lecture Schedule
          </h5>
          <Badge bg={courseType === 'live' ? 'danger' : 'success'}>
            {courseType === 'live' ? 'Live Course' : 'Recorded Course'}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
                <th>Module</th>
                <th>Lecture</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => {
                const accessible = isLectureAccessible(schedule);
                const slotInfo = timeSlots.find(slot => slot.id.toString() === schedule.slot_id?.toString());

                return (
                  <tr
                    key={schedule.id || index}
                    onClick={() => handleLectureClick(schedule)}
                    style={{ cursor: 'pointer' }}
                    className={accessible ? 'table-hover' : 'text-muted'}
                  >
                    <td>{index + 1}</td>
                    <td>{new Date(schedule.scheduledDate).toLocaleDateString()}</td>
                    <td>{slotInfo?.time || 'Unknown time'}</td>
                    <td>{schedule.lecture?.moduleName || 'Unknown module'}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {schedule.lecture?.isDemoLecture && (
                          <Badge bg="warning" className="me-2">Demo</Badge>
                        )}
                        {schedule.lecture?.title || 'Untitled Lecture'}
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg={accessible ? 'success' : 'secondary'}
                        className="d-flex align-items-center"
                      >
                        {accessible ? (
                          <>
                            <FaUnlock className="me-1" /> Available
                          </>
                        ) : (
                          <>
                            <FaLock className="me-1" /> Locked
                          </>
                        )}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card.Body>
      <Card.Footer className="bg-light border-0 text-center">
        <small className="text-muted">
          {courseType === 'live' ? (
            'Live lectures are only accessible on their scheduled date.'
          ) : (
            'Recorded lectures become accessible after their scheduled date.'
          )}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default LectureScheduleDisplay;
