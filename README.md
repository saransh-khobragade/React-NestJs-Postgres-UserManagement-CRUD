# Frontend-Backend Connection Setup

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
yarn docker:up
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Node.js API on port 3000

### 2. Start the Frontend

```bash
cd frontend
yarn dev
```

The frontend will run on `http://localhost:5173`

### 3. Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

## 🔗 What's Connected

### Authentication
- ✅ Login API: `POST /api/auth/login`
- ✅ Signup API: `POST /api/auth/signup`
- ✅ Frontend auth context uses real API calls

### User Management
- ✅ Get all users: `GET /api/users`
- ✅ Create user: `POST /api/users`
- ✅ Update user: `PUT /api/users/:id`
- ✅ Delete user: `DELETE /api/users/:id`
- ✅ Frontend dashboard uses real API calls

### Features
- ✅ Real-time data from PostgreSQL database
- ✅ Redis caching for improved performance
- ✅ Error handling and loading states
- ✅ Form validation with Zod
- ✅ Toast notifications for user feedback

## 🧪 Testing the Connection

### 1. Test Authentication
1. Open `http://localhost:5173`
2. Click "Sign Up" and create a new account
3. Or use existing users from the database:
   - Email: `john.doe@example.com` (any password)
   - Email: `jane.smith@example.com` (any password)
   - Email: `bob.johnson@example.com` (any password)

### 2. Test User Management
1. Login to the dashboard
2. View all users from the database
3. Add new users
4. Edit existing users
5. Delete users

### 3. Test API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password"}'
```

## 🔧 Troubleshooting

### Backend Issues
1. Check if Docker containers are running:
   ```bash
   docker-compose ps
   ```

2. View backend logs:
   ```bash
   cd backend
   yarn docker:logs
   ```

3. Restart services:
   ```bash
   cd backend
   yarn docker:restart
   ```

### Frontend Issues
1. Check if API URL is correct in `.env`
2. Check browser console for errors
3. Verify backend is running on port 3000

### Database Issues
1. Check PostgreSQL connection:
   ```bash
   docker-compose logs postgres
   ```

2. Reset database:
   ```bash
   cd backend
   yarn docker:down
   yarn docker:up
   ```

## 📝 Notes

- The authentication is simplified for demo purposes
- In production, implement proper password hashing and JWT tokens
- The current setup uses localStorage for session persistence
- All API calls include proper error handling and loading states 