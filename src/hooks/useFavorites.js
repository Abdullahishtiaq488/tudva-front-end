// front-end/src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '@/services/favoriteService';

export const useFavorites = (courseId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the course is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        const response = await checkIsFavorite(courseId);
        setIsFavorite(response.isFavorite);
      } catch (err) {
        setError(err.message || 'Error checking favorite status');
        console.error('Error checking favorite status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [courseId]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    if (!courseId) return { success: false, error: 'No course ID provided' };

    try {
      setIsLoading(true);

      if (isFavorite) {
        const result = await removeFromFavorites(courseId);
        setIsFavorite(false);
        return { success: true, added: false, ...result };
      } else {
        const result = await addToFavorites(courseId);
        setIsFavorite(true);
        return { success: true, added: true, ...result };
      }
    } catch (err) {
      setError(err.message || 'Error toggling favorite status');
      console.error('Error toggling favorite status:', err);
      throw err; // Re-throw to allow handling in the component
    } finally {
      setIsLoading(false);
    }
  }, [courseId, isFavorite]);

  return { isFavorite, isLoading, error, toggleFavorite };
};
