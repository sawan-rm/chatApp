# AI-Powered Collaborative Code Editor

## Overview
This is a full-stack MERN (MongoDB, Express, React, Node.js) application that provides a collaborative code editor with AI assistance. Users can create projects, collaborate in real-time with other developers, and get AI-powered code suggestions using Google's Generative AI.

## Project Architecture

### Tech Stack
- **Frontend**: React + Vite, TailwindCSS, Socket.IO Client, WebContainer API
- **Backend**: Node.js + Express, Socket.IO Server, MongoDB (Mongoose), Redis, Google Generative AI
- **Database**: MongoDB (for user and project data)
- **Cache**: Redis (local instance for session management)
- **AI**: Google Generative AI (Gemini 1.5 Flash)

### Key Features
- User authentication (login/register with JWT)
- Project creation and management
- Real-time collaborative editing with Socket.IO
- AI-powered code assistance (triggered with @ai mentions)
- WebContainer integration for in-browser code execution
- Multi-user project collaboration

## Project Structure

```
.
├── backend/
│   ├── controllers/     # Request handlers
│   ├── db/             # Database connection
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic (AI, Redis, etc)
│   ├── app.js          # Express app setup
│   └── server.js       # HTTP server + Socket.IO setup
├── frontend/
│   ├── src/
│   │   ├── auth/       # Authentication components
│   │   ├── config/     # Axios, Socket, WebContainer config
│   │   ├── context/    # React context (User)
│   │   ├── routes/     # React Router setup
│   │   └── screens/    # Page components
│   └── vite.config.js  # Vite configuration
└── replit.md          # This file
```

## Environment Setup

### Required Secrets (Already Configured)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `GOOGLE_AI_KEY` - Google Generative AI API key
- `REDIS_HOST` - Redis host (configured for local: localhost)
- `REDIS_PORT` - Redis port (configured for local: 6379)
- `REDIS_PASSWORD` - Redis password (not used for local instance)

### Configuration Files
- `backend/.env` - Backend environment variables (PORT, NODE_ENV)
- `frontend/.env` - Frontend environment variables (VITE_API_URL)

## Running the Application

The application uses two workflows:

1. **Backend Workflow**: 
   - Starts Redis server locally
   - Runs the Node.js backend on port 3000
   - Handles API requests and Socket.IO connections

2. **Frontend Workflow**:
   - Runs Vite dev server on port 5000
   - Serves the React application
   - Configured to allow all hosts for Replit proxy compatibility

Both workflows start automatically. The frontend is accessible via the webview.

## API Endpoints

### User Routes (`/users`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (authenticated)
- `GET /logout` - Logout user
- `GET /all` - Get all users (for collaboration)

### Project Routes (`/projects`)
- `POST /create` - Create new project
- `GET /all` - Get all user projects
- `GET /get-project/:projectId` - Get specific project
- `PUT /add-user` - Add collaborators to project
- `GET /get-file/:fileId` - Get file content
- `PUT /update-file-tree` - Update project file tree

### AI Routes (`/ai`)
- `POST /get-result` - Get AI-generated code/response

## Real-time Features

### Socket.IO Events
- `connection` - User connects to project room
- `project-message` - Send/receive messages in project
- `@ai` mentions - Trigger AI assistance in chat
- `disconnect` - User leaves project room

## Development Notes

### Replit-Specific Configuration
- **Frontend**: Configured to run on `0.0.0.0:5000` with `allowedHosts: true` to work with Replit's iframe proxy
- **Backend**: Runs on `localhost:3000` to avoid port conflicts
- **Redis**: Running locally on `localhost:6379` (no remote Redis required)
- **CORS**: Backend allows all origins for development

### Recent Changes (Oct 26, 2025)
- Installed Node.js 20 runtime
- Installed Redis system package for local caching
- Fixed import path case-sensitivity issue (`webcontainer` → `webContainer`)
- Configured Vite for Replit environment (host, port, allowedHosts)
- Set up environment files for both frontend and backend
- Created workflows for automatic startup

## User Preferences
None specified yet.

## Deployment

Deployment is configured for Replit's VM deployment target:
- **Type**: VM (stateful, always-on for WebSocket support)
- **Build**: Installs dependencies for both frontend and backend
- **Run**: Starts Redis, backend server, builds frontend, and serves production build

To deploy, click the "Deploy" button in Replit.

## Troubleshooting

### Frontend not loading
- Ensure Vite config has `allowedHosts: true`
- Verify port 5000 is not in use
- Check browser console for errors

### Backend connection issues
- Verify MongoDB connection string is correct
- Check Redis is running locally (`redis-cli ping` should return PONG)
- Ensure JWT_SECRET is set

### Socket.IO not connecting
- Check backend is running on port 3000
- Verify CORS settings allow your frontend origin
- Check browser console for WebSocket errors

## License
ISC
