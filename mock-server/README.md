# Mock API Server

A mock API server for testing and demonstrating the NestJS Rate Limiter package.

## Features

- Multiple endpoints demonstrating different rate limiting strategies
- Examples of global, controller, and route-level rate limiting
- CORS enabled for documentation app
- Ready-to-use endpoints for testing

## Installation

```bash
npm install
```

## Running

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3001` by default.

## Endpoints

### Users API

- `GET /users/all` - Get all users (Controller-level: LeakyBucketStrategy)
- `GET /users/profile` - Get user profile (Route-level: TokenBucketStrategy)
- `GET /users/:id` - Get user by ID (Controller-level: LeakyBucketStrategy)
- `POST /users` - Create user (Controller-level: LeakyBucketStrategy)

### Posts API

- `GET /posts` - Get all posts (Global: SlidingWindowStrategy)
- `GET /posts/popular` - Get popular posts (Route-level: SlidingWindowStrategy)
- `GET /posts/:id` - Get post by ID (Global: SlidingWindowStrategy)

### Auth API

- `POST /auth/login` - Login (Route-level: SlidingWindowStrategy - 5/min)
- `POST /auth/register` - Register (Route-level: TokenBucketStrategy)
- `POST /auth/refresh` - Refresh token (No rate limit)

### Upload API

- `POST /upload/file` - Upload file (Route-level: LeakyBucketStrategy)
- `POST /upload/large-file` - Upload large file (Route-level: LeakyBucketStrategy - stricter)

## Rate Limiting Examples

### Global Rate Limit
- Applied to all routes: `SlidingWindowStrategy(100, 60)` - 100 requests per 60 seconds

### Controller-Level Rate Limit
- Users Controller: `LeakyBucketStrategy(10, 1)` - Capacity 10, leaks 1 per second

### Route-Level Rate Limit
- `/users/profile`: `TokenBucketStrategy(5, 1)` - 5 tokens, refills 1 per second
- `/posts/popular`: `SlidingWindowStrategy(5, 60)` - 5 requests per 60 seconds
- `/auth/login`: `SlidingWindowStrategy(5, 60)` - 5 requests per 60 seconds

## Testing

You can test the rate limiting by making multiple requests to the endpoints:

```bash
# Test global rate limit
for i in {1..105}; do curl http://localhost:3001/posts; done

# Test route-level rate limit
for i in {1..6}; do curl http://localhost:3001/users/profile; done

# Test controller-level rate limit
for i in {1..11}; do curl http://localhost:3001/users/all; done
```

## Environment Variables

- `PORT` - Server port (default: 3001)

