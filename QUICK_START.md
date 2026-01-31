# Quick Start Guide - MemoryLane

## Overview

MemoryLane is an AI-powered memory generation system that uses Google Gemini AI to create personalized memory narratives for employees based on their events and activities.

## Prerequisites

Before you start, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Google Gemini API Key** - [Get one here](https://makersuite.google.com/app/apikey)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd c:\mypoc\MemoryLane
npm install
cd frontend
npm install
cd ..
```

### 2. Set Up Database

#### Option A: Using Setup Script (Recommended for Windows)

**PowerShell:**
```powershell
.\setup-postgres.ps1
```

**Command Prompt:**
```cmd
setup-postgres.bat
```

#### Option B: Manual Setup

1. Open PowerShell or Command Prompt
2. Create the database:
   ```bash
   psql -U postgres -h localhost
   ```
3. In the psql prompt, run:
   ```sql
   CREATE DATABASE memory_lane;
   \c memory_lane
   \i database-schema.sql
   ```

4. (Optional) Add sample data:
   ```sql
   INSERT INTO ML_EVENT_UNIFIED (event_id, subject_emp_id, event_category, event_description, event_date, employee_status)
   VALUES 
     ('evt-001', 'EMP001', 'Achievement', 'Successfully completed Q4 project ahead of schedule', NOW() - INTERVAL '30 days', 'ACTIVE'),
     ('evt-002', 'EMP001', 'Promotion', 'Promoted to Senior Engineer', NOW() - INTERVAL '60 days', 'ACTIVE'),
     ('evt-003', 'EMP002', 'Recognition', 'Team Player Award', NOW() - INTERVAL '15 days', 'ACTIVE'),
     ('evt-004', 'EMP002', 'Learning', 'Completed AWS certification', NOW() - INTERVAL '45 days', 'ACTIVE'),
     ('evt-005', 'EMP003', 'Social', 'Led team building event', NOW() - INTERVAL '7 days', 'GHOST');
   ```

### 3. Configure Environment

1. Update or create `.env` file in the root directory:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memory_lane
DB_USER=postgres
DB_PASSWORD=postgres

# Google Gemini API
GEMINI_API_KEY=your_api_key_here
```

2. Replace `your_api_key_here` with your actual Google Gemini API key.

### 4. Start the Application

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Access the Application

Open your browser and go to: **http://localhost:3000**

1. Enter an **Employee ID** (e.g., `EMP001` if you added sample data)
2. View **Events** and **Memories** tabs
3. Click **Generate Memory** to create AI-powered memory narratives
4. Click **Process All** to generate memories for all active employees

## Available Endpoints

### Health Check
```
GET http://localhost:3000/api/health
```
Response:
```json
{
  "status": "ok",
  "database": "postgresql"
}
```

### Get Events
```
GET http://localhost:3000/api/events?userId=EMP001
```

### Get Memories
```
GET http://localhost:3000/api/memories?userId=EMP001
```

### Get Single Memory
```
GET http://localhost:3000/api/memory?memoryId=abc-123
```

### Generate Memory for User
```
POST http://localhost:3000/api/generate-memory
Content-Type: application/json

{
  "userId": "EMP001"
}
```

### Process All Active Users
```
POST http://localhost:3000/api/process-all
```

## Troubleshooting

### "Database tables not found" Error

**Solution:** Run the database setup script or manually execute `database-schema.sql`:

```bash
psql -U postgres -h localhost -d memory_lane -f database-schema.sql
```

### "Connection refused" Error

**Solution:** Ensure PostgreSQL is running:

```bash
# Check if PostgreSQL service is running (Windows)
Get-Service PostgreSQL* | Format-Table Name, Status
```

### "GEMINI_API_KEY not found" Error

**Solution:** Ensure you have a valid `.env` file with your Gemini API key. Get one from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Port 3000 Already in Use

**Solution:** Kill the existing process or use a different port:

```bash
# Find the process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the process ID)
taskkill /PID <PID> /F
```

## Switching to Oracle Database

To use Oracle instead of PostgreSQL:

1. Install Oracle driver:
   ```bash
   npm install oracledb
   ```

2. Update `.env`:
   ```env
   DB_TYPE=oracle
   DB_HOST=localhost
   DB_PORT=1521
   DB_NAME=ORCL
   DB_USER=system
   DB_PASSWORD=oracle
   ```

3. Run the Oracle schema:
   ```bash
   sqlplus system/oracle@ORCL @database-schema-oracle.sql
   ```

4. Restart the application - no code changes needed!

## Project Structure

```
MemoryLane/
├── app/
│   ├── server.ts          # Express API server
│   └── jobs/
│       └── processMemoryLane.ts
├── lib/
│   ├── ai.ts              # Gemini AI integration
│   ├── blueprint.ts       # Memory blueprint builder
│   ├── classifier.ts      # User classification
│   ├── databases/         # Database abstraction layer
│   │   ├── postgres.ts
│   │   ├── oracle.ts
│   │   └── index.ts
│   ├── db.ts              # Database exports
│   ├── freshness.ts       # Freshness calculations
│   ├── interfaces/        # TypeScript interfaces
│   ├── retry.ts           # Retry logic
│   ├── scorer.ts          # Memory scoring
│   └── writer.ts          # Database writer
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client
│   │   └── App.tsx        # Main app
│   └── public/
├── .env                   # Configuration (git-ignored)
├── database-schema.sql    # PostgreSQL schema
├── database-schema-oracle.sql # Oracle schema
├── package.json           # Dependencies
└── README.md              # Project documentation
```

## Available Scripts

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Run memory lane job
npm run job
```

## Technology Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Frontend:** React, TypeScript, Axios
- **Database:** PostgreSQL / Oracle (abstracted)
- **AI:** Google Gemini API
- **Build Tool:** ts-node (development), React Scripts (frontend)

## Key Features

✅ **Database Agnostic** - Switch between PostgreSQL and Oracle with just an environment variable
✅ **AI-Powered Memory Generation** - Uses Google Gemini to create narratives
✅ **User Classification** - Automatically classifies users as ACTIVE or GHOST
✅ **Memory Scoring** - Multi-factor scoring algorithm
✅ **React Frontend** - Modern UI for viewing and managing memories
✅ **REST API** - Complete API for all operations
✅ **Type-Safe** - Full TypeScript implementation

## Need Help?

1. Check [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed database setup
2. Check [FRONTEND.md](FRONTEND.md) for frontend documentation
3. Check [IMPLEMENTATION.md](IMPLEMENTATION.md) for implementation details

## License

MIT
