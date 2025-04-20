'use client'

import { Button, Card, CardBody, CardTitle, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import { FaQuestionCircle } from "react-icons/fa";
import CoursePreview from './course-preview/CoursePreview';
import { useState, useEffect } from "react";
import { courses, lectureSchedules, timeSlots } from '@/data/mockData';


const CoursesOverview = () => {

    const [openItemId, setOpenItemId] = useState('headingOne'); // Initially open the first item

    const toggleAccordion = (id) => {
        setOpenItemId(openItemId === id ? null : id); // Toggle open/closed
    };

    // Get courses from our centralized mock data
    const [myCourses, setMyCourses] = useState([]);
    const [nextLesson, setNextLesson] = useState(null);

    useEffect(() => {
        // Get first 6 courses from our centralized mock data
        const coursesList = courses.slice(0, 6).map(course => {
            // Get the first module and lecture for this course
            const firstModule = course.modules && course.modules.length > 0 ? course.modules[0] : null;
            const moduleTitle = firstModule ? firstModule.title : 'Unknown Module';
            const lectureCount = course.modules ? course.modules.reduce((total, module) => total + module.lectures.length, 0) : 0;

            return {
                id: course.id,
                title: course.title,
                module: `Module ${firstModule ? course.modules.indexOf(firstModule) + 1 : '?'}/${course.modules?.length || '?'}: ${moduleTitle}`,
                imageUrl: course.image,
                totalLectures: lectureCount
            };
        });

        setMyCourses(coursesList);

        // Set the first course as the next lesson
        if (coursesList.length > 0) {
            setNextLesson(coursesList[0]);
        }
    }, []);

    return <section className="pt-0 pt-lg-5">
        <Container>
            <Row className="mb-4">
                <Col xs={12}>
                    <h2 className="mb-0">My Courses Overview</h2>
                </Col>
            </Row>
            <Row className="g-4 d-flex justify-content-center">
                <Col xl={11}>
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button
                                    className={`accordion-button ${openItemId === 'headingOne' ? '' : 'collapsed'}`} // Conditionally add 'collapsed'
                                    type="button"
                                    onClick={() => toggleAccordion('headingOne')} // Use onClick handler
                                    aria-expanded={openItemId === 'headingOne'}
                                    aria-controls="collapseOne"
                                >
                                    My Next Lessons
                                </button>
                            </h2>
                            <div
                                id="collapseOne"
                                className={`accordion-collapse collapse ${openItemId === 'headingOne' ? 'show' : ''}`} // Conditionally add 'show'
                                aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">
                                    <hr className="h-2 w-100 " />
                                    <h5>
                                        Learning Day: Friday 21, 2025
                                    </h5>
                                    {/* <div className="d-flex justify-content-between fw-semibold">
                                        <p className="ms-3">1. school hour | 9:00 - 9:40h</p>
                                        <span className="text-danger">- 2 days, 10 hours, 17 minutes</span>
                                    </div> */}
                                    <div className="d-flex justify-content-between fw-light fw-md-semibold flex-wrap">
                                        <p className="ms-md-3 mb-2 mb-md-0">
                                            <span >1. school hour</span>  |{" "}
                                            <span className="d-xs-block">9:00 - 9:40h</span>
                                        </p>
                                        <span className="text-danger text-nowrap">
                                            - 2 days, 10 hours, 17 minutes
                                        </span>
                                    </div>
                                    <div className="w-100 d-flex justify-content-center">
                                        <div className="w-100 w-md-75">
                                            <CoursePreview
                                                title={nextLesson?.title || "No course selected"}
                                                module={nextLesson?.module || "No module available"}
                                                imageUrl={nextLesson?.imageUrl || "/assets/images/courses/4by3/01.jpg"}
                                                courseId={nextLesson?.id}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-decoration-underline text-end">manage my courses</p>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button
                                    className={`accordion-button ${openItemId === 'headingTwo' ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => toggleAccordion('headingTwo')}
                                    aria-expanded={openItemId === 'headingTwo'}
                                    aria-controls="collapseTwo"
                                >
                                    Weekplan Preview
                                </button>
                            </h2>
                            <div
                                id="collapseTwo"
                                className={`accordion-collapse collapse ${openItemId === 'headingTwo' ? 'show' : ''}`}
                                aria-labelledby="headingTwo"
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">
                                    <hr className="h-2 w-100 " />
                                    <h5 className="text-center">
                                        Learning Day: Friday 28, 2025 [week 8/25]
                                    </h5>
                                    <div className="w-100 d-flex justify-content-center">
                                        <Row className='w-100 w-md-75'>
                                            {myCourses.map((course, index) => (
                                                <Col xs={12} sm={6} md={12} key={course.id} className="mb-3"> {/* Use Col with responsive props */}
                                                    <CoursePreview
                                                        title={course.title}
                                                        module={course.module}
                                                        imageUrl={course.imageUrl}
                                                        number={index + 1}
                                                        courseId={course.id}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                    <p className="text-decoration-underline text-end">manage my courses</p>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                                <button
                                    className={`accordion-button ${openItemId === 'headingThree' ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => toggleAccordion('headingThree')}
                                    aria-expanded={openItemId === 'headingThree'}
                                    aria-controls="collapseThree"
                                >
                                    More About My Courses
                                </button>
                            </h2>
                            <div
                                id="collapseThree"
                                className={`accordion-collapse collapse ${openItemId === 'headingThree' ? 'show' : ''}`}
                                aria-labelledby="headingThree"
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">

                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </section>;
};
export default CoursesOverview;
