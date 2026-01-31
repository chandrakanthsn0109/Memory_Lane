import "dotenv/config";
import { Pool, PoolClient } from "pg";
import { IConnection, IDatabase } from "../interfaces/IDatabase";

/**
 * Converts Oracle-style named parameters (:name) to PostgreSQL-style ($1, $2, ...)
 * Also handles object parameter maps to positional arrays
 */
function convertSqlAndParams(
  sql: string,
  params?: any[] | Record<string, any>
): { sql: string; params: any[] } {
  // If no params, return as-is
  if (!params) {
    return { sql, params: [] };
  }

  // If params is an object (named parameters), convert to array
  if (!Array.isArray(params)) {
    const paramMap = params as Record<string, any>;
    const paramArray: any[] = [];
    let convertedSql = sql;

    // Extract all unique parameter names from the SQL
    const paramNames = Array.from(
      new Set(sql.match(/:[\w_]+/g) || [])
    ).map((p) => p.substring(1)); // Remove the ':'

    // Build parameter array in the order they appear
    paramNames.forEach((name) => {
      paramArray.push(paramMap[name]);
    });

    // Replace all :name with $1, $2, etc.
    let paramIndex = 1;
    convertedSql = convertedSql.replace(/:[\w_]+/g, () => `$${paramIndex++}`);

    return { sql: convertedSql, params: paramArray };
  }

  // If params is already an array, check if SQL uses named params
  if (sql.includes(":")) {
    // Convert :1, :2 style or :name style to $1, $2
    let paramIndex = 1;
    const convertedSql = sql.replace(/:[\w_]+/g, () => `$${paramIndex++}`);
    return { sql: convertedSql, params };
  }

  return { sql, params };
}

class PostgresConnection implements IConnection {
  constructor(private client: PoolClient) {}

  async execute(sql: string, params?: any[] | Record<string, any>): Promise<any> {
    // Convert Oracle-style parameters to PostgreSQL style
    const { sql: convertedSql, params: convertedParams } = convertSqlAndParams(
      sql,
      params
    );

    const result = await this.client.query(convertedSql, convertedParams);
    return {
      rows: result.rows,
      rowsAffected: result.rowCount,
    };
  }

  async commit(): Promise<void> {
    // PostgreSQL auto-commits by default, explicit commit if in transaction
    await this.client.query("COMMIT");
  }

  async close(): Promise<void> {
    await this.client.release();
  }
}

class PostgresDatabase implements IDatabase {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "postgres",
    });
  }

  async getConnection(): Promise<IConnection> {
    const client = await this.pool.connect();
    // Start transaction
    await client.query("BEGIN");
    return new PostgresConnection(client);
  }
}

export const postgresDb = new PostgresDatabase();
