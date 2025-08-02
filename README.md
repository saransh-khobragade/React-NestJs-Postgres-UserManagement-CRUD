# React-Node-LoginApp

A full-stack authentication and user management application built with React, NestJS, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (v18 or higher)
- Yarn package manager

### 1. Start the Backend (Database + API)

```bash
cd backend
./scripts/start.sh
```

This starts:
- PostgreSQL database on port 5432
- NestJS API on port 8080
- pgAdmin (database management) on port 5050

### 2. Start the Frontend

```bash
cd frontend
yarn dev
```

The React app will run on `http://localhost:5173`

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8080
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)

## 🧪 Test the App

1. **Sign Up**: Create a new account with name, email, password, and optional age
2. **Login**: Use your credentials to access the dashboard
3. **User Management**: View, create, edit, and delete users
4. **API Testing**: Use the provided test scripts in `backend/scripts/`

## 🔧 Troubleshooting

### Backend Issues
```bash
cd backend
# View logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild containers
./scripts/start.sh --rebuild
```

### Frontend Issues
```bash
cd frontend
# Clear dependencies and reinstall
rm -rf node_modules yarn.lock
yarn install
yarn dev
```

## 📁 Project Structure

```
React-Node-LoginApp/
├── backend/          # NestJS API with PostgreSQL
├── frontend/         # React app with TypeScript
└── README.md
```

## 🛠️ Development

- **Backend**: NestJS with TypeORM, PostgreSQL, Docker
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Authentication**: Custom auth system with age support
- **Database**: PostgreSQL with pgAdmin for management 