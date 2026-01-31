import "dotenv/config";
import { postgresDb } from "./postgres";
import { oracleDb } from "./oracle";
import { mockDb } from "./mock";
import { IDatabase } from "../interfaces/IDatabase";

const DB_TYPE = process.env.DB_TYPE || "postgres"; // Default to postgres

let database: IDatabase;

if (DB_TYPE === "oracle") {
  database = oracleDb;
} else if (DB_TYPE === "mock") {
  database = mockDb;
} else if (DB_TYPE === "postgres") {
  database = postgresDb;
} else {
  throw new Error(
    `Unsupported database type: ${DB_TYPE}. Use 'postgres', 'oracle', or 'mock'`
  );
}

export const db = database;
