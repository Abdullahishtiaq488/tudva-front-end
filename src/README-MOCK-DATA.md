# Centralized Mock Data System

This document describes the centralized mock data system used in the frontend application. The system is designed to provide consistent mock data across all components, making it easy to replace with a real backend in the future.

## Overview

The mock data system is designed to:

1. Provide a single source of truth for all mock data
2. Ensure consistent data structures across all components
3. Mimic the behavior of a real backend API
4. Make it easy to replace with a real backend in the future

## Directory Structure

```
front-end/src/
├── mockSystem.js                # Main entry point for the mock system
├── services/
│   └── mockDataService.js       # Centralized service for accessing mock data
├── mocks/
│   ├── data/                    # Mock data files
│   │   ├── index.ts             # Exports all mock data
│   │   ├── users.ts             # User data
│   │   ├── courses.ts           # Course data
│   │   ├── reviews.ts           # Review data
│   │   ├── bookings.ts          # Booking data
│   │   ├── wishlist.ts          # Wishlist data
│   │   ├── lectureAccess.ts     # Lecture access data
│   │   └── notifications.ts     # Notification data
│   ├── services/                # Mock service implementations
│   │   ├── index.ts             # Exports all mock services
│   │   ├── authService.ts       # Authentication service
│   │   ├── courseService.ts     # Course service
│   │   ├── reviewService.ts     # Review service
│   │   └── ...                  # Other services
│   └── utils/                   # Utility functions
│       └── mockDb.ts            # Mock database implementation
└── hooks/                       # React hooks for accessing mock data
    ├── useMockReviews.js        # Hook for accessing review data
    └── ...                      # Other hooks
```

## How It Works

The mock system uses a client-side "database" implemented with localStorage to store and retrieve data. This allows changes made during a session (like adding a course to wishlist) to persist between page refreshes.

### Key Components:

1. **mockSystem.js**: The main entry point for the mock system. It initializes the mock database and exports all mock data and services.

2. **mockDataService.js**: A centralized service for accessing mock data. It provides methods for all components to access the same mock data.

3. **Mock Database**: An in-memory database with localStorage persistence. It provides methods for CRUD operations on mock data.

4. **Mock Services**: Service implementations that mimic backend behavior. They provide methods for interacting with mock data.

5. **React Hooks**: Custom hooks for accessing mock data in React components. They provide a consistent interface for components to access mock data.

## Using the Mock System

### Initialization

The mock system is initialized in the `AppProvidersWrapper` component:

```jsx
import { initMockSystem } from '@/mockSystem';

useEffect(() => {
  // Initialize the mock data system
  initMockSystem();
  console.log('Mock data system initialized');
  
  // ...
}, []);
```

### Accessing Mock Data

Components can access mock data through the centralized service:

```jsx
import { courseService } from '@/services/mockDataService';

// Get all courses
const courses = await courseService.getAllCourses();

// Get a specific course
const course = await courseService.getCourseById('1');
```

### Using React Hooks

React components can use custom hooks to access mock data:

```jsx
import { useMockReviews } from '@/hooks/useMockReviews';

const {
  reviews,
  isLoading,
  error,
  pagination,
  submitReview,
  updateUserReview,
  deleteUserReview,
  changePage,
  fetchReviews
} = useMockReviews(courseId);
```

## Data Structure

The mock data system uses a consistent data structure across all entities. Here are the main entities:

### Users

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'learner' | 'instructor' | 'admin';
  profilePicture?: string;
  // ...
}
```

### Courses

```typescript
interface Course {
  id: string;
  title: string;
  description?: string;
  short_description?: string;
  format: 'live' | 'recorded';
  courseType: 'live' | 'recorded';
  instructor_id: string;
  // ...
}
```

### Reviews

```typescript
interface Review {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string;
  date: string;
  // ...
}
```

## Replacing with a Real Backend

When you're ready to replace the mock system with a real backend, you'll need to:

1. Create real API endpoints that match the mock service methods
2. Update the service files to use the real API endpoints instead of mock data
3. Keep the same data structure to ensure compatibility with existing components

The centralized service approach makes this transition easier because you only need to update the service files, not the components that use them.

## Best Practices

1. **Always use the centralized service**: Don't import mock data directly in components. Use the centralized service instead.

2. **Keep data structures consistent**: Make sure all mock data follows the same structure to ensure compatibility with real data.

3. **Use React hooks**: Use custom hooks to access mock data in React components. This provides a consistent interface and makes it easier to replace with real data.

4. **Test with real-world scenarios**: Test the mock system with real-world scenarios to ensure it behaves like a real backend.

5. **Document changes**: Keep this documentation up-to-date with any changes to the mock system.
