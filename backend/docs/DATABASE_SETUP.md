# Database Setup Guide

## PostgreSQL Setup

This guide explains how to set up the PostgreSQL database for the MemoryLane application.

### Prerequisites

- PostgreSQL installed and running
- PostgreSQL client tools (psql) available in your PATH
- Access to the PostgreSQL server with admin/superuser credentials

### 1. Create Database

First, create the `memory_lane` database:

```bash
psql -U postgres -h localhost
```

Then in the psql prompt:

```sql
CREATE DATABASE memory_lane;
\c memory_lane
```

### 2. Create Tables

Run the SQL schema file to create the required tables:

**Option A: Using psql**
```bash
psql -U postgres -h localhost -d memory_lane -f database-schema.sql
```

**Option B: Manually in psql**
```bash
psql -U postgres -h localhost
\c memory_lane
\i database-schema.sql
```

**Option C: Copy-paste the SQL**
Open the `database-schema.sql` file and copy all the SQL statements into your PostgreSQL client and execute them.

### 3. Verify Tables

Verify that the tables were created successfully:

```bash
psql -U postgres -h localhost -d memory_lane
```

Then in the psql prompt:

```sql
\dt
```

You should see:
- `ml_event_unified` - stores events/activities of employees
- `ml_memory_processed` - stores generated memories

Check table structure:
```sql
\d ml_event_unified
\d ml_memory_processed
```

### 4. Add Sample Data (Optional)

To test the application, you can add sample data. In the psql prompt:

```sql
INSERT INTO ML_EVENT_UNIFIED (event_id, subject_emp_id, event_category, event_description, event_date, employee_status)
VALUES 
  ('evt-001', 'EMP001', 'Achievement', 'Successfully completed Q4 project ahead of schedule', NOW() - INTERVAL '30 days', 'ACTIVE'),
  ('evt-002', 'EMP001', 'Promotion', 'Promoted to Senior Engineer', NOW() - INTERVAL '60 days', 'ACTIVE'),
  ('evt-003', 'EMP002', 'Recognition', 'Team Player Award', NOW() - INTERVAL '15 days', 'ACTIVE'),
  ('evt-004', 'EMP002', 'Learning', 'Completed AWS certification', NOW() - INTERVAL '45 days', 'ACTIVE'),
  ('evt-005', 'EMP003', 'Social', 'Led team building event', NOW() - INTERVAL '7 days', 'GHOST');
```

Verify data was inserted:
```sql
SELECT COUNT(*) FROM ML_EVENT_UNIFIED;
SELECT * FROM ML_EVENT_UNIFIED;
```

### 5. Configure Application

Make sure your `.env` file has these settings:

```
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memory_lane
DB_USER=postgres
DB_PASSWORD=postgres
```

Update `DB_USER` and `DB_PASSWORD` if you're using different credentials.

### 6. Test Connection

Start the application and navigate to the `/api/health` endpoint. If the response is:

```json
{
  "status": "ok",
  "database": "postgresql"
}
```

Then the connection is working correctly.

### 7. Troubleshooting

**Connection Refused Error**
- Ensure PostgreSQL server is running
- Check that DB_HOST and DB_PORT are correct
- Verify firewall allows connections to port 5432

**Table Not Found Error**
- Run the database-schema.sql file again
- Verify you're connected to the correct database (`memory_lane`)
- Check that the schema execution didn't have errors

**Permission Denied Error**
- Verify DB_USER and DB_PASSWORD are correct
- Ensure the user has CREATE and INSERT privileges on the memory_lane database

**Test with psql**
```bash
psql -U postgres -h localhost -d memory_lane -c "SELECT * FROM ML_EVENT_UNIFIED LIMIT 1;"
```

If this works, the database is properly configured.

## Oracle Setup

For Oracle database, use `database-schema-oracle.sql` and update your `.env`:

```
DB_TYPE=oracle
DB_HOST=localhost
DB_PORT=1521
DB_NAME=ORCL
DB_USER=system
DB_PASSWORD=oracle
```

The application will automatically use the Oracle-specific schema and queries.

## Switching Between Databases

To switch from PostgreSQL to Oracle:

1. Update `.env` with `DB_TYPE=oracle`
2. Ensure Oracle database has the same schema (tables with Oracle-specific syntax)
3. Restart the application

No code changes are required - the database abstraction layer handles everything.
