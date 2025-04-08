'use client';

import { useRouter } from "next/navigation";
import { LoadingRotating } from "../../../components/loader/LoadingRotating";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function AuthCallBack() {
    const router = useRouter();

    useEffect(() => {
        // Simple redirect to home page after a short delay
        const redirectToHome = () => {
            toast.success('Login successful!');
            setTimeout(() => {
                router.push('/');
            }, 1000);
        };

        // Check if we have a token
        const token = localStorage.getItem('token');
        if (token) {
            redirectToHome();
        } else {
            // If no token, redirect to login
            toast.error('Login verification failed');
            setTimeout(() => {
                router.push('/auth/sign-in');
            }, 1000);
        }

        // Set a maximum timeout for the callback page
        const timeoutId = setTimeout(() => {
            console.log('Auth callback timed out, redirecting to home');
            router.push('/');
        }, 5000); // 5 seconds max

        return () => clearTimeout(timeoutId);
    }, [router]);

    return (
        <div className="my-5 vh-100 w-100 d-flex justify-content-center text-center">
            <div className="flex flex-col align-items-center gap-2">
                <LoadingRotating />
                <h3 className="text-xl font-semibold">Completing login...</h3>
                <p>Please wait</p>
            </div>
        </div>
    );
}
