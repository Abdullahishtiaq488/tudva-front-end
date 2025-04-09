// src/app/courses/create/Step2.jsx (Refined with API call)
import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { HexColorPicker } from "react-colorful";
import * as allIcons from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
import { checkIsLoggedInUser } from '@/helpers/checkLoggedInUser';
import Image from 'next/image';

const Step2 = ({ goToNextStep, goBackToPreviousStep }) => {
  const [selectedColor, setSelectedColor] = useState("#aabbcc");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableIcons, setAvailableIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useCustomIcons, setUseCustomIcons] = useState(true); // Toggle between custom icons and Font Awesome

  const { setValue, getValues, formState: { errors }, trigger } = useFormContext(); // Get trigger and getValues

  // Define a list of custom icons from the assets directory
  useEffect(() => {
    // Hardcoded list of icons we know exist in the directory
    const customIcons = [
      'AI.png', 'Analyse.png', 'analyzing.png', 'android.png', 'atom.png',
      'calculator.png', 'calender.png', 'callcenter.png', 'chemie.png', 'clock.png',
      'cloud.png', 'coding1.png', 'coding2.png', 'coding3.png', 'computer1.png',
      'computer2.png', 'css.png', 'dictionary.png', 'docs.png', 'download.png',
      'earth.png', 'excel.png', 'facebook.png', 'google.png', 'HTML.png',
      'illustrator.png', 'instagram.png', 'keyboard.png', 'lightbulb.png', 'math.png',
      'mobile-app.png', 'monitor.png', 'music.png', 'photoshop.png', 'powerpoint.png',
      'presentation.png', 'SEO.png', 'server.png', 'settings.png', 'structure.png',
      'system.png', 'target.png', 'technical-support.png', 'timemanagement.png', 'todolist.png',
      'tools.png', 'training.png', 'video-editing.png', 'wifi.png', 'word.png',
      'wordpress.png', 'workplace.png', 'www.png', 'x-twitter.png', 'xd.png'
    ];

    setLoading(true);
    try {
      // Just use the icon names directly
      setAvailableIcons(customIcons);
      setUseCustomIcons(true); // Default to custom icons

      // If we have a previously selected icon, set it
      const currentCourseStr = localStorage.getItem('current_course');
      if (currentCourseStr) {
        const currentCourse = JSON.parse(currentCourseStr);
        if (currentCourse.icon) {
          setSelectedIcon(currentCourse.icon);
          setValue('icon', currentCourse.icon);
        }
      }
    } catch (error) {
      console.error('Error setting custom icons:', error);
      toast.error('Failed to load custom icons. Using default icons instead.');
      setUseCustomIcons(false); // Fall back to Font Awesome icons
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  const iconArray = Object.entries(allIcons);

  const filteredIcons = useCustomIcons
    ? availableIcons.filter(iconName => iconName.toLowerCase().includes(searchTerm.toLowerCase()))
    : iconArray.filter(([iconName, iconComponent]) => iconName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
    setValue('color', newColor); // Update form value
  };

  const handleIconSelect = (iconName) => {
    console.log('Selected icon:', iconName);
    setSelectedIcon(iconName);
    setValue('icon', iconName); // Update form value with the icon name

    // Update the current course in localStorage
    const currentCourseStr = localStorage.getItem('current_course');
    if (currentCourseStr) {
      const currentCourse = JSON.parse(currentCourseStr);
      const updatedCourse = {
        ...currentCourse,
        icon: iconName,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('current_course', JSON.stringify(updatedCourse));
      console.log('Updated current course with icon:', updatedCourse);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger(['color', 'icon']); // Validate color and icon
    if (isValid) {
      const { color, icon } = getValues(); // Get only color and icon
      // Get the courseId from the form data (it was stored in Step1)
      const { courseId } = getValues();
      if (!courseId) {
        toast.error("Course ID is missing. Please start from Step 1.");
        return; // Stop execution if courseId is missing
      }

      // Use localStorage instead of making an API call
      try {
        // Get the current course from localStorage
        const currentCourseStr = localStorage.getItem('current_course');
        if (!currentCourseStr) {
          toast.error("Course data not found. Please start from Step 1.");
          return;
        }

        // Parse the current course
        const currentCourse = JSON.parse(currentCourseStr);

        // Log the current values for debugging
        console.log('Current form values:', { color, icon });
        console.log('Current course before update:', currentCourse);

        // Update the course with color and icon
        const updatedCourse = {
          ...currentCourse,
          color,
          icon,
          updatedAt: new Date().toISOString()
        };

        console.log('Updated course with color and icon:', updatedCourse);

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

        toast.success('Step 2 data updated successfully!');
        goToNextStep();
      } catch (error) {
        console.error("Error updating Step 2 data:", error);
        toast.error('An unexpected error occurred during Step 2 update.');
      }
    }
  };

  const handlePrevious = () => {
    goBackToPreviousStep();
  };

  return (
    <div id="step-2" role="tabpanel" className="content fade" aria-labelledby="steppertrigger2">
      <h4>Course media</h4>
      <hr />
      <Row>
        <Col xs={12}>
          <div className='d-flex justify-content-between'>
            <h5>
              Setup the combination of color and icon.
              Here is the preview
            </h5>
          </div>
        </Col>
        <Col xs={12}>
          <div className='d-flex justify-content-between mt-5'>
            {/* Color Picker */}
            <div>
              <h6 className="form-label">
                Select the Background Color of the label
              </h6>
              <div className='d-flex justify-content-between my-5'>
                <HexColorPicker color={selectedColor} onChange={handleColorChange} />
              </div>
              {errors.color && <div className="text-danger">{errors.color.message}</div>} {/* Display color error */}
            </div>

            {/* Icon Selection */}
            <div>
              <div className='d-flex justify-content-center align-items-center gap-5'>
                <h6 className="form-label">
                  Select the Image Icon
                </h6>
                <div className="rounded position-relative">
                  {/* Search Input */}
                  <input
                    className={`form-control pe-5 bg-transparent ${errors.icon ? 'is-invalid' : ''}`} // Add is-invalid
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                    type="button" // Change to type="button"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
              {/* Toggle between custom icons and Font Awesome */}
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="useCustomIcons"
                  checked={useCustomIcons}
                  onChange={() => setUseCustomIcons(!useCustomIcons)}
                />
                <label className="form-check-label" htmlFor="useCustomIcons">
                  Use custom icons from assets
                </label>
              </div>

              {/* Loading indicator */}
              {loading && (
                <div className="text-center my-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading icons...</span>
                  </Spinner>
                </div>
              )}

              {/* Icon Display */}
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}>
                {useCustomIcons ? (
                  // Custom icons from assets
                  <div className="d-flex flex-wrap">
                    {filteredIcons.map((iconName) => (
                      <div
                        key={iconName}
                        onClick={() => handleIconSelect(iconName)}
                        className={`p-2 m-1 rounded ${iconName === selectedIcon ? 'bg-primary bg-opacity-25' : ''}`}
                        style={{ cursor: 'pointer', width: '60px', height: '60px', textAlign: 'center' }}
                        title={iconName}
                      >
                        <img
                          src={`/assets/all icons 96px/${iconName}`}
                          alt={iconName.replace('.png', '')}
                          style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                          onError={(e) => {
                            console.error(`Failed to load icon: ${iconName}`);
                            e.target.onerror = null;
                            // Use a Font Awesome icon instead of a placeholder image
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<i class="fas fa-image fs-3 text-primary"></i>';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Font Awesome icons
                  <div className="d-flex flex-wrap">
                    {filteredIcons.map(([iconName, IconComponent]) => (
                      <div
                        key={iconName}
                        onClick={() => handleIconSelect(iconName)}
                        className={`p-2 m-1 rounded ${iconName === selectedIcon ? 'bg-primary bg-opacity-25' : ''}`}
                        style={{ cursor: 'pointer' }}
                        title={iconName}
                      >
                        <IconComponent
                          size={24}
                          style={{ color: iconName === selectedIcon ? 'blue' : 'black' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.icon && <div className="text-danger">{errors.icon.message}</div>}  {/* Display icon error */}
              {selectedIcon && <p>Selected Icon: {selectedIcon}</p>}
            </div>
          </div>
        </Col>

        {/* Navigation Buttons */}
        <Col xs={12}>
          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={handlePrevious} className="mb-0">
              Previous
            </Button>
            <Button variant="primary" onClick={handleNext} className="mb-0">
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Step2;