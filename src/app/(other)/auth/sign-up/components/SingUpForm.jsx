// src/app/components/SignUpForm.jsx
'use client';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import IconTextFormInput from '@/components/form/IconTextFormInput';
import { toast } from "react-hot-toast";
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import { useAuth } from '@/context/AuthContext';




const UserRole = {
  Learner: "learner",
  Instructor: "instructor",
  // Admin and TrainingRoomAdmin are NOT included here, as they shouldn't be selectable by the user.
};

// Validation Schema (using yup)
const registerSchema = yup.object({
  fullName: yup.string().required('Please enter your Full Name'),
  email: yup.string().email('Please enter a valid email').required('Please enter your Email'),
  password: yup.string().required('Please enter your Password').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your Password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup.string().oneOf(Object.values(UserRole), 'Please select a valid role').required('Please select a role'), // Added role
  agreement: yup.boolean().oneOf([true], "You must accept terms of service").required()
});

const SignUpForm = () => {
  const [error, setError] = useState(null);
  const router = useRouter();
  const { register: registerUser, loading } = useAuth();

  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { // VERY IMPORTANT: Initialize form values
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.Learner,
      agreement: false
    },
  });

  const onSubmit = async (data) => {
    setError(null);

    try {
      const userData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role
      };

      const result = await registerUser(userData);

      if (result.success) {
        toast.success('Registration successful! Please check your email to confirm your account.');
        router.push('/auth/sign-in');
      } else {
        setError(result.message || 'Registration failed');
        toast.error(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
      toast.error('Registration failed. Please try again.');
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <IconTextFormInput
          control={control}
          icon={FaUser}
          placeholder='Full Name'
          label='Full Name *'
          name='fullName'
          error={errors.fullName?.message}
        />
      </div>
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
      <div className="mb-3">
        <IconTextFormInput
          control={control}
          icon={FaLock}
          placeholder='*********'
          label='Confirm Password *'
          name='confirmPassword'
          type="password"
          error={errors.confirmPassword?.message}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="role" className="form-label">Role *</label>
        <Controller
          name="role"
          control={control}
          defaultValue={UserRole.Learner} // Set default value here too
          render={({ field, fieldState }) => (
            <ChoicesFormInput
              {...field}
              className={`form-control ${fieldState.error ? 'is-invalid' : ''}`} // Pass down is-invalid
              allowInput={false}
              options={{
                removeItemButton: false, // Usually you don't want to remove items in a single select
                // Add other choices.js options here as needed
              }}
            >
              <option value="" disabled>Select a role...</option>
              <option value={UserRole.Learner}>Learner</option>
              <option value={UserRole.Instructor}>Instructor</option>
            </ChoicesFormInput>

          )}

        />
      </div>
      <div className="mb-3">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="agreement"  {...register('agreement')} />
          <label className="form-check-label" htmlFor="agreement">By signing up, you agree to the<a href="#"> terms of service</a></label>
          {errors.agreement && <div className='invalid-feedback d-block' >{errors.agreement.message}</div>}
        </div>
      </div>
      <div className="d-grid">
        <button className="btn btn-primary mb-0" type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {/* {success && <div className="alert alert-success mt-3">Registration successful! Please check your email.</div>} */}
    </form>
  );
};

export default SignUpForm;