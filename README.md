# TaskFlow - Collaborative Task Management Application

A production-ready full-stack task management application with real-time collaboration features, built with React, Node.js, PostgreSQL, and Socket.io.

## 🚀 Features

- **Secure Authentication**: JWT-based user registration and login
- **Task Management**: Full CRUD operations for tasks
- **Real-Time Collaboration**: Live updates using Socket.io
- **Task Assignment**: Assign tasks to team members with instant notifications
- **Advanced Filtering**: Filter and sort tasks by status, priority, due date, and more
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation on both frontend and backend
- **Comprehensive Testing**: Unit tests for critical components and services

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **TypeScript** - Type safety
- **PostgreSQL** + **Prisma ORM** - Database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Zod** - Request validation
- **Jest** - Testing framework

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Socket.io Client** - Real-time updates
- **Axios** - HTTP client
- **React Router** - Navigation
- **Vitest** - Testing framework

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd assignment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanagement?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm test
```

This runs 18 unit tests covering:
- Authentication service (9 tests)
- Task service (9 tests)

### Frontend Tests

```bash
cd frontend
npm test
```

This runs 11 unit tests covering:
- TaskCard component (6 tests)
- useAuth hook (5 tests)

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/users` - Get all users (protected)

### Tasks

- `GET /api/tasks` - Get all tasks with filters (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Query Parameters for GET /api/tasks

- `status` - Filter by status (TODO, IN_PROGRESS, DONE)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH)
- `assignedToId` - Filter by assigned user
- `sortBy` - Sort by field (createdAt, dueDate, priority, status)
- `sortOrder` - Sort order (asc, desc)
- `search` - Search in title and description

## 🔌 Real-Time Events

### Socket.io Events

- `task:created` - Emitted when a new task is created
- `task:updated` - Emitted when a task is updated
- `task:deleted` - Emitted when a task is deleted
- `task:assigned` - Emitted to assigned user when task is assigned

## 🏗️ Project Structure

```
assignment/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Create a new project on Railway or Render
2. Connect your GitHub repository
3. Set environment variables in the platform dashboard
4. Deploy the `backend` directory
5. Run migrations: `npm run prisma:migrate`

### Frontend Deployment (Vercel/Netlify)

1. Create a new project on Vercel or Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set environment variable: `VITE_API_URL=<your-backend-url>/api`
6. Deploy

## 📸 Screenshots

### Dashboard
![Dashboard with task statistics and filters]

### Task Management
![Task creation and editing interface]

### Real-Time Updates
![Live task updates across multiple users]

## 🎯 Key Features Implemented

### Architecture
- ✅ Clean separation of concerns (Controllers, Services, Repositories)
- ✅ DTO validation using Zod
- ✅ Comprehensive error handling
- ✅ Type-safe implementation with TypeScript

### Authentication
- ✅ Secure password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected routes and middleware
- ✅ Session management

### Real-Time Features
- ✅ Socket.io integration for live updates
- ✅ Task assignment notifications
- ✅ Automatic UI synchronization
- ✅ Connection authentication

### Testing
- ✅ 18 backend unit tests (Jest)
- ✅ 11 frontend unit tests (Vitest)
- ✅ Mocked dependencies for isolated testing
- ✅ Comprehensive test coverage

## 📝 Development Notes

### Database Schema

The application uses two main models:

**User**
- id, email, password, name
- Relationships: created tasks, assigned tasks

**Task**
- id, title, description, status, priority, dueDate
- Relationships: creator, assignee

### Security Considerations

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days (configurable)
- CORS is configured for specific origins
- All task operations check user authorization
- SQL injection prevention via Prisma ORM

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 👨‍💻 Author

Built as a Full-Stack Engineering Assessment

---

**Live Demo**: [Your deployment URL here]

**Repository**: [Your GitHub repository URL here]
