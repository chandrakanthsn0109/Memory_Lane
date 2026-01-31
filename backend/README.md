# MemoryLane Backend

The backend for MemoryLane, a Node.js/Express application using TypeScript.

## Quick Start

### 1. Prerequisites
- Node.js (v16+)
- PostgreSQL or Oracle Database
- Google Gemini API Key

### 2. Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` and update with your credentials:
    ```bash
    cp .env.example .env
    ```

3.  **Database Setup**
    
    *PostgreSQL (Windows)*:
    Run the setup script in `scripts/`:
    ```powershell
    cd scripts
    .\setup-postgres.ps1
    ```
    Or manually run the SQL in `database/database-schema.sql`.

### 3. Running the Server

- **Development**:
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm run build:server
  npm start
  ```
- **Jobs**:
  ```bash
  npm run job
  ```

## API Documentation

- `GET /api/health`: Health check
- `GET /api/events?userId=...`: Get user events
- `POST /api/generate-memory`: Generate memory for an event
- `POST /api/process-all`: Batch process memories

## Project Structure

- `app/`: API Server and Jobs
- `lib/`: Core logic (AI, Database, Scoring)
- `database/`: SQL Schemas
- `scripts/`: Setup scripts
