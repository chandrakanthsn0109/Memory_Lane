# Database Abstraction Layer

This project uses a database abstraction layer that allows you to easily switch between PostgreSQL and Oracle without changing any business logic.

## Switching Databases

Simply set the `DB_TYPE` environment variable in your `.env` file:

### For PostgreSQL (Default)
```env
DB_TYPE=postgres
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=memorylane
GEMINI_API_KEY=your_key
```

### For Oracle
```env
DB_TYPE=oracle
DB_USER=your_oracle_user
DB_PASSWORD=your_oracle_password
DB_CONNECT_STRING=your_connection_string
GEMINI_API_KEY=your_key
```

## Architecture

- **IDatabase Interface** (`lib/interfaces/IDatabase.ts`) - Defines the contract for database operations
- **PostgreSQL Implementation** (`lib/databases/postgres.ts`) - PostgreSQL-specific implementation
- **Oracle Implementation** (`lib/databases/oracle.ts`) - Oracle-specific implementation
- **Database Factory** (`lib/databases/index.ts`) - Selects the correct implementation based on `DB_TYPE`
- **Unified Export** (`lib/db.ts`) - Simple export that the rest of the app uses

## How It Works

The application code only imports from `lib/db.ts`:
```typescript
import { getConnection } from "@/lib/db";

const conn = await getConnection(); // Works with any database
await conn.execute(sql, params);
await conn.commit();
await conn.close();
```

The actual database implementation is selected at runtime based on the `DB_TYPE` environment variable. No code changes needed - just change the config!

## Adding a New Database

To support a new database type:
1. Create a new implementation file in `lib/databases/` (e.g., `mysql.ts`)
2. Implement the `IDatabase` and `IConnection` interfaces
3. Add the case to the factory in `lib/databases/index.ts`
4. Update `.env.example` with the new configuration options

## Current Supported Databases

- ✅ PostgreSQL
- ✅ Oracle
