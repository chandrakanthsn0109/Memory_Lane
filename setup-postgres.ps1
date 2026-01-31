# MemoryLane PostgreSQL Database Setup Script for Windows PowerShell
# This script creates the memory_lane database and tables

Write-Host "MemoryLane Database Setup" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host ""

# Check if psql is available
$psqlPath = (Get-Command psql -ErrorAction SilentlyContinue).Source
if (-not $psqlPath) {
    Write-Host "Error: psql not found in PATH" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is installed and psql is in your PATH" -ForegroundColor Yellow
    Write-Host "You can manually run: psql -U postgres -h localhost -f database-schema.sql" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Set PostgreSQL connection parameters
$pgUser = "postgres"
$pgHost = "localhost"
$pgPort = "5432"

Write-Host "Connecting to PostgreSQL at $pgHost:$pgPort..." -ForegroundColor Cyan
Write-Host ""

# Create the memory_lane database
Write-Host "Creating database 'memory_lane'..." -ForegroundColor Cyan
$createDbOutput = & psql -U $pgUser -h $pgHost -p $pgPort -c "CREATE DATABASE memory_lane;" 2>&1

if ($LASTEXITCODE -eq 0 -or $createDbOutput -match "already exists") {
    Write-Host "Database created successfully (or already exists)." -ForegroundColor Green
} else {
    Write-Host "Warning: Could not create database. Continuing..." -ForegroundColor Yellow
}
Write-Host ""

# Create tables
Write-Host "Creating tables..." -ForegroundColor Cyan
& psql -U $pgUser -h $pgHost -p $pgPort -d memory_lane -f database-schema.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Tables created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database setup complete. You can now:" -ForegroundColor Green
    Write-Host "1. Configure .env with your database credentials" -ForegroundColor Cyan
    Write-Host "2. Run: npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To add sample data, run:" -ForegroundColor Green
    Write-Host "psql -U $pgUser -h $pgHost -p $pgPort -d memory_lane" -ForegroundColor Cyan
    Write-Host "Then paste the INSERT statements from DATABASE_SETUP.md" -ForegroundColor Cyan
} else {
    Write-Host "Error creating tables. Please check your PostgreSQL installation." -ForegroundColor Red
    Write-Host "You can manually run:" -ForegroundColor Yellow
    Write-Host "psql -U $pgUser -h $pgHost -p $pgPort -d memory_lane -f database-schema.sql" -ForegroundColor Cyan
}
Write-Host ""
Read-Host "Press Enter to exit"
