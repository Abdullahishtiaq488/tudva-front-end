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
import { checkIsLoggedInUser } from "@/helpers/checkLoggedInUser"; // Import your function
import IconTextFormInput from '@/components/form/IconTextFormInput'; // Import
import { FaUser, FaPhone } from 'react-icons/fa'; // Import icons
import defaultImage from '../../../../assets/images/avatar/11.jpg';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import authService from '@/services/authService'; // Import authService
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Use 'any' or a more specific type
  const [image, setImage] = useState(null);
  const [token, setToken] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Use the auth context
  const { refreshUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isDirty, dirtyFields }, setValue, getValues, reset, control } = useForm({
    resolver: yupResolver(profileSchema),
  });

  // Use useFieldArray for the education field
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education", // MUST match the field name in your schema
  });


  // Fetch user data on component mount and when user changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to get the latest user data from the server first
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

        // Get user data from localStorage as fallback
        const { user, token, error } = await checkIsLoggedInUser();

        if (error) {
          setError(error || 'Not authenticated');
          setLoading(false);
          return;
        }

        if (!user) {
          setError('User not found');
          setLoading(false);
          return;
        }

        // Process education data
        let parsedEducation = [{ degree: '', institution: '' }];
        if (user.education) {
          parsedEducation = typeof user.education === 'string'
            ? JSON.parse(user.education)
            : user.education;

          // Ensure parsedEducation is an array of objects
          if (!Array.isArray(parsedEducation)) {
            parsedEducation = [{ degree: '', institution: '' }]; // Fallback
          }
        }

        user.education = parsedEducation;

        setUser(user);
        setToken(token);

        const educationData = user.education
          ? user.education.map((edu) => ({
            degree: edu.degree || '', // Provide default values
            institution: edu.institution || '',
          }))
          : [{ degree: '', institution: '' }];

        // Log the user data for debugging
        console.log('User data for form reset:', {
          fullName: user.fullName || user.name,
          email: user.email,
          phoneNo: user.phoneNo || 'Not provided',
          aboutMe: user.aboutMe ? 'Provided' : 'Not provided',
          hasProfilePicture: !!user.profilePicture,
          educationCount: educationData.length
        });

        reset({
          fullName: user.fullName || user.name,
          email: user.email,
          location: user.location || '',
          phoneNo: user.phoneNo || '',
          aboutMe: user.aboutMe || '',
          profilePicture: user.profilePicture || '',
          education: educationData,
        });

        if (user.profilePicture) {
          setImage(user.profilePicture);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reset]);


  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      // Get current user data from localStorage
      const storedUserData = localStorage.getItem('user_data');
      let userData = storedUserData ? JSON.parse(storedUserData) : {};

      // Create updated user data
      const updatedUserData = {
        ...userData,
        fullName: data.fullName,
        name: data.fullName, // Keep name and fullName in sync
        // Explicitly handle phoneNo and aboutMe to ensure they're saved even if empty
        phoneNo: data.phoneNo !== undefined ? data.phoneNo : '',
        aboutMe: data.aboutMe !== undefined ? data.aboutMe : '',
        location: data.location,
      };

      // Handle profilePicture separately
      if (image !== userData.profilePicture) {
        updatedUserData.profilePicture = image;
      }

      // Handle education data
      if (data.education) {
        updatedUserData.education = data.education.map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || ''
        }));
      }

      console.log('Updated user data:', {
        fullName: updatedUserData.fullName,
        phoneNo: updatedUserData.phoneNo,
        aboutMe: updatedUserData.aboutMe,
        hasProfilePicture: !!updatedUserData.profilePicture,
        profilePictureLength: updatedUserData.profilePicture ? updatedUserData.profilePicture.substring(0, 30) + '...' : 'none'
      });

      // Show loading toast
      toast.loading('Updating profile...', { id: 'profile-update' });

      // Make API call to update user profile
      try {
        // Ensure we have a user ID
        const userId = userData.id || userData.userId || user?.id || user?.userId;

        console.log('Sending profile update with user ID:', userId || 'No ID available');

        // Ensure profile picture is included
        if (image) {
          console.log('Including profile picture in update, length:', image.length);
          updatedUserData.profilePicture = image;
        }

        const response = await axios.post('/api/user/update-profile', {
          userId: userId,
          userData: {
            ...updatedUserData,
            id: userId, // Include ID in userData as well for redundancy
            userId: userId, // Include userId in userData as well for redundancy
            token: authService.getToken() // Include the auth token
          }
        });

        if (response.data.success) {
          // Update local storage with new user data
          const updatedUser = response.data.user || updatedUserData;

          // Ensure all fields are properly set
          const finalUserData = {
            ...updatedUser,
            // Ensure these fields are always strings, even if empty
            phoneNo: updatedUser.phoneNo !== undefined ? updatedUser.phoneNo : '',
            aboutMe: updatedUser.aboutMe !== undefined ? updatedUser.aboutMe : '',
            // Keep name and fullName in sync
            name: updatedUser.fullName || updatedUser.name,
            fullName: updatedUser.fullName || updatedUser.name
          };

          // Update local storage with the final user data
          localStorage.setItem('user_data', JSON.stringify(finalUserData));

          // Also update auth_user in localStorage for AuthContext
          localStorage.setItem('auth_user', JSON.stringify(finalUserData));

          // Update state
          setUser(finalUserData);

          // Also update auth context by refreshing user data
          try {
            if (refreshUser) {
              console.log('Refreshing user data after profile update');
              await refreshUser();
            }
          } catch (refreshError) {
            console.error('Error refreshing user data after profile update:', refreshError);
          }

          // Show success message
          toast.success('Profile updated successfully!', { id: 'profile-update' });
        } else {
          toast.error(response.data.message || 'Failed to update profile', { id: 'profile-update' });
          throw new Error(response.data.message || 'Failed to update profile');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        console.error('Error details:', apiError.response?.data || apiError.message);

        // Fallback: Update local storage even if API fails
        console.log('API failed, updating user data locally:', {
          fullName: updatedUserData.fullName,
          phoneNo: updatedUserData.phoneNo,
          aboutMe: updatedUserData.aboutMe,
          hasProfilePicture: !!updatedUserData.profilePicture,
          profilePictureLength: updatedUserData.profilePicture ? updatedUserData.profilePicture.substring(0, 30) + '...' : 'none'
        });

        // Ensure all fields are properly set
        const fallbackUserData = {
          ...updatedUserData,
          // Ensure these fields are always strings, even if empty
          phoneNo: updatedUserData.phoneNo !== undefined ? updatedUserData.phoneNo : '',
          aboutMe: updatedUserData.aboutMe !== undefined ? updatedUserData.aboutMe : '',
          // Keep name and fullName in sync
          name: updatedUserData.fullName || updatedUserData.name,
          fullName: updatedUserData.fullName || updatedUserData.name
        };

        // Update local storage with the fallback user data
        localStorage.setItem('user_data', JSON.stringify(fallbackUserData));

        // Also update auth_user in localStorage for AuthContext
        localStorage.setItem('auth_user', JSON.stringify(fallbackUserData));

        // Update state
        setUser(fallbackUserData);

        // Also update auth context by refreshing user data
        try {
          if (refreshUser) {
            console.log('Refreshing user data after local profile update');
            await refreshUser();
          }
        } catch (refreshError) {
          console.error('Error refreshing user data after local profile update:', refreshError);
        }

        toast.error('Profile updated locally, but server update failed', { id: 'profile-update' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile: ' + (error.message || 'Unknown error'));
      toast.error('Failed to update profile: ' + (error.message || 'Unknown error'), { id: 'profile-update' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (file.size > 1024 * 1024 * 5) { // 5MB limit
          toast.error('Image size exceeds 5MB');
          return; // Stop processing
        }

        // Show loading toast
        toast.loading('Processing image...', { id: 'upload-image' });

        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result;

          // Set the image in state and form
          setImage(base64String);
          setValue('profilePicture', base64String);

          // Get current user data from localStorage
          try {
            const storedUserData = localStorage.getItem('user_data');
            let userData = storedUserData ? JSON.parse(storedUserData) : {};

            // Update only the profile picture
            userData.profilePicture = base64String;

            // Save back to localStorage
            localStorage.setItem('user_data', JSON.stringify(userData));

            // Also update auth_user in localStorage for AuthContext
            localStorage.setItem('auth_user', JSON.stringify(userData));

            // Also update auth context by refreshing user data
            try {
              // Use the refreshUser function from the auth context
              if (refreshUser) {
                console.log('Refreshing user data after profile picture update');
                await refreshUser();
              }
            } catch (refreshError) {
              console.error('Error refreshing user data:', refreshError);
            }

            // Show success message
            toast.success('Profile picture updated', { id: 'upload-image' });

            console.log('Profile picture saved locally, length:', base64String.length);
          } catch (error) {
            console.error('Error saving profile picture locally:', error);
            toast.error('Failed to save profile picture', { id: 'upload-image' });
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error handling image:', error);
        toast.error('Failed to process image', { id: 'upload-image' });
      }
    }
  };
  const removeImage = async () => {
    setImage(null);
    setValue('profilePicture', null);

    // Also update localStorage
    try {
      const storedUserData = localStorage.getItem('user_data');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        userData.profilePicture = null;
        localStorage.setItem('user_data', JSON.stringify(userData));

        // Also update auth_user in localStorage for AuthContext
        localStorage.setItem('auth_user', JSON.stringify(userData));

        // Also update auth context by refreshing user data
        try {
          // Use the refreshUser function from the auth context
          if (refreshUser) {
            console.log('Refreshing user data after profile picture removal');
            await refreshUser();
          }
        } catch (refreshError) {
          console.error('Error refreshing user data:', refreshError);
        }

        toast.success('Profile picture removed');
      }
    } catch (error) {
      console.error('Error removing profile picture from localStorage:', error);
    }
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
                <textarea
                  className="form-control"
                  rows={3}
                  {...register("aboutMe")}
                  onChange={(e) => {
                    // Log the value for debugging
                    console.log('About me input changed:', e.target.value);
                    // Use the register's onChange handler
                    register("aboutMe").onChange(e);
                  }}
                />
                <div className="form-text">Brief description for your profile.</div>
              </Col>
              <Col xs={12}>
                <Form.Label className="form-label">Education</Form.Label>
                {fields.map((item, index) => (
                  <Row key={item.id} className="mb-3">
                    <Col md={5}>
                      <Form.Control
                        type="text"
                        placeholder="Degree"
                        {...register(`education.${index}.degree`)}
                      />
                      {errors.education?.[index]?.degree && (
                        <div className="invalid-feedback d-block">
                          {errors.education[index].degree.message}
                        </div>
                      )}
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="text"
                        placeholder="Institution"
                        {...register(`education.${index}.institution`)}
                      />
                      {errors.education?.[index]?.institution && (
                        <div className="invalid-feedback d-block">
                          {errors.education[index].institution.message}
                        </div>
                      )}
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => remove(index)}
                      >
                        <BsTrash />
                      </button>
                    </Col>
                  </Row>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-light mb-0"
                  onClick={() => append({ degree: '', institution: '' })}
                >
                  <BsPlus className="me-1" />Add more
                </button>
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