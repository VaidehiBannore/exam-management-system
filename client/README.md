# Exam Management System

A MERN stack Exam Management System for managing exam timetables.

## Features

### Admin
- Admin login
- Create exams
- View exams
- Edit exams
- Delete exams
- Required field validation
- Start and end time validation

### Student
- Student login
- View profile
- View personalized exam timetable
- Timetable filtered by academic year and section
- Students cannot access another section's timetable
- Handles missing profile information
- Handles empty timetable

## Tech Stack

- React
- Vite
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## API Endpoints

### Authentication
- POST `/api/auth/login`
- GET `/api/auth/me`

### Admin
- POST `/api/exams`
- GET `/api/exams`
- GET `/api/exams/:id`
- PUT `/api/exams/:id`
- DELETE `/api/exams/:id`

### Student
- GET `/api/student/profile`
- GET `/api/student/timetable`

## Student Timetable Filtering

Students only see exams matching their own:

- Academic Year
- Section

The filtering is performed on the backend using the authenticated student's profile.

## Setup

### Backend

```bash
cd server
npm install
npm start