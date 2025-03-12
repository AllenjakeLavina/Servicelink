# ServiceLink API

A Node.js/TypeScript API with authentication using JWT tokens.

## Features

- User authentication (signup/login)
- JWT token-based authorization
- TypeScript support
- Express.js framework
- Prisma ORM with MySQL database
- Secure password hashing with bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd servicelink
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the database connection string and other variables

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Sign Up
- **POST** `/api/auth/signup`
- Body:
```json
{
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
}
```

#### Login
- **POST** `/api/auth/login`
- Body:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

## Environment Variables

- `DATABASE_URL`: MySQL database connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 3000)

## Scripts

- `npm run dev`: Start development server with hot reload
- `npm start`: Start production server
- `npm test`: Run tests 