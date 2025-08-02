# NestJS CRUD API with PostgreSQL

A complete CRUD API application built with NestJS, PostgreSQL, and Docker Compose.

## 🚀 Features

- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **PostgreSQL Database**: Robust relational database with TypeORM
- **Docker Compose**: Easy development and deployment setup
- **Swagger Documentation**: Interactive API documentation
- **Input Validation**: Request validation using class-validator
- **TypeScript**: Full type safety throughout the application
- **User Management**: Complete CRUD operations for users
- **pgAdmin**: Web-based database management interface
- **Automatic Database Setup**: PostgreSQL initialization handled automatically

## 📋 Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker and Docker Compose

## ⚡ Quick Start

### Start Everything (Recommended)

```bash
# Start all services (PostgreSQL, NestJS App, pgAdmin)
./scripts/start.sh
```

This will start:
- **NestJS API** at http://localhost:3000
- **Swagger Docs** at http://localhost:3000/api
- **pgAdmin** at http://localhost:5050
- **PostgreSQL** on port 5432

### Manual Start

```bash
# Start with Docker Compose
docker-compose up -d

# Start the application
yarn start:dev
```

## 🗄️ Database Management

### pgAdmin Web Interface
- **URL**: http://localhost:5050
- **Email**: admin@admin.com
- **Password**: admin

### Database Connection Details
- **Host**: postgres (or localhost)
- **Port**: 5432
- **Database**: test_db
- **Username**: postgres
- **Password**: password

### Quick Database Commands
```bash
# View all tables
docker exec -it postgres psql -U postgres -d test_db -c "\dt"

# View users
docker exec -it postgres psql -U postgres -d test_db -c "SELECT * FROM users;"



# Check database status
docker exec -it postgres psql -U postgres -c "\l"
```

### Database Initialization
The `test_db` database is automatically created when the PostgreSQL container starts for the first time using:
- **Environment variable**: `POSTGRES_DB: test_db`
- **Init script**: `init.sql` (runs automatically on first startup)

No manual database initialization is needed!

## 🔌 API Endpoints

### Users
- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user



### Health & Documentation
- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api` - Swagger documentation

## 🧪 Testing

### Test All APIs
```bash
./scripts/test-api.sh
```

### Manual Testing Examples
```bash
# Create a user
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "age": 30,
    "isActive": true
  }'


```

## 🛠️ Development

### Available Scripts
```bash
yarn start:dev    # Start in development mode
yarn build        # Build the application
yarn start:prod   # Start in production mode
yarn test         # Run tests
yarn test:watch   # Run tests in watch mode
yarn test:cov     # Run tests with coverage
yarn test:e2e     # Run end-to-end tests
yarn lint         # Run ESLint
yarn format       # Format code with Prettier
```

### Environment Variables
Copy `env.example` to `.env` and configure:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=test_db
DATABASE_USER=postgres
DATABASE_PASSWORD=password

# Application Configuration
NODE_ENV=development
PORT=8080

# JWT Configuration (for future use)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Remove volumes (will delete database data)
docker-compose down -v

# Clean up everything
./scripts/cleanup.sh
```

## 🔧 Scripts

### Start Script with Rebuild Options
```bash
# Normal start
./scripts/start.sh

# Rebuild specific containers
./scripts/start.sh --rebuild-backend   # Rebuild NestJS app only
./scripts/start.sh --rebuild-postgres  # Rebuild PostgreSQL only
./scripts/start.sh --rebuild-pgadmin   # Rebuild pgAdmin only

# Rebuild everything
./scripts/start.sh --rebuild

# Show help
./scripts/start.sh --help
```

### Other Scripts
- `./scripts/test-api.sh` - Test all API endpoints
- `./scripts/cleanup.sh` - Clean up all Docker resources

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `firstName` (VARCHAR)
- `lastName` (VARCHAR)
- `email` (VARCHAR, Unique)
- `age` (INT, Optional)
- `isActive` (BOOLEAN)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)



## 📁 Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Main controller
├── users/                 # Users module
│   ├── user.entity.ts     # User database entity
│   ├── users.controller.ts # Users API endpoints
│   ├── users.service.ts   # Users business logic
│   ├── users.module.ts    # Users module definition
│   └── dto/               # Data Transfer Objects
│       ├── create-user.dto.ts
│       └── update-user.dto.ts

```

## 📚 Dependencies

### Core Dependencies
- **@nestjs/common**: NestJS core functionality
- **@nestjs/typeorm**: TypeORM integration for NestJS
- **@nestjs/swagger**: API documentation
- **typeorm**: ORM for database operations
- **pg**: PostgreSQL driver
- **class-validator**: Input validation
- **class-transformer**: Object transformation

### Development Dependencies
- **@nestjs/cli**: NestJS command line tools
- **@nestjs/testing**: Testing utilities
- **eslint**: Code linting
- **prettier**: Code formatting
- **jest**: Testing framework
- **typescript**: TypeScript compiler

## 🔍 Troubleshooting

### Common Issues

**Backend not connecting to database:**
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check database exists: `docker exec postgres psql -U postgres -c "\l"`
- Restart backend: `docker-compose restart backend`

**pgAdmin not showing servers:**
- Check servers.json configuration
- Restart pgAdmin: `docker-compose restart pgadmin`
- Verify PostgreSQL is accessible from pgAdmin container

**Port conflicts:**
- Check if ports 8080, 5432, or 5050 are in use
- Stop conflicting services or change ports in docker-compose.yml

### Useful Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Access PostgreSQL
docker exec -it postgres psql -U postgres -d test_db

# Rebuild specific service
./scripts/start.sh --rebuild-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 