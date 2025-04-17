// src/app/courses/create/Step1.jsx
import axiosInstance from '@/utils/axiosInstance';
import { Button, Col, Row } from 'react-bootstrap';
import { useFormContext, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';
import { checkIsLoggedInUser } from '@/helpers/checkLoggedInUser';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
// import { getCookie } from 'cookies-next'; // Import getCookie

const Step1 = ({ goToNextStep }) => {
  const { register, formState: { errors }, control, setValue, trigger, getValues } = useFormContext();
  const searchParams = useSearchParams();

  // Load existing course data if editing
  useEffect(() => {
    const courseId = searchParams.get('courseId');
    if (courseId) {
      try {
        // Get courses from localStorage
        const coursesStr = localStorage.getItem('courses');
        if (!coursesStr) {
          console.error('No courses found in localStorage');
          return;
        }

        const courses = JSON.parse(coursesStr);
        const course = courses.find(c => c.id === courseId);

        if (!course) {
          console.error(`Course with ID ${courseId} not found`);
          return;
        }

        // Log the course data for debugging
        console.log('Loading course for editing:', course);

        // Set form values
        setValue('courseId', courseId);
        setValue('title', course.title || '');
        setValue('shortDescription', course.shortDesription || course.short_description || '');
        setValue('description', course.description || '');
        setValue('category', course.category || '');
        setValue('level', course.level || '');
        setValue('language', course.language || '');
        setValue('modulesCount', course.modulesCount || course.modules_count || 4);
        setValue('courseType', course.courseType || course.format || 'recorded');
        setValue('color', course.color || '#ffffff');
        setValue('icon', course.icon || '');
        setValue('promoVideoUrl', course.promoVideoUrl || '');

        // Save the current course being edited
        localStorage.setItem('current_course', JSON.stringify(course));

        toast.success('Course loaded for editing');
      } catch (error) {
        console.error('Error loading course for editing:', error);
        toast.error('Failed to load course for editing');
      }
    }
  }, [searchParams, setValue]);


  const handleNext = async () => {
    // 1. Validate Step 1 fields:
    const isValid = await trigger(["title", "shortDescription", "description", "category", "level", "language", "modulesCount", "estimatedDuration", "promoVideoUrl"]);

    if (isValid) {
      // 2. Get all the values from the form:
      const formData = getValues();

      // Check if we're editing an existing course
      const existingCourseId = formData.courseId;

      // Prepare the data for this step
      const data = {
        title: formData.title,
        shortDesription: formData.shortDescription,
        category: formData.category,
        level: formData.level,
        language: formData.language,
        modulesCount: formData.modulesCount,
        description: formData.description,
        courseType: formData.courseType || 'recorded', // Add course type
        estimatedDuration: formData.estimatedDuration || '10 hours',
        totalLectures: formData.modulesCount * 3, // Estimate 3 lectures per module
        promoVideoUrl: formData.promoVideoUrl || '',
        color: '#630000', // Default color, will be updated in Step 2
        icon: 'FaBook', // Default icon, will be updated in Step 2
      }

      try {
        // Check if we're editing an existing course
        if (existingCourseId) {
          // Get existing courses from localStorage
          const existingCoursesStr = localStorage.getItem('courses');
          if (!existingCoursesStr) {
            throw new Error('No courses found in localStorage');
          }

          const existingCourses = JSON.parse(existingCoursesStr);
          const courseIndex = existingCourses.findIndex(course => course.id === existingCourseId);

          if (courseIndex === -1) {
            throw new Error(`Course with ID ${existingCourseId} not found`);
          }

          // Update the existing course
          const updatedCourse = {
            ...existingCourses[courseIndex],
            ...data,
            updatedAt: new Date().toISOString(),
          };

          // Update the course in the array
          existingCourses[courseIndex] = updatedCourse;

          // Save back to localStorage
          localStorage.setItem('courses', JSON.stringify(existingCourses));

          // Save the current course being edited
          localStorage.setItem('current_course', JSON.stringify(updatedCourse));

          console.log('Course updated successfully:', updatedCourse);
          toast.success("Course updated successfully!");
        } else {
          // Generate a unique ID for the new course
          const courseId = 'course_' + Date.now();

          // Create a course object
          const courseData = {
            id: courseId,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'draft',
            instructor_id: 'local_instructor',
          };

          // Get existing courses from localStorage or initialize empty array
          const existingCoursesStr = localStorage.getItem('courses');
          const existingCourses = existingCoursesStr ? JSON.parse(existingCoursesStr) : [];

          // Add the new course
          existingCourses.push(courseData);

          // Save back to localStorage
          localStorage.setItem('courses', JSON.stringify(existingCourses));

          // Save the current course being created
          localStorage.setItem('current_course', JSON.stringify(courseData));

          // Set the courseId in the form
          setValue('courseId', courseId);

          console.log('Course created successfully:', courseData);
          toast.success("Step 1 completed successfully!");
        }

        // Go to the next step
        goToNextStep();
      } catch (error) {
        toast.error("An unexpected error occurred: " + error.message);
        console.error("Error handling course:", error);
      }
    }
  };


  return (
    // No <form> tag here!
    <div id="step-1" role="tabpanel" className="content fade" aria-labelledby="steppertrigger1">
      <h4>Course details</h4>
      <hr />
      <Row className="g-4">
        {/* Course Title */}
        <Col xs={12}>
          <label className="form-label">Course title <span className='text-danger'>*</span></label>
          <input
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            type="text"
            placeholder="Enter course title"
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "Title must be at least 3 characters" },
              maxLength: { value: 100, message: "Title cannot exceed 100 characters" }
            })}
          />
          {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
        </Col>

        {/* Short Description */}
        <Col xs={12}>
          <label className="form-label">Short description <span className='text-danger'>*</span></label>
          <textarea
            className={`form-control ${errors.shortDescription ? 'is-invalid' : ''}`}
            rows={2}
            placeholder="Enter keywords"
            {...register("shortDescription", {
              required: "Short description is required",
              minLength: { value: 10, message: "Short description must be at least 10 characters" },
              maxLength: { value: 200, message: "Short description cannot exceed 200 characters" }
            })}
          />
          {errors.shortDescription && <div className="invalid-feedback">{errors.shortDescription.message}</div>}
        </Col>

        {/* Course Category */}
        <Col md={6}>
          <label className="form-label">Course category<span className='text-danger'>*</span></label>
          <select
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            aria-label=".form-select-sm"
            {...register("category", { required: "Category is required" })}
          >
            <option value="" hidden>Select category</option>
            <option value="languages-and-communication">Languages & Communication</option>
            <option value="cooking-and-household">Cooking & Household</option>
            <option value="creativity-and-craftsmanship">Creativity & Craftsmanship</option>
            <option value="digital-and-it">Digital & IT</option>
            <option value="health-and-exercise">Health & Exercise</option>
            <option value="nature-and-gardening">Nature & Gardening</option>
            <option value="career-and-education">Career & Education</option>
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
        </Col>

        {/* Course Level */}
        <Col md={6}>
          <label className="form-label">Course level <span className='text-danger'>*</span></label>
          <select
            className={`form-select ${errors.level ? 'is-invalid' : ''}`}
            aria-label=".form-select-sm"
            {...register("level", { required: "Course level is required" })}
          >
            <option value="">Select course level</option>
            <option value="All level">All level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advance">Advance</option>
          </select>
          {errors.level && <div className="invalid-feedback">{errors.level.message}</div>}
        </Col>

        {/* Language */}
        <Col md={6}>
          <label className="form-label">Language <span className='text-danger'>*</span></label>
          <select
            className={`form-select ${errors.language ? 'is-invalid' : ''}`}
            aria-label=".form-select-sm"
            {...register("language", { required: "Language is required" })}
          >
            <option value="">Select language</option>
            <option value="English">English</option>
            {/* Add more language options */}
          </select>
          {errors.language && <div className="invalid-feedback">{errors.language.message}</div>}
        </Col>

        {/* Course Type */}
        <Col md={6}>
          <label className="form-label">Course Type <span className='text-danger'>*</span></label>
          <select
            className={`form-select ${errors.courseType ? 'is-invalid' : ''}`}
            aria-label=".form-select-sm"
            {...register("courseType", { required: "Course type is required" })}
          >
            <option value="recorded">Recorded</option>
            <option value="live">Live (Coming Soon)</option>
          </select>
          {errors.courseType && <div className="invalid-feedback">{errors.courseType.message}</div>}
        </Col>

        {/* Count of Modules */}
        <Col md={6}>
          <label className="form-label">Count of Modules</label>
          <input
            className={`form-control ${errors.modulesCount ? 'is-invalid' : ''}`}
            type="number"
            placeholder="How many modules"
            {...register("modulesCount", {
              valueAsNumber: true,
              required: "Number of modules is required",
              min: { value: 1, message: "Must have at least 1 module" },
              max: { value: 100, message: "Cannot have more than 100 modules" }
            })}
          />
          {errors.modulesCount && <div className="invalid-feedback">{errors.modulesCount.message}</div>}
        </Col>

        {/* Estimated Duration */}
        <Col md={6}>
          <label className="form-label">Estimated Duration</label>
          <input
            className={`form-control ${errors.estimatedDuration ? 'is-invalid' : ''}`}
            type="text"
            placeholder="e.g., 10 hours, 4 weeks"
            {...register("estimatedDuration", {
              required: "Estimated duration is required"
            })}
          />
          {errors.estimatedDuration && <div className="invalid-feedback">{errors.estimatedDuration.message}</div>}
        </Col>

        {/* Promo Video URL */}
        <Col md={12}>
          <label className="form-label">Promotional Video URL</label>
          <input
            className={`form-control ${errors.promoVideoUrl ? 'is-invalid' : ''}`}
            type="url"
            placeholder="YouTube or other video URL"
            {...register("promoVideoUrl", {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/i,
                message: "Please enter a valid YouTube or Vimeo URL"
              }
            })}
          />
          {errors.promoVideoUrl && <div className="invalid-feedback">{errors.promoVideoUrl.message}</div>}
        </Col>

        {/* Description (ReactQuill) */}
        <Col xs={12}>
          <label className="form-label">Add description <span className='text-danger'>*</span></label>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                className={errors.description ? 'is-invalid h-75' : ''}
              />
            )}
          />
          {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
        </Col>

        {/* Next Button */}
        <div className="d-flex justify-content-end mt-5">
          <Button type="button" variant="primary" className="mb-0" onClick={handleNext}>
            {getValues('courseId') ? 'Update & Next' : 'Create Course & Next'}
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default Step1;