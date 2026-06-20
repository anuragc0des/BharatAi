# BharatAI

AI-Powered Digital Welfare Copilot for India

## What this MVP does

This prototype is a working version of BharatAI built for a hackathon demo. It includes:

- User authentication and protected routes
- User profile collection for Indian citizens (Read-only Dashboard + Edit Wizard)
- Personalized scheme recommendations powered by TF-IDF and LLMs (`google/gemma-4-31b-it:free` via OpenRouter)
- Ability to bookmark and save schemes to a dedicated "Saved Schemes" dashboard
- Missed-benefits insights and comparison features
- Scheme details pages with benefits, eligibility, documents, and application process
- Fully functional Multi-turn AI assistant with a WhatsApp-style UI and markdown rendering
- English / Hindi language support via translation keys
- Responsive, modern Tailwind UI with glassmorphism and intelligent routing

## End-to-end status

- Backend is running successfully on `http://localhost:5002`
- Backend health endpoint responds at `GET /api/health`
- Frontend builds successfully with `npm run build`
- Login and registration UI are implemented and wired to backend auth endpoints
- Auth state is stored locally and protected routes guard key pages
- Profile submission, recommendations, saved schemes, comparison, and eligibility visualization are available
- Port conflict was resolved by using backend port `5002` instead of `5000`

## Current application capabilities

### Frontend

- React + Vite application
- Tailwind CSS responsive styling
- React Router navigation across authenticated and public pages
- Pages included:
  - Landing Page
  - Login Page
  - Register Page
  - Dashboard
  - Profile Page
  - Recommendations Page
  - Schemes List Page
  - Scheme Details Page
  - Saved Schemes Page
  - Scheme Comparison Page
  - Missed Benefits Page
  - Eligibility Visualization Page
  - AI Assistant Page
- Language switcher for English and Hindi labels
- Profile form collects:
  - name
  - age
  - gender
  - state
  - education
  - occupation
  - annualIncome
  - category
  - studentStatus
  - farmerStatus
  - entrepreneurStatus
  - employmentStatus
- Login/register flows save token and user locally
- Protected routes prevent access until authenticated
- Recommendations display scheme cards and saved schemes

### Backend

- Node.js + Express API server
- MongoDB Atlas integration via Mongoose
- Collections:
  - `users`
  - `schemes`
  - `recommendations`
  - `conversations`
  - `authusers`
- API modules included:
  - Auth (`/api/auth`)
  - User (`/api/users`)
  - Scheme (`/api/schemes`)
  - Recommendation (`/api/recommendations`)
  - Chat (`/api/chat`)
  - Saved Schemes (`/api/saved-schemes`)
- Seeded demo schemes are inserted automatically on first run
- Advanced Python-based recommendation engine (`recommend.py`) using TF-IDF cosine similarity and an LLM verification layer via OpenRouter.

## Folder structure

### Root

- `Backend/`
- `Frontend/`
- `atlas-credentials.env` (Atlas connection helper)

### Backend

- `src/config/` - database config
- `src/controllers/` - route handlers
- `src/models/` - Mongoose schema definitions
- `src/routes/` - Express routers
- `src/services/` - helpers like scheme seeding
- `src/index.js` - server entrypoint

### Frontend

- `src/components/` - reusable UI components
- `src/context/` - language support context
- `src/hooks/` - helper hooks
- `src/pages/` - route pages
- `src/routes/` - app router
- `src/services/` - API client

## How to run locally

### Backend

1. Open terminal in `Backend/`
2. Create `.env` with:
   ```env
   MONGO_URI="<your atlas connection string>"
   ```
3. Install dependencies if needed:
   ```bash
   npm install
   ```
4. Start backend:
   ```bash
   npm run dev
   ```
5. Backend will run on `http://localhost:5002`

### Files and folders that should not be committed

- `atlas-credentials.env`
- `Backend/.env`
- `Frontend/.env`
- `Backend/node_modules/`
- `Frontend/node_modules/`
- `Backend/dist/` or any build output
- `Frontend/dist/` or any build output
- `.vscode/` local editor settings
- OS temp files like `.DS_Store`, `Thumbs.db`
- log files like `npm-debug.log*`, `yarn-debug.log*`, `pnpm-debug.log*`

> A root `.gitignore` has been added to exclude these files and folders from GitHub.

### Frontend

1. Open terminal in `Frontend/`
2. Install dependencies if needed:
   ```bash
   npm install
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```
4. Frontend will run on `http://localhost:5173`

## API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### User

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`

### Scheme

- `GET /api/schemes`
- `GET /api/schemes/:id`

### Recommendation

- `POST /api/recommendations` (body: `{ userId }`)
- `GET /api/recommendations/user/:userId`

### Saved Schemes

- `GET /api/saved-schemes`
- `POST /api/saved-schemes`
- `DELETE /api/saved-schemes/:schemeId`

### Chat

- `POST /api/chat`
- `GET /api/chat/:userId`

### Health

- `GET /api/health`

## Notes

- Backend is verified to run on port `5002` and respond at `/api/health`
- Frontend build completed successfully with `npm run build`
- Auth flows are connected through local token storage and protected routes
- Language support is implemented in `src/context/LanguageContext.jsx`

## Remaining work

- Add production-ready validation and error handling across forms
- Expand the seeded database with more central and state schemes
- Improve mobile responsiveness for complex data tables
- Add deployment-ready configuration and environment docs

## Quick demo flow

1. Run backend and frontend
2. Open the app in browser
3. Register or login
4. Submit a profile on the Profile page
5. View generated scheme recommendations
6. Save schemes and compare them
7. View eligibility insights and missed benefits
8. Use AI Assistant page to ask questions
