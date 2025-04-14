'use client';

import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const FavoriteButton = ({
  courseId,
  variant = 'primary',
  size = 'sm',
  className = '',
  iconOnly = false,
  onFavoriteChange = null,
  course = null // Add course prop to store course data
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const { isFavorite, isLoading, error, toggleFavorite } = useFavorites(courseId);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle toggle favorite
  const handleToggleFavorite = (e) => {
    // Prevent the event from bubbling up to parent elements
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      toast.error('Please log in to add favorites');
      router.push('/login');
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      console.log('Toggling favorite for course:', courseId);

      // Use the toggleFavorite function from the hook
      const result = toggleFavorite();
      console.log('Toggle favorite result:', result);

      if (result.success) {
        // If adding to favorites, store course data in localStorage
        if (result.added && course) {
          try {
            console.log('Storing course in localStorage when favoriting:', course);

            // Update the courses array if it exists
            const coursesStr = localStorage.getItem('courses');
            if (coursesStr) {
              const courses = JSON.parse(coursesStr);
              // Check if course already exists
              const existingIndex = courses.findIndex(c => c.id === courseId);
              if (existingIndex >= 0) {
                // Update existing course
                courses[existingIndex] = course;
              } else {
                // Add new course
                courses.push(course);
              }
              localStorage.setItem('courses', JSON.stringify(courses));
            } else {
              // Create new courses array
              localStorage.setItem('courses', JSON.stringify([course]));
            }
          } catch (error) {
            console.error('Error storing course in localStorage:', error);
          }
        }

        toast.success(
          result.added
            ? 'Added to favorites'
            : 'Removed from favorites'
        );

        // Call the callback if provided
        if (onFavoriteChange) {
          onFavoriteChange(result.added);
        }
      } else {
        toast.error(result.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Failed to update favorites');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`favorite-button ${className}`}
        disabled
      >
        <Spinner
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        {!iconOnly && <span className="ms-2">Loading...</span>}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`favorite-button ${className}`}
      onClick={handleToggleFavorite}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Spinner
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        isFavorite ? <FaHeart /> : <FaRegHeart />
      )}
      {!iconOnly && (
        <span className="ms-2">
          {isProcessing
            ? 'Processing...'
            : isFavorite
              ? 'Remove from Favorites'
              : 'Add to Favorites'
          }
        </span>
      )}
    </Button>
  );
};

export default FavoriteButton;
