# Dog Behavior & Training Coach - Frontend

A modern React frontend for a Django-powered AI platform that provides dog training and behavior guidance.

## 🎯 Features

- **User Authentication**: Sign up and sign in with JWT token storage
- **Chat Interface**: ChatGPT-style UI for conversations with the AI coach
- **Conversation History**: View and manage past training conversations
- **Redux State Management**: Centralized state with Redux Toolkit
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly interface
- **Dog Behavior Focused**: AI constrained to dog training only (no vet advice or other pets)

## 📋 Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **State Management**: Redux Toolkit with Async Thunk
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with JWT interceptors
- **Routing**: React Router v6
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm 7+
- (Optional) A running Django backend at `http://localhost:8000`
- **Note**: The app works WITHOUT a backend using mock data!

### Installation

```bash
# Install dependencies
npm install

# Create .env file (optional, defaults to localhost)
cp .env.example .env.local
```

### Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000` with hot module reloading enabled.

## 🧪 Testing WITHOUT Backend (Mock API)

The app includes **built-in dummy data** so you can test it immediately **without needing a backend**!

### Test Accounts (Pre-loaded in mock data):

```
Email: demo@example.com
Password: demo123

OR

Email: test@example.com
Password: test123
```

### Enable Mock API

The mock API is **already enabled by default**. To confirm, check `.env.local`:

```env
VITE_USE_MOCK_API=true
```

### What's Included in Mock Data

- ✅ Pre-created accounts
- ✅ Sample conversations about dog training
- ✅ AI responses about: sit command, jumping, recall, leash manners, house training
- ✅ Full chat functionality

### Switch Back to Real Backend

When your Django backend is ready:

```env
# In .env.local
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:8000/api/v1
```

Then restart: `npm run dev`

### Build for Production

```bash
npm run build
```

Compiled files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ConversationItem.tsx   # Sidebar conversation item
│   ├── EmptyState.tsx         # Empty chat state UI
│   ├── FormComponent.tsx       # Message input form
│   ├── Message.tsx            # Individual message bubble
│   └── Sidebar.tsx            # Navigation sidebar
├── features/
│   ├── auth/           # Authentication feature
│   └── chat/           # Chat feature
├── pages/              # Page components
│   ├── HomeScreen.tsx  # Main chat interface
│   ├── SignIn.tsx      # Sign in page
│   └── SignUp.tsx      # Sign up page
├── services/
│   └── api.ts         # Axios configuration with JWT interceptor
├── store/             # Redux configuration
│   ├── authSlice.ts   # Auth state management
│   ├── chatSlice.ts   # Chat state management
│   └── index.ts       # Store configuration
├── utils/            # Utility functions
├── App.tsx           # Root app component with routing
├── index.tsx         # React entry point
└── index.css         # Global styles with Tailwind
```

## 🔐 Authentication Flow

1. User signs up/signs in at `/signup` or `/signin`
2. Backend returns JWT token
3. Token is stored in `localStorage` as `'token'`
4. Axios interceptor automatically attaches token to all requests
5. On 401 response, user is redirected to `/signin`
6. Email/password authentication

## 💬 Chat & Conversation API

### Data Structure

```typescript
interface Conversation {
  _id: string;              // Unique ID
  title: string;            // Auto-generated from first message
  user: string;             // User ID
  messages: Message[];      // Chat history
  createdAt?: string;       // ISO timestamp
  updatedAt?: string;       // ISO timestamp
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}
```

### API Endpoints Used

- `POST /api/v1/auth/signup/` - Register new user
- `POST /api/v1/auth/signin/` - Login user
- `POST /api/v1/conversation/` - Create new conversation
- `GET /api/v1/conversations/` - List user's conversations
- `GET /api/v1/conversations/<id>/` - Fetch specific conversation
- `POST /api/v1/conversation/<id>/` - Send message to conversation

## 📛 API Testing Guide (For Teachers/Evaluators)

### Easy Testing with Mock API

**No backend required!** Use the built-in mock API to test everything:

1. Run `npm run dev`
2. Go to `http://localhost:3000`
3. Sign in with:
   - Email: `demo@example.com`
   - Password: `demo123`

Mock API responds to these keywords:
- "sit" → Sit command training guide
- "jump" → Jumping behavior solution
- "recall" → Come command training
- "leash" → Leash training tips
- "house" → House training guide
- "aggression" → Aggression warning
- "socializatio**n**" → Puppy socialization guide

