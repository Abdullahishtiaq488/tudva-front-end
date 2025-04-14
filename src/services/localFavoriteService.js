/**
 * Local Storage Favorites Service
 * 
 * This service uses localStorage to manage favorites without requiring API calls.
 * It's a simple fallback when the API is not working.
 */

// Key for storing favorites in localStorage
const FAVORITES_STORAGE_KEY = 'user_favorites';

/**
 * Get all favorites from localStorage
 * @returns {Array} - Array of course IDs
 */
export const getLocalFavorites = () => {
  try {
    if (typeof window === 'undefined') return [];
    
    const favoritesStr = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favoritesStr ? JSON.parse(favoritesStr) : [];
  } catch (error) {
    console.error('Error getting favorites from localStorage:', error);
    return [];
  }
};

/**
 * Add a course to favorites in localStorage
 * @param {string} courseId - The course ID to add
 * @returns {Object} - Result object
 */
export const addToLocalFavorites = (courseId) => {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Cannot access localStorage' };
    }
    
    // Get current favorites
    const favorites = getLocalFavorites();
    
    // Check if already in favorites
    if (favorites.includes(courseId)) {
      return { 
        success: true, 
        message: 'Course already in favorites',
        isFavorite: true
      };
    }
    
    // Add to favorites
    favorites.push(courseId);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    
    return { 
      success: true, 
      message: 'Course added to favorites',
      isFavorite: true
    };
  } catch (error) {
    console.error('Error adding to favorites in localStorage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to add to favorites'
    };
  }
};

/**
 * Remove a course from favorites in localStorage
 * @param {string} courseId - The course ID to remove
 * @returns {Object} - Result object
 */
export const removeFromLocalFavorites = (courseId) => {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Cannot access localStorage' };
    }
    
    // Get current favorites
    const favorites = getLocalFavorites();
    
    // Check if in favorites
    if (!favorites.includes(courseId)) {
      return { 
        success: true, 
        message: 'Course not in favorites',
        isFavorite: false
      };
    }
    
    // Remove from favorites
    const updatedFavorites = favorites.filter(id => id !== courseId);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    
    return { 
      success: true, 
      message: 'Course removed from favorites',
      isFavorite: false
    };
  } catch (error) {
    console.error('Error removing from favorites in localStorage:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to remove from favorites'
    };
  }
};

/**
 * Check if a course is in favorites in localStorage
 * @param {string} courseId - The course ID to check
 * @returns {Object} - Result object
 */
export const checkIsLocalFavorite = (courseId) => {
  try {
    if (typeof window === 'undefined') {
      return { success: true, isFavorite: false };
    }
    
    // Get current favorites
    const favorites = getLocalFavorites();
    
    // Check if in favorites
    return { 
      success: true, 
      isFavorite: favorites.includes(courseId)
    };
  } catch (error) {
    console.error('Error checking favorite status in localStorage:', error);
    return { 
      success: false, 
      isFavorite: false
    };
  }
};
