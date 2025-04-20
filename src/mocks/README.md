# Mock Data System

This directory contains a comprehensive mock data system that replaces the backend API with a client-side implementation. This allows frontend development to continue without requiring a working backend server.

## Overview

The mock system is designed to:

1. Provide realistic mock data for all entities (users, courses, reviews, etc.)
2. Simulate API behavior including delays, errors, and pagination
3. Persist data between page refreshes using localStorage
4. Maintain the same API structure as the real backend for seamless future integration

## Directory Structure

```
src/mocks/
├── data/           # Mock data for all entities
├── services/       # Mock service implementations
├── utils/          # Utility functions
└── index.ts        # Main entry point
```

## How It Works

The mock system uses a client-side "database" implemented with localStorage to store and retrieve data. This allows changes made during a session (like adding a course to wishlist) to persist between page refreshes.

### Key Components:

1. **Mock Database (`mockDb.ts`)**: An in-memory database with localStorage persistence
2. **Mock Data**: Pre-populated data for all entities
3. **Mock Services**: Service implementations that mimic backend behavior
4. **API Routes**: Next.js API routes that use the mock services

## Using the Mock System

The mock system is automatically initialized when the first API request is made. You don't need to do anything special to use it.

### Making API Requests

Continue to use the existing API routes as before. The routes have been updated to use the mock services instead of making real backend requests.

Example:
```typescript
// This code works the same with both real and mock backends
const response = await fetch('/api/courses');
const data = await response.json();
```

## Extending the Mock System

### Adding New Data

To add new mock data, edit the appropriate file in the `data/` directory. For example, to add a new course, edit `data/courses.ts`.

### Adding New Services

To add a new service, create a new file in the `services/` directory and export it from `services/index.ts`.

### Adding New API Routes

To add a new API route, create a new file in the `app/api/` directory and use the mock services.

## Reconnecting to a Real Backend

When you're ready to reconnect to a real backend:

1. Replace the API route implementations to call the real backend API
2. Keep the same response structure to minimize changes to the frontend components

## Limitations

- The mock system does not implement all possible edge cases
- Some complex queries may not be fully supported
- File uploads are simulated but not actually stored
- Real-time features (like WebSockets) are not implemented

## Troubleshooting

If you encounter issues with the mock system:

1. Check the browser console for errors
2. Try clearing localStorage to reset the mock database
3. Ensure that the mock system is properly initialized before making requests
