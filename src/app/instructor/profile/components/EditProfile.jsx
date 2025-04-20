// src/app/components/EditProfile.jsx
'use client';
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useForm, useFieldArray } from 'react-hook-form'; // Import useFieldArray
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardBody, CardHeader, Col, Row, Form } from 'react-bootstrap';
import { BsPlus, BsX, BsTrash, BsEnvelopeFill } from 'react-icons/bs';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Import toast
import { useAuth } from "@/context/AuthContext"; // Import auth context
import authService from "@/services/authService"; // Import auth service
import IconTextFormInput from '@/components/form/IconTextFormInput'; // Import
import { FaUser, FaPhone } from 'react-icons/fa'; // Import icons
import defaultImage from '../../../../assets/images/avatar/11.jpg';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton';
import { users } from '@/data/mockData'; // Import users from mock data

// --- Validation Schema ---
const profileSchema = yup.object({
  fullName: yup.string().required('Please enter your full name'),
  email: yup.string().email('Please enter a valid email').required('Please enter your email'),
  location: yup.string().optional(),
  phoneNo: yup.string().optional(),
  aboutMe: yup.string().optional(),
  profilePicture: yup.string().optional(),
  education: yup.array().of(
    yup.object({
      degree: yup.string().required('Degree is required'), // Validate degree
      institution: yup.string().required('Institution is required'), // Validate institution
    })
  ).optional(),
});

