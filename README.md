# Quiz-System

Full-stack Quiz Management System built with **Angular**, **Express.js**, **Node.js**, and **MongoDB**.

## Features

- JWT-based authentication (register/login)
- Role-based admin access
- Admin dashboard APIs for CRUD on categories, questions, quizzes, and user roles
- Dynamic quiz question generation with random sampling
- Real-time score evaluation on quiz submission
- User result history and performance tracking (attempts, average, best)
- Secure backend middleware: Helmet, rate limiting, request sanitization, validation
- Angular frontend structure with routes for auth, quiz participation, history, and admin views
- Responsive UI styles for dashboard/cards/forms

## Project Structure

- `/backend` - Express + MongoDB REST API
  - `src/models` (User, Category, Question, Quiz, Attempt)
  - `src/controllers` (auth, admin, quiz)
  - `src/routes` (`/api/auth`, `/api/quizzes`, `/api/admin`)
  - `tests` (focused unit tests for validation and scoring)
- `/frontend` - Angular standalone component structure
  - `src/app/core` API service
  - `src/app/features` auth, quiz, admin components

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env # create manually if missing
npm run dev
```

Required environment variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` (optional, default `1d`)
- `CLIENT_URL` (optional, comma-separated allowed origins)

## Frontend Setup

```bash
cd frontend
npm install
npm run typecheck
```

Connect frontend API calls to backend at `http://localhost:5000/api` (default in `ApiService`).

## Validation

Backend targeted tests:

```bash
cd backend
npm test
```

Frontend type validation:

```bash
cd frontend
npm run typecheck
```
