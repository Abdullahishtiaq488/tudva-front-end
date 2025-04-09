// src/app/components/EditProfile.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
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
import { FaUser } from 'react-icons/fa'; // Import icons
import defaultImage from '../../../../assets/images/avatar/11.jpg';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';

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

  const { register, handleSubmit, formState: { errors, isDirty, dirtyFields }, setValue, reset, control } = useForm({
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
        // Get user data from localStorage only
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

        reset({
          fullName: user.fullName || user.name,
          email: user.email,
          location: user.location,
          phoneNo: user.phoneNo,
          aboutMe: user.aboutMe,
          profilePicture: user.profilePicture,
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

      // Update user data with form values
      userData = {
        ...userData,
        fullName: data.fullName,
        name: data.fullName, // Keep name and fullName in sync
        phoneNo: data.phoneNo,
        aboutMe: data.aboutMe,
        location: data.location,
      };

      // Handle profilePicture separately
      if (image !== userData.profilePicture) {
        userData.profilePicture = image;
      }

      // Handle education data
      if (data.education) {
        userData.education = data.education.map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || ''
        }));
      }

      console.log('Updated user data:', userData);

      // Save updated user data to localStorage
      localStorage.setItem('user_data', JSON.stringify(userData));

      // Update state
      setUser(userData);

      // Show success message
      toast.success('Profile updated successfully!');

      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile: ' + (error.message || 'Unknown error'));
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
                <label className="form-label">Phone number *</label>
                <input className="form-control" type="tel" placeholder="Phone Number" {...register("phoneNo")} />
                {errors.phoneNo && <div className='invalid-feedback d-block'>{errors.phoneNo.message}</div>}
              </Col>
              <Col xs={12}>
                <Form.Label className="form-label">About me</Form.Label>
                <textarea className="form-control" rows={3} {...register("aboutMe")} />
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