'use client';

import { getLocalFavorites, removeFromLocalFavorites } from '@/services/localFavoriteService';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CourseCard from '@/app/components/courses/CourseCard';



const WishlistCart = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorites on component mount
  useEffect(() => {
    const fetchFavorites = () => {
      try {
        setIsLoading(true);

        // Get favorite IDs from localStorage
        const favoriteIds = getLocalFavorites();
        console.log('Favorite IDs from localStorage:', favoriteIds);

        // Get course details for each favorite
        const coursesFromStorage = JSON.parse(localStorage.getItem('courses') || '[]');
        console.log('Courses from storage:', coursesFromStorage);

        // Filter courses that are in favorites
        const favoriteCourses = coursesFromStorage.filter(course =>
          favoriteIds.includes(course.id)
        );
        console.log('Favorite courses:', favoriteCourses);

        // Add default values for any missing properties required by CourseCard
        const processedCourses = favoriteCourses.map(course => ({
          ...course,
          id: course.id, // Ensure ID is present
          title: course.title || 'Untitled Course',
          lectures: course.lectures || course.modules?.length || 0,
          duration: course.duration || '45m',
          rating: course.rating || { star: 4.5 },
          badge: course.badge || { text: course.level || 'Beginner' },
          color: course.color || '#0d6efd',
          icon: course.icon || 'FaBook'
        }));

        console.log('Processed courses for wishlist:', processedCourses);
        setFavorites(processedCourses);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites. Please try again later.');
        toast.error('Failed to load favorites. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();

    // Add storage event listener to update favorites when localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user_favorites') {
        console.log('Favorites changed in localStorage, refreshing...');
        fetchFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle removing a course from favorites
  const handleRemoveFavorite = (courseId) => {
    try {
      const result = removeFromLocalFavorites(courseId);

      if (result.success) {
        // Update the favorites list
        setFavorites(favorites.filter(course => course.id !== courseId));
        toast.success('Course removed from favorites');

        // Trigger a storage event to notify other components
        const event = new StorageEvent('storage', {
          key: 'user_favorites',
          newValue: localStorage.getItem('user_favorites'),
          url: window.location.href
        });
        window.dispatchEvent(event);
      } else {
        setError('Failed to remove from favorites. Please try again.');
        toast.error('Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove from favorites. Please try again.');
      toast.error('Failed to remove from favorites');
    }
  };

  // Handle removing all favorites
  const handleRemoveAll = () => {
    try {
      // Clear all favorites from localStorage
      localStorage.setItem('user_favorites', '[]');
      setFavorites([]);
      toast.success('All courses removed from favorites');

      // Trigger a storage event to notify other components
      const event = new StorageEvent('storage', {
        key: 'user_favorites',
        newValue: '[]',
        url: window.location.href
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error removing all favorites:', err);
      setError('Failed to remove all favorites. Please try again.');
      toast.error('Failed to remove all favorites');
    }
  };

  if (isLoading) {
    return (
      <section className="pt-5">
        <Container className="py-3">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your favorites...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-5">
        <Container className="py-3">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-5">
      <Container className="py-3">
        <div className="d-sm-flex justify-content-sm-between align-items-center mb-4">
          <h5 className="mb-2 mb-sm-0">
            You have {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in wishlist
          </h5>
          {favorites.length > 0 && (
            <div className="text-end">
              <button
                className="btn btn-danger-soft mb-0"
                onClick={handleRemoveAll}
              >
                <FaTrash className="me-2" />Remove all
              </button>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-5">
            <p>Your wishlist is empty. Add courses to your favorites to see them here.</p>
            <Link href="/pages/course/grid" className="btn btn-primary mt-3">
              Browse Courses
            </Link>
          </div>
        ) : (
          <Row className="g-4">
            {favorites.map((course) => (
              <Col md={12} lg={12} xl={6} key={course.id}>
                <div className="position-relative mb-4">
                  <CourseCard course={course} />
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(course.id);
                    }}
                    title="Remove from wishlist"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section >
  );
};

export default WishlistCart;
