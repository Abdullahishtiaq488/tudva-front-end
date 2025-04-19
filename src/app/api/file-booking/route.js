'use server';

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Get the bookings data file path
const getBookingsFilePath = () => {
  return path.join(process.cwd(), 'data', 'bookings.json');
};

// Create a new booking
export async function POST(request) {
  try {
    const data = await request.json();
    const { course_id } = data;
    
    if (!course_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Course ID is required' 
      }, { status: 400 });
    }

    // Get user ID from the request (in a real app, this would come from authentication)
    // For now, we'll use a placeholder or get it from localStorage on the client side
    const user_id = data.user_id || 'current-user-id';

    // Create a new booking
    const newBooking = {
      id: uuidv4(),
      course_id,
      user_id,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Check if the bookings file exists
    let bookings = [];
    try {
      const filePath = getBookingsFilePath();
      const fileData = await fs.readFile(filePath, 'utf8');
      bookings = JSON.parse(fileData);
    } catch (error) {
      // If file doesn't exist, create an empty array
      console.log('Bookings file does not exist, creating a new one');
      bookings = [];
    }

    // Check if the user is already enrolled in this course
    const existingBooking = bookings.find(
      booking => booking.course_id === course_id && booking.user_id === user_id
    );

    if (existingBooking) {
      return NextResponse.json({ 
        success: false, 
        error: 'You are already enrolled in this course' 
      }, { status: 400 });
    }

    // Add the new booking to the array
    bookings.push(newBooking);

    // Save the updated bookings array to the file
    await fs.writeFile(
      getBookingsFilePath(),
      JSON.stringify(bookings, null, 2),
      'utf8'
    );

    return NextResponse.json({ 
      success: true, 
      booking: newBooking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create booking' 
    }, { status: 500 });
  }
}
