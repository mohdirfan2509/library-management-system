# ShelfLife - University Library Management System

## Overview
ShelfLife is a highly scalable, full-stack library management system designed to support 500 campus libraries and over 2 million members. It handles critical operations such as book inventory management, member registration, and book borrowing/returning with robust concurrency controls.

## Features
- **Librarian Authentication**: Secure login via JWT and bcrypt.
- **Book Management**: Add new books, search by title, filter by genre, and handle paginated results.
- **Member Management**: Register new library members and view their borrowing history.
- **Borrowing & Returning**: Atomic operations to issue and return books, ensuring inventory (`availableCopies`) is never compromised during concurrent requests.
- **Overdue Tracking**: Distinct tracking for overdue books.

## Technology Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Zod validation
- **Frontend**: React (Vite), TypeScript, React Router, Axios, Tailwind CSS
- **System Architecture**: Scalable microservices-ready architecture using Redis for caching and message queues for asynchronous tasks.

## Architecture
See [docs/system-design.md](docs/system-design.md) and [docs/architecture.md](docs/architecture.md) for detailed architecture, scaling, and concurrency strategies.

## Project Structure
```text
shelflife/
├── backend/            # Node.js API server
├── frontend/           # React TypeScript application
├── docs/               # Architecture and API documentation
└── README.md
```

## Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

## Installation

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your details (e.g., MongoDB URI, JWT Secret).
4. `npm run dev` to start the backend server.

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env` (ensure `VITE_API_BASE_URL` points to your backend).
4. `npm run dev` to start the frontend application.

## Authentication
The application uses JWT-based authentication. Librarians must log in to issue books, return books, or register members. Passwords are securely hashed using bcrypt.

## API Documentation
| Method | Endpoint | Authentication | Purpose |
|--------|----------|----------------|---------|
| POST | `/api/auth/login` | No | Login |
| POST | `/api/books` | Yes | Add book |
| GET | `/api/books` | Optional | List books |
| POST | `/api/members` | Yes | Register member |
| POST | `/api/borrow` | Yes | Issue book |
| POST | `/api/return/:borrowId` | Yes | Return book |
| GET | `/api/members/:id/history` | Yes | Member history |

Detailed API examples are available in the provided Postman collection.

## Testing
Run backend tests with:
```bash
cd backend
npm test
```

Run frontend type checking and linting with:
```bash
cd frontend
npm run tsc
npm run lint
```

## Concurrency Strategy
ShelfLife uses MongoDB's atomic conditional operators (e.g., `findOneAndUpdate` with a `$gt: 0` condition on `availableCopies` and `$inc` to decrement) to ensure the inventory never falls below zero during concurrent issue requests.

## System Design
Refer to `docs/system-design.md` for our approach to:
- Scalability for 500 campuses
- Handling 10x traffic spikes (autoscaling, load balancing)
- Caching strategy using Redis
- MongoDB Sharding strategy

## Future Improvements
- Multi-tenancy support for explicit library segmentation.
- Background cron jobs for automated overdue notifications.
- Enhanced analytics dashboard.
