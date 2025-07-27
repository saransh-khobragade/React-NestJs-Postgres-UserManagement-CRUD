# Node.js TypeScript API with PostgreSQL and Redis

A modern Node.js TypeScript API with PostgreSQL database and Redis caching, containerized with Docker Compose.

## 🚀 Features

- **TypeScript** - Full TypeScript support with strict type checking
- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Robust relational database
- **Redis** - High-performance caching layer
- **Docker Compose** - Easy development and deployment
- **CRUD Operations** - Complete user management API
- **Caching** - Intelligent Redis caching for improved performance
- **Health Checks** - Built-in health monitoring
- **ESLint & Prettier** - Code quality and formatting
- **Console Logging** - Simple and efficient logging system

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Yarn package manager

## 🛠️ Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Node-typescript-postgres-redis-2025
   ```

2. **Start all services**

   ```bash
   yarn docker:up
   # or
   docker-compose up -d
   ```

3. **Access the API**
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Local Development

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Start PostgreSQL and Redis with Docker**

   ```bash
   docker-compose up postgres redis -d
   ```

3. **Run the development server**
   ```bash
   yarn dev
   ```

## 🐳 Docker Commands

```bash
# Build and start all services
yarn docker:up

# Start services in background
docker-compose up -d

# View logs
yarn docker:logs

# Stop all services
yarn docker:down

# Restart services
yarn docker:restart

# Rebuild containers
yarn docker:build
```

## 📚 API Endpoints

### Health Check

```http
GET /health
```

### Users API

#### Get All Users

```http
GET /api/users
```

#### Get User by ID

```http
GET /api/users/:id
```

#### Create User

```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

#### Update User

```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Delete User

```http
DELETE /api/users/:id
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/node_api_db

# Redis
REDIS_URL=redis://localhost:6379
```

### Docker Environment

The Docker Compose setup automatically configures:

- PostgreSQL database with sample data
- Redis cache server
- Network connectivity between services
- Health checks for all services

## 🏗️ Project Structure

```
├── src/
│   ├── services/
│   │   ├── database.ts    # PostgreSQL operations
│   │   ├── cache.ts       # Redis operations
│   │   └── logger.ts      # Console-based logging
│   ├── routes/
│   │   ├── index.ts       # Main routes
│   │   └── userRoutes.ts  # User API routes
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   └── server.ts          # Main server file
├── docker-compose.yml     # Docker services configuration
├── Dockerfile            # Node.js application container
├── init.sql             # Database initialization script
├── eslint.config.js     # ESLint configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 📝 Logging

The application uses a simple console-based logging system with the following levels:

- `logger.error()` - For error messages
- `logger.warn()` - For warning messages
- `logger.info()` - For informational messages
- `logger.http()` - For HTTP request logging
- `logger.debug()` - For debug messages

Each log entry includes a timestamp and appropriate console method (error, warn, info, etc.).

## 🧪 Testing the API

### Using curl

1. **Get all users**

   ```bash
   curl http://localhost:3000/api/users
   ```

2. **Create a user**

   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Jane Doe", "email": "jane.doe@example.com"}'
   ```

3. **Get user by ID**

   ```bash
   curl http://localhost:3000/api/users/1
   ```

4. **Update user**

   ```bash
   curl -X PUT http://localhost:3000/api/users/1 \
     -H "Content-Type: application/json" \
     -d '{"name": "Jane Updated", "email": "jane.updated@example.com"}'
   ```

5. **Delete user**
   ```bash
   curl -X DELETE http://localhost:3000/api/users/1
   ```

### Using Postman

Import the following collection:

```json
{
  "info": {
    "name": "Node.js API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/health"
      }
    },
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/users"
      }
    },
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/users",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@example.com\"\n}"
        }
      }
    }
  ]
}
```

## 🔍 Monitoring

### Health Check Response

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": true,
    "redis": true
  }
}
```

### Logs

```bash
# View application logs
docker-compose logs api

# View database logs
docker-compose logs postgres

# View Redis logs
docker-compose logs redis
```

## 🚀 Production Deployment

For production deployment:

1. **Update environment variables**

   ```env
   NODE_ENV=production
   DATABASE_URL=your_production_db_url
   REDIS_URL=your_production_redis_url
   ```

2. **Use production Docker Compose**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy (nginx)**
4. **Configure SSL certificates**
5. **Set up monitoring and logging**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Check what's using the port
   lsof -i :3000

   # Kill the process or change the port in docker-compose.yml
   ```

2. **Database connection failed**

   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres

   # View database logs
   docker-compose logs postgres
   ```

3. **Redis connection failed**

   ```bash
   # Check if Redis is running
   docker-compose ps redis

   # View Redis logs
   docker-compose logs redis
   ```

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up --build
```
