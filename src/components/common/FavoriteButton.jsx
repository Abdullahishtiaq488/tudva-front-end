'use client';

import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '@/services/favoriteService';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/utils/fileWishlistApi';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

/**
 * Unified FavoriteButton component that can be used in different contexts
 *
 * @param {string} courseId - The ID of the course to favorite/unfavorite
 * @param {string} courseName - The name of the course (for toast messages)
 * @param {string} variant - Button variant (primary, outline-primary, link, etc.)
 * @param {string} size - Button size (sm, md, lg)
 * @param {string} className - Additional CSS classes
 * @param {boolean} iconOnly - Whether to show only the icon without text
 * @param {boolean} asButton - Whether to render as a Button or a clickable span
 * @param {function} onFavoriteChange - Callback when favorite status changes
 */
const FavoriteButton = ({
  courseId,
  courseName = 'Course',
  variant = 'primary',
  size = 'sm',
  className = '',
  iconOnly = false,
  asButton = true,
  onFavoriteChange = null
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !courseId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // First try file-based wishlist API
        try {
          const isInWishlistResult = await isInWishlist(user.userId, courseId);
          setIsFavorite(isInWishlistResult);
          console.log('File-based wishlist check result:', isInWishlistResult);
        } catch (fileWishlistError) {
          console.warn('Error checking file-based wishlist, falling back to database:', fileWishlistError);

          // Fall back to database API
          const response = await checkIsFavorite(courseId);
          setIsFavorite(response.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [courseId, user]);

  const handleToggleFavorite = async (e) => {
    // Prevent default behavior if it's a link or inside a link
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

      // First try file-based wishlist API
      try {
        if (isFavorite) {
          await removeFromWishlist(user.userId, courseId);
          toast.success(`${courseName} removed from favorites`);
        } else {
          await addToWishlist(user.userId, courseId);
          toast.success(`${courseName} added to favorites`);
        }
      } catch (fileWishlistError) {
        console.warn('Error using file-based wishlist, falling back to database:', fileWishlistError);

        // Fall back to database API
        if (isFavorite) {
          await removeFromFavorites(courseId);
          toast.success(`${courseName} removed from favorites`);
        } else {
          await addToFavorites(courseId);
          toast.success(`${courseName} added to favorites`);
        }
      }

      setIsFavorite(!isFavorite);

      // Call the callback if provided
      if (onFavoriteChange) {
        onFavoriteChange(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Failed to update favorites');
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoading) {
    if (asButton) {
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
    } else {
      return (
        <span className={`${className} text-muted`}>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </span>
      );
    }
  }

  // Button version
  if (asButton) {
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
  }

  // Span version
  return (
    <span
      role="button"
      className={className}
      onClick={handleToggleFavorite}
      style={{ cursor: 'pointer' }}
    >
      {isProcessing ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ) : (
        isFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart />
      )}
    </span>
  );
};

export default FavoriteButton;
