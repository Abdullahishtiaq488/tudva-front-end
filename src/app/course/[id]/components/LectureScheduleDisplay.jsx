"use client";

import { useState, useEffect } from 'react';
import { Card, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaCalendarAlt, FaLock, FaPlay, FaCheck } from 'react-icons/fa';
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

  // Generate dummy schedules for the course
  useEffect(() => {
    const generateDummySchedules = () => {
      if (!courseId) {
        setError('Course ID is required');
        setIsLoading(false);
        return;
      }

      // Create a start date (today)
      const startDate = new Date();

      // Generate 8 schedules, one for each weekday starting from today
      const dummySchedules = [];
      let currentScheduleDate = new Date(startDate);
      let lectureCount = 0;

      // Generate schedules for 4 weeks (8 lectures, 2 per week)
      for (let week = 0; week < 4; week++) {
        // Add lectures on Monday and Wednesday
        for (let day = 0; day < 2; day++) {
          // Skip weekends
          while (currentScheduleDate.getDay() === 0 || currentScheduleDate.getDay() === 6) {
            currentScheduleDate.setDate(currentScheduleDate.getDate() + 1);
          }

          // Create a schedule for this date
          const moduleName = `Module ${Math.floor(lectureCount / 2) + 1}`;
          const lectureTitle = `Lecture ${lectureCount + 1}: ${['Introduction', 'Core Concepts', 'Advanced Techniques', 'Practical Applications', 'Case Studies', 'Problem Solving', 'Review', 'Final Project'][lectureCount]}`;

          dummySchedules.push({
            id: `schedule-${lectureCount + 1}`,
            course_id: courseId,
            scheduledDate: new Date(currentScheduleDate),
            slot_id: (lectureCount % 5) + 1, // Use different time slots
            lecture: {
              id: `lecture-${lectureCount + 1}`,
              title: lectureTitle,
              moduleName: moduleName,
              isDemoLecture: lectureCount === 0, // First lecture is a demo
            }
          });

          // Move to the next lecture
          lectureCount++;

          // Move to the next day (skip to Wednesday if currently Monday, or to next Monday if currently Wednesday)
          currentScheduleDate.setDate(currentScheduleDate.getDate() + (day === 0 ? 2 : 5));
        }
      }

      setSchedules(dummySchedules);
      setIsLoading(false);
    };

    // Generate dummy schedules after a short delay to simulate API call
    const timer = setTimeout(() => {
      generateDummySchedules();
    }, 1000);

    return () => clearTimeout(timer);
  }, [courseId, courseType]);



  // Check if a lecture is accessible based on its scheduled date
  const isLectureAccessible = (schedule) => {
    if (!schedule || !schedule.scheduledDate) return false;

    const scheduleDate = new Date(schedule.scheduledDate);

    // For recorded courses, lectures are accessible after their scheduled date
    if (courseType !== 'live') {
      return currentDate >= scheduleDate;
    }

    // For live courses, lectures are only accessible on the day they are scheduled
    const isToday =
      scheduleDate.getDate() === currentDate.getDate() &&
      scheduleDate.getMonth() === currentDate.getMonth() &&
      scheduleDate.getFullYear() === currentDate.getFullYear();

    return isToday;
  };

  // Handle lecture click
  const handleLectureClick = (schedule) => {
    if (isLectureAccessible(schedule)) {
      // If the lecture is accessible, navigate to the lecture or play the video
      toast.success(`Opening lecture: ${schedule.lecture?.title || 'Untitled Lecture'}`);
      // Implement navigation or video playback here
    } else {
      // If the lecture is not accessible, show a message
      toast.error('This lecture is not yet available. Please check back on the scheduled date.');
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
                      {accessible ? (
                        <Badge bg="success" pill>
                          <FaPlay className="me-1" /> Available
                        </Badge>
                      ) : (
                        <Badge bg="secondary" pill>
                          <FaLock className="me-1" /> Locked
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LectureScheduleDisplay;
