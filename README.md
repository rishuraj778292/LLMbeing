# LLMbeing - AI Freelancing Platform

A specialized freelancing platform focused exclusively on Artificial Intelligence projects. Connect businesses needing AI solutions with skilled AI freelancers.

## What is LLMbeing?

LLMbeing is a web platform where:
- **Clients** can post AI-related projects and hire AI specialists
- **Freelancers** with AI expertise can find projects and build their portfolio
- Both parties can communicate and collaborate on AI solutions

This platform is built specifically for AI work - no general freelancing, just artificial intelligence projects.

## Key Features

### For Clients
- Post AI projects with detailed requirements
- Browse AI freelancer profiles  
- Manage your posted projects
- Communicate with freelancers
- Role-based dashboard experience

### For AI Freelancers  
- Create detailed AI expertise profiles
- Browse and search AI projects
- Build and showcase your AI portfolio
- Apply to projects that match your skills
- Dedicated freelancer dashboard

### Platform Features
- **Role-based navigation** - Different experience for clients vs freelancers
- **User authentication** - Secure JWT-based login system
- **File uploads** - Portfolio images and project files via Cloudinary
- **Responsive design** - Works on desktop, tablet, and mobile
- **Real-time messaging** - Built-in communication system

## Technology Stack

### Frontend
- **React 19.0.0** - Latest React with modern features
- **Vite 6.2.0** - Fast build tool and dev server
- **Redux Toolkit 2.7.0** - State management
- **Tailwind CSS 4.1.4** - Modern CSS framework
- **React Router 7.5.0** - Client-side routing
- **Axios 1.8.4** - HTTP requests
- **Lucide React** - Icon library
- **Motion** - Animations

### Backend
- **Node.js + Express 5.1.0** - Server and API
- **MongoDB + Mongoose 8.13.2** - Database and ODM  
- **JWT 9.0.2** - Authentication tokens
- **bcrypt 5.1.1** - Password hashing
- **Cloudinary 2.6.0** - File storage
- **Socket.io 4.8.1** - Real-time messaging
- **Express Validator** - Input validation

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB database
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LLMbeing.git
   cd LLMbeing
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   touch .env
   # Add your MongoDB URL, JWT secret, and Cloudinary credentials
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend  
   npm install
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key  
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=3300
```

## How It Works

### Client Workflow
1. Register as a client
2. Complete your profile
3. Post an AI project with requirements and budget
4. Review proposals from AI freelancers
5. Hire and communicate with chosen freelancer

### Freelancer Workflow  
1. Register as an AI freelancer
2. Set up your AI expertise profile
3. Add portfolio items showcasing your AI work
4. Browse available AI projects
5. Submit proposals for projects you're interested in

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Projects
- `GET /api/projects/fetchProjects` - Get all projects with pagination
- `POST /api/projects/post` - Create new project (clients only)
- `GET /api/projects/fetchOwnproject` - Get your posted projects
- `PUT /api/projects/edit/:id` - Update project
- `DELETE /api/projects/delete/:id` - Delete project
- `GET /api/projects/fetchprojectdetails/:slug` - Get project details

### User Profiles
- `GET /api/profile/` - Get your profile
- `PUT /api/profile/update` - Update profile
- `POST /api/profile/upload` - Upload profile picture

## Project Structure

```
LLMbeing/
├── backend/
│   ├── controllers/     # API logic
│   ├── models/         # Database schemas  
│   ├── routes/         # API routes
│   ├── middleware/     # Auth, validation, etc.
│   └── utils/          # Helper functions
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/      # Page components
    │   ├── layout/     # Layout wrappers
    │   ├── Redux/      # State management
    │   └── utils/      # Helper functions
    └── public/         # Static assets
```

## Current Status

This is an active development project. Current features:
- ✅ User authentication and authorization
- ✅ Role-based access (client/freelancer)  
- ✅ Project posting and management
- ✅ User profiles with file uploads
- ✅ Responsive UI with modern design
- ✅ Basic messaging infrastructure
- 🚧 Advanced search and filtering
- � Application/proposal system
- � Payment integration
- 🚧 Real-time notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

</div>
