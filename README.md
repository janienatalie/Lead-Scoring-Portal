# Lead Scoring Portal

A modern full-stack application for lead scoring and management, built with Next.js 16 and MySQL. This portal helps businesses identify and prioritize high-potential leads using machine learning models.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [ML Pipeline](#ml-pipeline)
- [Database](#database)
- [Authentication](#authentication)
- [Styling](#styling)
- [Development](#development)
- [Build & Deployment](#build--deployment)

## ✨ Features

- **Lead Scoring**: ML-powered lead qualification using XGBoost models
- **Dashboard**: Real-time analytics and lead insights with interactive charts
- **Lead Management**: View, filter, and manage leads by score and status
- **User Authentication**: Secure login with JWT tokens and bcrypt password hashing
- **Multi-language Support**: English and Indonesian language switching
- **Dark/Light Theme**: Customizable UI theme preference
- **PDF Export**: Generate and download lead reports as PDFs
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

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
├── app/                          # Next.js app directory
│   ├── layout.jsx               # Root layout
│   ├── page.jsx                 # Login page
│   ├── globals.css              # Global styles
│   ├── (main)/                  # Main application routes (protected)
│   │   ├── layout.jsx           # Main layout with Navbar/Sidebar
│   │   ├── dashboard/           # Dashboard page
│   │   └── leadscore/           # Lead scoring page
│   ├── api/                     # API routes
│   │   ├── login/               # Authentication endpoints
│   │   ├── logout/              # Logout endpoint
│   │   ├── users/               # User management
│   │   ├── dashboard/           # Dashboard data
│   │   ├── lead/[id]/           # Lead details
│   │   └── leadscore/           # Lead scoring API
│   ├── nasabah/[id]/            # Individual customer pages
│   └── lib/                     # Utility functions
│       ├── auth.js              # Authentication helpers
│       ├── db.js                # Database connection
│       └── data/
│           └── dashboard.js     # Dashboard data queries
├── components/                  # Reusable React components
│   ├── Navbar.jsx              # Top navigation bar
│   └── Sidebar.jsx             # Side navigation
├── context/                     # React Context providers
│   ├── ThemeContext.jsx        # Dark/Light theme provider
│   └── LanguageContext.jsx     # i18n language provider
├── public/                      # Static assets
│   └── prediction_results.json # ML predictions
├── generate_results.py          # Python script for ML predictions
├── hash_password.js            # Password hashing utility
├── package.json                # npm dependencies
├── next.config.mjs             # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.mjs           # ESLint rules
└── middleware.js               # Next.js middleware (auth, etc.)
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
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Leads
- `GET /api/lead/[id]` - Get lead details
- `POST /api/leadscore` - Generate lead scores
- `GET /api/leadscore` - Fetch all scores

### Dashboard
- `GET /api/dashboard` - Get dashboard metrics

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

- **Method**: JWT tokens stored in cookies
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: Pages under `/app/(main)/` require authentication
- **Token Expiry**: Configure in environment

## 🎨 Styling

- **CSS Framework**: Tailwind CSS
- **Utility-first approach** for rapid UI development
- **Theme Support**: Dark and light modes via Context API
- **Responsive**: Mobile-first design principles
- **Icon Library**: Lucide React for consistent icons

## 💻 Development

### Linting

```bash
npm run lint
```

### Code Quality
- ESLint for JavaScript linting
- Next.js best practices enforced
- Babel React Compiler for optimizations

### Hot Reload
Development server supports hot module replacement for instant feedback.

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
npm start
```

### Deployment Options
1. **Vercel** (Recommended for Next.js)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Docker**
   Create `Dockerfile` and `docker-compose.yml` as needed

3. **Self-hosted**
   Deploy to any Node.js hosting (AWS, DigitalOcean, etc.)

### Environment Variables for Production
- Update `.env.production.local` with production database credentials
- Use strong JWT secret
- Set secure cookie flags
- Enable HTTPS

---

**Last Updated**: December 2025
