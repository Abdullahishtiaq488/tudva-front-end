"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import IconTextFormInput from '@/components/form/IconTextFormInput';
import { toast } from "react-hot-toast";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ButtonLoader from '@/components/ButtonLoader';
import RedirectLoading from '@/components/RedirectLoading';

// Validation Schema (using yup)
const loginSchema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Please enter your Email'),
  password: yup.string().required('Please enter your Password').min(8, 'Password must be at least 8 characters'),
});


const SignIn = () => {
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const { login, loading } = useAuth();

  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setError(null);

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        toast.success('Login successful!');
        setRedirecting(true);
        // Delay redirect to show loading state
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setError(result.message || 'Login failed');
        toast.error(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>
    <div className="mb-3">
      <IconTextFormInput
        control={control}
        icon={FaEnvelope}
        placeholder='E-mail'
        label='Email address *'
        name='email'
        error={errors.email?.message}
      />
    </div>
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
    <div className="mb-4 d-flex justify-content-between">
      <div className="form-check">
        <input type="checkbox" className="form-check-input" id="agreement"  {...register('agreement')} />
        <label className="form-check-label" htmlFor="agreement">By signing up, you agree to the<a href="#"> terms of service</a></label>
        {errors.agreement && <div className='invalid-feedback d-block' >{errors.agreement.message}</div>}
      </div>
      <div className="text-primary-hover">
        <Link href="/auth/forgot-password" className="text-secondary">
          <u>Forgot password?</u>
        </Link>
      </div>
    </div>
    <div className="d-grid">
      <button className="btn btn-primary mb-0" type="submit" disabled={loading || redirecting}>
        <ButtonLoader isLoading={loading} spinnerVariant="light">
          Login
        </ButtonLoader>
      </button>
    </div>
    {error && <div className="alert alert-danger mt-3">{error}</div>}

    {/* Redirect loading overlay */}
    {redirecting && (
      <RedirectLoading
        message="Login successful!"
        destination="Dashboard"
        delay={1500}
      />
    )}
  </form>;
};
export default SignIn;
