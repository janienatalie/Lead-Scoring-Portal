# Lead Scoring Portal

A modern full-stack application for lead scoring and management, built with Next.js 16 and MySQL. This portal helps businesses identify and prioritize high-potential leads using machine learning models (XGBoost). The application provides real-time lead analytics, customer details, prediction insights, and multi-language support for Indonesian and English markets.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [ML Pipeline](#ml-pipeline)
- [Database](#database)
- [Authentication](#authentication)
- [Internationalization (i18n)](#internationalization-i18n)
- [Theme System](#theme-system)
- [Styling](#styling)
- [Development](#development)
- [Build & Deployment](#build--deployment)

## ✨ Features

- **Lead Scoring**: ML-powered lead qualification using XGBoost models with probability thresholds
- **Predictive Insights**: Automatic lead potential classification (Hot/Warm/Cold)
- **Dashboard**: Real-time analytics with interactive charts (Recharts, Nivo, D3.js) showing lead distributions
- **Lead Details**: Comprehensive customer profiles with personal info, financial status, and campaign history
- **Anti-Spam Alerts**: Automatic detection and warnings for over-contacted prospects (>5 contacts)
- **Communication Tips**: Education-level based communication strategies for sales teams
- **Lead Management**: Filter, search, and manage leads by score and status
- **User Authentication**: Secure login with JWT tokens and bcrypt password hashing
- **Multi-language Support**: English (en) and Indonesian (id) dynamic language switching
- **Dark/Light Theme**: Persistent theme preference via Context API
- **PDF Export**: Generate and download lead reports as PDFs
- **Responsive Design**: Mobile-first interface with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS, PostCSS
- **Charts**: Recharts, Nivo, D3.js
- **UI Components**: Lucide React Icons
- **State Management**: React Context API (Theme, Language)
- **Cookie Management**: js-cookie

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: MySQL 8+
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Security**: bcryptjs for password hashing

### ML/Data Pipeline
- **Language**: Python 3
- **Model**: XGBoost (Gradient Boosting)
- **Data Processing**: pandas
- **Model Serialization**: joblib
- **Data Generation**: Faker (Indonesian locale)

### DevOps & Tools
- **Linting**: ESLint
- **Build Tool**: Webpack
- **Package Manager**: npm

## 📁 Project Structure

```
Lead-Scoring-Portal/
├── app/                          # Next.js 16 app directory (App Router)
│   ├── layout.jsx               # Root layout wrapper
│   ├── page.jsx                 # Login page (public route)
│   ├── globals.css              # Global Tailwind styles
│   ├── (main)/                  # Protected routes group (requires auth)
│   │   ├── layout.jsx           # Main layout with Navbar & Sidebar
│   │   ├── dashboard/           # Dashboard with analytics
│   │   │   └── page.jsx         # Dashboard charts & metrics
│   │   └── leadscore/           # Lead scoring & list page
│   │       └── page.jsx         # Lead table with filtering
│   ├── api/                     # Next.js API routes (Server-side)
│   │   ├── login/               # POST authentication endpoint
│   │   ├── logout/              # POST logout endpoint
│   │   ├── users/               # User CRUD operations
│   │   ├── dashboard/           # Dashboard data aggregation
│   │   ├── lead/
│   │   │   └── [id]/            # GET individual lead details
│   │   └── leadscore/           # POST/GET lead predictions
│   ├── nasabah/                 # Customer detail pages (dynamic routes)
│   │   └── [id]/                # Individual customer profile page
│   │       ├── layout.jsx       # Nasabah layout
│   │       └── page.jsx         # Customer detail view with education tips
│   └── lib/                     # Utility functions & database
│       ├── auth.js              # Authentication helper functions
│       ├── db.js                # MySQL connection pool setup
│       └── data/
│           └── dashboard.js     # Dashboard data queries
├── components/                  # Reusable React components
│   ├── Navbar.jsx              # Top navigation with logout
│   └── Sidebar.jsx             # Side navigation menu
├── context/                     # React Context providers (Global State)
│   ├── ThemeContext.jsx        # Dark/Light theme toggle provider
│   └── LanguageContext.jsx     # Language switching provider (en/id)
├── public/                      # Static assets & generated data
│   └── prediction_results.json  # ML predictions output
├── middleware.js                # Next.js middleware for auth protection
├── generate_results.py          # Python script: ML predictions pipeline
├── hash_password.js            # Utility: bcrypt password hashing
├── package.json                # npm dependencies & scripts
├── next.config.mjs             # Next.js config (React Compiler enabled)
├── tailwind.config.js          # Tailwind CSS theme customization
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration (JS config)
├── eslint.config.mjs           # ESLint rules & formatting
├── venv161/                    # Python virtual environment
├── bank-additional-full.csv    # Historical lead data (source)
├── predicted_leads_tuned.csv   # ML predictions output (to process)
└── README.md                   # This file
```

## 🏗️ Architecture Overview

### Data Flow
```
predicted_leads_tuned.csv 
    ↓
generate_results.py (Python)
    ↓ [XGBoost Model]
public/prediction_results.json
    ↓
/api/leadscore (Next.js API)
    ↓ [Format & Enrich]
Database (MySQL)
    ↓
Dashboard + Lead Details Pages
```

### Authentication Flow
```
Login Page (/page.jsx)
    ↓ [Credentials]
/api/login (POST)
    ↓ [bcrypt + JWT]
auth_token (Cookie)
    ↓
middleware.js (Validates token)
    ↓ [Protects /dashboard, /leadscore, /nasabah]
Protected Routes (/main/*)
```

### Component Hierarchy
```
Root (layout.jsx)
  ├── Login Page (page.jsx - public)
  └── (main) Group Layout
      ├── Navbar (Global)
      ├── Sidebar (Navigation)
      ├── Dashboard Page (Analytics)
      ├── LeadScore Page (List + Filter)
      └── Nasabah Pages (Individual customer details)
```

## 📋 Prerequisites

- **Node.js** 18+ and npm 9+
- **Python** 3.8+ (for ML pipeline)
- **MySQL** 8.0+
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Lead-Scoring-Portal
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Install Python Dependencies

Set up a Python virtual environment and install required packages:

```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install pandas joblib faker scikit-learn xgboost
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=lead_scoring_db
DATABASE_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Next.js Environment
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Create MySQL Database

```sql
CREATE DATABASE lead_scoring_db;
```

Then create necessary tables (contact your database admin for schema):

```sql
-- Example users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example leads table
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  score FLOAT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ⚙️ Configuration

### Database Connection (`app/lib/db.js`)
Update with your MySQL credentials or ensure environment variables are set correctly.

### JWT Configuration (`app/lib/auth.js`)
Configure token expiration and secret in environment variables.

### ML Model Path
Ensure `model_xgb_tuned.pkl` is in the project root before running predictions.

### Tailwind CSS
Configured in `tailwind.config.js` with custom colors and themes.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Python ML Pipeline

Generate predictions and results:

```bash
python generate_results.py
```

This will:
1. Load the XGBoost model
2. Make predictions on the CSV data
3. Filter by threshold (30%)
4. Generate results JSON with lead scores

## 🔌 API Routes

### Authentication
- **POST** `/api/login` - User authentication (returns JWT in cookie)
  - Request: `{ email, password }`
  - Response: `{ success: boolean, message: string }`
- **POST** `/api/logout` - Clear auth token and logout
  - Response: `{ success: boolean }`

### Users Management
- **GET** `/api/users` - List all users
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/[id]` - Update user info
- **DELETE** `/api/users/[id]` - Remove user

### Lead Operations
- **GET** `/api/lead/[id]` - Fetch single lead details
  - Returns: `{ personalInfo, campaignInfo, financialInfo, prediction }`
  - Used by: `/nasabah/[id]` page
- **POST** `/api/leadscore` - Generate/update lead predictions
  - Loads data from `public/prediction_results.json`
  - Enriches with database status/results
  - Maps months and results to translations
- **GET** `/api/leadscore` - Fetch all leads with scores
  - Returns: Array of leads with scores, potential, and metadata

### Dashboard
- **GET** `/api/dashboard` - Aggregate metrics & analytics data
  - Returns: Key metrics for dashboard visualization
  - Data comes from `app/lib/data/dashboard.js`

## 🧠 ML Pipeline

### Model
- **Algorithm**: XGBoost (Gradient Boosting)
- **Model File**: `model_xgb_tuned.pkl`
- **Input Features**: Age, job, marital status, education, default, housing, loan, etc.
- **Output**: Probability score (0-1)

### Prediction Script (`generate_results.py`)
```bash
python generate_results.py
```

This script:
- Loads pre-trained XGBoost model
- Reads historical lead data from `predicted_leads_tuned.csv`
- Applies 30% probability threshold
- Generates synthetic lead names using Faker
- Outputs JSON to `public/prediction_results.json`

## 🗄️ Database

### Tables Required
- `users` - User accounts
- `leads` - Lead information and scores
- Additional tables as per business requirements

### Connection Pool
MySQL connection uses `mysql2` with connection pooling for better performance.

## 🔐 Authentication

- **Method**: JWT tokens stored in cookies (`auth_token`)
- **Password Hashing**: bcrypt with salt rounds (configurable in `bcryptjs`)
- **Protected Routes**: Pages under `/app/(main)/` require valid token via `middleware.js`
- **Token Validation**: Checked on every protected page request
- **Flow**:
  1. User submits credentials on `/` (login page)
  2. `/api/login` validates password against database
  3. JWT token issued and stored in `auth_token` cookie
  4. Middleware checks cookie on protected routes
  5. Redirect to login if token missing/invalid
- **Environment**: Set `JWT_SECRET` in `.env.local`

## 🌍 Internationalization (i18n)

The app supports English (en) and Indonesian (id) with full translation coverage.

### Implementation
- **Provider**: `LanguageContext.jsx` - Global language state
- **Trigger**: Navbar language switcher
- **Method**: Nested translation objects with language codes as keys

### Translation Structure
Located in component files (example from `nasabah/[id]/page.jsx`):
```javascript
const translations = {
  en: { leadDetails: "Lead Details", age: "Age", ... },
  id: { leadDetails: "Detail Prospek", age: "Usia", ... }
};

// Usage in component:
const t = translations[lang];
<h1>{t.leadDetails}</h1>
```

### Supported Fields
- **Job**: admin, blue-collar, entrepreneur, technician, etc.
- **Marital Status**: married, single, divorced, unknown
- **Education**: basic, high school, professional, university degree
- **Contact**: cellular, telephone
- **Results**: interested, not interested, follow up
- **Potentials**: Hot, Warm, Cold
- **Months**: All 12 months translated
- **Communication Tips**: Education-specific messaging for sales teams

### Adding New Translations
1. Find the translation object in the component file
2. Add key-value pairs to both `en` and `id` objects
3. Use `translations[lang].newKey` to display

## 🎨 Styling & Theme System

### Tailwind CSS Setup
- **Configuration**: `tailwind.config.js`
- **Entry**: `app/globals.css` (global utilities)
- **Method**: Utility-first CSS for rapid development
- **Responsive**: Mobile-first breakpoints (sm, md, lg, xl, 2xl)

### Theme System
- **Provider**: `ThemeContext.jsx` - Tracks dark/light mode
- **Storage**: Browser localStorage (persists across sessions)
- **Trigger**: Navbar theme toggle button

### Theme-Aware Classes
Used throughout components for consistent styling:
```javascript
const bgScreen = theme === "dark" ? "bg-darkScreenColor" : "bg-screenColor";
const textMain = theme === "dark" ? "text-darkFontColor" : "text-gray-900";
const borderColor = theme === "dark" ? "border-borderColorDark" : "border-borderColorLight";
```

### Custom Colors (tailwind.config.js)
- `screenColor / darkScreenColor` - Page backgrounds
- `primary / secondary` - Brand gradients
- `darkPrimary / darkSecondary` - Dark mode cards
- `fontColor / darkFontColor` - Text colors
- `borderColorLight / borderColorDark` - Borders

### Color Mapping in Components
- **Success States**: Green (housing/loan approved)
- **Warning States**: Yellow (high contact frequency)
- **Lead Potential**: Red (Hot), Yellow (Warm), Blue (Cold)
- **Score Ranges**: Green (≥80), Yellow (≥60), Red (<60)

## 🎨 Styling

- **CSS Framework**: Tailwind CSS
- **Utility-first approach** for rapid UI development
- **Theme Support**: Dark and light modes via Context API
- **Responsive**: Mobile-first design principles
- **Icon Library**: Lucide React for consistent icons

## 💻 Development

### Project Setup & Running

#### Start Development Server
```bash
npm run dev
```
- Runs on `http://localhost:3000`
- Hot reload enabled (changes reflect immediately)
- Uses Webpack for bundling

#### Linting & Code Quality
```bash
npm run lint
```
- Enforces ESLint rules defined in `eslint.config.mjs`
- Catches syntax errors and style inconsistencies
- Run before committing code

### Development Workflow

#### Adding a New Page
1. Create file in `app/(main)/[section]/page.jsx`
2. Use client-side hooks: `useRouter`, `useTheme`, `useLanguage`
3. Fetch data from API routes in `useEffect`
4. Apply theme-aware classes for styling
5. Add translations to `translations` object

#### Creating an API Route
1. Create file in `app/api/[endpoint]/route.js`
2. Export `POST`, `GET`, `PUT`, `DELETE` functions
3. Use `db` pool for database queries
4. Return `NextResponse.json()` with data/errors
5. Include error handling and validation

#### Adding Component
1. Create file in `components/[Name].jsx`
2. Accept props for flexibility
3. Use Context for theme/language if needed
4. Export as default

### Database Queries
- Use `db.execute()` with parameterized queries
- Example:
  ```javascript
  const [rows] = await db.execute(
    "SELECT * FROM leads WHERE score > ?",
    [70]
  );
  ```
- Connection pool automatically manages connections

### Environment Variables

Create `.env.local` in project root:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lead_scoring_db
DB_PORT=3306

# JWT & Security
JWT_SECRET=your_secure_random_string_here

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Python ML Pipeline

#### Generating Predictions
```bash
python generate_results.py
```

This script:
1. Loads pre-trained XGBoost model (`model_xgb_tuned.pkl`)
2. Reads data from `predicted_leads_tuned.csv`
3. Applies feature engineering (age binning, education simplification, quarter mapping)
4. Runs XGBoost prediction
5. Filters by 30% probability threshold
6. Generates synthetic customer names using Faker (Indonesian locale)
7. Outputs JSON to `public/prediction_results.json`

#### Feature Engineering (Python)
- **Age Binning**: Young (<30), Adult (30-50), Senior (50-60), Elderly (60+)
- **Education Simplification**: Groups basic.4y/6y/9y → basic
- **Contact Status**: Binary flag for previous contact (pdays != 999)
- **Quarter Mapping**: Converts months to quarters (Q1-Q4)

#### Model Details
- **Algorithm**: XGBoost (Gradient Boosting)
- **File**: `model_xgb_tuned.pkl` (joblib serialized)
- **Input Features**: 20+ features including age, job, education, loan status, campaign metrics
- **Output**: Probability score (0-1)
- **Threshold**: 30% (leads scoring ≥0.3 considered potential)

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
npm start
```

Generates optimized production bundle with:
- Code minification
- Tree-shaking
- Image optimization
- CSS purging

### Deployment Checklist

- [ ] Set production database credentials in `.env.production.local`
- [ ] Use strong `JWT_SECRET` (minimum 32 characters)
- [ ] Enable HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure cookie flags
- [ ] Set up database backups
- [ ] Enable API rate limiting
- [ ] Configure CORS if needed

### Deployment Options

#### 1. Vercel (Recommended for Next.js)
```bash
npm i -g vercel
vercel
```
- Automatic deployments on git push
- Built-in edge functions & analytics
- Serverless by default

#### 2. Docker
```bash
docker build -t lead-scoring .
docker run -p 3000:3000 --env-file .env.production.local lead-scoring
```

#### 3. Traditional VPS (AWS, DigitalOcean, etc.)
```bash
npm run build
npm start &
```
Use process manager like PM2 for persistence.

#### 4. Standalone Executable
```bash
npm run build
# Outputs .next/standalone with Node.js app
npm install --only=production
node .next/standalone/server.js
```

### Environment Variables for Production
- `DB_HOST`: Production database server
- `DB_USER`: Database user with appropriate permissions
- `DB_PASSWORD`: Strong password (use secrets manager)
- `JWT_SECRET`: Long random string (generate with: `openssl rand -hex 32`)
- `NEXT_PUBLIC_API_URL`: Production domain (e.g., https://leadscoring.example.com)
- `NODE_ENV=production`

---

## 🐛 Troubleshooting

### Common Issues

#### Build Fails: "Cannot find module 'mysql2'"
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Login Not Working
**Checks**:
1. Verify MySQL database is running
2. Ensure `users` table exists with `email` and `password` columns
3. Check `.env.local` DB credentials
4. Verify JWT_SECRET is set
5. Check browser cookies are enabled

#### Dashboard Shows No Data
**Checks**:
1. Run `python generate_results.py` to generate predictions
2. Verify `public/prediction_results.json` exists and has content
3. Check `/api/leadscore` returns data
4. Verify database `lead_status` and `lead_results` tables populated

#### Lead Details Page Shows "No Data"
**Checks**:
1. Verify lead ID exists in database
2. Check `/api/lead/[id]` endpoint returns correct data
3. Confirm all required fields: `personalInfo`, `campaignInfo`, `financialInfo`, `prediction`

#### Theme/Language Not Persisting
**Checks**:
1. Verify Context providers wrap app in layout
2. Check localStorage is enabled in browser
3. Confirm `useTheme()` and `useLanguage()` hooks used correctly

#### API Errors (500)
**Debug Steps**:
1. Check server logs: `npm run dev` output
2. Verify database connection: Check DB credentials
3. Look for SQL syntax errors in queries
4. Ensure tables have required columns
5. Check error response in browser DevTools

#### Python Script Fails
**Common Issues**:
- Missing dependencies: `pip install pandas joblib xgboost scikit-learn faker`
- Missing model file: Ensure `model_xgb_tuned.pkl` exists
- Data file missing: Check `predicted_leads_tuned.csv` exists
- Virtual environment not activated: Run `venv/Scripts/activate`

---

## 📚 Key Code Patterns

### Using Context in Components
```jsx
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function MyComponent() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  return <div className={bgColor}>{/* content */}</div>;
}
```

### Fetching Lead Data
```jsx
const [lead, setLead] = useState(null);

useEffect(() => {
  const fetchLead = async () => {
    const res = await fetch(`/api/lead/${id}`, { cache: "no-store" });
    const data = await res.json();
    setLead(data);
  };
  fetchLead();
}, [id]);
```

### Database Query in API Route
```javascript
export async function GET(request) {
  const [rows] = await db.execute(
    "SELECT * FROM leads WHERE score > ?",
    [threshold]
  );
  return NextResponse.json(rows);
}
```

### Theme-Aware Styling
```jsx
const bgCard = theme === "dark" ? "bg-darkPrimary" : "bg-white";
const textColor = theme === "dark" ? "text-darkFontColor" : "text-gray-900";
return <div className={`${bgCard} ${textColor}`}>Content</div>;
```

---

**Last Updated**: December 2025  
**Version**: 0.1.0  
**Repository**: [janienatalie/Lead-Scoring-Portal](https://github.com/janienatalie/Lead-Scoring-Portal)  
**Branch**: azka
