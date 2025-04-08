"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'; // Import icons
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import IconTextFormInput from '@/components/form/IconTextFormInput'; // Import your component
import axiosInstance from '@/utils/axiosInstance';
import { toast } from "react-hot-toast";
import Link from 'next/link';

// Validation Schema (using yup)
const resetPasswordSchema = yup.object({
  password: yup.string().required('Please enter your new Password').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your new Password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const ResetPassword = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Token is missing. Please use the link provided in the email.");
      // router.push('/auth/sign-in'); // Redirect if no token and desired.
    }
  }, [token, router]);


  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {

    if (!token) {
      setError("Token is missing.  Please use the link provided in the email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      console.log(data, 'data')

      // Send newPassword, confirmPassword and token to the backend
      const response = await axiosInstance.post(`/api/user/reset-password?token=${token}`, {
        newPassword: data.password
      });

      console.log(response, 'response')

      if (response.status === 200) {
        toast.success('Password reset successfully! You can now login.');
        router.push('/auth/sign-in'); // Redirect to login page
      } else {
        setError(response.data.error || 'Password reset failed.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div>Error: Token is missing. Please use the link provided in the email.</div>;
  }

  return <form onSubmit={handleSubmit(onSubmit)}>
    <div className="mb-3">
      <IconTextFormInput
        control={control}
        icon={FaLock}
        placeholder='*********'
        label='Password *'
        name='password'
        type="password"
        error={errors.password?.message}
      />
    </div>
    <div className="mb-3">
      <IconTextFormInput
        control={control}
        icon={FaLock}
        placeholder='*********'
        label='Confirm password *'
        name='confirmPassword'
        type="password"
        error={errors.confirmPassword?.message}
      />
    </div>
    <div className="d-grid">
      <button className="btn btn-primary mb-0" type="submit" disabled={loading}>
        {loading ? 'Save...' : 'Save'}
      </button>
    </div>
    {error && <div className="alert alert-danger mt-3">{error}</div>}
  </form>;
};
export default ResetPassword;