### Testing with Real Backend (Django)

When backend is running, create a test user via signup:

```bash
POST http://localhost:8000/api/v1/auth/signup/
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "testpass123"
}
```

Response should include JWT token:
```json
{
  "token": "eyJhbGci0...",
  "user": {"id": "1", "email": "test@example.com", "username": "testuser"}
}
```

Then test other endpoints with the token in Authorization header:

```bash
GET http://localhost:8000/api/v1/conversations/

Headers:
Authorization: Bearer eyJhbGci0...

## 🔌 API Configuration

The API base URL can be configured using environment variables:

### Using Real Backend
```bash
# .env.local
VITE_USE_MOCK_API=false
VITE_API_URL=http://your-backend-url:8000/api/v1
```

### Using Mock API (Default - No Backend Needed)
```bash
# .env.local
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:8000/api/v1  # not used when mock is enabled
```

The app will automatically use the mock API if `VITE_USE_MOCK_API=true`

## 🐕 Dog Behavior Constraint

The frontend includes a system instruction in message payloads:

```
"You are a Dog Behavior & Training Coach. You MUST NOT give veterinary advice or discuss other pets. Focus only on dog training and behavior."
```

This constraint is sent with every message to the backend API.

## 📦 Redux Store

### Auth Slice
- State: user, token, loading, error, isAuthenticated
- Actions: `signUp`, `signIn`, `logout`
- Async Thunks: `signUp()`, `signIn()`

### Chat Slice
- State: conversations[], currentConversation, loading, error
- Actions: `setCurrentConversation`, `clearCurrentConversation`
- Async Thunks: `fetchConversations()`, `fetchConversation()`, `createConversation()`, `sendMessage()`

## 🎨 Component Hierarchy

```
App (with routing)
├── PrivateRoute (auth guard)
│   └── HomeScreen
│       ├── Sidebar
│       │   └── ConversationItem[]
│       ├── EmptyState (when no conversation selected)
│       └── FormComponent
└── SignIn/SignUp pages
```

## 🔄 Redux Data Flow

1. **Sign In**
   - FormComponent → signIn thunk → authSlice update → localStorage token
   - Axios interceptor now includes token

2. **Create Conversation**
   - FormComponent → createConversation thunk → chatSlice update
   - Conversation added to sidebar and set as current

3. **Fetch Conversations**
   - Sidebar mounts → fetchConversations thunk → chatSlice conversations[]

## ⚙️ TypeScript

Full TypeScript support with strict mode enabled:

- All components are typed
- Redux selectors typed with `RootState`
- API payloads validated with types
- `tsconfig.json` with strict mode

## 🐛 Error Handling

- Auth errors display in red alert boxes
- Chat errors are caught and logged
- Network errors trigger 401 redirect to sign in
- Form validation (e.g., password confirmation)

## 📝 Git Commits

Example professional commits:

```bash
git add .
git commit -m "feat: implement Redux toolkit for auth and persistent localStorage tokens"
git commit -m "feat: create ChatGPT-style UI with sidebar and message history"
git commit -m "feat: add dog behavior constraints to API requests"
git commit -m "fix: handle JWT token refresh and 401 errors"
```

## 🚦 Development Workflow

1. Run `npm run dev` to start dev server
2. Make changes (file watchers auto-reload)
3. Check console for TypeScript/eslint errors
4. Test in browser at `http://localhost:3000`
5. Commit with descriptive messages

## 🌐 Deployment

```bash
# Build production bundle
npm run build

# Test production build locally
npm run preview

# Deploy dist/ folder to hosting
# - Vercel: `vercel --prod`
# - Netlify: drag & drop dist/ folder
# - Docker: see Dockerfile.example
```

## 🔒 Environment Variables

Create `.env.local` in project root:

```env
# Backend API URL (optional, defaults to localhost:8000)
REACT_APP_API_URL=http://your-backend:8000/api/v1
```

## 📚 Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios Docs](https://axios-http.com/)
- [Vite Docs](https://vitejs.dev/)

## 📄 License

ISC

---

**Note**: This frontend is designed to work with a Django backend. The `signUp`, `signIn`, and conversation endpoints should return JWT tokens and conversation data matching the types defined in `src/store/chatSlice.ts`.
