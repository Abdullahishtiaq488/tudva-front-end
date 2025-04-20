# Busnet LMS Frontend

This is a Next.js application for the Busnet Learning Management System (LMS). The application is built with Next.js App Router, TypeScript, and Tailwind CSS.

## Frontend-Only Mode

This project is currently in **frontend-only mode**, which means it does not require a backend server to run. All API calls are handled by a mock system that simulates backend behavior.

### Mock System

The mock system is located in the `src/mocks` directory and includes:

- Mock data for all entities (users, courses, reviews, etc.)
- Mock service implementations that mimic backend behavior
- API routes that use the mock services instead of calling a real backend

For more details, see the [Mock System Documentation](./src/mocks/README.md).

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Authentication**: Login, registration, and profile management
- **Course Management**: Browse, search, and filter courses
- **Enrollment**: Enroll in courses and track progress
- **Reviews**: Read and write course reviews
- **Wishlist**: Save courses for later
- **Notifications**: Receive and manage notifications

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── mocks/            # Mock data and services
├── styles/           # Global styles and Tailwind config
└── utils/            # Utility functions
```

## Future Integration with Backend

When you're ready to connect to a real backend:

1. Update the API routes in `src/app/api/` to call the real backend API
2. Keep the same response structure to minimize changes to the frontend components
3. Remove or disable the mock system

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/docs) - typed JavaScript
