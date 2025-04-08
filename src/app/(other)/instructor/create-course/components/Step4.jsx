

// import React, { useState } from 'react';
// import { Col, Row, Button, Badge } from 'react-bootstrap';
// import { useFieldArray, useFormContext } from 'react-hook-form';
// import { FaEdit, FaTimes } from 'react-icons/fa';
// import AddToQuestion from './AddToQuestion';
// import Link from 'next/link';
// import TagInput from './TagInput';
// import { v4 as uuidv4 } from 'uuid';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import axiosInstance from '@/utils/axiosInstance'; // Updated import path
// import { checkIsLoggedInUser } from '@/helpers/checkLoggedInUser'; // Updated import path

// const Step4 = ({ goBackToPreviousStep, onSubmit }) => {
//   const { register, formState: { errors }, control, setValue, getValues } = useFormContext();
//   const router = useRouter();
//   const [showModal, setShowModal] = useState(false);
//   const [editingFaq, setEditingFaq] = useState(null); // { faq: {question, answer, id}, index }

//   const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
//     control,
//     name: 'faqs',
//   });

//   const handleAddFaq = (newFaq) => {
//     appendFaq({ ...newFaq, id: uuidv4() }); // Add ID *here*
//     setShowModal(false); // Close the modal when adding
//   };

//   const handleEditFaq = (index) => {
//     const faqToEdit = faqFields[index];
//     setEditingFaq({ ...faqToEdit, index }); // Store the ENTIRE object, plus index
//     setShowModal(true);
//   };

//   const handleUpdateFaq = (index, updatedFaq) => {
//     const currentFaqs = getValues('faqs');
//     const updatedFaqs = [...currentFaqs];
//     updatedFaqs[index] = { ...updatedFaqs[index], ...updatedFaq }; // Keep ID!
//     setValue('faqs', updatedFaqs);
//     setEditingFaq(null); // Clear
//   };

//   const handleRemoveFaq = (index) => {
//     removeFaq(index);
//   };

//   // Tags
//   const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
//     control,
//     name: 'tags',
//   });

//   const handleAddTag = () => {
//     const currentTags = getValues('tags').map(tagObj => tagObj.tagName);
//     const newTag = document.getElementById('tag-input').value.trim(); // Get value from input
//     if (newTag && !currentTags.includes(newTag)) { // Prevent duplicates
//       appendTag({ tagName: newTag }); // Add as an object
//       document.getElementById('tag-input').value = ''; // Clear input
//     }
//   };

//   const handleRemoveTag = (index) => {
//     removeTag(index);
//   };

//   // Enter key to add
//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault(); // Prevent form submission
//       handleAddTag();
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // Get all form data including courseId, faqs, and tags
//       const { courseId, faqs, tags, ...restFormData } = getValues();

//       // Check if courseId is present
//       if (!courseId) {
//         throw new Error('Course ID is missing. Please ensure it’s provided in the form.');
//       }

//       // Prepare the payload
//       const payload = {
//         ...restFormData, // Other course fields
//         faqs: faqs || [], // Ensure faqs is an array
//         tags: tags || [], // Ensure tags is an array
//       };

//       // Authentication check
//       const { error, token } = await checkIsLoggedInUser();
//       if (error) {
//         toast.error('User authentication failed.');
//         return;
//       }

//       // Send the data to the backend
//       const response = await axiosInstance.put(`/api/courses/${courseId}`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       // Check if the request was successful
//       if (response.status === 200) {
//         toast.success(response.data.message || 'Course saved successfully');
//         router.push('/courses');
//       } else {
//         toast.error('Failed to save course.');
//       }
//     } catch (error) {
//       console.error('Error in handleSubmit:', error);
//       toast.error(error.response?.data?.message || 'An unexpected error occurred while saving the course.');
//     }
//   };

