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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const componentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Function to update the course in localStorage
  const updateCourseInLocalStorage = () => {
    const currentGroups = getValues("lectureGroups");

    // Get all lectures from all groups
    const allLectures = [];
    const modules = {};

    // Create a properly structured modules object
    const modulesList = [];

    currentGroups.forEach((group, groupIndex) => {
      // Save module name
      const moduleName = group.lectureHeading;

      // Create a proper module object
      const moduleObj = {
        id: `module-${groupIndex}`,
        title: moduleName,
        description: `${moduleName} content`,
        moduleNumber: groupIndex + 1,
        lectures: []
      };

      // Add to modules object for backward compatibility
      modules[moduleName] = [];

      // Process lectures
      if (group.lectures && group.lectures.length > 0) {
        group.lectures.forEach((lecture, lectureIndex) => {
          const lectureData = {
            id: lecture.id || `lecture-${groupIndex}-${lectureIndex}`,
            moduleName: moduleName, // Use the group heading as module name
            topicName: lecture.topicName,
            title: lecture.topicName, // Add title for consistency
            description: lecture.description,
            videoUrl: lecture.videoUrl,
            sortOrder: lectureIndex,
            moduleId: moduleObj.id // Reference to the module
          };

          // Add to all lectures array
          allLectures.push(lectureData);

          // Add to module's lectures array (both formats)
          modules[moduleName].push(lectureData);
          moduleObj.lectures.push(lectureData);
        });
      }

      // Add to modules list
      modulesList.push(moduleObj);
    });

    // Get the current course from localStorage
    const currentCourseStr = localStorage.getItem('current_course');
    if (currentCourseStr) {
      const currentCourse = JSON.parse(currentCourseStr);

      // Update the course with the lectures and modules
      const updatedCourse = {
        ...currentCourse,
        lectures: allLectures,
        modules: modules, // Store modules with their lectures (old format)
        modulesList: modulesList, // Store modules in new format
        updatedAt: new Date().toISOString()
      };

      // Save the updated course back to localStorage
      localStorage.setItem('current_course', JSON.stringify(updatedCourse));
      console.log('Updated current course with lectures and modules:', updatedCourse);

      // Also update the course in the courses array
      const coursesStr = localStorage.getItem('courses');
      if (coursesStr) {
        const courses = JSON.parse(coursesStr);
        const updatedCourses = courses.map(course =>
          course.id === currentCourse.id ? updatedCourse : course
        );
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
      }
    }

    // Also save to draft storage
    try {
      const formData = getValues();
      // Don't save if we're editing an existing course
      if (formData.courseId) return;

      // Save current form state to localStorage
      localStorage.setItem('draft_course_step3', JSON.stringify({
        lectureGroups: currentGroups,
        modules: modules,
        lectures: allLectures
      }));
      console.log('Saved draft course curriculum data');
    } catch (error) {
      console.error('Error saving draft course curriculum:', error);
    }
  };

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

  // Auto-save draft every 10 seconds
  useEffect(() => {
    if (lectureGroupFields.length > 0) {
      const interval = setInterval(() => {
        updateCourseInLocalStorage();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [lectureGroupFields]);

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

      // Update the course in localStorage
      updateCourseInLocalStorage();
    } else {
      console.warn(`Lecture at index ${lectureIndex} in group ${groupIndex} not found.`);
    }
  };

  const handleUpdateLectureGroupName = (groupIndex, newName) => {
    const currentGroups = getValues("lectureGroups");
    const updatedGroups = [...currentGroups];

    // Validate the new name
    if (!newName || newName.trim() === '') {
      toast.error('Module name cannot be empty');
      return;
    }

    // Update the module name
    updatedGroups[groupIndex].lectureHeading = newName;

    // Also update the moduleName in all lectures in this group
    if (updatedGroups[groupIndex].lectures && updatedGroups[groupIndex].lectures.length > 0) {
      updatedGroups[groupIndex].lectures.forEach(lecture => {
        lecture.moduleName = newName;
      });
    }

    setValue("lectureGroups", updatedGroups);

    // Update the current course in localStorage
    updateCourseInLocalStorage();

    // Show success message
    toast.success(`Module name updated to "${newName}"`);

    console.log(`Module at index ${groupIndex} renamed to "${newName}"`);
  };

  const handleTopicDataSubmit = (data) => {
    const { topicName, description, videoFile, videoUrl } = data;

    const currentGroups = getValues("lectureGroups");
    const updatedGroups = [...currentGroups];
    if (!updatedGroups[currentGroupIndex].lectures) {
      updatedGroups[currentGroupIndex].lectures = [];
    }

    // Generate a unique ID for the lecture
    const lectureId = `lecture_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    console.log('Adding lecture with video URL:', videoUrl);

    // Create the lecture object
    const newLecture = {
      id: lectureId,
      topicName,
      description,
      videoFile, // Store the File object for backend upload (not needed anymore but kept for compatibility)
      videoUrl, // Store the Supabase storage URL
      moduleName: updatedGroups[currentGroupIndex].lectureHeading, // Explicitly add moduleName here
      sortOrder: updatedGroups[currentGroupIndex].lectures.length
    };

    // Add the lecture to the group
    updatedGroups[currentGroupIndex].lectures.push(newLecture);

    // Update the form value
    setValue("lectureGroups", updatedGroups);

    // Update the current course in localStorage
    updateCourseInLocalStorage();

    setShowAddTopicModal(false);
    toast.success(`Lecture "${topicName}" added to ${updatedGroups[currentGroupIndex].lectureHeading}`);
  };

  const handleNext = async () => {
    // Save draft before validation
    updateCourseInLocalStorage();
    setIsSubmitting(true);

    // Check if we have at least one lecture in each module
    const { lectureGroups } = getValues();
    let allModulesHaveLectures = true;
    let emptyModules = [];

    lectureGroups.forEach((group) => {
      if (!group.lectures || group.lectures.length === 0) {
        allModulesHaveLectures = false;
        emptyModules.push(group.lectureHeading);
      }
    });

    if (!allModulesHaveLectures) {
      // Show warning but allow to proceed
      const warningMessage = `The following modules have no lectures: ${emptyModules.join(', ')}. Do you want to continue anyway?`;
      if (!confirm(warningMessage)) {
        setIsSubmitting(false);
        return;
      }
    }

    const isValid = await trigger("lectureGroups");
    if (isValid) {
      const { courseId, lectureGroups } = getValues();

      const formData = new FormData();
      const lecturesMetadata = [];

      lectureGroups.forEach((group, groupIndex) => {
        if (group.lectures) {
          group.lectures.forEach((lecture, lectureIndex) => {
            const lectureData = {
              moduleName: group.lectureHeading, // Ensure moduleName is included
              topicName: lecture.topicName,
              description: lecture.description,
              sortOrder: lectureIndex,
              videoUrl: lecture.videoUrl || '', // Include the video URL
            };
            console.log(`Adding lecture metadata with videoUrl: ${lecture.videoUrl}`);
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
        }
      });

      formData.append("lectures", JSON.stringify(lecturesMetadata));

      try {
        // Make sure all lecture data is properly saved
        updateCourseInLocalStorage();

        toast.success("Step 3 data updated successfully!");
        goToNextStep(true); // Mark step as completed
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("An unexpected error occurred during Step 3 update.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
      toast.error("Please ensure all modules have valid content");
    }
  };

  const fetchCourseAndGenerateCurriculum = async () => {
    const { courseId } = getValues();

    if (lectureGroupFields.length > 0) {
      return; // Curriculum already exists
    }

    setIsLoading(true);
    try {
      // Get the current course from localStorage
      const currentCourseStr = localStorage.getItem('current_course');
      if (!currentCourseStr) {
        // Try to get draft data from step 1
        const draftStep1 = localStorage.getItem('draft_course_step1');
        if (draftStep1) {
          const draftData = JSON.parse(draftStep1);
          if (draftData.modulesCount) {
            // Create modules based on the count from step 1
            const moduleCount = parseInt(draftData.modulesCount) || 4;
            console.log(`Creating ${moduleCount} modules from draft data`);

            // Create modules
            for (let i = 0; i < moduleCount; i++) {
              handleAddLectureGroup(`Module ${i + 1}`);
            }

            setIsLoading(false);
            return;
          }
        }

        toast.error("Course data not found. Please start from Step 1.");
        setIsLoading(false);
        return;
      }

      // Parse the current course
      const currentCourse = JSON.parse(currentCourseStr);
      console.log('Current course for curriculum generation:', currentCourse);

      // Get the module count from the course data
      const moduleCount = currentCourse.modulesCount || currentCourse.modules_count || 4;
      console.log(`Module count from course data: ${moduleCount}`);

      // Check if the course has lectures
      if (currentCourse.lectures && currentCourse.lectures.length > 0) {
        console.log('Found existing lectures:', currentCourse.lectures);

        // Group lectures by module name
        const lecturesByModule = {};
        currentCourse.lectures.forEach(lecture => {
          const moduleName = lecture.moduleName || 'Module 1';
          if (!lecturesByModule[moduleName]) {
            lecturesByModule[moduleName] = [];
          }
          lecturesByModule[moduleName].push(lecture);
        });

        console.log('Grouped lectures by module:', lecturesByModule);

        // Create lecture groups from the grouped lectures
        const moduleNames = Object.keys(lecturesByModule);

        // If we have fewer module names than the module count, create the missing ones
        if (moduleNames.length < moduleCount) {
          // First create the modules we have lectures for
          moduleNames.forEach(moduleName => {
            // Add the lecture group
            const groupIndex = lectureGroupFields.length;
            handleAddLectureGroup(moduleName);

            // Add the lectures to the group
            const lectures = lecturesByModule[moduleName];
            const currentGroups = getValues("lectureGroups");
            const updatedGroups = [...currentGroups];

            if (!updatedGroups[groupIndex]) {
              console.warn(`Group at index ${groupIndex} not found.`);
              return;
            }

            if (!updatedGroups[groupIndex].lectures) {
              updatedGroups[groupIndex].lectures = [];
            }

            // Add each lecture to the group
            lectures.forEach(lecture => {
              updatedGroups[groupIndex].lectures.push({
                id: lecture.id,
                topicName: lecture.topicName,
                description: lecture.description,
                videoUrl: lecture.videoUrl,
                moduleName: lecture.moduleName,
                sortOrder: lecture.sortOrder
              });
            });

            setValue("lectureGroups", updatedGroups);
          });

          // Then create the remaining empty modules
          const remainingModules = moduleCount - moduleNames.length;
          for (let i = 0; i < remainingModules; i++) {
            const moduleNumber = moduleNames.length + i + 1;
            handleAddLectureGroup(`Module ${moduleNumber}`);
          }
        } else {
          // Just create the modules we have lectures for
          moduleNames.forEach(moduleName => {
            // Add the lecture group
            const groupIndex = lectureGroupFields.length;
            handleAddLectureGroup(moduleName);

            // Add the lectures to the group
            const lectures = lecturesByModule[moduleName];
            const currentGroups = getValues("lectureGroups");
            const updatedGroups = [...currentGroups];

            if (!updatedGroups[groupIndex]) {
              console.warn(`Group at index ${groupIndex} not found.`);
              return;
            }

            if (!updatedGroups[groupIndex].lectures) {
              updatedGroups[groupIndex].lectures = [];
            }

            // Add each lecture to the group
            lectures.forEach(lecture => {
              updatedGroups[groupIndex].lectures.push({
                id: lecture.id,
                topicName: lecture.topicName,
                description: lecture.description,
                videoUrl: lecture.videoUrl,
                moduleName: lecture.moduleName,
                sortOrder: lecture.sortOrder
              });
            });

            setValue("lectureGroups", updatedGroups);
          });
        }

        console.log('Created lecture groups from existing lectures');
      } else {
        // No existing lectures, create empty modules
        console.log(`No existing lectures found, creating ${moduleCount} empty modules`);

        // Create modules
        for (let i = 0; i < moduleCount; i++) {
          handleAddLectureGroup(`Module ${i + 1}`);
        }
      }

      // Save the module structure to localStorage
      updateCourseInLocalStorage();
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
        <Accordion className="accordion-icon accordion-bg-light" id="accordionLectureGroups" defaultActiveKey="0" style={{ minHeight: '200px' }}>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Generating curriculum...</p>
            </div>
          ) : (
            <>
              {lectureGroupFields.map((group, groupIndex) => (
                <Accordion.Item key={group.id} eventKey={group.id} className="mb-3">
                  <Accordion.Header as={"h6"} className="font-base">
                    <div
                      className="fw-bold module-name-editable"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateLectureGroupName(groupIndex, e.target.innerText)}
                      onKeyDown={(e) => {
                        // Save on Enter key press
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.target.blur();
                          handleUpdateLectureGroupName(groupIndex, e.target.innerText);
                        }
                      }}
                    >
                      {group.lectureHeading}
                    </div>
                    <style jsx>{`
                      .module-name-editable:focus {
                        outline: 2px solid #007bff;
                        padding: 2px 5px;
                        border-radius: 4px;
                      }
                    `}</style>
                  </Accordion.Header>
                  <Accordion.Body className="mt-3">
                    {group.lectures.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className="lecture-item mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="position-relative">
                            {lecture.videoUrl ? (
                              <button
                                type="button"
                                className="btn-round mb-0 position-static btn btn-success-soft btn-sm"
                                onClick={() => {
                                  // Create a modal or popup to play the video
                                  window.open(lecture.videoUrl, '_blank');
                                }}
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
                            ) : (
                              <button
                                type="button"
                                className="btn-round mb-0 position-static btn btn-danger-soft btn-sm"
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
                            )}
                            <span className="ms-2 mb-0 h6 fw-light">{lecture.topicName}</span>
                          </div>
                          <div>
                            <Button
                              variant="success-soft"
                              size="sm"
                              className="btn-round me-1 mb-1 mb-md-0"
                              onClick={() => {
                                // Set current group index and show modal with pre-filled data
                                setCurrentGroupIndex(groupIndex);
                                // Open the modal with the lecture data pre-filled
                                setShowAddTopicModal(true);
                                // Pre-fill the form data (this will be handled in the AddTopic component)
                                // We'll pass the lecture data as a prop to the AddTopic component
                              }}
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
        <button
          type="button"
          className="btn btn-secondary prev-btn mb-0"
          onClick={goBackToPreviousStep}
          disabled={isSubmitting}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-primary next-btn mb-0"
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Step3;