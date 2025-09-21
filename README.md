# CodeCrafter - AI-Powered Code Generation Platform

A beautiful, modern web application that uses AI to generate code based on natural language prompts. Features Google OAuth authentication, PostgreSQL database integration, and a stunning UI.

## Features

✨ **AI Code Generation**: Generate code in multiple programming languages using OpenAI GPT-4
🔐 **Google OAuth Authentication**: Secure login with Google accounts
💾 **PostgreSQL Database**: Persistent storage for users and code generations
🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS and Radix UI
📱 **Mobile Responsive**: Works perfectly on all device sizes
⚡ **Real-time Updates**: Live code generation with progress indicators

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Query** for data fetching
- **Wouter** for routing
- **Vite** for fast development

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Passport.js** for authentication
- **Express Session** for session management
- **OpenAI API** for code generation

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google OAuth credentials
- OpenAI API key

### 1. Clone and Install

```bash
git clone <repository-url>
cd CodeCrafter
npm install
```

### 2. Environment Setup

Copy the `.env` file and update with your credentials:

```bash
# OpenAI Configuration
OPENAI_API_KEY="your-openai-api-key"

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/codecrafter"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Session Configuration
SESSION_SECRET="your-super-secret-session-key-change-this-in-production"
```

### 3. Database Setup

```bash
# Push database schema
npm run db:push
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### 5. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add it to your `.env` file

### 6. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

### Users Table
- `id` - Primary key (UUID)
- `email` - User email (unique)
- `name` - User display name
- `avatar` - Profile picture URL
- `googleId` - Google OAuth ID
- `isActive` - Account status
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Sessions Table
- `id` - Session ID
- `userId` - Foreign key to users
- `expiresAt` - Session expiration
- `createdAt` - Session creation timestamp

### Code Generations Table
- `id` - Primary key (UUID)
- `userId` - Foreign key to users (optional)
- `prompt` - User input prompt
- `language` - Programming language
- `framework` - Framework (optional)
- `generatedCode` - Generated code files (JSON)
- `explanation` - AI explanation
- `createdAt` - Generation timestamp

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout user
- `GET /api/user` - Get current user

### Code Generation
- `POST /api/generate` - Generate code (authenticated)
- `GET /api/generations` - Get user's generations (authenticated)
- `GET /api/generations/:id` - Get specific generation (authenticated)

## Development

### Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility functions
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express application
│   ├── services/          # Business logic
│   ├── routes.ts          # API routes
│   ├── auth.ts           # Authentication setup
│   ├── db.ts             # Database connection
│   └── storage.ts        # Data access layer
├── shared/               # Shared types and schemas
└── migrations/           # Database migrations
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema

## Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `NODE_ENV=production`
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `OPENAI_API_KEY` - OpenAI API key
- `SESSION_SECRET` - Strong session secret

### Database Migration

For production deployment, run:

```bash
npm run db:push
```

## Security Features

- 🔒 **Secure Authentication**: Google OAuth 2.0
- 🛡️ **Session Management**: Secure session handling
- 🔐 **Environment Variables**: Sensitive data protection
- 🚫 **Route Protection**: Authenticated endpoints
- 🔑 **CSRF Protection**: Built-in security measures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.