'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaVideo, FaLock, FaUnlock, FaExclamationTriangle, FaTree, FaWifi, FaHtml5, FaJs, FaPython } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { isLectureAccessible } from '@/utils/lectureAccess';
import { lectureSchedules, timeSlots as mockTimeSlots } from '@/data/mockData';

const WeeklyCalendar = ({ enrolledCourses = [] }) => {
  const [currentWeek, setCurrentWeek] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);
  const [draggedSchedule, setDraggedSchedule] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Use time slots from our centralized mock data
  const timeSlots = mockTimeSlots;

  // Generate current week dates (weekdays only - Monday to Friday)
  useEffect(() => {
    const generateWeekDates = () => {
      const today = new Date();
      const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const weekDates = [];

      // Find the Monday of current week
      const startDate = new Date(today);
      // If today is Sunday (0), go to next day (Monday)
      // If today is Monday-Saturday (1-6), go back to Monday
      if (currentDay === 0) {
        startDate.setDate(today.getDate() + 1); // Next day is Monday
      } else {
        startDate.setDate(today.getDate() - currentDay + 1); // Go back to Monday
      }

      // Generate 5 days (Monday to Friday)
      for (let i = 0; i < 5; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        weekDates.push({
          date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isToday: date.toDateString() === today.toDateString()
        });
      }

      setCurrentWeek(weekDates);
    };

    generateWeekDates();
  }, []);

  // Simply use lecture schedules directly from mock data
  useEffect(() => {
    // Just set the schedules directly from our mock data
    setSchedules(lectureSchedules);
    setIsLoading(false);
  }, []);

  // Navigate to previous week (weekdays only)
  const goToPreviousWeek = () => {
    const firstDay = new Date(currentWeek[0].date);
    firstDay.setDate(firstDay.getDate() - 7); // Go back 7 days to previous Monday

    const newWeek = [];
    for (let i = 0; i < 5; i++) { // Only 5 days (Monday to Friday)
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      newWeek.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday: date.toDateString() === new Date().toDateString()
      });
    }

    setCurrentWeek(newWeek);
  };

  // Navigate to next week (weekdays only)
  const goToNextWeek = () => {
    const firstDay = new Date(currentWeek[0].date);
    firstDay.setDate(firstDay.getDate() + 7); // Go forward 7 days to next Monday

    const newWeek = [];
    for (let i = 0; i < 5; i++) { // Only 5 days (Monday to Friday)
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      newWeek.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday: date.toDateString() === new Date().toDateString()
      });
    }

    setCurrentWeek(newWeek);
  };

  // Handle drag start
  const handleDragStart = (e, schedule) => {
    // Only allow dragging recorded courses
    if (schedule.course?.format === 'recorded' && !schedule.lecture?.isDemoLecture) {
      setDraggedSchedule(schedule);
      e.dataTransfer.setData('text/plain', schedule.id);
      e.dataTransfer.effectAllowed = 'move';
    } else {
      e.preventDefault();
      if (schedule.lecture?.isDemoLecture) {
        toast.error('Demo lectures cannot be rescheduled');
      } else {
        toast.error('Live courses cannot be rescheduled');
      }
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = async (e, day, timeSlot) => {
    e.preventDefault();

    if (!draggedSchedule) return;

    // Check if the course is recorded (only recorded courses can be rescheduled)
    if (draggedSchedule.course?.format !== 'recorded') {
      toast.error('Live courses cannot be rescheduled');
      return;
    }

    // Check if the lecture is a demo lecture (demo lectures cannot be rescheduled)
    if (draggedSchedule.lecture?.isDemoLecture) {
      toast.error('Demo lectures cannot be rescheduled');
      return;
    }

    // Set new date based on the day
    const newDate = new Date(day.date);
    newDate.setHours(0, 0, 0, 0);

    // Check if the day is a weekend
    const dayOfWeek = newDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 = Sunday, 6 = Saturday
      toast.error('Lectures cannot be scheduled on weekends');
      return;
    }

    // Check if we're trying to reschedule to the same day and time
    const currentDate = new Date(draggedSchedule.scheduledDate);
    currentDate.setHours(0, 0, 0, 0);

    if (newDate.getTime() === currentDate.getTime() &&
      parseInt(draggedSchedule.slot_id) === timeSlot.id) {
      toast('Lecture is already scheduled for this time slot', {
        icon: '🔔',
        style: {
          borderRadius: '10px',
          background: '#3498db',
          color: '#fff',
        },
      });
      return;
    }

    // Check for conflicts - no stacking allowed
    const conflictingSchedule = schedules.find(schedule => {
      const scheduleDate = new Date(schedule.scheduledDate);
      scheduleDate.setHours(0, 0, 0, 0);

      return scheduleDate.getTime() === newDate.getTime() &&
        parseInt(schedule.slot_id) === timeSlot.id &&
        schedule.id !== draggedSchedule.id;
    });

    if (conflictingSchedule) {
      toast.error('There is already a lecture scheduled for this time slot. Only one lecture per slot is allowed.');
      return;
    }

    // Show loading state
    setIsRescheduling(true);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update the schedule in the local state
      setSchedules(prevSchedules => {
        return prevSchedules.map(schedule => {
          if (schedule.id === draggedSchedule.id) {
            return {
              ...schedule,
              scheduledDate: newDate.toISOString(),
              slot_id: timeSlot.id.toString(),
              isRescheduled: true
            };
          }
          return schedule;
        });
      });

      toast.success('Lecture rescheduled successfully');
    } catch (error) {
      console.error('Error rescheduling lecture:', error);
      toast.error(error.message || 'Failed to reschedule lecture');

      // For demo purposes, update the schedule in the local state anyway
      setSchedules(prevSchedules => {
        return prevSchedules.map(schedule => {
          if (schedule.id === draggedSchedule.id) {
            return {
              ...schedule,
              scheduledDate: newDate.toISOString(),
              slot_id: timeSlot.id.toString(),
              isRescheduled: true
            };
          }
          return schedule;
        });
      });
    } finally {
      setIsRescheduling(false);
      setDraggedSchedule(null);
    }
  };

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

  // Get schedules for a specific day and time slot
  const getSchedulesForDayAndSlot = (day, slotId) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.scheduledDate);
      scheduleDate.setHours(0, 0, 0, 0);

      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      return scheduleDate.getTime() === dayDate.getTime() &&
        parseInt(schedule.slot_id) === slotId;
    });
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-primary bg-opacity-10 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" />
              Weekly Schedule
            </h5>
          </div>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your schedule...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="warning">
        <div className="d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          <span>Unable to load your schedule: {error}</span>
        </div>
      </Alert>
    );
  }

  if (schedules.length === 0) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-primary bg-opacity-10 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" />
              Weekly Schedule
            </h5>
          </div>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <FaCalendarAlt className="display-4 text-muted mb-3" />
          <h5>No Scheduled Lectures</h5>
          <p className="text-muted">
            You don't have any scheduled lectures for this week. Enroll in courses to see your schedule.
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-primary bg-opacity-10 border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaCalendarAlt className="me-2" />
            Weekly Schedule
          </h5>
          <div>
            <Button variant="outline-primary" size="sm" className="me-2" onClick={goToPreviousWeek}>
              <FaChevronLeft />
            </Button>
            <Button variant="outline-primary" size="sm" onClick={goToNextWeek}>
              <FaChevronRight />
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="calendar-container">
          {/* Calendar Header */}
          <div className="calendar-header">
            <div className="time-column">
              <div className="time-header">Time</div>
            </div>
            {currentWeek.map((day) => (
              <div
                key={day.dayName}
                className={`day-column ${day.isToday ? 'today' : ''}`}
              >
                <div className="day-header">
                  <div className="day-name">{day.dayShort}</div>
                  <div className="day-date">{day.dateFormatted}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="calendar-body">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.id} className="time-row">
                <div className="time-cell">
                  <div className="time-label">
                    <FaClock className="me-1" />
                    {timeSlot.time}
                  </div>
                </div>

                {currentWeek.map((day) => {
                  const daySchedules = getSchedulesForDayAndSlot(day, timeSlot.id);

                  return (
                    <div
                      key={`${day.dayName}-${timeSlot.id}`}
                      className={`day-cell ${day.isToday ? 'today' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, timeSlot)}
                    >
                      {daySchedules.map((schedule) => {
                        const accessible = isLectureAccessible(schedule, schedule.course?.format);

                        return (
                          <div
                            key={schedule.id}
                            className={`lecture-card ${schedule.course?.format} ${accessible ? 'accessible' : 'locked'} ${schedule.isRescheduled ? 'rescheduled' : ''}`}
                            draggable={schedule.course?.format === 'recorded' && !schedule.lecture?.isDemoLecture}
                            onDragStart={(e) => handleDragStart(e, schedule)}
                            onClick={() => handleLectureClick(schedule)}
                          >
                            <div className="card-top-bar" style={{ backgroundColor: schedule.course?.color || '#8bc34a' }}>
                              <div className="menu-icon">≡</div>
                              <div className="card-icon">
                                {schedule.course?.icon === 'FaHtml5' && <FaHtml5 />}
                                {schedule.course?.icon === 'FaJs' && <FaJs />}
                                {schedule.course?.icon === 'FaPython' && <FaPython />}
                                {!schedule.course?.icon && <FaTree />}
                              </div>
                            </div>
                            <div className="lecture-card-content">
                              <div className="lecture-course-title">
                                {schedule.course?.title || 'Unknown Course'}
                              </div>

                              <div className="card-bottom">
                                <div className="lecture-progress">
                                  {/* Show lecture number out of total lectures */}
                                  {`${parseInt(schedule.lecture?.title?.replace('Lecture ', '') || 1)}/10`}
                                </div>
                                {schedule.course?.format === 'live' ? (
                                  <div className="lecture-live-badge">
                                    <FaWifi className="me-1" /> LIVE
                                  </div>
                                ) : (
                                  <div className="lecture-recorded-badge">
                                    <FaTree className="me-1" /> REC
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="bg-light border-0">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="legend mb-2 mb-md-0">
            <span className="legend-item">
              <span className="legend-color live"></span> Live Course
            </span>
            <span className="legend-item">
              <span className="legend-color recorded"></span> Recorded Course
            </span>
            <span className="legend-item">
              <span className="legend-color accessible"></span> Available
            </span>
            <span className="legend-item">
              <span className="legend-color locked"></span> Locked
            </span>
          </div>
          <div className="instructions">
            <small className="text-muted">
              Drag and drop recorded lectures to reschedule them. Live lectures cannot be rescheduled. Lectures can only be scheduled on weekdays (Monday-Friday).
            </small>
          </div>
        </div>
      </Card.Footer>

      {/* CSS Styles */}
      <style jsx global>{`
        .calendar-container {
          overflow-x: auto;
        }

        .calendar-header {
          display: flex;
          border-bottom: 1px solid #e9ecef;
        }

        .time-column {
          width: 150px;
          min-width: 150px;
          border-right: 1px solid #e9ecef;
        }

        .day-column {
          flex: 1;
          min-width: 120px;
          border-right: 1px solid #e9ecef;
        }

        .day-column.today {
          background-color: rgba(13, 110, 253, 0.05);
        }

        .time-header, .day-header {
          padding: 10px;
          text-align: center;
          font-weight: 500;
        }

        .day-name {
          font-weight: bold;
        }

        .day-date {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .calendar-body {
          display: flex;
          flex-direction: column;
        }

        .time-row {
          display: flex;
          border-bottom: 1px solid #e9ecef;
        }

        .time-cell {
          width: 150px;
          min-width: 150px;
          border-right: 1px solid #e9ecef;
          padding: 10px;
        }

        .time-label {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .day-cell {
          flex: 1;
          min-width: 120px;
          border-right: 1px solid #e9ecef;
          padding: 5px;
          min-height: 125px;
        }

        .day-cell.today {
          background-color: rgba(13, 110, 253, 0.05);
        }

        .lecture-card {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 0;
          margin-bottom: 5px;
          cursor: pointer;
          font-size: 0.85rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
          height: 95px;
          background-color: #fff;
          display: flex;
          flex-direction: column;
        }

        .lecture-card .card-top-bar {
          height: 25px;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px;
        }

        .lecture-card .menu-icon {
          color: rgba(0, 0, 0, 0.5);
          font-size: 18px;
          font-weight: bold;
        }

        .lecture-card .card-icon {
          color: rgba(0, 0, 0, 0.6);
          font-size: 16px;
        }

        .lecture-card.accessible {
          opacity: 1;
        }

        .lecture-card.locked {
          opacity: 0.7;
        }

        .lecture-card.rescheduled {
          border-style: dashed;
        }

        .lecture-card-content {
          padding: 10px 12px;
          position: relative;
          height: calc(100% - 25px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: white;
        }

        .lecture-card-content .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .lecture-course-title {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1rem;
          margin-bottom: 8px;
          line-height: 1.3;
          padding: 2px 0;
        }

        .lecture-progress {
          font-size: 0.8rem;
          font-weight: 500;
          color: #333;
        }

        .lecture-live-badge, .lecture-recorded-badge {
          display: flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 3px;
        }

        .lecture-live-badge {
          background-color: #000;
          color: #fff;
        }

        .lecture-recorded-badge {
          background-color: #f8f9fa;
          color: #333;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          color: #6c757d;
        }

        .legend-color {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-right: 5px;
          border-radius: 3px;
        }

        .legend-color.live {
          background-color: #8bc34a;
          border: 1px solid rgba(0,0,0,0.1);
          position: relative;
        }

        .legend-color.live:after {
          content: 'LIVE';
          position: absolute;
          top: 1px;
          right: 1px;
          background-color: #000;
          color: #fff;
          font-size: 4px;
          padding: 1px 2px;
          border-radius: 1px;
        }

        .legend-color.recorded {
          background-color: #8bc34a;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .legend-color.accessible {
          background-color: #cfe2ff;
          border-left: 3px solid #0d6efd;
        }

        .legend-color.locked {
          background-color: #e2e3e5;
          border-left: 3px solid #6c757d;
        }
      `}</style>
    </Card>
  );
};

export default WeeklyCalendar;