const EditProfile = () => {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isDirty, dirtyFields }, setValue, reset, control } = useForm({
    resolver: yupResolver(profileSchema),
  });

  // Fetch user data on component mount and when user changes
  useEffect(() => {
    const initializeForm = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use mock data if user is not logged in
        let userData = user;
        if (!userData) {
          console.log('Using mock user data for profile editing');
          // Get user data from mock data
          try {
            const instructors = users.filter(user => user.role === 'instructor');
            userData = instructors[0] || {
              id: '2',
              email: 'instructor1@example.com',
              fullName: 'John Instructor',
              role: 'instructor',
              profilePicture: '/assets/images/avatar/02.jpg',
              aboutMe: 'I am an experienced instructor with expertise in web development.',
              phoneNo: '+1234567890',
              location: 'San Francisco, USA',
              createdAt: '2022-05-10'
            };
          } catch (mockDataError) {
            console.error('Error fetching mock user data:', mockDataError);
            userData = {
              id: '2',
              email: 'instructor1@example.com',
              fullName: 'John Instructor',
              role: 'instructor',
              profilePicture: '/assets/images/avatar/02.jpg',
              aboutMe: 'I am an experienced instructor with expertise in web development.',
              phoneNo: '+1234567890',
              location: 'San Francisco, USA',
              createdAt: '2022-05-10'
            };
          }
        }

        // Try to get the latest user data from the server
        try {
          const response = await axios.get('/api/user/profile');
          if (response.data && response.data.success && response.data.user) {
            // Update local user data with server data
            const serverUserData = response.data.user;
            authService.setUser(serverUserData);
            await refreshUser();
            console.log('Updated user data from server:', serverUserData);
          }
        } catch (serverError) {
          console.warn('Could not fetch latest user data from server:', serverError);
          // Continue with local data
        }

        // Initialize form with user data
        reset({
          fullName: userData.fullName || userData.name,
          email: userData.email,
          phoneNo: userData.phoneNo || '',
          aboutMe: userData.aboutMe || '',
          profilePicture: userData.profilePicture || '',
        });

        // Set profile image if available
        if (userData.profilePicture) {
          setImage(userData.profilePicture);
        }

        console.log('Form initialized with user data:', userData);
      } catch (error) {
        console.error('Error initializing form:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    // Always initialize the form, using mock data if needed
    initializeForm();
  }, [user, authLoading, reset, refreshUser]);


  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      // Use mock data if user is not logged in
      let userData = user;
      if (!userData) {
        console.log('Using mock user data for profile update');
        // Get user data from mock data
        try {
          const instructors = users.filter(user => user.role === 'instructor');
          userData = instructors[0] || {
            id: '2',
            email: 'instructor1@example.com',
            fullName: 'John Instructor',
            role: 'instructor',
            profilePicture: '/assets/images/avatar/02.jpg'
          };
        } catch (mockDataError) {
          console.error('Error fetching mock user data:', mockDataError);
          userData = {
            id: '2',
            email: 'instructor1@example.com',
            fullName: 'John Instructor',
            role: 'instructor',
            profilePicture: '/assets/images/avatar/02.jpg'
          };
        }
      }

      // Create updated user data
      const updatedUserData = {
        ...userData,
        fullName: data.fullName,
        name: data.fullName, // Keep name and fullName in sync
        phoneNo: data.phoneNo,
        aboutMe: data.aboutMe
      };

      // Handle profilePicture separately
      if (image !== userData.profilePicture) {
        updatedUserData.profilePicture = image;
      }

      console.log('Updating user profile with:', updatedUserData);

      // Update user data in the backend
      try {
        // Make API call to update user profile
        const response = await axios.post('/api/user/update-profile', {
          userId: userData.id,
          userData: updatedUserData
        });

        if (response.data.success) {
          // Update local storage with new user data
          authService.setUser(updatedUserData);

          // Refresh user data in context
          await refreshUser();

          // Show success message
          toast.success('Profile updated successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to update profile');
        }
      } catch (apiError) {
        console.error('API error:', apiError);

        // Fallback: Update local storage even if API fails
        authService.setUser(updatedUserData);
        await refreshUser();

        toast.warn('Profile updated locally, but server update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile: ' + (error.message || 'Unknown error'));
      toast.error('Failed to update profile: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (file.size > 1024 * 1024 * 2) { // 2MB limit
          toast.error('Image size exceeds 2MB');
          return; // Stop processing
        }

        // Convert to base64 for preview and storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setValue('profilePicture', base64String);
          setImage(base64String); // Update preview

          // Store in form data
          console.log('Image processed successfully');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error handling image:', error);
        toast.error('Failed to process image');
      }
    }
  };
  const removeImage = () => {
    setImage(null);
    setValue('profilePicture', null);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <Card className="bg-transparent border rounded-3">
        <CardBody>
          <div className="text-center py-5">
            <h3 className="text-danger">Error</h3>
            <p>{error}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </CardBody>
      </Card>
    );
  }


  return (
    <>
      <Card className="bg-transparent border rounded-3">
        <CardHeader className="bg-transparent border-bottom">
          <h3 className="card-header-title mb-0">Edit Profile</h3>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-4">
              <Col xs={12} className="justify-content-center align-items-center">
                <Form.Label className="form-label">Profile picture</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Label className="position-relative me-4" title="Replace this pic">
                    <span className="avatar avatar-xl" htmlFor="profilePicture">
                      {/* Always use regular img tag for better compatibility */}
                      <img
                        className="avatar-img rounded-circle border border-white border-3 shadow"
                        src={image || defaultImage}
                        alt="profile"
                        width={100}
                        height={100}
                        onError={(e) => {
                          console.log('Image failed to load, using default image');
                          e.target.src = defaultImage.src;
                        }}
                        style={{ objectFit: 'cover' }}
                      />
                    </span>
                    {image && <button type="button" className="uploadremove" onClick={removeImage}><BsX className="bi bi-x text-white" /></button>}

                  </Form.Label>
                  <label className="btn btn-primary-soft mb-0" htmlFor="profilePicture">Change</label>

                  <input id="profilePicture" className="form-control d-none" type="file" accept="image/*" onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                </div>
                {errors.profilePicture && <div className='invalid-feedback d-block' >{errors.profilePicture.message}</div>}
              </Col>

              <Col md={6}>
                <IconTextFormInput
                  control={control}
                  icon={FaUser}
                  placeholder='Full Name'
                  label='Full Name *'
                  name='fullName'
                  error={errors.fullName?.message}
                />
              </Col>
              <Col md={6}>
                <IconTextFormInput
                  control={control}
                  icon={BsEnvelopeFill}
                  placeholder='E-mail'
                  label='Email address *'
                  name='email'
                  disabled={true}
                  error={errors.email?.message}
                />
              </Col>
              <Col md={6}>
                <IconTextFormInput
                  control={control}
                  icon={FaPhone}
                  placeholder='Phone Number'
                  label='Phone number *'
                  name='phoneNo'
                  error={errors.phoneNo?.message}
                />
              </Col>
              <Col xs={12}>
                <Form.Label className="form-label">About me</Form.Label>
                <textarea className="form-control" rows={3} {...register("aboutMe")} />
                <div className="form-text">Brief description for your profile.</div>

              </Col>
              <Col xs={12} className="text-end">
                <button type="submit" className="btn btn-primary mb-0" disabled={loading}>
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

export default EditProfile;