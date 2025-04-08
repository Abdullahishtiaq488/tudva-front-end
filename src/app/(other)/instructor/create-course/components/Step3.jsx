"use client"
import React, { useState, useEffect, useRef } from "react";
import { Accordion, Button } from "react-bootstrap";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FaPlay, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AddLecture from "./AddLecture";
import AddTopic from "./AddTopic";
import { toast } from "react-hot-toast";
import { checkIsLoggedInUser } from "@/helpers/checkLoggedInUser";
import axiosInstance from "@/utils/axiosInstance";

const Step3 = ({ goToNextStep, goBackToPreviousStep }) => {
  const { control, formState: { errors }, setValue, getValues, trigger } = useFormContext();

  const { fields: lectureGroupFields, append: appendLectureGroup, remove: removeLectureGroup } = useFieldArray({
    control,
    name: "lectureGroups",
  });

  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const componentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchCourseAndGenerateCurriculum();
    }
  }, [isVisible]);

  const handleAddLectureGroup = (lectureHeading) => {
    appendLectureGroup({ lectureHeading: lectureHeading, lectures: [] });
  };

  const handleAddLecture = (groupIndex) => {
    setCurrentGroupIndex(groupIndex);
    setShowAddTopicModal(true);
  };

  const handleRemoveLecture = (groupIndex, lectureIndex) => {
    const currentGroups = getValues("lectureGroups");
    const updatedGroups = [...currentGroups];
    if (updatedGroups[groupIndex] && updatedGroups[groupIndex].lectures) {
      updatedGroups[groupIndex].lectures.splice(lectureIndex, 1);
      setValue("lectureGroups", updatedGroups);
    } else {
      console.warn(`Lecture at index ${lectureIndex} in group ${groupIndex} not found.`);
    }
  };

  const handleUpdateLectureGroupName = (groupIndex, newName) => {
    const currentGroups = getValues("lectureGroups");
    const updatedGroups = [...currentGroups];
    updatedGroups[groupIndex].lectureHeading = newName;
    setValue("lectureGroups", updatedGroups);
  };

  const handleTopicDataSubmit = (data) => {
    const { topicName, description, videoFile } = data;

    const currentGroups = getValues("lectureGroups");
    const updatedGroups = [...currentGroups];
    if (!updatedGroups[currentGroupIndex].lectures) {
      updatedGroups[currentGroupIndex].lectures = [];
    }

    updatedGroups[currentGroupIndex].lectures.push({
      topicName,
      description,
      videoFile, // Store the File object for backend upload
      moduleName: updatedGroups[currentGroupIndex].lectureHeading, // Explicitly add moduleName here
    });

    setValue("lectureGroups", updatedGroups);
    setShowAddTopicModal(false);
  };

  const handleNext = async () => {
    const isValid = await trigger("lectureGroups");
    if (isValid) {
      const { courseId, lectureGroups } = getValues();

      const formData = new FormData();
      const lecturesMetadata = [];

      lectureGroups.forEach((group, groupIndex) => {
        group.lectures.forEach((lecture, lectureIndex) => {
          const lectureData = {
            moduleName: group.lectureHeading, // Ensure moduleName is included
            topicName: lecture.topicName,
            description: lecture.description,
            sortOrder: lectureIndex,
          };
          lecturesMetadata.push(lectureData);

          // Append video file with a unique key per group and lecture
          if (lecture.videoFile instanceof File) {
            formData.append(
              `videoFiles[${groupIndex}][${lectureIndex}]`, // Unique key for each file
              lecture.videoFile,
              lecture.videoFile.name
            );
          }
        });
      });

      formData.append("lectures", JSON.stringify(lecturesMetadata));

      try {
        // Get the current course from localStorage
        const currentCourseStr = localStorage.getItem('current_course');
        if (!currentCourseStr) {
          toast.error("Course data not found. Please start from Step 1.");
          return;
        }

        // Parse the current course
        const currentCourse = JSON.parse(currentCourseStr);

        // Process lectures data
        const processedLectures = [];

        // For each lecture, create a data object
        lectureGroups.forEach((group) => {
          group.lectures.forEach((lecture, lectureIndex) => {
            const lectureData = {
              moduleName: group.lectureHeading,
              topicName: lecture.topicName,
              description: lecture.description,
              sortOrder: lectureIndex,
              id: `lecture_${Date.now()}_${lectureIndex}`,
              videoFile: lecture.videoFile instanceof File ? URL.createObjectURL(lecture.videoFile) : '',
            };
            processedLectures.push(lectureData);
          });
        });

        // Update the course with lectures data
        const updatedCourse = {
          ...currentCourse,
          lectures: processedLectures,
          updatedAt: new Date().toISOString()
        };

        // Save the updated course back to localStorage
        localStorage.setItem('current_course', JSON.stringify(updatedCourse));

        // Also update the course in the courses array
        const coursesStr = localStorage.getItem('courses');
        if (coursesStr) {
          const courses = JSON.parse(coursesStr);
          const updatedCourses = courses.map(course =>
            course.id === courseId ? updatedCourse : course
          );
          localStorage.setItem('courses', JSON.stringify(updatedCourses));
        }

        toast.success("Step 3 data updated successfully!");
        goToNextStep();
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("An unexpected error occurred during Step 3 update.");
      }
    }
  };

  const fetchCourseAndGenerateCurriculum = async () => {
    const { courseId } = getValues();

    if (lectureGroupFields.length > 0) {
      return; // Curriculum already exists
    }

    if (!courseId) {
      toast.error("Course ID is missing. Please provide a valid ID.");
      return;
    }

    setIsLoading(true);
    try {
      // Get the current course from localStorage
      const currentCourseStr = localStorage.getItem('current_course');
      if (!currentCourseStr) {
        toast.error("Course data not found. Please start from Step 1.");
        setIsLoading(false);
        return;
      }

      // Parse the current course
      const currentCourse = JSON.parse(currentCourseStr);
      console.log(currentCourse);

      // Get the module count from the course data
      const moduleCount = currentCourse.modulesCount || 4; // Default to 4 if not specified

      // Create modules
      for (let i = 0; i < moduleCount; i++) {
        handleAddLectureGroup(`Module ${i + 1}`);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("An error occurred while fetching the course.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={componentRef} id="step-3" role="tabpanel" className="content fade" aria-labelledby="steppertrigger3">
      <div className="d-sm-flex justify-content-sm-between align-items-center mb-3">
        <h4>Curriculums</h4>
        <AddLecture onAdd={handleAddLectureGroup} />
      </div>
      <hr />
      <div className="row">
        <Accordion className="accordion-icon accordion-bg-light" id="accordionLectureGroups" defaultActiveKey="0">
          {isLoading ? (
            <span className="mx-auto w-fit">Loading...</span>
          ) : (
            <>
              {lectureGroupFields.map((group, groupIndex) => (
                <Accordion.Item key={group.id} eventKey={group.id} className="mb-3">
                  <Accordion.Header as={"h6"} className="font-base">
                    <div
                      className="fw-bold"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateLectureGroupName(groupIndex, e.target.innerText)}
                    >
                      {group.lectureHeading}
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="mt-3">
                    {group.lectures.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className="lecture-item mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="position-relative">
                            <button
                              type="button"
                              className="btn-round mb-0 stretched-link position-static btn btn-danger-soft btn-sm"
                            >
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 448 512"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
                              </svg>
                            </button>
                            <span className="ms-2 mb-0 h6 fw-light">{lecture.topicName}</span>
                          </div>
                          <div>
                            <Button
                              variant="success-soft"
                              size="sm"
                              className="btn-round me-1 mb-1 mb-md-0"
                              onClick={() => { /* Implement edit */ }}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger-soft"
                              size="sm"
                              className="btn-round mb-0"
                              onClick={() => handleRemoveLecture(groupIndex, lectureIndex)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                        <hr />
                      </div>
                    ))}
                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mb-2"
                        onClick={() => handleAddLecture(groupIndex)}
                      >
                        Add Lecture
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => removeLectureGroup(groupIndex)}>
                        Delete Group
                      </Button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </>
          )}
        </Accordion>
      </div>

      <AddTopic
        show={showAddTopicModal}
        onHide={() => setShowAddTopicModal(false)}
        onDataSubmit={handleTopicDataSubmit}
      />

      <div className="d-flex justify-content-between mt-5">
        <button type="button" className="btn btn-secondary prev-btn mb-0" onClick={goBackToPreviousStep}>
          Previous
        </button>
        <button type="button" className="btn btn-primary next-btn mb-0" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3;