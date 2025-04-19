"use client";

import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaAngleRight, FaCheckCircle, FaRegEdit, FaSearch, FaTable, FaTimes } from 'react-icons/fa';
import { FaAngleLeft } from 'react-icons/fa6';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import { syncCourses } from '@/utils/courseSync';
import { getAllSimpleCourses } from '@/utils/simpleCourseApi';
import { getAllDirectCourses } from '@/utils/directCourseApi';
import { getAllFileCourses } from '@/utils/fileCourseApi';
import { useAuth } from '@/context/AuthContext';
const ManageCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Get the current user from auth context

  // Load courses from backend and localStorage
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);

        // Get the current user ID
        const currentUserId = user?.id;
        console.log('Current user ID:', currentUserId);

        // First try to get courses from the file-based API
        try {
          const fileCourses = await getAllFileCourses();
          console.log('Courses from file-based API:', fileCourses);

          if (fileCourses && fileCourses.length > 0) {
            // Filter courses by instructor ID if user is available
            const instructorCourses = currentUserId
              ? fileCourses.filter(course => {
                // Check different possible instructor ID fields
                return course.instructor_id === currentUserId ||
                  course.instructorId === currentUserId ||
                  (course.instructor && course.instructor.id === currentUserId);
              })
              : fileCourses;

            console.log('Filtered instructor courses:', instructorCourses);

            // Sort by creation date (newest first)
            const sortedCourses = instructorCourses.sort((a, b) => {
              return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
            });

            setCourses(sortedCourses);
            setFilteredCourses(sortedCourses);

            // Also update localStorage with these courses
            localStorage.setItem('courses', JSON.stringify(sortedCourses));

            setIsLoading(false);
            return;
          } else {
            console.log('No courses from file-based API, trying direct API');
          }
        } catch (fileApiError) {
          console.warn('Error fetching from file-based API:', fileApiError);
        }

        // Try direct API if file-based API fails or returns no courses
        try {
          const directCourses = await getAllDirectCourses();
          console.log('Courses from direct API:', directCourses);

          if (directCourses && directCourses.length > 0) {
            // Filter courses by instructor ID if user is available
            const instructorCourses = currentUserId
              ? directCourses.filter(course => {
                // Check different possible instructor ID fields
                return course.instructor_id === currentUserId ||
                  course.instructorId === currentUserId ||
                  (course.instructor && course.instructor.id === currentUserId);
              })
              : directCourses;

            console.log('Filtered instructor courses from direct API:', instructorCourses);

            // Sort by creation date (newest first)
            const sortedCourses = instructorCourses.sort((a, b) => {
              return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
            });

            setCourses(sortedCourses);
            setFilteredCourses(sortedCourses);

            // Also update localStorage with these courses
            localStorage.setItem('courses', JSON.stringify(sortedCourses));

            setIsLoading(false);
            return;
          } else {
            console.log('No courses from direct API, trying simplified API');
          }
        } catch (directApiError) {
          console.warn('Error fetching from direct API:', directApiError);
        }

        // Try simplified API if direct API fails or returns no courses
        try {
          const simplifiedCourses = await getAllSimpleCourses();
          console.log('Courses from simplified API:', simplifiedCourses);

          if (simplifiedCourses && simplifiedCourses.length > 0) {
            // Filter courses by instructor ID if user is available
            const instructorCourses = currentUserId
              ? simplifiedCourses.filter(course => {
                // Check different possible instructor ID fields
                return course.instructor_id === currentUserId ||
                  course.instructorId === currentUserId ||
                  (course.instructor && course.instructor.id === currentUserId);
              })
              : simplifiedCourses;

            console.log('Filtered instructor courses from simplified API:', instructorCourses);

            // Sort by creation date (newest first)
            const sortedCourses = instructorCourses.sort((a, b) => {
              return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
            });

            setCourses(sortedCourses);
            setFilteredCourses(sortedCourses);

            // Also update localStorage with these courses
            localStorage.setItem('courses', JSON.stringify(sortedCourses));

            setIsLoading(false);
            return;
          }
        } catch (simplifiedApiError) {
          console.warn('Error fetching from simplified API:', simplifiedApiError);
        }

        // Fallback to localStorage via sync function
        const allCourses = await syncCourses();

        // Filter courses by instructor ID if user is available
        const instructorCourses = currentUserId
          ? allCourses.filter(course => {
            // Check different possible instructor ID fields
            return course.instructor_id === currentUserId ||
              course.instructorId === currentUserId ||
              (course.instructor && course.instructor.id === currentUserId);
          })
          : allCourses;

        console.log('Filtered instructor courses from localStorage:', instructorCourses);

        // Sort by creation date (newest first)
        const sortedCourses = instructorCourses.sort((a, b) => {
          return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
        });

        setCourses(sortedCourses);
        setFilteredCourses(sortedCourses);
      } catch (error) {
        console.error('Error loading courses:', error);

        // Fallback to localStorage if all else fails
        try {
          const coursesStr = localStorage.getItem('courses');
          if (coursesStr) {
            const localCourses = JSON.parse(coursesStr);

            // Filter courses by instructor ID if user is available
            const instructorCourses = currentUserId
              ? localCourses.filter(course => {
                // Check different possible instructor ID fields
                return course.instructor_id === currentUserId ||
                  course.instructorId === currentUserId ||
                  (course.instructor && course.instructor.id === currentUserId);
              })
              : localCourses;

            console.log('Filtered instructor courses from localStorage fallback:', instructorCourses);

            setCourses(instructorCourses);
            setFilteredCourses(instructorCourses);
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      } finally {
        // Ensure loading state is set to false even if there's an error
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortDesription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  // Handle sort
  useEffect(() => {
    let sorted = [...filteredCourses];

    switch (sortBy) {
      case 'newest':
        sorted = sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        sorted = sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'a-z':
        sorted = sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'z-a':
        sorted = sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      default:
        break;
    }

    setFilteredCourses(sorted);
  }, [sortBy]);

  // Handle delete course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        setIsLoading(true);

        // Delete the course
        const updatedCourses = courses.filter(course => course.id !== courseId);
        setCourses(updatedCourses);
        setFilteredCourses(updatedCourses.filter(course =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.shortDesription?.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
      } catch (error) {
        console.error('Error deleting course:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Show loading indicator while courses are being loaded
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <Card className="border bg-transparent rounded-3">
    <CardHeader className="bg-transparent border-bottom">
      <h3 className="mb-0">My Courses List</h3>
    </CardHeader>
    <CardBody>
      <Row className="g-3 align-items-center justify-content-between mb-4">
        <Col md={8}>
          <form className="rounded position-relative" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control pe-5 bg-transparent"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset" type="submit">
              <FaSearch className="fas fa-search fs-6 " />
            </button>
          </form>
        </Col>
        <Col md={3}>
          <form>
            <select
              className="form-select border-0 z-index-9 bg-transparent"
              aria-label=".form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </form>
        </Col>
      </Row>
      <div className="table-responsive border-0">
        <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
          <thead>
            <tr>
              <th scope="col" className="border-0 rounded-start">Course Title</th>
              <th scope="col" className="border-0">Status</th>
              <th scope="col" className="border-0 rounded-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="w-60px">
                        {course.icon ? (
                          <div
                            className="rounded bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '60px', height: '60px' }}
                          >
                            <img
                              src={`/assets/all icons 96px/${course.icon}`}
                              alt={course.title}
                              style={{ width: '40px', height: '40px' }}
                              onError={(e) => {
                                console.error(`Failed to load icon: ${course.icon}`);
                                e.target.onerror = null;
                                // Try alternative paths
                                const altPaths = [
                                  `/assets/all%20icons%2096px/${course.icon}`,
                                  `/public/assets/all icons 96px/${course.icon}`,
                                  `/public/assets/all%20icons%2096px/${course.icon}`,
                                  `/assets/icons/${course.icon}`,
                                ];

                                // Try the first alternative path
                                if (altPaths.length > 0) {
                                  e.target.src = altPaths[0];
                                  // Set up error handler for the alternative path
                                  e.target.onerror = () => {
                                    // If all paths fail, use a Font Awesome icon
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = '<i class="fas fa-book fs-3 text-orange"></i>';
                                  };
                                } else {
                                  // Use a Font Awesome icon as fallback
                                  e.target.style.display = 'none';
                                  e.target.parentNode.innerHTML = '<i class="fas fa-book fs-3 text-orange"></i>';
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="rounded bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '60px', height: '60px' }}
                          >
                            <FaTable className="fs-3 text-orange" />
                          </div>
                        )}
                      </div>
                      <div className="mb-0 ms-2">
                        <h6>
                          <Link href={`/course/${course.id}`}>
                            {course.title || 'Untitled Course'}
                          </Link>
                        </h6>
                        <div className="d-sm-flex">
                          <p className="h6 fw-light mb-0 small me-3">
                            <FaTable className="text-orange me-2" />
                            {Array.isArray(course.lectures) ? course.lectures.length : 0} lectures
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className={`badge ${course.status === 'published' ? 'bg-success' : 'bg-warning'} bg-opacity-10 ${course.status === 'published' ? 'text-success' : 'text-warning'}`}>
                      {course.status === 'published' ? 'Published' : 'Draft'}
                    </div>
                  </td>
                  <td>
                    <Link href={`/instructor/create-course?courseId=${course.id}`}>
                      <Button variant='success-soft' size='sm' className="btn-round me-1 mb-0">
                        <FaRegEdit className="fa-fw" />
                      </Button>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger-soft btn-round mb-0"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <FaTimes className="fa-fw" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <p className="mb-0">No courses found. <Link href="/instructor/create-course" className="btn btn-sm btn-primary-soft mb-0">Create a course</Link></p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredCourses.length > 0 && (
        <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
          <p className="mb-0 text-center text-sm-start">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCourses.length)} of {filteredCourses.length} entries
          </p>
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
              <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                <li className={`page-item mb-0 ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)} tabIndex={-1}>
                    <FaAngleLeft />
                  </button>
                </li>

                {[...Array(totalPages).keys()].map(number => (
                  <li key={number + 1} className={`page-item mb-0 ${currentPage === number + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(number + 1)}>
                      {number + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item mb-0 ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                    <FaAngleRight />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
    </CardBody>
  </Card>;
};
export default ManageCoursePage;
