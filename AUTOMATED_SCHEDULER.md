# Automated Memory Processing - How It Works

## Overview

MemoryLane now automatically processes and generates memories for all active employees **every day at midnight (00:00 UTC)**, without requiring any manual action.

## How It Works

### Automatic Daily Processing

The system runs a scheduled job that:
1. **Runs Daily at Midnight** - Triggers automatically every day at 00:00 UTC
2. **Processes All Active Employees** - Analyzes events for users with status "ACTIVE"
3. **Generates Memories** - Creates AI-powered memory narratives for the best events
4. **Stores in Database** - Saves memories to `ML_MEMORY_PROCESSED` table
5. **Shows to Employees** - Employees see their new memories in the Memories tab

### No Manual Button Required

The "Process All" button has been removed from the UI. Everything happens automatically:

- ❌ No button to click
- ❌ No manual intervention needed
- ✅ Automatic daily processing
- ✅ Memories appear automatically for employees

## Architecture

### Components

**Backend Scheduler** (`lib/scheduler.ts`)
- Uses `node-cron` library to schedule jobs
- `processAllMemories()` - Core logic for generating memories
- `initializeScheduler()` - Sets up the daily cron job
- Runs at: `0 0 * * *` (Every day at 00:00)

**Server Integration** (`app/server.ts`)
- Scheduler initialized when server starts
- Logs all processing activities to console
- Handles errors gracefully

**Frontend** (`frontend/src/pages/UserDashboard.tsx`)
- Removed "Process All" button
- Auto-refreshes memories via `useMemories` hook
- Shows newly generated memories automatically

## What Employees See

1. **Memories Tab** - Shows all generated memories (auto-updated daily)
2. **New Memories** - Appear each day after midnight processing
3. **Full Story** - Can view complete AI-generated narrative
4. **Memory Details** - Category, emotion, score, and creation date

## Server Logs

When the scheduler runs, you'll see logs like:

```
[MemoryLane Scheduler] Starting scheduled job at 2026-01-28T00:00:00.000Z
[MemoryLane Scheduler] Generated memory abc-123 for user EMP001
[MemoryLane Scheduler] Generated memory def-456 for user EMP002
[MemoryLane Scheduler] Successfully processed 2 memories
```

## API Endpoint for Status

You can check the scheduler status via:

```bash
GET http://localhost:3000/api/scheduler/status
```

Response:
```json
{
  "status": "running",
  "schedule": "Daily at 00:00 (midnight)",
  "description": "Memories are automatically generated for all active employees",
  "nextRun": "Tomorrow at 00:00 UTC"
}
```

## Cron Schedule Format

The job runs on a cron schedule: `0 0 * * *`

| Field | Value | Meaning |
|-------|-------|---------|
| Minute | 0 | At minute 0 |
| Hour | 0 | At hour 0 (midnight) |
| Day of Month | * | Every day |
| Month | * | Every month |
| Day of Week | * | Every day of the week |

**Result:** Runs every day at 00:00 (midnight) UTC

## Changing the Schedule

To change when memories are processed, edit `lib/scheduler.ts`:

**Daily at 9 AM:**
```typescript
cron.schedule("0 9 * * *", async () => {
```

**Every 6 hours:**
```typescript
cron.schedule("0 */6 * * *", async () => {
```

**Every weekday at 8 AM:**
```typescript
cron.schedule("0 8 * * 1-5", async () => {
```

**Every 30 minutes:**
```typescript
cron.schedule("*/30 * * * *", async () => {
```

Then restart the server for changes to take effect.

## Database Requirements

The scheduler requires these tables to exist:

- `ML_EVENT_UNIFIED` - Contains employee events
- `ML_MEMORY_PROCESSED` - Where generated memories are stored

Run the database setup if you haven't already:

```bash
.\setup-postgres.ps1
```

Or manually:
```bash
psql -U postgres -h localhost -d memory_lane -f database-schema.sql
```

## Features

### ✅ Automatic Processing
No user action required - everything happens on schedule

### ✅ Error Handling
Errors are logged but don't stop the scheduler from running tomorrow

### ✅ Intelligent Memory Selection
Uses scoring algorithm to pick the best event for each user

### ✅ AI-Generated Content
Creates unique narratives for each memory using Google Gemini

### ✅ Timezone Aware
Runs at midnight UTC (adjust schedule as needed for your timezone)

### ✅ Scalable
Can process hundreds of employees efficiently

## Example Memory Generation Flow

1. **Midnight Triggers** - Scheduler wakes up at 00:00
2. **Find Active Users** - Queries `ML_EVENT_UNIFIED` for "ACTIVE" employees
3. **Score Events** - Calculates score for each event using multiple factors
4. **Select Best** - Picks highest-scoring event per employee
5. **Generate Story** - Sends to Google Gemini AI
6. **Save Memory** - Inserts narrative into `ML_MEMORY_PROCESSED`
7. **Log Results** - Prints summary to console
8. **Employee Views** - When employee logs in, they see new memory

## Monitoring

### Check Server Logs
```bash
# In terminal where server is running, you'll see logs like:
[MemoryLane Scheduler] Initializing daily memory processing job
[MemoryLane Scheduler] Daily memory processing job initialized (runs at midnight)
```

### Verify in Database
```bash
psql -U postgres -h localhost -d memory_lane

# Check latest memories
SELECT memory_id, user_id, headline, created_at 
FROM ML_MEMORY_PROCESSED 
ORDER BY created_at DESC 
LIMIT 10;
```

## Troubleshooting

### Memories Not Generating

**Check 1: Is the server running?**
```bash
npm run dev
```

**Check 2: Do the database tables exist?**
```bash
psql -U postgres -h localhost -d memory_lane
\d ML_EVENT_UNIFIED
\d ML_MEMORY_PROCESSED
```

**Check 3: Are there active employees with events?**
```bash
SELECT DISTINCT subject_emp_id FROM ML_EVENT_UNIFIED WHERE employee_status = 'ACTIVE';
```

### Scheduler Not Running

**Check server logs** - Look for "MemoryLane Scheduler" messages

**Restart server:**
```bash
# Press Ctrl+C to stop
npm run dev
```

### Timezone Issues

The scheduler runs on UTC. To run at a specific local time, adjust the cron expression in `lib/scheduler.ts`.

## Performance Considerations

- **Processing Time** - Depends on number of events and Gemini API latency
- **Database Connections** - Uses connection pooling from PostgreSQL
- **API Rate Limits** - May be limited by Google Gemini API quotas
- **Scalability** - Can handle 1000+ employees efficiently

## Future Enhancements

Possible improvements:
- Admin dashboard to view scheduler status
- Ability to manually trigger processing from UI
- Configurable schedule per user group
- Different schedule for different employee levels
- Retry mechanism for failed jobs
- Notifications when memories are generated

## Technical Details

**Scheduler Library:** node-cron
**Timezone:** UTC (can be customized)
**Concurrency:** Sequential processing (one user at a time)
**Error Recovery:** Continues if one employee fails
**Logging:** Console logs for debugging
**Persistence:** No state persistence needed (stateless job)

## Summary

Employees enjoy their newly generated memories every day automatically - no buttons to click, no manual processes, just pure AI-powered storytelling delivered daily at midnight! 🎉
