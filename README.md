# BharatAI 🇮🇳

**AI-Powered Digital Welfare Copilot for India**

> **Description:** BharatAI matches Indian citizens to local and national government welfare schemes using intelligent TF-IDF profile vectorization and Large Language Model (LLM) verification layers. Designed to bridge the information gap in welfare distribution.
> 
> **Topics:** `react`, `vite`, `nodejs`, `express`, `mongodb`, `python`, `tfidf`, `llm`, `gemma`, `openrouter`, `govtech`, `welfare-schemes`, `hackathon`

---

## 📸 Hero Preview

![BharatAI Hero Dashboard](https://placehold.co/1200x600/1e293b/ffffff?text=BharatAI+Digital+Welfare+Copilot+Dashboard)
*Figure 1: Citizen dashboard displaying matched schemes, eligibility check visualizations, and the AI welfare copilot.*

---

## 🚀 Key Features

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

## AI Implementation

The AI capabilities in BharatAI are powered by a dual-layered approach to ensure both precision and natural language understanding:

1. **Recommendation Engine (TF-IDF)**:
   - A Python-based service uses TF-IDF vectorization and cosine similarity to match user profiles against scheme eligibility criteria.
   - Extracts key features like age, gender, category, state, and occupation to compute a relevance score for each scheme.

2. **LLM Verification & Chat (OpenRouter / `google/gemma-4-31b-it:free`)**:
   - The top recommendations are verified using an LLM to explain *why* the user is eligible, generating a "reasoning" layer.
   - A Multi-turn AI Assistant is implemented to allow users to ask follow-up questions, query specific details about schemes, and get help with the application process. It uses context from the user's profile and recommended schemes to provide personalized answers.

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

## ⏱️ 60-Second Demo Flow

Follow these simple steps to witness the core features of BharatAI:

1. **User Sign-Up & Log-in (10s)**: Register a new citizen account and log in.
2. **Citizen Profile Construction (15s)**: Navigate to the **Profile** wizard. Enter matching parameters: `State: Maharashtra`, `Occupation: Farmer`, `Annual Income: 50,000`, `Category: SC`, `Gender: Male`. Submit the wizard.
3. **Personalized Scheme Matching (15s)**: Instantly receive a prioritized list of schemes (e.g., *PM-Kisan*). Hover/click the scheme to see clear AI reasoning on why you matched or missed.
4. **Compare Schemes (10s)**: Bookmark 2-3 matched schemes and navigate to the **Saved Schemes** page. Use the side-by-side **Comparison Matrix** to compare benefit amounts and criteria.
5. **Interactive Copilot Chat (10s)**: Head to the **AI Assistant** tab. Ask: *"What documents are needed to apply for the PM-Kisan scheme?"*. Receive real-time, context-aware instructions immediately.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose
- **Recommendation Engine:** TF-IDF Cosine Similarity + LLM (Gemma-4-31b-it via OpenRouter)

---

> ℹ️ *This project is actively maintained and updated for hackathon showcases and real-world deployment evaluation.*