//   return (
//     <div id="step-4" role="tabpanel" className="content fade" aria-labelledby="steppertrigger4">
//       <h4>Additional information</h4>
//       <hr />
//       <Row className=" g-4">
//         <Col xs={12} className="">
//           <div className="bg-light border rounded p-2 p-sm-4">
//             <div className="d-sm-flex justify-content-sm-between align-items-center mb-3">
//               <h5 className="mb-2 mb-sm-0">Upload FAQs</h5>
//               <AddToQuestion
//                 onAdd={handleAddFaq}
//                 onUpdate={handleUpdateFaq}
//                 faqToEdit={editingFaq}
//                 updateFaqShowModel={showModal}
//               />
//             </div>
//             <Row className=" g-4">
//               {faqFields.map((faq, index) => (
//                 <Col key={faq.id} xs={12}>
//                   <div className="bg-body p-3 p-sm-4 border rounded">
//                     <div className="d-sm-flex justify-content-sm-between align-items-center mb-2">
//                       <h6 className="mb-0">{faq.question}</h6>
//                       <div className="align-middle">
//                         <Button variant="success-soft" size="sm" className="btn-round me-1 mb-1 mb-md-0" onClick={() => handleEditFaq(index)}>
//                           <FaEdit />
//                         </Button>
//                         <Button variant="danger-soft" size="sm" className="btn-round mb-0" onClick={() => handleRemoveFaq(index)}>
//                           <FaTimes />
//                         </Button>
//                       </div>
//                     </div>
//                     <p>{faq.answer}</p>
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         </Col>
//         <Col xs={12}>
//           <div className="bg-light border rounded p-4">
//             <h5 className="mb-0">Tags</h5>
//             <div className="mt-3">
//               <div className="d-flex align-items-center">
//                 <input
//                   type="text"
//                   className="form-control form-control-sm me-2"
//                   placeholder="Enter tag"
//                   id="tag-input"
//                   onKeyDown={handleKeyDown}
//                 />
//               </div>
//               {/* Display Tags as Badges */}
//               <div className="mt-2">
//                 {tagFields.map((tag, index) => (
//                   <Badge key={tag.id} bg="primary" className="me-2">
//                     {tag.tagName}
//                     <Button
//                       variant="link"
//                       size="sm"
//                       className="text-white p-0 ms-1"
//                       onClick={() => handleRemoveTag(index)}
//                     >
//                       <FaTimes />
//                     </Button>
//                   </Badge>
//                 ))}
//               </div>
//               <span className="small">Maximum of 14 keywords...</span>
//             </div>
//           </div>
//         </Col>
//         <div className="d-md-flex justify-content-between align-items-start mt-4">
//           <button className="btn btn-secondary prev-btn mb-2 mb-md-0" onClick={goBackToPreviousStep}>Previous</button>
//           <div className="text-md-end">
//             <Button className="btn btn-success mb-2 mb-sm-0" onClick={handleSubmit}>Submit a Course</Button>
//           </div>
//         </div>
//       </Row>
//     </div>
//   );
// };

// export default Step4;


import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Badge, Form, Card } from 'react-bootstrap';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FaEdit, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import AddToQuestion from './AddToQuestion';
import { v4 as uuidv4 } from 'uuid';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
import { checkIsLoggedInUser } from '@/helpers/checkLoggedInUser';

