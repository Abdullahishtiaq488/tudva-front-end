/**
 * Mock User Data
 * 
 * This file provides mock data for users.
 */

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  role: 'learner' | 'instructor' | 'admin' | 'training_room_admin';
  isActive: boolean;
  phoneNo?: string;
  aboutMe?: string;
  profilePicture?: string;
  education?: string[];
  createdAt: string;
  updatedAt: string;
}

// Sample profile pictures
const profilePictures = [
  '/assets/images/avatar/01.jpg',
  '/assets/images/avatar/02.jpg',
  '/assets/images/avatar/03.jpg',
  '/assets/images/avatar/04.jpg',
  '/assets/images/avatar/05.jpg',
  '/assets/images/avatar/06.jpg',
  '/assets/images/avatar/07.jpg',
  '/assets/images/avatar/08.jpg',
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    passwordHash: 'hashed_password',
    fullName: 'Admin User',
    role: 'admin',
    isActive: true,
    phoneNo: '+1234567890',
    aboutMe: 'I am the admin of this platform.',
    profilePicture: profilePictures[0],
    education: ['MBA, Business School', 'BSc, Computer Science'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    email: 'instructor1@example.com',
    passwordHash: 'hashed_password',
    fullName: 'John Instructor',
    role: 'instructor',
    isActive: true,
    phoneNo: '+1234567891',
    aboutMe: 'Experienced instructor with 10+ years in web development.',
    profilePicture: profilePictures[1],
    education: ['PhD, Computer Science', 'MSc, Software Engineering'],
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    email: 'instructor2@example.com',
    passwordHash: 'hashed_password',
    fullName: 'Jane Instructor',
    role: 'instructor',
    isActive: true,
    phoneNo: '+1234567892',
    aboutMe: 'Passionate about teaching data science and machine learning.',
    profilePicture: profilePictures[2],
    education: ['PhD, Data Science', 'MSc, Mathematics'],
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  },
  {
    id: '4',
    email: 'learner1@example.com',
    passwordHash: 'hashed_password',
    fullName: 'Alice Learner',
    role: 'learner',
    isActive: true,
    phoneNo: '+1234567893',
    aboutMe: 'Eager to learn new technologies and skills.',
    profilePicture: profilePictures[3],
    education: ['BSc, Computer Engineering'],
    createdAt: '2025-01-04T00:00:00.000Z',
    updatedAt: '2025-01-04T00:00:00.000Z',
  },
  {
    id: '5',
    email: 'learner2@example.com',
    passwordHash: 'hashed_password',
    fullName: 'Bob Learner',
    role: 'learner',
    isActive: true,
    phoneNo: '+1234567894',
    aboutMe: 'Looking to advance my career in software development.',
    profilePicture: profilePictures[4],
    education: ['BSc, Information Technology'],
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z',
  },
  {
    id: '6',
    email: 'training_admin@example.com',
    passwordHash: 'hashed_password',
    fullName: 'Training Room Admin',
    role: 'training_room_admin',
    isActive: true,
    phoneNo: '+1234567895',
    aboutMe: 'Managing training rooms and schedules.',
    profilePicture: profilePictures[5],
    education: ['MSc, Education Management'],
    createdAt: '2025-01-06T00:00:00.000Z',
    updatedAt: '2025-01-06T00:00:00.000Z',
  },
  {
    id: '7',
    email: 'instructor3@example.com',
    passwordHash: 'hashed_password',
    fullName: 'Michael Instructor',
    role: 'instructor',
    isActive: true,
    phoneNo: '+1234567896',
    aboutMe: 'Expert in mobile app development and UI/UX design.',
    profilePicture: profilePictures[6],
    education: ['MSc, Mobile Computing', 'BSc, Graphic Design'],
    createdAt: '2025-01-07T00:00:00.000Z',
    updatedAt: '2025-01-07T00:00:00.000Z',
  },
  {
    id: '8',
    email: 'learner3@example.com',
    passwordHash: 'hashed_password',
    fullName: 'Charlie Learner',
    role: 'learner',
    isActive: true,
    phoneNo: '+1234567897',
    aboutMe: 'Transitioning from marketing to tech.',
    profilePicture: profilePictures[7],
    education: ['BSc, Marketing'],
    createdAt: '2025-01-08T00:00:00.000Z',
    updatedAt: '2025-01-08T00:00:00.000Z',
  },
];

export default mockUsers;
