"use client";
import ChoicesFormInput from "@/components/form/ChoicesFormInput";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Pagination from "./Pagination";
import CourseCard from "./CourseCard";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const fetchCourses = async (search, category, sortBy, page) => {
  try {
    // Get courses from localStorage
    const coursesStr = localStorage.getItem('courses');
    let courses = coursesStr ? JSON.parse(coursesStr) : [];

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(course =>
        (course.title && course.title.toLowerCase().includes(searchLower)) ||
        (course.description && course.description.toLowerCase().includes(searchLower)) ||
        (course.shortDesription && course.shortDesription.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      courses = courses.filter(course => course.category === category);
    }

    // Sort courses
    if (sortBy) {
      if (sortBy === 'free') {
        courses = courses.filter(course => course.price === 0 || !course.price);
      } else if (sortBy === 'most-viewed') {
        // Sort by views (if available)
        courses.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else if (sortBy === 'popular') {
        // Sort by popularity (if available)
        courses.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }
    }

    // Pagination
    const limit = 10;
    const totalPages = Math.ceil(courses.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = courses.slice(startIndex, endIndex);

    return { courses: paginatedCourses, totalPages };
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
