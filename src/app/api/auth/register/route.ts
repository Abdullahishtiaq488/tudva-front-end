import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const reqBody = await request.json();

    console.log(reqBody, 'reqBody')

    const backendResponse = await axiosInstance.post('/api/user/register', reqBody);
    console.log(backendResponse, 'backendResponse')
    const responseData = backendResponse.data;

    console.log(responseData, 'response')

    return NextResponse.json({
      message: "Registration Successful. Please check your email for confirmation.",
      success: true,
      data: responseData
    }, { status: 201 });

  } catch (error) {
    let status = 500;
    let message = 'An unexpected error occurred';

    // Handle Axios errors (network errors, backend errors)
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data.error, 'error')
      status = error.response?.status || 500;
      message = error.response?.data.error || error.message; // Get message from backend
    }
    return NextResponse.json({ error: message, success: false }, { status: status });
  }
}
