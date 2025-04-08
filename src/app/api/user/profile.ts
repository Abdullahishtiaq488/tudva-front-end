// import axiosInstance from "@/utils/axiosInstance";
// import axios from "axios";
// import { NextRequest, NextResponse } from "next/server";

// export async function Put(request: NextRequest, response: NextResponse) {
//   try {
//     const reqBody = await request.json();

//     console.log(reqBody, 'reqBody')

//     const backendResponse = await axiosInstance.put('/api/user/profile', reqBody);
//     console.log(backendResponse, 'backendResponse')
//     const responseData = backendResponse.data;

//     console.log(responseData, 'response')

//     const token = responseData.token || '';

//     const responseReturn = NextResponse.json({
//       message: "Logged In Success",
//       success: true,
//       data: responseData.user
//     }, { status: 200 });

//     responseReturn.cookies.set("token", token, {
//       httpOnly: true
//     });

//     return responseReturn;

//   } catch (error) {
//     let status = 500;
//     let message = 'An unexpected error occurred';

//     // Handle Axios errors (network errors, backend errors)
//     if (axios.isAxiosError(error)) {
//       console.log(error.response?.data.error, 'error')
//       status = error.response?.status || 500;
//       message = error.response?.data.error ; // Get message from backend

//     }
//     return NextResponse.json({ error: message, success: false }, { status: status });
//   }
// }