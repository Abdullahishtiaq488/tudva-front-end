import { NextResponse } from 'next/server'
import { decodeJWT } from './utils/decodeToken';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {

    return NextResponse.next();

    // const path = request.nextUrl.pathname;
    // const isPublicPath =
    //     path === '/auth/sign-in' ||
    //     path === '/auth/sign-up' ||
    //     path === '/auth/forgot-password' ||
    //     path === '/auth/confirm-email' ||
    //     path === '/auth/confirm-change-password' ||
    //     path === '/auth/reset-password'
    //     ;

    // const token = request.cookies.get("token")?.value || '';
    // const tokenData = decodeJWT(token);

    // if (isPublicPath && token) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    // if (token && tokenData) {

    //     if (tokenData.role === 'instructor' && path.startsWith('/student')) {
    //         // Instructor trying to access /student -> redirect to /instructor
    //         return NextResponse.redirect(new URL('/instructor/profile', request.url));
    //     }

    //     if (tokenData.role === 'learner' && path.startsWith('/instructor')) {
    //         // Learner trying to access /instructor -> redirect to / (or a student dashboard)
    //         return NextResponse.redirect(new URL('/student/profile', request.url)); // Or /student, if you have one
    //     }

    //     return NextResponse.next();
    // }

    // if (!isPublicPath && !token) {
    //     return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    // }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/auth/:path*',
        '/student/:path*',
        '/instructor/:path*',
    ]
}