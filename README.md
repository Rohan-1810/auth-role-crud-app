# Scalable Task Management System

A robust, role-based task management application built using the MERN stack (MongoDB, Express, React, Node.js). It includes a secure JWT authentication flow, role-based access control (RBAC), and a responsive, modern UI built with a Custom Tailwind CSS Component Library.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI

### Backend Setup
1. Navigate to the `/backend` directory.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to a new `.env` file and set your `MONGODB_URI` and `JWT_SECRET`.
4. Run `npm start` (or `node src/server.js`) to start the API server on port 5000.

### Frontend Setup
1. Navigate to the `/frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Vite development server.
4. Access the application in your browser.

## Features

- **Authentication**: Secure JWT-based stateless authentication.
- **Role-Based Access Control**: Standard users can manage their own tasks, but only an `admin` can delete tasks.
- **UI Architecture**: Clean, modern aesthetic UI components using a Custom Tailwind CSS Component Library.
- **State Management**: Custom React Context API for Global State orchestration.

## Scalability & Security Strategy

- **Stateless Auth**: Uses JWT to allow the backend to scale horizontally across multiple instances without needing to sync session state.
- **Database**: MongoDB allows for easy sharding; I have implemented indexing on the `user` field in the Task model to maintain performance during high-volume CRUD operations.
- **Modular Design**: The Separation of Concerns (SoC) in the folder structure ensures that new features (e.g., "Categories" or "Comments") can be added without refactoring existing logic.
- **Security Check**: The `checkRole` middleware strictly fetches the latest user state from the database using the ID decoded from the JWT. This guarantees that user permissions are verified in real-time and prevents "stale" permissions (e.g., if a user's admin role is revoked, they immediately lose admin privileges).

## Documentation

The API Documentation and Postman collection is available in the `/docs` folder.
