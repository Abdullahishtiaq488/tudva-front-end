"use client";
import ChoicesFormInput from "@/components/form/ChoicesFormInput";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Pagination from "./Pagination";
import CourseCard from "./CourseCard";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllCourses } from "@/utils/courseSync";
import { getAllSimpleCourses } from "@/utils/simpleCourseApi";
import { getAllDirectCourses } from "@/utils/directCourseApi";
import { getAllFileCourses } from "@/utils/fileCourseApi";

// Mock courses for fallback
const getMockCourses = () => {
  return [
    {
      id: 'mock-1',
      title: 'Introduction to Web Development',
      shortDesription: 'Learn the basics of HTML, CSS, and JavaScript',
      description: 'This course covers the fundamentals of web development including HTML, CSS, and JavaScript.',
      category: 'Digital',
      level: 'Beginner',
      language: 'English',
      price: 0,
      instructor: { name: 'John Doe' },
      rating: 4.5,
      reviews: 120,
      students: 1500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      icon: '🌐',
      color: '#4697ce'
    },
    {
      id: 'mock-2',
      title: 'Advanced JavaScript Programming',
      shortDesription: 'Master modern JavaScript concepts and frameworks',
      description: 'Take your JavaScript skills to the next level with advanced concepts and popular frameworks.',
      category: 'Digital',
      level: 'Advanced',
      language: 'English',
      price: 0,
      instructor: { name: 'Jane Smith' },
      rating: 4.8,
      reviews: 85,
      students: 950,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      icon: '⚛️',
      color: '#7EAA7E'
    },
    {
      id: 'mock-3',
      title: 'Cooking Basics',
      shortDesription: 'Learn essential cooking techniques and recipes',
      description: 'Start your culinary journey with fundamental cooking techniques and delicious recipes.',
      category: 'Cooking',
      level: 'Beginner',
      language: 'English',
      price: 0,
      instructor: { name: 'Chef Mario' },
      rating: 4.7,
      reviews: 210,
      students: 2200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      icon: '🍳',
      color: '#FF6B6B'
    }
  ];
};

