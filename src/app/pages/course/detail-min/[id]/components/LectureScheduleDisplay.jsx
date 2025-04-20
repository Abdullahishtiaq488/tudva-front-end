'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaVideo, FaChalkboardTeacher, FaLock, FaUnlock, FaPlay } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { courses, lectureSchedules, timeSlots } from '@/data/mockData';
import { isLectureAccessible } from '@/utils/lectureAccess';

const LectureScheduleDisplay = ({ courseId, courseType }) => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate] = useState(new Date());

  // Using time slots from our centralized mock data

  // Use lecture schedules from our centralized mock data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Using centralized mock data for lecture schedules, course ID:', courseId);

      // Filter schedules for this course
      const courseSchedules = lectureSchedules.filter(schedule => schedule.course_id === courseId);

      // If no schedules found for this course, use all schedules
      if (courseSchedules.length === 0) {
        console.log('No schedules found for this course, using all schedules');
        setSchedules(lectureSchedules);
      } else {
        console.log('Found schedules for this course:', courseSchedules.length);
        setSchedules(courseSchedules);
      }
    } catch (err) {
      console.error('Error getting lecture schedules from mock data:', err);
      setError('Failed to load lecture schedules');
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);





  // Using the isLectureAccessible utility from our utils

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
