@echo off
REM MemoryLane PostgreSQL Database Setup Script for Windows
REM This script creates the memory_lane database and tables

echo MemoryLane Database Setup
echo =======================
echo.

REM Check if psql is available
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: psql not found in PATH
    echo Please ensure PostgreSQL is installed and psql is in your PATH
    echo You can manually run: psql -U postgres -h localhost -f database-schema.sql
    pause
    exit /b 1
)

REM Set PostgreSQL connection parameters
set PGUSER=postgres
set PGHOST=localhost
set PGPORT=5432

echo Connecting to PostgreSQL at %PGHOST%:%PGPORT%...
echo.

REM Create the memory_lane database
echo Creating database 'memory_lane'...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "CREATE DATABASE memory_lane;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo Database created successfully.
) else (
    echo Database may already exist. Continuing...
)
echo.

REM Create tables
echo Creating tables...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d memory_lane -f ..\database\database-schema.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Tables created successfully!
    echo.
    echo Database setup complete. You can now:
    echo 1. Configure .env with your database credentials
    echo 2. Run: npm run dev
    echo.
    echo To add sample data, run:
    echo psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d memory_lane
    echo Then paste the INSERT statements from DATABASE_SETUP.md
) else (
    echo Error creating tables. Please check your PostgreSQL installation.
    echo You can manually run: psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d memory_lane -f database-schema.sql
)
echo.
pause