const fetchCourses = async (search, category, sortBy, page) => {
  try {
    // First, try to get courses from the backend using the file-based API
    let allCourses = [];
    try {
      // Try all methods in parallel to speed up loading
      const [fileCourses, directCourses, simpleCourses, localCourses] = await Promise.allSettled([
        getAllFileCourses(),
        getAllDirectCourses(),
        getAllSimpleCourses(),
        getAllCourses()
      ]);

      console.log('Courses from file-based API:', fileCourses.status === 'fulfilled' ? fileCourses.value : 'Failed');
      console.log('Courses from direct API:', directCourses.status === 'fulfilled' ? directCourses.value : 'Failed');
      console.log('Courses from simplified API:', simpleCourses.status === 'fulfilled' ? simpleCourses.value : 'Failed');
      console.log('Courses from localStorage:', localCourses.status === 'fulfilled' ? localCourses.value : 'Failed');

      // Use the first successful result that has courses
      if (fileCourses.status === 'fulfilled' && fileCourses.value && fileCourses.value.length > 0) {
        allCourses = fileCourses.value;
        console.log('Using courses from file-based API');
      } else if (directCourses.status === 'fulfilled' && directCourses.value && directCourses.value.length > 0) {
        allCourses = directCourses.value;
        console.log('Using courses from direct API');
      } else if (simpleCourses.status === 'fulfilled' && simpleCourses.value && simpleCourses.value.length > 0) {
        allCourses = simpleCourses.value;
        console.log('Using courses from simplified API');
      } else if (localCourses.status === 'fulfilled' && localCourses.value && localCourses.value.length > 0) {
        allCourses = localCourses.value;
        console.log('Using courses from localStorage');
      } else {
        // If all else fails, use mock data
        console.log('No courses found, using mock data');
        allCourses = getMockCourses();
      }
    } catch (apiError) {
      console.warn('Error fetching courses, using localStorage:', apiError);
      // Fall back to localStorage if APIs fail
      try {
        allCourses = await getAllCourses();
        console.log('Using courses from localStorage:', allCourses);
      } catch (localError) {
        console.error('Error fetching from localStorage, using mock data:', localError);
        allCourses = getMockCourses();
      }
    }

    // Filter courses based on search and category
    let filteredCourses = allCourses;

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course =>
        (course.title && course.title.toLowerCase().includes(searchLower)) ||
        (course.description && course.description.toLowerCase().includes(searchLower)) ||
        (course.short_description && course.short_description.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter if provided
    if (category && category !== 'All') {
      filteredCourses = filteredCourses.filter(course =>
        course.category === category
      );
    }

    // Apply client-side sorting if needed
    if (sortBy) {
      if (sortBy === 'free') {
        filteredCourses = filteredCourses.filter(course => course.price === 0 || !course.price);
      } else if (sortBy === 'most-viewed') {
        // Sort by views (if available)
        filteredCourses.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else if (sortBy === 'popular') {
        // Sort by popularity (if available)
        filteredCourses.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }
    }

    // Apply pagination
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + pageSize);

    return {
      courses: paginatedCourses,
      totalPages: Math.ceil(filteredCourses.length / pageSize) || 1
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { courses: [], totalPages: 1 };
  }
};

const CourseList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read values from URL params
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";
  const urlSortBy = searchParams.get("sortBy") || "";
  const urlPage = parseInt(searchParams.get("page")) || 1;

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState(urlSortBy);
  const [page, setPage] = useState(urlPage);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getCourses = async () => {
      const { courses, totalPages } = await fetchCourses(search, category, sortBy, page);

      console.log("Fetched Courses:", courses);
      setCourses(courses);
      setTotalPages(totalPages);
    };
    getCourses();
  }, [search, category, sortBy, page]);



  // Apply filters and reset page to 1
  const applyFilters = () => {
    router.push(`?search=${search}&category=${category}&sortBy=${sortBy}&page=1`);
  };

  // Sync state when URL params change
  useEffect(() => {
    setSearch(urlSearch);
    setCategory(urlCategory);
    setSortBy(urlSortBy);
    setPage(urlPage);
  }, [urlSearch, urlCategory, urlSortBy, urlPage]);

  return (
    <section className="pt-5">
      <Container>
        <Row className="mb-4 align-items-center">
          <Col sm={6} xl={4}>
            <form className="border rounded p-2" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group input-borderless">
                <FormControl
                  className="me-1"
                  type="search"
                  placeholder="Search course"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="primary" type="button" className="mb-0 rounded" onClick={applyFilters}>
                  <FaSearch />
                </Button>
              </div>
            </form>
          </Col>
          <Col sm={6} xl={3} className="mt-3 mt-lg-0">
            <form className="border rounded p-2 input-borderless">
              <ChoicesFormInput
                className="form-select form-select-sm js-choice"
                aria-label=".form-select-sm"
                value={category}
                onChange={(e) => setCategory(e.target?.value || "All")}
              >
                <option value="All">All</option>
                <option value="digital-and-it">Digital and IT</option>
                <option value="design">Design</option>
                <option value="accounting">Accounting</option>
                <option value="translation">Translation</option>
                <option value="finance">Finance</option>
                <option value="legal">Legal</option>
                <option value="photography">Photography</option>
                <option value="writing">Writing</option>
                <option value="marketing">Marketing</option>
              </ChoicesFormInput>
            </form>
          </Col>
          <Col sm={6} xl={3} className="mt-3 mt-xl-0">
            <form className="border rounded p-2 input-borderless">
              <ChoicesFormInput
                className="form-select form-select-sm js-choice"
                aria-label=".form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="free">Free</option>
                <option value="most-viewed">Most viewed</option>
                <option value="popular">Popular</option>
              </ChoicesFormInput>
            </form>
          </Col>
          <Col sm={6} xl={2} className="mt-3 mt-xl-0 d-grid">
            <Button variant="primary" size="lg" className="mb-0" onClick={applyFilters}>
              Filter Results
            </Button>
          </Col>
        </Row>

        <Row className="g-4 justify-content-center">
          {courses.length > 0 ? (
            courses.map((course, idx) => (
              <Col lg={6} xxl={6} key={course.id || idx}>

                <CourseCard

                  course={{
                    id: course.id,
                    title: course.title || "Untitled Course",
                    short_description: course.short_description || "No description available",
                    description: course.description || "",
                    category: course.category || "Uncategorized",
                    level: course.level || "All Levels",
                    language: course.language || "Unknown",
                    modules_count: course.modules_count || 0,
                    icon: course.icon || "FaRegStar",
                    status: course.status || "pending",
                    instructor_id: course.instructor_id || "",
                    lectures: course.modules_count || 0,
                    duration: "Self-paced",
                    rating: { star: 4 },
                    badge: { text: course.status },
                    color: course.color
                  }}
                />
              </Col>
            ))
          ) : (
            <Col>
              <p>No courses available.</p>
            </Col>
          )}
        </Row>

        <Col xs={12} className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              router.push(`?search=${search}&category=${category}&sortBy=${sortBy}&page=${newPage}`);
            }}
          />
        </Col>
      </Container>
    </section>
  );
};

export default CourseList;
