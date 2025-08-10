# React-NestJS-UserManagement-CRUD

A full-stack authentication and user management application built with React, NestJS, and PostgreSQL.

## 🚀 Quick Start

### 1. Start Backend Services

```bash
cd backend
# Start Database/Postgres(Docker)
./scripts/start.sh --postgres-only 
# Start Database/Postgres UI(Docker)
./scripts/start.sh --pgadmin-only 

# Start Backend local
yarn start
# Start Backend(Docker)
./scripts/start.sh --backend-only 

# Start all services (recommended for first time)
./scripts/start.sh
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