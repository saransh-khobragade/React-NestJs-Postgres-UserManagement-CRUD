# Express CRUD API Documentation

This document describes the Express CRUD API built with TypeScript, following strict ESLint and TypeScript rules.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 📋 API Overview

The API provides full CRUD operations for users with the following features:

- **Strict TypeScript** - Maximum type safety
- **ESLint Compliance** - Industry-level code quality
- **RESTful Design** - Standard HTTP methods
- **Error Handling** - Comprehensive error responses
- **Validation** - Input validation and sanitization
- **Pagination** - Support for paginated results

## 🏗️ Project Structure

```
src/
├── types/
│   └── index.ts           # TypeScript interfaces
├── services/
│   └── userService.ts     # Business logic layer
├── routes/
│   ├── index.ts           # Route configuration
│   └── userRoutes.ts      # User CRUD handlers
├── app.ts                 # Express app with middleware
├── simpleApp.ts           # Simplified Express app
└── main.ts               # Server entry point
```

## 📊 API Endpoints

### Health Check

```
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Users API

#### Create User

```
POST /api/users
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

#### Get All Users

```
GET /api/users?page=1&limit=10
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Get User by ID

```
GET /api/users/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update User

```
PUT /api/users/:id
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User updated successfully"
}
```

#### Delete User

```
DELETE /api/users/:id
```

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## 🔧 TypeScript Interfaces

### User Interface

```typescript
interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
```

### API Response Interface

```typescript
interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly error?: string;
}
```

### Paginated Response Interface

```typescript
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
}
```

## 🛡️ Error Handling

### Validation Errors (400)

```json
{
  "success": false,
  "error": "Name and email are required"
}
```

### Not Found Errors (404)

```json
{
  "success": false,
  "error": "User not found"
}
```

### Server Errors (500)

```json
{
  "success": false,
  "error": "Internal server error"
}
```

## 🔍 ESLint Configuration Analysis

The API follows **ultra-strict ESLint rules** including:

### TypeScript Strict Rules

- `@typescript-eslint/explicit-function-return-type` - Requires explicit return types
- `@typescript-eslint/no-explicit-any` - Bans `any` type usage
- `@typescript-eslint/no-non-null-assertion` - Bans `!` non-null assertions
- `@typescript-eslint/no-unsafe-*` - Bans unsafe TypeScript operations
- `@typescript-eslint/strict-boolean-expressions` - Enforces strict boolean checks
- `@typescript-eslint/switch-exhaustiveness-check` - Enforces exhaustive switch statements

### JavaScript Strict Rules

- `no-console` - Bans console statements (with exceptions for server logs)
- `no-debugger` - Bans debugger statements
- `no-eval` - Bans eval usage
- `no-var` - Bans var declarations
- `prefer-const` - Enforces const over let

### Code Style Rules

- `sort-imports` - Enforces alphabetical import sorting
- `quotes` - Enforces single quotes
- `semi` - Enforces semicolons
- `comma-dangle` - Enforces trailing commas
- `indent` - Enforces 2-space indentation

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1234567890

# Update user
curl -X PUT http://localhost:3000/api/users/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1234567890
```

### Using Postman

1. Import the collection from `postman_collection.json` (if available)
2. Set the base URL to `http://localhost:3000`
3. Test each endpoint with appropriate request bodies

## 🚨 Common Issues & Solutions

### ESLint Errors

1. **Missing Return Types**

   ```typescript
   // ❌ Wrong
   function greet(name: string) {
     return `Hello, ${name}!`;
   }

   // ✅ Correct
   function greet(name: string): string {
     return `Hello, ${name}!`;
   }
   ```

2. **Using `any` Type**

   ```typescript
   // ❌ Wrong
   const data: any = { message: 'test' };

   // ✅ Correct
   const data: { message: string } = { message: 'test' };
   ```

3. **Non-null Assertions**

   ```typescript
   // ❌ Wrong
   const element = document.getElementById('test')!;

   // ✅ Correct
   const element = document.getElementById('test');
   if (element) {
     // use element safely
   }
   ```

### TypeScript Errors

1. **Strict Null Checks**

   ```typescript
   // ❌ Wrong
   const element = document.getElementById('test');
   element.innerHTML = 'test';

   // ✅ Correct
   const element = document.getElementById('test');
   if (element) {
     element.innerHTML = 'test';
   }
   ```

## 🔄 Development Workflow

1. **Start Development**

   ```bash
   yarn dev
   ```

2. **Check for Linting Issues**

   ```bash
   yarn lint
   ```

3. **Auto-fix Linting Issues**

   ```bash
   yarn lint:fix
   ```

4. **Type Checking**

   ```bash
   yarn type-check
   ```

5. **Format Code**

   ```bash
   yarn format
   ```

6. **Build for Production**
   ```bash
   yarn build
   ```

## 📈 Future Enhancements

1. **Database Integration** - Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication** - Add JWT-based authentication
3. **Validation** - Add comprehensive input validation with Joi or Zod
4. **Testing** - Add unit and integration tests
5. **Documentation** - Add OpenAPI/Swagger documentation
6. **Rate Limiting** - Add rate limiting middleware
7. **Caching** - Add Redis caching layer
8. **Logging** - Add structured logging with Winston

## 🎯 Benefits of This Setup

- **🔒 Maximum Type Safety** - Strict TypeScript configuration
- **🚫 Prevents Runtime Errors** - Comprehensive ESLint rules
- **🧹 Clean Code** - Consistent formatting and style
- **🛡️ Quality Gate** - Git hooks prevent bad commits
- **📈 Team Consistency** - Same standards across all environments
- **🚀 Production Ready** - Industry best practices
- **⚡ Simple & Clean** - Minimal boilerplate with maximum functionality

This API setup ensures high-quality, maintainable TypeScript code with excellent developer experience!
