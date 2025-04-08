'use client';

import IconTextFormInput from '@/components/form/IconTextFormInput';
import axiosInstance from '@/utils/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope } from 'react-icons/fa';
import * as yup from 'yup';

// Validation Schema (using yup)
const forgetPasswordSchema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Please enter your Email'),
});

const ForgotPassword = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgetPassword = async (data) => {
    setError(null);
    setLoading(true);

    try {
      const formData = {
        email: data.email
      }

      console.log(formData, 'formData')

      const requestResponse = await axiosInstance.post(`/api/user/request-password-reset`, formData);
      console.log(requestResponse, 'requestResponse')
      const response = requestResponse.data;
      if (response.success) {
        setSuccess(true);
        toast.success('We have emailed you a link to reset your password');
        router.push('/auth/callback');
      } else {
        setError(response.data.error || 'Registration failed');
      }
    } catch (err) {
      console.log(err, 'Error')
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };



  return <form onSubmit={handleSubmit(handleForgetPassword)}>
    <div className="mb-4">
      <IconTextFormInput
        control={control}
        icon={FaEnvelope}
        placeholder='E-mail'
        label='Email address *'
        name='email'
        error={errors.email?.message}
      />
    </div>
    <div className="align-items-center">
      <div className="d-grid">
        <button className="btn btn-primary mb-0" type="submit" disabled={loading}>
          {loading ? 'Reset Password...' : 'Reset Password'}
        </button>
      </div>
    </div>
    {error && <div className="alert alert-danger mt-3">{error}</div>}
  </form>;
};
export default ForgotPassword;
