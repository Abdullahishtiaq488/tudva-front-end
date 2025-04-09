'use client';

import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '@/services/favoriteService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const FavoriteButton = ({
  courseId,
  variant = 'primary',
  size = 'sm',
  className = '',
  iconOnly = false,
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
        const response = await checkIsFavorite(courseId);
        setIsFavorite(response.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [courseId, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please log in to add favorites');
      router.push('/login');
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (isFavorite) {
        await removeFromFavorites(courseId);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(courseId);
        toast.success('Added to favorites');
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