const Step4 = ({ goBackToPreviousStep, onSubmit }) => {
  const { register, formState: { errors }, control, setValue, getValues, watch } = useFormContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Course scheduling states
  const [selectedDay, setSelectedDay] = useState('monday');
  const [slotsPerDay, setSlotsPerDay] = useState(3);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [estimatedEndDate, setEstimatedEndDate] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Watch the number of lectures to calculate end date
  const lectureGroups = watch('lectureGroups') || [];
  const courseType = watch('courseType') || 'recorded';

  // Generate time slots (9:00 AM to 5:00 PM, 45-minute slots)
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
    { id: 11, time: '4:30 PM - 5:00 PM' },
  ];

  // Days of the week
  const daysOfWeek = [
    { id: 'monday', name: 'Monday' },
    { id: 'tuesday', name: 'Tuesday' },
    { id: 'wednesday', name: 'Wednesday' },
    { id: 'thursday', name: 'Thursday' },
    { id: 'friday', name: 'Friday' },
  ];

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: 'faqs',
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags',
  });

  // Calculate estimated end date based on lectures and slots per day
  const calculateEstimatedEndDate = () => {
    // Count total lectures
    const totalLectures = lectureGroups.reduce((total, group) => {
      return total + (group.lectures ? group.lectures.length : 0);
    }, 0);

    if (totalLectures === 0 || slotsPerDay === 0) {
      setEstimatedEndDate(null);
      return;
    }

    // Calculate number of weeks needed
    const lecturesPerWeek = slotsPerDay;
    const weeksNeeded = Math.ceil(totalLectures / lecturesPerWeek);

    // Calculate end date based on selected start date
    const startDateObj = new Date(startDate);
    const endDate = new Date(startDateObj);
    endDate.setDate(startDateObj.getDate() + (weeksNeeded * 7));

    setEstimatedEndDate(endDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  };

  // Handle slot selection
  const handleSlotSelection = (slotId) => {
    if (selectedSlots.includes(slotId)) {
      // Remove slot if already selected
      setSelectedSlots(selectedSlots.filter(id => id !== slotId));
    } else {
      // Add slot if not selected and we haven't reached the limit
      if (selectedSlots.length < slotsPerDay) {
        setSelectedSlots([...selectedSlots, slotId]);
      } else {
        toast.error(`You can only select ${slotsPerDay} slots per day`);
      }
    }
  };

  // Update slots per day
  const handleSlotsPerDayChange = (e) => {
    const value = parseInt(e.target.value);
    setSlotsPerDay(value);
    // Clear selected slots if we reduce the number of slots
    if (selectedSlots.length > value) {
      setSelectedSlots(selectedSlots.slice(0, value));
    }
  };

  // Update form values when scheduling changes
  useEffect(() => {
    // Calculate lecture schedule based on selected slots
    const totalLectures = lectureGroups.reduce((total, group) => {
      return total + (group.lectures ? group.lectures.length : 0);
    }, 0);

    const lecturesPerWeek = slotsPerDay;
    const weeksNeeded = Math.ceil(totalLectures / lecturesPerWeek);

    // Calculate end date based on selected start date
    const newStartDate = new Date(startDate);
    const endDate = new Date(newStartDate);
    endDate.setDate(newStartDate.getDate() + (weeksNeeded * 7));

    setValue('scheduling', {
      day: selectedDay,
      slotsPerDay,
      selectedSlots,
      startDate: newStartDate.toISOString(),
      endDate: endDate.toISOString(),
      totalWeeks: weeksNeeded
    });
    calculateEstimatedEndDate();
  }, [selectedDay, slotsPerDay, selectedSlots, lectureGroups, startDate, setValue]);

  // Fetch course data on mount and preserve lectures
  useEffect(() => {
    const fetchCourseData = async (courseId) => {
      try {
        // Get course data from localStorage
        const coursesStr = localStorage.getItem('courses');
        if (!coursesStr) {
          throw new Error('No courses found in localStorage');
        }

        const courses = JSON.parse(coursesStr);
        const courseData = courses.find(c => c.id === courseId);

        if (!courseData) {
          throw new Error(`Course with ID ${courseId} not found`);
        }

        // Set current course in localStorage for other steps to use
        localStorage.setItem('current_course', JSON.stringify(courseData));

        // Set all form values
        setValue('title', courseData.title);
        setValue('shortDescription', courseData.shortDesription || '');
        setValue('description', courseData.description || '');
        setValue('category', courseData.category || '');
        setValue('level', courseData.level || '');
        setValue('language', courseData.language || '');
        setValue('modulesCount', courseData.modulesCount || 4);
        setValue('courseType', courseData.courseType || 'recorded');
        setValue('color', courseData.color || '#ffffff');
        setValue('icon', courseData.icon || '');
        setValue('promoVideoUrl', courseData.promoVideoUrl || '');

        // Handle lectures if they exist
        if (courseData.lectures && Array.isArray(courseData.lectures)) {
          setValue('lectures', courseData.lectures.map(lec => ({
            id: lec.id,
            topicName: lec.topicName,
            description: lec.description,
            sortOrder: lec.sortOrder || 0,
            videoFile: lec.videoFile || '', // Preserve video URL
          })));
        }

        // Handle FAQs if they exist
        if (courseData.faqs && Array.isArray(courseData.faqs)) {
          setValue('faqs', courseData.faqs);
        } else {
          setValue('faqs', []);
        }

        // Handle tags if they exist
        if (courseData.tags && Array.isArray(courseData.tags)) {
          setValue('tags', courseData.tags);
        } else {
          setValue('tags', []);
        }

        setValue('courseId', courseId);

        // Set scheduling data if available
        if (courseData.scheduling) {
          setSelectedDay(courseData.scheduling.day || 'monday');
          setSlotsPerDay(courseData.scheduling.slotsPerDay || 3);
          setSelectedSlots(courseData.scheduling.selectedSlots || []);
          if (courseData.scheduling.startDate) {
            setStartDate(new Date(courseData.scheduling.startDate).toISOString().split('T')[0]);
          }
        }

        toast.success('Course data loaded successfully');
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('Failed to load course data: ' + error.message);
      }
    };

    const courseIdFromParams = searchParams.get('courseId');
    const courseIdFromForm = getValues('courseId');
    const courseId = courseIdFromForm || courseIdFromParams;

    if (courseId) {
      fetchCourseData(courseId);
    }
  }, [searchParams, setValue, getValues]);

  const handleAddFaq = (newFaq) => {
    appendFaq({ ...newFaq, id: uuidv4() });
    setShowModal(false);
  };

  const handleEditFaq = (index) => {
    const faqToEdit = faqFields[index];
    setEditingFaq({ ...faqToEdit, index });
    setShowModal(true);
  };

  const handleUpdateFaq = (index, updatedFaq) => {
    const currentFaqs = getValues('faqs');
    const updatedFaqs = [...currentFaqs];
    updatedFaqs[index] = { ...updatedFaqs[index], ...updatedFaq };
    setValue('faqs', updatedFaqs);
    setEditingFaq(null);
  };

  const handleRemoveFaq = (index) => {
    removeFaq(index);
  };

  const handleAddTag = () => {
    const currentTags = getValues('tags').map(tagObj => tagObj.tagName);
    const newTag = document.getElementById('tag-input').value.trim();
    if (newTag && !currentTags.includes(newTag)) {
      appendTag({ tagName: newTag });
      document.getElementById('tag-input').value = '';
    }
  };

  const handleRemoveTag = (index) => {
    removeTag(index);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };


  const handleSubmit = async () => {
    try {
      const formData = getValues();
      const courseId = formData.courseId || searchParams.get('courseId');

      if (!courseId) {
        throw new Error('Course ID is missing. Please ensure it’s set in the form or URL.');
      }

      // Validate scheduling data
      if (!selectedDay) {
        toast.error('Please select a day for the course');
        return;
      }

      if (selectedSlots.length === 0) {
        toast.error('Please select at least one time slot');
        return;
      }

      if (selectedSlots.length !== slotsPerDay) {
        toast.error(`Please select exactly ${slotsPerDay} time slots`);
        return;
      }

      // Get the current course from localStorage
      const currentCourseStr = localStorage.getItem('current_course');
      if (!currentCourseStr) {
        toast.error("Course data not found. Please start from Step 1.");
        return;
      }

      // Parse the current course
      const currentCourse = JSON.parse(currentCourseStr);

      // Transform lectureGroups into a flat lectures array
      const lectures = (formData.lectureGroups || []).flatMap((group, groupIndex) =>
        group.lectures.map((lecture, lectureIndex) => {
          return {
            topicName: lecture.topicName,
            description: lecture.description,
            sortOrder: lectureIndex,
            videoFile: lecture.videoFile || '',
            id: `lecture_${Date.now()}_${lectureIndex}`, // Generate a unique ID
          };
        })
      );

      // Calculate lecture schedule based on selected slots
      const totalLectures = lectures.length;
      const lecturesPerWeek = slotsPerDay;
      const weeksNeeded = Math.ceil(totalLectures / lecturesPerWeek);

      // Calculate end date
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + (weeksNeeded * 7));

      // Prepare scheduling data
      const schedulingData = {
        day: selectedDay,
        slotsPerDay: slotsPerDay,
        selectedSlots: selectedSlots,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        totalWeeks: weeksNeeded
      };

      // Create the final course object
      const finalCourse = {
        ...currentCourse,
        lectures,
        faqs: formData.faqs || [],
        tags: formData.tags || [],
        scheduling: schedulingData,
        courseType: formData.courseType || 'recorded',
        status: 'published',
        updatedAt: new Date().toISOString()
      };

      console.log('Final course data:', finalCourse);

      // Save the final course to localStorage
      localStorage.setItem('current_course', JSON.stringify(finalCourse));

      // Update the course in the courses array
      const coursesStr = localStorage.getItem('courses');
      if (coursesStr) {
        const courses = JSON.parse(coursesStr);
        const updatedCourses = courses.map(course =>
          course.id === courseId ? finalCourse : course
        );
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
      }

      toast.success('Course saved successfully!');
      router.push('/courses');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    }
  };


  return (
    <div id="step-4" role="tabpanel" className="content fade" aria-labelledby="steppertrigger4">
      <h4>Additional information</h4>
      <hr />
      <Row className=" g-4">
        {/* Course Scheduling Section */}
        <Col xs={12}>
          <div className="bg-light border rounded p-2 p-sm-4">
            <div className="d-sm-flex justify-content-sm-between align-items-center mb-3">
              <h5 className="mb-2 mb-sm-0">Course Scheduling</h5>
              {estimatedEndDate && (
                <Badge bg="info" className="fs-6">
                  <FaCalendarAlt className="me-2" />
                  Estimated End Date: {estimatedEndDate}
                </Badge>
              )}
            </div>

            <Row className="g-4 mb-4">
              {/* Start Date */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      const newStartDate = new Date(e.target.value);
                      // Recalculate end date
                      const totalLectures = lectureGroups.reduce((total, group) => {
                        return total + (group.lectures ? group.lectures.length : 0);
                      }, 0);
                      const weeksNeeded = Math.ceil(totalLectures / slotsPerDay);
                      const endDate = new Date(newStartDate);
                      endDate.setDate(newStartDate.getDate() + (weeksNeeded * 7));
                      setEstimatedEndDate(endDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }));
                    }}
                    className="form-control"
                  />
                  <Form.Text className="text-muted">
                    Select the start date for this course
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Day Selection */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Day</Form.Label>
                  <Form.Select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="form-control"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day.id} value={day.id}>{day.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Select the day of the week for this course
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Slots Per Day */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slots Per Day</Form.Label>
                  <Form.Select
                    value={slotsPerDay}
                    onChange={handleSlotsPerDayChange}
                    className="form-control"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} slot{num !== 1 ? 's' : ''}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Number of 45-minute slots per day
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Time Slots */}
            <Form.Group className="mb-3">
              <Form.Label>Select Time Slots (Choose {slotsPerDay})</Form.Label>
              <Row className="g-2">
                {timeSlots.map(slot => (
                  <Col key={slot.id} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      className={`mb-2 ${selectedSlots.includes(slot.id) ? 'border-primary border-2' : 'border'}`}
                      onClick={() => handleSlotSelection(slot.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Body className={`p-2 ${selectedSlots.includes(slot.id) ? 'bg-primary text-white' : ''}`}>
                        <div className="d-flex align-items-center">
                          <FaClock className="me-2" />
                          <span>{slot.time}</span>
                        </div>
                        {selectedSlots.includes(slot.id) && (
                          <div className="mt-1 text-center">
                            <Badge bg="light" text="primary">Selected</Badge>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Form.Text className="text-muted">
                Click to select/deselect time slots
              </Form.Text>
            </Form.Group>
          </div>
        </Col>

        {/* FAQs Section */}
        <Col xs={12} className="">
          <div className="bg-light border rounded p-2 p-sm-4">
            <div className="d-sm-flex justify-content-sm-between align-items-center mb-3">
              <h5 className="mb-2 mb-sm-0">Upload FAQs</h5>
              <AddToQuestion
                onAdd={handleAddFaq}
                onUpdate={handleUpdateFaq}
                faqToEdit={editingFaq}
                updateFaqShowModel={showModal}
              />
            </div>
            <Row className=" g-4">
              {faqFields.map((faq, index) => (
                <Col key={faq.id} xs={12}>
                  <div className="bg-body p-3 p-sm-4 border rounded">
                    <div className="d-sm-flex justify-content-sm-between align-items-center mb-2">
                      <h6 className="mb-0">{faq.question}</h6>
                      <div className="align-middle">
                        <Button variant="success-soft" size="sm" className="btn-round me-1 mb-1 mb-md-0" onClick={() => handleEditFaq(index)}>
                          <FaEdit />
                        </Button>
                        <Button variant="danger-soft" size="sm" className="btn-round mb-0" onClick={() => handleRemoveFaq(index)}>
                          <FaTimes />
                        </Button>
                      </div>
                    </div>
                    <p>{faq.answer}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col xs={12}>
          <div className="bg-light border rounded p-4">
            <div className="mt-3">
              <div className="d-flex align-items-center">
                <input
                  type="text"
                  className="form-control form-control-sm me-2"
                  placeholder="Enter tag"
                  id="tag-input"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="mt-2">
                {tagFields.map((tag, index) => (
                  <Badge key={tag.id} bg="primary" className="me-2">
                    {tag.tagName}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-white p-0 ms-1"
                      onClick={() => handleRemoveTag(index)}
                    >
                      <FaTimes />
                    </Button>
                  </Badge>
                ))}
              </div>
              <span className="small">Maximum of 14 keywords...</span>
            </div>
          </div>
        </Col>
        <div className="d-md-flex justify-content-between align-items-start mt-4">
          <button className="btn btn-secondary prev-btn mb-2 mb-md-0" onClick={goBackToPreviousStep}>Previous</button>
          <div className="text-md-end">
            <Button className="btn btn-success mb-2 mb-sm-0" onClick={handleSubmit}>Submit a Course</Button>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default Step4;