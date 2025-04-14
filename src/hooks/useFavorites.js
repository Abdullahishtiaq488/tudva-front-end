// front-end/src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import { addToLocalFavorites, removeFromLocalFavorites, checkIsLocalFavorite, getLocalFavorites } from '@/services/localFavoriteService';

export const useFavorites = (courseId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the course is in favorites
  useEffect(() => {
    const checkFavoriteStatus = () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log(`Checking favorite status for course ${courseId}`);
        const response = checkIsLocalFavorite(courseId);
        console.log('Favorite status response:', response);

        setIsFavorite(response.isFavorite);
      } catch (err) {
        setError(err.message || 'Error checking favorite status');
        console.error('Error checking favorite status:', err);
        // Don't set isFavorite to false here, keep the previous value
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      checkFavoriteStatus();
    }
  }, [courseId]);

  // Toggle favorite status
  const toggleFavorite = useCallback(() => {
    if (!courseId) return { success: false, error: 'No course ID provided' };

    try {
      setIsLoading(true);
      setError(null);

      console.log(`Toggling favorite status for course ${courseId}. Current status: ${isFavorite ? 'Favorited' : 'Not favorited'}`);

      let result;
      if (isFavorite) {
        // Remove from favorites
        console.log('Removing from favorites...');
        result = removeFromLocalFavorites(courseId);
        console.log('Remove result:', result);

        if (result.success) {
          setIsFavorite(false);
          return { success: true, added: false, ...result };
        } else {
          setError(result.error || 'Failed to remove from favorites');
          return { success: false, error: result.error || 'Failed to remove from favorites' };
        }
      } else {
        // Add to favorites
        console.log('Adding to favorites...');
        result = addToLocalFavorites(courseId);
        console.log('Add result:', result);

        if (result.success) {
          setIsFavorite(true);
          return { success: true, added: true, ...result };
        } else {
          setError(result.error || 'Failed to add to favorites');
          return { success: false, error: result.error || 'Failed to add to favorites' };
        }
      }
    } catch (err) {
      setError(err.message || 'Error toggling favorite status');
      console.error('Error toggling favorite status:', err);
      return { success: false, error: err.message || 'Error toggling favorite status' };
    } finally {
      setIsLoading(false);
    }
  }, [courseId, isFavorite]);

  return { isFavorite, isLoading, error, toggleFavorite };
};
