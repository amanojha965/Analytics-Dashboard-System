# Unified Retail ETL & Analytics Dashboard

A production-ready retail analytics platform featuring a modern React frontend and a scalable FastAPI backend, fully integrated with Neon PostgreSQL for real-time data insights.

## Features

- **Real-time Analytics Dashboard:** Live revenue tracking, fulfillment metrics, and category performance analysis.
- **Robust ETL Pipeline:** Secure API endpoints for ingesting CSV, JSON, and XML data directly into the cloud database infrastructure.
- **Secure Authentication:** JWT-based user authentication featuring strictly enforced, robust password validation.
- **Modern Architecture:** Clean MVC (Model-View-Controller) structure in FastAPI designed for high testability and maintainability.
- **Optimized UI:** Polished, responsive design utilizing a minimal "Soft UI" aesthetic alongside highly interactive data visualizations.

## Technology Stack

- **Frontend:** React, Vite, TailwindCSS, Recharts, Lucide Icons
- **Backend:** Python, FastAPI, SQLAlchemy, Pandas (for data manipulation)
- **Database:** PostgreSQL (Neon Serverless)
- **Deployment:** Configured for automated deployment on Render via `render.yaml`

## Quick Start Guide

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # (or source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/dbname
SECRET_KEY=your_secure_random_string
FRONTEND_URL=http://localhost:5173
```

---
*Developed with precision for data-driven teams.*
