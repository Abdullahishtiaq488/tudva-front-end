'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

const ConfirmChangePassword = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // const token = searchParams.get("token");
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    setToken(token || "");
  }, [])

  const handleVerify = async () => {
    try {
      setLoading(true);
      if (token.length > 0) {
        const response = await axiosInstance.get(`/api/user/verify-reset-token?token=${token}`);
        setLoading(false);
        if (response.status === 200 && response.data.success) { // Use response.status for axios instead of response.ok
          router.push(`/auth/reset-password?token=${token}`);
        } else {
          toast.error(response.data.message || 'Invalid or expired token.');
          router.push(`/auth/sign-in`);
        }
      } else {
        setLoading(false);
        toast.error("Token Does not Exists");
        router.push(`/auth/sign-in`);
      }
    } catch (error) {
      console.log(error, 'error')
      setLoading(false);
      toast.error(error.response.data.error);
      router.push('/auth/sign-in');
    }
  };

  return <form >
    <div className="align-items-center">
      <div className="d-grid">
        <button onClick={handleVerify} className="btn btn-primary mb-0" type="submit" disabled={loading}>
          {loading ? 'Verifying, please wait...' : 'Create New Password'}
        </button>
      </div>
    </div>
  </form>;
};
export default ConfirmChangePassword;
