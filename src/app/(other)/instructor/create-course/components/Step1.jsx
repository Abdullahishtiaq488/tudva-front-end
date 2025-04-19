// src/app/courses/create/Step1.jsx
import axiosInstance from '@/utils/axiosInstance';
import { Button, Col, Row } from 'react-bootstrap';
import { useFormContext, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';
import { checkIsLoggedInUser } from '@/helpers/checkLoggedInUser';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// import { getCookie } from 'cookies-next'; // Import getCookie

const Step1 = ({ goToNextStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, formState: { errors }, control, setValue, trigger, getValues } = useFormContext();
  const searchParams = useSearchParams();

  // Load existing course data if editing or from localStorage if available
  useEffect(() => {
    // First check if we're editing an existing course
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
        setValue('short_description', course.short_description || '');
        setValue('description', course.description || '');
        setValue('category', course.category || '');
        setValue('level', course.level || '');
        setValue('language', course.language || '');
        // Ensure we use the actual modules_count from the course
        const moduleCount = course.modules_count || course.modulesCount || 4;
        console.log('Setting module count to:', moduleCount);
        setValue('modulesCount', moduleCount);
        setValue('courseType', course.courseType || course.format || 'recorded');
        setValue('color', course.color || '#ffffff');
        setValue('icon', course.icon || '');
        // Check all possible property names for promo video URL
        const promoUrl = course.promoVideoUrl || course.promo_video_url || '';
        console.log('Setting promo video URL to:', promoUrl);
        setValue('promoVideoUrl', promoUrl);

        // Save the current course being edited
        localStorage.setItem('current_course', JSON.stringify(course));

        toast.success('Course loaded for editing');
      } catch (error) {
        console.error('Error loading course for editing:', error);
        toast.error('Failed to load course for editing');
      }
    } else {
      // Check if there's a draft course in localStorage
      try {
        const draftCourse = localStorage.getItem('draft_course_step1');
        if (draftCourse) {
          const courseData = JSON.parse(draftCourse);
          console.log('Found draft course data:', courseData);

          // Set form values from draft
          setValue('title', courseData.title || '');
          setValue('short_description', courseData.short_description || courseData.shortDesription || courseData.shortDescription || '');
          setValue('description', courseData.description || '');
          setValue('category', courseData.category || '');
          setValue('level', courseData.level || '');
          setValue('language', courseData.language || '');
          setValue('modulesCount', courseData.modulesCount || 4);
          setValue('courseType', courseData.courseType || 'recorded');
          setValue('promoVideoUrl', courseData.promoVideoUrl || '');
          setValue('estimatedDuration', courseData.estimatedDuration || '');

          toast.success('Recovered draft course data');
        }
      } catch (error) {
        console.error('Error loading draft course:', error);
      }
    }
  }, [searchParams, setValue]);

  // Save draft data when form values change
  const saveDraft = () => {
    try {
      const formData = getValues();
      // Don't save if we're editing an existing course
      if (formData.courseId) return;

      // Save current form state to localStorage
      localStorage.setItem('draft_course_step1', JSON.stringify(formData));
      console.log('Saved draft course data:', formData);
    } catch (error) {
      console.error('Error saving draft course:', error);
    }
  };

  // Auto-save draft every 5 seconds
  useEffect(() => {
    const interval = setInterval(saveDraft, 5000);
    return () => clearInterval(interval);
  }, []);


  const handleNext = async () => {
    // Save draft before validation
    saveDraft();
    setIsSubmitting(true);

    // 1. Validate Step 1 fields (promoVideoUrl is optional):
    const isValid = await trigger(["title", "short_description", "description", "category", "level", "language", "modulesCount"]);

    if (isValid) {
      // 2. Get all the values from the form:
      const formData = getValues();

      // Check if we're editing an existing course
      const existingCourseId = formData.courseId;

      // Calculate total lectures based on modules count
      const lecturesPerModule = 3; // Assuming 3 lectures per module
      const totalLectures = formData.modulesCount * lecturesPerModule;

      // Prepare the data for this step
      const data = {
        title: formData.title,
        short_description: formData.short_description,
        category: formData.category,
        level: formData.level,
        language: formData.language,
        modulesCount: formData.modulesCount,
        description: formData.description,
        courseType: formData.courseType || 'recorded',
        estimatedDuration: formData.estimatedDuration,
        totalLectures: totalLectures,
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

        // Go to the next step with completion flag
        goToNextStep(true);
      } catch (error) {
        toast.error("An unexpected error occurred: " + error.message);
        console.error("Error handling course:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
      toast.error("Please fill in all required fields");
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
            className={`form-control ${errors.short_description ? 'is-invalid' : ''}`}
            rows={2}
            placeholder="Enter keywords"
            {...register("short_description", {
              required: "Short description is required",
              minLength: { value: 10, message: "Short description must be at least 10 characters" },
              maxLength: { value: 200, message: "Short description cannot exceed 200 characters" }
            })}
          />
          {errors.short_description && <div className="invalid-feedback">{errors.short_description.message}</div>}
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
          <label className="form-label">Count of Modules <span className='text-danger'>*</span></label>
          <input
            className={`form-control ${errors.modulesCount ? 'is-invalid' : ''}`}
            type="number"
            placeholder="How many modules"
            {...register("modulesCount", {
              valueAsNumber: true,
              required: "Number of modules is required",
              min: { value: 1, message: "Must have at least 1 module" },
              max: { value: 100, message: "Cannot have more than 100 modules" },
              onChange: (e) => {
                // Calculate total lectures based on modules count
                const modulesCount = parseInt(e.target.value) || 0;
                const lecturesPerModule = 3; // Assuming 3 lectures per module
                const totalLectures = modulesCount * lecturesPerModule;

                // Store total lectures for later use
                setValue('totalLectures', totalLectures);
              }
            })}
          />
          {errors.modulesCount && <div className="invalid-feedback">{errors.modulesCount.message}</div>}
        </Col>



        {/* Promo Video URL (Optional) */}
        <Col md={12}>
          <label className="form-label">Promotional Video URL <span className='text-muted'>(Optional)</span></label>
          <input
            className={`form-control ${errors.promoVideoUrl ? 'is-invalid' : ''}`}
            type="url"
            placeholder="YouTube or other video URL (optional)"
            {...register("promoVideoUrl", {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/i,
                message: "Please enter a valid YouTube or Vimeo URL"
              }
            })}
          />
          <small className="form-text text-muted">You can add a promotional video later if you don't have one now</small>
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
          <Button
            type="button"
            variant="primary"
            className="mb-0"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : (getValues('courseId') ? 'Update & Next' : 'Create Course & Next')}
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default Step1;