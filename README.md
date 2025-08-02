# React-NestJS-UserManagement-CRUD

A full-stack authentication and user management application built with React, NestJS, and PostgreSQL.

## 🚀 Features

- **🔐 Complete Authentication System** - Login, signup, and session management
- **👥 User Management Dashboard** - Full CRUD operations with analytics
- **🎨 Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **📊 Real-time Statistics** - User analytics and insights
- **🔒 Secure API** - JWT authentication with validation
- **🗄️ PostgreSQL Database** - Robust data persistence
- **🐳 Docker Support** - Easy development and deployment
- **📚 API Documentation** - Interactive Swagger docs
- **⚡ TypeScript** - Full type safety across the stack

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher)
- Yarn package manager

## 🚀 Quick Start

### 1. Start Backend Services

```bash
cd backend

# Start all services (recommended for first time)
./scripts/start.sh

# Or start specific services
./scripts/start.sh --backend-only     # Only NestJS API
./scripts/start.sh --postgres-only    # Only database
./scripts/start.sh --pgadmin-only     # Only pgAdmin
```

### 2. Start Frontend

```bash
cd frontend
yarn dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8080
- **API Docs**: http://localhost:8080/api
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)

## 🔧 Development Commands

### Backend Management

```bash
cd backend

# Start services with different options
./scripts/start.sh                    # Start all services
./scripts/start.sh --backend-only     # Start only backend
./scripts/start.sh --postgres-only    # Start only database
./scripts/start.sh --pgadmin-only     # Start only pgAdmin

# Rebuild services
./scripts/start.sh --rebuild-backend  # Rebuild backend only
./scripts/start.sh --rebuild-postgres # Rebuild database only
./scripts/start.sh --rebuild-pgadmin  # Rebuild pgAdmin only
./scripts/start.sh --rebuild          # Rebuild everything

# Test API endpoints
./scripts/test-api.sh

# Clean up Docker resources
./scripts/cleanup.sh

# Show help
./scripts/start.sh --help
```

### Frontend Development

```bash
cd frontend

yarn dev          # Start development server
yarn build        # Build for production
yarn lint         # Run ESLint
yarn lint:fix     # Fix linting issues
yarn format       # Format code with Prettier
yarn type-check   # TypeScript type checking
```

## 🏗️ Project Structure

```
React-Node-LoginApp/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management module
│   │   └── main.ts         # Application entry point
│   ├── scripts/            # Development scripts
│   ├── docker-compose.yml  # Docker services
│   └── README.md           # Backend documentation
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🔐 Authentication Flow

1. **Sign Up**: Create a new account with email and password
2. **Login**: Authenticate with credentials
3. **Dashboard**: Access user management features
4. **Session Management**: Automatic session persistence
5. **Logout**: Secure session termination

## 👥 User Management Features

- **📊 Dashboard Analytics**: Total users, new users, recent activity
- **➕ Create Users**: Add new users with validation
- **📖 Read Users**: View all users in responsive table
- **✏️ Update Users**: Edit user information
- **🗑️ Delete Users**: Remove users with confirmation
- **🔍 Search & Filter**: Find users quickly
- **📱 Responsive Design**: Works on all devices

## 🐳 Docker Services

The application uses Docker Compose with the following services:

- **backend**: NestJS API server (port 8080)
- **postgres**: PostgreSQL database (port 5432)
- **pgadmin**: Database management interface (port 5050)

## 🔧 Configuration

### Environment Variables

Copy the example environment file and configure:

```bash
cd backend
cp env.example .env
```

Key configuration options:
- Database connection settings
- JWT secret and expiration
- Application port and environment

### Database Setup

The database is automatically initialized on first startup:
- Database: `test_db`
- Username: `postgres`
- Password: `password`

## 🧪 Testing

### API Testing

```bash
cd backend
./scripts/test-api.sh
```

### Manual Testing

```bash
# Test user creation
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "age": 30,
    "isActive": true
  }'

# Test user retrieval
curl http://localhost:8080/users
```

## 🚨 Troubleshooting

### Common Issues

**Backend not starting:**
```bash
# Check if ports are available
lsof -i :8080
lsof -i :5432
lsof -i :5050

# Rebuild backend
./scripts/start.sh --rebuild-backend
```

**Database connection issues:**
```bash
# Check database status
docker-compose ps

# Restart database
./scripts/start.sh --rebuild-postgres
```

**Frontend not connecting to API:**
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API service configuration in frontend

### Useful Commands

```bash
# View service logs
docker-compose logs -f [service_name]

# Check service status
docker-compose ps

# Access database
docker exec -it postgres psql -U postgres -d test_db

# Clean up everything
./scripts/cleanup.sh
```

## 📚 Documentation

- **[Backend README](./backend/README.md)** - Detailed backend documentation
- **[Frontend README](./frontend/README.md)** - Frontend development guide
- **[API Documentation](http://localhost:8080/api)** - Interactive Swagger docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 