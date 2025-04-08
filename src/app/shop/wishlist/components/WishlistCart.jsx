'use client';

import { getFavorites, removeFromFavorites } from '@/services/favoriteService';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, CardTitle, Col, Container, Row } from 'react-bootstrap';
import { FaHeart, FaRegClock, FaRegHeart, FaRegStar, FaStar, FaStarHalfAlt, FaTable, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WishlistCard = ({ course, onRemove }) => {
  // Extract course data with fallbacks
  const {
    id,
    title = 'Untitled Course',
    short_description = '',
    level = 'Beginner',
    icon,
    modules = [],
  } = course || {};

  // Default image if icon is not available
  const imageUrl = icon || '/assets/images/courses/4by3/01.jpg';

  // Calculate rating (placeholder for now)
  const rating = { star: 4.5 };

  // Handle remove from favorites
  const handleRemove = async (e) => {
    e.preventDefault();
    if (onRemove) {
      onRemove(id);
    }
  };

  return <Card className="shadow">
    {/* Use a regular img tag with fallback for now */}
    <img src={imageUrl} className="card-img-top" alt="course image" />
    <CardBody className="pb-0">
      <div className="d-flex justify-content-between mb-2">
        <span className="badge bg-success bg-opacity-10 text-success">{level}</span>
        <Link href="" className="text-danger" onClick={handleRemove}>
          <FaHeart fill="red" />
        </Link>
      </div>
      <CardTitle className="fw-normal">
        <Link href={`/pages/course/detail-min/${id}`}>{title}</Link>
      </CardTitle>
      <p className="mb-2 text-truncate-2">{short_description}</p>
      <ul className="list-inline mb-0">
        {Array(Math.floor(rating.star)).fill(0).map((_star, idx) =>
          <li key={idx} className="list-inline-item me-1 small">
            <FaStar size={14} className="text-warning" />
          </li>
        )}
        {!Number.isInteger(rating.star) &&
          <li className="list-inline-item me-1 small">
            <FaStarHalfAlt size={14} className="text-warning" />
          </li>
        }
        {rating.star < 5 && Array(5 - Math.ceil(rating.star)).fill(0).map((_star, idx) =>
          <li key={idx} className="list-inline-item me-1 small">
            <FaRegStar size={14} className="text-warning" />
          </li>
        )}
        <li className="list-inline-item ms-2 h6 fw-light mb-0">{rating.star}/5.0</li>
      </ul>
    </CardBody>
    <CardFooter className="pt-0 pb-3">
      <hr />
      <div className="d-flex justify-content-between">
        <span className="h6 fw-light mb-0 icons-center">
          <FaRegClock className="text-danger me-2" />45m per lecture
        </span>
        <span className="h6 fw-light mb-0 icons-center">
          <FaTable className="text-orange me-2" />{modules.length || 0} modules
        </span>
      </div>
    </CardFooter>
  </Card>;
};

const WishlistCart = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await getFavorites();
        if (response.success) {
          setFavorites(response.favorites || []);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites. Please try again later.');
        toast.error('Failed to load favorites. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Handle removing a course from favorites
  const handleRemoveFavorite = async (courseId) => {
    try {
      await removeFromFavorites(courseId);
      // Update the favorites list
      setFavorites(favorites.filter(fav => fav.course_id !== courseId));
      toast.success('Course removed from favorites');
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove from favorites. Please try again.');
      toast.error('Failed to remove from favorites');
    }
  };

  // Handle removing all favorites
  const handleRemoveAll = async () => {
    try {
      // This would ideally be a single API call, but for now we'll remove them one by one
      const removePromises = favorites.map(fav => removeFromFavorites(fav.course_id));
      await Promise.all(removePromises);
      setFavorites([]);
      toast.success('All courses removed from favorites');
    } catch (err) {
      console.error('Error removing all favorites:', err);
      setError('Failed to remove all favorites. Please try again.');
      toast.error('Failed to remove all favorites');
    }
  };

  if (isLoading) {
    return (
      <section className="pt-5">
        <Container>
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
        <Container>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-5">
      <Container>
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
            {favorites.map((favorite) => (
              <Col sm={6} lg={4} xl={3} key={favorite.id}>
                <WishlistCard
                  course={favorite.course}
                  onRemove={() => handleRemoveFavorite(favorite.course_id)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default WishlistCart;
